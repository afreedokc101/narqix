---
id: "3fdeadddae718197a569c1d37106bb75"
title: "Phone Flow: Taking a Message and Booking a Callback"
section: "scripts"
page: "phone-flow-taking-a-message-and-booking-a-callback"
order: 236
summary: "Purpose: take a complete, accurate message when the caller needs someone who is not available, so the callback can solve the issue in one go."
scriptTrack: "customer-support"
scriptId: "NQX-83"
role: "CSR, Support Agent"
stage: "Inbound"
---

<div class="callout callout-intro">

**Purpose:** take a complete, accurate message when the caller needs someone who is not available, so the callback can solve the issue in one go.

**Use it when:** the caller asks for a specific person, needs a team that is closed, or the issue needs research before an answer.

**Goal:** a message the recipient can act on without calling back to ask questions, and a callback time the caller agreed.

**Version:** v1.0

</div>

## Before you dial

(For inbound: before you go available.)

- [ ]  Message template ready in the ticketing system or CRM
- [ ]  Team members' availability and callback windows known (from the Client Workflow Record)
- [ ]  Client's rules on who can promise callback times

## The flow

### 1. Explain and offer

> **You:** (PERSON OR TEAM) isn't available right now. I'd be happy to take a message and arrange a call back. Would that be okay?
> 

<details class="toggle"><summary>If you can solve it yourself</summary>

> **You:** I may be able to help with that myself. Could you tell me a little more?
> 

Always try first. A callback is for what you cannot solve.

</details>

### 2. Collect the message checklist

> **You:** Could I have your full name, please? And could you spell that for me?
**You:** Are you an existing customer with us?
**You:** What's the best number to reach you on?
**You:** And an email address, in case we can't reach you by phone?
**You:** What is the call about, so (PERSON) can be ready with an answer?
**You:** How urgent is this for you?
**You:** When is the best time to call you back? Which time zone are you in?
> 

**The message checklist:**

| Field | Example |
| --- | --- |
| Full name (spelled) | (CALLER NAME) |
| Existing or new customer | Existing, order (ORDER NUMBER) |
| Phone (read back in groups) | (PHONE NUMBER) |
| Email (spelled with a phonetic alphabet) | (EMAIL ADDRESS) |
| For whom | (PERSON OR TEAM) |
| Reason, in the caller's words | "Wants to know if the installation date can move to next week" |
| Urgency | Needs an answer before Friday |
| Best callback time and zone | Tomorrow 10:00 AM to 12:00 PM CT |

### 3. Read it all back

> **You:** Let me read that back. (CALLER NAME), phone (PHONE NUMBER, in groups), email (EMAIL, spelled). You'd like (PERSON) to call about (REASON), before Friday, ideally tomorrow between 10 and 12 Central. Is that all correct?
> 

*Why it works: most failed callbacks come from a wrong digit or a misspelled email. The read-back catches them.*

### 4. Set an honest expectation

> **You:** I'll pass this to (PERSON) right away. (If you know the client's callback window:) You can expect a call back by (TIME AND ZONE). (If you do not:) They'll call you as soon as they can, and I'll make sure they know it's needed before Friday.
> 

Never promise a time you cannot control.

### 5. Close

> **You:** Is there anything else I can help with today? Thank you for calling, (CALLER NAME).
> 

## Objections

| Caller says | You say |
| --- | --- |
| "Just give me their mobile number." | "I'm not able to share personal numbers, but I'll make sure your message reaches them straight away." |
| "Can't you just tell me?" | "Let me see what I can find." Help within your knowledge and authority; otherwise keep the callback. |
| "Nobody ever calls back!" | "I'm sorry that's happened. I'm marking this as a priority, and I'll check that the call is made." Then actually check. |

## After the call

1. Send the message within 5 minutes through the client's agreed channel (ticket assignment, team channel or email), with all checklist fields.
2. Create a follow up reminder for the callback time.
3. **Check the callback happened.** If it did not by the promised time, chase it and update the caller.

**Call log:**

> Call (inbound), (DATE, TIME AND ZONE). Caller: (NAME), (EXISTING OR NEW). Message for (PERSON OR TEAM): (REASON). Callback requested (TIME AND ZONE). Message sent (TIME) via (CHANNEL). Next: confirm callback made.
> 

<div class="callout callout-never">

Never do this: never take a message without a callback number read back, and never promise that a specific person will call at a specific time unless you know they can.

</div>

*© Narqix Academy*
