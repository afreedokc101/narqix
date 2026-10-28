---
id: "3fdeadddae7181bfb863fb376194a17b"
title: "Role Guide: Data and List Team"
section: "real-estate"
page: "role-guide-data-and-list-team"
order: 37
summary: "For Narqix data specialists, list builders and CRM admins on real estate campaigns. After this page you will know how to build stacked seller lists, run contact research in generic terms, scrub every "
duration: "30 min"
---

<div class="callout callout-intro">

For Narqix data specialists, list builders and CRM admins on real estate campaigns. After this page you will know how to build stacked seller lists, run contact research in generic terms, scrub every list before outreach, and keep data clean enough that callers spend their time talking, not dialing dead numbers.

Track: Real Estate  ·  Role: Data and List Team  ·  Time to complete: 30 min

</div>

## What this role is

Every conversation a cold caller has starts with a record you built. If the list is wrong, old or unscrubbed, the best caller in the world will fail, and the client may face legal risk. The data team is the **foundation** of the whole pipeline.

## What you own

- **List building:** pulling property owner lists by distress type from data providers and public records.
- **List stacking:** finding owners who appear on two or more lists.
- **Contact research (skip tracing):** finding current phone numbers and emails for owners, through your client's approved provider.
- **Scrubbing:** removing numbers on the National Do Not Call Registry, state lists, the internal do-not-call list and known litigator lists, and identifying mobile vs. landline numbers.
- **De-duplication:** making sure one owner is not called by three people.
- **Loading and gating:** loading clean lists into the dialer and texting platform with time-zone gating and tags.
- **Feedback loop:** using disposition results to remove bad numbers and improve future lists.
- **Reporting:** list performance and KPI dashboards for the client.

## Common list types

| List | Who is on it | Why they may sell |
| --- | --- | --- |
| Absentee owner | Owner's mailing address is different from the property | Managing from far away is hard |
| Out-of-state owner | Owner lives in another state | Distance, tenants, repairs |
| High equity | Owner has a lot of equity (for example more than 50%) | Can accept an investor price and still walk away with money |
| Free and clear | No mortgage recorded | Flexible on price and terms |
| Tax delinquent | Behind on property taxes | Risk of penalties or tax sale |
| Pre-foreclosure | A foreclosure notice was recorded | Needs a solution before the sale date |
| Probate and inherited | Owner passed away; heirs or an estate hold the property | Heirs often live elsewhere and want a simple sale |
| Vacant | Property appears empty | Costs money every month, risk of damage |
| Code violations | City issued violations | Fines and repair pressure |
| Tired landlord | Long-held rental, evictions, or many units | Tenant stress |
| Expired or withdrawn listing | Was listed with an agent but did not sell | Still wants to sell |
| Evictions | Recent eviction filing | Landlord stress |
| Divorce | Recorded divorce filing | Property must be divided |
| Driving for dollars | Properties spotted in person as distressed | Visible neglect |

## List stacking: how it works

1. **Pull source lists** for the client's target markets.
2. **Define criteria once and use them every time** (for example "high equity" always means more than 50% equity).
3. **Stack:** find records that appear on two or more lists. Start with 3 to 5 combined filters. Example: absentee owner plus vacant plus tax delinquent.
4. **Pre-screen:** flag records with many owners, corporate owners, active listings or property managers. These need special handling.
5. **Rank:** owners on more lists usually go first.
6. **Tag** each record with its stack (for example "ABS-VAC-TAX") so callers and texters can tailor their opener.

<div class="callout callout-coach">

**Coach's note:** A list of 2,000 stacked owners usually beats a list of 20,000 single-list owners. More pain signals usually mean a more motivated seller. Fewer, better records save hundreds of caller hours.

</div>

## Contact research (skip tracing) in plain terms

Property records show who owns a home but rarely how to reach them. **Skip tracing** means using a data provider to find the owner's current phone numbers and emails.

- Use only the provider and method your client approves.
- Providers usually return several phone numbers ranked by likelihood. Keep the rank order: the first slot is usually the most accurate; later slots are more often wrong or disconnected.
- Dial slots 1 and 2 first.
- For a deceased owner, research the heirs or the estate's representative using public probate records, following client instructions.
- Never use contact data for anything except the client's permitted outreach. It is personal information.

## Scrubbing: the non-negotiable step

Before any list is dialed or texted, and again every time a list is re-used:

- [ ]  **National Do Not Call Registry** scrub, refreshed at least every 31 days.
- [ ]  **State do-not-call lists** where they exist (for example Texas).
- [ ]  **Internal do-not-call list** for all clients and campaigns.
- [ ]  **Known litigator list** (people who frequently file calling lawsuits).
- [ ]  **Line type check:** mobile vs. landline. Texts go to mobiles only, and only to permitted recipients.
- [ ]  **Scrub date logged** on the list and in the CRM.

