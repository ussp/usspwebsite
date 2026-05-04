# DoIT AI Policy Compliance Map — DCFS ILC AI Pilot

> **Version:** V04222026
> **Status:** Draft — pending David Nika + Jim Daugherty review
> **Owner:** Vinay Lagisetty (AI Transformation Leader, Krasan)
> **Policy basis:** State of Illinois DoIT Policy on the Acceptable and Responsible Use of Artificial Intelligence (effective April 1, 2025)
> **Framework basis:** NIST AI Risk Management Framework 1.0 (Jan 2023)

---

## 1. Purpose

Demonstrate how the DCFS Illinois Connect AI pilot complies with the State of Illinois DoIT AI Policy. This document is a per-section mapping of the policy to our operational controls, training, artifacts, and evidence.

This is a **living document**. Updated when the policy changes, when our controls change, or when a new audit item surfaces.

---

## 2. Scope of this map

Covers the DCFS ILC AI pilot (13 weeks, Intact team, 5 roles). Tools in scope: GitHub Copilot, Atlassian Rovo, Microsoft 365 Copilot, Dynamics 365 Copilot.

Out of scope: anything touching DCFS protected data, case data, or PII — AI tools operate on code, stories, documentation, and configuration artifacts only.

---

## 3. Section-by-section compliance

### 3.1 Compliance summary

| # | DoIT Section | Requirement | Our Approach | Status |
|---|--------------|-------------|--------------|--------|
| 1 | **4a** | Non-discrimination / bias mitigation | Bias awareness training for all pilot participants; per-sprint spot check of AI-generated content for bias patterns | ✅ Covered |
| 2 | **4b** | No protected data in AI systems without authorization | No DCFS case data, PII, or protected state data in AI prompts; enforced by training + spot checks | ✅ Covered |
| 3 | **4d** | Human-in-the-loop on AI decisions | HITL on 100% of AI output — developer accepts/edits every suggestion; peer review + PR approval before commit | ✅ Covered |
| 4 | **4f** | No access to protected data without Agency Head authorization | AI tools process code + JIRA stories + documentation only. No case data, CANTS data, or PII ever enters prompts | ✅ Covered |
| 5 | **5a-c** | Transparency — disclose AI use | Written disclosure to all pilot participants; AI-assisted deliverables labeled as such | ✅ Covered |
| 6 | **5d** | Human reviews AI output before use | Same as 4d — developer reviews before acceptance; peer review + PR gate before commit | ✅ Covered |
| 7 | **5e** | State data use for AI requires Agency Head written consent | **Open question: does Copilot on ILC source code = "State data for AI"?** Our interpretation: source code is not protected state data. **Awaiting written determination from David Nika** | ⏳ Pending |
| 8 | **5f** | AI System Assessment Report + Agency Head signoff + 30-day advance notice to DoIT | **Assessment report drafting in progress. 30-day notice to be filed after David's direction on template + owner** | ⏳ Pending |
| 9 | **6** | Continuous human oversight | Weekly Pilot Governance Team review; per-sprint bias + quality spot checks; incident response path defined | ✅ Covered |
| 10 | **7** | Continuous monitoring + documentation | Metrics dashboard (tools.ussp.co); JIRA + GitHub audit trail; weekly reviews in Pilot Governance Charter §5 | ✅ Covered |
| 11 | **11** | Bias mitigation — regular reviews + corrective action | Per-sprint bias spot checks; documented review process; corrective action logged in Change Request Register | ✅ Covered |
| 12 | **12** | Security reporting process | AI security awareness training; incident reporting channel in Teams; escalation path in Pilot Governance Charter §9 | ✅ Covered |

**Summary:** 10 of 12 sections fully covered. 2 sections (5e, 5f) pending David Nika's direction in Apr 22 meeting.

---

## 4. Operational controls — how we enforce compliance

### 4.1 Human-in-the-loop (§4d, §5d, §6)

| Control | Enforcement |
|---------|-------------|
| Developer must review + accept every AI suggestion | Training + PR checklist |
| Peer review required on every AI-assisted PR | GitHub branch protection rules |
| Code merged only after PR approval | GitHub required-reviewer setting |
| Per-sprint spot check of AI output quality | Pilot Governance Lead (weekly) |
| No autonomous AI commits | Policy + tooling — no CI/CD auto-apply of AI suggestions |

### 4.2 Data boundaries (§4b, §4f)

| Control | Enforcement |
|---------|-------------|
| No DCFS case data in prompts | Training + spot checks + incident reporting |
| No PII in prompts | Training + automated prompt scanning (optional, future) |
| Source code only | Tooling configuration limits Copilot scope to approved repositories |
| JIRA stories only — no personal records | Training + per-sprint review |
| Maximus / federal-reporting data excluded | Training + DCFS Data Privacy Lead oversight |

### 4.3 Transparency (§5a-c)

