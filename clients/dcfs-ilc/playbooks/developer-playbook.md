# Developer AI Playbook — DCFS ILC

> **Status:** SKELETON — To be developed during pilot phase
> **Tool:** GitHub Copilot (when deployed)

---

## Purpose

Guide developers on effective use of GitHub Copilot for Dynamics 365 development, plugin creation, and Power Apps customization within state AI policy boundaries.

---

## Use Cases

### 1. Code Completion & Suggestions
<!-- TODO: Develop after architect walkthrough of dev patterns -->
- Dynamics 365 plugin development
- Power Apps customization code
- .NET / TypeScript patterns used in ILC

### 2. Code Review Assistance
- Prompt: "Review this code for [common issues in Dynamics plugins]"
- Expected benefit: Faster self-review before formal code review

### 3. Documentation Generation
- Prompt: "Generate inline documentation for this method"
- Expected benefit: Better code documentation with less manual effort

---

## Hard Constraints

- **No autonomous code generation** — developer must review and understand every line
- **Configuration-first** — custom code is last resort; AI should help optimize configuration, not encourage more coding
- **State AI policy compliance** — no sensitive data in prompts

---

## Metrics to Track

- Code completion acceptance rate
- Time from story pickup to PR/deployment
- Code review cycle time
- Developer satisfaction

---

*To be filled in during pilot phase. Requires GitHub Copilot deployment and architect input.*
