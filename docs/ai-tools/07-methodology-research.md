# Chapter 7: Methodology & Research

[Back to Table of Contents](README.md) | [Previous: Reports](06-user-guide-reports.md)

---

## The Science Behind the Tool

This tool's methodology is grounded in **peer-reviewed research** and **industry-standard frameworks**. Every metric we track, every benchmark we cite, and every recommendation we make is backed by published science.

## Framework 1: DORA Metrics

**Source**: Forsgren, N., Humble, J., Kim, G. — *Accelerate: The Science of Lean Software and DevOps* (2018). Extended by annual State of DevOps Reports (2018-2024) from Google Cloud.

### What It Measures

Four key metrics that predict software delivery performance:

| Metric | Definition | Elite Benchmark | How AI Helps |
|--------|-----------|----------------|-------------|
| **Deployment Frequency** | How often code deploys to production | On-demand (multiple/day) | AI accelerates feature completion |
| **Lead Time for Changes** | Time from commit to production | < 1 hour | AI tools reduce coding time |
| **Change Failure Rate** | % of deployments causing incidents | < 5% | AI code review catches defects earlier |
| **MTTR** | Time to restore service after failure | < 1 hour | AI-assisted debugging reduces recovery |

### Why DORA Matters

The DORA team at Google demonstrated through **7 years of research** across **36,000+ professionals** that these four metrics correlate with organizational performance (profitability, market share, customer satisfaction).

## Framework 2: SPACE

**Source**: Forsgren, N., Storey, M-A., Maddila, C., Zimmermann, T., Houck, B., Butler, J. — *"The SPACE of Developer Productivity"* (ACM Queue, Vol. 19, Issue 1, 2021).

### The Five Dimensions

| Dimension | What It Captures | How We Measure |
|-----------|-----------------|----------------|
| **S — Satisfaction** | Developer happiness, tool satisfaction, burnout risk | Survey (1-5 Likert) |
| **P — Performance** | Quality of outcomes, reliability | Survey (1-5 Likert) |
| **A — Activity** | Volume of meaningful output | Survey (1-5 Likert) |
| **C — Communication** | Collaboration quality, review speed | Survey (1-5 Likert) |
| **E — Efficiency** | Time on valuable work vs toil, unblocked flow | Survey (1-5 Likert) |

### Key Principles from SPACE Authors

1. **No single metric is sufficient** — always measure at least 3 dimensions
2. **Mix perceptual with objective** — surveys alone or system data alone give incomplete pictures
3. **Activity is dangerous alone** — more PRs doesn't mean more value; always pair with Performance or Satisfaction
4. **Context matters** — the same metric can mean different things in different teams

## Framework 3: DevEx

**Source**: Noda, A., Storey, M-A., Forsgren, N. — *"DevEx: What Actually Drives Productivity"* (ACM Queue, Vol. 21, Issue 2, 2023).

### Three Core Dimensions

| Dimension | Definition | AI Impact |
|-----------|-----------|-----------|
| **Flow State** | Ability to focus without interruption | AI handles boilerplate → fewer context switches → more flow |
| **Feedback Loops** | Speed of build/test/review cycles | AI generates tests instantly → faster feedback |
| **Cognitive Load** | Mental effort to understand and work in the system | AI explains code, generates docs → reduced cognitive burden. BUT: over-reliance may reduce deep understanding |

## Empirical Studies We Reference

### GitHub Copilot Study (2023)
- **Authors**: Peng, S., Kalliamvakou, E., Cihon, P., Demirer, M.
- **Method**: Randomized controlled trial with 95 professional developers
- **Finding**: Copilot users completed tasks **55.8% faster** than the control group
- **Published**: arXiv:2302.06590

### Harvard / BCG Study (2023)
- **Authors**: Dell'Acqua, F., McFowland, E., Mollick, E., et al.
- **Method**: 758 BCG consultants using GPT-4 in controlled conditions
- **Findings**: AI users were **25% faster**, produced **40% higher quality**, completed **12.2% more tasks**
- **Critical insight**: The "jagged technological frontier" — AI misleads on tasks outside its capability
- **Published**: Harvard Business School Working Paper 24-013

