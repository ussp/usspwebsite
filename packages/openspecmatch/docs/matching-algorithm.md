# OpenSpecMatch — How Matching Works

> **Audience:** Recruiters, account managers, and hiring managers.
> This document explains how candidates are scored against positions so you can interpret results and improve match quality.

---

## Overview

OpenSpecMatch compares **what a position needs** (requirements) against **what a candidate offers** (capabilities) and produces a score from 0–100 with a detailed breakdown.

The system evaluates **7 matching dimensions**:

| # | Dimension | What It Checks | Weight |
|---|-----------|---------------|--------|
| 1 | **Technical Skills** | Programming languages, frameworks, tools, platforms | 35% |
| 2 | **Domain Knowledge** | Industry experience, sector (federal/state/commercial/nonprofit/education) | 15% |
| 3 | **Education** | Degree level and field of study | 10% |
| 4 | **Certifications** | Required and preferred certifications | 8% |
| 5 | **Soft Skills** | Leadership, mentoring, collaboration, communication | 7% |
| 6 | **Location & Work Mode** | City/metro match, remote/hybrid/onsite compatibility | 5–20% |
| 7 | **Compliance** | Security clearances, regulatory frameworks (HIPAA, FedRAMP, etc.) | Varies |

> Weights shown are for the **software-engineer** profile. Healthcare and government profiles weight differently (see Scoring Profiles below).

---

## How Each Skill Is Scored

Every requirement is matched against the candidate's capabilities using **4 factors**:

### 1. Taxonomy Match (Primary)

We maintain a classification tree of 500+ skills, certifications, and domains. When a position requires "Python" and a resume mentions "Python", that's an **exact match** (100%). But we also recognize:

| Match Type | Score | Example |
|-----------|-------|---------|
| **Exact** | 100% | "Python" ↔ "Python" |
| **Child** | 80% | "Cloud" required ↔ "AWS" found (AWS is a child of Cloud) |
| **Parent** | 70% | "Kubernetes" required ↔ "Container Orchestration" found |
| **Sibling** | 50% | "React" required ↔ "Angular" found (both are frontend frameworks) |
| **Related** | 30% | "PostgreSQL" required ↔ "MySQL" found (both relational DBs, different branch) |
| **No Match** | 0% | "Python" required ↔ nothing found |

**What this means for you:** A candidate with Angular experience will get partial credit for a React requirement, but not full credit. This is intentional — they can learn, but they're not a direct match today.

### 2. Level Fit

We assess proficiency on a 5-point scale:

| Level | What It Means | Typical Indicators |
|-------|--------------|-------------------|
| **Awareness** | Knows it exists | Mentioned in passing, tutorial only |
| **Beginner** | Can do basic tasks | < 1 year, intern work, simple projects |
| **Intermediate** | Works independently | 1–3 years, delivered features in production |
| **Advanced** | Leads and architects | 3–7 years, mentored others, complex systems |
| **Expert** | Recognized authority | 7+ years, large-scale systems, published/spoke |

If a position requires "Advanced Python" and the candidate has "Intermediate Python":

- **Exact match or higher:** 100% of skill score
- **One level below:** 70% of skill score
- **Two levels below:** 30% of skill score

### 3. Evidence Strength

Stronger proof = higher score. We look for:

- **Experience with duration:** "Built ML pipelines for 3 years" → strong
- **Certifications:** "AWS SAA certified" → strong
- **Just mentioned:** "Familiar with Python" → weak

How much evidence matters depends on the role profile:
- Software engineering: 30% weight (skills matter more than proof)
- Healthcare: 60% weight (licenses and verified experience are critical)

### 4. Recency

Skills used recently score higher than skills from years ago. A skill used in the last 6 months gets full recency credit. After 36 months (configurable), the recency score drops to 50%.

---

## Location Matching

Location scoring depends on the work mode:

### Remote Positions
- Location is **5% of total score** — nearly irrelevant
- Any candidate from any location matches well

### Hybrid Positions
- Location is **15% of total score**
- Same city = 100%, Same metro area = 90%, Same state = 70%
- Different state = 35% (unless relocation OK)

