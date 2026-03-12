# Edge AI — Deployment Plan: Path to IDJJ

**Date:** March 2026
**Goal:** Build deployment track record to credibly pitch IDJJ/IDOC
**Partner:** ATRI AI
**Origin:** Dinkar (Krasan CEO) feedback — no proof, large integrators own the space

---

## Working Backward from IDJJ

### What IDJJ will require before saying yes:

1. **Proof the technology works in a duty-of-care environment** — not a demo, not a slide deck. Live deployment, real data.
2. **Staff-to-youth ratio monitoring** — this is their #1 use case. SB1366 compliance, continuous monitoring, audit logs.
3. **Injury/incident detection** — detecting fights, falls, person-down events. Real-time alerts to staff.
4. **BIPA compliance** — no facial recognition, no biometrics. Must be airtight.
5. **On-premises / no cloud** — correctional facilities won't send video to the cloud.
6. **Reliability numbers** — accuracy rate, false positive rate, uptime over 60+ days.
7. **A credible partner** — either Krasan backing the pitch (TOPS), or enough proof that IDJJ trusts USSP directly.

### What we need to prove before approaching IDJJ:

| IDJJ Requirement | How We Prove It | Where We Prove It |
|---|---|---|
| Staff-to-child/youth ratio monitoring | Deploy and measure accuracy over 60-90 days | Childcare center |
| Person counting accuracy >95% | Ground truth comparison (manual vs. system) | Childcare center |
| Injury/fall detection | Deploy, measure true positive and false positive rates | Launch (40 cameras) |
| Scale (multi-camera, multi-zone) | 40-camera deployment running reliably | Launch |
| Uptime >99% | Run for 60-90 days, log downtime | Both facilities |
| BIPA compliance | Architecture review — no biometrics by design | Both facilities |
| Alert response improvement | Measure time from event to staff response | Childcare center |

---

## Available Facilities (Investor-Owned)

### Facility 1: Childcare Center
- Cameras already installed in hallways
- Regulated environment with duty-of-care obligations
- Staff-to-child ratio requirements (directly analogous to juvenile justice)
- Smaller scope, faster to deploy

### Facility 2: Launch Family Entertainment Center
- 40 cameras planned
- High foot traffic
- Injury detection use case (kids, physical activity areas)
- Proves scale

---

## Phased Plan

### Phase 1: Childcare Center (Start Here)

**Why first:** This is the closest thing to IDJJ that we control. Staff-to-child ratios, unattended zone detection, child safety — it's the same problem. Existing cameras mean we can deploy faster. Smaller scope means fewer things go wrong.

**Deploy:**
- Staff-to-child ratio monitoring (real-time counting by zone)
- Unattended zone detection (child in area, no staff present)
- Headcount accuracy vs. manual counts
- Entry/exit tracking by zone

**Measure (minimum 60-90 days):**
- Person counting accuracy vs. ground truth
- False positive rate on alerts
- False negative rate (missed events)
- System uptime
- Alert-to-response time (if staff act on alerts)

**Risks:**
- Hallway cameras have limited angles — accuracy may be lower than open rooms
- Childcare is not corrections — government buyer may note the difference
- If the system is unreliable, it becomes a negative reference
- Privacy with children — inform parents/guardians even though no facial recognition is used

**Success criteria (define before deploying):**
- Person counting accuracy: >95%
- False positive alert rate: <5%
- System uptime: >99%
- At least one measurable operational improvement

---

### Phase 2: Launch Entertainment Center (40 Cameras)

**Why second:** Proves scale and adds injury detection capability. 40 cameras running reliably is a real proof point. High foot traffic generates volume data.

**Deploy:**
- Everything from Phase 1
- Injury/fall detection (define exactly what this means with ATRI before deploying)
- Crowd density monitoring
- Zone occupancy and capacity alerts

**Measure:**
- All Phase 1 metrics at 40-camera scale
- Injury/fall detection: true positive rate, false positive rate
- System performance under load (peak vs. off-hours)

**Risks:**
- Injury detection is significantly harder than person counting. ATRI's models may need tuning.
- Entertainment center is less directly relevant to IDJJ than childcare
- 40 cameras = real infrastructure to manage (networking, storage, device maintenance)
- If injury detection accuracy is poor, don't reference it until it's fixed

