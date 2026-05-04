# AIS 140 Sourcing & B2C Channel — Research Brief

> Working research output (2026-04-27) for the AP VLTD / AIS 140 engagement. Covers four questions raised after the Minister meeting:
>
> 1. Which India manufacturers already have AIS 140 / VLTD certification? Who do we approach for price quotes?
> 2. Which China telematics OEMs serve the India market and could provide AIS 140-compatible hardware (with our firmware) at FOB China pricing?
> 3. What does the AIS 140 certification path look like in time and cost?
> 4. For the 1.6M B2C mandate channel — who runs FASTag-style approved-vendor distribution in India, and who could we sub-contract to?
>
> All claims here are from public web research (April 2026) and need a confirmation step before they go into a bid.

---

## 1. India — AIS 140 / VLTD certified manufacturers (price-quote shortlist)

The official AIS 140 approved-supplier list is maintained by **ARAI / ICAT** under MoRTH (Ministry of Road Transport & Highways). The 20-Feb-2025 list contains company names, model numbers, TAC numbers, GNSS constellation, and validity dates. We should pull the latest dated copy directly from ARAI / ICAT before bidding.

### Outreach shortlist

| Vendor | Notes | Why on the list |
|---|---|---|
| **iTriangle Infotech** (Bengaluru) | Current OEM via Fleetronix — aQuila Bharat101 + IRNSS | Incumbent; benchmark price |
| **Blackbox GPS Technology** | Marketed as "first to get AIS 140 IRNSS cert from ARAI" | Strong cert posture, IRNSS native |
| **MapmyIndia** | ARAI certified AIS 140 GPS vehicle tracker | Brand reach + Indian map stack |
| **Watsoo** | AIS 140 ARAI-approved GPS trackers | Active in tenders |
| **LocoNav** | AIS 140 certified, fleet-mgmt platform | Cross-sell into B2C channel |
| **RelyEon** | AIS 140 device portfolio | India-focused |
| **Vamosys** (VAMO-17A) | ARAI cert, IRNSS | Chennai-based, channel experience |
| **Transync** | iCAT certified | Smaller player, may price aggressively |
| **GeoSafe (Geosafe Pro)** | ICAT-approved AIS 140 GPS device | Active in B2C |
| **Roadpoint** | ARAI / ICAT / AIS 140 approved | Multi-state distribution |
| **Tracksense** (Delhi) | AIS 140 GPS Tracker with IRNSS — INR 6,500/piece quoted on IndiaMart | Indicative retail benchmark |
| **Trakntell** | AIS 140 standard cert device | India-focused |

> Names above are commonly cited in 2026 industry write-ups. The authoritative source is the ARAI/ICAT supplier list — pull it before the outreach to avoid contacting expired-cert vendors.

### What to ask each vendor

1. AIS 140 device price — landed in AP — at three volume tiers: 10K, 25K, 50K, 100K, 500K, and 1M+ (we have a uniquely large opportunity, lead with the headroom).
2. Companion SOS / panic button — bundled and unbundled price.
3. AMC per vehicle per year.
4. Lead time and MOQ at each tier.
5. White-label / private-label option.
6. Their AIS 140 cert validity (TAC/COP expiry) — we don't want to land on a cert about to lapse.
7. AP State integration experience — done it before? VAHAN/Sarathi integration evidence.

### Indicative retail price band (from public sources, April 2026)

- **₹3,500 – ₹12,000** per AIS 140 GPS device, varying by 4G connectivity and OEM.
- This is retail; bulk Govt pricing should land materially lower.

---

## 2. China — telematics OEM candidates (FOB China track)

Three Chinese players dominate the global GPS-tracker manufacturing footprint and are widely deployed in India:

| OEM | Base | Indian-market posture |
|---|---|---|
| **Jimi IoT (Concox)** | Shenzhen — 70,000 m², 9 SMT lines, 10 assembly lines | India is one of their primary markets per industry sources |
| **Meitrack Group** | Shenzhen (since 2002) — 20,000 m² facility, offices in CA / HK / Taiwan | Innovator + leading manufacturer of GPS trackers |
| **Queclink Wireless Solutions** | China — telematics innovator, manufacturer | Active in fleet telematics globally |

Other names that come up for commercial fleet hardware: Coban, Howen, Topfly, Streamax, ATrack, Hangzhou Eelink. These are second-tier and need separate vetting.

