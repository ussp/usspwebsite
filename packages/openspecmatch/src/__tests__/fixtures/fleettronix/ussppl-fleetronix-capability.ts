/**
 * USSPPL + Fleetronix Combined Capability Spec
 *
 * Hand-authored CapabilitySpec from:
 *   - USSPPL ITR-6 acknowledgment (companies/ACK275049171261025.pdf)
 *   - Fleetronix AP Govt pitch deck (partner/Fleetronix-AP Govt.pdf/.pptx)
 *
 * This is a multi-entity capability spec: the engine will score it against
 * AIS 140 demand as a single combined bidder. Phase 2 Combinator (tasks.md
 * §13.3) will replace this with formal multi-entity composition.
 */

import type { CapabilitySpec, CapabilityItem } from "../../../specs/capability-spec.js";
import type { Evidence } from "../../../specs/common.js";

const ev = (
  description: string,
  source: string,
  durationMonths?: number,
): Evidence => ({
  type: "experience",
  description,
  source,
  ...(durationMonths !== undefined ? { durationMonths } : {}),
});

const mk = (
  id: string,
  category: CapabilityItem["category"],
  rawText: string,
  level: CapabilityItem["level"],
  evidence: Evidence[],
  years?: number,
): CapabilityItem => ({
  id,
  category,
  taxonomyRef: null,
  rawText,
  level,
  evidence,
  ...(years !== undefined ? { years } : {}),
  lastUsed: "2026-04",
});

