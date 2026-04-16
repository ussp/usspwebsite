---
title: "NIST AI RMF Governance"
description: "NIST AI Risk Management Framework mapped to DCFS Illinois Connect"
---

# Chapter 3B: NIST AI RMF Governance

## 1. Overview

### What Is NIST AI RMF 1.0

The National Institute of Standards and Technology (NIST) published the **AI Risk Management Framework (AI RMF 1.0)** in January 2023 as document **NIST AI 100-1**. It is a voluntary framework designed to help organizations manage risks associated with AI systems throughout their lifecycle. Unlike prescriptive regulations, the AI RMF provides a flexible, structured approach that organizations can adapt to their specific context, sector, and risk tolerance.

The framework is organized around four core functions:

| Function | Purpose | Question It Answers |
|----------|---------|-------------------|
| **GOVERN** | Cultivate a culture of AI risk management | "Do we have the right policies, people, and processes?" |
| **MAP** | Frame the risks in context | "What are we building, for whom, and what could go wrong?" |
| **MEASURE** | Assess and track risks quantitatively and qualitatively | "How bad is it, and how do we know?" |
| **MANAGE** | Allocate resources and implement responses | "What are we doing about it?" |

Each function contains numbered subcategories (e.g., GOVERN 1, MAP 2) and further subdivisions (e.g., GOVERN 1.1, GOVERN 1.2) that provide specific, actionable guidance. The framework is designed to be used iteratively -- organizations revisit each function as their AI systems evolve.

**Reference:** NIST. (2023). *Artificial Intelligence Risk Management Framework (AI RMF 1.0).* NIST AI 100-1. National Institute of Standards and Technology. Gaithersburg, MD. DOI: 10.6028/NIST.AI.100-1

### Why It Matters for DCFS

DCFS operates in one of the most sensitive domains in government: child welfare. The data environment includes CANTS (Child Abuse and Neglect Tracking System) records, substance abuse records protected by 42 CFR Part 2, educational records under FERPA, health information under HIPAA, and federal tax information under IRS Publication 1075. Any AI deployment -- even one limited to SDLC process augmentation -- must demonstrate rigorous risk management.

The NIST AI RMF matters for DCFS for five reasons:

1. **Federal alignment.** DCFS operates under the CCWIS Final Rule (45 CFR 1355) and receives federal funding. NIST frameworks are the federal government's preferred approach to risk management. Adopting AI RMF demonstrates alignment with federal expectations.

2. **State complement.** The State of Illinois DoIT AI Policy (effective April 1, 2025) provides state-specific requirements but does not include a structured risk management framework. NIST AI RMF fills that gap.

3. **Stakeholder confidence.** CIO Jim Daugherty has requested a governance team to establish risks and constraints. A NIST-aligned approach provides the credibility and structure needed to satisfy executive, legislative, and federal oversight expectations.

4. **Proportionality.** The AI RMF is risk-based and voluntary, meaning DCFS can adopt it at a level proportional to the actual risk. SDLC augmentation with Copilot and Rovo is materially different from deploying AI for case decisions -- the framework lets us document that distinction rigorously.

5. **Auditability.** State auditors, federal reviewers, and legislative oversight committees expect documented risk management. NIST AI RMF provides a recognized structure that auditors can evaluate against.

### How It Complements the DoIT AI Policy

The DoIT AI Policy and NIST AI RMF are complementary, not competing:

| Dimension | DoIT AI Policy | NIST AI RMF |
|-----------|---------------|-------------|
| **Authority** | Mandatory for Illinois state agencies | Voluntary federal framework |
| **Scope** | 12 sections covering approved tools, training, data, incidents | 4 functions, 19 subcategories covering full AI lifecycle |
| **Specificity** | Prescriptive (e.g., "30-day notice required") | Descriptive (e.g., "organizations should establish...") |
| **Risk framework** | Implies risk management but does not provide a structured approach | Provides the structured approach |
| **Governance** | Requires governance structure (Section 4) | Details what that structure should do (GOVERN 1-6) |
| **Metrics** | Requires continuous monitoring (Section 7) | Defines what to measure and how (MEASURE 1-3) |

The relationship is: **DoIT tells us what we must do; NIST tells us how to do it well.** Chapter 3 and Appendix B document DoIT compliance. This chapter documents the NIST AI RMF implementation that operationalizes that compliance.

A detailed crosswalk mapping each NIST subcategory to the corresponding DoIT section is provided in Section 7 of this chapter.

---

## 2. GOVERN Function

> *"Cultivate and implement a culture of risk management within organizations designing, developing, deploying, evaluating, or acquiring AI systems."* -- NIST AI 100-1, p. 15

The GOVERN function is cross-cutting -- it applies to and supports all other functions (MAP, MEASURE, MANAGE). It establishes the organizational foundation for AI risk management.

### GOVERN 1: Policies and Procedures

**What NIST says (GOVERN 1.1 - 1.7):**

Organizations should establish and maintain policies and procedures for AI risk management that are integrated into existing organizational risk management practices. Policies should address legal and regulatory requirements (GOVERN 1.1), define the scope of AI activities covered (GOVERN 1.2), establish processes for compliance monitoring (GOVERN 1.3), address documentation requirements (GOVERN 1.4), define resource allocation for risk management (GOVERN 1.5), establish mechanisms for feedback and continuous improvement (GOVERN 1.6), and address decommissioning and phase-out procedures (GOVERN 1.7).

**What DCFS does:**

| NIST Subcategory | DCFS Implementation |
|-----------------|-------------------|
| GOVERN 1.1 (Legal/regulatory) | DoIT AI Policy compliance documented in Chapter 3 and Appendix B. DCFS-specific regulatory constraints (CANTS, IL Rule 431, FERPA, HIPAA, 42 CFR Part 2, IRS Pub 1075, CCWIS Final Rule) documented in Chapter 3 guardrails table. |
| GOVERN 1.2 (Scope) | AI use is scoped exclusively to SDLC process augmentation. Approved tools: GitHub Copilot and Atlassian Rovo. No business process automation. No case decision support. Scope is documented in the AI Usage Playbook and reiterated in every role-specific playbook (Chapter 10). |
| GOVERN 1.3 (Compliance monitoring) | Per-sprint compliance spot checks verify guardrail adherence. AI Transformation Leader conducts spot checks. Results logged in the AI Transformation Monitor (tools.ussp.co). Non-compliance triggers escalation to Engagement Director. |
| GOVERN 1.4 (Documentation) | All AI risk decisions documented in this chapter. Governance team meeting minutes recorded. Incident reports filed per Section 5, MANAGE 2 procedures. |
| GOVERN 1.5 (Resources) | AI Transformation Leader allocated as dedicated resource for governance and oversight. Training budget for all 160+ consultants. Tools platform (tools.ussp.co) funded and maintained. |
| GOVERN 1.6 (Feedback) | Per-sprint retrospective includes AI effectiveness feedback. SPACE survey captures satisfaction and well-being dimensions. Feedback loops inform playbook updates (Chapter 10). |
| GOVERN 1.7 (Decommissioning) | Procedures documented for tool removal: revoke licenses, archive data, update playbooks, notify teams. Triggered by governance team decision or DoIT directive. |

**Deliverable/Evidence:** AI Usage Playbook, DoIT Compliance Map (Appendix B), per-sprint spot check logs, governance team meeting minutes.

---

### GOVERN 2: Accountability Structures

**What NIST says (GOVERN 2.1 - 2.3):**

Organizations should designate roles and responsibilities for AI risk management (GOVERN 2.1), ensure that personnel involved in AI risk management have the authority to perform their roles effectively (GOVERN 2.2), and establish clear escalation paths for AI risk decisions (GOVERN 2.3).

**What DCFS does:**

The accountability structure for AI risk management at DCFS follows a clear chain of responsibility:

| Layer | Role | Filled By | AI Risk Responsibility | Authority |
|-------|------|-----------|----------------------|-----------|
| **DCFS Governance** | CIO (Sponsor & Chair) | Jim Daugherty (DCFS/DoIT) | Executive authority for AI use at DCFS. Approves tools, guardrails, scale decisions. | Final decision authority. |
| **DCFS Governance** | Program Director | DCFS designee | Program-level oversight. Ensures AI aligns with agency priorities and CCWIS compliance. | Approves scope changes. |
| **DCFS Governance** | Security / Compliance | DoIT designee | Data classification, DoIT policy interpretation, security controls. Reviews incidents. | Advisory. Escalates to CIO. |
| **DCFS Governance** | Data Privacy Officer | DCFS designee | Child welfare data boundaries (CANTS, IL Rule 431, FERPA, HIPAA). | Can halt on PII concerns. |
| **DCFS Governance** | State Product Owner(s) | State employees | Represents the business. Ensures AI serves DCFS mission. | Business sign-off. |
| **Krasan Execution** | Engagement Director | Romi (Krasan) | Program delivery. Ensures contractual alignment. Reports to governance team. | Operational decisions within approved scope. |
| **Krasan Execution** | AI Transformation Leader | Vinay (Krasan) | Day-to-day risk management. Conducts spot checks. Designs training. Monitors metrics. **Presents to governance team.** | Recommends. Does not approve. |
| **Krasan Execution** | RTE | Matt (Krasan) | Integrates AI into SAFe cadence. Coordinates team-level execution. | Sprint-level coordination. |
| **Krasan Execution** | Scrum Masters | Per-team SMs (Krasan) | Team-level compliance. Ensures playbook adherence. Reports non-compliance. | Team-level enforcement. |

