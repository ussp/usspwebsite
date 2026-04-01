# Chapter 10: Tracking & Monitoring

[Back to Table of Contents](README.md) | [Previous: Integration Guide](09-integration-guide.md)

---

## Tracking Engagement Progress

### Dashboard Monitoring

The Dashboard provides a real-time overview:

| What to Monitor | Where to Look | Action Needed If... |
|----------------|---------------|-------------------|
| Active engagements | "Active Engagements" card | Count is 0 — create new engagements |
| Assessment completion | "Assessments In Progress" card | Number stays high — follow up on data collection |
| Average improvement | "Avg Improvement" card | Shows "--" — complete more engagements |
| Individual engagements | Recent Engagements table | Status stuck in one phase — investigate |

### Engagement-Level Tracking

On each engagement detail page, monitor:

1. **Timeline** — Is the engagement progressing through phases?
2. **Team cards** — Does each team have baseline AND post-training assessments?
3. **Assessment status** — Are assessments in "collecting" or "completed" state?

### Recommended Cadence

| Activity | Frequency | Who |
|----------|-----------|-----|
| Check dashboard | Weekly | Engagement lead |
| Review assessment status | Bi-weekly | Engagement lead |
| Survey follow-up | As needed | Engagement lead |
| Report review | After each engagement completes | Leadership |

## Monitoring Team Improvement

### Team-by-Team Comparison

When an engagement has multiple teams, compare them:
- Which team improved the most?
- Which metrics improved vs regressed?
- Did any team's quality metrics degrade while speed improved?

### Warning Signs

| Warning | What It Means | Action |
|---------|--------------|--------|
| Speed up, quality down | Change failure rate or bug rate increased | Review AI-generated code quality practices |
| Huge improvement (>60%) | May include novelty effect | Re-measure in 3 months |
| One dimension dropped | e.g., Communication score decreased | AI may be reducing collaboration — address in training |
| Cognitive load increased | DevEx cognitive load score got worse | Team may be struggling with new AI tools — provide more support |

### Long-Term Monitoring

For sustained impact measurement:

1. **Quarterly re-assessment** — Run post-training assessment every quarter for 12 months
2. **Trend analysis** — Is improvement sustaining, growing, or fading?
3. **Cross-engagement comparison** — How do different clients/teams compare?

## Key Performance Indicators (KPIs) for the Tool Itself

Track whether the AI Transformation Monitor is delivering value:

| KPI | Target | How to Measure |
|-----|--------|---------------|
| Engagements created per quarter | 3+ | Dashboard count |
| Average improvement across clients | 20-45% | Dashboard avg improvement |
| Time from engagement start to report | < 8 months | Engagement created_at to report generated |
| Client satisfaction with reports | 4+/5 | Follow-up survey (outside tool) |
| Repeat clients | >50% | Track returning client names |

## Data Integrity Checks

Periodically verify:

- [ ] All completed engagements have reports generated
- [ ] Baseline and post-training periods don't overlap
- [ ] Survey response counts match team size
- [ ] Integration data matches what's in Jira/ADO (spot check)
- [ ] No assessments stuck in "draft" or "collecting" for >30 days

---

[Next: Developer Guide →](11-developer-guide.md)
