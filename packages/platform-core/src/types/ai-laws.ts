/**
 * US State AI Laws & Federal Regulations Database
 *
 * Static catalog of AI-related legislation that may affect
 * AI tool adoption in organizations. Used by the Readiness Assessment
 * to flag applicable regulations based on state.
 *
 * Each law includes a URL to the actual law text so assessors
 * can read the source material.
 */

export interface AILaw {
  id: string;
  jurisdiction: string;         // State name or "Federal"
  jurisdiction_code: string;    // State code (e.g., "IL") or "US"
  law_name: string;
  short_name: string;           // Abbreviated name
  effective_date: string;       // ISO date or "Proposed"
  status: "active" | "effective_2026" | "effective_2027" | "proposed" | "enacted";
  summary: string;              // One-line summary
  ai_training_impact: string;   // What this means for AI training specifically
  url: string;                  // Link to actual law text
  tags: ("employment" | "privacy" | "transparency" | "government" | "bias" | "procurement")[];
}

export const AI_LAW_CATALOG: AILaw[] = [
  // === ILLINOIS ===
  {
    id: "il-aivi",
    jurisdiction: "Illinois",
    jurisdiction_code: "IL",
    law_name: "Artificial Intelligence Video Interview Act (AIVI)",
    short_name: "IL AIVI Act",
    effective_date: "2020-01-01",
    status: "active",
    summary: "Requires consent and disclosure when AI is used to analyze video interviews for hiring decisions.",
    ai_training_impact: "If training includes AI-assisted hiring tools, teams must understand consent and disclosure requirements for video analysis.",
    url: "https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=4015",
    tags: ["employment", "transparency", "bias"],
  },
  {
    id: "il-bipa",
    jurisdiction: "Illinois",
    jurisdiction_code: "IL",
    law_name: "Biometric Information Privacy Act (BIPA)",
    short_name: "IL BIPA",
    effective_date: "2008-10-03",
    status: "active",
    summary: "Strictest US biometric privacy law. Requires informed consent before collecting biometric data (facial recognition, fingerprints).",
    ai_training_impact: "AI tools that use facial recognition, voice analysis, or biometric data require explicit consent and a published data retention policy.",
    url: "https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=3004",
    tags: ["privacy", "bias"],
  },
  // === COLORADO ===
  {
    id: "co-ai-act",
    jurisdiction: "Colorado",
    jurisdiction_code: "CO",
    law_name: "Colorado Artificial Intelligence Act (SB 24-205)",
    short_name: "CO AI Act",
    effective_date: "2026-02-01",
    status: "effective_2026",
    summary: "Requires developers and deployers of high-risk AI systems to use reasonable care to avoid algorithmic discrimination.",
    ai_training_impact: "Organizations deploying AI in consequential decisions (hiring, lending, insurance) must conduct impact assessments and maintain documentation.",
    url: "https://leg.colorado.gov/bills/sb24-205",
    tags: ["bias", "transparency", "employment"],
  },
  // === NEW YORK CITY ===
  {
    id: "nyc-ll144",
    jurisdiction: "New York City",
    jurisdiction_code: "NY",
    law_name: "NYC Local Law 144 (Automated Employment Decision Tools)",
    short_name: "NYC LL 144",
    effective_date: "2023-07-05",
    status: "active",
    summary: "Requires bias audits for automated tools used in hiring and promotion decisions in NYC.",
    ai_training_impact: "Any AI tool used in employment decisions must undergo an independent bias audit annually. Results must be publicly posted.",
    url: "https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page",
    tags: ["employment", "bias", "transparency"],
  },
  // === CALIFORNIA ===
  {
    id: "ca-ccpa-ai",
    jurisdiction: "California",
    jurisdiction_code: "CA",
    law_name: "California Consumer Privacy Act / California Privacy Rights Act (CCPA/CPRA)",
    short_name: "CA CCPA/CPRA",
    effective_date: "2023-01-01",
    status: "active",
    summary: "Grants consumers rights over personal data used in automated decision-making, including the right to opt out of profiling.",
    ai_training_impact: "AI tools processing California residents' data must provide opt-out mechanisms for automated profiling. Privacy impact assessments required.",
    url: "https://oag.ca.gov/privacy/ccpa",
    tags: ["privacy", "transparency"],
  },
  {
    id: "ca-sb1047",
    jurisdiction: "California",
    jurisdiction_code: "CA",
    law_name: "Safe and Secure Innovation for Frontier Artificial Intelligence Models Act (SB 1047)",
    short_name: "CA SB 1047",
    effective_date: "2025-01-01",
    status: "active",
    summary: "Requires safety evaluations for large AI models above a compute threshold. Mandates kill switches and incident reporting.",
    ai_training_impact: "Primarily affects AI model developers, not end-user organizations. But organizations should be aware of the safety standards their AI vendors must meet.",
    url: "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240SB1047",
    tags: ["transparency", "government"],
  },
  // === TEXAS ===
  {
    id: "tx-taia",
    jurisdiction: "Texas",
    jurisdiction_code: "TX",
    law_name: "Texas Responsible AI Governance Act (TRAIGA / HB 1709)",
    short_name: "TX AI Act",
    effective_date: "2025-09-01",
    status: "active",
    summary: "Requires deployers of high-risk AI systems to conduct impact assessments and provide notice to affected individuals.",
    ai_training_impact: "Organizations using AI in high-risk contexts must document AI system capabilities, limitations, and conduct regular impact assessments.",
    url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=HB1709",
    tags: ["transparency", "bias", "employment"],
  },
  // === VIRGINIA ===
  {
    id: "va-cdpa",
    jurisdiction: "Virginia",
    jurisdiction_code: "VA",
    law_name: "Virginia Consumer Data Protection Act (VCDPA)",
    short_name: "VA VCDPA",
    effective_date: "2023-01-01",
    status: "active",
    summary: "Requires data protection assessments for processing personal data for profiling that presents risk of harm.",
    ai_training_impact: "AI tools that profile consumers or employees require data protection impact assessments. Consumers can opt out of profiling.",
    url: "https://law.lis.virginia.gov/vacodefull/title59.1/chapter53/",
    tags: ["privacy", "bias"],
  },
  // === CONNECTICUT ===
  {
    id: "ct-ai-act",
    jurisdiction: "Connecticut",
    jurisdiction_code: "CT",
    law_name: "Connecticut AI Act (SB 2)",
    short_name: "CT AI Act",
    effective_date: "2026-02-01",
    status: "effective_2026",
    summary: "Requires risk assessments for high-risk AI systems and disclosure when AI is used in consequential decisions.",
    ai_training_impact: "Deployers must conduct risk assessments, provide AI-use disclosures, and enable human appeal for AI-driven decisions.",
    url: "https://www.cga.ct.gov/asp/cgabillstatus/cgabillstatus.asp?selBillType=Bill&which_year=2025&bill_num=SB2",
    tags: ["transparency", "bias", "employment"],
  },
  // === FEDERAL ===
  {
    id: "us-nist-rmf",
    jurisdiction: "Federal",
    jurisdiction_code: "US",
    law_name: "NIST AI Risk Management Framework (AI RMF 1.0)",
    short_name: "NIST AI RMF",
    effective_date: "2023-01-26",
    status: "active",
    summary: "Voluntary framework for managing AI risks. Covers governance, mapping, measurement, and management of AI systems.",
    ai_training_impact: "The gold standard reference for AI governance. Organizations should align their AI policy with NIST AI RMF categories: Govern, Map, Measure, Manage.",
    url: "https://www.nist.gov/artificial-intelligence/executive-order-safe-secure-and-trustworthy-artificial-intelligence",
    tags: ["government", "transparency"],
  },
  {
    id: "us-eo-14110",
    jurisdiction: "Federal",
    jurisdiction_code: "US",
    law_name: "Executive Order 14110 on Safe, Secure, and Trustworthy AI",
    short_name: "EO 14110",
    effective_date: "2023-10-30",
    status: "active",
    summary: "Directs federal agencies to manage AI risks, protect civil rights, and promote innovation. Requires AI safety standards.",
    ai_training_impact: "Federal agencies and their contractors must follow AI safety and testing standards. Relevant for government-contracted Scrum teams.",
    url: "https://www.whitehouse.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/",
    tags: ["government", "transparency"],
  },
  {
    id: "us-section-508",
    jurisdiction: "Federal",
    jurisdiction_code: "US",
    law_name: "Section 508 of the Rehabilitation Act",
    short_name: "Section 508",
    effective_date: "1998-08-07",
    status: "active",
    summary: "Requires federal agencies to make electronic and IT accessible to people with disabilities. Applies to AI-generated content.",
    ai_training_impact: "AI-generated code, documentation, and interfaces must meet accessibility standards (WCAG 2.1 AA). AI tools must not create accessibility barriers.",
    url: "https://www.section508.gov/",
    tags: ["government", "transparency"],
  },
  {
    id: "us-fedramp",
    jurisdiction: "Federal",
    jurisdiction_code: "US",
    law_name: "Federal Risk and Authorization Management Program (FedRAMP)",
    short_name: "FedRAMP",
    effective_date: "2011-12-08",
    status: "active",
    summary: "Standardized approach for security assessment of cloud services used by federal agencies.",
    ai_training_impact: "AI tools used by government teams should be FedRAMP-authorized or meet equivalent security standards. Check if Copilot, ChatGPT, etc. have FedRAMP authorization.",
    url: "https://www.fedramp.gov/",
    tags: ["government", "procurement"],
  },
];

/**
 * Get all laws applicable to a given state.
 * Returns state-specific laws + all federal regulations.
 */
export function getLawsByState(stateCode: string): AILaw[] {
  return AI_LAW_CATALOG.filter(
    (law) => law.jurisdiction_code === stateCode || law.jurisdiction_code === "US"
  );
}

/**
 * Get all unique states/jurisdictions in the catalog.
 */
export function getAvailableStates(): { code: string; name: string }[] {
  const states = new Map<string, string>();
  for (const law of AI_LAW_CATALOG) {
    if (law.jurisdiction_code !== "US") {
      states.set(law.jurisdiction_code, law.jurisdiction);
    }
  }
  return Array.from(states.entries())
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get federal regulations (apply to all states).
 */
export function getFederalLaws(): AILaw[] {
  return AI_LAW_CATALOG.filter((law) => law.jurisdiction_code === "US");
}