**Key principle:** DCFS governs. Krasan executes and reports. Krasan does not approve its own risk decisions.

**Escalation path:** Developer/BA/Tester → Scrum Master → AI Transformation Leader (Krasan) → Engagement Director (Krasan) → Governance Team (DCFS) → CIO.

**Deliverable/Evidence:** RACI matrix documenting AI risk roles, governance team charter, escalation procedures document.

---

### GOVERN 3: Workforce Diversity and AI Expertise

**What NIST says (GOVERN 3.1 - 3.2):**

Organizations should ensure that personnel involved in the design, development, deployment, and use of AI systems have the necessary skills and expertise (GOVERN 3.1), and that the workforce reflects diverse perspectives including those of affected communities (GOVERN 3.2).

**What DCFS does:**

| NIST Subcategory | DCFS Implementation |
|-----------------|-------------------|
| GOVERN 3.1 (Skills/expertise) | All 160+ consultants receive role-specific AI training (Chapter 7). Training tracks: Foundation (all), Developer, BA/PO, Tester, Scrum Master. Training includes responsible AI use, prompt engineering, data boundaries, and compliance requirements. AI Transformation Leader has specialized expertise in AI-assisted SDLC processes, measurement frameworks, and governance. |
| GOVERN 3.2 (Diverse perspectives) | The 12 ILC product teams span multiple roles (developers, BAs, testers, SMs, POs), multiple technical backgrounds (Dynamics 365, SACWIS, CYCIS, MARS), and multiple organizational perspectives (Krasan, DCFS, state oversight). Readiness assessment (Chapter 4) captures team perspectives before AI introduction. SPACE survey captures ongoing satisfaction and well-being. |

**Deliverable/Evidence:** Training completion records (Chapter 7), readiness assessment results (Chapter 4), SPACE survey results, team composition documentation.

---

### GOVERN 4: Organizational Culture

**What NIST says (GOVERN 4.1 - 4.2):**

Organizations should foster a culture that considers and communicates AI risks (GOVERN 4.1), and in which AI risks and impacts are regularly assessed and addressed (GOVERN 4.2).

**What DCFS does:**

The child welfare context at DCFS creates a natural foundation for a safety-first culture. Staff are already trained to treat data with extreme care and to follow strict protocols for handling sensitive information. The AI risk management culture builds on this existing foundation:

- **Safety-first framing.** AI training begins with the regulatory context (Chapter 7, Module 1): why guardrails exist, what data is at stake, what the consequences of non-compliance are. This is not an afterthought -- it is the opening message.
- **No-blame reporting.** If AI produces inappropriate output (biased content, PII-adjacent suggestions, security-relevant code), team members report it without penalty. Incident reporting is framed as a contribution to safety, not an admission of failure.
- **Visible leadership commitment.** CIO sponsorship of the governance team signals that AI risk is an executive priority, not a compliance checkbox.
- **Regular reinforcement.** Per-sprint spot checks, weekly check-ins during pilot, and governance team meetings keep AI risk visible in ongoing team practices.
- **Psychological safety for AI skeptics.** The readiness assessment (Chapter 4) explicitly captures concerns and resistance. Teams that are not ready are not forced into the pilot. The framework respects that healthy skepticism about AI in child welfare is a strength, not a weakness.

**Deliverable/Evidence:** Training materials emphasizing safety culture, incident report log, readiness assessment results capturing team concerns, governance team meeting notes demonstrating regular risk discussion.

---

### GOVERN 5: Stakeholder Engagement

**What NIST says (GOVERN 5.1 - 5.2):**

Organizations should identify relevant AI actors and stakeholders (GOVERN 5.1), and engage them in a manner commensurate with the potential impacts of the AI system (GOVERN 5.2). Stakeholders include those who design, develop, deploy, evaluate, and use AI systems, as well as those who are affected by them.

**What DCFS does:**

| Stakeholder Group | Engagement Method | Frequency |
|-------------------|-------------------|-----------|
| **DCFS CIO / Executive Leadership** | Governance team meetings, executive briefings, monthly scorecard | Bi-weekly (pilot), monthly (scale) |
| **Krasan Engagement Director** | Direct reports from AI Transformation Leader, governance team participation | Weekly |
| **Product Teams (160+ consultants)** | Training, playbooks, readiness assessment, SPACE survey, sprint retrospectives | Continuous |
| **DCFS Caseworkers (indirect)** | Not directly affected -- AI is used only for SDLC processes. No case decision support. No caseworker workflow changes. | N/A (documented as out of scope) |
| **Federal Oversight (ACF/CCWIS)** | CCWIS compliance documentation. AI augmentation does not affect CCWIS module certification. Documentation available if requested during federal reviews. | As needed |
| **DoIT** | 30-day notice for AI system assessment (Section 5f). Compliance reporting if requested. | As required by policy |
| **State Auditors / Legislative Oversight** | NIST-aligned documentation provides audit-ready evidence. Risk register maintained. Governance team minutes available. | As requested |
| **Illinois General Assembly / JCAR** | AI use documentation available if legislative inquiry occurs. Framework demonstrates responsible, measured approach. | As requested |

**Key boundary:** Caseworkers and families are explicitly out of scope as affected stakeholders because AI is used only for SDLC processes. This is a critical distinction documented in Chapter 3 and reinforced here. If the scope of AI use ever expanded to business processes or case decisions, the stakeholder engagement plan would need to be fundamentally redesigned to include affected communities, advocacy groups, and families.

**Deliverable/Evidence:** Stakeholder register, engagement plan, executive briefing materials, readiness assessment participation records.

---

### GOVERN 6: Risk Management Integration

**What NIST says (GOVERN 6.1 - 6.2):**

AI risk management should be integrated into broader organizational risk management processes (GOVERN 6.1), and the results of AI risk management activities should be incorporated into organizational decision-making (GOVERN 6.2).

**What DCFS does:**

| Integration Point | How AI Risk Integrates |
|-------------------|----------------------|
| **DCFS IT Risk Management** | AI risk register (Section 8 of this chapter) feeds into DCFS's existing IT risk management framework. AI risks are categorized and scored using the same likelihood/impact methodology. |
| **SAFe PI Planning** | AI risk assessment is a standing input to PI planning. Governance team reviews risk register before each PI and identifies any risks that affect PI objectives. |
| **Sprint Ceremonies** | Per-sprint spot checks integrate AI compliance into existing sprint review/retrospective cadence. No additional ceremonies added. |
| **ILC Program Governance** | AI risk status is reported as a standing item in ILC program governance meetings. Engagement Director ensures visibility. |
| **DoIT Compliance** | NIST AI RMF governance activities produce evidence that satisfies DoIT AI Policy requirements, reducing compliance burden through integrated processes. |
| **Contractual Risk** | AI risk management activities are documented to satisfy contractual requirements between Krasan and DCFS/DoIT. Any AI-related contractual risks are tracked in the risk register. |

**Deliverable/Evidence:** Risk register (Section 8), PI planning inputs, sprint retrospective notes referencing AI compliance, program governance meeting minutes.

---

## 3. MAP Function

> *"Establish the context to frame the risks related to an AI system."* -- NIST AI 100-1, p. 20

The MAP function ensures that AI risks are understood in the context of the specific system, its intended use, and the environment in which it operates. For DCFS, this means precisely characterizing what Copilot and Rovo do, what they do not do, and where the boundaries are.

### MAP 1: Intended Purpose and Scope

**What NIST says (MAP 1.1 - 1.6):**

Organizations should document the intended purpose of each AI system (MAP 1.1), the intended and actual users (MAP 1.2), the deployment context (MAP 1.3), the legal and regulatory requirements applicable to the system (MAP 1.4), the potential benefits of the system (MAP 1.5), and the system's interdependencies with other systems (MAP 1.6).

**What DCFS does:**

#### GitHub Copilot

