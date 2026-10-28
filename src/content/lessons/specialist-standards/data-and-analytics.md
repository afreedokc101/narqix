---
id: "3fdeadddae7181938bc4d7cc74c36f73"
title: "Data and Analytics"
section: "specialist-standards"
page: "data-and-analytics"
order: 151
summary: "For Narqix data analysts building tracking, dashboards, reports and analysis. Use this page as your working checklist to deliver numbers clients can trust and act on."
duration: "10 min"
---

<div class="callout callout-intro">

For Narqix data analysts building tracking, dashboards, reports and analysis. Use this page as your working checklist to deliver numbers clients can trust and act on.

Track: Specialist  ·  Role: Data Analyst  ·  Time to complete: 10 min

</div>

## The Narqix view of data

A report is only useful if it changes a decision. Every dashboard you build should answer: where is the bottleneck, and is it getting better or worse? Lead with the answer, then show the numbers that prove it.

## Definition of done

- [ ]  The report or dashboard answers the questions listed in the Scope Sheet, and each question has a named owner who will use it
- [ ]  Every metric has a written definition: formula, source, filters, time zone, refresh schedule
- [ ]  Numbers reconcile to the source system within an agreed tolerance, with the check documented
- [ ]  Refresh runs on schedule and alerts on failure
- [ ]  A short guide explains how to read it and what to do when a number looks wrong
- [ ]  The client accepted it in writing

## Quality checklist

<details class="toggle"><summary>Data foundation</summary>

- [ ]  Sources listed with owners and access method
- [ ]  Tracking plan for events and conversions, agreed before implementation
- [ ]  Raw data kept untouched; cleaning done in a separate, documented step
- [ ]  Duplicates, test records and internal traffic excluded, with the rule written down
- [ ]  Time zone and currency stated and consistent

</details>

<details class="toggle"><summary>Metrics</summary>

- [ ]  One definition per metric across every report (a "lead" means the same thing everywhere)
- [ ]  Metrics read in pairs where one can mislead alone (cost per lead with lead quality, volume with conversion rate)
- [ ]  Every number shown with a comparison: previous period, same period last year, or target
- [ ]  Small samples flagged; no conclusions drawn from a handful of records

</details>

<details class="toggle"><summary>Dashboard design</summary>

- [ ]  Top row: the 3 to 5 numbers that matter most
- [ ]  Clear titles that state the insight, not just the metric name
- [ ]  Simple charts: lines for trends, bars for comparisons; no 3D, no unnecessary pie charts
- [ ]  Filters for date, channel and owner where useful
- [ ]  Last refresh time visible
- [ ]  Loads quickly

</details>

<details class="toggle"><summary>Analysis</summary>

- [ ]  Question, method, data used and limits stated up front
- [ ]  Findings first, in plain words, then evidence
- [ ]  Correlation not presented as cause
- [ ]  Recommendations with expected impact and confidence level
- [ ]  Work reproducible: queries and steps saved so someone else gets the same result

</details>

## Pre-launch checklist

- [ ]  Totals checked against the source system for at least two different periods
- [ ]  Edge cases checked: zero values, missing data, a day with no activity
- [ ]  Permissions set: each viewer sees only what they should
- [ ]  Refresh schedule and failure alert tested
- [ ]  Metric definitions published with the dashboard
- [ ]  Walkthrough recorded for the client team

<div class="callout callout-coach">

Coach's note: build the "speed to lead" and "lead to appointment" views even if no one asked for them. In most service businesses those two numbers show the biggest hidden leak. When the owner sees that half their leads wait more than a day for a call, you have just shown them where Narqix can help next.

</div>

## Reporting KPIs

| KPI | Notes |
| --- | --- |
| Reports delivered on schedule | 100 percent |
| Reconciliation difference to source | Within the agreed tolerance, usually zero for counts and money |
| Data freshness | Refresh succeeded on schedule |
| Data issues found by the client before you | Zero; you should find them first |
| Dashboard use | Who opens it and how often, where the tool shows it |
| Decisions or changes driven by analysis | Listed in the monthly review |

## Access and security rules

- Read-only access to source systems unless the Scope Sheet requires write access.
- Data warehouses, analytics properties and dashboards are owned by the client.
- Work with the minimum personal data needed. Use aggregated or anonymized data where you can.
- Never download customer-level data to personal devices or personal storage. Exports go to client-owned storage and are deleted from your device when the task ends.
- Share dashboards with named people, never with "anyone with the link" when they contain customer or financial data.
- Queries, credentials and connection details stay in the client's systems and the vault.

## Common mistakes

<details class="toggle"><summary>Open the list</summary>

- Building a dashboard with 40 charts that answers nothing.
- Metric definitions that differ between reports.
- Not reconciling to the source, then losing trust the first time a number is wrong.
- Mixing time zones, so daily numbers never match.
- Reporting averages that hide what is really happening (one big deal skews the month).
- Presenting a pattern as proof of cause.
- Manual reports that depend on you, with no documentation.

</details>

## Red flags to escalate

| Red flag | Level | What to do |
| --- | --- | --- |
| Customer personal or financial data exposed through a shared link or wrong permissions | P1 | Remove access, alert Delivery Lead within 15 minutes |
| Numbers already shared with the client turn out to be wrong | P2 | Tell the client the same day with the corrected figures and the cause |
| Tracking broken, so data for a period is missing | P2 | Fix, note the gap on the dashboard, inform client |
| Request to change definitions or hide data to make results look better | P2 | Decline, inform Delivery Lead |
| Source systems disagree and no one owns the truth | P3 | Raise in the weekly report with a recommendation |

<div class="callout callout-never">

Never do this: never adjust, round or filter numbers to tell a better story. If the data is bad news, deliver it clearly, with context and a plan.

</div>

---

*© Narqix Academy*
