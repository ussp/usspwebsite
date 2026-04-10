# Appendix B: DoIT AI Policy Compliance Map

## Overview

The State of Illinois Department of Innovation & Technology (DoIT) AI Policy became effective April 1, 2025. It contains 12 sections that govern AI use across all state agencies. This appendix provides a section-by-section compliance map showing how the Krasan AI Transformation Framework addresses each requirement.

**Policy applies to:** All state agencies using AI systems or AI-assisted tools, including contractor/vendor implementations on state projects.

**Our scope:** GitHub Copilot and Atlassian Rovo used for SDLC process augmentation (story writing, code development, testing, documentation) on the Illinois Connect (ILC) program at DCFS.

---

## Section-by-Section Compliance Checklist

### Section 1: Purpose & Scope

| Field | Detail |
|-------|--------|
| **Section** | 1 |
| **Title** | Purpose & Scope |
| **What the policy requires** | Establishes that the policy applies to all AI use by state agencies and their contractors. Defines the policy's jurisdiction over any AI system that processes state data, supports state operations, or is used by state employees or contractors working on state projects. |
| **Our compliance approach** | The framework explicitly scopes AI use to SDLC processes only (story writing, code development, test creation, documentation). No business process automation. No case management or child welfare decision support. All AI tools are used by contractors (Krasan consultants) working on a state project (ILC), which places them squarely within scope. We comply by treating the policy as fully applicable to our engagement. |
| **Status** | Covered |
| **Evidence/deliverable** | AI Usage Playbook (Chapter 3) documents scope limitations. Framework Introduction (Chapter 1) defines SDLC-only scope. Every role-specific playbook (Chapter 10) reiterates boundaries. |

---

### Section 2: Definitions

| Field | Detail |
|-------|--------|
| **Section** | 2 |
| **Title** | Definitions |
| **What the policy requires** | Defines key terms including "AI system," "AI-assisted tool," "generative AI," "high-risk AI," and "automated decision-making." Classification of AI systems determines the level of oversight and assessment required. |
| **Our compliance approach** | GitHub Copilot and Atlassian Rovo are classified as "AI-assisted tools" under the policy, not autonomous AI systems. They provide suggestions that a human reviews, edits, and accepts or rejects. They do not make decisions. They do not process case data. They are not "high-risk AI" because they do not affect rights, safety, or welfare determinations. This classification is documented and confirmed with DCFS CIO. |
| **Status** | Covered |
| **Evidence/deliverable** | Chapter 3 compliance map documents tool classification. Training materials (Chapter 7) include a module on understanding AI tool categories and why Copilot/Rovo are "AI-assisted" not "autonomous." |

---

### Section 3: Responsible AI Principles

| Field | Detail |
|-------|--------|
| **Section** | 3 |
| **Title** | Responsible AI Principles |
| **What the policy requires** | State AI use must adhere to principles of transparency, fairness, accountability, privacy, security, and human oversight. Agencies must demonstrate how each principle is upheld in their AI deployments. |
| **Our compliance approach** | Every principle is addressed in the framework: (1) Transparency -- all pilot participants receive written disclosure of AI tool use; AI-generated content is identified. (2) Fairness -- bias awareness training module; per-sprint spot checks for biased AI output. (3) Accountability -- AI Transformation Leader and Engagement Director provide oversight; all AI output is attributed to the human who reviewed and accepted it. (4) Privacy -- no PII, case data, or protected information in AI prompts. (5) Security -- no security documentation in AI contexts. (6) Human oversight -- mandatory human review before any AI output is used. |
| **Status** | Covered |
| **Evidence/deliverable** | Training curriculum (Chapter 7) includes responsible AI module. AI Usage Playbook documents each principle. Guardrails Cheat Sheet (Appendix D) is distributed to all participants. Per-sprint compliance spot checks documented in measurement plan (Chapter 9). |

---

### Section 4: AI Governance Structure