| MAP Subcategory | Documentation |
|----------------|---------------|
| MAP 1.1 (Purpose) | AI-assisted code completion and suggestion for Dynamics 365 development on the ILC program. Copilot provides inline code suggestions based on context (current file, open files, comments). Developers review, edit, accept, or reject every suggestion. No autonomous code generation. |
| MAP 1.2 (Users) | Developers on the 12 ILC product teams (~60-70 developers). Users are Krasan consultants with varying experience levels. All users receive role-specific training before access. |
| MAP 1.3 (Context) | Used in developer IDEs (Visual Studio, VS Code) during the coding phase of the SDLC. Connected to private GitHub repositories containing ILC source code. Does not access DCFS production databases, case management systems, or sensitive data stores. |
| MAP 1.4 (Legal/regulatory) | DoIT AI Policy (all 12 sections), DCFS-specific guardrails (Chapter 3), CCWIS Final Rule (software quality requirements), relevant data protection laws (HIPAA, FERPA, 42 CFR Part 2, IRS Pub 1075) as they apply to data that might appear in source code or comments. |
| MAP 1.5 (Benefits) | Faster code completion, reduced boilerplate, improved consistency across team conventions, reduced context-switching. Measured via DORA metrics, SPACE survey, and composite productivity score (Chapter 9). |
| MAP 1.6 (Interdependencies) | Depends on GitHub infrastructure. Integrates with IDEs. Source code is the input/output -- no integration with DCFS case management, CANTS, or production data systems. |

#### Atlassian Rovo

| MAP Subcategory | Documentation |
|----------------|---------------|
| MAP 1.1 (Purpose) | AI-assisted search, summarization, and content generation within the Atlassian suite (JIRA, Confluence). Used for story refinement, acceptance criteria generation, test case suggestions, and documentation assistance. All output reviewed and edited by human users. |
| MAP 1.2 (Users) | BAs, POs, Testers, and Scrum Masters on the 12 ILC product teams. All users receive role-specific training before access. |
| MAP 1.3 (Context) | Used within the Atlassian Cloud environment on ILC JIRA and Confluence instances. Operates on user stories, epics, test plans, and project documentation. Does not access production databases or case management data. |
| MAP 1.4 (Legal/regulatory) | Same as Copilot: DoIT AI Policy, DCFS guardrails, CCWIS Final Rule. Additional consideration: JIRA stories and Confluence pages must not contain PII, case data, or security documentation. Training reinforces this boundary. |
| MAP 1.5 (Benefits) | Faster story writing, more consistent acceptance criteria, improved search across project documentation, reduced documentation overhead. Measured via story quality score (QUS framework), cycle time, and SPACE survey. |
| MAP 1.6 (Interdependencies) | Depends on Atlassian Cloud infrastructure. Operates on JIRA/Confluence data. No integration with DCFS production systems. |

#### Explicit Scope Boundaries

The following are explicitly **out of scope** for AI use on the ILC program. These boundaries are non-negotiable and are documented in the AI Usage Playbook, all training materials, and every role-specific playbook:

| Out of Scope | Rationale |
|-------------|-----------|
| Case decision support | AI must never influence child welfare determinations. |
| Caseworker-facing tools | AI is for the delivery team, not the end users of the system being built. |
| Business process automation | AI augments SDLC processes only. |
| Autonomous code deployment | All AI-generated code is reviewed, tested, and deployed by humans through standard CI/CD. |
| Access to production data | AI tools do not connect to DCFS production databases or data stores. |
| PII processing | No child names, case numbers, social security numbers, or other PII in AI prompts. |
| Security documentation | Security plans, penetration test results, and vulnerability reports excluded from AI contexts. |

**Deliverable/Evidence:** AI system characterization document (this section), scope boundary documentation in AI Usage Playbook, training materials.

---

### MAP 2: Risk Classification

**What NIST says (MAP 2.1 - 2.3):**

Organizations should categorize and prioritize AI risks based on their potential impact (MAP 2.1), assess the likelihood of risks materializing (MAP 2.2), and characterize the level of risk in the context of organizational risk tolerance (MAP 2.3).

**What DCFS does:**

#### Risk Level Assessment

| Risk Dimension | Assessment | Rationale |
|---------------|------------|-----------|
| **Overall risk level** | Low-Medium | AI is used for SDLC augmentation only. No case decisions, no PII processing, no autonomous operation. |
| **Data sensitivity risk** | Low (with guardrails) | AI tools operate on source code and project documentation, not case data. Guardrails prevent PII entry. Risk exists only if guardrails fail. |
| **Safety risk** | Negligible | AI suggestions are reviewed by humans before use. No safety-critical autonomous decisions. No direct impact on child welfare outcomes. |
| **Bias/discrimination risk** | Low | AI generates code and documentation, not decisions affecting individuals. Per-sprint bias spot checks provide additional assurance. |
| **Operational risk** | Low-Medium | Risk of tool disruption (license issues, outages) could slow teams. Risk of poor AI suggestions could introduce defects if review is inadequate. |
| **Reputational risk** | Medium | Public perception of "AI at child welfare agency" requires careful communication. Even SDLC-only use could be misconstrued. Clear messaging is essential. |
| **Compliance risk** | Medium | DoIT AI Policy compliance is mandatory. Non-compliance could trigger policy enforcement actions, audit findings, or legislative scrutiny. |

#### Why Low-Medium, Not High

The risk classification is low-medium because the engagement satisfies all of the following conditions:

1. **Human-in-the-loop.** Every AI output is reviewed by a qualified human before use (NIST AI 100-1, Appendix B: "human-in-the-loop" control).
2. **No autonomous operation.** AI suggests; humans decide. No AI system operates independently.
3. **No safety-critical application.** AI does not affect child welfare case decisions, resource allocation, or service delivery.
4. **No PII processing.** Guardrails prevent sensitive data from entering AI systems.
5. **Limited blast radius.** If AI produces poor output, the impact is a suboptimal code suggestion or story draft that a human reviewer catches. The worst case is a defect that enters the codebase and is caught in testing or code review.

If any of these conditions changed -- particularly conditions 3 or 4 -- the risk classification would need to be elevated and the governance approach strengthened accordingly.

**Deliverable/Evidence:** Risk classification document (this section), governance team approval of risk level, annual risk reassessment.

---

### MAP 3: Benefits and Costs

**What NIST says (MAP 3.1 - 3.3):**

Organizations should articulate the expected benefits of the AI system (MAP 3.1), the costs of deploying and maintaining the system including risk management costs (MAP 3.2), and the tradeoffs between benefits, costs, and risks (MAP 3.3).

**What DCFS does:**

| Category | Detail |
|----------|--------|
| **Expected benefits** | 5-15% improvement in targeted SDLC process efficiency (conservative estimate based on industry research -- see Appendix C). Specific targets: faster story writing (BA), faster code completion (Developer), faster test case generation (Tester), improved documentation consistency. |
| **Direct costs** | GitHub Copilot licenses (per-developer, per-month). Atlassian Rovo licenses (pending confirmation). AI Transformation Leader allocation. Training development and delivery time. |
| **Risk management costs** | Governance team meeting time. Per-sprint spot checks (~1 hour per sprint per team). Tools platform development and maintenance (tools.ussp.co). Documentation and reporting effort. |
| **Opportunity costs** | Training time temporarily reduces delivery capacity (~4-8 hours per consultant during training phase). Sprint velocity may dip during initial adoption as teams learn new workflows. |
| **Tradeoff assessment** | Benefits are expected to outweigh costs within one PI (5 sprints) of pilot adoption. The pilot-then-scale approach (Chapter 1) limits downside risk: if benefits do not materialize, only 2 teams are affected, and the program can be adjusted or halted without ART-wide impact. |

**Deliverable/Evidence:** Benefits-cost analysis, pilot results report (Chapter 9), governance team review of cost-benefit at pilot midpoint and endpoint.

---

### MAP 4: System Limitations

**What NIST says (MAP 4.1 - 4.2):**

Organizations should document known limitations of the AI system (MAP 4.1) and communicate those limitations to relevant stakeholders (MAP 4.2).

**What DCFS does:**

| Limitation | Description | Communication Method |
|-----------|-------------|---------------------|
| **Copilot does not understand business context** | Copilot suggests code based on patterns, not understanding of child welfare business rules. It cannot validate whether code correctly implements DCFS policy. | Training Module 2: "AI suggests syntax, not semantics. You own the business logic." |
| **Copilot may suggest insecure code** | AI-generated code may contain security vulnerabilities that are syntactically correct but fail security review. | Training Module 3: "All AI-generated code goes through the same code review and security scan as human-written code." |
| **Rovo works with available data** | Rovo's search and summarization quality depends on what is in JIRA/Confluence. If stories are poorly written or documentation is sparse, Rovo's output reflects that. | Training Module 4: "AI quality in = AI quality out. Invest in your input." |
| **AI tools hallucinate** | Both Copilot and Rovo can generate plausible-sounding but incorrect output. This is a fundamental limitation of current AI technology, not a bug. | Training Module 1: "AI is a confident guesser. Always verify." |
| **No Dynamics 365-specific training** | Copilot's training data may not include the latest Dynamics 365 APIs, custom ILC patterns, or DCFS-specific conventions. Suggestions may be generically correct but contextually wrong. | Training Module 2: role-specific guidance on evaluating suggestions against ILC standards. |
| **License and availability uncertainty** | Copilot and Rovo licenses are pending confirmation. Tool access may be delayed or limited. | Governance team tracks tool access as a risk (see Risk Register, Section 8). |

