# Chapter 6: User Guide — Reports

[Back to Table of Contents](README.md) | [Previous: Training Plans](05-user-guide-training-plans.md)

---

## What Is a Transformation Report?

The **Transformation Report** is the key deliverable. It compares baseline and post-training metrics side by side, showing exactly how much the team improved — backed by research benchmarks.

## Viewing a Report

1. On the engagement detail page, click **"View Report"** on the team card
2. The report loads automatically (requires both baseline AND post-training assessments to be completed)

## Reading the Report

### Overall Improvement Score

The top section shows:
- **Overall improvement percentage** — Weighted average across all measured dimensions
- **Progress bar** — Visual representation (0-100% scale)
- **Benchmark context** — How this result compares to published research

Benchmark context messages:

| Range | Message |
|-------|---------|
| < 10% | Below typical AI training impact |
| 10-25% | Consistent with Forrester TEI (22% improvement) |
| 25-45% | Consistent with McKinsey and Harvard/BCG findings |
| 45-60% | Exceptional, approaching GitHub Copilot individual benchmark |
| > 60% | Extraordinary — may include novelty effect, re-measure in 3 months |

### DORA Metrics Section

Four cards showing before → after for each DORA metric:

| Metric | Good Direction | Example |
|--------|---------------|---------|
| Deployment Frequency | Higher ↑ | 2/wk → 5/wk (+150%) |
| Lead Time for Changes | Lower ↓ | 4.2 days → 1.8 days (-57%) |
| Change Failure Rate | Lower ↓ | 12% → 8% (-33%) |
| Mean Time to Recovery | Lower ↓ | 45 min → 22 min (-51%) |

### Scrum Metrics Section

| Metric | Good Direction | Example |
|--------|---------------|---------|
| Velocity | Higher ↑ | 42 pts → 58 pts (+38%) |
| Cycle Time | Lower ↓ | 8.3 days → 5.1 days (-39%) |
| Predictability | Higher ↑ | 72% → 89% (+24%) |
| Throughput | Higher ↑ | 14 items → 19 items (+36%) |
| Bug Escape Rate | Lower ↓ | 3/sprint → 2/sprint (-33%) |

### SPACE Radar Chart

A 5-axis spider chart showing:
- **Gray polygon** — Baseline scores (averaged across team members)
- **Blue polygon** — Post-training scores
- The larger the blue polygon relative to gray, the more improvement

### DevEx Section

Three horizontal bars comparing before/after for:
- Flow State (uninterrupted focus time)
- Feedback Loops (CI/CD and review speed)
- Cognitive Load (mental effort — lower is better)

### Research Context

Cards citing the key studies that validate the results:
- Forrester TEI: 22% improvement
- McKinsey: 20-45% improvement
- Harvard/BCG: 25% faster, 40% higher quality
- GitHub Copilot: 55.8% faster task completion

## How Scores Are Computed

### Improvement Percentage

For **higher-is-better** metrics (velocity, deployment frequency):
```
improvement = ((post - baseline) / baseline) * 100
```

For **lower-is-better** metrics (cycle time, MTTR, cognitive load):
```
improvement = ((baseline - post) / baseline) * 100
```

### Overall Score Weighting

| Category | Weight | Rationale |
|----------|--------|-----------|
| DORA Metrics | 30% | Delivery performance (objective) |
| Scrum Metrics | 30% | Sprint performance (objective) |
| SPACE Survey | 25% | Developer experience (perceptual) |
| DevEx Survey | 15% | Developer experience (perceptual) |

This weighting follows the SPACE framework recommendation to mix objective and perceptual metrics.

## Sharing Reports

### With Client Stakeholders
Share the report URL directly. Viewers with read access can see all data.

### For Government Budget Justification
The report data is audit-ready:
- Every metric is timestamped and sourced
- Methodology is published and citable
- Research benchmarks provide external validation

### Future: PDF Export
PDF export for executive summaries is planned for a future release.

---

[Next: Methodology & Research →](07-methodology-research.md)
