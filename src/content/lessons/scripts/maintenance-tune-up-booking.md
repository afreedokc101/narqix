---
id: "3fdeadddae7181d2a83bd7a6dc3bd240"
title: "Maintenance Tune-Up Booking"
section: "scripts"
page: "maintenance-tune-up-booking"
order: 202
summary: "Purpose: Book seasonal tune-ups for members (visits they have already paid for) and for non-members who ask for one."
scriptTrack: "hvac-home-services"
scriptId: "NQX-49"
role: "Appointment Setter, CSR, SMS Agent"
stage: "Follow-Up"
---

<div class="callout callout-intro">

**Purpose:** Book seasonal tune-ups for members (visits they have already paid for) and for non-members who ask for one.

**When to use:** Outbound tune-up campaigns (spring for cooling, fall for heating), and inbound callers asking for a tune-up or "check-up".

**Goal of the call:** A tune-up booked in an arrival window, counted against the member's plan, or a non-member tune-up booked with the plan offered.

**Version:** v1.0

</div>

## Before you dial

- [ ]  Campaign list of members with visits owed, sorted by zone
- [ ]  Each member's record open: plan type, visits used and owed, equipment, last visit notes, expiry date
- [ ]  Board open with tune-up windows the client has released for this campaign
- [ ]  Allowed calling hours for each customer's time zone (Narqix default 9 AM to 8 PM local, Monday to Saturday)
- [ ]  Customer has not opted out of calls
- [ ]  Tune-up checklist summary for your client (what the technician does)

## The flow

### Stage 1: Opening (outbound to a member)

> **You:** Hi, is this (CUSTOMER NAME)?
**Them:** Yes.
**You:** Hi (CUSTOMER NAME), this is (YOUR NAME) from (COMPANY NAME). I'm calling because you're a (PLAN NAME) member, and your (SEASON) tune-up is included in your plan. I'd love to get that on the calendar before the busy season starts. Do you have a quick minute?
> 

*Why it works: it is a service call, not a sales call. You are giving them something they already paid for.*

<details class="toggle"><summary>If they say: &quot;Now isn&#39;t a good time.&quot;</summary>

> **You:** No problem at all. When would be better for a two-minute call, later today or tomorrow?
> 

Set a callback in the CRM at the time they choose, inside allowed hours.

</details>

<details class="toggle"><summary>If they say: &quot;I didn&#39;t know I had a plan&quot; or &quot;What&#39;s included again?&quot;</summary>

> **You:** Of course. Your plan includes (PLAN BENEFITS SUMMARY). This visit is one of the (NUMBER) tune-ups included each year, so there's no charge for the tune-up itself.
>

</details>

### Stage 1 (alternative): Opening (inbound tune-up request)

> **You:** Thank you for calling (COMPANY NAME), this is (YOUR NAME). Who do I have the pleasure of speaking with?
**Them:** I'd like to get my AC checked before summer.
**You:** Great idea, that's exactly the right time. Let me pull up your account. What's the service address?
> 

Check membership. Members: continue to Stage 2. Non-members: continue to Stage 2, then use the non-member path in Stage 4.

### Stage 2: Quick check-in on the system

> **You:** How has the system been running since your last visit? Any noises, smells, or rooms that don't heat or cool like they should?
**You:** Do you know when the filter was last changed?
> 

If they report a problem, note it. If anything triggers the safety screen, stop and follow the Safety and Emergency Protocol. If they report a real failure (not working at all), book it as a repair call per priority rules instead of waiting for a tune-up.

*Why it works: it gives the technician useful notes and shows the customer you care about their system, not just the appointment.*

### Stage 3: Offer two windows

> **You:** I have (DAY 1) between (WINDOW 1), or (DAY 2) between (WINDOW 2). Which works better for you?
> 

<details class="toggle"><summary>If they say: &quot;Can you do a weekend?&quot;</summary>

If the client offers weekend tune-ups, offer them. If not:

> **You:** Our tune-ups run Monday to Friday. Would an early morning window like 8 to 10 work, or is there a day someone else could be home? It just needs to be an adult.
>

</details>

<details class="toggle"><summary>If they have two systems</summary>

> **You:** I see you have two systems, upstairs and downstairs. Your plan covers both, so I'll book enough time for the technician to do both on the same visit.
> 

Check the client's rule on multi-system plans and job length.

</details>

### Stage 4: Non-member path (inbound or non-member lists)

> **You:** A tune-up on its own is (TUNE-UP PRICE). Many customers choose our (PLAN NAME) instead. For (PLAN PRICE), you get both seasonal tune-ups, priority service when it's busy, and (REPAIR DISCOUNT) off any repairs. Would you like the single tune-up, or should I set you up with the plan?
> 

*Why it works: you show the real choice side by side and let the customer pick. No pressure, just a clear comparison.*

If they choose the plan, follow the client's sign-up process (terms, payment through the secure process). If they choose a single tune-up, book it and note "Plan offered: declined".

### Stage 5: Restate and close

> **You:** Perfect. That's your (SEASON) tune-up on (DAY) between (WINDOW) at (SERVICE ADDRESS). The technician will check and clean the system and let you know if anything needs attention. You'll get a confirmation text, and another when the technician is on the way. Anything else I can help with?
> 

<div class="callout callout-coach">

**Coach's note:** Book tune-ups by zone. If you have three members on the same street, offer them windows on the same day. Technicians do more visits, and the client can release more tune-up slots. Dispatchers will thank you.

</div>

<div class="callout callout-never">

**Never do this:** Never tell a member the tune-up "guarantees" no breakdowns. Never invent a deadline ("you'll lose your visit if you don't book this week") unless the plan terms really say so. Never call members who have opted out of calls; use the channel they allow.

</div>

## Objections

| They say | You say |
| --- | --- |
| "My system is working fine." | "That's the best time for a tune-up. The technician can catch small things, like a weak part, before they turn into a breakdown on the hottest day." |
| "I'll call you when I'm ready." | "Of course. The earlier windows fill first before the season. Would you like me to text you two options so you can pick when it suits you?" |
| "Last time the tech tried to sell me stuff." | "I'm sorry it felt that way. I'll note that you prefer a simple tune-up and a written list of anything the technician sees, with no pressure." Pass to office if it sounds like a complaint |
| "I want to cancel my plan." | "I'm sorry to hear that. Let me get (MANAGER NAME) to call you so they can help with that." Route to office per client retention rule |

More in the Objection Handbook.

## After the call

<div class="callout callout-note">

(DATE) (TIME) local · (YOUR NAME) · Outbound call · Tune-up campaign

Member: yes, (PLAN NAME). Visit (NUMBER) of (NUMBER) for this plan year

System check-in: (customer comments, last filter change)

Outcome: Tune-up booked (DAY) (WINDOW), marked against plan visits

Next step: confirmation text day before

</div>

If not booked: note the reason, the next contact date and the channel they prefer.

## Check yourself

1. Why is a member tune-up call a service call and not a sales call?
2. During the check-in a member says the AC stopped working yesterday. What do you do?
3. Why should you book tune-ups by zone?
4. What two options do you put side by side for a non-member?

<details class="toggle toggle-answers"><summary>Answers</summary>

1. Because the member has already paid for the visit. You are helping them use what they own.
2. Book it as a repair call under the priority rules (and run the safety screen), not as a routine tune-up.
3. It cuts technician drive time, so more visits fit in a day and the client can release more slots.
4. A single paid tune-up, or the maintenance plan with its benefits.

</details>

---

*© Narqix Academy*