**Deliverable/Evidence:** System limitations documentation (this section), training materials communicating limitations, playbook sections on AI output verification.

---

## 4. MEASURE Function

> *"Employ quantitative, qualitative, or mixed-method tools, techniques, and methodologies to analyze, assess, benchmark, and monitor AI risk and related impacts."* -- NIST AI 100-1, p. 25

The MEASURE function ensures that AI risks are not just identified but actively tracked with evidence. For DCFS, this means building measurement into the existing SAFe cadence so that risk assessment is continuous, not a one-time exercise.

### MEASURE 1: Metrics for Trustworthiness

**What NIST says (MEASURE 1.1 - 1.3):**

Organizations should identify and implement metrics, methods, and tools for assessing AI system trustworthiness (MEASURE 1.1). Measurement approaches should be calibrated and validated (MEASURE 1.2). Measurement results should be documented and communicated (MEASURE 1.3).

**What DCFS does:**

NIST AI 100-1 identifies seven characteristics of trustworthy AI: valid and reliable, safe, secure and resilient, accountable and transparent, explainable and interpretable, privacy-enhanced, and fair with harmful bias managed. For SDLC augmentation tools, these characteristics map to specific, measurable indicators:

| Trustworthiness Characteristic | Metric | Measurement Method | Target |
|-------------------------------|--------|-------------------|--------|
| **Valid and reliable** | AI suggestion acceptance rate | IDE telemetry (Copilot), JIRA workflow (Rovo) | Tracked, not targeted -- understanding usage patterns |
| **Valid and reliable** | Defect density in AI-assisted code | JIRA defect tracking, sprint-over-sprint comparison | No increase vs baseline |
| **Safe** | PII exposure incidents | Per-sprint spot check, incident reports | Zero |
| **Secure and resilient** | Security vulnerabilities in AI-assisted code | Code review, static analysis, penetration testing | No increase vs baseline |
| **Accountable and transparent** | Guardrail compliance rate | Per-sprint spot check (5 stories/tests per team) | 100% compliance |
| **Explainable and interpretable** | Developer ability to explain AI-generated code | Spot check interview: "Why did you accept this suggestion?" | Developer can articulate rationale |
| **Privacy-enhanced** | Data boundary adherence | Prompt review, no PII in AI context | 100% adherence |
| **Fair (bias managed)** | Biased or inappropriate AI output | Per-sprint spot check for biased language, discriminatory patterns | Zero instances |

**Deliverable/Evidence:** Measurement plan (Chapter 9), per-sprint spot check results, DORA metrics dashboard (tools.ussp.co), SPACE survey results.

---

### MEASURE 2: AI System Testing

**What NIST says (MEASURE 2.1 - 2.3):**

AI systems should be tested for trustworthiness characteristics (MEASURE 2.1). Testing should include evaluation of potential biases (MEASURE 2.2). Testing approaches should be documented and standardized (MEASURE 2.3).

**What DCFS does:**

| Testing Activity | What Is Tested | Method | Frequency |
|-----------------|---------------|--------|-----------|
| **Prompt quality review** | Are team members writing effective, boundary-respecting prompts? | AI Transformation Leader reviews a sample of prompts used in each sprint (5 per team). Checks for PII, security content, appropriate scope. | Per sprint |
| **Output validation** | Is AI-generated output being properly reviewed before use? | Spot check: examine 5 AI-assisted stories/code changes per team per sprint. Verify human review occurred. | Per sprint |
| **Bias detection** | Does AI output contain biased language, discriminatory patterns, or culturally inappropriate content? | Manual review of AI-assisted user stories and documentation for language that could reflect or perpetuate bias. Particular attention to child welfare terminology. | Per sprint |
| **Code quality comparison** | Does AI-assisted code maintain quality standards? | Compare defect density, code review pass rate, and security scan results between AI-assisted and non-AI-assisted code. | Per sprint (during pilot) |
| **Story quality scoring** | Does AI-assisted story writing maintain or improve quality? | QUS framework: score 5 AI-assisted stories per team against the 13 QUS criteria. Compare to baseline. | Per sprint (during pilot) |

**Deliverable/Evidence:** Testing protocol document, per-sprint test results, bias review findings, quality comparison report.

---

### MEASURE 3: Continuous Monitoring

**What NIST says (MEASURE 3.1 - 3.2):**

Organizations should implement continuous monitoring of AI systems (MEASURE 3.1) and ensure that monitoring results inform risk management decisions (MEASURE 3.2).

**What DCFS does:**

| Monitoring Activity | Cadence | Owner | Output |
|--------------------|---------|-------|--------|
| **Per-sprint spot checks** | Every sprint (2-week cycles) | AI Transformation Leader | Spot check report: compliance rate, quality metrics, incidents |
| **Weekly check-ins (pilot)** | Weekly during pilot phase | AI Transformation Leader + pilot team SMs | Status update: adoption metrics, challenges, guardrail adherence |
| **SPACE survey** | Pre-pilot, mid-pilot, post-pilot | AI Transformation Leader | Survey results: satisfaction, perceived productivity, communication |
| **DORA metrics collection** | Continuous (automated from JIRA/GitHub) | Tools platform (tools.ussp.co) | Dashboard: deployment frequency, lead time, change failure rate, MTTR |
| **Governance team review** | Bi-weekly (pilot), monthly (scale) | Governance team | Risk register update, policy review, scale/halt decisions |
| **Executive scorecard** | Monthly | AI Transformation Leader | One-page summary: key metrics, risks, recommendations |

**Feedback loop:** Monitoring results feed directly into governance team decisions. If monitoring reveals a risk increasing (e.g., defect density rising, compliance rate dropping), the governance team can adjust scope, add training, strengthen guardrails, or halt the pilot.

**Deliverable/Evidence:** Monitoring dashboard (tools.ussp.co), per-sprint reports, SPACE survey results, executive scorecards, governance team meeting minutes documenting decisions based on monitoring data.

---

## 5. MANAGE Function

> *"Allocate risk resources to mapped and measured AI risks on a regular basis."* -- NIST AI 100-1, p. 29

The MANAGE function is where identified, assessed, and measured risks get addressed with concrete actions. For DCFS, this means clear guardrails, incident procedures, change processes, and documentation practices.

### MANAGE 1: Risk Treatment

**What NIST says (MANAGE 1.1 - 1.4):**

Organizations should develop and implement risk treatment plans (MANAGE 1.1), including risk avoidance, mitigation, transfer, and acceptance strategies (MANAGE 1.2). Risk treatment should be prioritized based on assessed risk levels (MANAGE 1.3). The effectiveness of risk treatment should be monitored (MANAGE 1.4).

**What DCFS does:**

| Risk | Treatment Strategy | Specific Controls |
|------|--------------------|------------------|
| **PII exposure** | Avoidance | No PII in AI prompts (training, playbooks, spot checks). No AI access to production databases. If PII is discovered in an AI prompt, immediate incident report and remediation. |
| **Poor AI output quality** | Mitigation | Mandatory human review of all AI output. Code review for AI-assisted code. QUS scoring for AI-assisted stories. Defect tracking compares AI-assisted vs baseline. |
| **Non-compliance with DoIT policy** | Avoidance + Mitigation | Compliance map (Appendix B) addresses all 12 sections. Per-sprint compliance spot checks. Governance team monitors compliance status. |
| **Tool access disruption** | Acceptance + Contingency | Risk accepted: tool availability depends on state procurement. Contingency: teams revert to non-AI workflows. No critical path dependency on AI tools. |
| **Staff resistance** | Mitigation | Readiness assessment identifies resistant teams. Training addresses concerns. Pilot-then-scale approach lets results speak. No mandatory adoption for non-pilot teams. |
| **Reputational risk** | Mitigation | Clear messaging: "AI for SDLC only, not case decisions." Documentation available for inquiries. Governance team reviews communications. |
| **Scope creep** | Avoidance | Scope boundaries documented and enforced. Any scope expansion requires governance team approval and CIO sign-off. |

**Human-in-the-loop as primary control:** The single most important risk treatment is the mandatory human review of all AI output. This control addresses multiple risks simultaneously: poor quality, bias, PII exposure, and non-compliance. It is non-negotiable and is reinforced through training, playbooks, spot checks, and governance team oversight.

**Deliverable/Evidence:** Risk treatment plans (Risk Register, Section 8), per-sprint monitoring of control effectiveness, governance team review of treatment adequacy.

---

### MANAGE 2: AI Incidents

**What NIST says (MANAGE 2.1 - 2.4):**

