# Meeting Transcript Notes — April 13, 2026

> AI-generated meeting notes from Teams recording, extracted by Romi.
> Full video available via Teams link.

---

## Topic 1: Framework Overview and Phases
Vinay described a nine-phase framework for AI augmentation, including governance alignment, baselining, design, training, piloting, measurement, playbook finalization, and scaling. The approach emphasizes starting with two pilot teams, establishing control groups, and using feedback loops to refine processes before broader rollout.

## Topic 2: Pilot Team Selection and Measurement
The team plans to select two pilot teams to implement the AI-augmented processes, with a control group for comparison. Key performance indicators (KPIs) will be chosen based on organizational priorities, and both quantitative and qualitative metrics will be used to measure improvements.

## Topic 3: Role-Specific Training and Adoption
Role-specific training will be developed for developers, testers, business analysts, and scrum masters, delivered through lunch-and-learns or pre-recorded sessions. The training will address both technical skills and concerns about AI adoption, with ongoing support and weekly check-ins during the pilot.

## Topic 4: Playbook Development and Scaling
Lessons learned from the pilot will be documented in role-based playbooks, which will be refined and finalized before scaling the approach to all teams. The rollout will be phased, with pilot team members acting as AI champions to support broader adoption.

## Topic 5: Debate — AI Code Generation
James Doherty, Emil, Vinay, Dinkar, Jeffrey, and Robert discussed whether to include AI-driven code generation in the pilot, ultimately agreeing to reconsider initial constraints and seek external validation from Gartner, with the goal of achieving measurable productivity gains within a 13-week timeframe.

### Sub-points:
- **Initial exclusion was accidental** — James clarified this constraint was not intentional and requested the team to revisit the decision, considering the potential for significant efficiency gains.
- **Risks discussed:** Developer attrition, quality of user stories, need for clear context in code generation.
- **Agreed approach:** Stair-stepped — start with user story improvements before introducing code generation.
- **External validation:** James proposed consulting Gartner for industry best practices.
- **Governance:** Importance of aligning with state AI policy, human-in-the-loop, proper documentation.

## Topic 6: Timeline and Productivity Goals
James set a target of 10-15% productivity improvement within 13 weeks, requesting a rollout plan and visual timeline from Vinay, and designating Dave as the point of contact during his absence.

## Topic 7: AI Policy, Governance, and Tooling Constraints
- State AI policy requires 30-day notice for new AI deployments
- Human-in-the-loop mandatory for all AI-driven decisions
- Agency responsible for risk acceptance and compliance
- DoIT Core makes recommendations, agencies can select/procure additional tools if justified
- Need to establish or leverage AI governance team
- Document protocols for human oversight
- All processes must be reviewed and approved before rollout

## Topic 8: Data Protection and Sensitive Information
Vinay raised concerns about handling sensitive data (PII, child welfare information). Team discussed importance of guardrails, separate environments, and compliance with privacy regulations.

## Topic 9: Implementation Challenges
- Team adoption depends on changing habits and overcoming resistance
- Training time will impact team capacity and deliverables — explicitly allocate time
- Need to understand how AI tools interact with Microsoft Dynamics (config ≠ code)
- Measurement focus on tangible outputs (LOC, documentation, config lines) not story points
- Clearly communicate methodology and capacity impacts to stakeholders

## Topic 10: Stakeholder Roles and Communication
- Dave designated as interim AI lead during Jim's absence
- PMO and BA teams approved for pilot involvement (Jim cautioned about resistance, offered executive support)
- Maintain open communication, copy Jim on key updates
- Coordinate meetings and working sessions as needed

---

## Complete Follow-Up Task List

### Vinay
1. Code generation policy review — review state AI policy re: code generation, send questions about restrictions
2. Tool authorization — compile list of additional AI tools beyond Copilot/Rovo, assess audit capabilities
3. Rollout timeline visualization — prepare rollout map with visual waterfall chart
4. Governance structure proposal — submit proposal with governance structure/process
5. AI policy sharing — share current AI policy with Jeffrey and Dinkar
6. Pilot measurement methodology — develop methodology based on code/docs/config output (not points)
7. Reassess framework — update to include code generation, new targets, measurement changes

### Jeffrey Lobo
1. Dynamics working session — arrange with Kashif Ali and Shyam for config/code generation exploration
2. Introduction — connect Vinay to Dynamics experts

### Dinkar
1. Dynamics POC setup — investigate demo environment outside the state (licensing, resources)
2. Support environment setup — coordinate with Jeffrey on infrastructure
