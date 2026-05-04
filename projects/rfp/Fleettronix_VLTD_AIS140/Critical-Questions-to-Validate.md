# Critical Questions — Scope Validation Before We Bid

> Working note (2026-04-27). The information shared verbally by the Minister and vendors needs official confirmation before USSPPL commits commercials. This document captures the critical questions to send to:
>
> - **AP Transport Department officials** (scope, structure, empanelment)
> - **AP DoIT** (technical, integration, data, security)
> - **Device vendors** (commercial response — can be sent in parallel, doesn't block scope validation)
>
> Vendors are already asking for pricing; we can run sourcing outreach while scope validation is in flight. The two streams unblock each other only when we go to commercial submission.

---

## A. To AP Transport Department — scope and structure (BLOCKING)

These determine whether we have one project or two, and whether the bid motion looks like B2G or empanelment-led B2C.

1. **Is this a single engagement or two distinct programmes?**
   - Direct Govt tender for ~80,000 public service vehicles
   - Mandate-driven AIS 140 fit on ~1,600,000 yellow-tag / commercial vehicles
   - Are these released under one RFP, two RFPs, or one RFP + a separate empanelment process?
2. **When will the formal RFP issue?** Indicative quarter / month.
3. **For the 80K direct tender — is teaming permitted?** Specifically: an Indian-incorporated prime (USSPPL) with a named technology subcontractor (Fleetronix Systems Pvt Ltd).
4. **For the 1.6M mandate — is the model B2C with State-empanelled approved vendors?** Confirm:
   - Is there an existing AP State approved-vendor list for AIS 140 VLTD?
   - If yes, when is it next open for new applications?
   - If no, when is the empanelment scheme being notified?
5. **Mandate trigger** — when does fitment become compulsory for a commercial vehicle owner? At new registration, at next fitness check, at renewal, or by an absolute calendar deadline?
6. **Is the approved-vendor list multi-vendor (open competition among empanelled vendors) or limited / single-vendor?**
7. **For the 1.6M mandate, who sets the price the vehicle owner pays?**
   - State-capped retail price (FASTag-style)
   - Vendor-discretionary
   - State-published price-band with floor/ceiling
8. **What is the State's role in the 1.6M mandate — beyond empanelment?** Specifically:
   - Does the State operate any portion of the install / payment / customer-support flow?
   - Or is the State purely a regulator that publishes the vendor list and monitors compliance?
9. **How does data from the 1.6M B2C-installed devices reach the State Monitoring Centre?** Vendor pushes to a State-defined API, or the State runs the data plane?

## B. To AP Transport — RFP and bid mechanics (BLOCKING)

10. **Eligibility criteria** — turnover, technical experience, AIS 140 cert, prior State references, MSME / startup preference, geographic preference.
11. **Evaluation framework** — technical / commercial weightage, qualifying technical score before commercials are opened.
12. **Bid security (EMD) and performance bond** — typical amounts and forms accepted.
13. **OEM tying** — must the device OEM be declared in the bid? Is OEM substitution post-award permitted?
14. **Single-OEM or multi-OEM bid permitted?** (Affects whether we anchor on iTriangle alone or a multi-OEM panel.)
15. **Award timeline post-bid submission** — typical AP cadence?
16. **Mobilisation period after award** — time allowed to commission first district.

## C. To AP Transport / DoIT — technical and operational (HIGH)

17. **AIS 140 amendment level required** — Amd 2:2018, or a later amendment that AP is asking for?
18. **GNSS requirement** — GPS only, GAGAN, IRNSS / NavIC mandatory or optional?
19. **AP Transport backend integration** — is the integration specification public? Or released only with the RFP? Test bench / sandbox available pre-bid?
20. **AP Police emergency systems** — protocol, expected response SLAs, escalation hierarchy.
21. **VAHAN and Sarathi integration** — required at go-live or phased?
22. **Monitoring Centre** — vendor-built and State-owned, vendor-built and vendor-operated, or vendor-built and operated under managed-services contract?
23. **Centre staffing** — State staff, vendor staff, or hybrid?
24. **Operating SLAs the State will enforce** — uptime, panic-event response time, device replacement TAT.
25. **Data residency** — must device data and Centre infrastructure stay in India / in AP / on State cloud?
26. **CERT-In empanelment** — required up-front, or deliverable post-award?
27. **Audit cadence** — what does the State plan for cyber audit, integrity audit, CAG audit?

## D. To AP Transport — commercial and funding (HIGH)

28. **For the 80K direct tender — Centre 60 : State 40 funding pattern still applies?**
29. **Payment milestones for the 80K tender** — typical cadence (mobilisation, install, commissioning, AMC quarterly).
30. **AMC scope** — included in core bid or separate AMC contract?
31. **For the 1.6M mandate — is there any State subsidy, or fully vehicle-owner-paid?**
32. **Tax treatment** — GST applicability, particularly for the B2C channel.

## E. To AP DoIT — technology stack (MEDIUM)

33. **Which State cloud?** AP State Data Centre, MeghRaj, NIC Cloud, or commercial cloud allowed?
34. **Identity** — State e-Sign / Aadhaar requirements at install or owner sign-up?
35. **Open-source mandate** — any policy on open-source vs proprietary stack?

## F. To AP Transport — operational scope (MEDIUM)

36. **District phasing** — preferred sequence for the 80K rollout (one district pilot, then waves)?
37. **Field-ops responsibility** — install bays at RTO premises, or vendor-leased install centres?
38. **Vehicle-fitment certification** — does the vendor sign off, or does an RTO inspector?

---

## G. Critical questions to vendors (parallel — sourcing outreach)

These can go out in parallel with scope validation. They unblock our commercial position even before scope is confirmed.

### To India AIS 140 OEMs (iTriangle, Blackbox, MapmyIndia, Watsoo, LocoNav, Vamosys, GeoSafe, Roadpoint, RelyEon, Trakntell, Tracksense)

1. AIS 140 cert chain — TAC and COP numbers, validity dates, issuing agency (ARAI / ICAT).
2. Device + companion SOS-button price, ex-works and landed in AP, at volume tiers: **10K / 25K / 50K / 100K / 500K / 1M+**.
3. Bundle vs unbundled price (with and without panic button).
4. AMC per vehicle per year.
5. Lead time and MOQ at each tier.
6. White-label / private-label option and incremental cost.
7. AP State integration experience — VAHAN, Sarathi, AP Transport, AP Police; any deployment references in AP.
8. IRNSS / NavIC support — native or via module variant.
9. Firmware customisability — can our integration / playbook be embedded.
10. References — 3 State Govt customers with deployment scale and contact.

### To China telematics OEMs (via Ratish + direct: Jimi/Concox, Meitrack, Queclink)

1. Models that already support **IRNSS / NavIC** (or can take IRNSS module without redesign).
2. FOB China price for VLTD + companion SOS button at the same tiers above.
3. Bundle vs unbundled price.
4. ODM / white-label option — can they ship with our firmware or our brand label.
5. **AIS 140 cert support** — willingness to participate in ARAI / ICAT cert process; cost and time their side.
6. Indian assembly option — willingness to ship CKD/SKD for assembly in India.
7. India-market deployment references and partners.
8. Lead time and MOQ at each tier.
9. Power / SIM / connectivity variants available.
10. After-sales and warranty terms.

### To ARAI and ICAT (cert path quote)

1. Written quotation for AIS 140 + VLTD certification of a hypothetical new device variant.
2. Time estimate end-to-end (test rounds, factory audit, TAC + COP issuance).
3. Renewal cycle and cost.
4. Treatment of firmware-only changes vs hardware changes.
5. Treatment of an OEM whose factory is in China but whose final assembly + packaging is in India.

---

## Validation approach

1. Identify the right official to send §A and §B to. Romi / Veena / Vinay decide who at AP Transport receives the formal letter.
2. Identify the right contact at AP DoIT for §C and §E.
3. Send §G in parallel — sourcing outreach to vendors does not need scope confirmation to start.
4. Set a target turnaround — official replies in ~10 working days; vendor replies in ~14 working days.
5. Track responses in the project planner under PURSUIT (scope validation) and SOURCING (vendor responses).

---

## What changes if scope confirms B2G + B2C channel

If the 1.6M mandate is in fact a State-empanelled B2C channel (as the FASTag analogue suggests):

- USSPPL applies for State empanelment as an approved AIS 140 VLTD vendor (does not depend on winning the 80K tender).
- USSPPL does **not** operate the channel directly. We sub-contract the channel to a partner who already runs FASTag-style or VLTD-retail distribution in AP / India.
- Track A (80K) and Track B (1.6M) become two parallel plans; Track A is the anchor reference and revenue priority; Track B is volume + recurring revenue at lower margin per device.

## What changes if scope confirms B2G only (no separate B2C track)

- Track A is the entire engagement.
- Phase 11 Approved Vendor Channel in the planner is parked or removed.
- Sourcing volume target collapses from 1.68M back to ~80K — sourcing leverage drops, but still significantly larger than the original 20-50K assumption.
