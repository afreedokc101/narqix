---
id: "3fdeadddae7181b6849be021fa4e131c"
title: "Reply: Change of Email, Address or Account Details (Verification First)"
section: "scripts"
page: "reply-change-of-email-address-or-account-details-verification-first"
order: 186
summary: "Purpose: make account or order detail changes safely, after verifying the customer."
scriptTrack: "customer-support"
scriptId: "NQX-33"
role: "CSR, Support Agent"
stage: "Email"
---

<div class="callout callout-intro">

**Purpose:** make account or order detail changes safely, after verifying the customer.

**Use it when:** a customer asks to change their account email, phone, name, delivery address or other personal details.

**Goal:** the change is made for the verified owner only, and confirmed in writing.

**Version:** v1.0

</div>

## Before you send

- [ ]  Client's verification method known (for example: reply from the account email, a code sent to the phone on file, or matching order details)
- [ ]  For delivery address changes: has the order shipped? Can it still be changed?
- [ ]  Request checked for fraud signs: urgency, a new email plus a new address plus a large order, a mismatch with history

## The flow

### 1. Acknowledge and explain the check

> **You:** Hi (CUSTOMER FIRST NAME),
Happy to update that for you. To keep your account safe, I need to confirm it's you first.
> 

*Why it works: explains why, so verification feels like protection, not suspicion.*

### 2. The verification step (use the client's method)

> **You:** Could you reply with (VERIFICATION DETAILS, for example "your order number and the postcode on your last order")?
(Or:) I've sent a 6-digit code to the phone number ending in (LAST TWO DIGITS). Please reply with the code.
> 

### 3. Make the change and confirm

> **You:** Thanks, you're verified. I've updated your (DETAIL) to (NEW VALUE). (For email changes:) You'll get a confirmation at both your old and new addresses.
Best,
(YOUR NAME)
> 

<details class="toggle"><summary>Delivery address change before shipping</summary>

> **You:** Done: order (ORDER NUMBER) will now go to (NEW ADDRESS). It's due to ship on (DATE), and you'll get tracking then.
> 

Read the full new address back in writing, including apartment or unit numbers and postcode or ZIP code.

</details>

<details class="toggle"><summary>Delivery address change after shipping</summary>

> **You:** Your order has already left our warehouse, so I can't change the address in our system. I've asked (CARRIER) whether they can redirect it, and I'll update you by (DATE). You can also request a redirect directly with your tracking link: (TRACKING LINK).
>

</details>

<details class="toggle"><summary>If verification fails or the customer refuses</summary>

> **You:** I understand. I'm not able to change account details without confirming the owner, as this protects you from anyone else making changes. If you'd like, you can update this yourself after logging in: (STEPS).
> 

Note it on the ticket. If the request looks suspicious, flag it to Tier 2 and follow the Escalation Ladder for possible fraud.

</details>

## Objections and tricky replies

| Customer says | You reply |
| --- | --- |
| "This is ridiculous, it's my account." | "I understand, and I'm sorry for the extra step. It's there so nobody else can change your details. It takes about a minute." |
| "I don't have access to the old email or phone." | Follow the client's recovery process; escalate to Tier 2 if it requires extra checks. |
| "Change the address and upgrade to express, it's urgent." | Verify first. Urgency plus a new address is a common fraud pattern. Then process normally. |

## After you send

**Internal note:**

> Issue: change of (DETAIL). Checked: verified by (METHOD). Done: changed from (OLD, partly hidden) to (NEW, partly hidden). Promised: confirmation email. Next: none.
> 

**Tags:** account change, verified. **Status:** Solved.

<div class="callout callout-never">

Never do this: never make a change "just this once" without verification, even for a polite, regular or upset customer. Never reveal what details are on file ("Your phone number is 555...") to help someone pass the check.

</div>

*© Narqix Academy*
