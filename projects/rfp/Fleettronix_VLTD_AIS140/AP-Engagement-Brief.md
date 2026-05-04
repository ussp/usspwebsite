# Andhra Pradesh VLTD / AIS 140 Engagement — Project Brief

> Joint capability engagement between **USSPPL** (India arm of US Software Professionals Inc.) and **Fleetronix Systems Pvt Ltd**, addressing the State of Andhra Pradesh's AIS 140 Vehicle Location Tracking & Emergency Response Centre requirement.

---

## 0. Trust scoring (read first)

The picture is changing rapidly. Critical claims in this document carry a **trust score** so we know what to lean on and what to validate before it lands in a bid.

| Tag | Meaning | Action |
|---|---|---|
| 🟢 **VERIFIED** | Confirmed via official source, signed document, or written attestation we can produce. | OK to use in client materials. |
| 🟡 **PARTIAL** | Public source, vendor written claim, or industry-standard reference. Reasonable trust. | OK to use internally; confirm before client materials. |
| 🟠 **UNVERIFIED** | Verbal claim from a meeting, vendor sales pitch not in writing, or our own inference. | Treat as a working hypothesis. Validate before any commitment. |
| ⚫ **UNKNOWN** | Not yet investigated. | Open question. Capture in Critical-Questions-to-Validate.md. |

> Default rule: if you don't see a tag, it is 🟠 UNVERIFIED. Escalate any 🟠 / ⚫ that is on the bid critical path.

---

## 1. Engagement at a glance

| Item | Value |
|---|---|
| Project | AIS 140 / VLTD Monitoring Centre — State of Andhra Pradesh |
| Type | Pre-RFP capability briefing → expected formal RFP |
| Scope geography | State of Andhra Pradesh only (not pan-India) |
| Lead bidder | USSPPL — United Strategic Solutions Professionals Pvt Ltd (Hyderabad) |
| Technology partner | Fleetronix Systems Pvt Ltd (Gachibowli, Hyderabad) |
| Hardware OEM (under Fleetronix) | iTriangle Infotech Pvt Ltd (Bengaluru) |
| Engagement stage | Warm pre-RFP — capability presentation invited by AP Transport leadership |

**Key date:** 2026-04-27 — Minister meeting outcome captured; two-track scope confirmed.

---

## 1a. Project scope — NOT YET CLEAR 🟠 UNVERIFIED

> **Scope validation is Job #1.** Until validated by a written reply from an AP Transport / DoIT official, all of the below is a working hypothesis built from the Minister meeting and vendor conversations — not a basis for commercials.

### Working hypothesis (from Minister meeting, 2026-04-27)

The Minister scoped this verbally as **two distinct revenue tracks**. Both numbers and the B2C / B2G structure are 🟠 UNVERIFIED until confirmed in writing.

#### Track A (working hypothesis) — Direct Govt Tender — ~80,000 vehicles 🟠
- AP-owned / operated public service vehicles via formal RFP and contract.
- Working assumption: standard B2G motion (bid, award, deploy, operate, multi-year managed services).
- 🟠 Number "80,000" is a verbal figure; not yet seen in any written notification or RFP.
- **If verified:** anchor revenue, primary reference, primary focus per Veena's lead.

#### Track B (working hypothesis) — Commercial Vehicle Mandate — ~1,600,000 yellow-tag vehicles 🟠
- Working assumption: AP yellow-tag commercial vehicles required to fit AIS 140 VLTD under a State mandate.
- Verbal Minister analogue: **FASTag-style approved-vendor model** — State empanels vendors; vehicle owners choose at registration / fitness / renewal; vendor handles sales, install, AMC, support.
- 🟠 Number "1.6M" is verbal; the empanelment scheme has not been confirmed.
- 🟠 Whether Track B is in fact a B2C empanelment channel (vs. a different structure) is not yet confirmed.
- **If verified:** USSPPL applies for empanelment; sub-contracts the channel build to a partner with FASTag-style retail / distribution muscle. We do not operate the channel ourselves.

### What we need to validate before bid commercials

See `Critical-Questions-to-Validate.md`. The blocking questions are:

1. Is this one engagement or two distinct programmes?
2. When does the formal RFP issue?
3. Is the 1.6M mandate a B2C empanelment channel — confirmed?
4. Is teaming permitted (USSPPL prime + Fleetronix subcontractor)?
5. Indicative bid mechanics (eligibility, evaluation, EMD, performance bond).

### What changes by hypothesis

| Hypothesis | Sourcing volume | Channel build needed | Planner phases active |
|---|---|---|---|
| 80K only (B2G) | ~80K | No | 1–10 |
| 80K + 1.6M (dual track) 🟠 | ~1.68M | Yes (subcontracted) | 1–11 |
| Different scope altogether ⚫ | TBD | TBD | TBD |

### Posture in the meantime