### Critical constraint — IRNSS / NavIC support

AIS 140 requires the device to support **GAGAN** (the Indian GNSS augmentation system) and many State / RTO RFPs additionally require **IRNSS / NavIC** as the primary or secondary GNSS. The dominant Chinese OEMs build for global GPS markets first; IRNSS is a secondary path. In practice this means:

- **Module-level swap:** Chinese OEMs typically use Quectel / u-blox modules. IRNSS-capable modules (e.g. Quectel L26 series, u-blox NEO-M9N variants) exist — so the OEM can swap, but it is a hardware change and triggers re-cert.
- **Re-cert is the bottleneck**, not the manufacturing. See section 3.

### Practical posture for the China track

- **Track 1 — Off-the-shelf re-cert:** ask each OEM for an existing model that already has IRNSS or can take an IRNSS module without redesign. Get FOB China pricing + AIS 140 re-cert estimate.
- **Track 2 — Custom hardware with our firmware:** if an OEM is willing to ODM with USSPPL/Fleetronix firmware on an IRNSS-capable hardware variant, FOB cost may be lower but cert path is longer. Ask for ODM pricing + design lead time.
- **Track 3 — White-label assembled in India:** partner with the Chinese OEM but ship CKD/SKD into India for final assembly + label, keeps the cert path Indian and reduces optics / regulatory risk.

### Geopolitical optics

Sourcing AIS 140 hardware from China for an Indian Govt project carries political sensitivity. Mitigations: lead with the Indian OEM (iTriangle); use China track as leverage and Plan B; if used, route through Indian assembly + cert; have a clean supply-chain story before bid commercials are filed.

### Outreach plan

- **Channel A — via Ratish Nair** (already drafted, sent on user authorization). Ratish brings 2-3 vetted manufacturer recommendations + FOB pricing.
- **Channel B — direct** to the three primary OEMs (Jimi/Concox, Meitrack, Queclink) once Ratish channel returns intelligence. Direct outreach is a fall-back in case Ratish doesn't surface what we need.

---

## 3. AIS 140 certification path — time and cost

### Timeline

- **5–6 months end-to-end** for AIS 140 + VLTD certification through ARAI or ICAT (the two designated test agencies under NATRiP / National Automotive Board).
- A **factory audit on the manufacturer's premises is mandatory** for initial certification.
- **Certificate validity: 2 years** (renewable). Note: this differs from iTriangle's specific COP we hold (1-year validity, March 2027) — different sub-cert.

### Cost (public estimates — verify with ARAI/ICAT)

The web does not return a single canonical published price. Industry rules of thumb in 2026:

- COP testing + Type Approval Certificate (TAC) — **₹15–30 lakh per device variant** (test rounds + cert + factory audit).
- Firmware re-validation if firmware changes — typically **₹3–8 lakh** per round.
- Plus development cost if hardware needs adaptation — **₹10–30 lakh** depending on module change scope.

Net: a Chinese OEM device with our firmware likely needs **₹25–60 lakh** invested and **5–6 months calendar time** before it can be sold under AIS 140.

> These ranges are working estimates from public commentary, not quotes. **Get a written quotation from ARAI and ICAT directly** before relying on them in the bid.

### Certification entry points

- **ARAI** — Automotive Research Association of India, Pune. https://www.araiindia.com
- **ICAT** — International Centre for Automotive Technology, Manesar (Gurugram). The body that issued our current Bharat101 COP.
- Either can issue. Pick by: existing relationship (ICAT for us, given Bharat101 history), location of test bench, throughput on schedule.

---

## 4. Track B — FASTag-style approved-vendor channel for the 1.6M mandate

### How FASTag works (analogue for our planning)

- **NHAI / IHMCL** (Indian Highways Management Company) sets the standard and runs empanelment.
- **35+ authorised issuers** — primarily banks (HDFC, ICICI, SBI, Axis, IDFC First, Equitas, Yes, Karur Vysya, Federal, Karnataka, IndusInd) plus payment providers (Paytm, Airtel Payments Bank).
- Each issuer competes for the same vehicle-owner pool — distinguished by app UX, recharge ease, branch reach, retail price, customer support.
- **Agent / channel-partner network** below each issuer. Example: SiOnline Technomart is an authorised business correspondent of IDFC First Bank that recruits and runs FASTag agents across India.
- Vehicle owners: choose any issuer at any time, walk-in to a branch / toll plaza / dealer, or buy online; tag pasted on windshield.

