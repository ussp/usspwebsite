# Scheme Overview — Jan 2020 VTS Guidelines

**Source:** `Letter VTS Guidelines-compressed (2).pdf`
**Reference No.:** RT-16011/1/2018-T
**Issuing Authority:** MoRTH, Transport Division
**Letter signed by:** Sudip Dutta, Under Secretary (Tel: 011-23357125)
**Dated:** ~13 January 2020 (letter) / Guidelines document 2020

## Background & Timeline

| Date | Event |
|---|---|
| 28 Nov 2016 | MoRTH notification mandating VLTD + Emergency Buttons in all PSVs |
| 1 Apr 2018 | Original enforcement date for fitment |
| 18 Apr 2018 | Exemption issued — difficulties setting up Monitoring Centres |
| 25 Oct 2018 | MV (VLT Device and Emergency Button) Order, 2018 notified (S.O. 5453(E)) |
| 31 Dec 2018 | Cut-off — all PSVs registered up to this date exempt till State notifies |
| 1 Jan 2019 | All new PSVs MUST have VLTD + Emergency Buttons |
| Jan 2020 | Scheme letter issued for Monitoring Centre setup under Nirbhaya Framework |
| 15 Feb 2020 | Deadline for States/UTs to apply for funds |
| 31 Dec 2020 | Deadline for Monitoring Centre commissioning |

## Objectives

1. Enhance safety of women and girl children in public passenger transport (cabs, taxis, buses)
2. Equip all PSVs with VLT devices + emergency buttons for distress alerts
3. Each State/UT sets up its own Monitoring Centre to handle alerts and coordinate with ERSS

## System Overview

- **Front-end:** AIS 140-compliant VLT device + emergency buttons installed in vehicle
- **Data flow:** Vehicle → Monitoring Centre (and ERSS) via cellular connectivity
- **Alerts:** Location, health, over-speed, emergency press — periodicity per AIS 140
- **SOP:** State-defined SOP for handling alerts
- **Access:** Web-based (desktop) for Transport Department officials
- **Dual routing:** Full ERSS states get direct + MC routing; partial ERSS states route via MC to manual aid/police dispatch

## Implementation Mechanism

- **Owner of enforcement:** State Government (CMVR 125H is state responsibility)
- **Central support:** MoRTH provides funding via Nirbhaya Fund (administered by MWCD)
- **Funding cap:** Must not exceed amounts in Para 5.5 (see funding table)
- **Host:** NIC Cloud (mandatory for backend)
- **Interim compliance:** Until MC setup, states use VAHAN / state vehicle registration system for any backend per SO 5453
- **RTO role:** Enforce fitment/function at registration / permit issuance / renewal / fitness check
- **Dashboard:** MoRTH Dashboard (built by DIMTS Ltd.) aggregates data from all state MCs

## Stakeholders

| Role | Entity |
|---|---|
| Central funder / coordinator | MoRTH (Transport Division) |
| National PMU | DIMTS Ltd. (3-year tenure, 3 FT resources) |
| Cloud host | NIC |
| Vehicle DB | VAHAN |
| State implementer | State Transport Department + State PIU + optional State PMC |
| Emergency routing | State ERSS |
| Device certification | ARAI, CIRT, iCAT, VRDE, CFMTTI, IIP, GARC |
| Device supply | VLT manufacturers + authorized dealers |
| Vehicle operator | PSV owners (responsible for retrofit in old vehicles) |

## MoRTH PMU Activities (DIMTS)

- Scrutinize State/UT funding applications
- Monitor Scheme implementation
- Coordinate among stakeholders (States/UTs, MCs, NIC)
- Verify implementation/operation reports
- Reconcile payments vs utilization certificates
- Resolve AIS 140 / notification queries
- Quarterly scheme review + improvement suggestions
- Periodic (per milestone) physical state visits

## PMU Staffing

- 1 Senior resource (7+ years experience)
- 2 Resources (3+ years experience)
- Plus subject matter experts on demand
- **Fees:** 2% of scheme value + GST
  - 1% payable half-yearly in advance over 36 months
  - 1% payable quarterly alongside state milestone releases