Organizations should define what constitutes an AI incident (MANAGE 2.1), establish incident reporting mechanisms (MANAGE 2.2), implement incident response procedures (MANAGE 2.3), and conduct post-incident analysis and lessons learned (MANAGE 2.4).

**What DCFS does:**

#### Incident Definition

An AI incident at DCFS is any event where an AI tool produces output that:

| Severity | Definition | Examples |
|----------|-----------|----------|
| **Critical** | AI output contains or exposes PII, case data, or security-sensitive information | Child name appears in a Copilot suggestion; case number appears in an AI-generated story |
| **High** | AI output is used in production without required human review | AI-generated code merged without code review; AI story accepted without BA/PO review |
| **Medium** | AI output contains biased, discriminatory, or inappropriate content | Biased language in AI-generated documentation; culturally insensitive terminology |
| **Low** | AI output is factually incorrect or technically wrong, caught during review | Copilot suggests deprecated API; Rovo generates inaccurate summary |

#### Reporting Process

```
1. Team member identifies potential incident
2. Team member reports to Scrum Master immediately
3. Scrum Master notifies AI Transformation Leader within 1 business day
4. AI Transformation Leader classifies severity
5. For Critical/High: immediate escalation to Engagement Director + CIO
6. For Medium: governance team review at next meeting
7. For Low: logged for tracking, reviewed in aggregate
```

#### Response Procedures

| Severity | Response | Timeline |
|----------|----------|----------|
| **Critical** | Immediate: contain exposure, revoke access if needed, notify DCFS security. Investigate root cause. File DoIT incident report per Section 6 of AI Policy. | Containment: same day. Investigation: 48 hours. Report: 5 business days. |
| **High** | Investigate how human review was bypassed. Retrain affected team. Add controls to prevent recurrence. | Investigation: 3 business days. Corrective action: next sprint. |
| **Medium** | Document the incident. Review and update training materials if pattern emerges. Share anonymized example in next training session. | Documentation: 3 business days. Training update: next cycle. |
| **Low** | Log in incident tracker. Review in aggregate at governance team meetings. No individual response unless pattern emerges. | Logged within sprint. Aggregate review: monthly. |

#### Post-Incident Analysis

Every Critical and High incident receives a post-incident analysis (blameless post-mortem) that addresses:
- What happened (factual description)
- Why it happened (root cause analysis)
- What was the impact
- What controls failed
- What corrective actions are needed
- How to prevent recurrence

Post-incident analyses are reviewed by the governance team and inform updates to training, playbooks, and guardrails.

**Deliverable/Evidence:** Incident classification guide, incident report template, incident log, post-incident analysis reports, governance team review of incidents.

---

### MANAGE 3: Change Management

**What NIST says (MANAGE 3.1 - 3.2):**

Organizations should establish processes for managing changes to AI systems (MANAGE 3.1), including adding new AI capabilities, modifying existing ones, and retiring AI systems (MANAGE 3.2).

**What DCFS does:**

| Change Type | Approval Process | Timeline |
|-------------|-----------------|----------|
| **Add new AI tool** | Governance team review -> CIO approval -> DoIT 30-day notice (Section 5f) -> Training development -> Pilot | Minimum 60 days (30-day notice + 30 days preparation) |
| **Expand AI scope** (new process or role) | Governance team review -> CIO approval -> Risk reassessment -> Training update -> Pilot with new scope | Minimum 30 days |
| **Adjust guardrails** (strengthen or relax) | AI Transformation Leader proposal -> Governance team review -> CIO approval for any relaxation | 2-4 weeks |
| **Remove AI tool** | Governance team decision or CIO directive -> License revocation -> Playbook update -> Team notification | Immediate for emergency; 2 weeks for planned |
| **Expand to new teams** (scale) | Pilot results review -> Governance team recommendation -> CIO approval -> Training -> Rollout | Per scale plan (Chapter 11) |

**Key principle:** No changes to AI tool scope, selection, or guardrails without governance team review. Any change that relaxes controls requires CIO approval.

**DoIT notification:** Per Section 5f of the DoIT AI Policy, any new AI system or significant change to an existing AI system requires a 30-day advance notice to DoIT. The governance team is responsible for determining whether a change triggers this requirement.

**Deliverable/Evidence:** Change request log, governance team meeting minutes documenting change approvals, DoIT notification records.

---

### MANAGE 4: Documentation and Auditability

**What NIST says (MANAGE 4.1 - 4.2):**

Organizations should maintain documentation of AI risk management activities (MANAGE 4.1) and ensure that documentation supports external accountability and auditability (MANAGE 4.2).

**What DCFS does:**

| Document | Content | Owner | Location | Retention |
|----------|---------|-------|----------|-----------|
| **AI RMF Governance Document** | This chapter -- NIST AI RMF mapped to DCFS | AI Transformation Leader | Guide (this file) | Duration of engagement + 3 years |
| **Risk Register** | All identified risks with classification, mitigation, status | AI Transformation Leader | Section 8 of this chapter + tools.ussp.co | Duration of engagement + 3 years |
| **Governance Team Minutes** | Meeting notes, decisions, action items | AI Transformation Leader | Shared document repository | Duration of engagement + 3 years |
| **Incident Reports** | All AI incidents classified and resolved | AI Transformation Leader | Incident tracking system | Duration of engagement + 5 years |
| **Per-Sprint Spot Check Reports** | Compliance verification, quality metrics | AI Transformation Leader | tools.ussp.co | Duration of engagement + 3 years |
| **Training Records** | Completion records for all AI training | AI Transformation Leader | tools.ussp.co | Duration of engagement + 3 years |
| **DoIT Compliance Map** | Section-by-section DoIT AI Policy compliance | AI Transformation Leader | Appendix B | Duration of engagement + 3 years |
| **Change Request Log** | All changes to AI scope, tools, guardrails | Governance Team | Shared document repository | Duration of engagement + 3 years |
| **Executive Scorecards** | Monthly summary for CIO | AI Transformation Leader | Shared document repository | Duration of engagement + 3 years |
| **SPACE Survey Results** | Developer productivity and satisfaction data | AI Transformation Leader | tools.ussp.co | Duration of engagement + 3 years |

**Audit readiness:** All documentation is maintained in formats accessible to state auditors. The NIST AI RMF structure provides auditors with a recognized framework to evaluate against. If auditors ask "How do you manage AI risk?", the answer is: "We follow NIST AI RMF 1.0. Here is our governance document, risk register, incident log, and monitoring data."

**Deliverable/Evidence:** Document inventory (this table), document retention schedule, audit-ready documentation package.

---

## 6. Governance Team Structure

CIO Jim Daugherty has expressed the need for a governance team to establish risks and constraints for AI use on the ILC program. The following structure is proposed, aligned with NIST AI RMF GOVERN 2 (accountability structures) and DoIT AI Policy Section 4 (AI governance structure).

### Composition

| Role | Filled By | Responsibility on Governance Team |
|------|-----------|----------------------------------|
| **Sponsor / Chair** | Jim Daugherty, CIO (DCFS/DoIT) | Executive authority. Chairs governance. Approves tool additions, scale decisions, and guardrail changes. |
| **Member** | DCFS Program Director or Deputy CIO | Represents DCFS program management. Ensures AI governance aligns with agency priorities. |
| **Member** | DoIT Security / Compliance Rep | Represents security, privacy, and regulatory compliance. Advises on data classification, DoIT policy interpretation. |
| **Member** | DCFS Data Privacy Officer | Child welfare data boundaries (CANTS, IL Rule 431, FERPA, HIPAA). Ensures no PII exposure. |
| **Member** | State Product Owner(s) | Represents the business. Ensures AI augmentation serves DCFS mission, not just delivery efficiency. |
| **Invited** | Krasan AI Transformation Leader (Vinay) | Presents risk register, monitoring data, pilot results, and recommendations. **Reports to the governance team — does not sit on it.** |
| **Invited** | Krasan Engagement Director (Romi) | Presents program status, contractual alignment, resource commitments. |

### Meeting Cadence

| Phase | Frequency | Duration | Focus |
|-------|-----------|----------|-------|
| **Pre-pilot** (Govern phase) | Weekly | 60 min | Establish charter, risk register, guardrails, tool access, training plan |
| **Pilot** (2 teams, 1 PI) | Bi-weekly | 60 min | Monitor pilot metrics, review incidents, adjust guardrails, assess readiness for scale |
| **Scale** (all 12 teams) | Monthly | 60 min | Review ART-wide metrics, address emerging risks, approve scope changes, report to CIO |
| **Steady state** | Monthly | 45 min | Ongoing risk monitoring, policy updates, annual risk reassessment |

### Responsibilities

The governance team is responsible for:

