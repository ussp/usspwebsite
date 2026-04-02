import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole } from "@ussp-platform/core/types/admin";
import * as cheerio from "cheerio";

interface ParsedPosition {
  title: string | null;
  location: string | null;
  type: string | null;
  work_mode: string | null;
  description: string | null;
  salary_range: string | null;
  bill_rate: string | null;
}

const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  CONTRACTOR: "Contract",
  INTERN: "Internship",
  INTERNSHIP: "Internship",
  TEMPORARY: "Contract",
};

function extractJobId(url: string): string | null {
  const match = url.match(/linkedin\.com\/jobs\/(?:view|search)\/.*?(\d{8,})/);
  if (match) return match[1];
  // Try currentJobId query param
  const urlObj = new URL(url);
  const currentJobId = urlObj.searchParams.get("currentJobId");
  return currentJobId;
}

function htmlToText(html: string): string {
  const $ = cheerio.load(html);
  // Convert structural elements to line breaks before stripping
  $("br").replaceWith("\n");
  $("p").each((_, el) => {
    $(el).prepend("\n\n");
  });
  $("li").each((_, el) => {
    $(el).prepend("\n- ");
  });
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    $(el).prepend("\n\n**");
    $(el).append("**");
  });
  return $.text()
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function mapEmploymentType(raw: string | undefined): string | null {
  if (!raw) return null;
  return EMPLOYMENT_TYPE_MAP[raw.toUpperCase().replace(/[\s-]/g, "_")] || null;
}

function detectWorkMode(text: string): string | null {
  const lower = text.toLowerCase();
  if (/\bhybrid\b/.test(lower)) return "Hybrid";
  if (/\bremote\b/.test(lower) && !/\bnon-?remote\b/.test(lower)) return "Remote";
  if (/\bon-?site\b/.test(lower) || /\bin-?office\b/.test(lower)) return "On-site";
  return null;
}

function detectEmploymentType(text: string): string | null {
  const lower = text.toLowerCase();
  if (/\bfull[- ]?time\b/.test(lower)) return "Full-time";
  if (/\bpart[- ]?time\b/.test(lower)) return "Part-time";
  if (/\bcontract\b/.test(lower)) return "Contract";
  if (/\binternship\b|\bintern\b/.test(lower)) return "Internship";
  return null;
}

function detectSalary(text: string): string | null {
  // Match patterns like $80,000 - $120,000, $80k-$120k, $75/hr
  const rangeMatch = text.match(
    /\$[\d,]+(?:k|K)?\s*(?:-|to|–)\s*\$[\d,]+(?:k|K)?(?:\s*\/\s*(?:hr|hour|yr|year))?/
  );
  if (rangeMatch) return rangeMatch[0];
  const singleMatch = text.match(/\$[\d,]+(?:k|K)?(?:\s*\/\s*(?:hr|hour|yr|year))?/);
  if (singleMatch) return singleMatch[0];
  return null;
}

function parseFromJsonLd(jsonLd: Record<string, unknown>): ParsedPosition {
  const title = (jsonLd.title as string) || null;
  const location =
    (jsonLd.jobLocation as Record<string, unknown>)?.address
      ? formatAddress(
          (jsonLd.jobLocation as Record<string, Record<string, string>>)?.address
        )
      : null;

  const employmentType = Array.isArray(jsonLd.employmentType)
    ? mapEmploymentType(jsonLd.employmentType[0])
    : mapEmploymentType(jsonLd.employmentType as string);

  const jobLocationType = jsonLd.jobLocationType as string | undefined;
  const work_mode = jobLocationType === "TELECOMMUTE" ? "Remote" : null;

  let description: string | null = null;
  if (jsonLd.description) {
    description = htmlToText(jsonLd.description as string);
  }

  let salary_range: string | null = null;
  const baseSalary = jsonLd.baseSalary as Record<string, unknown> | undefined;
  if (baseSalary?.value) {
    const val = baseSalary.value as Record<string, unknown>;
    const currency = (baseSalary.currency as string) || "$";
    const symbol = currency === "USD" ? "$" : currency;
    if (val.minValue && val.maxValue) {
      salary_range = `${symbol}${val.minValue}-${symbol}${val.maxValue}`;
    } else if (val.value) {
      salary_range = `${symbol}${val.value}`;
    }
  }

  return {
    title,
    location,
    type: employmentType,
    work_mode,
    description,
    salary_range,
    bill_rate: null,
  };
}

