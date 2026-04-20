# Monitoring Centre — Technical Specifications (Annexure B)

**Source:** Letter VTS Guidelines, Annexure B, Pages 14–16

## 1. Minimum Features

All Monitoring Centres must be AIS 140 compliant and include:

### Software

- Vehicle tracking + monitoring software per AIS 140
- Application hosted on **NIC Cloud**
- Map service / data per AIS 140
- Mobile application
- Protocol integration for all type-approved VLT manufacturers in State/UT
- m2m / telecom service provider integration (SIM activation + validity)
- SMS gateway / packages
- Data Sharing API with MoRTH
- SSL + Security certificates (CERT-IN)

### Data Retention

- **Online storage (all data):** 3 months
- **Online storage (alerts data):** 2 years
- **Archive storage (all data):** minimum 2 years
- Emergency-tagged data: **never deleted** (evidence preservation)

### Equipment (minimum)

- Video wall — one set of 55" LED, 2x2 matrix
- Desktop computers (OS + Office suite)
- Multi-functional printer
- UPS
- Network switch
- Connectivity

### Operations

- Manpower for MC operations + helpdesk
- Testing + certification per AIS 140
- Helpdesk: phone, email, web complaint (for VLT mfrs, Transport Dept, permit holders)

---

## 2. System Features

### 2.1 Real-Time Tracking

- Live location on map
- Vehicle status info
- Playback of earlier paths (as per AIS 140)

### 2.2 Secure Communication & Device Management

- Integration with all AIS 140-approved VLT vendor protocols
- Authenticated device-to-backend connections
- m2m / telecom service provider integration
- Command & alert handling per AIS 140

### 2.3 Installation, Registration, Activation & Service

- SIM validity management
- Activation SMS
- Health check
- VAHAN integration for activation status
- SIM activation/validity/KYC via m2m/telecom integration

### 2.4 Web Interface to VLT Vendors for Tagging

- Initial tagging: vehicle mfr / dealer / VLT mfr / registered agency
- Tagging integrated with VAHAN / state vehicle registration system
- RTO verifies + approves during fitness check
- Activation per AIS 140 process after tagging

### 2.5 Monitoring Centre Operations

- Real-time monitoring
- Quick alert response
- Enforcement assistance

### 2.6 Map Services

- GIS map of State/UT
- Compliant with Survey of India map guidelines
- Functionalities:
  - **Real-time plotting** (single/multiple, clustered view for large fleets)
  - **Points of Interest (POI):** schools, hospitals, police, banks, ATM at scale ≥1:25000
  - **Geo-fencing:** zones (school, hospital), route-based, POI-based — admin add/edit/delete
  - **Map tools:** Zoom, Pan
  - **Track & Trip View:** online current location + trip history playback
  - **Multi-filter:** by category, speed, location, vehicle number

### 2.7 Alerts & Messages

| Alert Type | Description | Priority |
|---|---|---|
| **Emergency Alert** | Passenger/crew presses emergency button → routed to ERSS **+** MC | **Highest** |
| **Speed Violation** | Vehicle exceeds speed limit → info to nearest enforcement unit | High |
| **Geo-fence Alert** | Enter / exit / both — Point, Area, Route | Medium |
| **VLT Device Tampering** | Power cable disconnect / physical tamper → server notified | High |

### 2.8 Reports

- Device installation
- Device uptime
- Alert counts by type
- Route report
- Distance report
- Speed violation report
- Fleet summary
- Alert reports

### 2.9 Integration

- **VAHAN** — mandatory for vehicle registration data
- **ERSS / other emergency response** — mandatory linkage
- **Legacy state systems** — optional

### 2.10 Data Archival

Storage tiers (see above). Evidence data never deleted. Archive can be on separate storage per State/UT policy.

### 2.11 Stakeholder Access

Role-based access per AIS 140, MoRTH guidelines, or State/UT discretion.

### 2.12 Health Monitoring

- Periodic health checks of VLT device + Emergency buttons
- Tamper attempt → alert to MC

### 2.13 Web Interface for Vehicle Owners

Owner can track their own vehicles.

### 2.14 Data Exchange with External Systems

- Real-time sharing via APIs
- Example: inter-state message exchange platform
- Per AIS 140 or MoRTH specification

### 2.15 Data Sharing with MoRTH

- APIs for VLTD implementation compliance monitoring
- Per AIS 140 or MoRTH notifications

---

## 3. Responsibility Matrix

| # | Activity | MoRTH | State/UT | NIC/VAHAN |
|---|---|:-:|:-:|:-:|
| 1 | Finalize Scheme | ✓ | | |
| 2 | Set up National PMU | ✓ | | |
| 3 | Sign MoU | ✓ | ✓ | |
| 4 | Select Implementation Agency | | ✓ | |
| 5 | Release funds to States/UTs | ✓ | | |
| 6 | State contribution per guidelines | | ✓ | |
| 7 | Implement MC | | ✓ | |
| 8 | VAHAN integration | | | ✓ |
| 9 | Data sharing by MC with MoRTH | | ✓ | |
| 10 | State PIU + nodal officer | | ✓ | |
| 11 | O&M of MC | | ✓ | |
