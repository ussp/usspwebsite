/**
 * Jira Quality Scanner — Analyzes Jira data to compute quality baselines automatically.
 *
 * Scans stories, bugs, tests, and documentation to produce quality metrics
 * without manual data entry. Based on:
 *   - QUS Framework (Lucassen et al., 2016) — story quality criteria
 *   - Six Sigma — First Pass Yield, Rework Rate
 *   - Capers Jones — Defect Removal Efficiency
 *   - ISO 25010 — Testability, Maintainability
 *
 * Connects to Jira REST API v3 + Agile API to analyze:
 *   - User story quality (description length, AC presence, structure)
 *   - Test coverage (linked test cases per story)
 *   - Documentation (linked Confluence pages)
 *   - Defect metrics (bugs per story, escape rate)
 *   - Rework (reopened stories, rejected stories)
 *   - Planning accuracy (committed vs delivered)
 */

import type { IntegrationConfig } from "./types.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StoryQualityResult {
  key: string;
  summary: string;
  qualityScore: number; // 0-5 composite score
  criteria: {
    hasDescription: boolean;
    descriptionLength: number;
    hasAcceptanceCriteria: boolean;
    acCount: number;
    hasRole: boolean; // "As a..." pattern
    hasMeans: boolean; // "I want to..." pattern
    hasEnds: boolean; // "So that..." pattern
    isAtomic: boolean; // single concern (heuristic: no "and" in means)
    isEstimated: boolean; // has story points
    hasLabels: boolean;
    hasEpicLink: boolean;
    wordCount: number;
  };
}

export interface QualityScanResult {
  scanDate: string;
  sprintsCovered: number;
  totalStories: number;
  totalBugs: number;

  // Story quality (QUS Framework — Lucassen et al. 2016)
  storyQuality: {
    avgScore: number; // 0-5 composite
    storiesWithAC: number;
    storiesWithACPct: number;
    avgACCount: number;
    storiesFollowingFormat: number; // As a/I want/So that
    storiesFollowingFormatPct: number;
    avgDescriptionWordCount: number;
    storiesWithEstimates: number;
    storiesWithEstimatesPct: number;
    details: StoryQualityResult[];
  };

  // Test coverage
  testCoverage: {
    storiesWithLinkedTests: number;
    storiesWithLinkedTestsPct: number;
    avgTestsPerStory: number;
    totalTestCases: number;
  };

  // Documentation
  documentation: {
    storiesWithLinkedDocs: number;
    storiesWithLinkedDocsPct: number;
    totalLinkedPages: number;
  };

  // Defects (Capers Jones DRE, Six Sigma)
  defects: {
    totalBugs: number;
    bugsPerStoryPoint: number; // defect density
    bugEscapeRate: number; // bugs found after sprint close / total
    avgBugResolutionDays: number;
  };

  // Rework (Six Sigma FPY)
  rework: {
    storiesReopened: number;
    storiesReopenedPct: number;
    storiesRejected: number; // moved back from review/QA
    storiesRejectedPct: number;
    firstPassYield: number; // % stories passing QA first time
    reworkPercentage: number; // rework items / total items
  };

  // Planning accuracy
  planning: {
    avgCommittedPoints: number;
    avgCompletedPoints: number;
    planningAccuracy: number; // completed/committed * 100
    estimationVariance: number; // std deviation of accuracy across sprints
  };
}

// ---------------------------------------------------------------------------
// Jira API types
// ---------------------------------------------------------------------------

interface JiraSearchResult {
  total: number;
  issues: JiraIssueDetail[];
}