| Field | Detail |
|-------|--------|
| **Section** | 4 |
| **Title** | AI Governance Structure |
| **What the policy requires** | Agencies must establish governance structures for AI oversight, including designated responsible officials, review processes, and escalation procedures. Subsections include: (4a) non-discrimination requirements, (4b) accountability mechanisms, (4c) governance body or designee, (4d) human-in-the-loop requirements, (4e) risk assessment processes, (4f) data access authorization. |
| **Our compliance approach** | (4a) Bias awareness training and per-sprint review of AI-generated content for discriminatory patterns. (4b) Clear accountability chain: Developer/BA/Tester creates the prompt, reviews the output, and owns the result. AI Transformation Leader monitors compliance. (4c) DCFS CIO serves as agency governance authority; Krasan Engagement Director + AI Transformation Leader provide program-level oversight. (4d) Human-in-the-loop is non-negotiable: AI suggests, human decides. Documented in every playbook, enforced through training, verified through spot checks. (4e) Risk assessment performed during governance phase (Chapter 3). (4f) No DCFS case data accessed by AI tools; code and user stories only. Data boundaries documented in AI Usage Playbook. |
| **Status** | Covered |
| **Evidence/deliverable** | Chapter 3 governance structure documentation. AI Usage Playbook distributed to all participants. Training module on human-in-the-loop requirements. Sprint spot-check results logged in tools.ussp.co. |

---

### Section 5a: Approved AI Tools

| Field | Detail |
|-------|--------|
| **Section** | 5a |
| **Title** | Approved AI Tools |
| **What the policy requires** | Only state-approved AI tools may be used. Agencies must maintain an inventory of approved tools and ensure no unauthorized tools are deployed. |
| **Our compliance approach** | The framework uses only two AI tools: GitHub Copilot and Atlassian Rovo. Both are enterprise tools already in the state technology stack. No additional AI tools are introduced without explicit state approval. Training materials explicitly list approved tools and state that no other AI tools (ChatGPT, Claude, Gemini, etc.) may be used for state work. |
| **Status** | Covered |
| **Evidence/deliverable** | AI Usage Playbook lists approved tools. Training materials (Chapter 7) include approved/prohibited tool list. Guardrails Cheat Sheet (Appendix D) has "Approved Tools" section. |

---

### Section 5b: AI Training Requirements

| Field | Detail |
|-------|--------|
| **Section** | 5b |
| **Title** | AI Training Requirements |
| **What the policy requires** | Staff using AI tools must receive appropriate training before use. Training must cover responsible AI use, data handling, and tool-specific capabilities and limitations. |
| **Our compliance approach** | The framework includes a comprehensive training program (Chapter 7) with three tracks: Foundation (all participants), Role-Specific (BA, Tester, Developer), and Advanced. Foundation track covers DoIT policy compliance, responsible AI principles, data boundaries, and human-in-the-loop requirements. No consultant uses AI tools in production work until they complete Foundation training. Training completion is tracked in tools.ussp.co. |
| **Status** | Covered |
| **Evidence/deliverable** | Training curriculum (Chapter 7). Training completion records in tools.ussp.co. Foundation track attendance is a prerequisite for pilot participation. |

---

### Section 5c: Data Classification

| Field | Detail |
|-------|--------|
| **Section** | 5c |
| **Title** | Data Classification |
| **What the policy requires** | AI tools must not process data above their authorized classification level. Data handling rules must be documented and enforced. Sensitive, confidential, and personally identifiable information requires explicit authorization for AI processing. |
| **Our compliance approach** | Strict data boundaries enforced: (1) No PII of any kind in AI prompts. (2) No child welfare case data (CANTS, case notes, investigation records). (3) No security documentation or architecture diagrams. (4) No substance abuse records (42 CFR Part 2). (5) No educational records (FERPA). (6) No health information (HIPAA). (7) No federal tax information (IRS Pub 1075). AI tools are used only with source code, user story text, test case descriptions, and technical documentation -- all non-sensitive SDLC artifacts. |
| **Status** | Covered |
| **Evidence/deliverable** | AI Usage Playbook data classification section. Training module on data boundaries. Per-sprint spot checks verify no protected data in AI prompts. Guardrails Cheat Sheet includes "Never Share" list. |

---

### Section 5d: AI Output Review

| Field | Detail |
|-------|--------|
| **Section** | 5d |
| **Title** | AI Output Review |
| **What the policy requires** | All AI-generated output must be reviewed by a qualified human before it is used, published, or acted upon. Agencies must document their review processes. |
| **Our compliance approach** | Human review is mandatory and non-negotiable across the entire framework. Copilot code suggestions are reviewed by the developer before acceptance. Rovo-generated story text is reviewed by the BA before submission. AI-generated test cases are reviewed by the tester before execution. No AI output goes into production, JIRA, Confluence, or any state system without human review and approval. This is documented in every role-specific playbook (Chapter 10) and reinforced in training. |
| **Status** | Covered |
| **Evidence/deliverable** | Role-specific playbooks (Chapter 10) document review requirements per process. Training emphasizes "AI suggests, human decides." Spot checks verify human review occurred. |

