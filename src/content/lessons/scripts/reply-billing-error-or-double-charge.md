---
id: "3fdeadddae7181e4bc5ad7d3c4a3277d"
title: "Reply: Billing Error or Double Charge"
section: "scripts"
page: "reply-billing-error-or-double-charge"
order: 184
summary: "Purpose: investigate and fix wrong charges quickly and calmly."
scriptTrack: "customer-support"
scriptId: "NQX-31"
role: "CSR, Support Agent"
stage: "Email"
---

<div class="callout callout-intro">

**Purpose:** investigate and fix wrong charges quickly and calmly.

**Use it when:** the customer reports a double charge, a wrong amount, a charge they do not recognize, or a charge after cancellation.

**Goal:** the customer knows whether the charge is real, and any error is refunded with clear timing.

**Version:** v1.0

</div>

## Before you send

- [ ]  Identity verified before discussing payment details
- [ ]  Payment records checked: number of charges, amounts, dates, status (completed or pending)
- [ ]  Orders matched to each charge
- [ ]  Checked for a **pre-authorization** (a temporary hold that drops off) versus a real second charge
- [ ]  Checked for an open chargeback (if open, do not refund; escalate)
- [ ]  Your refund authority checked

**Priority:** High. Money worries make customers anxious fast.

## The flow

### Path A: a real duplicate charge

> **You:** Hi (CUSTOMER FIRST NAME),
You're right, you were charged twice for order (ORDER NUMBER) on (DATE). I'm sorry about that.
I've refunded the extra (AMOUNT) to your card ending in (LAST FOUR DIGITS). It usually shows within 5 to 10 business days, depending on your bank. Your refund reference is (REFUND REFERENCE).
If you don't see it by (DATE), reply here and I'll chase it personally.
Best,
(YOUR NAME)
> 

*Why it works: confirms they were right, fixes it, gives a reference and a date.*

### Path B: a pending hold, not a real charge

> **You:** Hi (CUSTOMER FIRST NAME),
I checked your account, and you were charged once for order (ORDER NUMBER): (AMOUNT) on (DATE).
The second amount you see is a temporary hold your bank placed when the payment was checked. It isn't a charge, and it should disappear on its own within (NUMBER) business days, depending on your bank.
If it's still showing as a completed charge after (DATE), reply with a screenshot of your statement (please hide your card number) and I'll look into it straight away.
> 

*Why it works: explains simply, without making the customer feel foolish.*

### Path C: a charge they do not recognize

> **You:** Hi (CUSTOMER FIRST NAME),
Thanks for flagging this. The charge of (AMOUNT) on (DATE) is for (ORDER OR SUBSCRIPTION DETAILS). It shows on statements as (BILLING DESCRIPTOR).
If this wasn't you, reply and let me know, and I'll secure your account and pass it to our team right away.
> 

If the customer says they did not make it: treat it as a possible account takeover. Escalate as urgent per the Escalation Ladder.

<details class="toggle"><summary>If the refund is above your authority</summary>

> **You:** You're right, this charge shouldn't be there, and I'm sorry. Because of the amount, our billing team needs to approve the refund. I've sent them everything, and you'll hear from us by (TIME AND ZONE).
> 

Escalate with the internal refund note (see Refunds and Exceptions).

</details>

<details class="toggle"><summary>If many customers report the same charge problem</summary>

This may be a system error. Tell Tier 2 immediately; they open a master ticket and inform the client. Use the Outage or Known Issue Update for affected customers.

</details>

## Objections and tricky replies

| Customer says | You reply |
| --- | --- |
| "I need the money now, I'm short this month." | "I understand, and I've done everything on our side today. The bank's processing time is outside our control, but your reference (REFUND REFERENCE) can help if you call them." |
| "Refund it to my other card." | "For your security, refunds can only go to the card that was charged." |
| "I've already disputed it with my bank." | "Thanks for telling me. In that case your bank will handle it, and I won't refund separately so you aren't refunded twice." Note it and tell Tier 2. |

## After you send

**Internal note:**

> Issue: (duplicate charge / hold / unrecognized charge). Checked: verified, payment records, no chargeback. Done: (refund AMOUNT ref REFERENCE / explained hold). Promised: (WHAT) by (DATE AND ZONE). Next: (none / Tier 2 approval).
> 

**Tags:** billing, root cause. **Status:** Solved (Path A and B), On-hold if escalated.

<div class="callout callout-never">

Never do this: never ask for or accept a full card number to "find the charge". Use the order number, email, date, amount and last four digits only.

</div>

*© Narqix Academy*
