---
title: "Playbooks"
description: "Role-based playbook structure, lifecycle, guardrails template, and lessons learned capture format"
---

# Chapter 10: Playbooks

## Purpose

Playbooks are living documents that codify what works (and what doesn't) into reusable, role-based guides. They start as drafts during the Design phase, get refined through the Pilot based on real feedback, and are finalized for Scale.

## When This Happens

- **Phase:** Playbook (but started in Design, refined in Pilot)
- **Timing:** Finalized at end of pilot iteration cycle
- **Deliverable:** Finalized Playbooks (updated with pilot lessons learned)

## Playbook Structure

Each role gets its own playbook. Every playbook follows the same structure:

```
# [Role] AI Playbook

## Quick Start
- Tools you'll use
- 3 things to try today
- What NOT to do

## SDLC Processes
For each augmented process:
  - What it is
  - How AI helps
  - Step-by-step with prompts
  - Example output (before/after)
  - Guardrails checklist

## Prompt Library
- Tested prompts organized by task
- Tips for better results

## Guardrails & Compliance
- Data boundaries
- Review requirements
- Incident reporting

## FAQ
- Common questions from pilot participants

## Lessons Learned
- What worked
- What didn't
- Tips from pilot team members
```

## Four Role-Based Playbooks

### BA Playbook

| SDLC Process | Key Prompts |
|-------------|-------------|
| Story writing | "Review this user story for clarity, completeness, and testability..." |
| AC generation | "Generate Gherkin acceptance criteria for this user story..." |
| Refinement prep | "Identify edge cases and missing details in this story..." |
| Impact analysis | "What existing stories or features might be affected by..." |

### Tester Playbook

| SDLC Process | Key Prompts |
|-------------|-------------|
| Test script generation | "Generate test cases from these acceptance criteria..." |
| Edge case identification | "What edge cases should be tested for this scenario..." |
| Test data generation | "Generate realistic test data for this test scenario..." |

### Developer Playbook

| SDLC Process | Key Prompts |
|-------------|-------------|
| Code comprehension | "Explain what this module does and identify potential issues..." |
| Code review | "Review this code for bugs, security issues, and improvements..." |
| Documentation | "Generate technical documentation for this component..." |
| Refactoring | "Suggest refactoring improvements for this code..." |

### Scrum Master Playbook

| SDLC Process | Key Prompts |
|-------------|-------------|
| Sprint insights | "Analyze sprint data and identify patterns or concerns..." |
| Metrics interpretation | "What do these velocity trends suggest about team performance..." |
| Refinement coaching | "Which stories in the backlog need more detail before sprint planning..." |

## Playbook Lifecycle

```
Design Phase:     Draft playbooks created from process design docs
                  |
Training Phase:   Playbooks used as training reference materials
                  |
Pilot Phase:      Playbooks tested in real sprints; feedback collected weekly
                  |
Measure Phase:    Playbooks updated with lessons learned from pilot
                  |
Scale Phase:      Finalized playbooks distributed to all teams
                  |
Ongoing:          Playbooks updated as more teams adopt and new patterns emerge
```

### Lifecycle Details

| Phase | Playbook State | Key Activities |
|-------|---------------|----------------|
| **Design** | Draft v0.1 | Create from process design docs; include initial prompt templates; peer review |
| **Train** | Draft v0.5 | Use as training handout; note where participants struggle or suggest improvements |
| **Pilot** | Working v1.0 | Teams use daily; collect prompt effectiveness data; weekly refinement |
| **Finalize** | Final v1.0 | Incorporate all pilot lessons; remove what didn't work; add what teams discovered |
| **Scale** | Released v1.0 | Distribute to new teams; train-the-trainer uses playbooks as curriculum backbone |
| **Ongoing** | v1.1, v1.2... | Quarterly review cycle; new prompts added; deprecated patterns removed |

## What Goes Into Lessons Learned

After each sprint during the pilot, capture:

| Question | Example |
|----------|---------|
| What prompt worked well? | "The Gherkin AC prompt saved 20 min per story" |
| What prompt didn't work? | "Code review prompt gave generic feedback on framework-specific modules" |
| What was surprising? | "BAs started using AI for refinement prep -- not in the original design" |
| What guardrail was tested? | "Developer tried to paste client config into AI tool -- caught in review" |
| What would you tell the next team? | "Start with story writing -- easiest win, builds confidence" |

### Lessons Learned Capture Format

Each lesson follows this structured template:

```
Category:     [Prompt | Process | Guardrail | Tool | Training]
Role:         [BA | Tester | Developer | Scrum Master | All]
Sprint:       [Sprint number when observed]
Observation:  [What happened]
Impact:       [Positive or negative effect on productivity/quality]
Action:       [Change to playbook, prompt library, or process]
Status:       [Incorporated | Pending Review | Deferred]
```

**Example:**

```
Category:     Prompt
Role:         Tester
Sprint:       Sprint 2
Observation:  Test case generation prompt produces better results when
              acceptance criteria are provided in Gherkin format
Impact:       Test case completeness improved ~40% when input AC was
              structured vs. freeform
Action:       Added "Convert AC to Gherkin first" as Step 1 in the
              Tester playbook's test generation workflow
Status:       Incorporated
```

## Guardrails Section (in every playbook)

Every playbook includes the same guardrails section, customized with role-specific examples:

1. **Never enter sensitive data** -- No PII, no credentials, no confidential client data, no security documentation
2. **Always review AI output** -- AI drafts, you decide. Never accept output without reading it
3. **Use approved tools only** -- Only use organization-sanctioned AI tools. No unauthorized AI services
4. **Report issues** -- If AI generates inappropriate, incorrect, or concerning content, report to Scrum Master immediately
5. **When in doubt, don't paste** -- If you're unsure whether data is safe to enter into an AI tool, don't enter it
6. **No autonomous actions** -- AI assists; humans execute. No autonomous code deployment, no automated submissions without review

### Role-Specific Guardrail Examples

Include 2-3 concrete examples per role so the guardrails feel real, not abstract:

| Role | Example Scenario | Correct Action |
|------|-----------------|----------------|
| BA | Story references a real customer by name | Remove customer name before prompting AI; use generic placeholder |
| Tester | Test data needs to mirror production patterns | Generate synthetic data with AI; never paste real production data |
| Developer | AI suggests a code pattern that bypasses authentication | Reject the suggestion; flag in code review; report in weekly check-in |
| Scrum Master | Retrospective notes contain team member performance complaints | Do not paste into AI tool; summarize themes manually |

## Playbook Review and Update Process

### During Pilot

- **Weekly:** Scrum Master collects prompt feedback and guardrail observations from team
- **Per sprint:** AI Transformation Lead reviews collected feedback, updates playbook drafts
- **Mid-pilot:** Formal review -- remove prompts that don't work, add discovered techniques

### Post-Pilot / During Scale

- **Quarterly:** Review all playbooks for accuracy and relevance
- **Per wave:** New teams' feedback incorporated after their first 2 sprints
- **Ad hoc:** Update immediately when tool capabilities change (new features, deprecated APIs)

### Version Control

Playbooks are version-controlled alongside project documentation. Every update includes:
- Version number increment
- Date of change
- Summary of what changed and why
- Author / reviewer

---

**Next:** [Chapter 11: Scale and Rollout](11-scale-rollout.md) -- Expanding from pilot to all teams
