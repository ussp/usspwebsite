# State of Illinois DoIT AI Policy — Summary for DCFS Engagement

> **Source:** "Policy on the Acceptable and Responsible Use of Artificial Intelligence"
> **Issued by:** Department of Innovation and Technology (DoIT)
> **Effective:** April 1, 2025
> **Full document:** `20250401-DoIT-AI Policy-v2- A11Y.pdf`

---

## What This Means for Our AI Pilot

This policy governs ALL AI use within State of Illinois agencies, including DCFS. Our AI productivity pilot must comply. The policy covers 12 sections — every section applies to some degree, even for internal developer tools.

**However, we do NOT yet know which requirements DCFS has already addressed.** Jim/DCFS may have already filed DoIT assessments, obtained Agency Head consent, and designated an AI Policy officer. If so, many of these are already handled and we just need to operate within the existing approval.

**The executive discovery questionnaire (Section 9) asks Jim to clarify exactly what's already done vs what we need to do.** Until we get those answers, the requirements below are listed as "needs clarity" rather than assumed mandatory or assumed covered.

### Three possible states for each requirement:
- **Already handled** — DCFS has done this at the agency level, we operate under it
- **We need to do** — Not done yet, we must produce the deliverable before pilot
- **Needs clarity** — Ask Jim (see discovery questionnaire Section 9)

---

## Policy Requirements — Full Compliance Map

### 1. Non-Discrimination (Section 4a)
**Policy:** AI Systems shall not discriminate based on race, gender, religion, ethnicity, disability, economic status, or any protected characteristic.

**Applies to our pilot:** Yes. Even though Copilot/Rovo are developer productivity tools, AI-generated code could embed bias (e.g., biased test data, stereotyped sample names in stories). DCFS serves vulnerable populations — the child welfare domain makes this especially sensitive.

**Pilot deliverable:**
- [ ] Training module on AI bias awareness for all pilot participants
- [ ] Playbook section: review AI-generated content for unintentional bias before accepting
- [ ] Documented bias review process for AI-generated user stories and test scripts

---

### 2. Privacy & Copyright (Section 4b)
**Policy:** AI Systems shall not violate data privacy laws, must ensure secure handling of personal information, and avoid copyright infringement.

**Applies to our pilot:** Yes — critically. DCFS handles PIPA-protected child welfare data. Copilot and Rovo may inadvertently receive sensitive data through code context or Jira story descriptions.

**Pilot deliverable:**
- [ ] Strict "No PII in AI prompts" rule in ALL playbooks
- [ ] Training on what constitutes protected data in the DCFS context
- [ ] Confirm Copilot's data retention/transmission policy (does code leave the tenant?)
- [ ] Confirm Rovo's data boundaries (does Jira/Confluence content go to Atlassian AI servers?)
- [ ] Document data flow for each approved AI tool

---

### 3. No Misleading Content (Section 4c)
**Policy:** AI Systems shall not spread false or misleading information, deceive users, or manipulate public opinion.

**Applies to our pilot:** Yes. AI-generated user stories, test scripts, and documentation could contain inaccurate information. In a child welfare system, incorrect requirements or test cases could lead to failures that affect children's safety.

**Pilot deliverable:**
- [ ] Mandatory human review before accepting any AI-generated content
- [ ] Playbook section: verifying AI-generated requirements against domain knowledge
- [ ] Process for flagging and correcting AI-generated misinformation

---

### 4. Human in the Loop (Section 4d, 6)
**Policy:** AI Systems shall NOT make decisions autonomously. Must have "human in the loop" for all decisions. Must define what to automate vs assign to human review with specific justifications.

**Applies to our pilot:** Yes — foundational. This is the easiest requirement to meet since our pilot is advisory AI, but we must document it explicitly.

**Pilot deliverable:**
- [ ] Document scope of AI deployment: what AI assists with vs what humans decide
- [ ] Define human-in-the-loop intervals for each role (BA reviews story, tester reviews tests, etc.)
- [ ] Training: AI suggests, human decides — no auto-accepting AI output
- [ ] Workflow diagrams showing human oversight points in each AI-assisted process

---

### 5. Human Rights (Section 4e)
**Policy:** AI Systems shall not undermine or cause harm to human rights.

**Applies to our pilot:** Yes. The ILC platform manages cases involving at-risk children. Any AI-assisted change to the system that introduces defects could indirectly affect child welfare outcomes.

**Pilot deliverable:**
- [ ] Quality gates: AI-assisted code changes go through same review process as manual changes
- [ ] No reduction in testing or review rigor because "AI helped write it"
- [ ] Document in rollout plan how AI augmentation maintains or improves safety standards

---

### 6. Protected Data Access (Section 4f)
**Policy:** AI Systems shall NOT have direct or indirect access to data protected under PIPA, HIPAA, CJIS, etc. without written Agency Head authorization. If authorized: separate private environment, data cannot become part of public model, 30-day advance notice to DoIT.

