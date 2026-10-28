---
id: "3fdeadddae718122a341e81fcb61a224"
title: "Automation and AI Engineering"
section: "specialist-standards"
page: "automation-and-ai-engineering"
order: 150
summary: "For Narqix automation and AI engineers building CRM workflows, integrations, lead routing, AI agents and conversational AI. Use this page as your working checklist to ship automation to the Narqix sta"
duration: "12 min"
---

<div class="callout callout-intro">

For Narqix automation and AI engineers building CRM workflows, integrations, lead routing, AI agents and conversational AI. Use this page as your working checklist to ship automation to the Narqix standard.

Track: Specialist  ·  Role: Automation Engineer, AI Engineer  ·  Time to complete: 12 min

</div>

## The Narqix view of automation

Narqix does not sell "AI". We remove bottlenecks. Before you build, answer three questions: what manual work does this remove, what does it save per month (hours, response time, lost leads), and what happens when it fails? Humans and automation work together: automation handles volume and speed, people handle judgment and relationships.

## Definition of done

- [ ]  The workflow does exactly what the Scope Sheet describes, proven with test runs that cover normal, edge and failure cases
- [ ]  Every failure path ends in an alert to a named human or a safe stop, never silence
- [ ]  A kill switch exists, and the client knows how to use it
- [ ]  Logs show every run: trigger, input, actions, result
- [ ]  A runbook explains what it does, when it runs, how to check it, and what to do when it fails
- [ ]  Baseline and after numbers recorded (hours saved, response time, error rate)
- [ ]  The client accepted it in writing

## Quality checklist

<details class="toggle"><summary>Design</summary>

- [ ]  Process mapped on paper before building: trigger, steps, decisions, owners, handoffs
- [ ]  Broken processes fixed first. Automating a bad process makes the mess faster
- [ ]  One workflow per job, with a clear name: Client_Area_Trigger_Action_v01
- [ ]  No duplicate triggers that could fire the same action twice
- [ ]  Data fields mapped and documented between every connected system

</details>

<details class="toggle"><summary>Reliability</summary>

- [ ]  Safe to run twice: a retry does not create duplicate contacts, messages or charges
- [ ]  Retries with limits for temporary failures; no endless loops
- [ ]  Rate limits of connected systems respected
- [ ]  Time zones handled correctly for every scheduled action
- [ ]  Bulk actions tested on a small batch before the full list
- [ ]  Monitoring alert if the workflow stops running or error rate rises

</details>

<details class="toggle"><summary>AI agents and conversational AI</summary>

- [ ]  Written purpose, scope and boundaries: what it may answer, what it must hand to a human
- [ ]  Never claims to be a human. Follows the client's disclosure rules and the law where the conversation happens
- [ ]  Never invents facts, prices, availability or promises. Answers only from approved knowledge
- [ ]  One question at a time, short messages, natural tone
- [ ]  Clear handoff: when a human takes over, the AI stops talking, and the human gets the full context
- [ ]  Fallback when no human replies within the agreed window: a short honest acknowledgment and an alert
- [ ]  Test set of at least 30 real-style conversations, including hostile, confused and off-topic ones, run before every change to prompts or settings
- [ ]  Prompts and settings versioned like code
- [ ]  Usage cost per conversation estimated, with a monthly cap and alert

</details>

<details class="toggle"><summary>Messaging compliance (SMS, calls, email)</summary>

- [ ]  Consent recorded for every contact who receives marketing messages
- [ ]  Opt-out words (STOP and similar) handled instantly and permanently across every workflow
- [ ]  Quiet hours respected in the recipient's local time
- [ ]  Sender registration completed where carriers require it
- [ ]  Federal and state rules checked with the client; legal review recommended for high-risk use

</details>

## Pre-launch checklist

- [ ]  All testing done with test contacts, never with real customers
- [ ]  Client reviewed the workflow map and approved every customer-facing message
- [ ]  Backup or export of affected CRM data taken before any bulk change
- [ ]  Kill switch tested
- [ ]  Alerts go to a named person who is on duty
- [ ]  Launch in stages: 10 percent of volume or one segment first, check results, then full rollout
- [ ]  First 24 hours monitored: run logs, error counts, sample of messages sent, AI conversations read
- [ ]  Runbook and change log saved in the client's documentation

<div class="callout callout-coach">

Coach's note: read 20 real AI conversations every week, even after launch. Dashboards tell you volume. Transcripts tell you where the AI confuses people, where leads drop, and what the next fix should be. This habit is what separates a working AI setter from an expensive embarrassment.

</div>

## Reporting KPIs

| KPI | Notes |
| --- | --- |
| Successful run rate | 99 percent or more for production workflows |
| Errors and failed runs | Count, cause and fix, every week |
| Hours of manual work removed per month | Compared with the baseline you recorded |
| Speed to lead | Time from inquiry to first response, before and after |
| AI handoff rate and handoff quality | Share of conversations sent to humans, and whether they were the right ones |
| AI answer accuracy on the test set | Tracked after every change |
| Opt-out and complaint rate | Rising numbers mean the messaging needs work |
| Running cost per month | Against the agreed cap |

## Access and security rules

- Every workspace, integration platform, AI account and API key belongs to the client's business. You work under a named seat.
- Use service accounts and keys with the narrowest permissions the workflow needs. Never connect a client workflow through your personal account.
- Keys and tokens live in the vault or the platform's secret storage. Never in workflow notes, chat or documents.
- Rotate keys at offboarding and after any suspected exposure.
- Customer personal data goes only to AI services the client approved in writing for that data.
- Webhooks and endpoints are protected with secrets or signatures so outsiders cannot trigger them.

## Common mistakes

<details class="toggle"><summary>Open the list</summary>

- Testing on live contacts "just once".
- No alert when a workflow fails, so it breaks silently for weeks.
- Two workflows reacting to the same trigger and double-messaging leads.
- AI given broad freedom with no knowledge limits, then inventing prices or promises.
- Ignoring opt-outs in one workflow while respecting them in another.
- No documentation, so only you understand how it works.
- Building complex automation around a process the client has not agreed on.

</details>

## Red flags to escalate

| Red flag | Level | What to do |
| --- | --- | --- |
| Workflow sending wrong, duplicate or mass messages to customers | P1 | Hit the kill switch, alert Delivery Lead and client within 15 minutes |
| AI agent gave false information, claimed to be human or made a promise | P1 | Pause it, save the transcript, escalate |
| Opted-out contacts receiving messages | P1 | Stop sending, escalate |
| Leaked or exposed key or token | P1 | Rotate it, escalate |
| Bulk change corrupted or deleted CRM data | P1 | Stop, restore from backup with Delivery Lead approval |
| Usage costs running above the monthly cap | P2 | Pause non-critical runs, inform client |
| Client asks to message contacts with no recorded consent who are not on an approved, scrubbed cold list | P2 | Decline, inform Delivery Lead |

<div class="callout callout-never">

Never do this: never let an AI agent pretend to be a human, and never send marketing messages to people who opted out, or to contacts who neither consented nor are on the client's approved, scrubbed cold list. These are not settings to "test". They are lines Narqix does not cross.

</div>

---

*© Narqix Academy*
