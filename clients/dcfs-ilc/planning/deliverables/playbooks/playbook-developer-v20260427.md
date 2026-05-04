# Developer Playbook v0.2 — DCFS Illinois Connect AI Pilot

> **Version:** v0.2 — V20260427
> **Status:** DRAFT — pilot starter, refined with Apr 23 Dynamics-developer-workflow walkthrough findings; will roll into v1.0 deliverable at end of pilot PI
> **Owner:** Vinay Lagisetty
> **Audience:** Krasan developers participating in pilot, Kali (Solution Architect — Intact), Anudeep Chaitanya (Dynamics Developer — Intact), Krishna (Senior Solution Architect), Darrin (Chief Solution Architect), John (Agile Delivery Manager), Romi
> **What's new vs v20260421:** Adds DCFS implementation precedence (out-of-box → North52 → JS → plugin), per-tool Copilot decision aid, GitHub Copilot enablement-gap callout (R-22), Visio→Mermaid prerequisite (R-27), story-hygiene pre-check (R-26), Power Apps form-designer Copilot gap (R-24). Anchors all guidance in the actual Intact workflow observed Apr 23.

---

## ⚠ Data Boundaries — Read Before Every Session

Before using any AI tool described in this playbook:

- **Never paste** DCFS case data, child names, case IDs, CANTS/CCWIS records, SSN, DOB, addresses, phone numbers, or any PII into a prompt — in any tool (Rovo, GitHub Copilot, M365 Copilot, D365 Copilot, Power Automate Copilot, Power Apps Copilot for tables). **Debug data, production logs, and real error payloads often contain PII — strip before pasting.**
- **Keep prompts abstract.** Describe the code problem or error pattern, not the data. Use synthetic/redacted examples.
- **Self-report near-misses.** If you realize you pasted something you shouldn't have, notify the Pilot Governance Lead via the Teams channel immediately. 1-hour CIO escalation per charter §9.
- **Weekly compliance check** (Pilot Governance §5.5) explicitly reviews prompt-drift incidents. Self-reporting is welcomed — no penalty for catching and flagging your own near-miss.
- **HITL is mandatory.** Every AI suggestion must be reviewed, edited or rejected by you before commit / submit. Peer PR approval required before merge. **AI generates; the human submits.**
- **When in doubt, ask before submitting.** The AI Transformation Lead is available on the Teams channel.

---

## Change log

| Version | Date | Changed by | What changed |
|---------|------|-----------|--------------|
| v0.1 | 2026-04-21 | Vinay | Initial draft — Phase 1 scope, Copilot-focused, D365/.NET/PCF/Power Platform, mandatory HITL discipline |
| v0.2 | 2026-04-27 | Vinay | Apr 23 Dynamics-developer-workflow walkthrough findings incorporated: implementation precedence (out-of-box → North52 → JS → plugin), per-tool Copilot decision aid, GitHub Copilot enablement-gap callout (R-22), form-designer Copilot gap (R-24), story-quality dependency (R-26), Visio-as-JPEG prerequisite (R-27), highest-value Copilot fits and where AI is risky, story hygiene pre-check |

---

## 1. Why developers are a Phase 1 role (but not the headline lever)

Per the Apr 21 walkthrough — **testing is the bottleneck, not development.** Multiple sprints show high dev throughput followed by 0 stories clearing testing/UAT.

That means: **AI-assisted dev productivity gains, by themselves, won't move the headline % Work Completed metric.** They build dev capacity that the team can deploy once the bottleneck eases.

**Why developers are still in Phase 1:**
1. Build dev capacity in parallel — when bottleneck clears, teams can absorb scope expansion
2. Earlier-stage defect catching (unit tests with Copilot) reduces what reaches Test stage — direct bottleneck contribution
3. Rapid documentation generation removes a chronic time sink
4. Bug investigation acceleration shortens the dev → test → fix loop