### Mapping to VLTD mandate

| FASTag dimension | VLTD-mandate equivalent |
|---|---|
| Standard & empanelment | State Transport Department empanels AIS 140 vendors |
| Issuer | Approved VLTD vendor (we apply to be one) |
| Vehicle owner journey | Mandatory at registration / fitness / renewal — owner picks from approved list |
| Distribution | Dealer network + RTO install centres + online portal |
| Customer support | Issuer-owned (or in our model, sub-contracted) |
| Revenue model | Device + install + AMC + app subscription, recurring |

### What it takes to operate the channel

A subcontractor-led B2C build needs:

1. **Channel sales team** — geographic coverage across AP RTO districts.
2. **Install network** — RTO-adjacent install bays, certified technicians, install slots.
3. **Retail price book** — device + install + 1Y AMC bundle, with EMI / payment options.
4. **Payment + finance** — UPI, card, EMI partner (Bajaj Finserv, Pine Labs, Razorpay).
5. **Customer support** — call centre, mobile app, ticketing, escalation to install team.
6. **Fleet-owner mobile app** — install scheduling, vehicle tracking, AMC reminders, panic test.
7. **Marketing** — RTO-level field marketing, digital, FM radio, vernacular.
8. **Compliance reporting** — uptime, cert validity, customer complaints — to State Transport.

### Who could we sub-contract to?

We need a partner who already runs FASTag-style approved-vendor distribution in AP / India. Candidates fall into three groups:

#### Group 1 — Existing FASTag distributors / aggregators
- **SiOnline Technomart** — authorised business correspondent of IDFC First Bank for FASTag; runs the agent / dealer build that VLTD distribution would mirror.
- **Paytm / Airtel Payments Bank** — large aggregators with retail footprint; have done FASTag at scale.
- **HDFC Bank, ICICI Bank, IDFC First Bank** — branch-led FASTag distribution; could view VLTD as adjacent.
- **Bank-channel BCs** (business correspondents) like Fino Payments, NSDL Payments — built rural retail distribution; capable of VLTD distribution mechanically.

#### Group 2 — VLTD-experienced channel players (already in this market)
- **Vamosys** (Chennai) — has retail VLTD distribution muscle.
- **MapmyIndia** — mass brand, retail + B2C app + maps + tracking.
- **LocoNav** — fleet management + AIS 140 device, B2C-leaning.
- **Roadpoint / Watsoo / RelyEon / Trakntell** — multi-state VLTD distributors.

#### Group 3 — RTO / Govt-services BPOs already running citizen-facing operations in AP
- **Smart Chip / NICSI partners** — handle State digital service rollouts.
- **CSC e-Governance Services** — Common Service Centre network in AP rural; large agent footprint.
- **Telangana / AP-resident logistics + distribution firms** — known to State, easier to onboard.

### Recommended sub-contractor structure

USSPPL holds the AP State approved-vendor empanelment + supplies device + provides cloud platform. **Sub-contractor (selected from Group 1 or 2 above) operates the channel:** sales, install network, payment, support, fleet-owner app. Revenue split: USSPPL takes a margin per device + a SaaS share; sub-contractor keeps install fee + AMC margin + app subscription.

This keeps Veena / Vinay / Vijay's focus on Track A (B2G) and gives Track B operating leadership to a partner who already has the distribution muscle and a fixed-cost discipline different from a software firm's.

### How to identify the right sub-contractor

1. Pull FASTag's IDFC / SBI / Paytm channel-partner public lists.
2. Pull the ARAI/ICAT AIS 140 supplier list — find vendors with retail B2C distribution muscle (group 2).
3. Talk to 3-5 candidates from group 1 + group 2; ask for: AP retail footprint, install bay count, agent count, monthly device run-rate today, willingness to sub-contract.
4. Score on: AP coverage, install capability, financial strength, brand, willingness to be a sub-contractor (some firms will only operate as primes — those are out).
5. Take 2 finalists into commercial talks.

---

## 5. Next actions (mapped to project planner)

