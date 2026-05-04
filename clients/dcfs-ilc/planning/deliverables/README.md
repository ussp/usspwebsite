# Deliverables — DCFS ILC AI Pilot

Organized repository of pilot-phase deliverables. Each subfolder groups related documents by purpose.

---

## Folder structure

```
deliverables/
├── governance/   — policy, structure, compliance, DoIT notices
├── metrics/      — measurement methodology, per-role metrics, collection methods
├── strategy/     — pilot strategy, scope, tools, risks
├── playbooks/    — role-specific AI usage playbooks
├── README.md     — this file
└── _build-notice-docx.py — utility to convert .md → .docx
```

---

## governance/

Policy and governance documents — what DCFS shares externally (with Dave, DoIT, or Jim for signature).

| File | Purpose |
|------|---------|
| `governance-proposal-v20260414.md/.docx` | Two-phase governance structure (Pilot + DCFS AI Governance Team) + Phase B forward-looking items |
| `pilot-governance-charter-v20260423.md/.docx` | Operating charter for the pilot governance team — weekly cadence, agenda, decisions, escalation |
| `compliance-map-v20260422.md` | DoIT AI Policy mapped to operational controls |
| `code-generation-policy-review.md` | HITL enforcement detail for AI-assisted code generation |
| `doit-30day-notice-light-v20260423.md/.docx` | 1-page memo for 30-day advance notice to DoIT (§5f) |
| `doit-30day-notice-detailed-v20260423.md/.docx` | Full 4-page assessment (internal reference; share only if DoIT requests) |

---

## metrics/

Measurement framework — what we track, per role, and how we collect it.

| File | Purpose |
|------|---------|
| `measurement-methodology-v20260414.md` | Overall measurement philosophy — DORA, SPACE, QUS, GQM |
| `pilot-metrics-by-role-v20260423.md/.docx` | Candidate metric set per role (BA, SA, Dev, Tester, Testing Services Lead) + cross-cutting — for team review and selection |
| `pilot-metrics-collection-methods-v20260423.md/.docx` | Operational runbook — scripts, APIs, prerequisites for each data source |

---

## strategy/

Strategic and planning documents — the pilot's scope, risks, tools, and hiring model.

| File | Purpose |
|------|---------|
| `pair-programmer-strategy-v20260422.md` | Two-phase pair-programmer model (pilot + scale wave 1) |
| `scope-running-book-v20260421.md` | Living scope doc — in-scope, out-of-scope, Phase 2/3 candidates, tool asks |
| `tool-authorization-list.md` | Approved AI tools + pending confirmations |
| `assumptions-and-risks.md` | Risk register + assumption tracking |

---

## playbooks/

Role-specific AI usage playbooks for the Intact pilot team. Each playbook includes:
- PII / data-boundary warning (top of document)
- Approved tools for that role
- Prompt patterns and examples
- HITL discipline and DCFS guardrails
- Known anti-patterns

| File | Role |
|------|------|
| `playbook-ba-v20260421.md` | Business Analyst |
| `playbook-tester-v20260421.md` | Senior Tester |
| `playbook-developer-v20260421.md` | Platform Developer |
| `playbook-data-v20260421.md` | Data team |
| `playbook-testing-services-lead-v20260422.md` | Testing Services Lead |

---

## Utility

### `_build-notice-docx.py`
Converts any markdown file in this folder (or any subfolder) into a Word document with tight spacing and proper heading hierarchy.

**Usage:**
```bash
# From planning/deliverables/ — searches subfolders automatically
python _build-notice-docx.py pilot-governance-charter-v20260423
python _build-notice-docx.py doit-30day-notice-light-v20260423

# With explicit subfolder path:
python _build-notice-docx.py governance/pilot-governance-charter-v20260423
```

---

## Version naming convention

`document-name-vYYYYMMDD.md` — filename includes the date it was last materially revised, in ISO format for chronological sorting.

---

## How to use this folder

- **Sharing with DCFS (Dave, Jim, Phase B team):** grab the `.docx` from the appropriate subfolder. Governance docs → `governance/`. Metrics docs → `metrics/`.
- **Internal working docs:** `strategy/` and `playbooks/` are primarily for the Krasan pilot team.
- **Regenerating Word docs after markdown edits:** use the build script above.
- **Adding a new document:** place in the right subfolder, use the `vYYYYMMDD` version pattern.
