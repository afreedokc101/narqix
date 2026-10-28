---
id: "3fdeadddae718195ad86c1a3b5d27f65"
title: "CRM Hygiene Cycle"
section: "back-office"
page: "crm-hygiene-cycle"
order: 121
summary: "For anyone who touches a client's CRM, and especially CRM Administrators. After reading you will be able to apply the Minimum Record standard, run the daily, weekly, monthly and quarterly hygiene cycl"
duration: "25 min"
---

<div class="callout callout-intro">

For anyone who touches a client's CRM, and especially CRM Administrators. After reading you will be able to apply the Minimum Record standard, run the daily, weekly, monthly and quarterly hygiene cycle, merge duplicates safely and handle bulk changes without risk.

Track: Back Office & Admin  ·  Role: CRM Administrator, Data Entry and Data Quality Specialist  ·  Time to complete: 25 min

</div>

## Why hygiene is a cycle, not a project

CRMs get dirty every single day: callers type fast, web forms send half-filled records, imports bring duplicates, people change numbers. A one-time cleanup is dirty again in three months. The Narqix approach is a **cycle**: small tasks every day, bigger sweeps every week and month, an audit every quarter.

## The Minimum Record

No record is saved, and no deal moves stage, without these fields:

| Field | Standard |
| --- | --- |
| Name | First and last name, or company name, in Proper Case ("Maria Lopez", not "MARIA LOPEZ") |
| Contact method | At least one working phone or email |
| Source | Where the lead came from, from the approved list |
| Owner | The person responsible for the next action |
| Stage | Current pipeline stage, from the approved list |
| Next step | What happens next, and its date |

### Format rules

| Data | Format |
| --- | --- |
| US phone | One agreed format, for example +1 405 555 0134 |
| UK and AU phone | Client's agreed format with country code |
| Email | Lower case, no spaces |
| US state | Two-letter code (TX, OK, FL) |
| Dates | One agreed format; months as words in notes |
| Company names | As the company writes it; one style for "Inc." and "LLC" |
| Tags | Approved list only |

## The cycle

### Daily (15 to 30 minutes)

- [ ]  New leads assigned to the right owner within the client's window
- [ ]  New records checked against the Minimum Record; gaps fixed or flagged
- [ ]  Overdue tasks report sent to each owner
- [ ]  Bounced emails and wrong numbers from yesterday marked (not deleted)
- [ ]  Every touch logged the same day: date, channel, outcome, next step and date

### Weekly (1 to 2 hours)

- [ ]  **Duplicate sweep:** search by email, then phone, then name plus address
- [ ]  Safe merges done (rules below); unsure pairs listed for the owner
- [ ]  Records with no next step listed and sent to owners
- [ ]  Stray tag and field values found and corrected
- [ ]  Short note on what caused this week's problems (for example "web form allows blank phone")

### Monthly (2 to 3 hours)

- [ ]  **Stale review:** records untouched for 90 days sent to owners to update or close
- [ ]  Stuck deals: deals in the same stage longer than the client's normal time, flagged
- [ ]  Lead source report checked: any source that stopped sending leads?
- [ ]  Opt-outs and do-not-contact flags checked and respected across lists
- [ ]  Hygiene numbers added to the weekly or monthly client report

### Quarterly (half a day, with approval)

- [ ]  Contacts with no engagement for 12 months proposed for an inactive list (never deleted without written approval)
- [ ]  Tag audit: unused tags proposed for archive; confusing tags proposed for merge
- [ ]  Pipeline and stage audit: do the stages still match how the client sells?
- [ ]  Field audit: unused fields proposed for removal
- [ ]  User access review: people who left still have access? Tell the client.
- [ ]  CRM map document updated

<div class="callout callout-coach">

Coach's note: always end a hygiene task with a number and a cause. "Merged 37 duplicates" is good. "Merged 37 duplicates; 29 came from the website form creating a new record on every visit; suggest switching on matching by email" is how a Narqix specialist becomes the person the client asks for advice.

</div>

## Merging duplicates safely

1. **Match on hard data:** the same email or the same phone, then confirm with a second field (address, company).
2. **Keep the survivor:** the record with the most activity history and the correct owner.
3. **Bring everything across:** notes, tasks, deals, files and history must move to the survivor.
4. **Do not merge different people** who share a phone or email (spouses, office main lines, property managers). Link them or note it instead.
5. **Log it:** in the change log, list survivor and merged record IDs.

## Bulk changes: the Safe Change routine

A bulk change is any action that affects more than 50 records, or any delete, import, pipeline change or automation switch. It always needs written client approval.

1. **Write the request back:** "Confirming: change owner from (OLD OWNER) to (NEW OWNER) on 212 open leads in the Buyer pipeline. Correct?"
2. **Back up:** export the affected records with all fields to the client's backup folder, named by File Naming rules.
3. **Test:** run the change on 5 records. Check every field.
4. **Run:** apply to the rest.
5. **Verify:** count before, count after, spot check 10 records.
6. **Log:** date, what changed, how many records, who approved, where the backup is.

<div class="callout callout-never">

Never do this: never delete records, bulk edit more than 50 records, change pipelines or stages, or switch automations on or off without written approval and a backup. These actions can break reports, trigger messages to thousands of people, or lose years of history in seconds.

</div>

<div class="callout callout-never">

Never do this: never remove or ignore an opt-out or do-not-contact flag, even if a team member asks. Contact rules protect the client from legal risk.

</div>

## Measuring CRM health

| Measure | Target |
| --- | --- |
| Active records missing a Minimum Record field | Under 2% |
| New duplicates per week | Falling month on month |
| Open records with no next step | Under 5% |
| Tags in use that are not on the approved list | Zero |
| Bulk changes without approval and backup | Zero |

## Check yourself

1. List the six fields of the Minimum Record.
2. Two records share an office main phone number but have different names and emails. What do you do?
3. Walk through the six steps of the Safe Change routine.
4. What is checked in the monthly stale review?
5. Why does a hygiene report include the cause of problems, not just the count?

*© Narqix Academy*
