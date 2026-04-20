# Gazette of India — MV (VLT Device & Emergency Button) Order, 2018

**Source:** `GAZETTE OF INDIA.pdf`
**Notification No.:** S.O. 5453(E) / RT-11028/12/2015-MVL
**Issuing Authority:** Ministry of Road Transport and Highways (MoRTH), Government of India
**Signed by:** Priyank Bharti, Jt. Secretary
**Published:** 26 October 2018 (signed 25 October 2018)
**Legal Basis:** Sub-section (3) of Section 109, Motor Vehicles Act, 1988
**Effective:** Date of publication in Official Gazette
**Applies to:** All public service vehicles per Rule 125H of CMVR 1989

## Short Title

"Motor Vehicles (Vehicle Location Tracking Device and Emergency Button) Order, 2018"

## Overall Approach (Clauses a–m)

| Ref | Responsibility |
|---|---|
| (a) | VLT device manufacturers → get devices tested & certified by testing agencies per CMVR Rule 126 |
| (b) | States/UTs → enforce CMVR 125H; check VLT fitment & functional status during fitness certification |
| (c) | Vehicle owners → free to choose any Type-approved VLT manufacturer |
| (d) | Command & Control Centres (set up by State/manufacturer/authorized agency) → provide AIS 140 code-of-practice interface to: State ERSS, Transport Dept/RTO, MoRTH & designated agency, device mfrs & dealers, testing agencies, permit holders |
| (e) | C&C Centres → feed VAHAN / state DB with speeding & device health data |
| (f) | VLT mfrs → upload device details to VAHAN via secure authenticated access; install + register devices with vehicle details on backend in real-time |
| (g) | Vehicle owners → ensure devices are working + sending data via cellular |
| (h) | VLT mfrs → annual Conformity of Production testing |
| (i) | Testing agencies → upload certified device details + COP status to VAHAN |
| (j) | States/UTs → publish IP address + SMS gateway details of their emergency response system |
| (k) | VLT mfrs/dealers → configure state IP + SMS gateway into devices during installation |
| (l) | VLT mfrs/dealers → comprehensive warranty/maintenance + cellular connectivity: **2 years for new PSVs**, **1 year for others** |
| (m) | VLT mfrs → may offer value-added services beyond mandatory per owner agreement |

## Annexure — VAHAN Integration of Retro-Fitted VLT Devices

### Requirements

1. Fitted VLT devices must be **Type Approved per AIS:140**
2. After type approval, **NIC issues unique username/password** to each VLT manufacturer for uploading data to VAHAN
3. VLT manufacturers upload per device:
   - a) Make & model
   - b) Type Approval Certificate (TAC) and/or Conformity of Production (COP) certificate
   - c) IMEI number
   - d) ICC ID number
   - e) **Unique Identification Number** (format below)
4. Authorized dealer enters Unique ID in VAHAN to link device to specific PSV (or vehicle mfr if installed at factory)
5. RTOs verify Unique ID during fitness testing

### Unique ID Format

| Segment | Length | Content |
|---|---|---|
| 1 | 4 chars | Alpha-numeric — manufacturer name |
| 2 | 2 chars | Alpha-numeric — model name |
| 3 | 1 char | Alphabetical — test agency code |
| 4 | 4 digits | Month/year of manufacture (MMYY) |
| 5 | 8 digits | Production serial number |

### Test Agency Codes

| Code | Agency |
|---|---|
| A | Automotive Research Association of India (ARAI) |
| C | Central Institute of Road Transport (CIRT) |
| I | International Centre for Automotive Technology (iCAT) |
| V | Vehicle Research & Development Establishment (VRDE) |
| F | Central Farm Machinery Training & Testing Institute |
| P | Indian Institute of Petroleum |
| G | Global Automotive Research Centre, Chennai |
