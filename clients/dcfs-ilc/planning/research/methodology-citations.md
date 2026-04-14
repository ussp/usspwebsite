# DCFS ILC — Research Methodology & Citations

> **Purpose:** Every metric we track must be backed by peer-reviewed research or industry standards. This document maps our measurement framework to its academic/industry foundations.
> **Use:** Reference in rollout plan, presentations to Jim, and playbook introductions.

---

## Measurement Design: Goal-Question-Metric (GQM)

Our overall approach follows the **GQM Paradigm** — the canonical methodology for designing software measurement programs, developed at University of Maryland in collaboration with NASA.

1. **Goal:** Improve DCFS ILC team productivity and quality by 5%+ via AI augmentation
2. **Questions:** What metrics characterize that improvement? (defined via executive discovery interview)
3. **Metrics:** Specific measurements to answer each question (selected from frameworks below)

> Basili, V. R., Caldiera, G., & Rombach, H. D. (1994). The Goal Question Metric Approach. In *Encyclopedia of Software Engineering* (pp. 528-532). Wiley.

---

## Quality Frameworks

### ISO/IEC 25010:2023 — Product Quality Model (SQuaRE)

The international standard defining 8 quality characteristics and 31 sub-characteristics. Gold standard for government engagements.

**Relevant characteristics for DCFS:**
- **Functional Suitability** — Completeness, Correctness, Appropriateness
- **Maintainability** — Modularity, Analysability, Modifiability, Testability
- **Reliability** — Maturity, Fault tolerance

Companion standard **ISO/IEC 25023:2016** provides measurement formulas:
- Functional Correctness = 1 - (Incorrect results / Total results)
- Modifiability = 1 - (Modifications causing degradation / Total modifications)

> ISO/IEC. (2023). *ISO/IEC 25010:2023 Systems and software engineering — SQuaRE — Product quality model.* International Organization for Standardization.

### Quality User Story (QUS) Framework

13 criteria across 3 dimensions for evaluating user story quality. Validated on 1,023 stories from 18 companies.

| Dimension | Criteria |
|-----------|---------|
| **Syntactic** | Well-formed, Atomic, Minimal |
| **Semantic** | Conceptually Sound, Problem-oriented, Unambiguous, Conflict-free |
| **Pragmatic** | Full Sentence, Estimatable, Unique, Uniform, Independent, Complete |

Companion tool **AQUSA** automates quality defect detection using NLP.

> Lucassen, G., Dalpiaz, F., van der Werf, J. M. E. M., & Brinkkemper, S. (2016). Improving agile requirements: the Quality User Story framework and tool. *Requirements Engineering*, 21(3), 383-403.

---

## Productivity & Delivery Frameworks

### DORA / Accelerate (Google DevOps Research & Assessment)

4 key metrics validated across 23,000+ respondents, 2,000+ organizations over 7+ years:

| Metric | Dimension | Direction |
|--------|-----------|-----------|
| Deployment Frequency | Throughput | Higher = better |
| Change Lead Time | Throughput | Lower = better |
| Change Failure Rate | Stability | Lower = better |
| Mean Time to Recovery | Stability | Lower = better |

**Key finding:** Speed and stability are correlated, not conflicting. High performers excel at both.

> Forsgren, N., Humble, J., & Kim, G. (2018). *Accelerate: The Science of Lean Software and DevOps.* IT Revolution Press.

### SPACE Framework (Microsoft Research / ACM)

5 dimensions — no single metric is sufficient:
- **S**atisfaction, **P**erformance, **A**ctivity, **C**ommunication, **E**fficiency

**Rule:** Always measure at least 3 dimensions spanning at least 2 SPACE categories. Prevents gaming.

> Forsgren, N., Storey, M.-A., et al. (2021). The SPACE of Developer Productivity. *ACM Queue*, 19(1), 20-48.

---

## Before/After Measurement Methodologies

### CMMI Performance Results (SEI / Carnegie Mellon)

Median results across 60 organizations implementing process improvement:

| Dimension | Median Improvement |
|-----------|--------------------|
| Productivity | 62% |
| Quality (defects) | 50% |
| Schedule | 37% |
| Cost | 20% |

> Gibson, D. L., Goldenson, D. R., & Kost, K. (2006). Performance Results of CMMI-Based Process Improvement. *Technical Report CMU/SEI-2006-TR-004.* Carnegie Mellon University.

### Six Sigma / Lean — Applied to Software

| Metric | Definition | Application |
|--------|-----------|-------------|
| **First Pass Yield (FPY)** | Stories passing QA on first attempt / total | Story quality |
| **Rework Rate** | Items requiring rework / total delivered | Waste measurement |
| **Cost of Poor Quality (COPQ)** | Hours on rework x blended rate | Budget impact |
| **DPMO** | Defects per million opportunities | Process capability |

Uses **DMAIC cycle** (Define, Measure, Analyze, Improve, Control) — explicitly a before/after framework.

> Harry, M. J., & Schroeder, R. (2000). *Six Sigma: The Breakthrough Management Strategy.* Currency/Doubleday.

### Defect Removal Efficiency (DRE) — Capers Jones

- **DRE** = Defects found before release / Total defects (including 90-day post-release)
- U.S. average: ~85%. Best-in-class: >99%
- Testing alone: <50% efficient. Combined inspections + static analysis + testing: >95%

> Jones, C. (2008). *Applied Software Measurement: Global Analysis of Productivity and Quality.* 3rd ed. McGraw-Hill.

---

## Government-Specific Standards

### NIST Software Quality Group

Develops methods and standard reference data for software quality assurance. NIST standards are mandatory for federal agencies per FISMA.

> National Institute of Standards and Technology. Software Identification and Quality Metrics. https://www.nist.gov/itl/ssd/software-quality-group

---

## Industry Benchmarks

### McKinsey Developer Productivity (2023)

Recommends layered dashboard: DORA (system) + SPACE (team/individual) + opportunity metrics (business alignment). Reports 20-45% productivity improvement from developer experience investments.

> Amin, K., et al. (2023). Yes, you can measure software developer productivity. *McKinsey & Company.*

### Agile Quality Measurement Systematic Mapping (2022)

Identified 107 quality metrics and 223 quality indicators across agile contexts. Top dimensions: Reliability, Maintainability, Performance.

> Lopez, L., et al. (2022). Quality measurement in agile and rapid software development: A systematic mapping. *Journal of Systems and Software*, 186, 111187.

---

## How Our Metrics Map to Research

| Our Metric | Research Backing |
|-----------|-----------------|
| Sprint velocity | DORA (throughput), SPACE (activity) |
| Cycle time | DORA (lead time), Lean (flow efficiency) |
| Story quality score | QUS 13-criteria framework (Lucassen 2016) |
| Story rejection rate | Six Sigma rework rate, ISO 25023 functional correctness |
| Test coverage | ISO 25010 testability, NIST test adequacy |
| First pass yield | Six Sigma FPY |
| Defect density | Capers Jones DRE, CMMI quality metrics |
| Documentation coverage | ISO 25010 maintainability (analysability) |
| Planning accuracy | SPACE (performance), CMMI schedule variance |
| Requirement clarity | QUS semantic dimension, SPACE (communication) |
| SPACE survey | Forsgren et al. 2021 (ACM) |
| DevEx survey | Noda et al. 2023 (ACM) |

---

*Every metric in our framework traces to published, peer-reviewed research or international standards. This is not an ad-hoc measurement approach — it's grounded in the same methodologies used by Google, Microsoft Research, Carnegie Mellon SEI, and ISO.*
