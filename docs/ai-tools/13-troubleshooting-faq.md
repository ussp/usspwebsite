# Chapter 13: Troubleshooting & FAQ

[Back to Table of Contents](README.md) | [Previous: API Reference](12-api-reference.md)

---

## Frequently Asked Questions

### General

**Q: What's the minimum team size for meaningful results?**
A: At least 3 team members for survey data to be statistically meaningful. Smaller teams can still use DORA and Scrum metrics (which are team-level).

**Q: How long does the full process take?**
A: Typical timeline:
- Baseline: 6-12 weeks (3-6 sprints)
- Training: 2-6 weeks
- Buffer: 2-4 weeks
- Post-training: 6-12 weeks (3-6 sprints)
- **Total: 4-8 months**

**Q: Can we measure multiple teams simultaneously?**
A: Yes. Each engagement can have multiple teams, and each team runs independently. This is designed for cross-team comparison.

**Q: What if the team changes members during the process?**
A: Survey responses are per-member. If someone joins or leaves, note it in the engagement notes. The system handles partial survey data gracefully.

### Methodology

**Q: Why 3 sprints minimum?**
A: One sprint can be an outlier (holiday, crunch, incident). Three sprints gives enough data to smooth out noise and produce reliable averages.

**Q: Why the 2-4 week ramp-up buffer?**
A: The first weeks after training are a learning curve. People are slower as they adopt new tools. Measuring during this period would undercount the improvement.

**Q: What if improvement is negative?**
A: This happens. Possible causes:
- Measurement period too short
- Team was disrupted by non-AI factors (reorg, incident, scope change)
- AI tools weren't a good fit for this team's work
- Training quality was insufficient

The report shows this honestly. Negative results are still valuable — they inform what to change.

**Q: How do you handle the "Goodhart's Law" problem?**
A: We explicitly don't share metric targets with the team being measured. Metrics are observational, not goals. The team works normally while we observe.

### Integration

**Q: What if the client uses Jira Server (not Cloud)?**
A: Currently only Jira Cloud is supported. Jira Server has a different API. Use "Manual Entry" for on-premise Jira instances.

**Q: Can we pull data retroactively?**
A: Yes, as long as the sprint data exists in Jira/ADO. Set the assessment period to past dates and sync.

**Q: What about teams that don't use story points?**
A: The tool will still capture sprint completion counts (throughput) and cycle time. Velocity (story points) will show as 0.

### Reports

**Q: Why does my report show "Not available"?**
A: Both baseline AND post-training assessments must exist for the team. Check that:
1. Both assessments are created
2. Both have metrics data (via integration sync or manual entry)

**Q: The improvement seems too high (>60%). Is it real?**
A: Possibly. The tool flags this with a warning: "May include novelty/engagement boost. Recommend re-measuring in 3 months." Initial gains often include excitement about new tools.

**Q: Can I customize the weighting formula?**
A: Not through the UI currently. The weights (DORA 30%, Scrum 30%, SPACE 25%, DevEx 15%) are in `ai-reports.ts`. A developer can adjust them for specific engagements via code.

## Troubleshooting

### "Unauthorized" when accessing the app
- Your Google account must be in the `staff_users` table
- Contact an admin to add your email
- Make sure you're using the correct Google account

### "Forbidden" on an action
- Your role doesn't have the required permission
- Admin role has full access; recruiter has read-only for AI tools
- Contact an admin to upgrade your role if needed

### Assessment created but no metrics
- If using integration: check that the integration config is correct and test the connection
- If manual: you need to POST metrics via the API
- Check the date range — are there closed sprints within your period?

### Radar chart not rendering
- Requires at least 3 SPACE dimensions with data
- Check that survey responses are submitted for both baseline and post-training
- Verify survey responses in the database via `GET /api/assessments/{id}/metrics`

### Integration sync fails
- Verify API token hasn't expired
- Check rate limits (Jira: 100 requests/minute)
- Ensure board/project is accessible with the provided credentials
- Try `POST /api/teams/{id}/test-connection` to diagnose

---

[Back to Table of Contents](README.md)