---

### Section 5e: State Data for AI Purposes

| Field | Detail |
|-------|--------|
| **Section** | 5e |
| **Title** | State Data for AI Purposes |
| **What the policy requires** | Use of state data for AI purposes requires written consent from the Agency Head. "State data for AI purposes" includes any data generated, collected, or maintained by the state that is used as input to, training data for, or context within an AI system. |
| **Our compliance approach** | This section requires CIO confirmation. The open question: does GitHub Copilot accessing ILC source code repositories constitute "state data for AI purposes"? The source code is state-owned, developed under state contract, and hosted in state-managed repositories. If Copilot indexes this code for context (which it does by design), this likely falls under the definition. If yes, written Agency Head consent is required before the pilot begins. |
| **Status** | Needs CIO Input |
| **Evidence/deliverable** | Question documented in Chapter 3, Section "Blockers Requiring CIO Input." Must be resolved before pilot start. If consent is required, the written authorization becomes a compliance artifact. Romi (Engagement Director) to raise with Jim (CIO) during executive discovery. |

---

### Section 5f: AI System Assessment Report & 30-Day Notice

| Field | Detail |
|-------|--------|
| **Section** | 5f |
| **Title** | AI System Assessment Report & 30-Day Notice |
| **What the policy requires** | Before deploying a new AI system, agencies must complete an AI System Assessment Report and submit it to DoIT with Agency Head signoff. DoIT requires 30 calendar days advance notice before a new AI system is put into use. |
| **Our compliance approach** | This section requires CIO confirmation. Two questions: (1) Has an AI System Assessment Report already been filed for GitHub Copilot and/or Atlassian Rovo at DCFS? If these tools are already assessed and approved at the agency level, no additional filing is needed for our engagement. (2) If not filed, the 30-day notice requirement creates a hard schedule constraint -- the earliest legal pilot start is 30 calendar days after filing. This could push the pilot past PI Planning (May 5-7). |
| **Status** | Needs CIO Input |
| **Evidence/deliverable** | Question documented in Chapter 3. Critical path item for pilot scheduling. If assessment has not been filed, Krasan will assist with preparation of the AI System Assessment Report. Filed assessment and Agency Head signoff become compliance artifacts. |

---

### Section 6: Incident Response

| Field | Detail |
|-------|--------|
| **Section** | 6 |
| **Title** | Incident Response |
| **What the policy requires** | Agencies must have procedures for handling AI-related incidents, including biased output, security breaches, data leakage, and system failures. Incidents must be reported, documented, and remediated according to established procedures. |
| **Our compliance approach** | The framework includes incident response procedures: (1) AI produces biased or inappropriate output -- document, report to AI Transformation Leader, add to sprint retro for discussion. (2) Protected data accidentally entered into AI tool -- immediately report to AI Transformation Leader and DCFS security; incident logged and remediated per DCFS security policy. (3) AI tool outage -- teams revert to non-AI workflows (all processes have manual fallback). Training module covers what constitutes an incident and how to report it. Reporting channel established in Microsoft Teams. |
| **Status** | Covered |
| **Evidence/deliverable** | AI Usage Playbook incident reporting section. Training module on incident identification and reporting. Microsoft Teams reporting channel. Sprint retrospectives include AI-specific incident review. |

---

### Section 7: Continuous Monitoring

| Field | Detail |
|-------|--------|
| **Section** | 7 |
| **Title** | Continuous Monitoring |
| **What the policy requires** | AI systems must be continuously monitored for performance, accuracy, bias, and compliance. Monitoring must be documented and results must be available for review. |
| **Our compliance approach** | The AI Transformation Monitor (tools.ussp.co) provides continuous tracking of all AI-augmented processes. Per-sprint quality spot checks verify AI output quality has not degraded. SPACE and DevEx surveys track team health. Story quality scoring (QUS framework) ensures AI-assisted stories meet quality standards. The leadership dashboard (Chapter 9) provides real-time compliance visibility. All monitoring data is stored and auditable. |
| **Status** | Covered |
| **Evidence/deliverable** | tools.ussp.co dashboard with compliance view. Per-sprint quality spot check results. SPACE/DevEx survey data. Story quality scores tracked over time. Chapter 9 defines full monitoring methodology. |

