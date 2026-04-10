# Chapter 10: Playbooks

## Purpose

Playbooks are living documents that codify what works (and what doesn't) into reusable, role-based guides. They start as drafts during the Design phase, get refined through the Pilot based on real feedback, and are finalized for Scale.

## When This Happens

- **Phase:** Playbook (but started in Design, refined in Pilot)
- **Timing:** Finalized at end of pilot PI
- **Deliverable:** Finalized Playbooks (updated with pilot lessons learned)

## Playbook Structure

Each role gets its own playbook. Every playbook follows the same structure:

```
# [Role] AI Playbook — ILC

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

| SDLC Process | AI Tool | Key Prompts |
|-------------|---------|-------------|
| Story writing | Rovo | "Review this user story for clarity, completeness, and testability..." |
| AC generation | Rovo | "Generate Gherkin acceptance criteria for this user story..." |
| Refinement prep | Rovo | "Identify edge cases and missing details in this story..." |
| Impact analysis | Rovo | "What existing stories or features might be affected by..." |

### Tester Playbook

| SDLC Process | AI Tool | Key Prompts |
|-------------|---------|-------------|
| Test script generation | Rovo/Copilot | "Generate test cases from these acceptance criteria..." |
| Edge case identification | Copilot | "What edge cases should be tested for this scenario..." |
| Test data generation | Copilot | "Generate realistic test data for this test scenario..." |

### Developer Playbook

| SDLC Process | AI Tool | Key Prompts |
|-------------|---------|-------------|
| Code comprehension | Copilot | "Explain what this plugin does and identify potential issues..." |
| Code review | Copilot | "Review this code for bugs, security issues, and improvements..." |
| Documentation | Copilot | "Generate technical documentation for this component..." |
| Refactoring | Copilot | "Suggest refactoring improvements for this code..." |

### Scrum Master Playbook

| SDLC Process | AI Tool | Key Prompts |
|-------------|---------|-------------|
| Sprint insights | Rovo | "Analyze sprint data and identify patterns or concerns..." |
| Metrics interpretation | Rovo | "What do these velocity trends suggest about team performance..." |
| Refinement coaching | Rovo | "Which stories in the backlog need more detail before sprint planning..." |

## Playbook Lifecycle

```
Design Phase:     Draft playbooks created from process design docs
                  ↓
Training Phase:   Playbooks used as training reference materials
                  ↓
Pilot Phase:      Playbooks tested in real sprints; feedback collected weekly
                  ↓
Measure Phase:    Playbooks updated with lessons learned from pilot
                  ↓
Scale Phase:      Finalized playbooks distributed to all 12 teams
                  ↓
Ongoing:          Playbooks updated as more teams adopt and new patterns emerge
```

## What Goes Into Lessons Learned

After each sprint during the pilot, capture:

| Question | Example |
|----------|---------|
| What prompt worked well? | "The Gherkin AC prompt saved 20 min per story" |
| What prompt didn't work? | "Code review prompt gave generic feedback on Dynamics plugins" |
| What was surprising? | "BAs started using Rovo for refinement prep — not in the original design" |
| What guardrail was tested? | "Developer tried to paste client config into Copilot — caught in review" |
| What would you tell the next team? | "Start with story writing — easiest win, builds confidence" |

## Guardrails Section (in every playbook)

Every playbook includes the same guardrails section:

1. **Never enter PII** — No case data, no child names, no SSNs, no addresses
2. **Never enter security documentation** — No security plans, no credentials, no access configs
3. **Always review AI output** — AI drafts, you decide. Never accept output without reading it
4. **Use approved tools only** — Copilot and Rovo only. No ChatGPT, no other AI tools
5. **Report issues** — If AI generates inappropriate content, report to Scrum Master immediately
6. **When in doubt, don't paste** — If you're unsure whether data is safe to enter, don't enter it

---

**Next:** [Chapter 11: Scale & Rollout](11-scale-rollout.md) — Expanding from pilot to all 12 teams
