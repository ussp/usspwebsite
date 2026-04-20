# USSPPL + Fleetronix vs AIS 140 Nirbhaya MC (AP) — Phase 2 Match Report

**Engine:** OpenSpecMatch v0.2.0  
**Profile:** `government-rfp`  
**Demand:** AIS 140 Monitoring Centre - Andhra Pradesh (Nirbhaya Framework)  
**Capability:** USSPPL + Fleetronix (combined bid entity) (via Combinator)  
**Computed:** 2026-04-18T07:06:06.268Z

## Verdict

| Field | Value |
|---|---|
| **Verdict** | **GO_WITH_REMEDIATION** |
| Rationale | Mandatory gate failed on 21 item(s), but each has a remediation path. |
| Overall score | 0 / 100 |
| Confidence | 92 / 100 |
| Mandatory gate passed | ❌ NO |
| Blockers | 39 |
| Remediation plans | 37 |

## Category Breakdown

| Category | Score | Weight | Items | Matched |
|---|---|---|---|---|
| compliance | 0 | 25 | 7 | 0 |
| infrastructure | 16 | 30 | 22 | 5 |
| manpower | 0 | 12 | 7 | 0 |
| financial | 0 | 10 | 4 | 0 |
| past_performance | 10 | 18 | 5 | 1 |
| geographic | 0 | 5 | 1 | 0 |

## Blockers (must close or remediate before RFP response)

| ID | Category | Criticality | Score | Requirement |
|---|---|---|---|---|
| cmp-001 | compliance | mandatory | 0 | AIS 140 Type Approval Certificate (TAC) from ARAI/CIRT/iCAT/VRDE/CFMTTI/IIP/GARC |
| cmp-002 | compliance | mandatory | 0 | Conformity of Production (COP) annual testing |
| cmp-003 | compliance | mandatory | 0 | CERT-IN security certification for backend platform |
| cmp-004 | compliance | mandatory | 0 | SSL certificates across all endpoints |
| cmp-005 | compliance | mandatory | 0 | Survey of India map compliance (scale >=1:25000) |
| cmp-006 | compliance | important | 0 | CMVR 125H enforcement workflow support |
| cmp-007 | compliance | important | 0 | Nirbhaya Framework funding guidelines compliance |
| inf-001 | infrastructure | mandatory | 0 | NIC Cloud hosting for Monitoring Centre backend |
| inf-002 | infrastructure | mandatory | 0 | VAHAN database integration (device tagging, unique ID, fitness check) |
| inf-003 | infrastructure | mandatory | 0 | ERSS (Dial-112) integration for emergency alert routing |
| inf-004 | infrastructure | mandatory | 0 | AIS 140 compliant vehicle tracking software |
| inf-005 | infrastructure | mandatory | 54 | Real-time GPS vehicle location tracking with map playback |
| inf-006 | infrastructure | mandatory | 0 | Emergency panic button alert routing to ERSS plus MC |
| inf-011 | infrastructure | mandatory | 0 | SMS gateway for emergency alert delivery |
| inf-012 | infrastructure | important | 0 | Cellular m2m telecom integration (SIM activation/validity/KYC) |
| inf-013 | infrastructure | important | 0 | Mobile application for field access |
| inf-014 | infrastructure | important | 0 | Web control tower dashboard |
| inf-015 | infrastructure | important | 0 | Online storage: 3 months all data + 2 years alerts + 2 years archive |
| inf-016 | infrastructure | mandatory | 0 | Emergency-tagged data retention (never deleted) |
| inf-017 | infrastructure | important | 0 | Multi-stakeholder role-based access control (RTO, permit holder, VLT mfr, testing agency) |
| inf-018 | infrastructure | mandatory | 0 | Data sharing API with MoRTH Dashboard |
| inf-019 | infrastructure | important | 0 | Physical MC equipment: 55-inch LED video wall 2x2 matrix, desktops, MFP, UPS, switch |
| inf-021 | infrastructure | important | 0 | Reports: device install, uptime, alerts, speed violations, fleet summary |
| man-001 | manpower | mandatory | 0 | 24x7 helpdesk operations (phone, email, web) for VLT mfrs, Transport Dept, permit holders |
| man-002 | manpower | important | 0 | Telugu language support for AP helpdesk |
| man-003 | manpower | mandatory | 0 | Monitoring Centre 24x7 operations staff |
| man-004 | manpower | important | 0 | Training delivery to Transport Dept officials (JTC, RTO, MVI, AMVI) |
| man-005 | manpower | mandatory | 0 | State PIU (Project Implementation Unit) with nodal officer |
| man-006 | manpower | important | 0 | Project management capability (state PMC) |
| man-007 | manpower | mandatory | 0 | 2-year O&M support team post-commissioning |
| fin-001 | financial | important | 0 | Project capacity: 20.35 Crore INR (Category A state) delivery budget |
| fin-002 | financial | important | 0 | Working capital to bridge 80/20 milestone cashflow under Nirbhaya release pattern |
| fin-003 | financial | mandatory | 0 | Performance Bank Guarantee capacity (3-10% of contract value) |
| fin-004 | financial | mandatory | 0 | Earnest Money Deposit (EMD) capability |
| pp-001 | past_performance | important | 0 | Prior Govt Monitoring Centre / VLT scheme delivery at state level |
| pp-002 | past_performance | important | 0 | Public Service Vehicle (bus, taxi, school bus) fleet tracking experience |
| pp-003 | past_performance | important | 0 | AIS 140 compliant device deployment history at scale |
| pp-005 | past_performance | important | 0 | Fleet tracking scale proven: 5000+ devices deployed |
| geo-001 | geographic | mandatory | 0 | Andhra Pradesh / Hyderabad regional presence |