### McKinsey Report (2023)
- **Title**: "Unleashing Developer Productivity with Generative AI"
- **Finding**: **20-45% productivity improvement** in software engineering tasks
- **Task breakdown**: Documentation (50%+), code generation (35-45%), debugging (variable)

### Forrester TEI (2023)
- **Title**: "The Total Economic Impact of GitHub Copilot"
- **Finding**: **22% developer productivity improvement**, $1.5M+ NPV for composite organization

## Statistical Rigor

Our methodology follows established best practices:

| Practice | Why |
|----------|-----|
| **Minimum 3 sprints** per period | Sufficient sample for reliable averages |
| **2-4 week ramp-up buffer** | Excludes learning curve from "after" measurement |
| **Novelty effect flagging** | Results >60% flagged as potentially inflated by initial excitement |
| **Quality co-measurement** | Speed improvements without quality checks are meaningless |
| **Goodhart's Law awareness** | Metrics are observational, not targets |

## Framework 4: DORA AI Capabilities Model (2025)

**Source**: Google DORA Team — *DORA AI Capabilities Model* (November 2025) and *State of AI-assisted Software Development* (2025). Available at [dora.dev/research](https://dora.dev/research/).

### The Amplifier Model

DORA's central 2025 finding: **"AI is an amplifier — it magnifies an organization's existing strengths AND weaknesses."** Organizations with strong foundations see AI multiply their performance; those with weak foundations see AI multiply their dysfunction.

This means measuring before/after productivity is not enough — you must also assess the **organizational readiness** that determines whether AI training will stick.

### 7 AI Capabilities

| # | Capability | What It Means |
|---|-----------|--------------|
| 1 | AI-Accessible Internal Data | AI is connected to internal docs, code, knowledge — not just generic |
| 2 | Clear AI Stance | Explicit, communicated organizational policy on AI use |
| 3 | Healthy Data Ecosystems | Internal data is high-quality, accessible, unified |
| 4 | Platform Engineering | Internal platforms provide automated, secure pathways for AI |
| 5 | User-Centric Focus | Teams build the right things, not just faster things |
| 6 | Version Control Maturity | Safety net for AI-accelerated change velocity |
| 7 | Working in Small Batches | Small increments to manage AI-driven velocity and risk |

### Three Tensions of AI Adoption

Based on analysis of 1,110 engineer survey responses, DORA identifies three tensions:

1. **Velocity vs Verification** — Time saved coding is re-spent auditing AI output ("verification tax")
2. **The Expertise Paradox** — AI lowers entry barriers but risks bypassing productive struggle needed for deep expertise
3. **The Workflow Gap** — AI accelerates prototyping but the last mile to production often neutralizes gains

### AI Trust Metric

Only **24% of developers trust AI-generated code** significantly (DORA 2025). Trust is a leading indicator — low trust means AI tools are available but not being used effectively. We track this as a survey dimension.

### Key Statistics

- 90% of technology professionals now use AI at work
- AI adoption is associated with BOTH increased throughput AND increased instability
- When platform quality is high, AI adoption strongly improves org performance
- When platform quality is low, AI adoption effect is negligible

## Full References

1. Forsgren, N., Humble, J., Kim, G. (2018). *Accelerate: The Science of Lean Software and DevOps.* IT Revolution Press.
2. Forsgren, N., Storey, M-A., et al. (2021). "The SPACE of Developer Productivity." *ACM Queue*, 19(1).
3. Noda, A., Storey, M-A., Forsgren, N. (2023). "DevEx: What Actually Drives Productivity." *ACM Queue*, 21(2).
4. Peng, S., et al. (2023). "The Impact of AI on Developer Productivity." *arXiv:2302.06590*.
5. Dell'Acqua, F., et al. (2023). "Navigating the Jagged Technological Frontier." *HBS Working Paper 24-013*.
6. McKinsey & Company (2023). "Unleashing Developer Productivity with Generative AI."
7. Forrester Research (2023). "The Total Economic Impact of GitHub Copilot."
8. Google DORA Team (2024). *State of DevOps Report 2024.*
9. Google DORA Team (2025). *State of AI-assisted Software Development.* [dora.dev/research](https://dora.dev/research/)
10. Google DORA Team (2025). *DORA AI Capabilities Model.* [dora.dev/capabilities](https://dora.dev/capabilities/)

---

[Next: Government & Compliance →](08-government-compliance.md)
