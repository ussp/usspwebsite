---
title: "Governance & Compliance"
description: "Regulatory mapping, guardrails, and AI usage playbook for any client environment"
---

# Chapter 3: Governance & Compliance

## Purpose

Before any AI tool is used, the framework must be aligned with the client's regulatory and policy environment. Every organization operates under some combination of internal AI policies, industry regulations, and data handling requirements. This chapter provides the process and templates for mapping the framework to any compliance landscape.

## When This Happens

- **Phase:** Govern
- **Timing:** Before baseline measurement or training
- **Deliverable:** AI Usage Playbook and Compliance Map

## Compliance Mapping Process

### Step 1: Identify the Policy Landscape

Every engagement begins by cataloging the client's applicable policies and regulations:

1. **Organizational AI policy** -- Does the client have an enterprise AI usage policy? How many sections? What does it require?
2. **Industry regulations** -- What regulatory frameworks apply to the client's data and operations?
3. **Data classification rules** -- What categories of data exist, and which are restricted from AI tool contexts?
4. **Tool approval process** -- How are new tools approved? What tools are already sanctioned?

### Step 2: Build the Compliance Map

The compliance map is a section-by-section mapping of the client's AI policy to the framework's compliance approach. Use the template below, adapting the sections to match the client's actual policy structure.

### Compliance Map Template

| # | Policy Section | Requirement Summary | Framework Compliance Approach | Status |
|---|---------------|---------------------|-------------------------------|--------|
| 1 | Purpose and Scope | [What the policy covers] | [How our framework aligns] | [Covered / Needs Input / Gap] |
| 2 | Definitions | [AI system classification] | [How our tools are classified] | |
| 3 | Responsible AI Principles | [Transparency, fairness, accountability requirements] | [Training module, human review process] | |
| 4 | Governance Structure | [Oversight requirements] | [Engagement Director + AI Transformation Leader roles] | |
| 5 | Approved Tools | [Tool approval requirements] | [Only client-approved tools; no additions without approval] | |
| 6 | Training Requirements | [Staff training mandates] | [Foundation training track covers policy compliance] | |
| 7 | Data Classification | [Data handling rules] | [No restricted data in any AI prompt -- defined per engagement] | |
| 8 | Output Review | [Human review requirements] | [All AI output reviewed by human before use] | |
| 9 | Incident Response | [AI-related incident handling] | [Quality spot checks per sprint; escalation process] | |
| 10 | Continuous Monitoring | [Ongoing oversight requirements] | [AI Transformation Monitor provides continuous tracking] | |

*Adapt the number and content of rows to match the client's actual policy. Not all clients will have all sections.*

### Step 3: Identify Blockers

Review the compliance map for items with "Needs Input" or "Gap" status. These become blockers that must be resolved before the pilot can begin. Common blockers include:

- **Data classification ambiguity** -- Does AI tool access to source code constitute use of restricted data? Requires executive confirmation.
- **Assessment/notice requirements** -- Has the required AI system assessment been filed? If not, there may be a mandatory waiting period.
- **Tool approval status** -- Are the intended AI tools formally approved, or only informally available?

Document all blockers and assign them as action items from the executive discovery session.

## Engagement-Specific Guardrails

Every engagement produces a set of non-negotiable guardrails. These are derived from the compliance map and tailored to the client's environment. Common guardrails include:

| Guardrail | Description |
|-----------|-------------|
| **No autonomous code generation** | AI provides suggestions only -- developers implement all code. Documented in every playbook. |
| **AI for SDLC only** | All targeted processes are delivery processes (story writing, testing, coding, documentation). No business process automation. |
| **No restricted data in AI prompts** | Define what constitutes restricted data for this engagement (PII, case data, financial records, security documentation, etc.). |
| **Approved tools only** | Only client-sanctioned AI tools are used. No additional tools without formal approval. |
| **Human-in-the-loop** | Every AI-generated output is reviewed, edited, and approved by a human before use. |

Customize this table for each engagement based on the client's specific data sensitivity and regulatory requirements.

## Common Regulatory Considerations

Different industries bring different regulatory frameworks. The table below lists regulations commonly encountered across engagements. For each engagement, identify which apply and document how the framework maintains compliance.

| Regulation | Sector | Relevance to AI Framework |
|-----------|--------|--------------------------|
| HIPAA (Health Insurance Portability and Accountability Act) | Healthcare | No protected health information (PHI) in AI prompts or contexts |
| FERPA (Family Educational Rights and Privacy Act) | Education | No student records or educational data in AI prompts |
| 42 CFR Part 2 | Healthcare (Substance Abuse) | Substance abuse records excluded from all AI contexts |
| IRS Publication 1075 | Government (Tax Data) | Federal tax information excluded from all AI contexts |
| SOC 2 | Technology / SaaS | AI tool usage must align with security and availability controls |
| PCI DSS | Financial / Payments | No cardholder data in AI prompts |
| FedRAMP | Federal Government | AI tools must meet federal cloud security requirements |
| GDPR | International / EU Data | Personal data of EU residents excluded from AI contexts |
| State/Agency AI Policies | Government | Map all sections to framework compliance approach (see template above) |
| Child Welfare Regulations | Social Services | No case data, no child information in AI prompts |
| CCWIS / SACWIS Standards | Government (Child Welfare IT) | AI augmentation does not affect system certification; modules remain compliant |

*This is not exhaustive. Each engagement should identify its specific regulatory landscape during the governance phase.*

## Deliverable: AI Usage Playbook

The governance phase produces an **AI Usage Playbook** that is distributed to all pilot participants. It includes:

1. **Approved tools** -- What tools are sanctioned and what is not permitted
2. **Data boundaries** -- What data can and cannot be entered into AI tools (specific to this engagement)
3. **Output rules** -- All AI output must be reviewed by a human before use
4. **Incident reporting** -- What to do if AI produces inappropriate, biased, or incorrect output
5. **Compliance checklist** -- Per-sprint verification that guardrails are being followed

The AI Usage Playbook is a living document. It is updated as policies change, tools are added or removed, or new regulatory guidance is issued.

## Governance Checklist

Before proceeding to the Baseline phase, confirm:

- [ ] Client AI policy identified and all sections reviewed
- [ ] Compliance map completed (all sections mapped to framework approach)
- [ ] Blockers identified and assigned as action items
- [ ] Executive confirmation obtained on any ambiguous policy interpretations
- [ ] Engagement-specific guardrails documented and approved
- [ ] AI Usage Playbook drafted
- [ ] Regulatory considerations documented
- [ ] Tool access confirmed (licenses, permissions, environment readiness)

---

**Next:** [Chapter 4: Readiness Assessment](04-readiness-assessment.md) -- Formal survey instrument for measuring team readiness
