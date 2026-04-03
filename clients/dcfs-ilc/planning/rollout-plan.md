# DCFS ILC — AI Productivity Rollout Plan

> **Status:** DRAFT — Due April 17, 2026
> **Owner:** Vinay (USSP) + Romi (Crescent)
> **Audience:** Jim Doherty (CIO), Crescent leadership

---

## 1. Executive Summary

<!-- TODO: Write after onboarding and tool assessment are complete -->

Crescent proposes a structured AI augmentation pilot across select ILC product teams to achieve a measurable productivity improvement. The approach is: **Train → Pilot → Measure → Playbook → Scale.**

Target: **5%+ improvement in team velocity and delivery efficiency** over one PI cycle.

---

## 2. Current State Assessment

### What We Know

- 12 SAFe product teams, 160+ consultants
- Current velocity data available per team (story points per sprint)
- Client satisfied with current delivery
- Environment deployment issues recently resolved
- No AI augmentation currently in place

### Pre-Existing Observations

- Informal Copilot testing showed mixed results:
  - AI amplifies quality — good input → better output; bad input → worse output
  - Rovo (JIRA AI) outperforms Copilot for story writing (has Confluence context)
  - Pure AI-generated content without human guidance is poor quality
  - BA skill is the critical factor in AI effectiveness

---

## 3. Approach: Train → Pilot → Measure → Playbook → Scale

### Phase 1: Discovery & Baseline (Apr 7–30)

- [ ] Obtain and review State of Illinois AI policy (DoIT)
- [ ] Audit available AI tools: JIRA Rovo capabilities, Copilot deployment status
- [ ] Understand per-role workflows (BA, Tester, Developer, Data)
- [ ] Define baseline metrics (see Section 5)
- [ ] Collect baseline measurements from JIRA for selected teams
- [ ] Select pilot teams and participants
- [ ] Design role-specific training curriculum

### Phase 2: Training (Late April / Early May)

- [ ] Deliver structured AI training per role before tools go live
- [ ] Cover: effective prompting, tool capabilities, limitations, guardrails
- [ ] Role-specific sessions: BA track, Tester track, Developer track, Data track
- [ ] Document the "do's and don'ts" based on state AI policy

### Phase 3: Pilot Execution (May–July, 1 full PI)

- [ ] AI-augmented teams operate with new tools and practices
- [ ] Non-AI teams continue as-is (control group)
- [ ] Weekly check-ins: what's working, what's not, adjustments
- [ ] Continuous data collection against baseline metrics

### Phase 4: Results & Playbooks (End of Pilot PI)

- [ ] Compile measurement results: AI teams vs baseline vs control
- [ ] Produce role-based playbooks (BA, Tester, Developer, Data)
- [ ] Executive summary for Jim with recommendations
- [ ] Go/no-go recommendation for full rollout across all 12 teams

---

## 4. Target Roles & AI Applications

| Role | AI Tool | Use Case | Expected Benefit |
|------|---------|----------|-----------------|
| **Business Analyst** | Rovo (JIRA AI) | Story quality validation, acceptance criteria generation, gap analysis | Faster story authoring, higher first-pass quality |
| **Business Analyst** | Rovo + Confluence | Story review against defined quality checklist | Reduced review/approval cycles |
| **Tester** | Rovo / Copilot | Generate test scripts from acceptance criteria | Faster test creation, better coverage |
| **Developer** | GitHub Copilot | Code completion, Dynamics plugin development | Faster development, fewer context switches |
| **Data Team** | TBD | TBD (Chase to identify use cases) | TBD |

---

## 5. Baseline Metrics

<!-- TODO: Finalize with client agreement before PI Planning -->

### Velocity Metrics

| Metric | Source | How to Measure |
|--------|--------|---------------|
| Sprint velocity | JIRA | Avg story points completed per sprint per team |
| Story cycle time | JIRA | Avg days from "In Progress" to "Done" by story point size |
| Sprint completion rate | JIRA | % of committed stories actually delivered per sprint |

### Efficiency Metrics (by role)

| Metric | Role | How to Measure |
|--------|------|---------------|
| Story authoring time | BA | Avg time from story creation to "Ready for Dev" |
| Story approval cycle | BA/PO/PM | Avg time from draft to approved |
| Test script creation time | Tester | Avg time to produce test scripts per story |
| Story rejection rate | BA | % of stories sent back for rework after review |
| Defect escape rate | Tester | Defects found in later stages vs caught in testing |

