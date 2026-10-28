---
id: "3fdeadddae718169b855d30320dfc9ee"
title: "Knowledge and Macros Guide"
section: "customer-support"
page: "knowledge-and-macros-guide"
order: 138
summary: "For support specialists who use, write or maintain macros (saved replies) and knowledge base articles. After reading you will be able to find the right macro fast, personalize it properly, write new m"
duration: "30 min"
---

<div class="callout callout-intro">

For support specialists who use, write or maintain macros (saved replies) and knowledge base articles. After reading you will be able to find the right macro fast, personalize it properly, write new macros to the Narqix standard, and keep the library accurate.

Track: Customer Support  ·  Role: Support Agent, CSR, Tier 2, QA Reviewer  ·  Time to complete: 30 min

</div>

## What macros are for

A macro is a saved reply, sometimes with saved actions (set a tag, change a status, issue a refund). Macros make answers **consistent and accurate**, and they save time on common questions.

A macro is a **starting point, never the finished reply**. Every macro sent to a customer must be read, checked and personalized. A bare macro is a QA fail.

## Naming macros

Names are built for typing a few letters to find the right one fast:

**Pattern:** CATEGORY: What it does

| Category | Examples |
| --- | --- |
| ORDER | ORDER: Shipped, in transit · ORDER: Delayed, carrier trace opened |
| RETURN | RETURN: Label sent · RETURN: Outside window, credit offered |
| REFUND | REFUND: Approved, full · REFUND: Pending approval |
| DAMAGED | DAMAGED: Replace or refund choice |
| ACCOUNT | ACCOUNT: Password reset sent · ACCOUNT: Verification needed |
| BILLING | BILLING: Duplicate charge refunded |
| BUG | BUG: Reproduced, workaround · BUG: Need more details |
| CANCEL | CANCEL: Subscription cancelled |
| CHAT | CHAT: Holding · CHAT: Closing |
| INTERNAL | INTERNAL: Escalate refund over limit (internal note only) |

## Placeholder fields

Most ticketing systems fill fields automatically: customer first name, order number, tracking link, agent name. In this Academy we show them as purple placeholders, like (CUSTOMER FIRST NAME).

**Danger:** if the system cannot find the data, some tools leave the field blank or show raw code. Always check:

- [ ]  Every field filled with the right data
- [ ]  Customer has more than one order? The right order is used
- [ ]  Chat version: no email-style sign-off block

## The Narqix macro standard

Every macro in the library must follow these rules:

1. **Answer first.** The customer knows the outcome in the first two sentences.
2. **A slot for the personal line** at the top, marked clearly so agents fill it: (PERSONAL LINE: show you read their message).
3. **Short paragraphs, numbered steps.**
4. **Plain words.** None of the phrases on the replace list in Writing Great Replies ("inconvenience", "unfortunately", "as per our policy", "kindly", "valued customer").
5. **Says what we can do,** not only what we cannot.
6. **Next step with an owner and a time.**
7. **Honest timing** ("usually 5 to 10 business days, depending on your bank").
8. **Email and chat versions** where both channels are used.
9. **Destructive actions are obvious.** A macro that refunds or cancels has that word in its name, and you check its saved actions before sending.
10. **Owner and review date.** Each macro has a named owner and a last-reviewed date.

## Writing a new macro: step by step

1. **Check demand.** Is this question coming in at least a few times a week? If not, a one-off reply is enough.
2. **Check the source of truth.** Get the policy or answer from the client in writing.
3. **Draft** using the standard above.
4. **Test** on three real past tickets: one simple, one with two orders, one in chat.
5. **Peer review:** Tier 2 or QA reads it.
6. **Client approval** for any macro about money, policy or legal topics.
7. **Publish** with owner and review date; tell the team in the team channel.

### Example of a macro written to standard

> **ORDER: Shipped, in transit (email)**
Hi (CUSTOMER FIRST NAME),
(PERSONAL LINE)
Your order (ORDER NUMBER) is on its way. It shipped on (SHIP DATE) with (CARRIER), and the current estimate is (DELIVERY ESTIMATE).
Track it here: (TRACKING LINK)
Deliveries sometimes run a day or two behind the estimate. If it hasn't arrived by (ESTIMATE PLUS 3 DAYS), reply to this email and I'll open a trace with the carrier right away.
Best,
(AGENT FIRST NAME)
**Owner:** (NAME) · **Last reviewed:** (DATE)
> 

<div class="callout callout-coach">

Coach's note: the best personal lines are short and specific. "A late gift is stressful, so I checked this first." "Thanks for the photos, they made this quick." "Good question, a lot of people miss that setting." Ten words that prove you read the message change how the whole reply feels.

</div>

## Knowledge base articles

Help articles are what customers read before contacting support, and what agents link in replies.

| Rule | Why |
| --- | --- |
| One question per article | Easier to find and link |
| Title as the customer's question ("How do I change my delivery address?") | Matches how people search |
| Answer in the first paragraph | Many readers stop there |
| Numbered steps with one action each | Easy to follow |
| Last-updated date and owner | Stops old answers spreading |
| Linked from relevant macros | Consistent answers everywhere |

## Keeping the library healthy

| When | What |
| --- | --- |
| Whenever policy changes | Every affected macro and article updated the same day; team told |
| Weekly | QA notes any macro that caused errors or reopens |
| Quarterly | Every macro reviewed by its owner; unused ones archived, never deleted |

<div class="callout callout-never">

Never do this: never send a macro without reading the full text and checking every placeholder, and never send a macro with saved actions (refund, cancel, close account) without checking what those actions will do.

</div>

<div class="callout callout-never">

Never do this: never create or edit a macro about refunds, policy, prices or legal terms without approval. A wrong macro repeats the same mistake to hundreds of customers.

</div>

## Check yourself

1. What is the naming pattern for macros?
2. What are three things to check about placeholder fields before sending?
3. List the seven steps for writing a new macro.
4. Why are destructive actions only allowed in clearly named macros?
5. Write a personal first line for a customer who sent clear photos of a damaged item.

*© Narqix Academy*
