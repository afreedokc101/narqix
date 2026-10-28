---
id: "3fdeadddae718158ae29f8c4a42d2d36"
title: "Daily Processes by File Status"
section: "transaction-coordination"
page: "daily-processes-by-file-status"
order: 54
summary: "For Transaction Coordinators during every shift. After this page you will be able to open any file, read its status, and know exactly what to do today, what to watch for and what moves it forward."
duration: "35 min"
---

<div class="callout callout-intro">

For Transaction Coordinators during every shift. After this page you will be able to open any file, read its status, and know exactly what to do today, what to watch for and what moves it forward.

Track: Transaction Coordination  ·  Role: Transaction Coordinator  ·  Time to complete: 35 min

</div>

## How this playbook works

Every active file has **one status code** (the stage that is blocking closing right now) and may have **flags** (things running in the background). Status codes and flags are defined on page 11. This page tells you, for each status:

- **Goal:** what this stage must achieve
- **Every shift:** what you do each time you open the file
- **Timers:** if this happens, do that
- **Move it when:** the exit test for the next status

Keep this page open during your shift. When in doubt, the file's status tells you what to do.

## Start of shift: the 45 minute triage

Do this before any other work.

1. **Sweep messages (15 minutes).** Read every new email, text, voicemail and CRM mention. Anything about money, cancellation, wiring, a deadline or a legal threat goes to the top. Red items are escalated now (page 01).
2. **Sort the board (10 minutes).** In the tracker, sort active files by next deadline. Mark each file's heat:
    - **Green:** on track, nothing due in 3 business days
    - **Yellow:** something due in the next 2 business days, or one party late
    - **Red:** money at risk, closing at risk within 72 hours, or a Red event
3. **Plan the day (10 minutes).** Red files first, then closings in the next 3 days, then Yellow, then Green. Write your top 5 actions for the shift.
4. **Fire the first calls (10 minutes).** The hardest call on your list goes first.

<div class="callout callout-coach">

Write the day's plan where your team lead can see it. When something urgent lands mid shift, you will know exactly which planned task moves to tomorrow, and so will they.

</div>

---

## Status playbook

<details class="toggle"><summary>NEW: contract signed, intake in progress</summary>

**Goal:** a complete, valid file with every deadline logged, within 2 business hours.

**Every shift**

- Run the intake checklist (page 02, Stage 1).
- Confirm state disclosures and any seller cancellation window. Set the STATE-WINDOW flag if a window is open.
- Request anything missing from acquisitions in one message.

**Timers**

- Missing signature or disclosure: Red escalation, do not open title until the client decides.
- Seller names do not match the public record: Yellow, ask acquisitions and the client for an addendum.

**Move it when:** intake complete and the opening email is sent. Status TITLE-OPEN.

</details>

<details class="toggle"><summary>TITLE-OPEN: file sent to title, waiting for confirmation</summary>

**Goal:** written confirmation from title that the file is opened and searches are ordered.

**Every shift**

- Check for title's confirmation.
- Make the seller welcome call if not done (Script 02, first call).
- Send the seller a short written follow-up with the title company's name.
- Confirm property access and schedule any inspection or walkthrough within 24 hours.

**Timers**

- No reply in 4 business hours: call the closer.
- No reply by end of next business day: Yellow escalation; call the backup closer.

**Move it when:** title confirms receipt. Status EMD-PENDING if a deposit is still owed, otherwise SEARCH.

</details>

<details class="toggle"><summary>EMD-PENDING: a deposit is owed and not yet receipted</summary>

**Goal:** receipt from title before the contract deadline.

**Every shift**

- Check the deposit tracker for this file.
- Day before the deadline: confirm with the payer.
- Deadline day morning: ask title to confirm receipt.

**Timers**

- Deadline day and no receipt by midday US time: Red escalation.
- Receipt received: save it, call the seller, update the tracker.

