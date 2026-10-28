---
id: "3fdeadddae7181959907d937c52607f6"
title: "Tracker and CRM Standards"
section: "transaction-coordination"
page: "tracker-and-crm-standards"
order: 56
summary: "For Transaction Coordinators and team leads. After this page you will be able to name files, write notes, set status codes and send reports in the exact Narqix format, so anyone can pick up any file a"
duration: "20 min"
---

<div class="callout callout-intro">

For Transaction Coordinators and team leads. After this page you will be able to name files, write notes, set status codes and send reports in the exact Narqix format, so anyone can pick up any file and understand it in two minutes.

Track: Transaction Coordination  ·  Role: Transaction Coordinator  ·  Time to complete: 20 min

</div>

## Why standards matter

You will be sick one day. You will go on leave. A new client will audit a file from three months ago. In every one of those moments, the only thing that matters is what is written down and where it is stored. A file that follows these standards can be run by any Narqix TC. A file that does not is a risk to the client.

Every client uses a CRM, a tracker (often a shared spreadsheet or a board inside the CRM) and a shared drive. Your client's setup may name things differently. Map these standards onto it, and agree any differences with your team lead in writing.

## Folder structure

One folder per property in the shared drive:

```
(PROPERTY ADDRESS) - (CITY) (STATE)
  01 Contract and Addenda
  02 Disclosures
  03 Title and Lien Searches
  04 Deposits and Receipts
  05 Buyer and Assignment
  06 Inspections and Photos
  07 Settlement Statements
  08 Closing Package
  09 Correspondence Exports
```

## File naming

**Pattern:** date of the document, then document type, then short address, then version or status.

```
YYYY-MM-DD_DocType_StreetNumber-StreetName_Status.pdf
```

| Example | Meaning |
| --- | --- |
| 2026-10-02_PSA_1450-Maple-Ave_EXECUTED.pdf | Fully signed purchase agreement |
| 2026-10-06_Addendum-01_1450-Maple-Ave_EXECUTED.pdf | First addendum, fully signed |
| 2026-10-07_EMD-Receipt_1450-Maple-Ave.pdf | Deposit receipt from title |
| 2026-10-09_Assignment_1450-Maple-Ave_EXECUTED.pdf | Signed assignment |
| 2026-10-10_Title-Commitment_1450-Maple-Ave.pdf | Title commitment |
| 2026-10-21_SS-Prelim_1450-Maple-Ave_v1.pdf | First preliminary settlement statement |
| 2026-10-23_SS-Final_1450-Maple-Ave_APPROVED.pdf | Final statement approved by the client |
| 2026-10-24_Closing-Package_1450-Maple-Ave.pdf | Signed closing package from title |

**Rules:** no spaces, no special characters except hyphens and underscores, number addenda in order (01, 02, 03), and use EXECUTED only when every party has signed.

**Approved document type words:** PSA, Addendum, Counter-Seller, Counter-Buyer, Extension, Cancellation, Release, Assignment, BtoC-Contract, JV-Agreement, Disclosure, EMD-Receipt, Title-Commitment, Lien-Search, Payoff, Inspection, Appraisal, SS-Prelim, SS-Final, Closing-Package, Deed-Recorded, Entity-Docs, POA, Estate-Docs, Trust-Docs.

## Status codes

Every active file has exactly one status: the stage that is blocking closing right now.

| Code | Meaning | Exit test |
| --- | --- | --- |
| NEW | Contract signed, intake in progress | Intake complete and opening email sent |
| TITLE-OPEN | Sent to title, waiting for confirmation | Title confirms receipt |
| EMD-PENDING | A deposit is owed and not receipted | Receipt saved |
| SEARCH | Title and lien searches in progress | Title summary sent to the client |
| CURATIVE | Title requirements being fixed | Title signs off all requirements |
| MARKETING | Dispositions finding an end buyer | Buyer documents and deposit at title |
| BUYER-LOCKED | Buyer under contract, deposit received | Title confirms clear to close |
| CTC | Clear to close | Preliminary statement received |
| SS-REVIEW | Settlement statement under review | Final statement approved in writing |
| SIGNING | Signing scheduled or in progress | Title confirms all signatures |
| FUNDING | Waiting for funds and disbursement | Client confirms the exact fee received |
| POST | Closed, wrap-up open | Package archived, handoffs done |
| CLOSED | Complete | None |
| HOLD | Paused by agreement (extension, probate) | Blocker clears |
| CANCEL-PENDING | Contract ending, paperwork open | Release signed, deposit handled |
| DEAD | Ended | Reason code recorded |

### Flags

Flags show background items that run alongside the status. A file can carry several.

| Flag | Meaning |
| --- | --- |
| STATE-WINDOW | Seller's legal cancellation window is still open |
| INSP-OPEN | Inspection or due diligence period still running |
| BUYER-NEEDED | No end buyer locked yet |
| DEPOSIT-DUE | A deposit deadline is coming |
| MEMO-RECORDED | A memorandum is on record and must be released if the deal ends |
| EXTENDED | The closing date has been extended at least once |
| JV | A joint venture partner is involved |

### Heat

| Heat | Meaning |
| --- | --- |
| Green | On track, nothing due in 3 business days |
| Yellow | Something due in 2 business days, or a party is late |
| Red | Money at risk, closing at risk within 72 hours, or a Red event |

### Dead reason codes

