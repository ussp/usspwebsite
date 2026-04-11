import type { LocationRequirement } from "../specs/demand-spec.js";

interface CandidateLocation {
  city?: string;
  state?: string;
  country?: string;
}

interface LocationMatchResult {
  score: number;       // 0-100
  explanation: string;
  workModeMatch: "exact" | "compatible" | "mismatch";
  geoMatch: "exact_city" | "same_state" | "same_metro" | "same_country" | "different" | "unknown";
}

// ── Metro area definitions ───────────────────────────────────────
// Maps cities to their metro areas for fuzzy geo matching

const METRO_AREAS: Record<string, string[]> = {
  "chicago": ["chicago", "evanston", "oak park", "naperville", "schaumburg", "aurora", "joliet", "elgin", "waukegan", "arlington heights", "skokie", "des plaines", "bolingbrook", "cicero", "berwyn", "oak lawn"],
  "new york": ["new york", "nyc", "manhattan", "brooklyn", "queens", "bronx", "staten island", "jersey city", "newark", "hoboken", "yonkers", "white plains", "stamford", "new haven"],
  "los angeles": ["los angeles", "la", "santa monica", "pasadena", "long beach", "glendale", "burbank", "inglewood", "torrance", "anaheim", "irvine", "costa mesa"],
  "san francisco": ["san francisco", "sf", "oakland", "berkeley", "san jose", "palo alto", "mountain view", "sunnyvale", "cupertino", "fremont", "redwood city", "menlo park", "santa clara"],
  "washington dc": ["washington", "washington dc", "dc", "arlington", "alexandria", "bethesda", "silver spring", "mclean", "tysons", "fairfax", "reston", "herndon", "rockville"],
  "boston": ["boston", "cambridge", "somerville", "quincy", "brookline", "newton", "waltham", "framingham", "worcester"],
  "dallas": ["dallas", "fort worth", "dfw", "plano", "irving", "arlington", "frisco", "mckinney", "richardson"],
  "houston": ["houston", "sugar land", "the woodlands", "katy", "pearland", "pasadena tx"],
  "seattle": ["seattle", "bellevue", "redmond", "kirkland", "tacoma", "everett", "renton"],
  "atlanta": ["atlanta", "marietta", "decatur", "sandy springs", "roswell", "alpharetta"],
  "denver": ["denver", "boulder", "aurora", "lakewood", "centennial", "broomfield", "westminster"],
  "phoenix": ["phoenix", "scottsdale", "tempe", "mesa", "chandler", "gilbert", "glendale az"],
  "philadelphia": ["philadelphia", "philly", "camden", "wilmington", "king of prussia", "cherry hill"],
  "miami": ["miami", "fort lauderdale", "west palm beach", "boca raton", "hollywood fl", "coral gables"],
  "detroit": ["detroit", "ann arbor", "dearborn", "troy", "southfield", "farmington hills"],
  "minneapolis": ["minneapolis", "st paul", "bloomington mn", "eden prairie", "plymouth mn"],
  "tampa": ["tampa", "st petersburg", "clearwater", "brandon", "lakeland"],
  "portland": ["portland", "beaverton", "hillsboro", "lake oswego", "tigard"],
  "austin": ["austin", "round rock", "cedar park", "pflugerville", "san marcos"],
  "nashville": ["nashville", "franklin tn", "murfreesboro", "brentwood tn"],
  "charlotte": ["charlotte", "raleigh", "durham", "chapel hill", "research triangle"],
  "springfield il": ["springfield", "springfield il"],
};

// State abbreviation mapping
const STATE_ABBREVS: Record<string, string> = {
  "al": "alabama", "ak": "alaska", "az": "arizona", "ar": "arkansas", "ca": "california",
  "co": "colorado", "ct": "connecticut", "de": "delaware", "fl": "florida", "ga": "georgia",
  "hi": "hawaii", "id": "idaho", "il": "illinois", "in": "indiana", "ia": "iowa",
  "ks": "kansas", "ky": "kentucky", "la": "louisiana", "me": "maine", "md": "maryland",
  "ma": "massachusetts", "mi": "michigan", "mn": "minnesota", "ms": "mississippi",
  "mo": "missouri", "mt": "montana", "ne": "nebraska", "nv": "nevada", "nh": "new hampshire",
  "nj": "new jersey", "nm": "new mexico", "ny": "new york", "nc": "north carolina",
  "nd": "north dakota", "oh": "ohio", "ok": "oklahoma", "or": "oregon", "pa": "pennsylvania",
  "ri": "rhode island", "sc": "south carolina", "sd": "south dakota", "tn": "tennessee",
  "tx": "texas", "ut": "utah", "vt": "vermont", "va": "virginia", "wa": "washington",
  "wv": "west virginia", "wi": "wisconsin", "wy": "wyoming", "dc": "district of columbia",
};

const STATE_FULL_TO_ABBREV: Record<string, string> = {};
for (const [abbrev, full] of Object.entries(STATE_ABBREVS)) {
  STATE_FULL_TO_ABBREV[full] = abbrev;
}

/**
 * Match candidate location against position location requirements.
 */