## Remediation Plan

| Blocker ID | Weeks | Owner | Plan |
|---|---|---|---|
| cmp-001 | 12 | Anuradha | Engage ARAI or iCAT for AIS 140 Type Approval certification cycle. |
| cmp-002 | 4 | Anuradha | Annual COP testing cadence — engage certifying agency after TAC. |
| cmp-003 | 10 | Anurag Kotha | Engage CERT-IN empanelled auditor for backend assessment + remediation cycle. |
| cmp-004 | 1 | Anurag Kotha | Procure wildcard SSL + enforce HTTPS; verify with external scan. |
| cmp-005 | 4 | Anuradha | Migrate to MapmyIndia or SoI-compliant tile source; verify Survey of India licensing. |
| inf-001 | 8 | Anurag Kotha | Port backend to NIC Cloud; engage NIC empanelment process. |
| inf-002 | 6 | Anurag Kotha | Build VAHAN integration layer using NIC-published APIs; test against sandbox. |
| inf-003 | 4 | Veena | Engage AP Police / ERSS team; configure IP + SMS gateway per Gazette clauses (j)(k). |
| inf-004 | 4 | Anuradha | Map existing Fleetronix tracking software to AIS 140 feature checklist; close gaps. |
| inf-005 | 2 | Anuradha | Already in product (4.5 Lakh+ trips tracked); formalise AIS 140 feature-parity documentation. |
| inf-006 | 2 | Anuradha | Extend panic routing to emit dual-destination (ERSS + Fleetronix Control Tower). |
| inf-011 | 2 | Anuradha | Procure/integrate SMS gateway with failover; configure for emergency dispatch. |
| inf-012 | 1 | Anuradha | Already in product (cellular m2m); document SIM lifecycle + KYC path. |
| inf-013 | 2 | Anuradha | Already in product (mobile app); customise for AP operations users. |
| inf-014 | 2 | Anuradha | Already in product (Control Tower); rebrand / customise for AP Transport Dept. |
| inf-015 | 2 | Anurag Kotha | Configure storage tiers to 3mo online / 2yr alerts / 2yr archive per AIS 140. |
| inf-016 | 1 | Anurag Kotha | Add emergency-tagged retention policy to storage tier; confirm 'never delete' flag. |
| inf-017 | 4 | Anurag Kotha | Build multi-stakeholder RBAC layer (RTO / permit-holder / VLT-mfr / testing-agency). |
| inf-018 | 3 | Anurag Kotha | Implement MoRTH Data Sharing API endpoints per AIS 140 spec. |
| inf-019 | 4 | USSPPL ops | Procure physical MC equipment (video wall, UPS, desktops) — AP-local AV vendor. |
| inf-021 | 3 | Anuradha | Build Govt-style report pack (device install, uptime, alerts, fleet summary). |
| man-001 | 6 | Veena | Stand up AP-dedicated 24x7 helpdesk with Telugu/Hindi/English coverage. |
| man-002 | 0 | Veena | Telugu helpdesk covered by Hyderabad ops staff (native speakers). |
| man-003 | 8 | Veena | Hire and train MC 24x7 operations staff (3 shifts). |
| man-004 | 4 | Veena | Build training curriculum for Transport Dept / RTO officials. |
| man-005 | 2 | Veena | Coordinate with AP Transport Dept on PIU + nodal officer appointment (state obligation). |
| man-006 | 2 | Veena | Engage state PMC or use National PMU (DIMTS) per scheme — commercial decision. |
| man-007 | 2 | Veena | Allocate dedicated 2-year O&M squad within bid commercials. |
| fin-001 | 2 | USSPPL finance | 20.35 Cr project capacity — confirm USSPPL + Fleetronix combined capex/opex plan. |
| fin-002 | 2 | USSPPL finance | Model milestone-based cashflow against Nirbhaya 80/20 release pattern. |
| fin-003 | 3 | USSPPL finance | Secure PBG line from bank (3-10% of ~20.35 Cr ~= 60L-2Cr). |
| fin-004 | 2 | USSPPL finance | Arrange EMD via bank FD or BG per tender requirement. |
| pp-001 | 0 | Veena | Limited direct Govt MC reference; lead pitch on Fortune 500 scale + AP ports. |
| pp-002 | 1 | Veena | Limited direct PSV reference; reposition cargo telematics as PSV-transferable stack. |
| pp-003 | 0 | Anuradha | No AIS 140 device history today; pairs with TAC remediation above. |
| pp-005 | 0 | Anuradha | Covered — 7,000+ devices deployed. |
| geo-001 | 8 | Veena + USSPPL ops | Already covered — USSPPL Bowenpally + Fleetronix Gachibowli are in Hyderabad; establish AP branch presence (Vijayawada) within 60 days. |

