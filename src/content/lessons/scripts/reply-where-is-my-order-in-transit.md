---
id: "3fdeadddae7181068c25f1aaaea77eed"
title: "Reply: Where Is My Order (In Transit)"
section: "scripts"
page: "reply-where-is-my-order-in-transit"
order: 160
summary: "Purpose: answer \"Where is my order?\" with a real status, a date and a plan."
scriptTrack: "customer-support"
scriptId: "NQX-7"
role: "CSR, Support Agent"
stage: "Email"
---

<div class="callout callout-intro">

**Purpose:** answer "Where is my order?" with a real status, a date and a plan.

**Use it when:** the order has shipped and tracking shows normal movement, inside or close to the delivery estimate.

**Goal:** the customer knows when it will arrive and does not need to write again.

**Version:** v1.0

</div>

## Before you send

- [ ]  Order opened: ship date, carrier, tracking, items, delivery address
- [ ]  Tracking checked on the carrier's page (not only the store's status)
- [ ]  Customer's past tickets checked (is this a repeat contact?)
- [ ]  Any deadline in their message (birthday, event, travel)?
- [ ]  Every other question in the message noted

## The flow

### 1. Personal line and the answer

> **You:** Hi (CUSTOMER FIRST NAME),
Thanks for checking in. Your order (ORDER NUMBER) is on its way and is due (DELIVERY ESTIMATE).
> 

*Why it works: the outcome they want is in the first two sentences.*

### 2. The details

> **You:** It shipped on (SHIP DATE) with (CARRIER), and you can follow it here: (TRACKING LINK)
> 

### 3. What happens if it is late, and who acts

> **You:** Parcels sometimes run a day or two behind the estimate. If it hasn't arrived by (ESTIMATE PLUS 3 DAYS), just reply to this email and I'll open a trace with (CARRIER) right away.
Best,
(YOUR NAME)
> 

*Why it works: answering the next question ("what if it doesn't come?") prevents a second ticket.*

<details class="toggle"><summary>If they mention a deadline (gift, event)</summary>

> **You:** I know you need it before (EVENT DATE). The current estimate is (DELIVERY ESTIMATE), which is (one day before / on the day of) your event. I'll check the tracking on (DATE) and email you if anything changes.
> 

If the estimate is after their deadline, say so honestly and offer the options your matrix allows (for example a faster replacement, or cancellation if not yet delivered).

</details>

<details class="toggle"><summary>If tracking has not updated for several days</summary>

Use the Order Delayed or Lost reply instead. Do not tell the customer it is "in transit" without checking that it is really moving.

</details>

<details class="toggle"><summary>If the order has not shipped yet</summary>

> **You:** Your order is being packed and is due to ship by (DATE). You'll get an email with tracking as soon as it leaves. Delivery usually takes (NUMBER) business days after that.
>

</details>

## Objections and tricky replies

| Customer says | You reply |
| --- | --- |
| "Can you make it go faster?" | "Once a parcel is with the carrier, we can't change its speed. What I can do is (OPTION FROM MATRIX)." |
| "Tracking says delivered but I don't have it." | Use the Order Delayed or Lost reply (delivered but not received branch). |
| "Why didn't anyone tell me?" | "You're right, an update would have helped. I've added you to delivery notifications, and I'll email you if anything changes." |

## After you send

**Internal note:**

> Issue: WISMO. Checked: tracking moving normally, due (DATE). Done: sent status and link. Promised: none unless late after (DATE). Next: none.
> 

**Tags:** WISMO, in transit. **Status:** Solved (customer can reply to reopen).

<div class="callout callout-coach">

Coach's note: always open the carrier's own tracking page. Store statuses often lag by a day, and customers usually check the carrier page themselves. Never tell a customer something their own screen disagrees with.

</div>

*© Narqix Academy*