- **Vendor outreach for pricing can run in parallel** — sourcing does not require scope confirmation. Even at 80K alone, the volume is well above our earlier 20–50K assumption.
- **Channel partner research can run in parallel** — we capture candidate sub-contractors regardless. If Track B is dropped, the work is parked, not wasted.
- **No commercial commitments to State or sub-contractor** until §1a is 🟢 VERIFIED.

---

## 2. The scheme — MoRTH Nirbhaya Framework

- **Origin:** Government of India scheme under the **Nirbhaya Framework**, administered by the Ministry of Road Transport & Highways (MoRTH).
- **Objective:** Enable 37 States and Union Territories to operate **AIS 140-compliant Vehicle Location Tracking & Emergency Response Centres** that monitor public service vehicles (buses, taxis, contract carriages) in real time and route SOS / panic events to police and transport authorities.
- **Legal basis:**
  - Central Motor Vehicles Rules (CMVR) §125H
  - Motor Vehicles Act 1988 §109(3)
- **Total scheme outlay:** ₹463.9 Cr nationally.
- **Funding pattern:** Centre 60 : State 40.
- **Original commissioning deadline:** 31 December 2020 — lapsed; States are now catching up under revised timelines.

### Andhra Pradesh's slot

| Item | Value |
|---|---|
| Scheme category | Category A |
| Project cost (AP) | ₹20.35 Cr |
| Centre share (max) | ₹12.21 Cr |
| State share | ₹8.14 Cr |
| Centre retention | ₹4.97 Cr |

> **Note:** Budget and legal-basis numbers are excluded from the minister-facing slide deck per current direction. They appear here as background intelligence for internal reference and NotebookLM querying — not for client distribution without curation.

---

## 3. What the State of AP gets — programme objective

- A State-owned **Monitoring Centre** that tracks all public service vehicles across Andhra Pradesh in real time.
- A passenger-safety promise the State can showcase: every authorised commercial vehicle is location-tracked, with a panic / SOS button connected to the State's emergency-response workflow.
- Standardised reporting to RTO / STA / Police, with audit trail.
- Compliance with all AIS 140 / CMVR norms — without dependence on multiple unrelated vendors.

---

## 4. Operating concept

- **Field layer:** AIS 140 Vehicle Location Tracking Devices + SOS / panic buttons fitted on every covered vehicle.
- **Data plane:** Devices stream location, speed, heading, ignition, tamper, and SOS events to a central control tower over IP and SMS gateways.
- **Backend:** Geo-fence and rule engine, real-time alerting, time-series data lake, analytics for fleet-level patterns and anomalies.
- **Monitoring Centre:** 24×7 staffed control room running SOP-driven response; dashboards for State Transport, Police, and RTO users.
- **Integrations:** VAHAN, Sarathi, AP Transport Department backend, AP Police emergency systems.
- **Governance wrap:** SLA contracts, CERT-In aligned security, citizen-data protection, quarterly Centre reviews.

---

## 5. Joint partnership structure

### USSPPL — Lead Bidder

- **Legal name:** United Strategic Solutions Professionals Pvt Ltd
- **PAN:** AABCU9182D
- **Domicile:** Hyderabad, Telangana
- **Parent:** US Software Professionals Inc. (USSP), Illinois USA — incorporated 23 Jan 2003, registration #62642807.
- **Authorised signatory:** Lagishetty Vijay Kumar Setty, Managing Director.
- **Role on bid:** Indian-incorporated bidding entity, programme governance, solution architecture, integration design, Govt delivery wrap, workforce.

### Fleetronix Systems Pvt Ltd — Technology Partner

- **CIN:** U72200TG2022PTC164381
- **GST:** 36AAFCF1272P1ZA
- **Address:** 1st Floor, TRR Infra, Road No. 5, Janardana Hills, Gachibowli, Hyderabad-500035.
- **Founders:** Veena L (Co-Founder), Sita Reddy (Co-Founder), Anuradha Parakala (Co-Founder, M.Tech IIT Madras) — all-woman founding team.
- **Role on bid:** AIS 140 device and platform stack, control tower, field operations, OEM management with iTriangle.

### Why USSPPL adds value on top of Fleetronix

- **Bidding entity:** Indian-incorporated lead, eligible under State e-Procurement.
- **Govt delivery muscle:** Programme management, audit, SLA discipline at scale.
- **Technology depth:** USSP CTO India on call for AIS 140, NIC, VAHAN integration design.
- **Workforce:** Surge capacity through USSP's India bench for rollout and support.
- **Continuity:** Multi-decade firm with US parent; reduces single-vendor risk on a multi-year State engagement.
- **Credibility:** US public-sector and enterprise references (see USSP-Capabilities.md).

---

## 6. Project leads

