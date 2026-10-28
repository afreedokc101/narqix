---
id: "3fdeadddae718122affae0b8dafeaca3"
title: "Data Entry Accuracy: The Double Entry Comparison Method"
section: "back-office"
page: "data-entry-accuracy-the-double-entry-comparison-method"
order: 120
summary: "For every specialist who enters or moves data. After reading you will be able to set up a data task, enter in checked batches, run the Double Entry Comparison method, use control totals, and report a "
duration: "30 min"
---

<div class="callout callout-intro">

For every specialist who enters or moves data. After reading you will be able to set up a data task, enter in checked batches, run the Double Entry Comparison method, use control totals, and report a measured accuracy rate.

Track: Back Office & Admin  ·  Role: Data Entry and Data Quality Specialist, Bookkeeping Support Assistant, CRM Administrator  ·  Time to complete: 30 min

</div>

## Why "I checked it" is not enough

Research on data entry has shown that simply reading your work back (visual checking) misses many errors. In those studies, visual checking was not much better than no check at all. Entering the data twice and comparing the two versions produced by far the fewest errors.

The reason is simple: when you read your own work, your brain sees what it expects to see. A comparison does not have expectations. It finds every difference.

**At Narqix, accuracy is something you prove, not something you feel.**

## Accuracy targets

| Data type | Target | Required check |
| --- | --- | --- |
| Money (amounts, totals, account and invoice numbers) | 100% | Double Entry Comparison, plus a control total |
| Legal and ID data (licence numbers, parcel IDs, dates on contracts) | 100% | Double Entry Comparison |
| Contact data (names, phones, emails, addresses) | 99.5% of fields | Format checks on every batch, plus a 10% sample compared to source |
| Status, tags, categories | 99% | Dropdown values only, plus a count of each value to spot strays |
| Free text notes | Meaning kept, names and numbers exact | Read back of names and numbers against source |

**Field accuracy** = correct fields divided by fields checked. 1,000 fields with 5 errors is 99.5%.

## Step 1: Set up the task (before typing anything)

Write this at the top of the task in your tracker:

> **Source:** (WHERE THE DATA COMES FROM, with link)
**Destination:** (SYSTEM AND LOCATION)
**Field map:** source field to destination field, one line each
**Formats:** dates as (FORMAT), phones as (FORMAT), states as two-letter codes
**Done means:** all records entered, checks passed, held list sent
**Record count in source:** (NUMBER)
> 

If there are more than about 50 records, ask: can this be imported instead of typed? Raise it with your lead. Saving the client 10 hours with an import is exactly the kind of value Narqix sells.

## Step 2: Enter in batches

Work in batches of **25 to 50 records**. After each batch, stop and run the batch checks. Never carry an error into the next batch.

**Batch checks**

- [ ]  Record count matches the source for this batch
- [ ]  Control total for any money column matches the source total
- [ ]  Emails contain one "@" and a domain
- [ ]  US phone numbers have 10 digits (UK and AU numbers follow the client's format)
- [ ]  ZIP codes and IDs are stored as text, so leading zeros survive (02134 stays 02134)
- [ ]  One date format across the column
- [ ]  No extra spaces before or after values
- [ ]  Status and tag columns contain only approved values

## Step 3: The Double Entry Comparison method

Use this for all money, legal and ID data, and for any batch the client marks as critical.

1. **Pass A.** Enter the batch from the source into column set A (or sheet A).
2. **Pass B.** The same data is entered again into column set B, without looking at Pass A. Best: a second specialist does Pass B. If you are alone, do Pass B in a later session (after a break, ideally the next day) and hide Pass A while you work.
3. **Compare.** Add a check column for each field that flags any difference. In most spreadsheets a formula like =IF(A2=B2,"OK","CHECK") does the job. Then filter for CHECK.
4. **Resolve against the source.** For every CHECK, open the original source and correct whichever pass was wrong. Never decide by "which looks right".
5. **Record.** Note how many mismatches you found and fixed. This number is evidence of your quality, not a sign of failure.
6. **Load.** Only the resolved, matching data goes into the destination system.

<div class="callout callout-coach">

Coach's note: double entry feels slow the first week. It is not. A batch of 40 invoices takes about 30% more time to enter twice, but rework after a wrong payment can take days and can cost the client real money. Clients who see a double entry log stop rechecking your work, and that is when they start giving you more of it.

</div>

## Step 4: Control totals

A control total is a sum you calculate from the source and from your entries. They must match exactly.

- **Money:** sum of amounts.
- **Counts:** number of records, number of line items.
- **Hash totals (for IDs):** for long number columns such as invoice numbers, add them up even though the sum means nothing. If one digit is wrong, the sum changes.

If a money difference divides exactly by 9, look for two swapped digits first (for example 4,560 entered as 4,650; the difference of 90 divides by 9).

## Step 5: Hold, never guess

When you cannot be sure (blurry scan, missing digit, two sources disagree), move the record to a **Held** tab with:

| Record | Field | Problem | What you need |
| --- | --- | --- | --- |
| Invoice from (SUPPLIER NAME) | Amount | Last digit unreadable in scan | Clear copy or confirmation of amount |

Send all held items in one batched message to the client at mid shift.

## Step 6: Report your numbers

Your end of day report for data work includes:

> Entered 240 records in 6 batches. Double entry on 2 money batches (80 invoices): 7 mismatches found and fixed against source; control totals match (31,442.18). Held: 3 records (reasons in Held tab). Sample check on contact batches: 2 errors in 480 fields, fixed (99.6%).
> 

<div class="callout callout-never">

Never do this: never copy data from a copy. Always enter from the original source. Every copy step is a chance for an error to multiply.

</div>

<div class="callout callout-never">

Never do this: never enter or store full payment card numbers, full bank account numbers in notes, or government ID numbers in any place the client has not approved for them. If a source document contains data you should not see, stop and tell your lead.

</div>

## Common errors and how the checks catch them

| Error | Example | Caught by |
| --- | --- | --- |
| Transposition | 1,284 typed as 1,248 | Double entry, control total (difference 36 divides by 9) |
| Leading zero lost | 07030 becomes 7030 | Text format check |
| Date confusion | 03/04/2026 read as 3 April instead of March 4 | Agreed format, months as words when unsure |
| Wrong row | Amount entered on the next supplier's line | Double entry |
| Stray value | Status "Actve" | Value count check |
| Extra space | "Smith " and "Smith" seen as different | Space check |

## Check yourself

1. Why is visual checking not enough for money data?
2. Describe the six steps of the Double Entry Comparison method.
3. Your entered total is 12,730.00 and the source total is 12,370.00. What kind of error is most likely?
4. When you work alone, how do you do Pass B properly?
5. What goes in a Held tab entry?

*© Narqix Academy*