**Applies to our pilot:** Yes — high priority. DCFS child welfare data is among the most sensitive government data. Even code comments, variable names, and test data can contain PII patterns.

**Pilot deliverable:**
- [ ] Classify data exposure risk for each AI tool (Copilot sees code, Rovo sees Jira/Confluence)
- [ ] Determine if any AI tool has direct/indirect access to Protected Data
- [ ] If yes: obtain written authorization from Agency Head + notify DoIT 30 days prior
- [ ] If no: document the isolation clearly so there's no ambiguity
- [ ] Training: never paste case data, SSNs, names, or case numbers into AI prompts

---

### 7. Transparency & Disclosure (Section 5a-c)
**Policy:** Disclose to users when interacting with AI. Describe how AI is used in writing. Disclose AI's role in decision-making.

**Applies to our pilot:** Yes. Pilot participants must know they're using AI tools and understand AI's role.

**Pilot deliverable:**
- [ ] Written disclosure to all pilot team members about AI tools in use
- [ ] Document how AI is used in each role's workflow
- [ ] Disclosure statement for any deliverables that were AI-assisted (e.g., "This test script was AI-assisted and human-reviewed")

---

### 8. Human Oversight Roles (Section 5d)
**Policy:** Define and assign clear oversight roles and responsibilities for the entirety of an AI System's lifecycle.

**Applies to our pilot:** Yes. Must have named people responsible for oversight.

**Pilot deliverable:**
- [ ] Name the AI oversight lead for the pilot (Vinay? Romi?)
- [ ] Define escalation path for AI-related concerns
- [ ] Document oversight responsibilities per role (Scrum Lead reviews AI-assisted stories, QA lead reviews AI-generated tests, etc.)

---

### 9. Data Management (Section 5e)
**Policy:** Only use high-quality, trusted, vetted data sources. No State data for AI purposes without express written Agency Head consent + 30-day DoIT advance notice.

**Applies to our pilot:** Yes. Copilot uses code context (State code). Rovo uses Jira/Confluence content (State project data). These are State data being used "for AI purposes."

**Pilot deliverable:**
- [ ] Determine if Copilot/Rovo usage constitutes "use of State data for AI purposes"
- [ ] If yes: obtain Agency Head written consent + submit 30-day DoIT notice
- [ ] Document data sources each AI tool accesses
- [ ] Confirm tools use only vetted, high-quality data (not random internet data)

---

### 10. Accountability Assessment (Section 5f)
**Policy:** Before using AI, assess the system's adherence to this policy. Written assessment report with Agency Head signoff, provided to DoIT 30 days before procurement/deployment.

**Applies to our pilot:** Yes — **this is likely the biggest gate**. We need to determine if Copilot and Rovo already have existing assessments, or if we need to produce new ones.

**Pilot deliverable:**
- [ ] Ask Jim: do Copilot and Rovo have existing DoIT assessment reports?
- [ ] If not: produce AI System Assessment Report for each tool
- [ ] Get Agency Head signoff
- [ ] Submit to DoIT at least 30 days before pilot launch

---

### 11. Workflow Documentation (Section 6)
**Policy:** Establish documented protocols for human oversight. Outline scope of AI deployment. Consider human-in-the-loop intervals. Prefer human oversight over intervention.

**Pilot deliverable:**
- [ ] Document AI deployment scope per role in the rollout plan
- [ ] Define human-in-the-loop checkpoints for each AI-assisted workflow
- [ ] Justify each automation decision (why AI assists here, why human reviews here)

---

### 12. Monitoring, Maintenance & Change Management (Section 7)
**Policy:** Continuous monitoring of AI Systems. Extensive documentation of design, deployment, modifications. Change management for AI data access.

**Applies to our pilot:** Yes — this is a strength for us. Our measurement tool (tools.ussp.co) provides exactly this.

**Pilot deliverable:**
- [ ] tools.ussp.co as the continuous monitoring platform (weekly check-ins, metrics tracking)
- [ ] Document any changes to AI tool configuration during pilot
- [ ] Maintain audit trail of what was measured when

---

### 13. Communication & Feedback Mechanisms (Section 8)
**Policy:** Maintain transparent communication with stakeholders. Develop feedback mechanisms for AI-related concerns.

**Pilot deliverable:**
- [ ] Weekly check-in meetings (already planned)
- [ ] Channel for reporting AI-related concerns (Teams channel? Email alias?)
- [ ] Process for escalating AI issues that affect legal rights

---

### 14. Organizational Awareness (Section 9)
**Policy:** Promote organization-wide awareness of AI's legal, ethical, and operational aspects. Emphasize importance of escalating issues.

**Pilot deliverable:**
- [ ] AI awareness training module for all pilot participants
- [ ] Cover: DoIT policy requirements, ethical use, when to escalate
- [ ] Training attendance tracking

---