| Role | Name | Org | Contact |
|---|---|---|---|
| USSP single point of contact (cross-entity) | Veena L | Fleetronix / USSP | veenakumarp27@gmail.com |
| USSP CTO India (on-call architecture / AIS 140 / NIC / VAHAN) | Anurag Kotha | USSP | anurag.kotha@versaquant.com |
| Fleetronix tech / delivery lead | Anuradha Parakala | Fleetronix | anuradha@fleetronix.io |
| Fleetronix Operations Manager | Shivaraj Somnal | Fleetronix | shivaraj@fleetronix.io · +91 91543 06964 |

> Veena is the de facto cross-entity lead — Fleetronix co-founder operating in a USSP-side capacity for this engagement.

---

## 7. AIS 140 compliance evidence — already in hand

- **Device:** aQuila Bharat101 with IRNSS — Vehicle Location Tracking Device.
- **OEM:** iTriangle Infotech Pvt Ltd, Bengaluru.
- **Approval body:** ICAT — International Centre for Automotive Technology (NATIS / National Automotive Board, Govt of India).
- **COP Certificate No.:** CC0GV9323 (issued 28-Mar-2026).
- **Standard:** AIS 140 upto Amendment 2:2018.
- **Validity:** 31-Mar-2027 (renewable).
- **Reference test report:** CT0GV9322 dated 23.03.2026.
- **Previous COP:** CC0GU9331 dated 28.03.2025.
- **TAC:** BH2GIC-14220014002.
- **Companion devices:** aQuila SOS emergency button family — TAC ITRPB0029, ITRPB0037, ITRPB0038.

### Device features

- AIS 140 panic / SOS button — emergency event signalling.
- Tamper alerts (case open, power cut, GPS jam).
- Built-in backup battery — continuity through ignition cuts.
- Dual SIM with automatic fallback for resilient connectivity.
- IP + SMS gateway transmission paths.
- OTA firmware updates from Fleetronix back-end.

### Government / regulator integrations (attested by Fleetronix)

- VAHAN — device + platform compliant for VAHAN linkage.
- Sarathi / State Transport Authority backend integration.
- **AP Transport Department backend — confirmed**.
- **AP Police emergency systems — confirmed (SOS / panic events route into Police emergency systems per AIS 140).**

### Field SLAs (Fleetronix attestation)

| Metric | Commitment |
|---|---|
| Device downtime resolution | 12 – 24 hours |
| Replacement turnaround | 24 – 72 hours |
| Installation | Trained field technicians |
| Ground support | Dedicated regional team |

---

## 8. Open gaps / things to verify before formal RFP

- Fleetronix's **AIS 140 Type Approval Certificate (TAC)** chain through iTriangle OEM — confirm latest dated paperwork.
- **CERT-In** empanelment / cyber-audit certification for the Fleetronix platform — needed for Govt cloud hosting.
- **NIC Cloud / VAHAN integration** experience — Fleetronix attests capability; obtain a deployment reference.
- **Government project experience** — Fleetronix's compliance response says "details can be shared upon request" — request and document specific State references before bid submission.
- **Commercial detail** — cost per vehicle, AMC, and price book are placeholders (XXXX) in current Fleetronix compliance response; firm rates needed before commercial submission.
- **USSPPL signing authority + e-Procurement registration** — confirm digital-signature certificate and AP eProc registration are current.

---

## 9. Source documents (location)

All under `projects/rfp/Fleettronix_VLTD_AIS140/`:

- `partner/USSPPL-Fleetronix-Minister-Pitch.pptx` — current joint capability deck (31 slides).
- `partner/Fleetronix-AP Govt.pptx` — Fleetronix's standalone AP capability deck (original).
- `partner/device information/193000_ITRIANGLE_COP_CERT.pdf` — ICAT Certificate of Conformity for aQuila Bharat101.
- `partner/device information/Fleetronix_Compliance_Accenture.pdf` — Fleetronix's compliance & technical Q&A (originally for Accenture).
- `partner/device information/BHARAT101_USER_MANUAL_V2.8.pdf` — Bharat101 device user manual.
- `GAZETTE OF INDIA.pdf` — gazette notification.
- `Letter VTS Guidelines-compressed (2).pdf` — VTS guidelines from MoRTH.
- `companies/`, `legal/`, `extracted/`, `raw/` — supporting paperwork.

---

## 10. Positioning summary (one paragraph for any cover letter)

> USSPPL, the Hyderabad-based delivery arm of US Software Professionals Inc. (USSP, est. 2003 in Illinois USA), is partnering with Fleetronix Systems Pvt Ltd to deliver an AIS 140-compliant Vehicle Location Tracking and Emergency Response Centre for the State of Andhra Pradesh. Fleetronix brings ICAT-certified Bharat101 hardware (via OEM iTriangle Infotech), a deployed control-tower platform with 7,000+ devices in service, and an all-woman founding team aligned with the spirit of the Nirbhaya Framework. USSPPL brings two decades of US Government-grade delivery experience, programme governance, and integration depth across cloud, security, and citizen-services workflows. The combined offering gives Andhra Pradesh a single, accountable bidder with proven hardware, proven Govt integration paths, and a credible long-horizon delivery wrapper.
