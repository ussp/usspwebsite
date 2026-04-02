import type {
  DimensionScorer,
  CandidateMatchData,
  PositionMatchData,
  DimensionResult,
  MatchDimension,
} from "../types.js";
import { normalizeSkill, areSkillsSimilar } from "../utils/skill-synonyms.js";

// ═══════════════════════════════════════════════════════════════════════
// Helper: build a DimensionResult with sensible defaults
// ═══════════════════════════════════════════════════════════════════════

function result(
  dimension: MatchDimension,
  score: number,
  matchedItems: string[] = [],
  missingItems: string[] = [],
  notes: string | null = null
): DimensionResult {
  return {
    dimension,
    score: Math.min(100, Math.max(0, Math.round(score))),
    weight: 0,          // filled by the engine
    weightedScore: 0,    // filled by the engine
    matchedItems,
    missingItems,
    notes,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// 1. Skills Scorer
// ═══════════════════════════════════════════════════════════════════════

class SkillsScorer implements DimensionScorer {
  readonly name: MatchDimension = "skills";

  score(candidate: CandidateMatchData, position: PositionMatchData): DimensionResult {
    const required = position.requiredSkills ?? [];
    const preferred = position.preferredSkills ?? [];

    if (required.length === 0 && preferred.length === 0) {
      return result(this.name, 50, [], [], "No data: position has no skills listed");
    }

    const candidateNormalized = (candidate.skills ?? []).map(normalizeSkill);
    const matchedItems: string[] = [];
    const missingItems: string[] = [];

    // Check required skills (count double)
    let requiredMatched = 0;
    for (const req of required) {
      const reqNorm = normalizeSkill(req);
      const found = candidateNormalized.some(
        (cs) => cs === reqNorm || areSkillsSimilar(cs, req)
      );
      if (found) {
        requiredMatched++;
        matchedItems.push(req);
      } else {
        missingItems.push(req);
      }
    }

    // Check preferred skills
    let preferredMatched = 0;
    for (const pref of preferred) {
      const prefNorm = normalizeSkill(pref);
      const found = candidateNormalized.some(
        (cs) => cs === prefNorm || areSkillsSimilar(cs, pref)
      );
      if (found) {
        preferredMatched++;
        if (!matchedItems.includes(pref)) {
          matchedItems.push(pref);
        }
      }
    }

    // Required skills count double in the total
    const requiredWeight = 2;
    const preferredWeight = 1;
    const totalPossible =
      required.length * requiredWeight + preferred.length * preferredWeight;
    const totalEarned =
      requiredMatched * requiredWeight + preferredMatched * preferredWeight;

    const score = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 50;

    const notes =
      `Required: ${requiredMatched}/${required.length}, ` +
      `Preferred: ${preferredMatched}/${preferred.length}`;

    return result(this.name, score, matchedItems, missingItems, notes);
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 2. Experience Scorer
// ═══════════════════════════════════════════════════════════════════════

class ExperienceScorer implements DimensionScorer {
  readonly name: MatchDimension = "experience_level";

  score(candidate: CandidateMatchData, position: PositionMatchData): DimensionResult {
    const candidateYears = candidate.experienceYears;
    const minYears = position.minExperienceYears;
    const maxYears = position.maxExperienceYears;

    if (candidateYears == null) {
      return result(this.name, 50, [], [], "No data: candidate experience unknown");
    }

    if (minYears == null && maxYears == null) {
      return result(
        this.name,
        50,
        [`${candidateYears} years experience`],
        [],
        "No data: position has no experience requirement"
      );
    }

    const effectiveMin = minYears ?? 0;

    // Candidate meets or exceeds minimum
    if (candidateYears >= effectiveMin) {
      // Check if they exceed the max (overqualified but still a match)
      if (maxYears != null && candidateYears > maxYears) {
        return result(
          this.name,
          85,
          [`${candidateYears} years (exceeds ${maxYears} year max)`],
          [],
          "Candidate may be overqualified"
        );
      }
      return result(
        this.name,
        100,
        [`${candidateYears} years (meets ${effectiveMin}+ requirement)`],
        [],
        null
      );
    }

    // Within 2 years below the minimum
    const gap = effectiveMin - candidateYears;
    if (gap <= 2) {
      return result(
        this.name,
        60,
        [`${candidateYears} years experience`],
        [`${gap} year(s) below ${effectiveMin} year minimum`],
        `${gap} year(s) short of minimum`
      );
    }

    // More than 2 years below: proportional score
    const proportional = Math.max(0, (candidateYears / effectiveMin) * 60);
    return result(
      this.name,
      proportional,
      [`${candidateYears} years experience`],
      [`${gap} year(s) below ${effectiveMin} year minimum`],
      `Significantly below minimum experience`
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 3. Location Scorer
// ═══════════════════════════════════════════════════════════════════════

class LocationScorer implements DimensionScorer {
  readonly name: MatchDimension = "location";

  score(candidate: CandidateMatchData, position: PositionMatchData): DimensionResult {
    const workMode = (position.workMode ?? "").toLowerCase();
    const pref = (candidate.workPreference ?? "").toLowerCase();

    // Remote positions always match
    if (workMode === "remote") {
      return result(this.name, 100, ["Remote position"], [], "Remote — location irrelevant");
    }

    // Candidate wants remote only but position is onsite/hybrid
    if (pref === "remote" && workMode !== "remote") {
      return result(
        this.name,
        20,
        [],
        ["Candidate prefers remote only"],
        `Candidate wants remote — position is ${workMode || "on-site"}`
      );
    }

    const candidateLoc = (candidate.location ?? "").toLowerCase().trim();
    const positionLoc = (position.location ?? "").toLowerCase().trim();

    // Candidate is open to travel — boost for hybrid/onsite even without location match
    if (pref === "open_to_travel") {
      if (!candidateLoc || !positionLoc) {
        return result(
          this.name,
          80,
          ["Open to travel"],
          [],
          "Candidate is open to travel — location flexible"
        );
      }
    }

    if (!candidateLoc || !positionLoc) {
      return result(this.name, 50, [], [], "No data: location information missing");
    }

    // Parse city and state from common formats like "Chicago, IL" or "Chicago, Illinois"
    const candidateParts = this.parseParts(candidateLoc);
    const positionParts = this.parseParts(positionLoc);

    // Exact or city-level match
    if (
      candidateLoc.includes(positionParts.city) ||
      positionLoc.includes(candidateParts.city)
    ) {
      return result(
        this.name,
        100,
        [`Location match: ${candidate.location}`],
        [],
        null
      );
    }

    // State-level match
    if (
      candidateParts.state &&
      positionParts.state &&
      candidateParts.state === positionParts.state
    ) {
      return result(
        this.name,
        70,
        [`Same state: ${candidateParts.state.toUpperCase()}`],
        [`Different city than ${position.location}`],
        "Same state, different city"
      );
    }

    // Open to travel gets partial credit even for different locations
    if (pref === "open_to_travel") {
      return result(
        this.name,
        60,
        ["Open to travel"],
        [`Different location: ${candidate.location ?? "unknown"} vs ${position.location}`],
        "Candidate is open to travel — different location"
      );
    }

    // Hybrid positions get partial credit for same state or nearby
    if (workMode === "hybrid") {
      return result(
        this.name,
        30,
        [],
        [`Location mismatch: ${candidate.location ?? "unknown"} vs ${position.location}`],
        "Hybrid role — candidate not near office"
      );
    }

    // On-site, no match
    return result(
      this.name,
      30,
      [],
      [`Location mismatch: ${candidate.location ?? "unknown"} vs ${position.location}`],
      "Different location"
    );
  }

  private parseParts(loc: string): { city: string; state: string } {
    // US state abbreviations
    const stateAbbreviations: Record<string, string> = {
      al: "al", alabama: "al", ak: "ak", alaska: "ak", az: "az", arizona: "az",
      ar: "ar", arkansas: "ar", ca: "ca", california: "ca", co: "co", colorado: "co",
      ct: "ct", connecticut: "ct", de: "de", delaware: "de", fl: "fl", florida: "fl",
      ga: "ga", georgia: "ga", hi: "hi", hawaii: "hi", id: "id", idaho: "id",
      il: "il", illinois: "il", in: "in", indiana: "in", ia: "ia", iowa: "ia",
      ks: "ks", kansas: "ks", ky: "ky", kentucky: "ky", la: "la", louisiana: "la",
      me: "me", maine: "me", md: "md", maryland: "md", ma: "ma", massachusetts: "ma",
      mi: "mi", michigan: "mi", mn: "mn", minnesota: "mn", ms: "ms", mississippi: "ms",
      mo: "mo", missouri: "mo", mt: "mt", montana: "mt", ne: "ne", nebraska: "ne",
      nv: "nv", nevada: "nv", nh: "nh", "new hampshire": "nh", nj: "nj", "new jersey": "nj",
      nm: "nm", "new mexico": "nm", ny: "ny", "new york": "ny", nc: "nc",
      "north carolina": "nc", nd: "nd", "north dakota": "nd", oh: "oh", ohio: "oh",
      ok: "ok", oklahoma: "ok", or: "or", oregon: "or", pa: "pa", pennsylvania: "pa",
      ri: "ri", "rhode island": "ri", sc: "sc", "south carolina": "sc", sd: "sd",
      "south dakota": "sd", tn: "tn", tennessee: "tn", tx: "tx", texas: "tx",
      ut: "ut", utah: "ut", vt: "vt", vermont: "vt", va: "va", virginia: "va",
      wa: "wa", washington: "wa", wv: "wv", "west virginia": "wv", wi: "wi",
      wisconsin: "wi", wy: "wy", wyoming: "wy", dc: "dc", "washington dc": "dc",
    };

    // Try "City, State" format
    const parts = loc.split(",").map((p) => p.trim());
    const city = parts[0] ?? loc;
    let state = "";

    if (parts.length >= 2) {
      const stateRaw = parts[parts.length - 1].replace(/[^a-z\s]/g, "").trim();
      state = stateAbbreviations[stateRaw] ?? stateRaw;
    }

    return { city, state };
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 4. Education Scorer
// ═══════════════════════════════════════════════════════════════════════

const EDUCATION_ORDINAL: Record<string, number> = {
  phd: 4,
  doctorate: 4,
  "doctor of philosophy": 4,
  doctoral: 4,
  masters: 3,
  master: 3,
  "master's": 3,
  mba: 3,
  ms: 3,
  ma: 3,
  msc: 3,
  bachelors: 2,
  bachelor: 2,
  "bachelor's": 2,
  bs: 2,
  ba: 2,
  bsc: 2,
  btech: 2,
  "b.tech": 2,
  be: 2,
  "b.e": 2,
  associate: 1,
  "associate's": 1,
  associates: 1,
  aa: 1,
  as: 1,
};

function getEducationLevel(text: string): number {
  const lower = text.toLowerCase().trim();

  // Direct match
  if (EDUCATION_ORDINAL[lower] !== undefined) {
    return EDUCATION_ORDINAL[lower];
  }

  // Partial match — look for keywords within the string
  if (lower.includes("phd") || lower.includes("doctor")) return 4;
  if (lower.includes("master") || lower.includes("mba") || lower.includes("m.s")) return 3;
  if (lower.includes("bachelor") || lower.includes("b.s") || lower.includes("b.tech") || lower.includes("b.e")) return 2;
  if (lower.includes("associate")) return 1;

  return 0; // unknown
}

class EducationScorer implements DimensionScorer {
  readonly name: MatchDimension = "education";

  score(candidate: CandidateMatchData, position: PositionMatchData): DimensionResult {
    const requiredLevel = position.educationLevel;

    if (!requiredLevel) {
      return result(this.name, 50, [], [], "No data: position has no education requirement");
    }

    const requiredOrdinal = getEducationLevel(requiredLevel);

    if (requiredOrdinal === 0) {
      return result(this.name, 50, [], [], "No data: could not parse education requirement");
    }

    // Find the highest education level from the candidate
    const educationEntries = candidate.education ?? [];

    if (educationEntries.length === 0) {
      return result(this.name, 50, [], [`${requiredLevel} required`], "No data: candidate education unknown");
    }

    let maxCandidateOrdinal = 0;
    let bestDegree = "";
    for (const edu of educationEntries) {
      const level = getEducationLevel(edu.degree);
      if (level > maxCandidateOrdinal) {
        maxCandidateOrdinal = level;
        bestDegree = edu.degree;
      }
    }

    if (maxCandidateOrdinal === 0) {
      return result(
        this.name,
        50,
        [],
        [`${requiredLevel} required`],
        "No data: could not parse candidate education level"
      );
    }

    const diff = maxCandidateOrdinal - requiredOrdinal;

    if (diff >= 0) {
      return result(
        this.name,
        100,
        [`${bestDegree} meets/exceeds ${requiredLevel} requirement`],
        [],
        diff > 0 ? "Candidate exceeds education requirement" : null
      );
    }

    if (diff === -1) {
      return result(
        this.name,
        70,
        [`${bestDegree}`],
        [`One level below ${requiredLevel}`],
        "One education level below requirement"
      );
    }

    return result(
      this.name,
      40,
      [`${bestDegree}`],
      [`Significantly below ${requiredLevel}`],
      "More than one education level below requirement"
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 5. Certifications Scorer
// ═══════════════════════════════════════════════════════════════════════

class CertificationsScorer implements DimensionScorer {
  readonly name: MatchDimension = "certifications";

  score(candidate: CandidateMatchData, position: PositionMatchData): DimensionResult {
    const required = position.requiredCertifications ?? [];

    if (required.length === 0) {
      return result(this.name, 50, [], [], "No data: position has no certification requirements");
    }

    // Candidates may list certifications in their skills or education
    // We build a set of normalised candidate tokens from skills + education fields
    const candidateTokens = new Set<string>();

    for (const skill of candidate.skills ?? []) {
      candidateTokens.add(normalizeSkill(skill));
      // Also add the raw lowercase for exact substring matching
      candidateTokens.add(skill.toLowerCase().trim());
    }

    for (const edu of candidate.education ?? []) {
      candidateTokens.add(edu.degree.toLowerCase().trim());
      candidateTokens.add(edu.institution.toLowerCase().trim());
    }

    // Also tokenize resume text if available for broader matching
    if (candidate.resumeText) {
      const words = candidate.resumeText.toLowerCase();
      for (const cert of required) {
        // Check if the full cert name appears in the resume text
        if (words.includes(cert.toLowerCase())) {
          candidateTokens.add(cert.toLowerCase());
        }
      }
    }

    const matchedItems: string[] = [];
    const missingItems: string[] = [];

    for (const cert of required) {
      const certLower = cert.toLowerCase().trim();
      const certNorm = normalizeSkill(cert);

      const found =
        candidateTokens.has(certLower) ||
        candidateTokens.has(certNorm) ||
        // Check if any candidate token contains the cert name or vice versa
        Array.from(candidateTokens).some(
          (t) => t.includes(certLower) || certLower.includes(t)
        );

      if (found) {
        matchedItems.push(cert);
      } else {
        missingItems.push(cert);
      }
    }

    const score = required.length > 0
      ? (matchedItems.length / required.length) * 100
      : 50;

    return result(
      this.name,
      score,
      matchedItems,
      missingItems,
      `${matchedItems.length}/${required.length} certifications matched`
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 6. Recency Scorer
// ═══════════════════════════════════════════════════════════════════════

class RecencyScorer implements DimensionScorer {
  readonly name: MatchDimension = "resume_recency";

  score(candidate: CandidateMatchData): DimensionResult {
    const uploadedAt = candidate.resumeUploadedAt;

    if (!uploadedAt) {
      return result(this.name, 20, [], [], "No data: resume upload date unknown");
    }

    const uploadDate = new Date(uploadedAt);
    const now = new Date();
    const daysSinceUpload = Math.floor(
      (now.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceUpload < 0) {
      // Future date — treat as very recent
      return result(this.name, 100, ["Resume just uploaded"], [], null);
    }

    let score: number;
    let note: string;

    if (daysSinceUpload <= 30) {
      score = 100;
      note = `Resume uploaded ${daysSinceUpload} day(s) ago`;
    } else if (daysSinceUpload <= 90) {
      score = 80;
      note = `Resume uploaded ${daysSinceUpload} days ago (within 3 months)`;
    } else if (daysSinceUpload <= 180) {
      score = 60;
      note = `Resume uploaded ${daysSinceUpload} days ago (within 6 months)`;
    } else if (daysSinceUpload <= 365) {
      score = 40;
      note = `Resume uploaded ${daysSinceUpload} days ago (within 1 year)`;
    } else {
      score = 20;
      note = `Resume uploaded ${daysSinceUpload} days ago (over 1 year old)`;
    }

    return result(
      this.name,
      score,
      [`Uploaded ${daysSinceUpload} day(s) ago`],
      [],
      note
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 7. Availability Scorer
// ═══════════════════════════════════════════════════════════════════════

class AvailabilityScorer implements DimensionScorer {
  readonly name: MatchDimension = "availability";

  score(candidate: CandidateMatchData): DimensionResult {
    const availStr = candidate.availabilityDate;

    if (!availStr) {
      return result(this.name, 70, [], [], "No data: availability date not specified (assuming available)");
    }

    const availDate = new Date(availStr);
    const now = new Date();
    const daysUntilAvailable = Math.floor(
      (availDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Already available or available within 2 weeks
    if (daysUntilAvailable <= 14) {
      return result(
        this.name,
        100,
        [daysUntilAvailable <= 0 ? "Available now" : `Available in ${daysUntilAvailable} days`],
        [],
        null
      );
    }

    // Within 30 days
    if (daysUntilAvailable <= 30) {
      return result(
        this.name,
        80,
        [`Available in ${daysUntilAvailable} days`],
        [],
        "Available within 30 days"
      );
    }

    // Within 60 days
    if (daysUntilAvailable <= 60) {
      return result(
        this.name,
        60,
        [`Available in ${daysUntilAvailable} days`],
        ["Not immediately available"],
        "Available within 60 days"
      );
    }

    // Further out
    return result(
      this.name,
      40,
      [],
      [`Not available for ${daysUntilAvailable} days`],
      `Available in ${daysUntilAvailable} days (over 60 days out)`
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 8. Rate Compatibility Scorer
// ═══════════════════════════════════════════════════════════════════════

/**
 * Parse a numeric rate from a string. Handles common formats:
 * "$100", "$100/hr", "100", "$100,000", "$50-$70", "50-70/hr", etc.
 * For ranges (e.g., "$50-$70"), returns the midpoint.
 */
function parseRate(rateStr: string | null): number | null {
  if (!rateStr) return null;

  const cleaned = rateStr.replace(/[$,]/g, "").trim().toLowerCase();
  if (!cleaned) return null;

  // Try range format: "50-70", "50 - 70", "50 to 70"
  const rangeMatch = cleaned.match(
    /(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)/
  );
  if (rangeMatch) {
    const low = parseFloat(rangeMatch[1]);
    const high = parseFloat(rangeMatch[2]);
    if (!isNaN(low) && !isNaN(high)) {
      return (low + high) / 2;
    }
  }

  // Try single number
  const numMatch = cleaned.match(/(\d+(?:\.\d+)?)/);
  if (numMatch) {
    const val = parseFloat(numMatch[1]);
    if (!isNaN(val)) return val;
  }

  return null;
}

class RateCompatibilityScorer implements DimensionScorer {
  readonly name: MatchDimension = "rate_compatibility";

  score(candidate: CandidateMatchData, position: PositionMatchData): DimensionResult {
    const candidateRate = parseRate(candidate.expectedBillRate);
    const positionRate = parseRate(position.salaryRange);

    if (candidateRate == null && positionRate == null) {
      return result(this.name, 70, [], [], "No data: neither rate nor salary range specified");
    }

    if (candidateRate == null) {
      return result(this.name, 70, [], [], "No data: candidate rate not specified");
    }

    if (positionRate == null) {
      return result(
        this.name,
        70,
        [`Candidate rate: $${candidateRate}`],
        [],
        "No data: position salary range not specified"
      );
    }

    // Parse the high end of position range for comparison
    const positionCleaned = (position.salaryRange ?? "").replace(/[$,]/g, "").trim().toLowerCase();
    const posRangeMatch = positionCleaned.match(
      /(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)/
    );

    let posHigh = positionRate;
    let posLow = positionRate;
    if (posRangeMatch) {
      posLow = parseFloat(posRangeMatch[1]);
      posHigh = parseFloat(posRangeMatch[2]);
    }

    // Candidate rate is within the position range
    if (candidateRate >= posLow && candidateRate <= posHigh) {
      return result(
        this.name,
        100,
        [`Rate $${candidateRate} within range $${posLow}-$${posHigh}`],
        [],
        null
      );
    }

    // Candidate rate is below the range (budget-friendly)
    if (candidateRate < posLow) {
      return result(
        this.name,
        100,
        [`Rate $${candidateRate} below range $${posLow}-$${posHigh} (budget friendly)`],
        [],
        "Candidate rate is below budget — favorable"
      );
    }

    // Candidate rate exceeds the range — check by how much
    const overagePercent = ((candidateRate - posHigh) / posHigh) * 100;

    if (overagePercent <= 20) {
      return result(
        this.name,
        60,
        [`Rate $${candidateRate}`],
        [`${overagePercent.toFixed(0)}% above max $${posHigh}`],
        `Rate is ${overagePercent.toFixed(0)}% above budget (within 20%)`
      );
    }

    return result(
      this.name,
      30,
      [`Rate $${candidateRate}`],
      [`${overagePercent.toFixed(0)}% above max $${posHigh}`],
      `Rate is ${overagePercent.toFixed(0)}% above budget (over 20%)`
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// Export all scorers
// ═══════════════════════════════════════════════════════════════════════

export const ruleBasedScorers: DimensionScorer[] = [
  new SkillsScorer(),
  new ExperienceScorer(),
  new LocationScorer(),
  new EducationScorer(),
  new CertificationsScorer(),
  new RecencyScorer(),
  new AvailabilityScorer(),
  new RateCompatibilityScorer(),
];