**Critical constraint (Jim's hard rule):** AI CAN write production code. Developer reviews/edits/accepts every suggestion. Standard peer review + PR approval before commit. **No autonomous commits, ever. AI generates; the human submits.**

---

## 2. Implementation precedence — the DCFS rule (NEW)

> Captured Apr 23 from Kali + Chaitanya: there is a **firm convention** for how a Dynamics requirement is implemented on this team. Always start at level 1 and only drop down when the prior level cannot satisfy the requirement. **AI prompt patterns must respect this precedence — don't ask Copilot to write a plugin when a business rule will do.**

| Level | Tool | When to use | When to escalate to next level | AI tool fit at this level |
|-------|------|-------------|-------------------------------|---------------------------|
| **1** | **Out-of-the-box Dynamics business rules** | Always try first. Simple field-level validation, conditional visibility, default values, lock/unlock fields. | When the rule needs cross-entity logic, asynchronous behavior, complex conditionals, or computation the business-rules engine doesn't support. | Story decomposition / acceptance-criteria-to-rule narrative via **Rovo**. No code AI needed. |
| **2** | **North52 (low-code rule engine)** | When out-of-the-box rules can't express the logic but you don't yet need code. Calculations, multi-condition validation, related-record lookups, formula-style logic (similar to Power FX). | When you need DOM access, async UI flows, custom UI components, server-side transactions, or external service calls. | **No vendor Copilot for North52.** Use **Rovo** to translate JIRA acceptance criteria into a rule narrative; human writes the North52 expression. Concat-prompt approach (see §3.3) can draft rule expressions for human review. |
| **3** | **JavaScript (client-side)** | Form-event handlers (OnLoad / OnSave / OnChange), ribbon scripts, client-side Web API calls, conditional UI behavior North52 can't express. Authored in **VS Code or Notepad++** today. | When logic must be server-side, synchronous, transactional, or requires SDK access not available on the client. | **GitHub Copilot in VS Code** — easy win for boilerplate (form-event scaffolds, Xrm.WebApi calls, JSDoc, unit tests). **🚧 Currently gated by R-22 enablement gap.** Until enabled: hand-write + use Rovo for AC-to-validator-pseudocode. |
| **4** | **.NET plugins / PCF / Azure Functions** | Server-side synchronous logic, custom UI components, integration with external systems, anything Power Automate can't meet on latency or behavior. Authored in **Visual Studio**. | This is the bottom of the precedence — escalate to architecture review if requirements can't fit here. | **GitHub Copilot in Visual Studio** — strongest fit on the entire workflow. Plugin scaffolds, PCF manifests, FakeXrmEasy unit tests, Azure Function bindings. **🚧 Currently gated by R-22 enablement gap.** |

**Why precedence matters for AI prompts:** if a developer asks Copilot "write a plugin to default field X to Y" without first checking levels 1–3, Copilot will gladly write a plugin — and now the team carries a plugin where a business rule would have done it. Always state the precedence in the prompt: *"This is a level-3 / level-4 implementation because levels 1 and 2 cannot satisfy [reason]."*

---

## 3. Workflow phases (from Apr 23 walkthrough)

The actual Intact-team Dynamics dev workflow, with AI tool fits per phase:

| Phase | Tool / Mechanism | AI fit | Notes |
|-------|------------------|--------|-------|
| **Story intake** | **JIRA user story** (description, AC, scenarios, validations). **No separate BRD** — "all our requirements are in these stories." | **Rovo** (story-side AI — proven live Apr 23). Story decomposition, AC summarization, similar-story lookup. | Story quality is variable (no INVEST/Darwin gate). Run §5 story-hygiene pre-check before invoking any code AI. |
| **Architecture / business context** | **Confluence** linked from JIRA. **Visio diagrams attached as JPEGs** (not live, not Mermaid). | **🚧 BLOCKED** until Visio→Mermaid conversion. Microsoft Copilot rejected case-flow JPEG live (low-resolution decode). Rovo handled the same image only because text in the JIRA story carried it. | See §6 Visio-Mermaid prerequisite callout. Cross-ref R-27. |
| **Implementation decision** | Per §2 precedence: out-of-box → North52 → JS → plugin. | **Rovo** can pre-classify a story's likely implementation level from AC. Human still decides. | Prompt: "Given these AC, which of [out-of-box rule / North52 / JS / plugin] is the right level? Justify." |
| **Table & relationship modeling** | **make.powerapps.com** (Power Apps maker portal). | ✅ **Power Apps Copilot for tables IS enabled** in this GCC tenant (confirmed Apr 23). Prompt-based table creation works in sandbox. | Live attempt errored on related-table creation — relationship target must be added to solution first. Workflow gotcha, not Copilot bug. |
| **Form configuration** | **Power Apps form designer** (drag-and-drop). JS files attached to OnChange / OnSave. Business rules tab + JS libraries tab. | ❌ **Power Apps form-designer Copilot NOT enabled** in this GCC tenant (confirmed Apr 23). Likely GCC release-cadence gap — see R-24. | Marginal AI value on drag-and-drop UI even when enabled. Don't block pilot on this. |
| **Workflow / async logic** | **make.gov.powerautomate.us** (Power Automate, gov tenant). | ✅ **Power Automate Copilot pane IS enabled** (confirmed Apr 23). Generates flow skeleton from natural-language prompt; per-action configuration still manual. | High-value, available today. See §4.4 prompt patterns. |
| **Client-side validation** | North52 (preferred) → JavaScript fallback. JS authored in **VS Code or Notepad++**. | **GitHub Copilot** in VS Code = easy win. **🚧 Gated by R-22.** | Concat-prompt from JIRA AC → JS validator scaffold (proven approach). |
| **Server-side / pro-code** | **.NET plugins, PCF, Azure Functions** in **Visual Studio**. | **GitHub Copilot** in VS = strongest fit on entire workflow. **🚧 Gated by R-22.** | Plugin scaffolds, FakeXrmEasy tests, manifests. |
| **Story-side AI today** | **Atlassian Rovo** ("Ask Rovo") in JIRA. | ✅ **Working live** (Apr 23). Generated 4 role-based test cases + 1 negative case from a real Intact story. | Available now — no enablement gap. |
| **Diagram authoring** | Visio → exported as JPEG/PNG → pasted into Confluence/JIRA. | ❌ **AI-readability gap confirmed live.** Mermaid is far better for LLM ingestion. | Cross-cutting prerequisite — see §6. |

---

## 4. Approved tools for developers — current status

| Tool | Use | Status |
|------|-----|--------|
| **GitHub Copilot** (multi-model: OpenAI, Gemini, Claude via Copilot) | PRIMARY for levels 3 + 4 — code completion, chat, refactoring | **🚧 Licensed by DoIT, NOT YET PROVISIONED** for this team's GCC environment (R-22). Tier still pending — Pro is the working assumption; push for Business/Enterprise via Jeff/Dave. |
| **GitHub Copilot Chat** | Explanation, review, debugging, design discussion | Same status as above (gated on enablement) |
| **Power Apps Copilot for tables** (in `make.powerapps.com`) | Dataverse table & relationship modeling acceleration | ✅ **Enabled in this GCC tenant** (confirmed Apr 23) |
| **Power Apps form-designer Copilot** | Form generation in maker | ❌ **NOT enabled in this GCC tenant** (confirmed Apr 23). Likely GCC release-cadence gap. Cross-ref R-24. |
| **Power Automate Copilot** (in `make.gov.powerautomate.us`) | Flow skeleton from natural-language prompt | ✅ **Enabled** (confirmed Apr 23) |
| **Atlassian Rovo** | Story decomposition, AC summarization, Confluence cross-ref while coding | ✅ Available — used live Apr 23/24 |
| **M365 Copilot** | Email, Teams, Outlook, doc summarization | Available |
| **D365 Copilot** (the in-app one) | End-user / business-process facing — case-history surfacing, embedded agents | **Out of scope for this playbook** — it is NOT an SDLC accelerator. Don't confuse with developer copilots. |

**Not approved:** ChatGPT direct, Claude direct (outside Copilot), any external LLM.

---

## 5. 🆕 Which Copilot for which task — decision aid

Tool sprawl is a real risk: at least five distinct "Copilots" surfaced in Apr 23 (GitHub, M365, Power Automate, Power Apps maker, Dynamics 365). Use this table to pick the right one for the implementation level you're at.

| Implementation level / task | Right Copilot | Status today | If gated, fallback |
|----------------------------|---------------|--------------|--------------------|
| **Level 1 — Out-of-box business rules** | None (story-side: Rovo for AC narrative) | Rovo ✅ | n/a |
| **Level 2 — North52 expressions** | **No vendor Copilot exists for North52.** Use **Rovo** to translate AC → rule narrative; human writes expression. Concat-prompt from AC works for bulk drafting. | Rovo ✅ | n/a |
| **Level 3 — JavaScript form-event handlers (VS Code / Notepad++)** | **GitHub Copilot** | **🚧 BLOCKED — R-22 enablement gap** | Use Rovo on JIRA AC → JS-pseudocode. Hand-write the JS. Defer measurement of this slice until Copilot is provisioned. |
| **Level 4 — .NET plugin in Visual Studio** | **GitHub Copilot** | **🚧 BLOCKED — R-22** | Same fallback as above. This is the highest-value lost slice. |
| **Level 4 — PCF custom control in Visual Studio** | **GitHub Copilot** | **🚧 BLOCKED — R-22** | Same. |
| **Level 4 — Azure Function in Visual Studio** | **GitHub Copilot** | **🚧 BLOCKED — R-22** | Same. |
| **Power Automate flow scaffolding** | **Power Automate Copilot** (in tenant) | ✅ Enabled | n/a — use today |
| **Dataverse table + relationship modeling** | **Power Apps Copilot for tables** (in maker) | ✅ Enabled | n/a — use today |
| **Power Apps form configuration (drag-and-drop)** | Form-designer Copilot would apply, but it's **not enabled in GCC** (R-24) | ❌ Not enabled | Manual configuration. Marginal AI gain anyway — don't block pilot on this. |
| **Story decomposition / AC clarification / similar-story lookup** | **Atlassian Rovo** | ✅ Enabled | n/a |
| **Confluence cross-reference / doc summarization while coding** | **Rovo** (Confluence-grounded) or **Confluence AI** | ✅ Available | n/a |
| **Code review / self-review before PR** | **GitHub Copilot Chat** | **🚧 BLOCKED — R-22** | Manual peer review only until enablement |
| **Bug investigation (stack-trace triage)** | **GitHub Copilot Chat** | **🚧 BLOCKED — R-22** | Rovo can ingest Confluence runbooks; otherwise manual |
| **Email / Teams summarization** | **M365 Copilot** | Available | n/a |

**Rule of thumb:** Pick the Copilot that lives in the tool you're already in. Don't paste D365 work into M365 Copilot or GitHub Copilot — it won't have the grounding. If the task is JIRA-grounded, use Rovo. If it's tenant-grounded (M365 content), use M365 Copilot. If it's code in a repo, use GitHub Copilot. If it's Power Platform configuration, use the in-product Copilot.

---

## 🚧 GitHub Copilot enablement gap — CALLOUT (R-22)

**Status as of Apr 23:** GitHub Copilot is **licensed by DoIT but NOT YET PROVISIONED for this team's GCC environment.** Confirmed live with Kali and Chaitanya — Copilot is not available in their VS / VS Code installs.

**What this blocks:**
- Level-3 JavaScript authoring (form-event handlers, ribbon scripts) — easy Copilot win lost
- Level-4 .NET plugin authoring — strongest Copilot fit on the workflow lost
- Level-4 PCF custom controls — lost
- Level-4 Azure Function authoring — lost
- Copilot Chat-based code review and bug triage — lost

**What it does NOT block:**
- Story-side AI (Rovo is fully working)
- Power Automate flow scaffolding (Power Automate Copilot is enabled)
- Dataverse table modeling (Power Apps Copilot for tables is enabled)
- Documentation drafts via M365 Copilot

**Pilot fallback while gap is open:**
1. Developer use cases that need GitHub Copilot are **flagged as deferred** in the measurement plan — don't compute deltas for them until provisioning lands.
2. Use **Rovo only** for AC-to-pseudocode translation; the developer hand-writes the JS/.NET/PCF code.
3. Track time spent on these tasks pre-Copilot so we have a clean baseline once provisioning lands.

**Owner:** Vinay + Romi escalating to Jim/Dave. **Target:** before May 12 (freedom-to-use date).

**Cross-ref:** R-22 in `assumptions-and-risks.md`; tool-status row in `tool-authorization-list.md` Category 1.

---

## 6. 🚧 Visio → Mermaid prerequisite — CALLOUT (R-27)

**Status as of Apr 23:** Architecture and case-flow diagrams currently live as **Visio files exported to JPEG/PNG and pasted into Confluence and JIRA.** Confirmed live: Microsoft Copilot rejected the case-flow JPEG with a low-resolution-decode error. Rovo handled the same story only because the *text* of the JIRA story carried the relevant context — not the image.

**What this blocks (cross-cutting, affects every AI task that needs to reason about architecture):**
- Diagram-driven story decomposition
- Architecture-to-implementation prompts ("given this case flow, what tables / plugins are affected?")
- Bug investigation that depends on understanding component relationships
- Onboarding documentation generation

**Prerequisite:** Convert architecture diagrams from Visio-as-JPEG to **Mermaid** (LLM-readable text format). This is task **18a** in `rollout-plan.md`. Owner: Vinay + Shyam/Kashif.

**Pilot interim guidance:**
- For any AI task that *would* benefit from a diagram, paste a **text description of the relationships** alongside (or instead of) the JPEG.
- Kali noted she sometimes recreates Visio diagrams in a Mermaid-looking style — encourage this for any diagram a developer needs to reference in a Copilot/Rovo prompt during the pilot.
- Track time spent on diagram re-authoring as a pilot data point (it's an AI-readiness cost).

**Cross-ref:** R-27 in `assumptions-and-risks.md`; A-34 in same; rollout-plan task 18a.

---

## 7. 🆕 Story hygiene pre-check (before invoking any code AI)

> **Bad input → worse output.** AI amplifies skill — well-structured stories produce well-structured suggestions; vague stories produce confidently wrong code. Apr 23 confirmed there is **no INVEST / Darwin gate** on Intact stories today — quality is variable. Cross-ref R-26.

Before invoking Rovo / Copilot / Power Automate Copilot for any story-driven task, the developer (or pairing BA) must verify the story passes this 5-question check:

### The 5 questions

1. **Is the user / role explicit?** ("As a case worker / intake specialist / case manager …" — not "as a user")
2. **Are the acceptance criteria concrete?** Each AC is a testable Given/When/Then or equivalent — not "system should work correctly."
3. **Is the AC list decomposed?** Each AC tests one behavior. Compound AC ("validates X and updates Y and notifies Z") get split before prompting.
4. **Are inputs and outputs typed?** Field names, data types, ranges, valid/invalid examples — not "appropriate value."
5. **Are edge cases enumerated?** Null inputs, max-length, concurrency, permission denied, downstream failure. If empty, the story is incomplete.

### What to do if the story fails the check

- **Don't prompt yet.** AI will fill the gaps with plausible-sounding fabrications.
- **Use Rovo to draft missing AC** from the story description — but the BA / PO / human must accept them, not the developer. Document this as story-quality work.
- **Flag persistent low-quality stories** to John (Agile Delivery Manager) and Vinay so the BA training in Phase 2 can target the patterns.

### Prompt template (story → check)

```
Review this user story against INVEST + concrete-AC criteria:

[paste story title + description + AC list]

For each criterion below, answer PASS / FAIL with one-sentence reason:
1. Independent (story can be done without others)
2. Negotiable (not a script, leaves room for design)
3. Valuable (states user value, not just task)
4. Estimable (enough info to estimate)
5. Small (fits in a sprint)
6. Testable (each AC is concrete G/W/T or equivalent)
7. Decomposed AC (one behavior per AC)
8. Typed inputs/outputs (field names, types, ranges)
9. Edge cases enumerated (null, max, concurrency, permission, failure)

If any FAIL, list the specific gap and a one-line suggestion to close it.
```

If the story fails 3+ of the 9 checks, **stop**. Loop the BA / PO before any code AI is invoked on it.

---

## 8. Use cases & prompt patterns

> Patterns from v20260421 are preserved — the AI mechanics didn't change. What changed is *which Copilot* and *which level of the precedence stack* each pattern applies to.

### 8.1 Dynamics 365 plugin (C#) — Level 4

**When:** A requirement that levels 1–3 cannot satisfy. Server-side synchronous logic, transactional integrity, cross-entity behavior.

**Tool:** GitHub Copilot in Visual Studio + Copilot Chat for design (**🚧 R-22 gated**)

**Pre-check:** §7 story-hygiene check passes. §2 precedence justifies dropping to level 4 (state the reason in the prompt).

**Prompt pattern (Copilot Chat, design):**
```
This is a level-4 (.NET plugin) implementation because:
- Out-of-box business rule cannot satisfy [reason]
- North52 cannot satisfy [reason]
- JavaScript cannot satisfy [reason — typically server-side, transactional, or cross-entity]

I need a D365 plugin for the [Account / Contact / custom entity] entity.

Trigger: [Create / Update / Delete] on [stage: pre-validation, pre-operation, post-operation]

Business requirement: [paste from story AC]

Constraints:
- Synchronous execution (per existing pattern in our codebase)
- No external HTTP calls (offline-safe)
- Must respect security context of triggering user
- Must log to plugin trace log on error
- Follow our existing plugin base class pattern: [paste base class signature]

Generate:
- Plugin class scaffold inheriting our base
- Step registration metadata (entity, message, stage, filtering attributes)
- Pseudocode for the business logic before the actual implementation
- Test scenarios (for unit test generation later)

Do not generate the implementation yet — let me review the design first.
```

**Then for implementation (Copilot inline):**
```
// [paste reviewed pseudocode]
// Implement the plugin per the design above. Use Dataverse SDK 9.x.
// Use IOrganizationService for queries, not Web API.
// Throw InvalidPluginExecutionException with user-friendly messages on validation failures.
```

**HITL checklist (mandatory before commit):**
- [ ] Read every line of generated code
- [ ] Confirm SDK calls match our codebase conventions
- [ ] Confirm no hardcoded GUIDs / magic strings
- [ ] Confirm exception handling follows our pattern
- [ ] Wrote at least one unit test (FakeXrmEasy) before commit
- [ ] PR submitted, peer review passed

### 8.2 PCF custom controls — Level 4

**When:** Custom UI behavior that the form designer can't express; reusable component.

**Tool:** GitHub Copilot in Visual Studio (**🚧 R-22 gated**)

**Prompt pattern (PCF control):**
```
Generate a PCF control for [purpose].

Manifest requirements:
- Bound to: [entity attribute type]
- Configuration properties: [list]
- Resources: [JS, CSS, images]

Component logic: [describe]

Generate:
- ControlManifest.Input.xml
- index.ts (TypeScript) with init, updateView, getOutputs, destroy
- CSS file with our design system tokens [paste tokens or link]

Use React inside the PCF (we use React for complex controls).
```

**HITL checklist:**
- [ ] Verify Xrm API calls match our wrapper conventions
- [ ] Test in browser dev tools before deploy
- [ ] Run accessibility check (NVDA + AXE) — required for any UI
- [ ] PR submitted, peer review passed

### 8.3 JavaScript form-event handlers — Level 3

**When:** OnLoad / OnSave / OnChange logic that North52 can't express. Authored in VS Code or Notepad++ today.

**Tool:** GitHub Copilot in VS Code (**🚧 R-22 gated**). Until enabled: hand-write + use Rovo for AC-to-pseudocode.

**Pre-check:** Confirm North52 cannot satisfy the requirement (level-2 escalation rule).

**Prompt pattern (form script):**
```
This is a level-3 (JavaScript) implementation because North52 cannot
[express this DOM-/Web-API-/async-conditional behavior].

Generate a D365 form script for the [entity] form.

Trigger: [OnLoad / OnSave / OnChange of field X]
Behavior: [paste AC]

Constraints:
- Use formContext (not Xrm.Page — modern UI required)
- Async/await for any Web API calls
- Use Xrm.WebApi for queries (not OData direct)
- Show user notifications via formContext.ui.setFormNotification
- Follow our naming: function names prefixed with "ilc_"

Generate the function. Add JSDoc.
```

**HITL checklist:**
- [ ] Read every line; reject anything you can't explain
- [ ] Verify Xrm API calls match our wrapper conventions
- [ ] Test in browser dev tools before deploy
- [ ] PR submitted, peer review passed

### 8.4 Power Automate flow scaffolding — async logic

**When:** Async workflow on record events; multi-step orchestration where Power Automate is the right host.

**Tool:** **Power Automate Copilot** (in `make.gov.powerautomate.us`) — **✅ enabled today**

**Prompt pattern (Power Automate Copilot pane):**
```
[Use the in-product "Create your automation with Copilot" pane.
Keep prompts business-language.]

Example: "When a new case record is created and the case-type is
'Intact Family Services', send an email to the assigned worker's
manager with the case summary and a link to the record. Wait 3
business days; if the case status is still 'New', send a reminder."
```

**HITL checklist:**
- [ ] Review every step the skeleton produced — Copilot can guess wrong on connectors, triggers, conditions
- [ ] Configure each step manually (Copilot only scaffolds; you wire the inputs/outputs)
- [ ] Test with synthetic-shaped data, never real records
- [ ] Document the flow intent in the description field
- [ ] Save as solution-aware (not "default solution") — required for ALM

### 8.5 Dataverse tables & relationships — table modeling

**When:** New entity, new column, new relationship.

**Tool:** **Power Apps Copilot for tables** (in `make.powerapps.com`) — **✅ enabled today**

**Prompt pattern (in-product Copilot in maker):**
```
"Create a table called 'Service Plan Activity' with columns for activity
type (choice: visit, phone-call, document-review, training), date,
duration in minutes, completed-by (lookup to Contact), and outcome
notes (multi-line text). Add a many-to-one relationship from this table
to the Service Plan table."
```

**HITL checklist:**
- [ ] Verify generated schema matches naming conventions (prefix, casing)
- [ ] Confirm relationship cardinality is correct
- [ ] **Workflow gotcha:** related table must be in the solution before relationships can be created (failed live Apr 23)
- [ ] Add to solution explicitly — don't leave in default solution
- [ ] Verify field-level security defaults are appropriate for any sensitive fields

### 8.6 Power FX (canvas apps & Power Automate expressions)

**When:** Working in canvas apps or expression editor.

**Tool:** Power Platform AI Copilot (built into the maker experience).

**Prompt pattern:**
```
[Keep prompts business-language.]

Example: "Filter the Cases gallery to show only cases assigned to the
current user that are open and were modified in the last 30 days."

Then review the generated Power FX expression. Power FX is unique — verify
function signatures against the official Power FX reference.
```

**HITL checklist:**
- [ ] Verify Power FX functions exist (Copilot can hallucinate function names)
- [ ] Test the formula with real-shaped synthetic data
- [ ] Confirm delegation warnings addressed
- [ ] Document the formula intent in the app comments

### 8.7 Unit test generation — alongside any level-3/4 code

**When:** Writing tests alongside code (do this for every story — pushes defect catches earlier).

**Tool:** GitHub Copilot in Visual Studio with test framework loaded (**🚧 R-22 gated**).

**Prompt pattern:**
```
Generate unit tests for this method:

[paste method]

Test framework: xUnit (or MSTest — match project)
Mocking: Moq (or FakeXrmEasy for Dataverse)

Cover:
1. Happy path — valid input, expected output
2. Each guard clause — null inputs, invalid state, missing dependencies
3. Boundary cases — empty collections, max-length strings, zero/negative numbers
4. Each branch in the method
5. Error paths — what happens when downstream call throws

For Dataverse-touching code, use FakeXrmEasy to mock IOrganizationService.

Each test:
- Arrange / Act / Assert sections clearly marked
- One logical assertion per test (multiple physical asserts OK if one logical)
- Test name format: MethodName_Condition_ExpectedResult
```

**HITL checklist:**
- [ ] Run all tests; verify they pass for the right reasons
- [ ] Verify negative tests fail when assertion is removed (mutation check)
- [ ] Coverage tool shows expected branches covered
- [ ] No test depends on real Dataverse / external service

### 8.8 Code review (self-review before PR)

**Tool:** GitHub Copilot Chat (**🚧 R-22 gated**).

**Prompt pattern:**
```
Review this code for:

1. Bugs — logic errors, race conditions, null deref risks
2. Security — input validation, injection risks (SQL, XSS), secret exposure
3. Performance — N+1 queries, unbounded loops, large in-memory ops
4. Maintainability — clarity, naming, single-responsibility
5. Conventions — does it match our team patterns?
6. Tests — is the change adequately tested?
7. Documentation — does the code need comments? Is the README affected?

[paste code or PR diff]

Our team conventions: [paste link or summary]

Output as a checklist with PASS / NEEDS WORK / NOT APPLICABLE per item,
with one-sentence reason for any NEEDS WORK.
```

**HITL checklist:**
- [ ] Review every "NEEDS WORK" item — fix or document why ignored
- [ ] Don't suppress findings without justification in the PR description
- [ ] Self-review is NOT a substitute for peer review

### 8.9 Refactoring

**Tool:** GitHub Copilot + Copilot Chat (**🚧 R-22 gated**).

**Prompt pattern:**
```
Refactor this code to:

[paste refactoring goal — e.g., "extract the validation logic into a
separate method", "replace the if/else chain with a strategy pattern",
"convert sync to async/await"]

Code:
[paste]

Constraints:
- Behavior must be identical (no functional changes)
- All existing tests must continue to pass
- Don't introduce new dependencies without flagging
- Match our code style: [paste link to style guide]
- Make changes in small, reviewable chunks (one concept per commit)

Output the refactored code with a brief explanation of what changed and why.
```

**HITL checklist:**
- [ ] Existing tests pass without modification (proves behavior preserved)
- [ ] Add tests for the refactored seams
- [ ] PR description explains the refactor and the value
- [ ] If the diff is large, split into multiple PRs

### 8.10 Documentation

**Tool:** Copilot Chat for drafts; Rovo for Confluence integration (Rovo ✅ today, Copilot Chat 🚧 R-22).

**Prompt pattern (code → README):**
```
Generate a README.md section for this module:

[paste relevant code or describe the module]

Include:
- Purpose (1 paragraph)
- Architecture diagram (Mermaid syntax — NOT Visio JPEG)
- API reference (per public method: signature, params, returns, throws,
  example usage)
- Configuration (env vars, settings, secrets — note where they're stored,
  not the values)
- How to run locally (assume our standard dev setup)
- How to run tests
- Known limitations / gotchas

Keep it focused. Don't repeat what the code already says.
```

**Prompt pattern (story → Confluence) using Rovo:**
```
Update the Confluence page [link] with the changes from this completed story:

Story: [Jira key]
What changed: [brief description]
Affected sections of the page: [list]

Preserve the existing page structure. Add a "Changes" section at the bottom
with date and Jira link.
```

**HITL checklist:**
- [ ] Verify code examples in docs actually compile/run
- [ ] Verify API signatures match real method signatures (Copilot can drift)
- [ ] No real env var values in docs — placeholders only
- [ ] Architecture diagrams in **Mermaid**, not pasted JPEG (R-27)

### 8.11 Bug investigation

**Tool:** GitHub Copilot Chat (**🚧 R-22 gated**) + Rovo for Confluence runbook lookup (✅ today).

**Prompt pattern:**
```
I'm debugging this issue:

Symptom: [paste defect description]
Stack trace: [paste]
Recent changes (last 7 days) to affected area: [paste git log or PR list]
Reproduction steps: [paste]

Help me:
1. Identify the most likely root cause area (file/method) based on stack trace
2. Suggest 3 hypotheses for what could cause this
3. For each hypothesis, suggest the smallest test to confirm/refute
4. Note any similar patterns in our codebase that might be related

Constraint: Don't suggest fixes yet — I want to confirm the cause first.
```

**HITL checklist:**
- [ ] Verify the suggested file/method actually exists and is reached by the code path
- [ ] Confirm hypothesis with a real test before implementing fix
- [ ] Document the root cause in the bug ticket (so future devs learn)

### 8.12 Story-decomposition / AC-to-validator concat-prompt

**Tool:** Atlassian Rovo (✅ today)

**Use case:** Translate AC list into level-2 (North52) or level-3 (JS) validator pseudocode in bulk.

**Prompt pattern:**
```
Below are the acceptance criteria for [Jira story key].

For each AC, produce:
1. A one-line restatement in Given/When/Then form
2. The implementation level (out-of-box rule / North52 / JS / plugin)
   based on this precedence: [paste §2 table summary]
3. Pseudocode for the rule or validator

Acceptance criteria:
[paste AC list verbatim]

Constraint: don't generate executable code yet — pseudocode only.
The developer will translate after reviewing your level classification.
```

This pattern was demonstrated live Apr 23 — Rovo produced a usable epic/user-story breakdown ("as a customer service representative / case worker / intake specialist / case manager …"). Microsoft Copilot's web pane choked on the same diagram (low-resolution decode).

---

## 9. Highest-value Copilot fits (Apr 23 ranking)

In priority order, the developer-track AI use cases with the strongest ROI on the Intact workflow:

1. **Plugin / PCF / Azure Function authoring in Visual Studio** — strongest GitHub Copilot fit on the entire workflow. **🚧 Gated by R-22.**
2. **JavaScript form-event handlers** (OnChange / OnSave) — easy GitHub Copilot win, plus generated unit-test scaffolding. **🚧 Gated by R-22.**
3. **Power Automate flow scaffolding** — Copilot pane already enabled in gov tenant. Use today.
4. **Story-to-validator generation** (concat-prompt from JIRA AC → North52 expression or JS validator) — proven approach, Rovo today.
5. **Story decomposition from a diagram via Rovo** — proven live Apr 23 on a case-flow diagram.
6. **Dataverse table & relationship modeling** — Power Apps Copilot for tables enabled. Use today.

---

## 10. Where AI is NOT helpful or risky (Apr 23 findings)

- **Power Apps drag-and-drop form designer** — Copilot for forms is **not enabled in this GCC tenant** (R-24). Even when enabled, the gain on a drag-and-drop UI is marginal vs. pro-code.
- **Visio-as-JPEG diagram ingestion** — confirmed live failure: Microsoft Copilot rejected the case-flow image with a low-resolution-decode error. LLMs need Mermaid or text relationships. **Content-format problem upstream of AI, not an AI capability problem.** Cross-ref R-27.
- **Auto-applied configuration / code** — explicit human-in-the-loop policy: AI may generate code/config but a human must review and submit. **No auto-push, ever.** AI generates; the human submits.
- **Dynamics 365 in-app Copilot** — Jeff correctly flagged Apr 23 that this is end-user / business-process facing (chat, case-history surfacing, embedded agents), not an SDLC accelerator. **Don't conflate it with the developer copilots.**
- **Story-driven generation when the story fails the §7 hygiene check** — bad input → worse output. Loop the BA before prompting.
- **Cross-team code paste without context** — out-of-context suggestions; potential cross-team confusion. Stick to your team's codebase or ask the owner.

---

## 11. Workflow integration

### Where AI fits in the dev workflow (revised for v0.2)

```
STORY ASSIGNED (in "Sprint Backlog" → "In Development")
      ↓
[ROVO — pull story context, linked Confluence pages, AC]
      ↓
[STORY HYGIENE PRE-CHECK §7 — does it pass? If not, loop BA]
      ↓
[IMPLEMENTATION-LEVEL DECISION §2 — out-of-box / North52 / JS / plugin]
      ↓
[ROVO — AC-to-pseudocode / rule narrative]
      ↓
[VS / VS CODE: GitHub COPILOT CHAT — design discussion / pseudocode review]
   (🚧 R-22 gated — until enabled, manual + Rovo only)
      ↓
DESIGN APPROVED (mental or quick chat with peer)
      ↓
[VS / VS CODE: COPILOT — code generation, line by line, HITL on every accept]
   OR
[POWER PLATFORM: in-product Copilot — flow / table / form scaffolding]
      ↓
[COPILOT — generate unit tests alongside the code (level 3/4 only)]
      ↓
LOCAL TEST PASSES
      ↓
[COPILOT CHAT — self-review before PR / submit]
      ↓
PR SUBMITTED → peer review (human, no AI substitute) → approval
   (Power Platform: solution export → reviewed → imported)
      ↓
COMMIT (only after PR approval) — AI generates; the HUMAN submits
      ↓
Story moves to "Queued For Test Release"
```

### Tag every AI-touched commit, PR, and config change

- **In commit message:** Add `[AI-assisted]` tag if Copilot suggested >25% of the code in the commit
- **In PR description:** Add a section "AI Assistance: [tool] used for [tasks]; X% of code AI-suggested vs. human-written"
- **In Power Platform solution import note:** Add line "AI-assisted: [Power Automate Copilot / Power Apps Copilot for tables] used for [purpose]"
- **In Jira story:** Add label `ai-assisted`

This is required for the AI vs. non-AI comparison at end of pilot.

---

## 12. HITL discipline & DCFS guardrails — CRITICAL

This is the most important section of this playbook. Jim's hard constraint: **every AI suggestion is reviewed by a developer + standard peer review + PR / submit approval before commit. No autonomous commits / auto-saves. AI generates; the human submits.**

### Hard rules

1. **No autonomous commits / auto-saves, ever.** Even for trivial changes. Even for Power Platform solution imports. Human reviews + submits.
2. **No DCFS case data in prompts** — no child names, case IDs, family details, real addresses, real DOB, real SSN.
3. **No security documentation in prompts** — security plans, vuln reports, network diagrams, secrets, connection strings.
4. **No production data as test data** — synthetic only.
5. **Every AI-assisted commit / solution import must be tagged** — `[AI-assisted]` in commit message or solution import note.
6. **Peer review must include the AI portion** — reviewer should treat AI-assisted code/config with normal scrutiny, not skip it.
7. **No copy-paste of proprietary code into AI prompts that route to external models** — Copilot's enterprise tier (when provisioned) is approved; verify your prompts go through the enterprise proxy.
8. **Respect §2 precedence in prompts** — don't ask Copilot to write a plugin when a business rule will do.
9. **Pass the §7 hygiene check before invoking code AI on a story** — bad input amplifies.

### Soft rules

- Don't accept Copilot's first suggestion without reading it
- Don't accept long blocks (>10 lines) without thinking through what they do
- Don't suppress Copilot Chat review findings without documented reason
- Don't use AI to write the test AND the implementation simultaneously without independent verification
- Treat 100% Copilot acceptance rate as a yellow flag — you may not be reviewing
- Treat <20% acceptance rate as a yellow flag — you may not be using it for the right tasks
- Don't paste a Visio JPEG into a prompt expecting useful output (R-27) — convert first or use text

### What to do if you suspect a leak

1. Stop using AI in the affected code area
2. Note exactly what was pasted (don't paste it again to recall)
3. Notify Pilot Governance Lead immediately
4. Do not commit / push / submit the affected code or config until reviewed

### What to do if Copilot generates something that looks like real data

1. Don't commit it
2. Regenerate with explicit "use only synthetic data" instruction
3. If it persists, report to Vinay — may indicate training data contamination

---

## 13. Success metrics for developer pilot participants

Tracked from Git/Azure DevOps + GitHub Copilot admin telemetry (when provisioned) + Power Platform admin analytics + Tempo + Jira.

> **Note for v0.2:** until R-22 is resolved, GitHub Copilot-dependent metrics (LOC AI-assisted, acceptance rate, active days) are **deferred** — track them as soon as provisioning lands. Power Automate Copilot and Power Apps Copilot for tables metrics can begin immediately.

### Productivity

| Metric | Source | Target |
|--------|--------|--------|
| Lines of AI-assisted code accepted per dev per sprint | Copilot admin | trended (deferred until R-22 resolves) |
| Power Automate flows scaffolded with Copilot per sprint | Power Platform admin / self-report | trended |
| Dataverse tables created via Copilot per sprint | Power Platform admin / self-report | trended |
| Story points completed per dev per sprint | Jira velocity | +10-15% over baseline |
| Hours per story point (Tempo) | Tempo | -10-15% over baseline |
| PR cycle time (open → merged) | Azure DevOps Repos | -10% |
| Documentation lines per sprint | Git diff on doc files | trended |

### Quality (guardrails — must not regress)

| Metric | Source | Target |
|--------|--------|--------|
| Defects caught at Dev stage (unit tests, self-review) | Jira "found in" | ↑ (earlier catch) |
| Defects escaping to Test stage from this dev's stories | Jira | flat or ↓ |
| Defects escaping to UAT/Prod | Jira | flat or ↓ |
| Review iterations per PR | Azure DevOps | flat (NOT ↑ — would suggest AI code is buggy) |
| Code coverage delta on touched files | Coverage tool | flat or ↑ |
| Static analysis findings (SonarQube) per KLOC | SonarQube | flat or ↓ |

### Adoption / activity

| Metric | Source | Target |
|--------|--------|--------|
| GitHub Copilot acceptance rate | Copilot admin | 40-70% (deferred until R-22) |
| GitHub Copilot active days per week | Copilot admin | 4-5 (deferred until R-22) |
| Power Automate Copilot prompt invocations per sprint | Power Platform admin | trended |
| % commits tagged `[AI-assisted]` | Git log scan | trended |
| % PRs with AI Assistance section filled in | PR review | 100% (compliance) |

### Self-reported

| Metric | Source | Target |
|--------|--------|--------|
| Time saved per story (hrs) | Weekly check-in | self-reported, trended |
| Confidence in AI code (1-5) | Monthly survey | ≥ 4 by Sprint 4 |
| Hardest tasks for AI (free text) | Monthly survey | informs Phase 2 |
| Story-quality blockers encountered (count + examples) | Weekly check-in | trended (informs R-26 mitigation) |

---

## 14. Training emphasis

### Pre-pilot training (3h, before PI Planning)

| Module | Duration | Content |
|--------|----------|---------|
| Foundation (shared) | 1.5h | DoIT compliance, HITL, success criteria |
| Developer track | 3h | §2 precedence drill, §5 which-Copilot-for-which-task drill, Copilot in VS / VS Code, Copilot Chat workflows, prompt patterns (the 12 above), §7 story-hygiene check, HITL discipline drills, anti-patterns, accessibility considerations, security review |

### Critical training emphases

- **Implementation precedence (§2)** — drill until it's habit. Don't drop to plugin when a rule will do.
- **Which Copilot for which task (§5)** — pick the Copilot that lives in the tool you're already in
- **HITL discipline** — drill the workflow until it's habit. The biggest pilot risk is autonomous commits / auto-saves.
- **Story hygiene pre-check (§7)** — bad input amplifies. Don't prompt on a broken story.
- **Reading AI-generated code** — slow down on long blocks; read before accepting
- **D365 plugin patterns** — Copilot needs your codebase patterns as reference; build a "good examples" file
- **Power FX peculiarities** — Copilot can hallucinate Power FX function names; verify against reference
- **Mermaid for architecture diagrams** — don't paste Visio JPEGs into prompts (R-27)
- **Synthetic data** — what real-vs-synthetic looks like
- **Commit/PR/import-note tagging** — `[AI-assisted]` discipline is required for measurement

---

## 15. Anti-patterns

| Anti-pattern | Why it's bad | What to do instead |
|--------------|--------------|-------------------|
| **Asking Copilot to write a plugin when a level-1 rule would do** (NEW v0.2) | Bypasses §2 precedence; team accumulates plugins it doesn't need | State precedence justification in every level-3/4 prompt |
| **Prompting on a broken story** (NEW v0.2) | AI fills gaps with confident fabrications | Run §7 hygiene check first; loop BA on failures |
| **Pasting a Visio JPEG into a prompt** (NEW v0.2) | LLM rejects or low-quality decodes (R-27) | Convert to Mermaid or paste text relationships |
| Accepting long Copilot suggestions without reading | The biggest HITL risk; Jim's hard constraint | Read every line; reject if you can't explain it |
| Pasting connection strings, secrets, env vars, or PII into prompts | Hard policy violation | Use placeholders; never paste real secrets |
| Letting Copilot autocomplete without thinking | You stop being the engineer | Pause; think; then accept or reject |
| Removing the `[AI-assisted]` tag because it "looks bad in PRs" | Skews comparison; hides the truth | Tag accurately; the data is the point |
| Using Copilot to write a test that asserts the same thing the code under test does | Tautological — test always passes | Human owns the assertion |
| Generating a refactor that changes behavior without realizing | Silent regression | Existing tests must still pass without modification |
| Skipping peer review for "trivial AI-generated changes" | Trivial-looking AI code can have subtle bugs | Peer review every PR / solution import, no exceptions |
| Pasting another team's code without their context | Out-of-context suggestions; potential cross-team confusion | Stick to your team's codebase or ask the owner |
| Asking Copilot to "fix" a failing test by changing the assertion | Defeats the test's purpose | Fix the code; if the test is wrong, document why and rewrite carefully |
| Trusting Copilot Chat's "this is secure" assessment without security review | False confidence | Use security training + threat modeling; don't outsource security to AI |
| Using D365 in-app Copilot as an SDLC accelerator (NEW v0.2) | It's end-user / business-process facing, not for dev work | Use GitHub Copilot, Power Automate Copilot, Power Apps Copilot for tables, or Rovo per §5 |

---

## 16. Open questions / blockers

1. **GitHub Copilot enablement timeline** for this team's GCC environment — escalation in flight to Jim/Dave (R-22). Target: before May 12 freedom-to-use date.
2. **GitHub Copilot tier** — Pro / Business / Enterprise. Pro is working assumption; need Business or Enterprise for govt-appropriate data handling. Owner: Jeff Lobo / DoIT.
3. **Microsoft Purview telemetry stand-up** — needed before usage is approved at scale (token usage, DLP). Owner: Vinay (governance phase).
4. **Power Apps form-designer Copilot** — confirm whether GCC release-cadence gap or tenant-config gap with Microsoft / DoIT (R-24).
5. **Chaitanya environment access** — still pending on some environments; small but real onboarding lag.
6. **North52 license / API surface** — can we generate North52 expressions programmatically from JIRA AC? Worth a focused investigation.
7. **Plugin / PCF source-control patterns** — Copilot value is much higher with an existing repo of grounded patterns. Confirm what exists.
8. **Existing unit-test coverage for plugins / JS** — affects test-generation use case ROI.
9. **Section 5e Agency Head consent** for Copilot to access ILC source (R-05 blocker).
10. **Visio→Mermaid migration plan** for architecture diagrams (R-27 / task 18a).
11. **Existing PR template** — need to add the AI Assistance section.
12. **"Good examples" files per pattern** (plugin, PCF, etc.) — AI prompts work much better with these as reference.
13. **SonarQube setup + baseline** — need pre-pilot snapshot for quality guardrails.
14. **Security champion per team** — AI-generated code needs extra security review.

---

## 17. Pilot participant checklist

Before you start using AI on dev work:

- [ ] Foundation training complete
- [ ] Developer track complete (including §2 precedence + §5 which-Copilot drills)
- [ ] §7 story-hygiene pre-check internalized
- [ ] GitHub Copilot deployed and signed in (verify enterprise proxy) — **🚧 deferred until R-22 resolves**
- [ ] GitHub Copilot Chat enabled — same
- [ ] Power Automate Copilot access verified in `make.gov.powerautomate.us`
- [ ] Power Apps Copilot for tables access verified in `make.powerapps.com`
- [ ] Rovo access on DCFS Jira/Confluence
- [ ] Read this playbook end-to-end
- [ ] HITL discipline drill completed (Vinay-led)
- [ ] PR template updated with AI Assistance section
- [ ] Power Platform solution-import note convention understood
- [ ] Commit message tagging convention understood
- [ ] `ai-assisted` Jira label workflow understood
- [ ] Know how to report a suspected leak (Pilot Governance Lead)
- [ ] Synthetic data conventions understood (see Tester playbook 3.2)
- [ ] Tracking time saved in weekly check-in
- [ ] Mermaid-vs-Visio guidance understood (R-27)

---

## Appendix A: Reference

| For details on... | See |
|-------------------|-----|
| Prior playbook version (Apr 21) | [./playbook-developer-v20260421.md](./playbook-developer-v20260421.md) |
| Apr 23 Dynamics-developer-workflow walkthrough summary | [../../../meeting-notes/team/2026-04-23-dynamics-developer-workflow-walkthrough-summary.md](../../../meeting-notes/team/2026-04-23-dynamics-developer-workflow-walkthrough-summary.md) |
| Risk register (R-22, R-24, R-26, R-27) | [../strategy/assumptions-and-risks.md](../strategy/assumptions-and-risks.md) |
| Tool authorization list (GitHub Copilot status, Power Platform Copilot enablement matrix) | [../strategy/tool-authorization-list.md](../strategy/tool-authorization-list.md) |
| Engagement scope, in/out, Phase 2/3 | [../scope-running-book-v04212026.md](../scope-running-book-v04212026.md) |
| Measurement methodology | [../measurement-methodology-v04142026.md](../measurement-methodology-v04142026.md) |
| Rollout plan + timeline (task 18a Visio→Mermaid) | [../../rollout-plan.md](../../rollout-plan.md) |
| DoIT policy + governance | [../governance-proposal-v04142026.md](../governance-proposal-v04142026.md) |
| Code generation policy | [../code-generation-policy-review.md](../code-generation-policy-review.md) |
| Other role playbooks | [./](.) |