---

### Section 8: Procurement & Vendor Requirements

| Field | Detail |
|-------|--------|
| **Section** | 8 |
| **Title** | Procurement & Vendor Requirements |
| **What the policy requires** | AI tools and services procured by the state must meet policy requirements. Vendors providing AI services must demonstrate compliance with state AI policy. Contracts must include AI-specific terms. |
| **Our compliance approach** | GitHub Copilot and Atlassian Rovo are procured through existing state enterprise agreements. Krasan does not procure additional AI tools. The AI Transformation Framework is a professional services engagement (consulting, training, measurement), not an AI tool procurement. tools.ussp.co is a reporting/monitoring platform owned by the vendor (USSP/Krasan), not deployed on state infrastructure. |
| **Status** | Covered |
| **Evidence/deliverable** | Existing procurement documentation for Copilot/Rovo (state-managed). Krasan engagement contract terms. tools.ussp.co operates as vendor SaaS, not state-hosted. |

---

### Section 9: Record Keeping & Documentation

| Field | Detail |
|-------|--------|
| **Section** | 9 |
| **Title** | Record Keeping & Documentation |
| **What the policy requires** | Agencies must maintain records of AI system assessments, training completion, monitoring results, incidents, and compliance activities. Records must be retained per state retention schedules. |
| **Our compliance approach** | All framework activities are documented and retained: (1) Readiness assessments stored in tools.ussp.co. (2) Training completion records tracked per participant. (3) Baseline and pilot measurement data retained. (4) Compliance spot check results logged. (5) Incident reports documented. (6) Meeting notes from all check-ins retained. (7) All deliverables (playbooks, reports, dashboards) archived. Data retention follows DCFS/state requirements. |
| **Status** | Covered |
| **Evidence/deliverable** | tools.ussp.co data retention. Framework deliverable archive. Training completion records. Compliance activity log. All meeting notes (Chapter 2 template). |

---

### Section 10: Public Disclosure & Transparency

| Field | Detail |
|-------|--------|
| **Section** | 10 |
| **Title** | Public Disclosure & Transparency |
| **What the policy requires** | Agencies must be transparent about their use of AI, including public-facing disclosures where appropriate. Citizens and stakeholders should be able to understand where and how AI is used in state operations. |
| **Our compliance approach** | Our AI use is internal to the SDLC process -- it does not affect any public-facing service, citizen interaction, or case outcome. AI-assisted code, stories, and tests go through the same QA and release process as non-AI-assisted work. The public interacts with the ILC system, not with the AI tools. However, if DCFS requires public disclosure of AI use in software development, we will support that disclosure. Written disclosure is provided to all pilot participants (160+ consultants). |
| **Status** | Covered |
| **Evidence/deliverable** | Written disclosure to pilot participants. Framework documentation available for state review. If public disclosure required, Krasan will draft appropriate language. |

---

### Section 11: Non-Discrimination & Bias Prevention

| Field | Detail |
|-------|--------|
| **Section** | 11 |
| **Title** | Non-Discrimination & Bias Prevention |
| **What the policy requires** | AI systems must not discriminate based on protected characteristics. Agencies must assess AI tools for potential bias and implement safeguards. Regular bias audits are required for AI systems that affect individuals. |
| **Our compliance approach** | (1) Copilot and Rovo are used for code generation and story writing -- they do not make decisions about individuals and cannot discriminate against service recipients. (2) Bias awareness is included in Foundation training -- consultants learn to identify biased assumptions in AI-generated code or text. (3) Per-sprint spot checks review AI-generated content for inappropriate patterns. (4) AI does not touch case decisions, eligibility determinations, or any process affecting children or families. |
| **Status** | Covered |
| **Evidence/deliverable** | Training module on bias awareness. Per-sprint spot check results. Documentation that AI is used for SDLC only, not case/eligibility decisions. |

---

### Section 12: Security & Reporting