1. **Risk identification and assessment.** Maintain the risk register (Section 8). Identify new risks. Reassess existing risks based on monitoring data.
2. **Policy and guardrail oversight.** Review and approve the AI Usage Playbook. Approve changes to guardrails. Ensure ongoing compliance with DoIT AI Policy.
3. **Tool approval.** Review and recommend approval for any new AI tools. Assess tool-specific risks. Coordinate DoIT 30-day notice requirements.
4. **Incident review.** Review all Critical and High severity incidents. Approve corrective actions. Track resolution.
5. **Scale decisions.** Review pilot results. Recommend whether to scale, adjust, or halt. Present recommendation to CIO for approval.
6. **Monitoring oversight.** Review per-sprint spot check results, DORA metrics, SPACE survey results, and quality comparisons. Identify trends requiring action.
7. **Stakeholder communication.** Prepare executive scorecards. Draft communications for broader stakeholder audiences as needed.
8. **Annual risk reassessment.** Conduct a full NIST AI RMF reassessment annually (or when significant changes occur) to ensure governance remains proportional to actual risk.

### Decision Rights

| Decision | Who Decides | CIO Approval Required? |
|----------|-------------|----------------------|
| Approve initial AI Usage Playbook | Governance team | Yes |
| Approve training curriculum | Governance team | No (inform only) |
| Approve pilot team selection | Governance team | Yes |
| Modify guardrails (strengthen) | Governance team | No (inform only) |
| Modify guardrails (relax) | Governance team recommendation | Yes |
| Add new AI tool | Governance team recommendation | Yes + DoIT 30-day notice |
| Remove AI tool (planned) | Governance team | No (inform CIO) |
| Remove AI tool (emergency) | AI Transformation Leader (immediate) | Inform CIO within 24 hours |
| Scale to additional teams | Governance team recommendation | Yes |
| Halt pilot | Governance team or CIO | N/A (either can halt) |
| Approve incident response (Critical) | Governance team + CIO | Yes |
| Approve incident response (High) | Governance team | No (inform CIO) |
| Approve scope expansion to business processes | Not within governance team authority | Yes + full risk reassessment |

### Charter Template

The governance team should adopt a formal charter at its first meeting. The charter should include:

- Team name, sponsor, chair, members
- Purpose and scope
- Meeting cadence and logistics
- Decision-making process (consensus with chair tiebreak; CIO override for escalated items)
- Quorum requirements (chair + 2 members)
- Documentation requirements (minutes for all meetings, distributed within 2 business days)
- Review cadence (charter reviewed annually)

**Deliverable/Evidence:** Governance team charter (signed by sponsor), meeting minutes, decision log.

---

## 7. NIST AI RMF + DoIT AI Policy Crosswalk

The following table maps each NIST AI RMF function and subcategory to the corresponding DoIT AI Policy section. This crosswalk demonstrates how the two frameworks complement each other: NIST provides the structured risk management methodology; DoIT provides the state-specific mandatory requirements.

| NIST Function | NIST Subcategory | NIST Requirement Summary | DoIT Section | DoIT Requirement Summary | How They Complement |
|---------------|-----------------|-------------------------|-------------|-------------------------|-------------------|
| GOVERN | GOVERN 1.1 | Legal/regulatory compliance | Section 1 (Purpose & Scope) | Policy applies to all state AI use | NIST requires identifying applicable laws; DoIT is the specific law to comply with |
| GOVERN | GOVERN 1.2 | Define scope of AI activities | Section 2 (Definitions) | Classify AI system type | NIST frames scope broadly; DoIT provides specific classification (AI-assisted vs autonomous) |
| GOVERN | GOVERN 1.3 | Compliance monitoring | Section 7 (Continuous Monitoring) | Ongoing AI oversight | NIST provides monitoring framework; DoIT mandates that monitoring must occur |
| GOVERN | GOVERN 1.4 | Documentation requirements | Section 5f (Assessment & Notice) | Document AI system assessment | NIST specifies what to document; DoIT requires submission to DoIT |
| GOVERN | GOVERN 2.1 | Roles and responsibilities | Section 4 (Governance Structure) | Agency-level oversight | NIST details role design; DoIT mandates governance exists |
| GOVERN | GOVERN 2.2 | Authority for risk management | Section 4c (Governance body) | Designated responsible official | NIST ensures authority matches responsibility; DoIT requires a designee |
| GOVERN | GOVERN 2.3 | Escalation paths | Section 6 (Incident Response) | Incident handling | NIST provides escalation framework; DoIT requires incident response capability |
| GOVERN | GOVERN 3.1 | AI expertise and training | Section 5b (Training Requirements) | Staff must be trained | NIST frames training as risk management; DoIT mandates training |
| GOVERN | GOVERN 4.1 | Risk-aware culture | Section 3 (Responsible AI Principles) | Transparency, fairness, accountability | NIST builds culture; DoIT provides the principles to embed |
| GOVERN | GOVERN 5.1 | Stakeholder identification | Section 4a (Non-discrimination) | Consider affected populations | NIST requires broad stakeholder mapping; DoIT focuses on affected individuals |
| GOVERN | GOVERN 6.1 | Risk management integration | Section 4e (Risk assessment) | Risk assessment processes | NIST provides integration methodology; DoIT requires risk assessment |
| MAP | MAP 1.1 | Document intended purpose | Section 5a (Approved Tools) | Maintain tool inventory | NIST documents purpose; DoIT requires tool approval |
| MAP | MAP 1.4 | Legal/regulatory requirements | Section 1 (Purpose & Scope) | Policy jurisdiction | NIST maps all requirements; DoIT is one requirement in the map |
| MAP | MAP 2.1 | Risk categorization | Section 4e (Risk assessment) | Risk assessment | NIST provides categorization methodology; DoIT requires assessment |
| MAP | MAP 4.1 | Document limitations | Section 5d (AI Output Review) | Human review required | NIST documents why limitations exist; DoIT mandates the control (human review) |
| MEASURE | MEASURE 1.1 | Trustworthiness metrics | Section 7 (Continuous Monitoring) | Ongoing oversight | NIST defines what to measure; DoIT requires that measurement occurs |
| MEASURE | MEASURE 2.2 | Bias evaluation | Section 3 (Responsible AI Principles), Section 4a (Non-discrimination) | Fairness requirements | NIST provides testing methodology; DoIT mandates fairness |
| MEASURE | MEASURE 3.1 | Continuous monitoring | Section 7 (Continuous Monitoring) | Ongoing AI oversight | Direct alignment -- both require continuous monitoring |
| MANAGE | MANAGE 1.1 | Risk treatment plans | Section 5c (Data Classification) | Data handling rules | NIST provides treatment framework; DoIT specifies data-specific controls |
| MANAGE | MANAGE 2.1 | Incident definition | Section 6 (Incident Response) | AI incident handling | NIST defines categorization; DoIT mandates response capability |
| MANAGE | MANAGE 3.1 | Change management | Section 5f (Assessment & Notice) | 30-day notice for new AI systems | NIST provides change framework; DoIT specifies the 30-day requirement |
| MANAGE | MANAGE 4.1 | Documentation | Section 5e (State Data for AI) | Written consent requirements | NIST requires documentation broadly; DoIT specifies what consent must be documented |

**Key insight:** There is no conflict between the two frameworks. Every DoIT requirement maps to at least one NIST subcategory. Organizations that implement NIST AI RMF will exceed DoIT requirements. Conversely, DoIT provides the specific, enforceable requirements that make NIST's voluntary guidance actionable in the Illinois state government context.

---

## 8. Risk Register (NIST-Aligned)

The following risk register is pre-populated with known risks identified during the Govern phase. Each risk is classified using the NIST AI RMF categories and scored using a standard likelihood/impact matrix.

### Scoring Key

**Likelihood:** 1 = Rare, 2 = Unlikely, 3 = Possible, 4 = Likely, 5 = Almost Certain

**Impact:** 1 = Negligible, 2 = Minor, 3 = Moderate, 4 = Major, 5 = Critical

**Risk Score:** Likelihood x Impact (1-25). Low: 1-6, Medium: 7-12, High: 13-19, Critical: 20-25.

### Risk Register

#### R-001: Tool Access Uncertainty (Copilot Licenses)

| Field | Detail |
|-------|--------|
| **Risk ID** | R-001 |
| **Description** | GitHub Copilot licenses for ILC developers have not been confirmed. The State's procurement process may delay or prevent access. Without Copilot, the developer-focused AI augmentation cannot proceed as planned. |
| **NIST Category** | MAP 1.6 (Interdependencies), MANAGE 3.1 (Change management) |
| **Likelihood** | 3 (Possible) |
| **Impact** | 4 (Major) |
| **Risk Score** | 12 (Medium) |
| **Mitigation** | (1) Confirm license status with CIO and procurement early. (2) Identify alternative developer-focused processes that can use Rovo if Copilot is unavailable. (3) Design pilot to be viable with Rovo-only if necessary. (4) Track procurement timeline and adjust pilot schedule accordingly. |
| **Owner** | Engagement Director |
| **Status** | Open -- pending procurement confirmation |

---

#### R-002: PII Exposure Risk (Child Welfare Data)