const capabilities: CapabilityItem[] = [
  // ── COMPLIANCE ───────────────────────────────────────────────────
  // NOTE: Gaps here — nothing confirmed yet for TAC, CERT-IN, SoI map
  // Deliberately NOT including AIS 140 TAC or CERT-IN — if they had these they'd be in the deck.
  // Recording what IS present to avoid hallucinating coverage.

  // ── INFRASTRUCTURE (Fleetronix technical stack) ──────────────────
  mk("inf-c01", "infrastructure", "Cloud-based backend platform (provider not disclosed; not NIC Cloud)", "advanced",
    [ev("7,000+ devices deployed on production backend", "Fleetronix deck slide 21", 36)], 5),
  mk("inf-c02", "infrastructure", "Real-time GPS vehicle location tracking with map playback and trip view", "expert",
    [ev("4.5 Lakh+ trips tracked, Fortune 500 clients", "Fleetronix deck slides 5,8", 48)], 6),
  mk("inf-c03", "infrastructure", "Emergency / panic alert routing via Fleetronix Control Tower", "advanced",
    [ev("Panic routing baked into platform ('Bharat behavioral DNA')", "Fleetronix deck slide 20", 36)], 4),
  mk("inf-c04", "infrastructure", "Geo-fencing capability (POI, area, route) with alerts on enter/exit", "expert",
    [ev("Geo-fence violation alerts, red zone alerts deployed in production", "Fleetronix deck slide 6", 36)], 4),
  mk("inf-c05", "infrastructure", "Over-speed violation alerts to enforcement/central operations", "expert",
    [ev("Over-speeding alerts + driver compliance violations tracked", "Fleetronix deck slide 6", 36)], 4),
  mk("inf-c06", "infrastructure", "VLT device tampering detection (power cut, seal tamper, QR seal mismatch)", "expert",
    [ev("Seal tampering detection and power cable disconnect alerts in production", "Fleetronix deck slide 6", 36)], 4),
  mk("inf-c07", "infrastructure", "Device health monitoring of VLT and emergency buttons", "advanced",
    [ev("Periodic health checks on deployed devices", "Fleetronix deck slides 6,12", 36)], 4),
  mk("inf-c08", "infrastructure", "Mobile application for on-the-go fleet operations", "expert",
    [ev("AI-driven Fleetronix mobile app deployed to customers", "Fleetronix deck slides 5,7", 48)], 5),
  mk("inf-c09", "infrastructure", "Web Control Tower dashboard with trip ETA, violations, risky trips classification", "expert",
    [ev("Fleetronix Control Tower live across 10+ ports/mines", "Fleetronix deck slides 8,9", 36)], 4),
  mk("inf-c10", "infrastructure", "Reports: trip, violation, uptime, fleet summary, alert reports", "advanced",
    [ev("Violation history reports (vehicles, drivers), trip status reports in production", "Fleetronix deck slide 8", 36)], 4),
  mk("inf-c11", "infrastructure", "AI-powered video telematics / AI dashcam (ADAS, driver behavior, distraction)", "expert",
    [ev("AI dashcam with ADAS alarms: tailgating, forward collision warning, fatigue, phone use", "Fleetronix deck slides 13-15", 24)], 2),
  mk("inf-c12", "infrastructure", "Freight safety video solution (trailer, loading bay, door monitoring)", "advanced",
    [ev("Continuous video monitoring of cargo in production", "Fleetronix deck slide 12", 24)], 2),
  mk("inf-c13", "infrastructure", "Fuel sensor solution (real-time fuel level, theft detection)", "advanced",
    [ev("Fuel theft detection deployed for enterprise clients", "Fleetronix deck slide 16", 24)], 2),
  mk("inf-c14", "infrastructure", "Rail wagon visibility and tracking (ports, yards, sidings)", "advanced",
    [ev("Real-time wagon location, detention/dwell time monitoring (new capability)", "Fleetronix deck slide 11", 12)], 1),
  mk("inf-c15", "infrastructure", "Live video streaming from vehicle cameras (multi-channel)", "advanced",
    [ev("Live stream of active camera channels in production", "Fleetronix deck slide 14", 24)], 2),
  mk("inf-c16", "infrastructure", "Cellular connectivity with m2m backend integration", "advanced",
    [ev("7000+ connected devices using cellular backend", "Fleetronix deck slide 21", 36)], 5),

  // ── MANPOWER ─────────────────────────────────────────────────────
  mk("man-c01", "manpower", "180-person organization combining engineering, operations, customer success", "expert",
    [ev("Grew from 4 to 180 staff", "Fleetronix deck slides 2,21", 60)], 5),
  mk("man-c02", "manpower", "24x7 customer operations and support (stated)", "advanced",
    [ev("24x7 support, end-to-end service (stated positioning)", "Fleetronix deck slide 22", 36)], 4),
  mk("man-c03", "manpower", "Hyderabad India-based ops team (Telugu language native)", "expert",
    [ev("HQ at Gachibowli, Hyderabad Telangana", "Fleetronix deck slide 24", 60)], 5),
  mk("man-c04", "manpower", "USSP global delivery capability via US parent + USSPPL India arm", "advanced",
    [ev("USSPPL Hyderabad entity, USSP US Corp founded 2003", "USSPPL ITR + USSP CLAUDE.md", 240)], 20),
  mk("man-c05", "manpower", "Enterprise customer onboarding and training at Fortune 500 scale", "advanced",
    [ev("Fortune 500 clients, 500+ registered customers", "Fleetronix deck slide 2", 48)], 4),

  // ── FINANCIAL ────────────────────────────────────────────────────
  mk("fin-c01", "financial", "Fleetronix revenue trajectory: 1.7 -> 5.7 -> 5.5 -> 6.5 Cr (FY22-23 to FY25-26P)", "intermediate",
    [ev("4-year turnover disclosed in deck", "Fleetronix deck slide 21", 48)], 4),
  mk("fin-c02", "financial", "USSPPL active entity with FY24-25 ITR filed (total income 1.23L)", "beginner",
    [ev("ITR-6 acknowledgment 275049171261025 dated 26-Oct-2025", "USSPPL ITR"), ev("Indian corporate entity under active filing", "USSPPL ITR", 240)], 20),

  // ── PAST PERFORMANCE ─────────────────────────────────────────────
  mk("pp-c01", "past_performance", "Enterprise fleet tracking at 10+ ports (Kandla, Haldia, Vishakhapatnam, Krishnapatnam etc) and 7 mines (SECL, NCL, CCL etc)", "expert",
    [ev("Deployment footprint across India including AP ports Vishakhapatnam and Krishnapatnam", "Fleetronix deck slide 9", 36)], 4),
  mk("pp-c02", "past_performance", "International deployment in Zambia across 4 mines and 4 ports", "advanced",
    [ev("Zambia: Maamba Collieries, Mulungwa, Collum Coal, Maamba Energy", "Fleetronix deck slide 10", 24)], 2),
  mk("pp-c03", "past_performance", "Fortune 500 client base for in-transit cargo theft prevention", "expert",
    [ev("Founded to combat supply chain theft for Fortune 500", "Fleetronix deck slide 2", 60)], 5),
  mk("pp-c04", "past_performance", "Prior Andhra Pradesh Govt pitch engagement", "intermediate",
    [ev("'Fleetronix-AP Govt' pitch deck prepared", "partner/Fleetronix-AP Govt.pptx", 6)], 0.5),
  mk("pp-c05", "past_performance", "Recognition: Top Corporate Woman Entrepreneur Telangana 2022 (TEDx speaker)", "advanced",
    [ev("Co-founder Sita Reddy award", "Fleetronix deck slide 23", 36)], 3),

  // ── GEOGRAPHIC ───────────────────────────────────────────────────
  mk("geo-c01", "geographic", "Hyderabad, Telangana headquartered (co-located with USSPPL Bowenpally)", "expert",
    [ev("Fleetronix HQ Gachibowli Hyderabad + USSPPL Bowenpally Hyderabad", "Fleetronix deck slide 24 + USSPPL ITR", 60)], 5),
];

export const USSPPL_FLEETRONIX_CAPABILITY: CapabilitySpec = {
  id: "cap-ussppl-fleetronix-2026",
  domain: "company",
  name: "USSPPL + Fleetronix (combined bid entity)",
  source: {
    type: "company_profile",
    id: "ussppl-fleetronix-combined",
    extractedAt: new Date().toISOString(),
    extractorVersion: "hand-authored-v1",
  },
  capabilities,
  context: {
    totalExperienceYears: 20, // USSP parent; Fleetronix younger but USSPPL leverages parent history
    currentRole: "Bidder consortium (USSPPL primary, Fleetronix tech partner)",
    location: {
      city: "Hyderabad",
      state: "TG",
      country: "IN",
    },
    workPreference: "onsite",
    metadata: {
      bidderEntity: "USSPPL - United Strategic Solutions Professionals Pvt Ltd",
      bidderPAN: "AABCU9182D",
      techPartner: "Fleetronix",
      usspLead: "Veena L (veenakumarp27@gmail.com)",
      fleetronixLead: "Anuradha Parakala (anuradha@fleetronix.io)",
      usspCTO: "Anurag Kotha (anurag.kotha@versaquant.com)",
      fleetronixTeamSize: 180,
      fleetronixDevicesDeployed: 7000,
      fleetronixTripsTracked: 450000,
      fleetronixFY2526TurnoverCrores: 6.5,
    },
  },
};
