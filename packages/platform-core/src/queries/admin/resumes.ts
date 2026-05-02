import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type { AdminResume, CreateResumeInput } from "../../types/admin.js";

// pdf-parse loaded lazily on first use. The require is hidden from bundler
// static analysis (via indirect eval) so client-component bundles that reach
// this module through the platform-core barrel don't try to bundle pdf-parse,
// which uses Node's fs and cannot resolve in a browser bundle.
let _pdfParse: ((buffer: Buffer) => Promise<{ text: string }>) | null | undefined = undefined;

async function getPdfParse(): Promise<((buffer: Buffer) => Promise<{ text: string }>) | null> {
  if (_pdfParse !== undefined) return _pdfParse;
  try {
    const indirectRequire = (0, eval)("require") as NodeRequire;
    _pdfParse = indirectRequire("pdf-parse") as (buffer: Buffer) => Promise<{ text: string }>;
  } catch {
    _pdfParse = null;
  }
  return _pdfParse;
}

const RESUME_COLUMNS =
  "id, site_id, candidate_id, storage_path, file_name, file_type, position_id, is_primary, extracted_text, extracted_skills, extracted_experience_years, extracted_education, extraction_status, extraction_error, uploaded_at";

export async function getResumesByCandidateId(
  candidateId: string
): Promise<AdminResume[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("resumes")
    .select(RESUME_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("candidate_id", candidateId)
    .order("uploaded_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function getResumeById(
  id: string
): Promise<AdminResume | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("resumes")
    .select(RESUME_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getLatestResume(
  candidateId: string
): Promise<AdminResume | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("resumes")
    .select(RESUME_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("candidate_id", candidateId)
    .order("uploaded_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data;
}

export async function createResume(
  input: CreateResumeInput
): Promise<{ success: boolean; resume?: AdminResume; error?: string }> {
  const supabase = getServiceClient();

  // Determine file type from name
  const ext = input.file_name.split(".").pop()?.toLowerCase() || null;

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      site_id: getSiteId(),
      candidate_id: input.candidate_id,
      storage_path: input.storage_path,
      file_name: input.file_name,
      file_type: input.file_type || ext,
      position_id: input.position_id || null,
      is_primary: input.is_primary ?? false,
    })
    .select(RESUME_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, resume: data };
}

export async function setPrimaryResume(
  candidateId: string,
  resumeId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const siteId = getSiteId();

  // Unset all primary flags for this candidate
  await supabase
    .from("resumes")
    .update({ is_primary: false })
    .eq("site_id", siteId)
    .eq("candidate_id", candidateId);

  // Set the target resume as primary
  const { error } = await supabase
    .from("resumes")
    .update({ is_primary: true })
    .eq("site_id", siteId)
    .eq("id", resumeId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getLatestResumesByCandidateIds(
  candidateIds: string[]
): Promise<Map<string, AdminResume>> {
  if (candidateIds.length === 0) return new Map();

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("resumes")
    .select(RESUME_COLUMNS)
    .eq("site_id", getSiteId())
    .in("candidate_id", candidateIds)
    .order("uploaded_at", { ascending: false });

  if (error || !data) return new Map();

  // Pick the most recent resume per candidate
  const map = new Map<string, AdminResume>();
  for (const row of data) {
    if (!map.has(row.candidate_id)) {
      map.set(row.candidate_id, row);
    }
  }
  return map;
}

export async function updateResumeExtraction(
  id: string,
  extraction: {
    extracted_text?: string;
    extracted_skills?: string[];
    extracted_experience_years?: number;
    extracted_education?: Array<{ degree: string; institution: string; year?: number }>;
    extraction_status: string;
    extraction_error?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("resumes")
    .update(extraction)
    .eq("site_id", getSiteId())
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Resume Text Extraction on Upload ──────────────────────────────

/**
 * Download a resume from storage, extract text, and store in the resumes table.
 * Called automatically when a new application is submitted with a resume.
 * This is a non-blocking operation — failures are logged but don't affect the application.
 */
export async function extractAndStoreResume(input: {
  candidateId: string;
  storagePath: string;
  fileName: string;
}): Promise<{ success: boolean; resumeId?: string; error?: string }> {
  const supabase = getServiceClient();
  const siteId = getSiteId();

  try {
    // 1. Download the file from storage
    const { data: fileData, error: downloadErr } = await supabase.storage
      .from("resumes")
      .download(input.storagePath);

    if (downloadErr || !fileData) {
      console.error(`[resume-extraction] Download failed for ${input.storagePath}:`, downloadErr?.message);
      return { success: false, error: downloadErr?.message || "Download failed" };
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    const ext = input.fileName.toLowerCase().split(".").pop() || "";

    // 2. Extract text based on file type
    let text = "";
    const pdfParser = await getPdfParse();
    if (ext === "pdf" && pdfParser) {
      const result = await pdfParser(buffer);
      text = result.text || "";
    } else if (ext === "docx") {
      // DOCX: extract text from XML <w:t> tags
      const str = buffer.toString("utf-8");
      const parts: string[] = [];
      const pattern = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
      let m;
      while ((m = pattern.exec(str)) !== null) parts.push(m[1]);
      text = parts.join(" ").replace(/\s+/g, " ").trim();
    } else if (ext === "pdf" && !pdfParser) {
      console.warn("[resume-extraction] pdf-parse not installed — skipping PDF extraction");
      return { success: false, error: "pdf-parse not installed" };
    }

    if (text.length < 30) {
      console.warn(`[resume-extraction] Too little text extracted (${text.length} chars) from ${input.fileName}`);
      return { success: false, error: "Insufficient text extracted" };
    }

    // 3. Create resume record with extracted text
    const { data: resume, error: insertErr } = await supabase
      .from("resumes")
      .insert({
        site_id: siteId,
        candidate_id: input.candidateId,
        storage_path: input.storagePath,
        file_name: input.fileName,
        file_type: ext,
        is_primary: true,
        extracted_text: text,
        extracted_skills: [],
        extracted_experience_years: null,
        extracted_education: [],
        extraction_status: "completed",
        uploaded_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertErr) {
      console.error(`[resume-extraction] Insert failed for ${input.candidateId}:`, insertErr.message);
      return { success: false, error: insertErr.message };
    }

    console.log(`[resume-extraction] ✓ ${input.fileName} → ${text.length} chars stored (resume ${resume.id})`);
    return { success: true, resumeId: resume.id };
  } catch (err: any) {
    console.error(`[resume-extraction] Error for ${input.fileName}:`, err.message);
    return { success: false, error: err.message };
  }
}