**Move it when:** receipt saved. Status SEARCH (or BUYER-LOCKED if this was the end buyer's deposit).

</details>

<details class="toggle"><summary>SEARCH: title search and lien searches in progress</summary>

**Goal:** the commitment and lien searches are received, read and summarized for the client.

**Every shift**

- Check whether the commitment or municipal search arrived.
- Chase the seller information sheet and payoff authorization if title still needs them (every 2 business days).
- Seller weekly update if due.

**Timers**

- Day 5 with no commitment: ask title for the expected date.
- Day 10 with no commitment: Yellow escalation.
- Commitment arrives: read it the same day, build the curative list, send the client the title summary.

**Move it when:** title summary is sent. Status CURATIVE if anything must be fixed; otherwise MARKETING (assignment, double close, JV) or CTC preparation.

</details>

<details class="toggle"><summary>CURATIVE: title requirements are being fixed</summary>

**Goal:** every requirement satisfied or confirmed payable at closing, with title's written sign-off.

**Every shift**

- Review each open item: who owns it, what is next, is it on time?
- Push the item that is most at risk. Call the person who owns it.
- Collect documents from the seller and send them to title the same day.

**Timers**

- Twice a week: status email to title listing every open item by number.
- Any item will not clear by C minus 7: Yellow escalation with a recommendation (extend, reprice or proceed if title allows).
- New item appears late: Yellow escalation the same day.

**Move it when:** title confirms in writing that all requirements are satisfied or will be satisfied at closing.

</details>

<details class="toggle"><summary>MARKETING: dispositions is finding an end buyer</summary>

Applies to assignment, double close and JV files. It can run at the same time as SEARCH or CURATIVE. When it does, the file keeps the earlier status and carries the BUYER-NEEDED flag.

**Goal:** a qualified end buyer signed with their deposit at title, at least 7 business days before closing.

**Every shift**

- Ask dispositions for status: showings, offers, expected lock date.
- Arrange access for buyer walkthroughs; confirm with the access party.
- Share any title issue that affects marketing (code violations, HOA rules, open permits).
- Watch the inspection period end date. The client must decide before it ends whether to proceed without a buyer.

**Timers**

- 2 business days before the inspection period ends with no buyer: ask the client for a written decision.
- C minus 10 with no buyer: Yellow escalation; discuss extension or the client buying.

**Move it when:** buyer documents (assignment or B to C contract, entity documents, proof of funds) and the buyer's deposit are with title. Status BUYER-LOCKED.

</details>

<details class="toggle"><summary>BUYER-LOCKED: end buyer under contract, deposit received</summary>

**Goal:** the buyer's side is complete and ready for closing.

**Every shift**

- Confirm title has the buyer's entity documents and has been in contact with the buyer or their lender.
- Confirm the buyer's funds plan: cash wire date, or lender and closing date.
- Buyer update at least every 3 business days (Script 03).

**Timers**

- Buyer mentions a loan when they were cash: Yellow escalation (page 10).
- Buyer asks to change price or terms: Yellow escalation; send to dispositions and the client.

**Move it when:** curative is complete and title confirms clear to close. Status CTC.

</details>

<details class="toggle"><summary>CTC: clear to close</summary>

**Goal:** everyone knows the date, time and method of signing, and all funds are planned.

**Every shift**

- Confirm signing method for each party: office, mobile notary, mail away or remote online notarization.
- Arrange mail away packages now if needed (3 to 5 business days).
- Send the client's wire instructions through the client's secure method; confirm title verified them by phone with the client.
- Request the preliminary settlement statement for C minus 5.
- Seller update: explain what closing day looks like.

**Timers**

- C minus 5 and no preliminary statement: call title.

**Move it when:** preliminary statement received. Status SS-REVIEW.

</details>

<details class="toggle"><summary>SS-REVIEW: settlement statement under review</summary>

**Goal:** a final statement approved in writing by the client, with the seller understanding their side.

**Every shift**

- Review line by line (page 06) the day it arrives.
- Send corrections in one numbered email.
- Check each revision.
- Get the client's written approval; walk the seller through their side by phone.

**Timers**

- C minus 2 and corrections still open: Red escalation.
- Fee missing or wrong: Red escalation.

**Move it when:** final statement approved. Status SIGNING.

</details>

<details class="toggle"><summary>SIGNING: signing scheduled or in progress</summary>

**Goal:** every party signs correctly and title confirms the package is complete.

**Every shift**

- 48 hours before: confirmation email to all parties (Script 04).
- Day before: confirm the seller's appointment and ID; confirm all required signers.
- Day of: morning call to the seller; check with title after each signing.

**Timers**

- Seller unreachable on signing day: Red escalation (page 10).
- Mail away package not back by C minus 1: Red escalation; ask title for tracking.

**Move it when:** title confirms all signatures received. Status FUNDING.

</details>

<details class="toggle"><summary>FUNDING: signed, waiting for funds and disbursement</summary>

**Goal:** funds received, disbursed and the client's fee confirmed.

**Every shift**

- Confirm buyer or lender funds received by title.
- Double close: confirm both closings funded in the right order.
- Ask for the disbursement confirmation and fee wire reference.
- Ask the client to confirm the fee arrived, and match the amount to the statement.
- Call the seller to confirm their proceeds were sent.

**Timers**

- Buyer funds not at title by the agreed time: Red escalation (page 10).
- Fee received does not match: Red escalation.

**Move it when:** client confirms receipt of the exact expected amount. Status POST.

</details>

<details class="toggle"><summary>POST: closed and funded, wrap-up open</summary>

**Goal:** a complete, archived file and clean handoffs within 3 business days.

**Every shift**

- Upload the final statement and closing package.
- Handoff to the project manager or property manager (client purchases).
- Ask the field team to collect signs and lockboxes and handle utilities; follow up in 2 business days.
- Request the recorded deed and set a reminder to check for it weekly.

**Move it when:** everything above is done (the recorded deed can follow). Status CLOSED.

</details>

<details class="toggle"><summary>HOLD: paused by agreement</summary>

Used for long curative work (probate, heirs, liens) or a signed extension.

**Goal:** the deal stays alive and organized while time passes.

**Every shift**

- Check the hold reason and its next date.
- Seller touch at least weekly, even if the only news is "still waiting on the court."
- Title touch at least weekly.
- Client update weekly in the pipeline report.

**Timers**

- Extension end date approaching with work still open: 5 business days before, ask the client whether to extend again.

**Move it when:** the blocker clears. Return to the status it came from.

</details>

<details class="toggle"><summary>CANCEL-PENDING: contract ending, paperwork not complete</summary>

**Goal:** a clean, documented ending: notice delivered, release signed, deposit handled, any memorandum released.

**Every shift**

- Track signatures on the cancellation notice and release.
- Confirm with title when the deposit will be sent and to whom.
- If a memorandum was recorded, track the release of memorandum.

**Move it when:** release fully signed and title confirms the deposit is handled. Status DEAD with a reason code.

</details>

---

## Deal type overlays: the week by week plan

These overlays sit on top of the status playbook. They show what a well run file looks like by week.

<details class="toggle"><summary>Wholesale assignment (21 to 30 days)</summary>

| Week | Must happen |
| --- | --- |
| Week 1 | Intake, title opened, client deposit receipted, seller welcome call, access confirmed, inspection or walkthroughs scheduled, payoff authorization sent, dispositions briefed |
| Week 2 | Commitment and lien search read, curative list built, end buyer locked with deposit, assignment and buyer entity documents at title, seller weekly update with the title company's estimated figures |
| Week 3 | Curative cleared, CTC confirmed, signing methods set, preliminary statement reviewed, fee line checked |
| Closing week | Final statement approved, 48 hour confirmations, signing, funding, fee confirmed, post-closing done |

</details>

<details class="toggle"><summary>Double close</summary>

Same as assignment, plus:

- Week 1: confirm title's policy on funding closing 1 and arrange transactional funding if used.
- Week 2: B to C contract and buyer deposit at title; funding lender has both contracts.
- Week 3: two preliminary statements; funding lender's requirements met at least 3 business days before closing.
- Closing day: confirm closing 1 funds before closing 2 disburses.

</details>

<details class="toggle"><summary>JV deal</summary>

Same as assignment, plus:

- Day 0: JV agreement signed and uploaded, JV partner's contact and entity documents collected, title told a JV partner is involved.
- Statement review: each partner's share matches the JV agreement.
- Copy the JV partner on updates only as the client approves.

</details>

<details class="toggle"><summary>Retail Partnership Option (30 to 60 days)</summary>

| Week | Must happen |
| --- | --- |
| Week 1 | Intake; buyer's pre-approval or proof of funds on file (ask the listing agent if missing); one introduction email to the buyer's agent, title and buyer's lender asking each to confirm receipt within 24 hours; listing agent copied on every email from now on; entity documents to title in a separate email; tenant move out confirmed if occupied |
| Week 2 | Inspections scheduled and reports received; title has all seller documents; seller's lender asked for a payoff to the closing date; buyer's lender asked for status; any addenda, counteroffers or extensions signed; seller given title's estimated figures |
| Week 3 | Appraisal ordered and scheduled (ask the listing agent; if no answer in 24 hours, ask the lender); all signed documents in the file (repair agreements, extensions, warranties); agreed repairs underway with a completion date |
| Week 4 | Repairs confirmed complete with invoices and photos; final walkthrough and any appraisal re-inspection scheduled and passed; statement received at least 3 business days before closing and approved by the seller; 48 hour all-party confirmation sent |
| After closing | Closing package uploaded; status CLOSED; field team asked to remove signs and lockboxes and handle utilities; follow-up set for 2 business days |

</details>

<details class="toggle"><summary>Subject-to</summary>

Same as assignment for title and deposits, plus:

- Week 1: confirm title will close the structure; collect the latest mortgage statement and loan number; seller signs the third-party authorization.
- Week 2: reinstatement figure if the loan is behind; insurance change plan agreed with the client.
- Week 3: every disclosure the client's documents require is signed; title confirms the exact documents for closing.
- After closing: hand off loan servicing details and payment setup to the client's team.

</details>

<details class="toggle"><summary>Client purchase (fix and flip or rental)</summary>

| Week | Must happen |
| --- | --- |
| Week 1 | Intake; confirm the lender has the contract and funds are requested; introduction email to title and lender with the contract, asking both to confirm today; entity documents to title separately; seller welcome call; inspection scheduled within 24 hours with access instructions |
| Week 2 | Inspection report uploaded and team notified; title has all documents from both sides; tenant move out confirmed if occupied; seller's payoff requested; any addenda or extensions signed; title has the closing date booked; seller given title's estimated figures |
| Week 3 | Lender has title's wiring instructions verified and confirms funding; statement received at least 3 business days before closing and approved by both sides; date, time and signing method confirmed; insurance binder at title |
| After closing | Closing package uploaded; file handed to the project manager; weekly check-in set (Mondays work well) to track the renovation and the planned list date; when it goes under contract for resale, a new file opens |

</details>

## End of shift

- [ ]  Every active file has a dated note for today (format on page 11).
- [ ]  Every file's status and heat are current.
- [ ]  Tomorrow's top 5 actions are written.
- [ ]  End of shift summary sent to the client and team lead: closings in the next 3 business days, Red and Yellow files, wins today.

## Check yourself

1. What are the four steps of the start of shift triage?
2. A file is in SEARCH and dispositions has not found a buyer. What is its status and what flag does it carry?
3. What is the exit test for SS-REVIEW?
4. In a Retail Partnership file, who do you copy on every email?
5. A file on HOLD for probate has had no news for a week. What do you still do this week?

*© Narqix Academy*
