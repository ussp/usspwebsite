// ── Stopwords ────────────────────────────────────────────────────────
// Common English stopwords to exclude from tokenised text.

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "up", "about", "into", "over", "after",
  "is", "am", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "having",
  "do", "does", "did", "doing",
  "will", "would", "shall", "should", "may", "might", "must", "can", "could",
  "not", "no", "nor",
  "it", "its", "this", "that", "these", "those",
  "i", "me", "my", "we", "us", "our",
  "you", "your", "he", "him", "his", "she", "her",
  "they", "them", "their",
  "what", "which", "who", "whom", "where", "when", "how", "why",
  "all", "each", "every", "both", "few", "more", "most", "other",
  "some", "such", "than", "too", "very",
  "as", "if", "so", "also", "just", "then",
]);

// ── Tokenize ─────────────────────────────────────────────────────────

/**
 * Tokenize a text string into an array of lowercase words, stripping
 * non-alphanumeric characters and removing common stopwords.
 */
export function tokenize(text: string): string[] {
  if (!text) return [];

  return text
    .toLowerCase()
    .split(/[^a-z0-9#+.]+/)       // keep # (C#), + (C++), . (Node.js)
    .map((t) => t.replace(/^[.]+|[.]+$/g, "")) // strip leading/trailing dots
    .filter((t) => t.length > 0 && !STOPWORDS.has(t));
}

// ── Jaccard Similarity ───────────────────────────────────────────────

/**
 * Compute the Jaccard similarity coefficient between two sets.
 * Returns a value between 0 (no overlap) and 1 (identical sets).
 */
export function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 1;
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersectionSize = 0;
  // Iterate over the smaller set for efficiency
  const [smaller, larger] = setA.size <= setB.size ? [setA, setB] : [setB, setA];
  for (const item of smaller) {
    if (larger.has(item)) {
      intersectionSize++;
    }
  }

  const unionSize = setA.size + setB.size - intersectionSize;
  return unionSize === 0 ? 0 : intersectionSize / unionSize;
}

// ── Levenshtein Distance ─────────────────────────────────────────────

/**
 * Compute the Levenshtein edit distance between two strings.
 * Uses the classic dynamic-programming approach with O(min(m,n)) space.
 */
function levenshteinDistance(a: string, b: string): number {
  // Ensure a is the shorter string (for space efficiency)
  if (a.length > b.length) {
    [a, b] = [b, a];
  }

  const aLen = a.length;
  const bLen = b.length;

  // Trivial cases
  if (aLen === 0) return bLen;

  // prev and curr rows of the DP matrix
  let prev = new Array<number>(aLen + 1);
  let curr = new Array<number>(aLen + 1);

  // Initialise the first row
  for (let i = 0; i <= aLen; i++) {
    prev[i] = i;
  }

  for (let j = 1; j <= bLen; j++) {
    curr[0] = j;
    for (let i = 1; i <= aLen; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[i] = Math.min(
        prev[i] + 1,       // deletion
        curr[i - 1] + 1,   // insertion
        prev[i - 1] + cost  // substitution
      );
    }
    // Swap rows
    [prev, curr] = [curr, prev];
  }

  return prev[aLen];
}

// ── Fuzzy Match ──────────────────────────────────────────────────────

/**
 * Determine whether two strings are "fuzzy similar" based on a
 * normalised Levenshtein distance threshold.
 *
 * @param a         First string
 * @param b         Second string
 * @param threshold Maximum normalised distance (0-1) to consider a match.
 *                  Default is 0.3 (strings that are 70%+ similar).
 */
export function fuzzyMatch(a: string, b: string, threshold: number = 0.3): boolean {
  const aLower = a.toLowerCase().trim();
  const bLower = b.toLowerCase().trim();

  // Exact match shortcut
  if (aLower === bLower) return true;

  const maxLen = Math.max(aLower.length, bLower.length);
  if (maxLen === 0) return true;

  const distance = levenshteinDistance(aLower, bLower);
  const normalisedDistance = distance / maxLen;

  return normalisedDistance <= threshold;
}
