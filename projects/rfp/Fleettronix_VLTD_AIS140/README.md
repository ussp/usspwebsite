# Fleettronix — VLTD / AIS 140 Vehicle Tracking Platform (India)

> MoRTH Scheme: *Development, Customization, Deployment and Management of State-wise vehicle tracking platform for Safety & Enforcement as per AIS 140 Specifications, under Nirbhaya Framework*

## Source Documents

| File | Type | Date | Reference No. |
|---|---|---|---|
| `GAZETTE OF INDIA.pdf` | MoRTH Notification (legal mandate) | 25 Oct 2018 (pub. 26 Oct 2018) | S.O. 5453(E) / RT-11028/12/2015-MVL |
| `Letter VTS Guidelines-compressed (2).pdf` | Scheme Letter + Guidelines + MoU template | 13 Jan 2020 | RT-16011/1/2018-T |

## What This Project Is

Central Government of India scheme to fund 37 States/UTs to set up AIS 140-compliant **Monitoring Centres** that track public service vehicles (buses, taxis, school buses, etc.) via **Vehicle Location Tracking Devices (VLTDs)** with emergency buttons. Purpose: safety of women and children in public transport (driven by Nirbhaya Framework).

## Our Scope: State of Andhra Pradesh ONLY

> **We are responding to AP only, not pan-India.** The AP **State Minister (Transport)** has invited us to **present company capability BEFORE the formal RFP is issued**. This is a pre-RFP capability pitch — landing this well could unlock the official RFP invitation.

- **AP falls under Category A** (per scheme): ₹20.35 Cr project cost, 60:40 Centre:State
  - Centre max: ₹12.21 Cr
  - MoRTH retention: ₹4.97 Cr
  - AP State share: ₹8.14 Cr
- Fleetronix has an existing **"Fleetronix – AP Govt" deck** in `partner/` — prior AP groundwork likely exists
- This is a **warm pre-RFP engagement**, not cold bid
- Deliverable (near-term): **capability presentation to AP Minister**, not a full RFP response

## Project Leads

| Side | Lead | Email | Role |
|---|---|---|---|
| **USSP (Bidder)** | Veena (Fleetronix co-founder) | veenakumarp27@gmail.com | Project Lead for USSP on this engagement |
| **USSP CTO (India) — on-call** | Anurag Kotha | anurag.kotha@versaquant.com | Technical authority; pulled in as needed for architecture, AIS 140, integration depth |
| **Fleetronix (Tech Partner)** | Anuradha Parakala | anuradha@fleetronix.io | Project Lead for Fleetronix |

*Note: Veena is a co-founder of Fleetronix but is leading this project **for USSP** (cross-entity leadership).*

## Team Structure

- **Bidding Entity:** USSPPL (United Strategic Solutions Professionals Pvt Ltd) — Hyderabad
- **Technology Partner:** Fleetronix — Hyderabad
- **Authorised Signatory (Bid):** Lagishetty Vijay Kumar Setty, MD, USSPPL
- See [companies/README.md](companies/README.md) and [partner/README.md](partner/README.md)

## Key Facts

- **Total Scheme Value:** ₹463.90 Cr (Centre: ₹332.24 Cr, States: ₹131.66 Cr)
- **MoRTH retention:** ₹117.15 Cr (NIC Cloud + National PMU + MoRTH Dashboard)
- **Funding ratio:** 60:40 (most states), 90:10 (difficult terrain states), 100% (UTs)
- **Covered vehicles:** All public service vehicles registered on/after 1 Jan 2019 (older vehicles exempt until State notifies)
- **Commissioning deadline:** 31 Dec 2020
- **National PMU:** DIMTS Ltd. (fees = 2% of scheme value)
- **Backend hosting:** NIC Cloud
- **Standard:** AIS 140 (issued by ARAI for MoRTH)
- **Legal basis:** CMVR 125H (Central Motor Vehicles Rules, 1989) + MV Act 1988 §109(3)

## Extracted Documents

See `extracted/` folder for structured summaries:

1. [01-gazette-2018-notification.md](extracted/01-gazette-2018-notification.md) — Motor Vehicles (VLT Device and Emergency Button) Order, 2018
2. [02-scheme-overview.md](extracted/02-scheme-overview.md) — Jan 2020 Scheme objectives, mechanism, stakeholders
3. [03-funding-and-state-categories.md](extracted/03-funding-and-state-categories.md) — Cost table for all 37 States/UTs
4. [04-monitoring-centre-specs.md](extracted/04-monitoring-centre-specs.md) — Annexure B technical requirements
5. [05-application-proforma.md](extracted/05-application-proforma.md) — Annexure A (State/UT application form)
6. [06-implementation-guidelines.md](extracted/06-implementation-guidelines.md) — Annexure C general guidelines
7. [07-mou-template.md](extracted/07-mou-template.md) — MoU between MoRTH and State/UT
8. [08-milestones-and-payment.md](extracted/08-milestones-and-payment.md) — Payment terms, milestones, PMU structure
9. [09-fleetronix-gap-analysis.md](extracted/09-fleetronix-gap-analysis.md) — **Can Fleetronix deliver? Gap analysis vs AIS 140 + Nirbhaya MC requirements (narrative)**
10. [10-match-report.md](extracted/10-match-report.md) — **Same analysis as structured OpenSpecMatch engine output** (auditable)
11. [10-match-output.json](extracted/10-match-output.json) — Raw JSON match result from engine

### OpenSpecMatch fixtures
Source fixtures live in the engine package (not this folder):
- `packages/openspecmatch/examples/fleettronix-rfp/ais140-demand.ts` — AIS 140 scheme as DemandSpec
- `packages/openspecmatch/examples/fleettronix-rfp/ussppl-fleetronix-capability.ts` — combined bidder CapabilitySpec
- `packages/openspecmatch/examples/fleettronix-rfp/government-rfp-profile.ts` — `government-rfp` scoring profile (one-off)
- `packages/openspecmatch/examples/fleettronix-rfp/run-match.ts` — runner (regenerates `10-*.md/json`)

Re-run after edits:
```bash
cd packages/openspecmatch
npx tsx examples/fleettronix-rfp/run-match.ts > ../../projects/rfp/Fleettronix_VLTD_AIS140/extracted/10-match-output.json
npx tsx examples/fleettronix-rfp/run-match.ts --report > ../../projects/rfp/Fleettronix_VLTD_AIS140/extracted/10-match-report.md
```

## Entity Profiles & Leadership

- [**Project Leads** (Veena → USSP, Anuradha → Fleetronix)](extracted/project-leads.md)
- [Bidding entity — USSPPL](extracted/ussppl-profile.md)
- [Technology partner — Fleetronix](extracted/fleetronix-partner-profile.md)

## Raw Extracted Text

- `raw/gazette-raw.txt`
- `raw/vts-guidelines-raw.txt`
- `raw/company-ack-raw.txt`
- `raw/partner-fleetronix-raw.txt`