### 15. Data Usage & Privacy (Section 10)
**Policy:** Data collected for AI must be relevant, accurate, and necessary. Agency responsible for quality and governance of training data.

**Pilot deliverable:**
- [ ] Document what data each AI tool collects/uses
- [ ] Confirm data is relevant and necessary for the intended purpose
- [ ] No extraneous data collection

---

### 16. Fairness & Bias Mitigation (Section 11)
**Policy:** Conduct and document regular reviews to ensure AI Systems are free from bias. Take corrective and preventative actions. Document all algorithm and process changes. Ensure diverse and representative training data.

**Applies to our pilot:** Yes. Even for dev tools — AI-generated code patterns, test data, and documentation can embed bias. In a child welfare system, this matters.

**Pilot deliverable:**
- [ ] Bias review checklist for AI-generated content (user stories, tests, docs)
- [ ] Periodic bias audit during pilot (monthly? per sprint?)
- [ ] Document any bias incidents found and corrective actions taken
- [ ] Include in playbooks: what bias looks like in AI-generated dev artifacts

---

### 17. Security Reporting (Section 12)
**Policy:** All employees, contractors, and stakeholders must be aware of AI security reporting processes. Training, reminders, onboarding.

**Pilot deliverable:**
- [ ] AI security incident reporting process documented
- [ ] Included in pilot training module
- [ ] Contact person for AI security concerns
- [ ] Onboarding material for new pilot participants

---

## Pilot Compliance Checklist

### Before Pilot Launch (Must Complete)

| # | Requirement | DoIT Section | Owner | Status |
|---|------------|-------------|-------|--------|
| 1 | Confirm Copilot/Rovo have existing DoIT assessment | 5f | Romi (ask Jim) | TODO |
| 2 | If no assessment exists: produce AI System Assessment Report | 5f | Vinay + Robert | TODO |
| 3 | Get Agency Head signoff on assessment | 5f | Romi + Jim | TODO |
| 4 | Submit assessment to DoIT (30 days before launch) | 5f | Romi | TODO |
| 5 | Determine if tool usage = "State data for AI purposes" | 5e | Robert + Vinay | TODO |
| 6 | If yes: obtain written Agency Head consent + 30-day DoIT notice | 5e | Romi | TODO |
| 7 | Classify protected data exposure risk for each tool | 4f | Vinay + Matt | TODO |
| 8 | Confirm Copilot data handling (code transmission policy) | 4b | Robert + Matt | TODO |
| 9 | Confirm Rovo data handling (Jira/Confluence data boundaries) | 4b | Robert + Matt | TODO |
| 10 | Document AI deployment scope and human-in-the-loop design | 4d, 6 | Vinay | TODO |
| 11 | Name AI oversight lead and assign roles | 5d | Romi | TODO |

### During Pilot (Ongoing)

| # | Requirement | DoIT Section | Owner | Cadence |
|---|------------|-------------|-------|---------|
| 12 | Bias review of AI-generated content | 11 | Pilot team leads | Per sprint |
| 13 | Continuous monitoring via tools.ussp.co | 7 | Vinay | Weekly |
| 14 | Weekly check-ins with feedback collection | 8 | Vinay + Romi | Weekly |
| 15 | Document any AI tool config changes | 7 | Matt | As needed |
| 16 | Track and report AI security incidents | 12 | Robert | As needed |
| 17 | Verify no PII in AI prompts (spot checks) | 4b, 4f | Pilot team leads | Per sprint |

### Training Must Cover

| Topic | DoIT Section |
|-------|-------------|
| What AI tools are being used and why | 5a-c |
| No PII / protected data in AI prompts | 4b, 4f |
| Human review required for ALL AI output | 4d, 6 |
| Bias awareness — what to look for in AI-generated content | 4a, 11 |
| AI-generated content can be wrong — verify against domain knowledge | 4c |
| Security reporting — when and how to report AI concerns | 12 |
| Escalation path for AI-related issues | 8, 9 |

---

## Key Quotes to Reference

> "AI Systems shall not make decisions autonomously without oversight. AI Systems must have a 'human in the loop' to ensure that all decisions are, ultimately, made by humans." — Section 4d

> "AI Systems shall not be used, developed, or deployed in ways that could potentially discriminate against individuals or groups of people based on race, gender, religion, ethnicity, disability, economic status, or any other protected characteristic." — Section 4a

> "Utilizing Agencies shall conduct and document regular reviews to ensure that their AI Systems are free from potential biases, with the Utilizing Agencies taking necessary corrective and preventative actions upon bias detection." — Section 11a

> "All employees, contractors, and relevant stakeholders should be made aware of the reporting process and its importance in ensuring the security of AI Systems." — Section 12a

> "Utilizing Agencies shall implement continuous monitoring and maintenance protocols for use of and access to Agency data in AI Systems." — Section 7a

---

*This summary covers all 12 sections of the DoIT AI Policy. Reference the full policy document for official language.*
