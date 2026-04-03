# Tester AI Playbook — DCFS ILC

> **Status:** SKELETON — To be developed during pilot phase
> **Tool:** Atlassian Rovo (JIRA AI) + GitHub Copilot (when available)

---

## Purpose

Guide testers on using AI to generate test scripts faster from acceptance criteria, improve test coverage, and reduce manual effort.

---

## Use Cases

### 1. Test Script Generation from Acceptance Criteria
<!-- TODO: Develop after understanding test format and tools used -->
- Prompt template: "Generate test cases for these acceptance criteria: [AC]"
- When to use: Starting point — tester refines and adds domain-specific scenarios
- Expected benefit: 15%+ reduction in test creation time

### 2. Edge Case Identification
- Prompt template: "What edge cases should be tested for this story?"
- When to use: After initial test plan draft
- Expected benefit: Better coverage, fewer defect escapes

### 3. Test Data Generation
- Prompt template: "Generate sample test data for [scenario]"
- When to use: When setting up test environments
- Expected benefit: Faster test setup

---

## Do's and Don'ts

| Do | Don't |
|----|-------|
| Use AI-generated tests as a starting framework | Don't trust AI tests without review |
| Add domain-specific child welfare scenarios manually | Don't expect AI to know DCFS business rules |
| Review for completeness against AC | Don't skip edge cases AI might miss |

---

## Metrics to Track

- Test script creation time (before vs after AI)
- Test coverage (scenarios per story)
- Defect escape rate
- Tester satisfaction

---

*To be filled in during pilot phase with real examples and feedback from pilot testers.*