| Field | Detail |
|-------|--------|
| **Section** | 12 |
| **Title** | Security & Reporting |
| **What the policy requires** | AI-related security incidents must be reported through established security channels. Agencies must include AI systems in their security monitoring and vulnerability management programs. |
| **Our compliance approach** | (1) AI security incidents (data leakage, unauthorized tool use, prompt injection attempts) are reported through DCFS security channels. (2) Training module covers AI-specific security risks (prompt injection, data exfiltration through prompts, unauthorized tool use). (3) Reporting channel established in Microsoft Teams for immediate escalation. (4) Security documentation is excluded from all AI tool contexts to prevent leakage. (5) Copilot/Rovo enterprise security configurations are managed by DCFS IT, not by Krasan. |
| **Status** | Covered |
| **Evidence/deliverable** | AI Usage Playbook security reporting section. Training module on AI security risks. Teams channel for security reporting. DCFS IT manages enterprise tool security configurations. |

---

## DCFS-Specific Regulatory Considerations

Beyond the DoIT AI Policy, DCFS operates under multiple regulatory frameworks that impose additional constraints on any technology use. The following table documents each regulation's relevance and our compliance approach.

### IL Rule 431 — DCFS Administrative Rules

| Field | Detail |
|-------|--------|
| **Regulation** | Illinois Administrative Code, Title 89, Part 431 |
| **What it governs** | DCFS administrative procedures for child welfare services, including investigation procedures, case management, and service delivery standards. |
| **Relevance to AI engagement** | AI tools must not influence, automate, or augment any case decision, investigation procedure, or service delivery process governed by Rule 431. |
| **Our compliance** | AI is scoped exclusively to SDLC processes (code, stories, tests, docs). Zero business process automation. No case management workflows are AI-augmented. Training explicitly covers Rule 431 boundaries. |
| **Evidence** | AI Usage Playbook scope definition. Training curriculum. Framework scoping documents (Chapter 1, Chapter 3). |

### CANTS — Child Abuse & Neglect Tracking System

| Field | Detail |
|-------|--------|
| **Regulation** | DCFS CANTS database and associated data handling requirements |
| **What it governs** | Records of child abuse and neglect investigations, including reporter information, investigation findings, and indicated/unfounded determinations. CANTS data is among the most sensitive information in state government. |
| **Relevance to AI engagement** | CANTS data must never appear in any AI prompt, AI tool context, or AI-generated output. Even indirect references (case numbers, reporter names, investigation details) are prohibited. |
| **Our compliance** | Absolute prohibition on CANTS data in AI contexts. Training module specifically addresses CANTS boundaries. Data boundary rules in AI Usage Playbook. Per-sprint spot checks verify no CANTS data leakage. ILC developers working on CANTS-related modules receive additional guidance on separating code context from data context when using Copilot. |
| **Evidence** | AI Usage Playbook "Never Share" list. Training materials with CANTS-specific examples. Spot check logs. |

### 42 CFR Part 2 — Confidentiality of Substance Use Disorder Records

| Field | Detail |
|-------|--------|
| **Regulation** | 42 CFR Part 2 (Federal) |
| **What it governs** | Protects records of individuals receiving treatment for substance use disorders from federally assisted programs. Imposes stricter protections than HIPAA for substance abuse treatment records. Requires specific written patient consent for disclosure. |
| **Relevance to AI engagement** | If ILC handles any substance abuse treatment records (e.g., referrals, treatment history for parents in child welfare cases), those records are subject to 42 CFR Part 2 protections. AI tools must not process, reference, or generate content related to these records. |
| **Our compliance** | All substance abuse-related data is excluded from AI tool contexts. AI tools interact only with SDLC artifacts (code, stories, tests), not with case data of any kind. Training covers 42 CFR Part 2 as a specific data boundary. |
| **Evidence** | AI Usage Playbook data classification. Training module on federal data protections. |

### FERPA — Family Educational Rights and Privacy Act

| Field | Detail |
|-------|--------|
| **Regulation** | 20 U.S.C. Section 1232g; 34 CFR Part 99 (Federal) |
| **What it governs** | Protects the privacy of student education records. Applies to all schools and agencies that receive funds from the U.S. Department of Education. DCFS may hold educational records for youth in care. |
| **Relevance to AI engagement** | If ILC stores or processes educational records (school enrollment, grades, IEPs, disciplinary records for youth in care), those records are FERPA-protected. AI tools must not access or process these records. |
| **Our compliance** | All educational records excluded from AI contexts. AI tools interact only with SDLC artifacts. Training covers FERPA as a specific data boundary. |
| **Evidence** | AI Usage Playbook data classification. Training module on federal data protections. |

