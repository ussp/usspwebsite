# State of Illinois DoIT AI Policy — Summary for DCFS Engagement

> **Source:** "Policy on the Acceptable and Responsible Use of Artificial Intelligence"
> **Issued by:** Department of Innovation and Technology (DoIT)
> **Effective:** April 1, 2025
> **Full document:** `20250401-DoIT-AI Policy-v2- A11Y.pdf`

---

## What This Means for Our AI Pilot

This policy governs ALL AI use within State of Illinois agencies, including DCFS. Our AI productivity pilot must comply fully. The policy is **reasonable and manageable** — it's primarily about oversight, transparency, and data protection. Nothing in it blocks our planned use of Copilot/Rovo for developer productivity.

---

## Key Requirements That Affect Us

### 1. Human in the Loop (Section 4d, 6)
- AI shall NOT make decisions autonomously without human oversight
- Must have "human in the loop" for all decisions
- **Our compliance:** Our pilot is advisory AI (Copilot suggests, human decides). BAs review AI-generated stories. Testers review AI-generated tests. Developers review AI-suggested code. This is fully compliant.

### 2. No Access to Protected Data (Section 4f)
- AI Systems shall NOT have direct or indirect access to data protected under PIPA, HIPAA, CJIS, etc. without **written authorization from Agency Head**
- If authorized: must be in a separate, private environment; data cannot become part of a public model
- Must notify DoIT **30 days prior** to granting AI access to protected data
- **Our compliance:** DCFS handles child welfare data (highly sensitive). GitHub Copilot and Rovo do NOT access DCFS case data — they assist with code and Jira stories, not case files. However, if user stories reference case scenarios or PII patterns, we must train teams to NOT paste real case data into AI prompts. This needs explicit guidance in playbooks.

### 3. Transparency & Disclosure (Section 5)
- Must disclose to users when they're interacting with AI
- Must describe how AI is used in products/services in writing
- Must disclose AI's role in decision-making
- **Our compliance:** Our pilot is internal (dev tools, not public-facing). We should still document AI usage and communicate it to the teams. Include a section in the rollout plan about AI transparency.

### 4. Accountability & Assessment (Section 5f)
- Before using AI, must assess the system's adherence to this policy
- Create a **written assessment report** with Agency Head signoff
- Report must go to DoIT **30 days before** commitment to procurement/deployment
- **Our impact:** We're using tools already approved by the state (Copilot, Rovo). Jim (CIO) may need to verify these tools have already been assessed, OR we may need to produce an assessment report. **Ask Jim about this.**

### 5. Data Management (Section 5e)
- Only use high-quality, trusted, vetted data sources
- Do NOT use State data for AI purposes without express written consent from Agency Head
- Must notify DoIT **30 days before** allowing State data in AI
- **Our compliance:** We're not training models on State data. Copilot uses code context (which is State code). Rovo uses Jira/Confluence data. Jim should confirm these tools' data handling has been reviewed.

### 6. Monitoring & Documentation (Section 7)
- Continuous monitoring of AI Systems
- Extensive documentation of design, deployment, modifications
- Change management processes
- **Our compliance:** Our measurement tool (tools.ussp.co) provides exactly this — continuous monitoring, documented baselines, tracked changes. This is actually a selling point.

### 7. Bias & Fairness (Section 11)
- Regular reviews for bias
- Corrective actions on detection
- Document all algorithm changes
- **Our compliance:** N/A for productivity tools (Copilot/Rovo don't make decisions about people). But good practice to note in our documentation.

### 8. Security Reporting (Section 12)
- All employees/contractors aware of AI security reporting process
- Regular training, email reminders, onboarding
- **Our compliance:** Include AI security awareness in our training materials. Add a section on reporting AI-related concerns.

---

## Action Items for Rollout Plan

| # | Action | Owner | Priority |
|---|--------|-------|----------|
| 1 | Confirm Copilot and Rovo have existing DoIT assessment/approval | Romi (ask Jim) | High |
| 2 | If no existing assessment: produce AI System Assessment Report for Agency Head signoff | Vinay + Robert | High |
| 3 | Add "No PII in AI prompts" rule to ALL playbooks | Vinay | High |
| 4 | Add AI transparency section to rollout plan (disclosure to teams) | Vinay | Medium |
| 5 | Include AI security awareness module in training | Vinay | Medium |
| 6 | Document our measurement approach as "continuous monitoring" (Section 7 compliance) | Vinay | Medium |
| 7 | Confirm data handling for Copilot (does it send code to external servers?) | Robert + Matt | High |
| 8 | Confirm Rovo data handling (does Jira/Confluence data leave Atlassian?) | Robert + Matt | High |

---

## Sections NOT Relevant to Our Pilot

- **Section 4c (Mislead/Manipulate):** Not applicable — we're not creating public-facing AI
- **Section 4a (Discrimination):** Not applicable — productivity tools don't make decisions about people
- **Section 4e (Human Rights):** Not applicable — internal dev tools

---

## Key Quotes to Reference

> "AI Systems shall not make decisions autonomously without oversight. AI Systems must have a 'human in the loop' to ensure that all decisions are, ultimately, made by humans." — Section 4d

> "All employees, contractors, and relevant stakeholders should be made aware of the reporting process and its importance in ensuring the security of AI Systems." — Section 12a

> "Utilizing Agencies shall implement continuous monitoring and maintenance protocols for use of and access to Agency data in AI Systems." — Section 7a

---

*This summary is for internal planning purposes. Reference the full policy document for official language.*