## Unremediated Blockers

These have no remediation path declared. Either add one to the lookup or accept them as NO_GO contributors.

| ID | Category | Requirement |
|---|---|---|
| cmp-006 | compliance | CMVR 125H enforcement workflow support |
| cmp-007 | compliance | Nirbhaya Framework funding guidelines compliance |

## ✅ Strengths (scored >= 70)

| ID | Category | Demand | Score |
|---|---|---|---|
| inf-007 | infrastructure | Geo-fencing (POI, area, route) with alerts on enter/exit | 98 |
| inf-009 | infrastructure | VLT device tampering detection (power cut, seal tamper) | 98 |
| inf-010 | infrastructure | Device health monitoring of VLT and emergency buttons | 98 |
| pp-004 | past_performance | Prior engagement with Andhra Pradesh Govt | 84 |

## ❓ Unknowns (no matching capability)

| ID | Category | Demand |
|---|---|---|
| cmp-001 | compliance | AIS 140 Type Approval Certificate (TAC) from ARAI/CIRT/iCAT/VRDE/CFMTTI/IIP/GARC |
| cmp-002 | compliance | Conformity of Production (COP) annual testing |
| cmp-003 | compliance | CERT-IN security certification for backend platform |
| cmp-004 | compliance | SSL certificates across all endpoints |
| cmp-005 | compliance | Survey of India map compliance (scale >=1:25000) |
| cmp-006 | compliance | CMVR 125H enforcement workflow support |
| cmp-007 | compliance | Nirbhaya Framework funding guidelines compliance |