| Control | Enforcement |
|---------|-------------|
| Pilot participants acknowledge AI-use disclosure | Onboarding paperwork (tracked in Teams channel) |
| AI-assisted deliverables labeled in commit messages | PR template + commit message standard |
| Stakeholders (POs, business reps) told when AI is in use | Weekly status report |
| Documentation flags AI-generated sections | Doc template standard |

### 4.4 Bias mitigation (§4a, §11)

| Control | Enforcement |
|---------|-------------|
| Bias awareness training | Required in Foundation training track |
| Per-sprint bias spot check | Pilot Governance Lead — part of weekly spot check |
| Corrective action logged | Change Request Register |
| Regular review cycle | Weekly (spot check) + mid-pilot checkpoint |

### 4.5 Security (§12)

| Control | Enforcement |
|---------|-------------|
| AI security awareness training | Required in Foundation training |
| Incident reporting channel | Teams "DCFS AI Rollout" channel, dedicated incident thread |
| Escalation path | Pilot Governance Charter §9 — Pilot team → AI Transformation Lead → Pilot Governance Lead → CIO |
| Response SLAs | Data leak: 1 hr · Tool breach: 4 hr · Metric decline >20%: weekly meeting |

---

## 5. Evidence artifacts

All compliance evidence lives in the "DCFS AI Rollout" Teams channel (shared tab).

| Artifact | Policy section | Cadence |
|----------|----------------|---------|
| Training completion records (all pilot participants) | 4a, 5a-c, 11, 12 | Once, pre-pilot |
| AI disclosure acknowledgments | 5a-c | Once, pre-pilot |
| Guardrail document sign-offs | 4b, 4d, 4f, 5d | Once, pre-pilot |
| DoIT 30-day notice + correspondence | 5f | Once + updates |
| Per-sprint audit trail exports (JIRA + GitHub) | 6, 7 | Weekly |
| Weekly Pilot Governance meeting minutes | 6, 7 | Weekly |
| Bias spot-check log | 4a, 11 | Weekly |
| Incident reports (if any) | 12 | Ad hoc |
| Change Request Register | 11, 7 | Per CR |
| Mid-pilot assessment | 7 | Once (~Jun 10) |
| End-of-pilot compliance summary | All | Once (~Jul 20) |

---

## 6. Open items (pending David Nika input)

| # | Item | Dependency | Target resolution |
|---|------|------------|-------------------|
| 1 | **§5e determination:** Does Copilot operating on ILC source code count as "State data for AI purposes"? | David's written determination | Apr 22 meeting + follow-up within week |
| 2 | **§5f notice:** Template, owner, whether parallel work is permitted during the 30-day window | David's direction + DCFS compliance/policy person | Apr 22 meeting |
| 3 | Assessment report format (whatever DCFS/DoIT precedent requires) | Template from DCFS | Before 30-day filing |

---

## 7. Compliance posture statement

DCFS pilot governance operates under this posture:

> **DCFS governs; Krasan executes and reports.**
> AI suggests; human decides.
> Code and stories only; no protected data, no PII, no case data.
> Every AI output reviewed by a human before acceptance; every accepted suggestion reviewed again via PR before merge.
> All activity auditable via JIRA transitions + GitHub history.
> Weekly review by DCFS Pilot Governance Team.
> Escalation to CIO on any safety or compliance concern within one hour.

---

## 8. Sign-off

| Role | Name | Signed | Date |
|------|------|--------|------|
| Executive Sponsor | Jim Daugherty (DCFS CIO) | | |
| Interim AI Lead | David Nika (Deputy CIO, Data Management) | | |
| Pilot Governance Lead | *DCFS designee — TBD* | | |
| AI Transformation Lead | Vinay Lagisetty (Krasan) | | |

---

## 9. Version history

| Version | Date | Changes |
|---------|------|---------|
| V04222026 | 2026-04-22 | Extracted from framework deck `slides/A3-governance.html`. Expanded into standalone deliverable. Pending sign-off. |
| *(pre-version)* | 2026-04-13 | Initial compliance mapping draft as part of Jim meeting prep. |

---

## 10. Conversion to Word

```bash
# From planning/deliverables/
pandoc compliance-map-v04222026.md -o compliance-map-v04222026.docx \
  --reference-doc=../../assets/krasan-word-template.docx \
  --toc --toc-depth=2
```

## 11. References

- **Governance Proposal:** [`governance-proposal-v04142026.md`](governance-proposal-v04142026.md) — the two-phase team structure
- **Pilot Governance Charter:** [`pilot-governance-charter-v04222026.md`](pilot-governance-charter-v04222026.md) — the weekly operating rulebook
- **Code Generation Policy Review:** [`code-generation-policy-review.md`](code-generation-policy-review.md) — HITL enforcement detail
- **Rollout Plan:** [`../rollout-plan.md`](../rollout-plan.md) — master plan
- **Risks Register:** [`assumptions-and-risks.md`](assumptions-and-risks.md) — tracking compliance-adjacent risks
