/**
 * Run USSPPL + Fleetronix vs AIS 140 Demand through the Phase 2 pipeline.
 *
 * Pipeline:
 *   1. Combine USSPPL + Fleetronix capabilities into a consortium spec
 *   2. Match consortium vs AIS 140 DemandSpec using government-rfp profile
 *   3. Attach bid/no-bid Recommendation with remediation paths
 *
 * Usage:
 *   cd packages/openspecmatch
 *   npx tsx examples/fleettronix-rfp/run-match.ts > ../../projects/rfp/Fleettronix_VLTD_AIS140/extracted/10-match-output.json
 *   npx tsx examples/fleettronix-rfp/run-match.ts --report > ../../projects/rfp/Fleettronix_VLTD_AIS140/extracted/10-match-report.md
 */

import { OpenSpecMatchEngine } from "../../src/engine/index.js";
import type { RemediationLookup } from "../../src/engine/recommender.js";
import { AIS140_DEMAND } from "../../src/__tests__/fixtures/fleettronix/ais140-demand.js";
import { USSPPL_FLEETRONIX_CAPABILITY } from "../../src/__tests__/fixtures/fleettronix/ussppl-fleetronix-capability.js";

const engine = new OpenSpecMatchEngine();

// Remediation lookup — tells the recommender which blockers have a known
// closure path. Pulled from `09-fleetronix-gap-analysis.md` Part 2.
const remediation: RemediationLookup = {
  "cmp-001": { description: "Engage ARAI or iCAT for AIS 140 Type Approval certification cycle.", estimatedEffortWeeks: 12, ownerHint: "Anuradha" },
  "cmp-002": { description: "Annual COP testing cadence — engage certifying agency after TAC.", estimatedEffortWeeks: 4, ownerHint: "Anuradha" },
  "cmp-003": { description: "Engage CERT-IN empanelled auditor for backend assessment + remediation cycle.", estimatedEffortWeeks: 10, ownerHint: "Anurag Kotha" },
  "cmp-004": { description: "Procure wildcard SSL + enforce HTTPS; verify with external scan.", estimatedEffortWeeks: 1, ownerHint: "Anurag Kotha" },
  "cmp-005": { description: "Migrate to MapmyIndia or SoI-compliant tile source; verify Survey of India licensing.", estimatedEffortWeeks: 4, ownerHint: "Anuradha" },
  "inf-001": { description: "Port backend to NIC Cloud; engage NIC empanelment process.", estimatedEffortWeeks: 8, ownerHint: "Anurag Kotha" },
  "inf-002": { description: "Build VAHAN integration layer using NIC-published APIs; test against sandbox.", estimatedEffortWeeks: 6, ownerHint: "Anurag Kotha" },
  "inf-003": { description: "Engage AP Police / ERSS team; configure IP + SMS gateway per Gazette clauses (j)(k).", estimatedEffortWeeks: 4, ownerHint: "Veena" },
  "inf-004": { description: "Map existing Fleetronix tracking software to AIS 140 feature checklist; close gaps.", estimatedEffortWeeks: 4, ownerHint: "Anuradha" },
  "inf-005": { description: "Already in product (4.5 Lakh+ trips tracked); formalise AIS 140 feature-parity documentation.", estimatedEffortWeeks: 2, ownerHint: "Anuradha" },
  "inf-007": { description: "Already in product; document AIS 140 geo-fence alert pairing.", estimatedEffortWeeks: 1, ownerHint: "Anuradha" },
  "inf-008": { description: "Already in product; map speed-violation alert taxonomy to AIS 140.", estimatedEffortWeeks: 1, ownerHint: "Anuradha" },
  "inf-009": { description: "Already in product; document tampering alert paths to AIS 140 spec.", estimatedEffortWeeks: 1, ownerHint: "Anuradha" },
  "inf-010": { description: "Already in product; document health-monitoring cadence to AIS 140 spec.", estimatedEffortWeeks: 1, ownerHint: "Anuradha" },
  "inf-012": { description: "Already in product (cellular m2m); document SIM lifecycle + KYC path.", estimatedEffortWeeks: 1, ownerHint: "Anuradha" },
  "inf-013": { description: "Already in product (mobile app); customise for AP operations users.", estimatedEffortWeeks: 2, ownerHint: "Anuradha" },
  "inf-014": { description: "Already in product (Control Tower); rebrand / customise for AP Transport Dept.", estimatedEffortWeeks: 2, ownerHint: "Anuradha" },
  "inf-015": { description: "Configure storage tiers to 3mo online / 2yr alerts / 2yr archive per AIS 140.", estimatedEffortWeeks: 2, ownerHint: "Anurag Kotha" },
  "inf-020": { description: "Build vehicle-owner self-service portal (preferred, not mandatory).", estimatedEffortWeeks: 3, ownerHint: "Anuradha" },
  "inf-022": { description: "Implement interstate message exchange API (preferred, not mandatory).", estimatedEffortWeeks: 3, ownerHint: "Anurag Kotha" },
  "man-002": { description: "Telugu helpdesk covered by Hyderabad ops staff (native speakers).", estimatedEffortWeeks: 0, ownerHint: "Veena" },
  "man-006": { description: "Engage state PMC or use National PMU (DIMTS) per scheme — commercial decision.", estimatedEffortWeeks: 2, ownerHint: "Veena" },
  "fin-001": { description: "20.35 Cr project capacity — confirm USSPPL + Fleetronix combined capex/opex plan.", estimatedEffortWeeks: 2, ownerHint: "USSPPL finance" },
  "fin-002": { description: "Model milestone-based cashflow against Nirbhaya 80/20 release pattern.", estimatedEffortWeeks: 2, ownerHint: "USSPPL finance" },
  "pp-001": { description: "Limited direct Govt MC reference; lead pitch on Fortune 500 scale + AP ports.", estimatedEffortWeeks: 0, ownerHint: "Veena" },
  "pp-002": { description: "Limited direct PSV reference; reposition cargo telematics as PSV-transferable stack.", estimatedEffortWeeks: 1, ownerHint: "Veena" },
  "pp-003": { description: "No AIS 140 device history today; pairs with TAC remediation above.", estimatedEffortWeeks: 0, ownerHint: "Anuradha" },
  "pp-005": { description: "Covered — 7,000+ devices deployed.", estimatedEffortWeeks: 0, ownerHint: "Anuradha" },
  "inf-006": { description: "Extend panic routing to emit dual-destination (ERSS + Fleetronix Control Tower).", estimatedEffortWeeks: 2, ownerHint: "Anuradha" },
  "inf-011": { description: "Procure/integrate SMS gateway with failover; configure for emergency dispatch.", estimatedEffortWeeks: 2, ownerHint: "Anuradha" },
  "inf-016": { description: "Add emergency-tagged retention policy to storage tier; confirm 'never delete' flag.", estimatedEffortWeeks: 1, ownerHint: "Anurag Kotha" },
  "inf-017": { description: "Build multi-stakeholder RBAC layer (RTO / permit-holder / VLT-mfr / testing-agency).", estimatedEffortWeeks: 4, ownerHint: "Anurag Kotha" },
  "inf-018": { description: "Implement MoRTH Data Sharing API endpoints per AIS 140 spec.", estimatedEffortWeeks: 3, ownerHint: "Anurag Kotha" },
  "inf-019": { description: "Procure physical MC equipment (video wall, UPS, desktops) — AP-local AV vendor.", estimatedEffortWeeks: 4, ownerHint: "USSPPL ops" },
  "inf-021": { description: "Build Govt-style report pack (device install, uptime, alerts, fleet summary).", estimatedEffortWeeks: 3, ownerHint: "Anuradha" },
  "man-001": { description: "Stand up AP-dedicated 24x7 helpdesk with Telugu/Hindi/English coverage.", estimatedEffortWeeks: 6, ownerHint: "Veena" },
  "man-003": { description: "Hire and train MC 24x7 operations staff (3 shifts).", estimatedEffortWeeks: 8, ownerHint: "Veena" },
  "man-004": { description: "Build training curriculum for Transport Dept / RTO officials.", estimatedEffortWeeks: 4, ownerHint: "Veena" },
  "man-005": { description: "Coordinate with AP Transport Dept on PIU + nodal officer appointment (state obligation).", estimatedEffortWeeks: 2, ownerHint: "Veena" },
  "man-007": { description: "Allocate dedicated 2-year O&M squad within bid commercials.", estimatedEffortWeeks: 2, ownerHint: "Veena" },
  "fin-003": { description: "Secure PBG line from bank (3-10% of ~20.35 Cr ~= 60L-2Cr).", estimatedEffortWeeks: 3, ownerHint: "USSPPL finance" },
  "fin-004": { description: "Arrange EMD via bank FD or BG per tender requirement.", estimatedEffortWeeks: 2, ownerHint: "USSPPL finance" },
  "geo-001": { description: "Already covered — USSPPL Bowenpally + Fleetronix Gachibowli are in Hyderabad; establish AP branch presence (Vijayawada) within 60 days.", estimatedEffortWeeks: 8, ownerHint: "Veena + USSPPL ops" },
};

