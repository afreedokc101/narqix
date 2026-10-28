---
id: "3fdeadddae718158ae31f9c4e4f48580"
title: "Incident Report Template"
section: "templates"
page: "incident-report-template"
order: 272
summary: "For every Narqix team member and every Campaign Lead. After reading this page you will be able to recognise a security or data incident, send the first alert within 15 minutes, and complete the incide"
duration: "10 min"
---

<div class="callout callout-intro">

For every Narqix team member and every Campaign Lead. After reading this page you will be able to recognise a security or data incident, send the first alert within 15 minutes, and complete the incident record for the Narqix incident log.

Track: All tracks  ·  Role: Everyone, Campaign Lead  ·  Time to complete: 10 min

</div>

## What counts as an incident

An incident is anything that may have exposed client or customer data. If you are unsure, treat it as one.

- Lost or stolen device
- Clicked a suspicious link or opened a suspicious attachment
- Email, document or file sent to the wrong person
- A two-factor request or login alert you did not trigger
- Customer data pasted into the wrong place (a public channel, an AI tool, a personal note)
- Someone else saw your screen with sensitive data
- A request to change bank or payment details that you acted on before verifying

The rules are on **Data Security and Privacy** in Narqix Standards. Incidents are always at least P1 on the Escalation Ladder when data may have left the client's control.

## Your four steps

1. **Stop.** Do not try to fix it quietly. Do not delete anything.
2. **Alert** your Campaign Lead within **15 minutes**. If no reply in 10 minutes, the Operations Manager.
3. **Write down** what happened, when, and what data was involved, using the record below.
4. **Follow instructions.** Narqix decides how and when to tell the client.

## Step 2: the first alert (send within 15 minutes)

Short and fast. Details come in the full record.

```
P1 INCIDENT: (ONE-LINE SUMMARY)
What happened: (FACTS ONLY)
When: (TIME AND ZONE)
Data involved: (TYPE OF DATA AND HOW MANY RECORDS, NOT THE DATA ITSELF)
What I did: (STOPPED, DISCONNECTED, SCREENSHOT SAVED, NOTHING DELETED)
I need: guidance on next steps now
```

## Step 3: the full incident record

Complete it the same shift, with your Campaign Lead. It goes to the Narqix incident log.

```
INCIDENT RECORD · (INCIDENT ID FROM LEAD)
Reported by: (YOUR NAME)    Campaign: (CAMPAIGN)    Client: (CLIENT NAME)

TIMELINE
Happened: (DATE, TIME AND ZONE)
Discovered: (DATE, TIME AND ZONE), by (WHO)
First alert sent: (TIME AND ZONE), to (ROLE)
Lead or Operations Manager replied: (TIME AND ZONE)

WHAT HAPPENED
Type: (LOST DEVICE, PHISHING CLICK, WRONG RECIPIENT, UNEXPECTED LOGIN, DATA IN WRONG PLACE, SCREEN SEEN, PAYMENT CHANGE, OTHER)
Description: (FACTS IN ORDER, NO OPINIONS)
Systems involved: (CRM, EMAIL, SHARED DRIVE, DEVICE, OTHER)

DATA INVOLVED (describe, never copy)
Data types: (NAMES, CONTACT DETAILS, ADDRESSES, FINANCIAL DOCUMENTS, CONTRACTS, OTHER)
Number of records or people: (NUMBER, or ESTIMATE AND HOW ESTIMATED)
Who may have seen it: (UNINTENDED RECIPIENT ROLE, PUBLIC, UNKNOWN)

CONTAINMENT
Actions taken: (STOPPED SENDING, DEVICE DISCONNECTED, PASSWORD CHANGE REQUESTED, ACCESS REMOVED, OTHER)
Evidence saved: (SCREENSHOTS, MESSAGE IDS, LOCATION)
Nothing deleted: (CONFIRMED)

CAUSE (about the system, not blame)
What allowed it: (FOR EXAMPLE, SIMILAR NAMES IN AUTOFILL, NO READ-BACK BEFORE SENDING)

FOLLOW-UP (completed by Campaign Lead)
Client notified by Narqix: (YES OR NO), (DATE AND TIME), by (ROLE)
Changes agreed: (SOP, SETTING OR TRAINING CHANGE), owner (ROLE), due (DATE)
Closed: (DATE), by (ROLE)
```

<details class="toggle"><summary>Example: email sent to the wrong recipient</summary>

```
P1 INCIDENT: Signed contract emailed to the wrong address
What happened: I emailed a seller's signed purchase agreement to a person with a similar name from autofill.
When: 9:42 PM ET
Data involved: 1 contract (seller names, property address, price, signatures)
What I did: Stopped all sending. Did not reply to the wrong recipient. Screenshot saved. Nothing deleted.
I need: guidance on next steps now
```

```
INCIDENT RECORD · (INCIDENT ID FROM LEAD)
Reported by: (YOUR NAME)    Campaign: (CAMPAIGN)    Client: (CLIENT NAME)

TIMELINE
Happened: Oct 21, 2026, 9:42 PM ET
Discovered: Oct 21, 2026, 9:44 PM ET, by me (sent folder check)
First alert sent: 9:47 PM ET, to Campaign Lead
Lead or Operations Manager replied: 9:51 PM ET

WHAT HAPPENED
Type: WRONG RECIPIENT
Description: Sending the executed agreement to title. Typed the first 4 letters of the closer's name; autofill selected a different contact with a similar name. Sent without checking the address.
Systems involved: Email

DATA INVOLVED (describe, never copy)
Data types: Seller names, property address, contract price, signatures
Number of records or people: 1 contract, 2 sellers
Who may have seen it: 1 external person, not connected to the deal

CONTAINMENT
Actions taken: Stopped sending; lead requested recall and contacted the recipient through the approved process
Evidence saved: Screenshot of sent message and recipient address in the incident folder
Nothing deleted: Confirmed

CAUSE (about the system, not blame)
What allowed it: Autofill suggested a similar contact; no address read-back step before sending contracts

FOLLOW-UP (completed by Campaign Lead)
Client notified by Narqix: Yes, Oct 21, 10:15 PM ET, by Account Manager
Changes agreed: Title contacts saved as named groups; read-back of the address before sending any contract, owner Campaign Lead, due Oct 23
Closed: Oct 23, 2026, by Campaign Lead
```

</details>

<div class="callout callout-coach">

**Coach's note:** Speed is the whole game. A wrong-recipient email reported in 5 minutes can often be contained. The same email found the next morning usually cannot. Reporting fast is always treated as the right thing to do, and Narqix incident reviews are about the system, not about blame.

</div>

<div class="callout callout-never">

**Never do this:** Never copy the exposed data into the report, a chat or an email. Describe it instead. Never delete messages, files or logs. Never reply to an unintended recipient or a suspicious sender on your own. Never notify the client yourself unless your lead tells you to.

</div>

## Check yourself

1. Within how long must the first alert be sent, and to whom?
2. Your lead does not answer in 10 minutes. What do you do?
3. Do you paste the exposed customer details into the incident record? Why or why not?
4. Who decides how and when the client is told?

<details class="toggle toggle-answers"><summary>Answers</summary>

1. Within 15 minutes, to your Campaign Lead.
2. Contact the Operations Manager.
3. No. Describe the data types and number of records. Copying the data spreads the exposure.
4. Narqix, through your Campaign Lead or Account Manager.

</details>

---

*© Narqix Academy*