export function matchLocation(
  requirement: LocationRequirement | undefined,
  candidate: CandidateLocation | undefined,
  candidateWorkPref?: string,
): LocationMatchResult {
  // No location requirement = no penalty
  if (!requirement) {
    return { score: 100, explanation: "No location requirement", workModeMatch: "exact", geoMatch: "unknown" };
  }

  // ── Work mode matching ───────────────────────────────────────
  const workModeMatch = matchWorkMode(requirement.workMode, candidateWorkPref);

  // If remote, geography mostly doesn't matter
  if (requirement.workMode === "remote") {
    if (workModeMatch === "exact" || workModeMatch === "compatible") {
      return { score: 95, explanation: "Remote position — location flexible", workModeMatch, geoMatch: "unknown" };
    }
    // Candidate only wants onsite but position is remote — slight mismatch but not blocking
    return { score: 80, explanation: "Remote position; candidate prefers onsite", workModeMatch, geoMatch: "unknown" };
  }

  // No candidate location info — can't verify
  if (!candidate || (!candidate.city && !candidate.state && !candidate.country)) {
    const baseScore = workModeMatch === "mismatch" ? 30 : 50;
    return { score: baseScore, explanation: "Candidate location unknown", workModeMatch, geoMatch: "unknown" };
  }

  // ── Geographic matching ──────────────────────────────────────
  const geoMatch = matchGeography(requirement, candidate);

  // Combine work mode and geo scores
  let score: number;
  let explanation: string;

  if (geoMatch === "exact_city") {
    score = workModeMatch === "mismatch" ? 70 : 100;
    explanation = "Exact city match";
  } else if (geoMatch === "same_metro") {
    score = workModeMatch === "mismatch" ? 65 : 90;
    explanation = "Same metro area";
  } else if (geoMatch === "same_state") {
    if (requirement.workMode === "hybrid") {
      score = workModeMatch === "mismatch" ? 50 : 70;
      explanation = "Same state (hybrid may require commute)";
    } else {
      // Onsite — same state but different city is harder
      score = workModeMatch === "mismatch" ? 35 : 55;
      explanation = "Same state but different city (onsite role)";
    }
  } else if (geoMatch === "same_country") {
    if (requirement.workMode === "hybrid") {
      score = requirement.relocationOk ? 50 : 35;
      explanation = requirement.relocationOk
        ? "Different state (relocation considered)"
        : "Different state for hybrid role";
    } else {
      score = requirement.relocationOk ? 40 : 20;
      explanation = requirement.relocationOk
        ? "Different state (relocation considered)"
        : "Different state for onsite role";
    }
  } else {
    score = requirement.relocationOk ? 25 : 10;
    explanation = "Different country / unknown geography";
  }

  // Work mode mismatch penalty (remote already returned early above)
  if (workModeMatch === "mismatch") {
    explanation += "; work mode mismatch";
  }

  return { score, explanation, workModeMatch, geoMatch };
}

function matchWorkMode(required: string, candidatePref?: string): "exact" | "compatible" | "mismatch" {
  if (!candidatePref) return "compatible"; // Unknown = assume flexible

  if (required === candidatePref) return "exact";

  // Compatible combinations
  if (required === "hybrid" && (candidatePref === "onsite" || candidatePref === "open_to_travel")) return "compatible";
  if (required === "onsite" && (candidatePref === "hybrid" || candidatePref === "open_to_travel")) return "compatible";
  if (required === "remote" && candidatePref === "hybrid") return "compatible";
  if (candidatePref === "open_to_travel") return "compatible";

  // Remote candidate for onsite role = mismatch
  if (required === "onsite" && candidatePref === "remote") return "mismatch";
  if (required === "hybrid" && candidatePref === "remote") return "mismatch";

  return "compatible";
}

function matchGeography(
  req: LocationRequirement,
  candidate: CandidateLocation,
): "exact_city" | "same_metro" | "same_state" | "same_country" | "different" {
  const reqCity = normalize(req.city);
  const reqState = normalizeState(req.state);
  const reqCountry = normalize(req.country);
  const candCity = normalize(candidate.city);
  const candState = normalizeState(candidate.state);
  const candCountry = normalize(candidate.country);

  // Exact city match
  if (reqCity && candCity && reqCity === candCity) {
    return "exact_city";
  }

  // Metro area match
  if (reqCity && candCity) {
    for (const [, cities] of Object.entries(METRO_AREAS)) {
      if (cities.includes(reqCity) && cities.includes(candCity)) {
        return "same_metro";
      }
    }
  }

  // Same state
  if (reqState && candState && reqState === candState) {
    return "same_state";
  }

  // Same country
  if (reqCountry && candCountry && reqCountry === candCountry) {
    return "same_country";
  }

  // If both are in the US (inferred from state), same country
  if (reqState && candState) {
    return "same_country";
  }

  return "different";
}

function normalize(s?: string): string | undefined {
  return s?.trim().toLowerCase() || undefined;
}

function normalizeState(s?: string): string | undefined {
  if (!s) return undefined;
  const lower = s.trim().toLowerCase();
  // If it's an abbreviation, expand it
  if (STATE_ABBREVS[lower]) return lower;
  // If it's a full name, abbreviate it
  if (STATE_FULL_TO_ABBREV[lower]) return STATE_FULL_TO_ABBREV[lower];
  return lower;
}