### Onsite Positions
- Location is **20% of total score**
- Same city = 100%, Same metro area = 90%
- Same state but different city = 55% (commute concern)
- Different state = 20% (likely won't work without relocation)

### Metro Area Recognition
We recognize 20+ major metro areas. Examples:
- "Evanston" matches "Chicago" (same metro)
- "Arlington, VA" matches "Washington DC" (same metro)
- "Oakland" matches "San Francisco" (same metro)

### Work Mode Compatibility

| Position Needs | Candidate Prefers | Result |
|---------------|-------------------|--------|
| Remote | Remote | Exact match |
| Remote | Hybrid | Compatible |
| Remote | Onsite | Compatible (mild mismatch) |
| Hybrid | Hybrid | Exact match |
| Hybrid | Onsite | Compatible |
| Hybrid | Remote | **Mismatch** — may not come to office |
| Onsite | Onsite | Exact match |
| Onsite | Hybrid | Compatible |
| Onsite | Remote | **Mismatch** — candidate wants remote |

---

## Sector & Organization Type Matching

The system tracks **7 organization sectors**:

| Sector | Examples |
|--------|---------|
| **Federal Government** | DOD, HHS, VA, DHS, GSA, NASA, IRS |
| **State Government** | State IT/CIO, DCFS, State DOT, IDES, Corrections |
| **Local/Municipal** | County government, city IT, public transit, parks |
| **Commercial** | Startups, enterprise, consulting, product companies |
| **Nonprofit** | Social services, advocacy, faith-based, healthcare NPOs |
| **Education** | K-12, charter schools, universities, edtech, community colleges |
| **Healthcare** | Hospitals, outpatient, long-term care, behavioral health, pharma |

**Why this matters:** A position at DCFS (state government, child welfare) needs someone who understands government workflows, compliance, and agency culture. A candidate from a SaaS startup has transferable technical skills but is missing the domain context.

Sector experience is scored as domain knowledge — exact sector match scores high, related sectors (e.g., federal → state) get partial credit, unrelated sectors get no credit.

---

## Certification Matching

Certifications are matched against our taxonomy of 60+ certifications across:

- **Cloud:** AWS (8 certs), Azure (7 certs), GCP (3 certs)
- **Security:** CISSP, CISM, CEH, CompTIA Security+, Network+
- **Project Management:** PMP, CSM, PSM, SAFe, ITIL
- **Kubernetes/Data:** CKA, CKAD, Snowflake, dbt
- **Healthcare:** RN License, LPN, CNA, BLS, ACLS, PALS, NP

### Required vs Preferred
- **Required certifications** are scored as **mandatory** — missing them significantly reduces the score
- In **healthcare profiles**, missing a required certification (like RN license) = **automatic disqualification** (score drops to 0)
- **Preferred certifications** give bonus points but don't penalize if missing

### How Cert Matching Works
- "AWS Solutions Architect" on the resume matches "AWS SAA" in the requirement (alias resolution)
- Related certs get partial credit: "AWS Developer Associate" gets some credit for "AWS Solutions Architect" requirement (sibling in the AWS cert tree)
- Expired certifications are flagged (when dates are available)

---

## Compliance & Security Clearance

The system tracks 14+ compliance frameworks:

| Framework | Typical Sector |
|-----------|---------------|
| HIPAA | Healthcare |
| FedRAMP / StateRAMP | Government cloud |
| FISMA / NIST 800-53 | Federal IT |
| CMMC / ITAR | Defense |
| CJIS | Law enforcement |
| PCI-DSS | Payment processing |
| SOX | Financial services |
| FERPA | Education |
| Section 508 / ADA | All government |
| Security Clearance (Secret, TS/SCI, Public Trust) | Federal/defense |

Compliance requirements are scored as **mandatory** — if a position requires HIPAA experience, candidates without it take a significant scoring hit.

---

## Scoring Profiles

Different position types use different scoring rules:

### Software Engineer Profile (default)
- Technical skills weighted highest (35%)
- Mandatory items don't auto-disqualify — they just score lower
- Evidence matters moderately (30%)
- Skills stay relevant for 36 months

### Healthcare Clinical Profile
- Certifications weighted highest (35%)
- **Mandatory gate ON** — missing a required license = score 0, disqualified
- Evidence matters heavily (60%) — years of experience and specific settings matter
- Skills stay relevant for 24 months (clinical practice must be current)

### Custom Profiles
You can create custom profiles for specific roles (e.g., government IT, data science, nursing). A profile controls:
- Category weights (what matters most)
- Whether mandatory items are hard gates or soft penalties
- How much evidence quality affects scores
- How fast skills "decay" from staleness

---

## Reading a Match Result

### Overall Score (0–100)
- **80+:** Strong match — high-priority candidate
- **60–79:** Good match — worth interviewing, some gaps to discuss
- **40–59:** Partial match — significant gaps but has transferable skills
- **20–39:** Weak match — major domain or skill mismatch
- **0–19:** No match — wrong profile for this position

### Confidence (0–100)
How confident the system is in the score. Low confidence means the resume didn't have enough information to score accurately.
- **80+:** High confidence — plenty of data
- **50–79:** Moderate — some gaps in resume data
- **Below 50:** Low — resume was too sparse to score reliably

### Mandatory Gate
- **PASSED:** All required items were found
- **FAILED:** One or more required items are missing → score is 0

### Strengths / Gaps / Not Found
- **Strengths:** Requirements scored 70+ (candidate has this)
- **Gaps:** Requirements scored below 50 (candidate is weak here)
- **Not Found:** Requirements with no matching data on the resume

---

## Tips for Better Matches

1. **Be specific with requirements.** "Python" is better than "programming". "AWS Solutions Architect" is better than "cloud cert".

2. **Separate required from preferred.** Required skills get mandatory weight. Preferred skills give bonus points without penalizing.

3. **Include the sector.** Marking a position as "state government" or "federal" dramatically improves matching for candidates with relevant government experience.

4. **Set the right work mode.** "Remote" opens the candidate pool nationally. "Onsite" in "Chicago" limits to the Chicago metro area.

5. **Use the right profile.** Healthcare positions should use the healthcare-clinical profile (licenses are hard gates). Tech positions use the software-engineer profile.

6. **Compliance matters.** If the position requires HIPAA, FedRAMP, or a security clearance, add it — candidates without it will be appropriately penalized.