**Success criteria:**
- All Phase 1 criteria maintained at scale
- Injury/fall detection accuracy: >90% (confirm realistic target with ATRI)
- False positive rate for injury alerts: <10%

---

### Phase 3: Package the Evidence

**Before approaching IDJJ, assemble:**

1. **Data** — real numbers from Phase 1 and 2. Detection accuracy, uptime, false positive rates, alert response times.
2. **Case summary** — 1-2 pages per facility. What was deployed, how many cameras, how long it ran, what the results were. No marketing language.
3. **Live dashboard** — show the system running. Screen-share or in-person. More convincing than any document.
4. **Use case mapping** — explicitly map childcare staff ratios → juvenile justice staff ratios. Same technology, same problem, different facility. Spell it out for the buyer.
5. **Limitations** — what worked, what didn't, what was tuned. Government buyers respect honesty.

**What you can say:**
- "We're running this in two US facilities — here are the numbers"
- "Staff-to-child ratio monitoring has X% accuracy over Y days"
- "The system detected Z events with a W% false positive rate"

**What you cannot say:**
- "We've deployed in corrections" — you haven't
- "This is proven in high-security environments" — it isn't yet
- That it replaces staff — it supplements staff monitoring

---

### Phase 4: IDJJ Approach

**Prerequisite:** Phase 1 data collected. Phase 2 underway or complete.

**Reality: USSP accesses IL government through Krasan (TOPS prime), not directly.**
USSP is a subvendor. Krasan controls the government relationship. Dinkar (Krasan CEO) must agree to present the offering before USSP can pitch any state agency.

**Approach options (in order of strength):**

1. **Through Krasan (TOPS) — this is the primary path.** Share Phase 1/2 results with Dinkar. TeleRay + Axis + VionOS.ai as a complete package may be more convincing than Edge AI alone. If Dinkar is convinced, he includes it in a TOPS task order proposal.
2. **Find another TOPS prime** — if Krasan won't move, explore other TOPS prime vendors willing to sub to USSP. Less ideal but keeps the door open.
3. **Direct to agency (outside TOPS)** — offer a free pilot directly to IDJJ. Bypasses TOPS but requires full RFP process for any funded engagement. Slower, but builds the relationship.
4. **Find an internal champion at the agency** — one person at IDJJ who cares about youth safety technology. Show them the dashboard. They advocate internally, which may pull Krasan into the conversation from the agency side.

**What IDJJ will ask and how to answer:**

| Question | Answer |
|---|---|
| "Have you deployed in corrections?" | "Not yet. We've deployed in a childcare facility with the same use case — staff-to-child ratio monitoring. Here are the results." |
| "What about liability?" | Position as supplemental monitoring, not replacement for staff. Get legal advice on disclaimers. |
| "Is this BIPA compliant?" | Yes. No facial recognition, no biometrics, no PII. Architecture is compliant by design. |
| "Who is ATRI?" | "Our technology partner with live deployments in India and an active project in California. USSP handles all US deployment, compliance, and support." |
| "What if it misses something?" | "The system supplements staff, it doesn't replace them. Here are our accuracy numbers." |

---

## Timeline (Realistic)

| Phase | Duration | Dependency |
|---|---|---|
| Phase 1: Childcare | 2-3 months (deploy + 60-90 day run) | ATRI partnership agreement, Jetson hardware |
| Phase 2: Launch (40 cameras) | 2-4 months (can overlap with Phase 1 data collection) | Phase 1 learnings, injury detection model readiness |
| Phase 3: Package evidence | 2-4 weeks | Phase 1 data complete |
| Phase 4: IDJJ approach | When Phase 3 is ready | Krasan buy-in or direct IDJJ contact |

**Earliest realistic IDJJ conversation with proof: ~4-6 months from now if Phase 1 starts soon.**

---

## Key Principle

Don't rush to IDJJ. A failed pilot is worse than no pilot. Get the technology working reliably in environments you control, collect honest data, then approach with real numbers. The per-camera pricing and TOPS vehicle make procurement easy — the hard part is earning trust. That's what this plan is for.