function formatAddress(
  address: Record<string, string> | undefined
): string | null {
  if (!address) return null;
  const parts = [
    address.addressLocality,
    address.addressRegion,
    address.addressCountry,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

function parseFromHtml(html: string): ParsedPosition {
  const $ = cheerio.load(html);

  const title =
    $(".top-card-layout__title").first().text().trim() ||
    $(".topcard__title").first().text().trim() ||
    $("h1").first().text().trim() ||
    null;

  const location =
    $(".topcard__flavor--bullet").first().text().trim() ||
    $(".top-card-layout__bullet").first().text().trim() ||
    null;

  const descriptionEl =
    $(".show-more-less-html__markup").first().html() ||
    $(".description__text").first().html();
  const description = descriptionEl ? htmlToText(descriptionEl) : null;

  const fullText = $.text();
  const type = detectEmploymentType(fullText);
  const work_mode = detectWorkMode(fullText);
  const salary_range = detectSalary(fullText);

  return { title, location, type, work_mode, description, salary_range, bill_rate: null };
}

function parseFromText(text: string): ParsedPosition {
  const lines = text.split("\n").map((l) => l.trim());
  const firstNonEmpty = lines.find((l) => l.length > 0) || null;

  // Try to find labeled title
  let title: string | null = null;
  for (const line of lines) {
    const m = line.match(/^(?:job\s*title|position|role)\s*[:\-]\s*(.+)/i);
    if (m) {
      title = m[1].trim();
      break;
    }
  }
  if (!title) title = firstNonEmpty;

  // Location
  let location: string | null = null;
  for (const line of lines) {
    const m = line.match(/^location\s*[:\-]\s*(.+)/i);
    if (m) {
      location = m[1].trim();
      break;
    }
  }
  if (!location) {
    // Try to find city, state pattern
    for (const line of lines) {
      if (/\b[A-Z][a-z]+,\s*[A-Z]{2}\b/.test(line) && line.length < 100) {
        location = line;
        break;
      }
    }
  }

  const type = detectEmploymentType(text);
  const work_mode = detectWorkMode(text);
  const salary_range = detectSalary(text);

  return {
    title,
    location,
    type,
    work_mode,
    description: text,
    salary_range,
    bill_rate: null,
  };
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "positions.create")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  // Text-based parsing (fallback mode)
  if (body.text && typeof body.text === "string") {
    const parsed = parseFromText(body.text);
    return NextResponse.json({ success: true, data: parsed });
  }

  // URL-based parsing
  if (!body.url || typeof body.url !== "string") {
    return NextResponse.json(
      { success: false, error: "invalid_url" },
      { status: 400 }
    );
  }

  const jobId = extractJobId(body.url);
  if (!jobId) {
    return NextResponse.json(
      { success: false, error: "invalid_url" },
      { status: 400 }
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`https://www.linkedin.com/jobs/view/${jobId}/`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ success: false, error: "fetch_failed" });
    }

    const html = await res.text();

    // Check if we got a login wall
    if (
      html.includes("authwall") ||
      html.includes("login?") ||
      (html.includes("Sign in") && !html.includes("JobPosting"))
    ) {
      return NextResponse.json({ success: false, error: "fetch_failed" });
    }

    // Try JSON-LD first
    const $ = cheerio.load(html);
    let parsed: ParsedPosition | null = null;

    const ldScripts = $('script[type="application/ld+json"]');
    for (let i = 0; i < ldScripts.length; i++) {
      try {
        const data = JSON.parse($(ldScripts[i]).text());
        if (data["@type"] === "JobPosting") {
          parsed = parseFromJsonLd(data);
          break;
        }
      } catch {
        // skip invalid JSON-LD
      }
    }

    // Fall back to HTML parsing
    if (!parsed || !parsed.title) {
      parsed = parseFromHtml(html);
    }

    // Detect work_mode from description if not found
    if (!parsed.work_mode && parsed.description) {
      parsed.work_mode = detectWorkMode(parsed.description);
    }

    if (!parsed.title) {
      return NextResponse.json({ success: false, error: "parse_error" });
    }

    return NextResponse.json({ success: true, data: parsed });
  } catch {
    return NextResponse.json({ success: false, error: "fetch_failed" });
  }
}
