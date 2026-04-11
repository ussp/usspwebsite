---
title: "Process Design"
description: "Mapping current-state SDLC processes to AI-augmented state using the People/Process/Tools capability model"
---

# Chapter 6: Process Design

## Purpose

Before training anyone, design how each SDLC process will be augmented with AI. This is the "Design / Develop" phase -- mapping the current state to the AI-augmented state for each role, selecting tools and methods, and building the training materials.

## When This Happens

- **Phase:** Design
- **Timing:** After baseline measurement, before training
- **Deliverable:** Process Design Docs, Role-Based Playbooks (draft), Training Plan

## The Capability Model: People, Process, Tools

Each SDLC process is mapped across three dimensions:

| Dimension | Question |
|-----------|----------|
| **People** | Which role performs this process? |
| **Process** | What do they do today? What changes with AI? |
| **Tools** | Which approved AI tool augments this process? |

## Process-by-Process Mapping

### Business Analyst Processes

| SDLC Process | Current State | AI-Augmented State | KPI |
|-------------|--------------|-------------------|-----|
| **Story Writing** | BA drafts manually; quality varies; multiple rework cycles | BA uses AI tool as co-author; consistent quality floor | Story review cycle time, rejection rate, quality score |
| **Acceptance Criteria** | BA writes AC from requirements; inconsistent format | AI tool drafts Gherkin/BDD criteria from story context | Test coverage %, first pass yield |
| **Requirement Summarization** | Manual reading and synthesis of long documents | AI tool summarizes and highlights key points | Story authoring time |
| **Impact Analysis** | Manual cross-referencing of related stories/features | AI tool identifies related items and potential conflicts | Rework rate |
| **Refinement Preparation** | BA prepares questions manually | AI tool identifies edge cases and missing details | Requirement clarity |

### Tester Processes

| SDLC Process | Current State | AI-Augmented State | KPI |
|-------------|--------------|-------------------|-----|
| **Test Script Creation** | Tester writes scripts manually from AC | AI generates test framework from AC | Test creation time, defect escape rate |
| **Edge Case Identification** | Relies on tester experience | AI identifies scenarios tester might miss | Defect escape rate |
| **Test Data Generation** | Manual creation of test datasets | AI generates realistic test data | Test creation time |

### Developer Processes

| SDLC Process | Current State | AI-Augmented State | KPI |
|-------------|--------------|-------------------|-----|
| **Code Comprehension** | Developer reads codebase manually | AI explains code, identifies patterns | Cycle time per story |
| **Code Review** | Manual peer review | AI pre-reviews for issues, security, style | Defect density, review turnaround time |
| **Documentation** | Often skipped or outdated | AI generates docs from code and configuration | Documentation coverage |
| **Refactoring Suggestions** | Developer identifies improvements manually | AI suggests refactoring opportunities | Code quality metrics |

### Scrum Master Processes

| SDLC Process | Current State | AI-Augmented State | KPI |
|-------------|--------------|-------------------|-----|
| **Sprint Insights** | Manual review of project tracking data | AI surfaces patterns and anomalies | Sprint predictability |
| **Metrics Interpretation** | Scrum Master pulls reports manually | AI-assisted analysis of velocity trends | Planning accuracy |
| **Refinement Facilitation** | Manual preparation | AI identifies stories needing attention | Rework rate |

## Design Principles

1. **The process doesn't change -- it gets augmented.** We are not replacing how BAs write stories. We are giving them a tool that makes the process faster and more consistent.

2. **Start with the pain point.** Select SDLC processes where teams currently experience friction (rework, delays, inconsistency). Don't augment processes that already work well.

3. **Every augmentation has a measurable KPI.** If we can't measure the improvement, we shouldn't augment the process.

4. **The human remains the author.** AI generates a draft; the human reviews, edits, and approves. This is the guardrail, not an option.

## Design Output

For each SDLC process selected for the pilot, produce:

1. **Current state description** -- What the person does today, tools used, typical time, common problems
2. **AI-augmented state description** -- What changes, what stays the same, what the AI tool does
3. **Prompt template** -- The specific prompt(s) the person will use (goes into the playbook)
4. **Example output** -- A before/after showing the AI's contribution on a real project artifact
5. **Guardrails** -- What the person must check/verify in every AI output
6. **Training module mapping** -- Which training track covers this process (see [Chapter 7](07-training-delivery.md))

## From Design to Playbook

The design docs become the foundation for role-based playbooks (see [Chapter 10](10-playbooks.md)). During the pilot, these designs are tested and refined based on real-world feedback. The playbooks are living documents -- started here in Design, updated through Pilot, finalized at Scale.

---

**Next:** [Chapter 7: Training Delivery](07-training-delivery.md) -- 6 training tracks with content, delivery methods, and materials