| Field | Detail |
|-------|--------|
| **Risk ID** | R-002 |
| **Description** | Despite guardrails, a team member could inadvertently include PII (child names, case numbers, SSNs, addresses) in an AI prompt. In the child welfare context, this could involve CANTS data, substance abuse records (42 CFR Part 2), educational records (FERPA), or health information (HIPAA). |
| **NIST Category** | MAP 2.1 (Risk categorization), MANAGE 1.1 (Risk treatment), MANAGE 2.1 (Incident definition) |
| **Likelihood** | 2 (Unlikely -- guardrails, training, spot checks reduce likelihood) |
| **Impact** | 5 (Critical -- child welfare PII exposure has legal, regulatory, and reputational consequences) |
| **Risk Score** | 10 (Medium) |
| **Mitigation** | (1) Training Module 1 covers data boundaries and the "no PII" rule. (2) AI Usage Playbook provides explicit examples of what constitutes PII. (3) Per-sprint spot checks review prompts for PII. (4) Copilot operates on source code in private repos -- code should not contain PII, but comments and test data could. (5) JIRA/Confluence content policies reinforced. (6) Incident response procedure (MANAGE 2) covers immediate containment. |
| **Owner** | AI Transformation Leader |
| **Status** | Open -- mitigated by training and spot checks |

---

#### R-003: Configuration-First Platform (Limited Code-Centric AI Application)

| Field | Detail |
|-------|--------|
| **Risk ID** | R-003 |
| **Description** | Dynamics 365 is a configuration-first platform. Significant portions of ILC development involve configuration, not traditional coding. Copilot's value proposition is strongest for code-centric development. Teams doing primarily configuration work may see limited benefit from Copilot, reducing the measurable impact of the AI transformation. |
| **NIST Category** | MAP 1.1 (Intended purpose), MAP 3.1 (Expected benefits), MAP 4.1 (System limitations) |
| **Likelihood** | 4 (Likely -- Dynamics 365 is inherently configuration-heavy) |
| **Impact** | 3 (Moderate -- reduces ROI but does not create safety or compliance risk) |
| **Risk Score** | 12 (Medium) |
| **Mitigation** | (1) Focus Copilot on custom code, plugins, integrations, and data migration scripts where it adds most value. (2) Emphasize Rovo for BAs and POs who work in JIRA/Confluence -- story writing, acceptance criteria, documentation. (3) Measure per-role, not just per-team, to capture value where it exists. (4) Set realistic expectations with CIO: "5% improvement in targeted processes" not "5% improvement across all work." |
| **Owner** | AI Transformation Leader |
| **Status** | Open -- addressed in process design (Chapter 6) |

---

#### R-004: Multi-Vendor Team Complexity

| Field | Detail |
|-------|--------|
| **Risk ID** | R-004 |
| **Description** | The ILC program involves multiple vendors and subcontractors. Coordinating AI tool access, training, guardrail compliance, and governance across multiple organizations adds complexity. Different vendors may have different AI use policies, different tool access levels, and different training standards. |
| **NIST Category** | GOVERN 2.1 (Roles and responsibilities), GOVERN 5.1 (Stakeholder identification), MANAGE 3.1 (Change management) |
| **Likelihood** | 3 (Possible) |
| **Impact** | 3 (Moderate) |
| **Risk Score** | 9 (Medium) |
| **Mitigation** | (1) Establish single AI governance framework (this document) applicable to all vendors on ILC. (2) AI Usage Playbook applies regardless of vendor affiliation. (3) Training is mandatory for all participants regardless of employer. (4) Governance team includes representation that can coordinate across vendors. (5) Pilot starts with Krasan teams for simpler coordination. |
| **Owner** | Engagement Director |
| **Status** | Open -- addressed in governance structure (Section 6) |

---

#### R-005: DoIT 30-Day Notice Requirement

| Field | Detail |
|-------|--------|
| **Risk ID** | R-005 |
| **Description** | DoIT AI Policy Section 5f requires a 30-day advance notice and AI System Assessment before deploying a new AI system. If Copilot and/or Rovo have not been assessed, the earliest pilot start date is 30 days after filing. This could delay the pilot timeline. |
| **NIST Category** | GOVERN 1.1 (Legal/regulatory), MAP 1.4 (Legal requirements), MANAGE 3.1 (Change management) |
| **Likelihood** | 3 (Possible -- assessment status not yet confirmed) |
| **Impact** | 3 (Moderate -- delays timeline but does not prevent pilot) |
| **Risk Score** | 9 (Medium) |
| **Mitigation** | (1) Confirm with CIO whether Copilot and Rovo assessments have been filed. (2) If not filed, initiate filing immediately and adjust pilot timeline. (3) Use the 30-day waiting period productively for training, baseline measurement, and readiness assessment. (4) Document in governance team minutes when notice was filed and when the 30-day period expires. |
| **Owner** | AI Transformation Leader |
| **Status** | Open -- pending CIO confirmation (see Chapter 3, "Blockers Requiring CIO Input") |

---

#### R-006: Staff Resistance to AI Adoption

| Field | Detail |
|-------|--------|
| **Risk ID** | R-006 |
| **Description** | Some consultants may resist AI adoption due to concerns about job security, skepticism about AI quality, discomfort with new tools, or principled objections to AI use in government/child welfare contexts. Resistance can reduce pilot effectiveness and create team friction. |
| **NIST Category** | GOVERN 3.1 (AI expertise), GOVERN 4.1 (Risk-aware culture), GOVERN 5.2 (Stakeholder engagement) |
| **Likelihood** | 3 (Possible -- normal for any new technology adoption) |
| **Impact** | 2 (Minor -- affects adoption rate but manageable) |
| **Risk Score** | 6 (Low) |
| **Mitigation** | (1) Readiness assessment (Chapter 4) identifies concerns early. (2) Training addresses common concerns directly and respectfully. (3) Pilot-then-scale approach: teams see real results before being asked to adopt. (4) Framework philosophy: "Amplify, Don't Replace" -- explicit commitment to no workforce reduction. (5) SPACE survey monitors satisfaction and well-being. (6) Healthy skepticism is respected: "You are right to ask hard questions about AI in child welfare." |
| **Owner** | AI Transformation Leader |
| **Status** | Open -- addressed in readiness and training design |

---

#### R-007: Section 5e Ambiguity (State Data for AI)

| Field | Detail |
|-------|--------|
| **Risk ID** | R-007 |
| **Description** | DoIT AI Policy Section 5e requires written Agency Head consent and 30-day DoIT notice if "State data is used for AI purposes." It is unclear whether Copilot accessing ILC source code constitutes "State data for AI purposes." If yes, additional approvals are required before the pilot can start. |
| **NIST Category** | GOVERN 1.1 (Legal/regulatory), MAP 1.4 (Legal requirements) |
| **Likelihood** | 3 (Possible -- interpretation is genuinely ambiguous) |
| **Impact** | 4 (Major -- could require Agency Head consent + 30-day wait) |
| **Risk Score** | 12 (Medium) |
| **Mitigation** | (1) Raise question with CIO at earliest opportunity. (2) Recommend conservative interpretation: treat Copilot on ILC code as "State data for AI" and obtain consent proactively. (3) Document the interpretation and approval in governance records. (4) If consent is needed, initiate process immediately and use waiting period for training and baseline. |
| **Owner** | CIO (decision), AI Transformation Leader (tracking) |
| **Status** | Open -- pending CIO interpretation (see Chapter 3, "Blockers Requiring CIO Input") |

---

#### R-008: AI Output Quality Degradation

| Field | Detail |
|-------|--------|
| **Risk ID** | R-008 |
| **Description** | AI-assisted code or documentation could be lower quality than human-authored equivalents if team members become over-reliant on AI suggestions or reduce their own critical review. "Automation complacency" -- trusting AI output without sufficient scrutiny -- is a documented risk in human-AI interaction research. |
| **NIST Category** | MEASURE 1.1 (Trustworthiness metrics), MAP 4.1 (System limitations), MANAGE 1.1 (Risk treatment) |
| **Likelihood** | 2 (Unlikely -- human review requirement mitigates) |
| **Impact** | 3 (Moderate -- quality issues caught in testing; no direct safety impact) |
| **Risk Score** | 6 (Low) |
| **Mitigation** | (1) Quality is a primary measurement dimension -- defect density, code review pass rate, QUS story quality score all tracked and compared to baseline. (2) If quality metrics decline, governance team can strengthen review requirements, add training, or reduce AI tool scope. (3) Training explicitly addresses automation complacency: "The AI is a confident guesser. Your review is what makes it safe." (4) Spot checks verify that human review is substantive, not rubber-stamping. |
| **Owner** | AI Transformation Leader |
| **Status** | Open -- monitored through quality metrics |

### Risk Register Summary