## All Item-level Matches

| Demand ID | Score | Tax | Level | Evidence | Recency |
|---|---|---|---|---|---|
| cmp-001 | 0 | none | 0 | 0 | 0 |
| cmp-002 | 0 | none | 0 | 0 | 0 |
| cmp-003 | 0 | none | 0 | 0 | 0 |
| cmp-004 | 0 | none | 0 | 0 | 0 |
| cmp-005 | 0 | none | 0 | 0 | 0 |
| cmp-006 | 0 | none | 0 | 0 | 0 |
| cmp-007 | 0 | none | 0 | 0 | 0 |
| inf-001 | 0 | none | 75 | 95 | 99 |
| inf-002 | 0 | none | 75 | 95 | 99 |
| inf-003 | 0 | none | 75 | 95 | 99 |
| inf-004 | 0 | none | 100 | 95 | 99 |
| inf-005 | 54 | related | 100 | 95 | 99 |
| inf-006 | 0 | none | 100 | 95 | 99 |
| inf-007 | 98 | exact | 100 | 95 | 99 |
| inf-008 | 54 | related | 100 | 95 | 99 |
| inf-009 | 98 | exact | 100 | 95 | 99 |
| inf-010 | 98 | exact | 100 | 95 | 99 |
| inf-011 | 0 | none | 100 | 95 | 99 |
| inf-012 | 0 | none | 100 | 95 | 99 |
| inf-013 | 0 | none | 100 | 95 | 99 |
| inf-014 | 0 | none | 100 | 95 | 99 |
| inf-015 | 0 | none | 100 | 95 | 99 |
| inf-016 | 0 | none | 100 | 95 | 99 |
| inf-017 | 0 | none | 100 | 95 | 99 |
| inf-018 | 0 | none | 100 | 95 | 99 |
| inf-019 | 0 | none | 100 | 95 | 99 |
| inf-020 | 0 | none | 100 | 95 | 99 |
| inf-021 | 0 | none | 100 | 95 | 99 |
| inf-022 | 0 | none | 100 | 95 | 99 |
| man-001 | 0 | none | 100 | 95 | 99 |
| man-002 | 0 | none | 100 | 95 | 99 |
| man-003 | 0 | none | 100 | 95 | 99 |
| man-004 | 0 | none | 100 | 95 | 99 |
| man-005 | 0 | none | 100 | 95 | 99 |
| man-006 | 0 | none | 100 | 95 | 99 |
| man-007 | 0 | none | 100 | 95 | 99 |
| fin-001 | 0 | none | 75 | 95 | 99 |
| fin-002 | 0 | none | 75 | 95 | 99 |
| fin-003 | 0 | none | 75 | 95 | 99 |
| fin-004 | 0 | none | 75 | 95 | 99 |
| pp-001 | 0 | none | 100 | 95 | 99 |
| pp-002 | 0 | none | 100 | 95 | 99 |
| pp-003 | 0 | none | 100 | 95 | 99 |
| pp-004 | 84 | exact | 100 | 65 | 99 |
| pp-005 | 0 | none | 100 | 95 | 99 |
| geo-001 | 0 | none | 100 | 95 | 99 |

## Notes

- **This run uses `matchRFP()` with the Phase 2 `government-rfp` profile** and the new infrastructure + financial + manpower taxonomy trees. Text-similarity fallback still applies where `taxonomyRef` is null (hand-authored fixtures), but resolution improves wherever phrases hit a taxonomy alias.
- **Verdict logic:** passing gate + score >= 70 = GO. Otherwise, if every mandatory blocker has remediation = GO_WITH_REMEDIATION. Unremediated mandatory = NO_GO.
- **Next step:** run the LLM RFP + Company extractors (Phase 2b — deferred) to replace the hand-authored fixtures with extractor-produced specs.