// Step 1: consortium capability
const consortium = engine.combineCapabilities(
  [USSPPL_FLEETRONIX_CAPABILITY],
  {
    combinedId: "consortium-ussppl-fleetronix-2026",
    combinedName: "USSPPL + Fleetronix (consortium)",
  },
);

// Step 2 + 3: match + recommend
const result = engine.matchRFP(AIS140_DEMAND, consortium, {
  profileId: "government-rfp",
  recommender: { remediation, goThreshold: 70 },
});

const mode = process.argv.includes("--report") ? "report" : "json";

if (mode === "json") {
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

// ── Human-readable Markdown report ─────────────────────────────────

const out: string[] = [];
const rec = result.recommendation!;

out.push("# USSPPL + Fleetronix vs AIS 140 Nirbhaya MC (AP) — Phase 2 Match Report");
out.push("");
out.push(`**Engine:** OpenSpecMatch v${result.engineVersion}  `);
out.push(`**Profile:** \`${result.profileId}\`  `);
out.push(`**Demand:** ${AIS140_DEMAND.title}  `);
out.push(`**Capability:** ${USSPPL_FLEETRONIX_CAPABILITY.name} (via Combinator)  `);
out.push(`**Computed:** ${result.computedAt}`);
out.push("");

out.push("## Verdict");
out.push("");
out.push("| Field | Value |");
out.push("|---|---|");
out.push(`| **Verdict** | **${rec.verdict}** |`);
out.push(`| Rationale | ${rec.rationale} |`);
out.push(`| Overall score | ${result.overallScore} / 100 |`);
out.push(`| Confidence | ${result.confidence} / 100 |`);
out.push(`| Mandatory gate passed | ${result.passedMandatoryGate ? "✅ YES" : "❌ NO"} |`);
out.push(`| Blockers | ${rec.blockers.length} |`);
out.push(`| Remediation plans | ${rec.remediation.length} |`);
out.push("");

out.push("## Category Breakdown");
out.push("");
out.push("| Category | Score | Weight | Items | Matched |");
out.push("|---|---|---|---|---|");
for (const [cat, cs] of Object.entries(result.categoryScores)) {
  out.push(`| ${cat} | ${cs.score} | ${cs.weight} | ${cs.itemCount} | ${cs.matchedCount} |`);
}
out.push("");

out.push("## Blockers (must close or remediate before RFP response)");
out.push("");
out.push("| ID | Category | Criticality | Score | Requirement |");
out.push("|---|---|---|---|---|");
for (const b of rec.blockers) {
  out.push(`| ${b.demandItemId} | ${b.category} | ${b.criticality} | ${b.score} | ${b.rawText} |`);
}
out.push("");

out.push("## Remediation Plan");
out.push("");
out.push("| Blocker ID | Weeks | Owner | Plan |");
out.push("|---|---|---|---|");
for (const r of rec.remediation) {
  out.push(`| ${r.demandItemId} | ${r.estimatedEffortWeeks ?? "?"} | ${r.ownerHint ?? "TBD"} | ${r.description} |`);
}
out.push("");

const unremediated = rec.blockers.filter(
  (b) => !rec.remediation.some((r) => r.demandItemId === b.demandItemId),
);
if (unremediated.length > 0) {
  out.push("## Unremediated Blockers");
  out.push("");
  out.push("These have no remediation path declared. Either add one to the lookup or accept them as NO_GO contributors.");
  out.push("");
  out.push("| ID | Category | Requirement |");
  out.push("|---|---|---|");
  for (const b of unremediated) {
    out.push(`| ${b.demandItemId} | ${b.category} | ${b.rawText} |`);
  }
  out.push("");
}

out.push("## ✅ Strengths (scored >= 70)");
out.push("");
out.push("| ID | Category | Demand | Score |");
out.push("|---|---|---|---|");
for (const s of result.strengths) {
  out.push(`| ${s.demandItemId} | ${s.category} | ${s.rawText} | ${s.score} |`);
}
out.push("");

if (result.unknowns.length > 0) {
  out.push("## ❓ Unknowns (no matching capability)");
  out.push("");
  out.push("| ID | Category | Demand |");
  out.push("|---|---|---|");
  for (const u of result.unknowns) {
    out.push(`| ${u.demandItemId} | ${u.category} | ${u.rawText} |`);
  }
  out.push("");
}

out.push("## All Item-level Matches");
out.push("");
out.push("| Demand ID | Score | Tax | Level | Evidence | Recency |");
out.push("|---|---|---|---|---|---|");
for (const m of result.itemMatches) {
  const b = m.scoreBreakdown;
  out.push(`| ${m.demandItemId} | ${m.score} | ${b.taxonomyMatch} | ${b.levelFit} | ${b.evidenceStrength} | ${b.recency} |`);
}
out.push("");

out.push("## Notes");
out.push("");
out.push("- **This run uses `matchRFP()` with the Phase 2 `government-rfp` profile** and the new infrastructure + financial + manpower taxonomy trees. Text-similarity fallback still applies where `taxonomyRef` is null (hand-authored fixtures), but resolution improves wherever phrases hit a taxonomy alias.");
out.push("- **Verdict logic:** passing gate + score >= 70 = GO. Otherwise, if every mandatory blocker has remediation = GO_WITH_REMEDIATION. Unremediated mandatory = NO_GO.");
out.push("- **Next step:** run the LLM RFP + Company extractors (Phase 2b — deferred) to replace the hand-authored fixtures with extractor-produced specs.");
out.push("");

console.log(out.join("\n"));
