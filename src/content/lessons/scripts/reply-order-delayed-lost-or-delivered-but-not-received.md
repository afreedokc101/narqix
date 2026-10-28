---
id: "3fdeadddae718120b432c649da0add30"
title: "Reply: Order Delayed, Lost or Delivered but Not Received"
section: "scripts"
page: "reply-order-delayed-lost-or-delivered-but-not-received"
order: 161
summary: "Purpose: handle orders that are late, stuck, lost, or marked delivered but missing."
scriptTrack: "customer-support"
scriptId: "NQX-8"
role: "CSR, Support Agent"
stage: "Email"
---

<div class="callout callout-intro">

**Purpose:** handle orders that are late, stuck, lost, or marked delivered but missing.

**Use it when:** tracking has not moved for several days, the order is past its estimate, or the carrier shows "delivered" and the customer says it is not there.

**Goal:** the customer has a clear plan with a date, and the right claim or resend is started.

**Version:** v1.0

</div>

## Before you send

- [ ]  Carrier tracking checked, including any delivery photo or location
- [ ]  Delivery address on the order compared with the customer's message
- [ ]  Past tickets checked: any previous "not received" claims? (abuse signal, see Refunds and Exceptions)
- [ ]  Client's rules for traces, waiting periods and resends checked in the matrix
- [ ]  Your authority for a resend or refund checked

## The flow

### 1. Personal line and honest status

> **You:** Hi (CUSTOMER FIRST NAME),
I'm sorry your order hasn't arrived. I checked the tracking, and it hasn't moved since (DATE) in (LOCATION). That's longer than it should be.
> 

*Why it works: honest facts build trust, even when the news is not good.*

### 2. What you have done

> **You:** I've opened a trace with (CARRIER), reference (TRACE REFERENCE). They usually reply within (NUMBER) business days.
> 

### 3. The plan and the date

> **You:** Here's the plan: if the parcel starts moving, I'll send you the new delivery date. If (CARRIER) can't find it by (DATE), I'll send a replacement (or a full refund, if you prefer) at no cost to you. Either way, you'll hear from me by (DATE).
Best,
(YOUR NAME)
> 

*Why it works: the customer knows both outcomes and the date. No more uncertainty.*

<details class="toggle"><summary>Branch: tracking says &quot;delivered&quot; but the customer does not have it</summary>

> **You:** Hi (CUSTOMER FIRST NAME),
I'm sorry, that's worrying. The carrier shows it delivered on (DATE) at (TIME). A few quick checks often find it:
1. Around the property: porch, side door, garage, mailbox, or with a building manager.
2. With neighbors, in case it was left next door.
3. Any delivery photo in your tracking: (TRACKING LINK)
If it doesn't turn up within 24 hours, reply here. I'll open a claim with (CARRIER) and we'll sort out a replacement or refund under our policy.
> 

Follow the client's waiting period before resending. If the customer has several recent claims, follow policy and escalate to Tier 2 with a note. Never accuse.

</details>

<details class="toggle"><summary>Branch: the address on the order is wrong (customer error)</summary>

> **You:** I checked the order, and it was sent to (ADDRESS AS ON ORDER), which looks different from your address. I've asked (CARRIER) to redirect or return it. Once I hear back by (DATE), I'll let you know the options.
> 

Be kind and factual. Follow the matrix for who covers reshipping costs.

</details>

<details class="toggle"><summary>Branch: the carrier confirms it is lost</summary>

> **You:** (CARRIER) has confirmed the parcel is lost. I'm sorry. I've sent a replacement today, and here's the new tracking: (TRACKING LINK). It's due (DELIVERY ESTIMATE). If you'd rather have a refund, just reply and I'll switch it.
>

</details>

## Objections and tricky replies

| Customer says | You reply |
| --- | --- |
| "Just send another one now." | "I want to get it to you fast. Our process needs (CARRIER) to check first, which takes until (DATE). If it's not found by then, the replacement ships the same day." (If your matrix allows an immediate resend, offer it.) |
| "I'll do a chargeback." | "I understand. You don't need to, though. I've already started the trace, and you'll have a replacement or refund by (DATE)." Note it and tell Tier 2 if they file. |
| "This always happens with you." | Check history. "I can see this happened on your last order too, and that's not okay. I've flagged it to our shipping team." Record root cause. |

## After you send

**Internal note:**

> Issue: order stuck since (DATE) / delivered not received. Checked: tracking, address, history (no previous claims). Done: trace (REFERENCE) opened. Promised: update by (DATE AND ZONE). Next: if not found, resend per matrix.
> 

**Tags:** WISMO, delayed or lost, carrier. **Status:** On-hold (waiting on carrier). Set a reminder for the promised date.

<div class="callout callout-never">

Never do this: never promise a resend or refund before checking the matrix and your authority, and never tell a customer they are lying. Follow the process, note any concern, and let Tier 2 decide.

</div>

*© Narqix Academy*
