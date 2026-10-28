---
id: "3fdeadddae718145b474c5e0159d375c"
title: "Reply: Payment Declined or Failed Renewal"
section: "scripts"
page: "reply-payment-declined-or-failed-renewal"
order: 199
summary: "Purpose: help a customer complete a payment that failed, without ever touching card details."
scriptTrack: "customer-support"
scriptId: "NQX-46"
role: "CSR, Support Agent"
stage: "Email"
---

<div class="callout callout-intro">

**Purpose:** help a customer complete a payment that failed, without ever touching card details.

**Use it when:** checkout failed, a card was declined, or a subscription renewal payment did not go through.

**Goal:** the customer updates their payment securely and the order or subscription continues.

**Version:** v1.0

</div>

## Before you send

- [ ]  Payment attempt records checked: number of attempts, decline reason if shown, amount
- [ ]  Order or subscription status checked: on hold, cancelled, grace period
- [ ]  Client's secure payment update link or steps ready
- [ ]  Check for signs of fraud (many attempts with different cards) and escalate if present

## The flow

### 1. Personal line and what happened

> **You:** Hi (CUSTOMER FIRST NAME),
Thanks for getting in touch. I can see the payment for (ORDER OR PLAN) on (DATE) didn't go through. Your (order is saved / subscription is still active until (DATE)), so nothing is lost.
> 

*Why it works: removes the worry first.*

### 2. Common reasons, without blame

> **You:** This usually happens for one of these reasons:
1. The card has expired or been replaced.
2. The billing address doesn't match the one the bank has.
3. The bank paused the payment as a security check. A quick call or app approval with your bank usually clears it.
> 

### 3. How to fix it securely

> **You:** You can update your payment securely here: (SECURE PAYMENT LINK). It takes about a minute. (For a renewal:) Once it's updated, we'll retry the payment automatically.
> 

### 4. Close

> **You:** Please don't send card details by email or chat. The secure link is the safest way. If anything gets stuck, reply here and I'll help.
Best,
(YOUR NAME)
> 

<details class="toggle"><summary>If the customer sends card details in their message</summary>

Do not copy, repeat or store them. Follow the client's redaction process right away, tell your lead if required, and reply:

> **You:** Thanks. For your security, I've removed the card details from this conversation. Please use the secure link instead: (SECURE PAYMENT LINK). We never take card numbers by email or chat.
>

</details>

<details class="toggle"><summary>If the customer was charged but the order failed</summary>

This is not a decline. Check the payment and order records. Use the Billing Error reply. If money was taken with no order created, treat it as Urgent (paid but no order).

</details>

<details class="toggle"><summary>If the subscription will lapse soon</summary>

> **You:** Your access stays open until (DATE). If the payment is updated before then, there's no interruption.
>

</details>

## Objections and tricky replies

| Customer says | You reply |
| --- | --- |
| "Can I just give you my card over the phone?" | "Thanks, but for your security we don't take card details by phone or email. The secure link is quick, and I can stay on chat while you do it." (Unless the client has an approved, compliant phone payment process.) |
| "My card is fine, it's your system." | "That's possible, and I'll check. Could you try once more with the link? If it fails again, tell me the exact message you see and I'll pass it to our payments team." |
| "Why did my bank block it?" | "Only your bank can see the reason. They usually clear it quickly by phone or in their app." |

## After you send

**Internal note:**

> Issue: payment declined (DATE). Checked: attempts, status. Done: sent secure update link. Promised: none. Next: check renewal succeeded on (DATE).
> 

**Tags:** billing, payment declined. **Status:** Pending.

<div class="callout callout-never">

Never do this: never ask for, write down, repeat or store a card number, CVV, PIN or bank login, and never enter payment details on a customer's behalf unless the client has an approved, compliant process for exactly that.

</div>

*© Narqix Academy*
