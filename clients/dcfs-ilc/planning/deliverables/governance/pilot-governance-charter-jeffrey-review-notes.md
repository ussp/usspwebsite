# Pilot Governance Charter — Jeffrey Review Notes

**Source:** Email from Jeffrey Lobo (Krasan), 2026-04-24 15:34 UTC
**Thread:** "DCFS AI Rollout Touchpoint"
**Attached file:** [pilot-governance-charter-v20260423-jeffrey-review.docx](./pilot-governance-charter-v20260423-jeffrey-review.docx) (37,675 bytes — compare with local `pilot-governance-charter-v20260423.docx` at 42,104 bytes)

## Jeffrey's verbatim comments

> I tried to go through this.
> It is a large doc.
>
> I edited some bits. Not a lot changes made.
>
> Question... do you want to have the detailed metrics being measured in this document or just the governance aspects... and leave the metrics ext [text] to be in a different doc that can be managed independently

## Template direction (prior message in same thread, 14:55 UTC)

> We should use the DCFS document template

Template saved at: [../../../reference-docs/templates/Work Product Document Template.docx](../../../reference-docs/templates/Work Product Document Template.docx)

## Open decision: metrics in charter vs. separate doc?

**Option A — Keep metrics in charter**
- Pros: one document for first readers; governance + what we measure in one place
- Cons: every metric refinement triggers a governance doc re-review

**Option B — Split metrics out**
- Pros: governance stays stable; metrics iterate independently during the pilot
- Cons: second doc to maintain and link

**Current state:** metrics already exist in their own subfolder here (`../metrics/`), so Option B is effectively how things are organized on disk. The question is whether to trim metrics content back out of the governance charter, OR keep the charter self-contained.

**Recommendation TBD** — bring to next DCFS AI Rollout Touchpoint.

## Jeffrey's actual edits / corrections

**Binary diff of as-sent vs. returned .docx:** 2 table-cell differences (see below), both from Vinay's own pre-send edits — not Jeffrey's changes.

**Corrections noted by Jeffrey outside the docx body (verbal / email thread / during review):**

| Correction | From | To | Where applied |
|---|---|---|---|
| Sprint / PI numbering | PI 6.2.1 through PI 6.2.5 | **PI 26.2.1 through PI 26.2.5** | Applied in v20260424-dcfs-format.docx during review; source markdown (pilot-governance-charter-v20260423.md) still has old numbering and should be synced |

**Binary-diff-surfaced cells** (these are Vinay's own pre-send edits, *not* Jeffrey's):

| Location | Markdown source | Sent .docx (= Jeffrey's returned copy) |
|---|---|---|
| Table 2, Row 2 — "Pilot Governance Weekly" cadence | Every Tuesday | TBD |
| Table 2, Row 5 — "Pilot closeout" date | ~Jul 20 | ~Aug 20 |

These cadence/date values are placeholder/directional in a governance charter (not a project plan) — intentionally not kept precise while the pilot playbooks are being built.

**Net:** Jeffrey's substantive input is (1) the metrics-scope question in the email body, and (2) the PI numbering correction caught during review.

## Sync note

Markdown source (`pilot-governance-charter-v20260423.md`) has the pre-edit values ("Every Tuesday" / "Jul 20"). Local .docx matches markdown. The version sent to Jeffrey and his return copy have the placeholder values ("TBD" / "Aug 20"). **Deliberately not synced** — the charter is directional, not a precise project plan.

## Follow-ups

- [x] Diff Jeffrey's edits — ✅ done; zero body-text edits in the returned docx
- [x] DCFS Work Product Document Template applied → `pilot-governance-charter-v20260424-dcfs-format.docx`
- [x] PI numbering correction (6.2.x → 26.2.x) applied in v20260424-dcfs-format.docx during review
- [ ] **Sync PI numbering in source markdown** (`pilot-governance-charter-v20260423.md` line 12 still has PI 6.2.1) — so future regenerations don't regress
- [ ] **Decide the metrics scope question** (keep in charter vs. split into separate doc) → the real open item from Jeffrey's email
- [ ] Circulate updated DCFS-format version back to the thread once QA complete and metrics-scope decision is made