<div class="callout callout-never">

**Never do this:** Never load an unscrubbed list "just to test". Never remove a number from the internal do-not-call list, even if a client asks. Never move do-not-call data between clients in a way that weakens it; an opt-out for one Narqix campaign is honored across all campaigns for that number.

</div>

## De-duplication and loading

- De-duplicate across lists and against the CRM, so one owner does not get three callers.
- Merge owners who own several properties into one contact with linked properties.
- Load with **time-zone gating** based on both the phone's area code and the property or mailing address (area codes travel with people).
- Set the calling window to the Narqix default (9 AM to 8 PM local, Monday to Saturday, no Sundays or US holidays) plus any stricter state rule.

## Data hygiene: the feedback loop

| Signal from callers | Action |
| --- | --- |
| DISC twice | Remove that number |
| WRONG | Suppress that number for that owner |
| DNC | Internal do-not-call list immediately (callers do this, you verify) |
| SOLD | Update ownership; suppress |
| New number from the owner | Add it, marked as owner-provided |
| High wrong-number rate on a list | Report to your team lead and review the source |

## KPIs that matter

**Narqix starter targets.**

| Metric | Starter target |
| --- | --- |
| Lists scrubbed before loading | 100% |
| National scrub age | 31 days or less, always |
| Duplicate owners loaded | Under 1% |
| Wrong-number plus disconnect rate per list | Track weekly; investigate any list above the client's average |
| List turnaround (request to loaded list) | Within 1 business day for standard pulls |
| Disposition feedback applied | Daily |
| Weekly list performance report | Delivered on time |

## Daily rhythm

| Block | What you do |
| --- | --- |
| Start of shift | Check in with your campaign's method, start your tracker. Check today's list requests and yesterday's disposition data. |
| Hygiene block | Apply dispositions: remove disconnected numbers, suppress wrong numbers, verify DNC entries. |
| Build block | Pull, stack, skip trace, scrub, de-duplicate. |
| Load block | Load and tag lists before the callers' shift starts. Confirm time-zone gating. |
| Reporting block | Update dashboards: dials per lead per list, contact rates, wrong-number rates. |
| End of shift | Log scrub dates, send report, check out. |

## Handoffs

| You receive from | What |
| --- | --- |
| Client or team lead | Target markets, list types, volume needed |
| Callers, SMS agents, Lead Managers | Disposition codes and notes |

| You pass to | What | When |
| --- | --- | --- |
| Cold Callers and SMS Agents | Loaded, scrubbed, tagged lists | Before their shift |
| Team lead and client | List performance report | Weekly |
| Team lead | Any scrub failure, suspected bad data source, or system sync error | Immediately |

## Quality checklist

- [ ]  Every list scrubbed against all four lists, with the date logged.
- [ ]  Mobile and landline identified; texts only to permitted mobiles.
- [ ]  Duplicates removed.
- [ ]  Time-zone gating set.
- [ ]  Records tagged by stack.
- [ ]  Yesterday's dispositions applied.

## Common mistakes (and the fix)

| Mistake | Fix |
| --- | --- |
| Re-using an old list without re-scrubbing | Re-scrub every re-used list |
| Changing criteria every week | Write the definitions down and keep them |
| Loading all phone slots at once | Dial slots 1 and 2 first |
| Ignoring wrong-number trends | Review weekly; fix or drop poor sources |
| Gating by area code only | Use both area code and property or mailing address |

## Escalation rules

- **Immediately:** a list was loaded without a scrub, internal do-not-call data looks missing or corrupted, a client asks you to remove a do-not-call entry, or data seems to have been shared outside the campaign.
- **Same day:** a list's wrong-number rate is far above normal, sync errors between dialer and CRM.

## Check yourself

1. What is list stacking, and why does it help?
2. Name the four lists every record is scrubbed against.
3. How often must the National Do Not Call scrub be refreshed?
4. Why do we gate calling times by both area code and address?
5. What do you do with a number marked DISC twice?

<details class="toggle toggle-answers"><summary>Answers</summary>

1. Finding owners who appear on two or more distress lists. More signals usually mean more motivation, so callers reach better owners.
2. National Do Not Call Registry, state lists, internal do-not-call list, known litigator list.
3. At least every 31 days, and before every re-use.
4. People keep their phone numbers when they move, so the area code may not show their real time zone.
5. Remove that number.

</details>

---

*© Narqix Academy*