### HIPAA — Health Insurance Portability and Accountability Act

| Field | Detail |
|-------|--------|
| **Regulation** | 45 CFR Parts 160, 162, 164 (Federal) |
| **What it governs** | Protects individually identifiable health information (Protected Health Information / PHI). Applies to covered entities and their business associates. DCFS may be a covered entity or business associate depending on the health data it handles. |
| **Relevance to AI engagement** | If ILC stores or processes health information (medical records, mental health assessments, immunization records for youth in care), that data is HIPAA-protected. AI tools must not access or process PHI. |
| **Our compliance** | All health information excluded from AI contexts. AI tools interact only with SDLC artifacts. Training covers HIPAA as a specific data boundary. No health data in any AI prompt under any circumstances. |
| **Evidence** | AI Usage Playbook data classification. Training module on federal data protections. |

### IRS Publication 1075 — Tax Information Security Guidelines

| Field | Detail |
|-------|--------|
| **Regulation** | IRS Publication 1075 (Federal) |
| **What it governs** | Governs the receipt, processing, storage, and destruction of Federal Tax Information (FTI) by state and local agencies. DCFS may access FTI for eligibility verification, fraud investigation, or income verification. |
| **Relevance to AI engagement** | FTI is subject to extremely strict handling requirements, including criminal penalties for unauthorized disclosure (26 U.S.C. 7213). AI tools must never process, reference, or have access to any system containing FTI. |
| **Our compliance** | All FTI is excluded from AI contexts. AI tools operate only on SDLC artifacts in development environments, not on production systems containing FTI. Training covers IRS Pub 1075 as a specific, high-severity data boundary. |
| **Evidence** | AI Usage Playbook data classification with FTI-specific callout. Training module on federal data protections. |

### CCWIS Final Rule — Comprehensive Child Welfare Information System

| Field | Detail |
|-------|--------|
| **Regulation** | 45 CFR 1355 (Federal) — CCWIS Final Rule |
| **What it governs** | Sets federal requirements for state child welfare information systems that receive federal matching funds. Covers data quality, system interoperability, case management functionality, and reporting requirements. ILC is a CCWIS system. |
| **Relevance to AI engagement** | AI augmentation of the SDLC must not affect CCWIS certification or compliance. Code generated or augmented by AI must meet the same quality, security, and functional standards as manually written code. AI must not alter CCWIS-required data flows, reporting, or interoperability. |
| **Our compliance** | AI augments the development process, not the system functionality. AI-generated code goes through the same QA, code review, and testing pipeline as all other code. CCWIS modules remain functionally identical regardless of whether AI assisted in writing the code. The framework measures quality (defect density, first pass yield, story quality) to ensure AI augmentation does not degrade the system. |
| **Evidence** | Quality KPIs (Chapter 9) track defect density, first pass yield, and defect escape rate. Code review processes unchanged. QA processes unchanged. CCWIS certification status unaffected. |

---

## Compliance Summary

| Status | Count | Sections |
|--------|-------|----------|
| **Covered** | 10 | 1, 2, 3, 4, 5a, 5b, 5c, 5d, 6, 7, 8, 9, 10, 11, 12 |
| **Needs CIO Input** | 2 | 5e, 5f |
| **Pending** | 0 | -- |

### Critical Path Items

1. **Section 5e (State Data for AI):** Requires CIO determination on whether Copilot accessing ILC source code constitutes "state data for AI purposes." If yes, Agency Head written consent is required before pilot start.

2. **Section 5f (Assessment & 30-Day Notice):** Requires CIO confirmation on whether the AI System Assessment Report has been filed for Copilot and Rovo. If not filed, the 30-day notice requirement creates a hard scheduling constraint that could delay the pilot past PI Planning.

Both items are raised during executive discovery (Chapter 2) and tracked as blockers in the governance checklist (Chapter 3).

---

## Cross-References

- **Chapter 3:** Governance & Compliance -- primary compliance documentation
- **Chapter 7:** Training Delivery -- policy compliance training content
- **Chapter 9:** Measurement & Reporting -- compliance dashboard view
- **Chapter 10:** Playbooks -- per-role guardrails referencing policy sections
- **Appendix D:** Templates -- Guardrails Cheat Sheet for quick reference
