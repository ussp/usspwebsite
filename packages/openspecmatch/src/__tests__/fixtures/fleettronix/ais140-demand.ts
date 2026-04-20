/**
 * AIS 140 / Nirbhaya Monitoring Centre Demand Spec (Andhra Pradesh)
 *
 * Hand-authored DemandSpec from:
 *   - MoRTH Gazette S.O. 5453(E) dated 25-Oct-2018
 *   - MoRTH Letter RT-16011/1/2018-T dated 13-Jan-2020 (VTS Scheme Guidelines)
 *
 * Scope: State of Andhra Pradesh (Category A under scheme).
 * This replaces the narrative gap-analysis in the project folder with a
 * structured DemandSpec the OpenSpecMatch engine can score against.
 */

import type { DemandSpec, DemandItem } from "../../../specs/demand-spec.js";

const mk = (
  id: string,
  category: DemandItem["category"],
  rawText: string,
  criticality: DemandItem["criticality"],
  level: DemandItem["level"] = "advanced",
  context?: string,
): DemandItem => ({
  id,
  category,
  taxonomyRef: null,
  rawText,
  level,
  criticality,
  context,
});

const requirements: DemandItem[] = [
  // ── COMPLIANCE (mandatory gates) ─────────────────────────────────
  mk("cmp-001", "compliance", "AIS 140 Type Approval Certificate (TAC) from ARAI/CIRT/iCAT/VRDE/CFMTTI/IIP/GARC", "mandatory", "expert", "Gazette 2018 clause (a); device cannot be sold without TAC"),
  mk("cmp-002", "compliance", "Conformity of Production (COP) annual testing", "mandatory", "advanced", "Gazette 2018 clause (h)"),
  mk("cmp-003", "compliance", "CERT-IN security certification for backend platform", "mandatory", "expert", "Annexure B minimum feature"),
  mk("cmp-004", "compliance", "SSL certificates across all endpoints", "mandatory", "advanced", "Annexure B minimum feature"),
  mk("cmp-005", "compliance", "Survey of India map compliance (scale >=1:25000)", "mandatory", "advanced", "Annexure B section 2.6"),
  mk("cmp-006", "compliance", "CMVR 125H enforcement workflow support", "important", "advanced", "Scheme para 4.1"),
  mk("cmp-007", "compliance", "Nirbhaya Framework funding guidelines compliance", "important", "advanced", "Scheme para 5.2"),

  // ── INFRASTRUCTURE (core Monitoring Centre build) ────────────────
  mk("inf-001", "infrastructure", "NIC Cloud hosting for Monitoring Centre backend", "mandatory", "expert", "Scheme mandates NIC Cloud; cannot use private cloud"),
  mk("inf-002", "infrastructure", "VAHAN database integration (device tagging, unique ID, fitness check)", "mandatory", "expert", "Gazette annexure; scheme para 4.9-4.10"),
  mk("inf-003", "infrastructure", "ERSS (Dial-112) integration for emergency alert routing", "mandatory", "expert", "Scheme para 4.11; Nirbhaya core purpose"),
  mk("inf-004", "infrastructure", "AIS 140 compliant vehicle tracking software", "mandatory", "advanced", "Annexure B minimum feature"),
  mk("inf-005", "infrastructure", "Real-time GPS vehicle location tracking with map playback", "mandatory", "advanced", "Annexure B section 2.1"),
  mk("inf-006", "infrastructure", "Emergency panic button alert routing to ERSS plus MC", "mandatory", "advanced", "Annexure B section 2.7; highest priority alert"),
  mk("inf-007", "infrastructure", "Geo-fencing (POI, area, route) with alerts on enter/exit", "important", "advanced", "Annexure B section 2.6, 2.7"),
  mk("inf-008", "infrastructure", "Over-speed violation alerts to enforcement unit", "important", "advanced", "Annexure B section 2.7"),
  mk("inf-009", "infrastructure", "VLT device tampering detection (power cut, seal tamper)", "important", "advanced", "Annexure B section 2.7"),
  mk("inf-010", "infrastructure", "Device health monitoring of VLT and emergency buttons", "important", "advanced", "Annexure B section 2.12"),
  mk("inf-011", "infrastructure", "SMS gateway for emergency alert delivery", "mandatory", "advanced", "Annexure B minimum feature"),
  mk("inf-012", "infrastructure", "Cellular m2m telecom integration (SIM activation/validity/KYC)", "important", "advanced", "Annexure B minimum feature"),
  mk("inf-013", "infrastructure", "Mobile application for field access", "important", "intermediate", "Annexure B minimum feature"),
  mk("inf-014", "infrastructure", "Web control tower dashboard", "important", "advanced", "Annexure B section 2.5"),
  mk("inf-015", "infrastructure", "Online storage: 3 months all data + 2 years alerts + 2 years archive", "important", "advanced", "Annexure B section 2.10"),
  mk("inf-016", "infrastructure", "Emergency-tagged data retention (never deleted)", "mandatory", "advanced", "Annexure B section 2.10"),
  mk("inf-017", "infrastructure", "Multi-stakeholder role-based access control (RTO, permit holder, VLT mfr, testing agency)", "important", "advanced", "Annexure B section 2.11"),
  mk("inf-018", "infrastructure", "Data sharing API with MoRTH Dashboard", "mandatory", "advanced", "Annexure B section 2.15"),
  mk("inf-019", "infrastructure", "Physical MC equipment: 55-inch LED video wall 2x2 matrix, desktops, MFP, UPS, switch", "important", "intermediate", "Annexure B equipment list"),
  mk("inf-020", "infrastructure", "Vehicle owner web interface for self-tracking", "preferred", "intermediate", "Annexure B section 2.13"),
  mk("inf-021", "infrastructure", "Reports: device install, uptime, alerts, speed violations, fleet summary", "important", "advanced", "Annexure B section 2.8"),
  mk("inf-022", "infrastructure", "Interstate message exchange platform API", "preferred", "intermediate", "Annexure B section 2.14"),

  // ── MANPOWER ─────────────────────────────────────────────────────
  mk("man-001", "manpower", "24x7 helpdesk operations (phone, email, web) for VLT mfrs, Transport Dept, permit holders", "mandatory", "advanced", "Annexure B minimum feature"),
  mk("man-002", "manpower", "Telugu language support for AP helpdesk", "important", "intermediate", "AP-specific"),
  mk("man-003", "manpower", "Monitoring Centre 24x7 operations staff", "mandatory", "advanced", "Annexure B manpower resource"),
  mk("man-004", "manpower", "Training delivery to Transport Dept officials (JTC, RTO, MVI, AMVI)", "important", "advanced", "Scheme section 9"),
  mk("man-005", "manpower", "State PIU (Project Implementation Unit) with nodal officer", "mandatory", "advanced", "Scheme para 6.2; state obligation"),
  mk("man-006", "manpower", "Project management capability (state PMC)", "important", "advanced", "Scheme para 9.2"),
  mk("man-007", "manpower", "2-year O&M support team post-commissioning", "mandatory", "advanced", "Scheme section 11"),

  // ── FINANCIAL ────────────────────────────────────────────────────
  mk("fin-001", "financial", "Project capacity: 20.35 Crore INR (Category A state) delivery budget", "important", "advanced", "Scheme Table 1"),
  mk("fin-002", "financial", "Working capital to bridge 80/20 milestone cashflow under Nirbhaya release pattern", "important", "advanced", "Scheme section 7"),
  mk("fin-003", "financial", "Performance Bank Guarantee capacity (3-10% of contract value)", "mandatory", "advanced", "Standard Govt RFP requirement"),
  mk("fin-004", "financial", "Earnest Money Deposit (EMD) capability", "mandatory", "advanced", "Standard Govt RFP requirement"),

  // ── PAST PERFORMANCE ─────────────────────────────────────────────
  mk("pp-001", "past_performance", "Prior Govt Monitoring Centre / VLT scheme delivery at state level", "important", "advanced", "Implicit for credibility"),
  mk("pp-002", "past_performance", "Public Service Vehicle (bus, taxi, school bus) fleet tracking experience", "important", "advanced", "Scheme scope is PSVs not freight"),
  mk("pp-003", "past_performance", "AIS 140 compliant device deployment history at scale", "important", "advanced", "Scheme target segment"),
  mk("pp-004", "past_performance", "Prior engagement with Andhra Pradesh Govt", "preferred", "intermediate", "Incumbency advantage"),
  mk("pp-005", "past_performance", "Fleet tracking scale proven: 5000+ devices deployed", "important", "advanced", "Implicit credibility"),

  // ── GEOGRAPHIC ───────────────────────────────────────────────────
  mk("geo-001", "geographic", "Andhra Pradesh / Hyderabad regional presence", "mandatory", "advanced", "AP state scope; co-location advantage"),
];

export const AIS140_DEMAND: DemandSpec = {
  id: "demand-ais140-ap-2026",
  domain: "rfp",
  title: "AIS 140 Monitoring Centre - Andhra Pradesh (Nirbhaya Framework)",
  source: {
    type: "rfp_document",
    id: "morth-rt-16011-1-2018-T",
    extractedAt: new Date().toISOString(),
    extractorVersion: "hand-authored-v1",
  },
  requirements,
  context: {
    industry: "government-transport",
    location: {
      city: "Vijayawada",
      state: "AP",
      country: "IN",
      workMode: "onsite",
    },
    timeline: {
      urgency: "within_90_days",
      durationMonths: 36,
    },
    metadata: {
      scheme: "MoRTH Nirbhaya VLT Monitoring Centre",
      category: "A",
      projectCostCrores: 20.35,
      centreMaxCrores: 12.21,
      stateShareCrores: 8.14,
      fundingRatio: "60:40",
      host: "NIC Cloud",
      nationalPMU: "DIMTS Ltd.",
    },
  },
};