interface JiraIssueDetail {
  key: string;
  fields: {
    issuetype: { name: string };
    summary: string;
    description: string | null; // plain text or ADF
    status: { name: string; statusCategory: { key: string } };
    assignee: { accountId: string } | null;
    labels: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  changelog?: {
    histories: {
      created: string;
      items: { field: string; fromString: string; toString: string }[];
    }[];
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getAuthHeaders(config: IntegrationConfig): Record<string, string> {
  const email = config.email || "user@example.com";
  return {
    Authorization: `Basic ${Buffer.from(`${email}:${config.apiToken}`).toString("base64")}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

function getStoryPoints(issue: JiraIssueDetail): number {
  const pointFields = ["story_points", "customfield_10016", "customfield_10028"];
  for (const field of pointFields) {
    if (issue.fields[field] !== undefined && issue.fields[field] !== null) {
      return Number(issue.fields[field]) || 0;
    }
  }
  return 0;
}

/**
 * Extract plain text from Jira description (handles both plain text and ADF format)
 */
function extractDescriptionText(desc: unknown): string {
  if (!desc) return "";
  if (typeof desc === "string") return desc;
  // Atlassian Document Format (ADF) — extract text recursively
  if (typeof desc === "object" && desc !== null) {
    const adf = desc as Record<string, unknown>;
    if (Array.isArray(adf.content)) {
      return adf.content.map((node: unknown) => extractDescriptionText(node)).join("\n");
    }
    if (typeof adf.text === "string") return adf.text;
    if (Array.isArray(adf.content)) {
      return (adf.content as unknown[]).map(extractDescriptionText).join("");
    }
  }
  return "";
}

/**
 * Score a story against QUS-inspired criteria (simplified for Jira data)
 * Returns 0-5 composite score
 */
function scoreStoryQuality(issue: JiraIssueDetail): StoryQualityResult {
  const descText = extractDescriptionText(issue.fields.description);
  const descLower = descText.toLowerCase();
  const summaryLower = issue.fields.summary.toLowerCase();
  const combined = `${summaryLower} ${descLower}`;
  const wordCount = descText.split(/\s+/).filter(Boolean).length;
  const points = getStoryPoints(issue);

  // QUS-inspired criteria checks
  const hasDescription = wordCount > 10;
  const hasAcceptanceCriteria =
    descLower.includes("acceptance criteria") ||
    descLower.includes("given") ||
    descLower.includes("when") ||
    descLower.includes("then") ||
    descLower.includes("ac:") ||
    descLower.includes("ac -") ||
    descLower.includes("criteria:");
  const acCount = hasAcceptanceCriteria
    ? (descText.match(/(?:^|\n)\s*[-*]\s/g) || []).length || 1
    : 0;
  const hasRole = /as a\s/i.test(combined) || /as an\s/i.test(combined);
  const hasMeans = /i want to\s/i.test(combined) || /i need to\s/i.test(combined) || /i can\s/i.test(combined);
  const hasEnds = /so that\s/i.test(combined) || /in order to\s/i.test(combined);
  const isAtomic = !/(,\s*and\s|;\s*and\s)/i.test(issue.fields.summary);
  const isEstimated = points > 0;
  const hasLabels = (issue.fields.labels || []).length > 0;
  const epicField = issue.fields.customfield_10014 || issue.fields.epic;
  const hasEpicLink = !!epicField;

  // Compute composite score (0-5, weighted)
  let score = 0;
  if (hasDescription) score += 0.5;
  if (wordCount > 30) score += 0.3;
  if (hasAcceptanceCriteria) score += 1.0;
  if (acCount >= 3) score += 0.5;
  if (hasRole) score += 0.4;
  if (hasMeans) score += 0.4;
  if (hasEnds) score += 0.3;
  if (isAtomic) score += 0.3;
  if (isEstimated) score += 0.5;
  if (hasEpicLink) score += 0.3;
  if (wordCount > 100) score += 0.3;
  if (hasLabels) score += 0.2;
  score = Math.min(score, 5.0);

  return {
    key: issue.key,
    summary: issue.fields.summary,
    qualityScore: Math.round(score * 10) / 10,
    criteria: {
      hasDescription,
      descriptionLength: descText.length,
      hasAcceptanceCriteria,
      acCount,
      hasRole,
      hasMeans,
      hasEnds,
      isAtomic,
      isEstimated,
      hasLabels,
      hasEpicLink,
      wordCount,
    },
  };
}

/**
 * Check if an issue was reopened by looking at status transitions
 */
function wasReopened(issue: JiraIssueDetail): boolean {
  if (!issue.changelog?.histories) return false;
  let wasDone = false;
  for (const h of issue.changelog.histories) {
    for (const item of h.items) {
      if (item.field === "status") {
        if (item.fromString?.toLowerCase().includes("done") || item.fromString?.toLowerCase().includes("closed")) {
          if (!item.toString?.toLowerCase().includes("done") && !item.toString?.toLowerCase().includes("closed")) {
            wasDone = true;
          }
        }
        if (item.toString?.toLowerCase().includes("done") || item.toString?.toLowerCase().includes("closed")) {
          // was marked done
        }
      }
    }
  }
  return wasDone;
}

/**
 * Check if a story was rejected/sent back from review or QA
 */
function wasRejected(issue: JiraIssueDetail): boolean {
  if (!issue.changelog?.histories) return false;
  for (const h of issue.changelog.histories) {
    for (const item of h.items) {
      if (item.field === "status") {
        const from = (item.fromString || "").toLowerCase();
        const to = (item.toString || "").toLowerCase();
        // Moved back from review/QA/testing to in-progress or to-do
        if (
          (from.includes("review") || from.includes("qa") || from.includes("testing") || from.includes("validation")) &&
          (to.includes("progress") || to.includes("to do") || to.includes("todo") || to.includes("open") || to.includes("development"))
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Main scanner
// ---------------------------------------------------------------------------

/**
 * Scan Jira project for quality metrics across recent sprints.
 * This is a read-only operation — does not modify any Jira data.
 */
export async function scanJiraQuality(
  config: IntegrationConfig,
  sprintCount: number = 3,
): Promise<{ data: QualityScanResult | null; error: string | null }> {
  const headers = getAuthHeaders(config);

  try {
    // 1. Fetch recent closed sprints
    const sprintRes = await fetch(
      `${config.baseUrl}/rest/agile/1.0/board/${config.boardId}/sprint?state=closed&maxResults=${sprintCount}`,
      { headers }
    );
    if (!sprintRes.ok) {
      return { data: null, error: `Failed to fetch sprints: ${sprintRes.status}` };
    }
    const sprintData = await sprintRes.json();
    const sprints = (sprintData.values || []) as { id: number; name: string; startDate?: string; endDate?: string }[];

    if (sprints.length === 0) {
      return { data: null, error: "No closed sprints found" };
    }

    // 2. Fetch all issues across those sprints (with changelog for rework detection)
    const allStories: JiraIssueDetail[] = [];
    const allBugs: JiraIssueDetail[] = [];
    const sprintStats: { committed: number; completed: number }[] = [];

    for (const sprint of sprints) {
      const issueRes = await fetch(
        `${config.baseUrl}/rest/agile/1.0/sprint/${sprint.id}/issue?maxResults=200&expand=changelog,renderedFields&fields=issuetype,summary,description,status,labels,story_points,customfield_10016,customfield_10028,customfield_10014,issuelinks`,
        { headers }
      );
      if (!issueRes.ok) continue;

      const issueData = (await issueRes.json()) as JiraSearchResult;
      let committedPts = 0;
      let completedPts = 0;

      for (const issue of issueData.issues) {
        const type = issue.fields.issuetype.name.toLowerCase();
        const pts = getStoryPoints(issue);
        const isDone = issue.fields.status.statusCategory.key === "done";

        committedPts += pts;
        if (isDone) completedPts += pts;

        if (type.includes("bug")) {
          allBugs.push(issue);
        } else if (type.includes("story") || type.includes("task") || type.includes("spike")) {
          allStories.push(issue);
        }
      }

      sprintStats.push({ committed: committedPts, completed: completedPts });
    }

    // 3. Score story quality
    const storyScores = allStories.map(scoreStoryQuality);
    const storiesWithAC = storyScores.filter((s) => s.criteria.hasAcceptanceCriteria).length;
    const storiesFollowing = storyScores.filter((s) => s.criteria.hasRole && s.criteria.hasMeans).length;
    const storiesEstimated = storyScores.filter((s) => s.criteria.isEstimated).length;

    // 4. Test coverage — check for linked test issues
    let storiesWithTests = 0;
    let totalTestLinks = 0;
    for (const issue of allStories) {
      const links = issue.fields.issuelinks || [];
      const testLinks = links.filter((l: Record<string, unknown>) => {
        const linkedType = ((l.type as Record<string, string>)?.name || "").toLowerCase();
        const linkedIssue = (l.outwardIssue || l.inwardIssue) as Record<string, unknown> | undefined;
        const linkedIssueType = ((linkedIssue?.fields as Record<string, unknown>)?.issuetype as Record<string, string>)?.name?.toLowerCase() || "";
        return linkedType.includes("test") || linkedIssueType.includes("test");
      });
      if (testLinks.length > 0) {
        storiesWithTests++;
        totalTestLinks += testLinks.length;
      }
    }

    // 5. Documentation — check for Confluence links
    let storiesWithDocs = 0;
    let totalDocLinks = 0;
    for (const issue of allStories) {
      const links = issue.fields.issuelinks || [];
      const descText = extractDescriptionText(issue.fields.description);
      const hasConfluenceLink = descText.includes("confluence") || descText.includes("/wiki/");
      const docLinks = links.filter((l: Record<string, unknown>) => {
        const linkedType = ((l.type as Record<string, string>)?.name || "").toLowerCase();
        return linkedType.includes("document") || linkedType.includes("wiki") || linkedType.includes("confluence");
      });
      if (docLinks.length > 0 || hasConfluenceLink) {
        storiesWithDocs++;
        totalDocLinks += docLinks.length + (hasConfluenceLink ? 1 : 0);
      }
    }

    // 6. Defect metrics
    const totalStoryPoints = allStories.reduce((sum, s) => sum + getStoryPoints(s), 0);
    const bugsPerSP = totalStoryPoints > 0 ? allBugs.length / totalStoryPoints : 0;

    // Bug resolution time
    let totalBugDays = 0;
    let bugsWithResolution = 0;
    for (const bug of allBugs) {
      if (!bug.changelog?.histories) continue;
      let createdDate: Date | null = null;
      let resolvedDate: Date | null = null;
      for (const h of bug.changelog.histories) {
        for (const item of h.items) {
          if (item.field === "status") {
            if (!createdDate) createdDate = new Date(h.created);
            if (item.toString.toLowerCase().includes("done") || item.toString.toLowerCase().includes("resolved")) {
              resolvedDate = new Date(h.created);
            }
          }
        }
      }
      if (createdDate && resolvedDate) {
        totalBugDays += (resolvedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
        bugsWithResolution++;
      }
    }

    // 7. Rework metrics
    const reopened = allStories.filter(wasReopened).length;
    const rejected = allStories.filter(wasRejected).length;
    const totalItems = allStories.length + allBugs.length;
    const firstPassYield = allStories.length > 0
      ? ((allStories.length - rejected) / allStories.length) * 100
      : 100;

    // 8. Planning accuracy
    const avgCommitted = sprintStats.length > 0
      ? sprintStats.reduce((s, sp) => s + sp.committed, 0) / sprintStats.length
      : 0;
    const avgCompleted = sprintStats.length > 0
      ? sprintStats.reduce((s, sp) => s + sp.completed, 0) / sprintStats.length
      : 0;
    const planningAccuracy = avgCommitted > 0 ? (avgCompleted / avgCommitted) * 100 : 0;

    // Estimation variance (std deviation of per-sprint accuracy)
    const sprintAccuracies = sprintStats
      .filter((sp) => sp.committed > 0)
      .map((sp) => (sp.completed / sp.committed) * 100);
    const avgAccuracy = sprintAccuracies.length > 0
      ? sprintAccuracies.reduce((s, a) => s + a, 0) / sprintAccuracies.length
      : 0;
    const variance = sprintAccuracies.length > 1
      ? Math.sqrt(sprintAccuracies.reduce((s, a) => s + Math.pow(a - avgAccuracy, 2), 0) / (sprintAccuracies.length - 1))
      : 0;

    const result: QualityScanResult = {
      scanDate: new Date().toISOString(),
      sprintsCovered: sprints.length,
      totalStories: allStories.length,
      totalBugs: allBugs.length,

      storyQuality: {
        avgScore: storyScores.length > 0
          ? Math.round((storyScores.reduce((s, r) => s + r.qualityScore, 0) / storyScores.length) * 10) / 10
          : 0,
        storiesWithAC,
        storiesWithACPct: allStories.length > 0 ? Math.round((storiesWithAC / allStories.length) * 100) : 0,
        avgACCount: storiesWithAC > 0
          ? Math.round((storyScores.reduce((s, r) => s + r.criteria.acCount, 0) / storiesWithAC) * 10) / 10
          : 0,
        storiesFollowingFormat: storiesFollowing,
        storiesFollowingFormatPct: allStories.length > 0 ? Math.round((storiesFollowing / allStories.length) * 100) : 0,
        avgDescriptionWordCount: allStories.length > 0
          ? Math.round(storyScores.reduce((s, r) => s + r.criteria.wordCount, 0) / allStories.length)
          : 0,
        storiesWithEstimates: storiesEstimated,
        storiesWithEstimatesPct: allStories.length > 0 ? Math.round((storiesEstimated / allStories.length) * 100) : 0,
        details: storyScores,
      },

      testCoverage: {
        storiesWithLinkedTests: storiesWithTests,
        storiesWithLinkedTestsPct: allStories.length > 0 ? Math.round((storiesWithTests / allStories.length) * 100) : 0,
        avgTestsPerStory: allStories.length > 0 ? Math.round((totalTestLinks / allStories.length) * 10) / 10 : 0,
        totalTestCases: totalTestLinks,
      },

      documentation: {
        storiesWithLinkedDocs: storiesWithDocs,
        storiesWithLinkedDocsPct: allStories.length > 0 ? Math.round((storiesWithDocs / allStories.length) * 100) : 0,
        totalLinkedPages: totalDocLinks,
      },

      defects: {
        totalBugs: allBugs.length,
        bugsPerStoryPoint: Math.round(bugsPerSP * 100) / 100,
        bugEscapeRate: totalItems > 0 ? Math.round((allBugs.length / totalItems) * 100) : 0,
        avgBugResolutionDays: bugsWithResolution > 0 ? Math.round((totalBugDays / bugsWithResolution) * 10) / 10 : 0,
      },

      rework: {
        storiesReopened: reopened,
        storiesReopenedPct: allStories.length > 0 ? Math.round((reopened / allStories.length) * 100) : 0,
        storiesRejected: rejected,
        storiesRejectedPct: allStories.length > 0 ? Math.round((rejected / allStories.length) * 100) : 0,
        firstPassYield: Math.round(firstPassYield * 10) / 10,
        reworkPercentage: totalItems > 0 ? Math.round(((reopened + rejected) / totalItems) * 100) : 0,
      },

      planning: {
        avgCommittedPoints: Math.round(avgCommitted * 10) / 10,
        avgCompletedPoints: Math.round(avgCompleted * 10) / 10,
        planningAccuracy: Math.round(planningAccuracy * 10) / 10,
        estimationVariance: Math.round(variance * 10) / 10,
      },
    };

    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: `Scan failed: ${err instanceof Error ? err.message : "Unknown error"}` };
  }
}