| Code | Meaning |
| --- | --- |
| SELLER-CANCEL | Seller cancelled or used a legal cancellation right |
| INSPECTION | Client cancelled within the inspection period |
| NO-BUYER | No end buyer found in time |
| BUYER-FAIL | End buyer did not perform |
| TITLE | Title problem could not be cured in time |
| PROBATE | Estate or heirship could not be resolved |
| FINANCING | Buyer's or client's financing failed |
| PRICE | Payoffs or liens exceeded the deal's numbers |
| OTHER | Explain in the note |

## Tracker columns

The tracker is the one-line view of every file. Required columns:

| Column | Example |
| --- | --- |
| Property | (PROPERTY ADDRESS) |
| Deal type | Assignment |
| Status | CURATIVE |
| Flags | BUYER-NEEDED, INSP-OPEN |
| Heat | Yellow |
| Contract date | (CONTRACT DATE) |
| Closing date | (CLOSING DATE) |
| Inspection period ends | (INSPECTION PERIOD END) |
| Contract price | (CONTRACT PRICE) |
| Expected fee or spread | (EXPECTED FEE) |
| Client deposit and receipt | (DEPOSIT AMOUNT), received |
| Buyer deposit and receipt | Not yet due |
| Title company and closer | (TITLE COMPANY), (CLOSER NAME) |
| Next action | Death certificate to title |
| Next action owner | Seller |
| Next action due | (DUE DATE) |
| Last touch: seller, title, buyer | Dates |

## CRM note format

Every active file gets a dated note every business day it is active. The note answers five questions: what happened, what we are waiting for, what is next, who owns it, and how risky it is.

```
(DATE) · Status: (CODE) · Heat: (Green/Yellow/Red)
Done: (what happened today, with times for calls)
Waiting on: (who, what, since when)
Next: (action) by (date), owner (name or role)
Risk: (none, or one line)
```

### Good and bad notes

<details class="toggle"><summary>Bad note</summary>

"Followed up with title. Waiting."

Why it fails: which title person, about what, by what method, waiting on whom, until when?

</details>

<details class="toggle"><summary>Good note</summary>

```
2026-10-14 · Status: CURATIVE · Heat: Yellow
Done: Called closer 10:20 a.m. ET. Water lien 312.00 confirmed, will be paid at closing. Death certificate still outstanding.
Waiting on: Seller to order certified death certificate from county (requested 10/10).
Next: Call seller 10/15 to confirm order placed, owner TC.
Risk: If not ordered by 10/17, closing on 10/28 at risk. Client informed.
```

</details>

### Call notes

For any important call (seller worries, cancellation talk, price questions), add the speaker's key words in quotation marks. Exact words matter if there is ever a dispute.

## Escalation message format

Use this every time you escalate, in the client's team channel or by email.

```
ESCALATION (RED or YELLOW): (PROPERTY ADDRESS)
What happened: (one or two sentences, facts only)
When: (date and time, with time zone)
Risk: (deposit / fee / closing date / legal / other)
Options: (1) ... (2) ... (3) ...
My recommendation: (one option and why)
Decision needed by: (date and time)
```

## End of shift summary

```
TC SHIFT SUMMARY: (DATE)
Closings next 3 business days: (address, date, status)
Red files: (address, one line)
Yellow files: (address, one line)
Wins today: (deposits received, buyers locked, items cleared, closings funded)
Tomorrow's first actions: (top 3)
```

## Weekly pipeline report

Sent every week on the client's chosen day, to the client and team lead. It shows the whole pipeline on one page.

### Template

**Header**

TC weekly pipeline report for (CLIENT NAME), week ending (WEEK END DATE), prepared by (YOUR NAME).

**1. Headline numbers**

| Measure | This week | Last week |
| --- | --- | --- |
| Active files |  |  |
| Closed and funded this week |  |  |
| Fees and spreads received this week (USD) |  |  |
| Expected fees, next 30 days (USD) |  |  |
| New contracts received |  |  |
| Files died this week |  |  |
| Files on original closing date |  |  |

**2. Closing in the next 14 days**

| Property | Deal type | Closing date | Status | Heat | Expected fee | Open items |
| --- | --- | --- | --- | --- | --- | --- |
| (PROPERTY ADDRESS) |  |  |  |  |  |  |

**3. Red and Yellow files**

| Property | Issue | Risk | Recommendation | Decision needed by |
| --- | --- | --- | --- | --- |
| (PROPERTY ADDRESS) |  |  |  |  |

**4. Rest of the pipeline**

| Property | Status | Next deadline | Next action |
| --- | --- | --- | --- |
| (PROPERTY ADDRESS) |  |  |  |

**5. Closed and dead this week**

| Property | Result | Fee received or dead reason |
| --- | --- | --- |
| (PROPERTY ADDRESS) |  |  |

**6. Lessons and process suggestions**

Two or three bullets. Example: "Two files this month waited 4 days for death certificates. Suggest acquisitions asks about deceased owners on the first call."

<div class="callout callout-coach">

Lead the weekly report with what the client must decide. A busy investor reads the first five lines. Put the Red files and the decisions there, and keep the good news short.

</div>

<div class="callout callout-never">

Never put Social Security numbers, bank account numbers, full dates of birth or copies of IDs in CRM notes, the tracker or reports. That information stays with title, in title's secure systems.

</div>

## Check yourself

1. Name the document "first addendum, fully signed" for a property at 1450 Maple Ave dated 6 October 2026.
2. What is the difference between a status and a flag?
3. Rewrite this note in the Narqix format: "Talked to seller, all good."
4. What are the seven lines of an escalation message?
5. Which section of the weekly report should come first, and why?

*© Narqix Academy*