| Risk ID | Risk | Score | Level |
|---------|------|-------|-------|
| R-001 | Tool access uncertainty | 12 | Medium |
| R-002 | PII exposure | 10 | Medium |
| R-003 | Configuration-first platform | 12 | Medium |
| R-004 | Multi-vendor complexity | 9 | Medium |
| R-005 | DoIT 30-day notice | 9 | Medium |
| R-006 | Staff resistance | 6 | Low |
| R-007 | Section 5e ambiguity | 12 | Medium |
| R-008 | AI output quality degradation | 6 | Low |

**Overall risk profile:** No high or critical risks identified. Six medium risks require active monitoring and mitigation. Two low risks are tracked but do not require immediate action. The overall risk profile supports a low-medium risk classification for the engagement (see MAP 2).

---

## 9. Implementation Checklist

The following checklist provides a step-by-step guide for implementing NIST AI RMF governance at DCFS. Steps are organized by NIST function and sequenced for practical implementation.

### Phase 1: Establish Governance (GOVERN)

- [ ] **G-01.** Confirm CIO sponsorship for AI governance team (GOVERN 2.1)
- [ ] **G-02.** Identify and recruit governance team members: Engagement Director, RTE, Security/Compliance rep (GOVERN 2.1)
- [ ] **G-03.** Draft governance team charter: purpose, scope, membership, cadence, decision rights (GOVERN 2.2)
- [ ] **G-04.** Hold governance team kickoff meeting; adopt charter (GOVERN 2.2)
- [ ] **G-05.** Review and confirm DoIT AI Policy compliance map (Appendix B) with governance team (GOVERN 1.1)
- [ ] **G-06.** Review and confirm DCFS-specific guardrails with governance team (GOVERN 1.2)
- [ ] **G-07.** Resolve Section 5e ambiguity with CIO: does Copilot on ILC code = "State data for AI"? (GOVERN 1.1)
- [ ] **G-08.** Confirm Section 5f status: have Copilot/Rovo assessments been filed with DoIT? (GOVERN 1.1)
- [ ] **G-09.** If assessments not filed: initiate filing and establish 30-day timeline (GOVERN 1.1, MANAGE 3.1)
- [ ] **G-10.** Confirm tool access: Copilot licenses secured, Rovo access confirmed (MAP 1.6)
- [ ] **G-11.** Draft AI Usage Playbook; governance team review and approval (GOVERN 1.2)
- [ ] **G-12.** Distribute AI Usage Playbook to all pilot participants (GOVERN 1.2)
- [ ] **G-13.** Develop training curriculum: Foundation + role-specific tracks (GOVERN 3.1)
- [ ] **G-14.** Establish incident reporting procedures; distribute to all teams (MANAGE 2.2)
- [ ] **G-15.** Establish escalation paths; document in governance records (GOVERN 2.3)

### Phase 2: Map and Assess Risk (MAP)

- [ ] **M-01.** Complete AI system characterization for Copilot (MAP 1.1 through 1.6)
- [ ] **M-02.** Complete AI system characterization for Rovo (MAP 1.1 through 1.6)
- [ ] **M-03.** Document explicit scope boundaries ("out of scope" table) (MAP 1.1)
- [ ] **M-04.** Complete risk classification: confirm low-medium overall risk level with governance team (MAP 2.1)
- [ ] **M-05.** Complete benefits-cost analysis (MAP 3.1 through 3.3)
- [ ] **M-06.** Document system limitations; incorporate into training materials (MAP 4.1, 4.2)
- [ ] **M-07.** Populate risk register with known risks (all categories)
- [ ] **M-08.** Governance team reviews and approves risk register (GOVERN 6.1)

### Phase 3: Establish Measurement (MEASURE)

- [ ] **ME-01.** Define trustworthiness metrics for DCFS context (MEASURE 1.1)
- [ ] **ME-02.** Develop per-sprint spot check protocol: what to check, how many samples, documentation template (MEASURE 2.1)
- [ ] **ME-03.** Develop bias detection checklist for AI output review (MEASURE 2.2)
- [ ] **ME-04.** Integrate DORA metrics collection with tools.ussp.co dashboard (MEASURE 3.1)
- [ ] **ME-05.** Develop SPACE survey instrument for pre/mid/post pilot administration (MEASURE 1.1)
- [ ] **ME-06.** Establish baseline metrics before AI introduction (MEASURE 1.2)
- [ ] **ME-07.** Define monitoring cadence: per-sprint, weekly, bi-weekly, monthly (MEASURE 3.1)
- [ ] **ME-08.** Develop executive scorecard template (MEASURE 3.2)

### Phase 4: Implement Risk Management (MANAGE)

- [ ] **MA-01.** Develop risk treatment plans for each risk in the risk register (MANAGE 1.1)
- [ ] **MA-02.** Define incident severity levels and classification criteria (MANAGE 2.1)
- [ ] **MA-03.** Develop incident response procedures for each severity level (MANAGE 2.3)
- [ ] **MA-04.** Develop post-incident analysis template (MANAGE 2.4)
- [ ] **MA-05.** Define change management process for AI tool scope changes (MANAGE 3.1)
- [ ] **MA-06.** Establish documentation inventory and retention schedule (MANAGE 4.1)
- [ ] **MA-07.** Conduct tabletop exercise: simulate a Critical severity incident (PII in AI prompt) to test response procedures (MANAGE 2.3)
- [ ] **MA-08.** Governance team reviews all MANAGE deliverables and approves (GOVERN 6.2)

### Phase 5: Operate and Monitor (Ongoing)

- [ ] **O-01.** Deliver training to all pilot participants (GOVERN 3.1)
- [ ] **O-02.** Begin pilot with AI tools on 2 selected teams (MAP 1.3)
- [ ] **O-03.** Execute per-sprint spot checks per protocol (MEASURE 2.1, 3.1)
- [ ] **O-04.** Conduct weekly check-ins with pilot teams (MEASURE 3.1)
- [ ] **O-05.** Administer mid-pilot SPACE survey (MEASURE 1.1)
- [ ] **O-06.** Governance team bi-weekly meetings: review monitoring data, update risk register (GOVERN 6.2, MEASURE 3.2)
- [ ] **O-07.** Report incidents per established procedures (MANAGE 2.2)
- [ ] **O-08.** Produce monthly executive scorecard for CIO (MANAGE 4.1)
- [ ] **O-09.** At pilot endpoint: compile pilot results report with governance team recommendation (all functions)
- [ ] **O-10.** CIO decision: scale, adjust, or halt based on pilot results (GOVERN 2.1)

### Phase 6: Scale and Reassess (If Approved)

- [ ] **S-01.** Update risk register for scale context (additional teams, broader adoption) (MAP 2.1)
- [ ] **S-02.** Update training materials based on pilot lessons learned (GOVERN 3.1)
- [ ] **S-03.** Deliver training to scale teams (GOVERN 3.1)
- [ ] **S-04.** Transition governance team to monthly cadence (GOVERN 2.1)
- [ ] **S-05.** Continue per-sprint spot checks across all teams (MEASURE 3.1)
- [ ] **S-06.** Conduct annual NIST AI RMF reassessment (GOVERN 1.6, all functions)
- [ ] **S-07.** Update all documentation to reflect scale-phase operations (MANAGE 4.1)

---

## References

1. NIST. (2023). *Artificial Intelligence Risk Management Framework (AI RMF 1.0).* NIST AI 100-1. National Institute of Standards and Technology. Gaithersburg, MD. DOI: 10.6028/NIST.AI.100-1. Available at: https://www.nist.gov/artificial-intelligence/executive-order-safe-secure-and-trustworthy-artificial-intelligence

2. NIST. (2023). *NIST AI RMF Playbook.* National Institute of Standards and Technology. Available at: https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook

3. NIST. (2022). *AI Risk Management Framework: Initial Draft.* NIST AI 100-1 (Draft). National Institute of Standards and Technology. (Predecessor document providing development context.)

4. State of Illinois Department of Innovation & Technology. (2025). *AI Policy.* Effective April 1, 2025. (See Appendix B for section-by-section compliance map.)

5. U.S. Department of Health and Human Services, Administration for Children and Families. (2016). *Comprehensive Child Welfare Information System (CCWIS) Final Rule.* 45 CFR 1355. (Federal requirements for child welfare IT systems.)

6. NIST. (2018). *Framework for Improving Critical Infrastructure Cybersecurity, Version 1.1.* NIST Cybersecurity Framework. (Companion risk management framework referenced for integration approach.)

7. Executive Office of the President. (2023). *Executive Order 14110: Safe, Secure, and Trustworthy Development and Use of Artificial Intelligence.* (Federal policy context for NIST AI RMF adoption.)

---

**Previous:** [Chapter 3: Governance & Compliance](03-governance-compliance.md) -- DoIT AI Policy alignment, guardrails, and regulatory mapping

**Next:** [Chapter 4: Readiness Assessment](04-readiness-assessment.md) -- Formal survey instrument for all teams
W