| # | Action | Track | Owner | Due |
|---|---|---|---|---|
| 1 | Pull latest ARAI / ICAT AIS 140 approved-supplier list | Sourcing | Anurag | 2026-05-02 |
| 2 | Outreach to 8 India OEMs from §1 — request quotes at 10K / 25K / 50K / 100K / 500K / 1M tiers | Sourcing | Anuradha | 2026-05-09 → 2026-05-30 |
| 3 | Send Ratish email re China FOB (drafted, awaiting Naren contact) | Sourcing | Vinay | 2026-04-30 |
| 4 | Contact Jimi/Concox, Meitrack, Queclink directly as fall-back to Ratish channel | Sourcing | Vinay | 2026-05-09 → 2026-05-23 |
| 5 | Get ARAI + ICAT written cert quotation (cost + calendar) for a hypothetical China device variant | Sourcing | Anurag | 2026-05-09 → 2026-05-30 |
| 6 | Build subcontractor candidate list for Track B (groups 1+2 above), 8-10 names | Channel (B2C) | TBD | 2026-05-09 → 2026-05-23 |
| 7 | Pull AP State approved-vendor / empanelment criteria for AIS 140 mandate | Channel (B2C) | TBD | 2026-05-09 → 2026-05-30 |
| 8 | Draft USSPPL empanelment application package for AP State approved-vendor list | Channel (B2C) | TBD | 2026-06-01 → 2026-07-15 |

---

## Sources

- [Top AIS 140 GPS Device Manufacturers in India (2026) — Watsoo](https://watsoo.com/blog/top-ais-140-gps-device-manufacturers-in-india/)
- [Top 10 AIS 140 GPS Tracking Devices in India (2026) — Watsoo](https://watsoo.com/blog/top-ais-140-gps-tracking-devices-in-india/)
- [ARAI AIS 140 GPS Approved GPS Tracking Devices — Roadpoint](https://www.roadpoint.in/ais-140-gps-tracking-devices.html)
- [ARAI approved AIS 140 GPS device (IRNSS) VAMO-17A — Vamosys](https://vamosys.com/ais140/)
- [VLT Device (AIS 140 Standard) — UP Govt VTSDGM](https://vtsdgm.up.in/en/vltddevice)
- [ARAI / ICAT / AIS 140 approved devices in Gujarat — Roadpoint](https://gujaratgps.roadpoint.in/icat-arai-ais-140-approved-gps-tracking-devices-in-gujarat.html)
- [ARAI Compliant AIS 140 Compliant GPS Vehicle Tracker — MapmyIndia](https://www.mapmyindia.com/ais140/)
- [AIS 140 GPS Tracker — RTO & ARAI Approved — GeoSafe](https://geosafepro.com/ais140-gps-tracker)
- [AIS 140 IRNSS Device — Blackbox GPS Technology](https://www.blackboxgps.net/blackbox-ais-140-irnss-device/)
- [List AIS 140 as on 20.02.2025 (ARAI/ICAT supplier list)](https://www.scribd.com/document/891928430/List-AIS-140-as-on-20-02-2025-Updated-12283)
- [AIS 140 Certification — Essential Guide — Transight Systems](https://transight.com/ais-140-certification-your-essential-guide-for-vehicle-tracking-compliance/)
- [Vehicle Type Approval India (ARAI CMVR)](https://www.araiindia.com/certification/certification/vehicle)
- [ICAT — International Centre for Automotive Technology](https://www.icat.in)
- [Concox / Jimi IoT — All-in-One IoT Solutions Provider](https://www.iconcox.com)
- [Meitrack — Supported GPS tracking devices (GPSWOX)](https://www.gpswox.com/en/supported-gps-trackers/meitrack)
- [Queclink — Supported GPS tracking devices (GPSWOX)](https://www.gpswox.com/en/supported-gps-trackers/queclink)
- [How it's made: Visiting Jimi and Concox factory — Navixy Talks](https://talks.navixy.com/trends/experience/how-its-made-jimi-and-concox-factory/)
- [FASTag — Wikipedia](https://en.wikipedia.org/wiki/FASTag)
- [Fastag — IHMCL (NHAI's FASTag operator)](https://ihmcl.co.in/fastag-user/)
- [Best FASTag Providers in India — Generali Central](https://www.generalicentralinsurance.com/blog/car-insurance/best-fastag-providers-in-india)
- [Become a FASTag Agent — SiOnline Technomart (IDFC First Bank BC)](https://www.sionline.co.in/learn-how-to-become-fastag-agent)
- [Tracksense AIS 140 GPS Tracker with IRNSS retail price reference (IndiaMart)](https://www.indiamart.com/proddetail/ais-140-gps-tracker-with-irnss-12648183848.html)