### Quality Metrics

| Metric | Source | How to Measure |
|--------|--------|---------------|
| Story quality score | Manual/AI assessment | Checklist-based: clarity, acceptance criteria, completeness |
| Documentation completeness | Confluence | TBD — qualitative assessment |
| Rework rate | JIRA | Stories reopened or sent back |

---

## 6. Approved Tools & Constraints

### Available Now

- **Atlassian Rovo** (JIRA AI) — requires Confluence integration
- **Confluence** — in use, critical for context

### Available Soon (need deployment)

- **GitHub Copilot** — purchased by state, not yet rolled out to teams

### Hard Constraints

- **No autonomous code generation** — firm state boundary
- **No external AI tools** without rigorous state approval process
- **Must comply with DoIT AI policy** — Robert bridging policy to engagement
- **No sensitive data in AI prompts** — child welfare data is highly sensitive

---

## 7. Pilot Team Selection Criteria

<!-- TODO: Romi + John + Chase to finalize -->

- Select 2-3 teams for AI pilot, remaining teams as control group
- Prefer teams with:
  - Strong BAs who can evaluate AI output quality
  - Engaged scrum leads open to process changes
  - Representative workload (not outlier teams)
- Each pilot team needs at minimum: 1 BA, 1 Tester, 1 Developer in the program

---

## 8. Risk Register

| Risk | Impact | Mitigation |
|------|--------|-----------|
| State pulls AI tools mid-pilot (CMS precedent) | High | Clear governance alignment upfront; stay within policy; document everything |
| AI makes stories/tests worse (garbage in, garbage out) | Medium | Training first; quality checklist; human review required |
| Copilot not deployed in time | Medium | Start with Rovo (already available); Copilot is additive |
| Baseline metrics not available in JIRA | Medium | Manual collection or proxy metrics; agree on what's feasible |
| Pilot teams not representative | Low | Selection criteria; multiple teams |
| Sensitive data exposure via AI tools | High | Training on data handling; no PII in prompts; align with state policy |

---

## 9. Success Criteria

| Criterion | Target |
|-----------|--------|
| Velocity improvement (pilot teams) | >= 5% over baseline |
| Story authoring time reduction | >= 10% reduction |
| Test script creation time reduction | >= 15% reduction |
| Story quality score improvement | Measurable improvement on checklist |
| Team satisfaction | Positive feedback from pilot participants |
| Playbooks produced | 1 per role (BA, Tester, Developer, Data) |

---

## 10. Timeline

| Date | Milestone |
|------|-----------|
| Apr 7–17 | Discovery, tool assessment, baseline definition |
| **Apr 17** | **This plan finalized and shared with Romi/Dinkar** |
| Apr 17–30 | Pilot team selection, training material development |
| Late Apr | Springfield trip — present plan to Jim |
| May 5–7 | PI Planning — AI pilot begins with new PI |
| May–July | Pilot execution (1 full PI) with weekly check-ins |
| End of PI | Results compiled, playbooks delivered, rollout recommendation |

---

## 11. Deliverables

1. **This rollout plan** (Apr 17)
2. **Baseline metrics report** (before PI Planning)
3. **Training materials** per role (before pilot start)
4. **Weekly status updates** (during pilot)
5. **Pilot results report** (end of PI)
6. **Role-based playbooks** — BA, Tester, Developer, Data (end of PI)
7. **Executive recommendation** for full rollout (end of PI)

---

## Appendix A: Open Questions

- [ ] What is the specific State of Illinois / DoIT AI policy?
- [ ] When will GitHub Copilot be deployed to teams?
- [ ] What JIRA data is available for baseline measurement? Can we pull cycle time reports?
- [ ] Which specific teams are best candidates for pilot?
- [ ] What process documentation exists in Confluence? How complete is it?
- [ ] Are there any data handling restrictions specific to child welfare domain?
- [ ] What does the ISI (PM vendor) process documentation look like?
- [ ] Can Rovo be configured to use project-specific Confluence spaces?

---

*Draft created April 3, 2026. To be refined through discovery phase (Apr 7–17).*
