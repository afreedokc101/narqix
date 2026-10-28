---
id: "3fdeadddae71816bbfa7e71731a08fdb"
title: "Web and App Development"
section: "specialist-standards"
page: "web-and-app-development"
order: 143
summary: "For Narqix web developers and app developers. Use this page as your working checklist to ship sites, web apps, portals, mobile apps, internal tools and integrations to the Narqix standard."
duration: "10 min"
---

<div class="callout callout-intro">

For Narqix web developers and app developers. Use this page as your working checklist to ship sites, web apps, portals, mobile apps, internal tools and integrations to the Narqix standard.

Track: Specialist  ·  Role: Web Developer, App Developer  ·  Time to complete: 10 min

</div>

## Definition of done

A feature or site is done when all of these are true:

- [ ]  It meets every acceptance criterion in the Scope Sheet, with evidence
- [ ]  Code is reviewed, merged to the main line and tagged as a release in the client's repository
- [ ]  It works on the agreed browsers and devices, including a real mid-range phone
- [ ]  Forms, payments and integrations are tested end to end with real data paths (not only mock data)
- [ ]  Analytics and conversion events fire and are verified
- [ ]  Backups run, and a restore has been tested at least once
- [ ]  The README or guide explains how to run, deploy and change it
- [ ]  The client accepted it in writing

## Quality checklist

<details class="toggle"><summary>Code</summary>

- [ ]  Clear structure, consistent naming, no dead code or commented-out blocks left behind
- [ ]  No secrets, keys or passwords in the code or the repository history
- [ ]  Inputs validated on the server, not only in the browser
- [ ]  Errors handled with useful messages for users and useful logs for developers
- [ ]  Dependencies are maintained, licensed for commercial use, and pinned to versions
- [ ]  Automated tests cover the critical paths: sign-up, login, checkout, form submission, data sync

</details>

<details class="toggle"><summary>Performance</summary>

- [ ]  Main content loads in under 2.5 seconds on a mid-range phone over 4G
- [ ]  Layout does not jump while loading
- [ ]  The page responds to a tap or click in under 200 milliseconds
- [ ]  Images compressed, correctly sized and lazy-loaded below the fold
- [ ]  No unused scripts or heavy third-party widgets without a reason

</details>

<details class="toggle"><summary>Accessibility</summary>

- [ ]  Meets WCAG 2.2 AA basics: text contrast, alt text, labels on every form field
- [ ]  Every action works with a keyboard alone, and focus is visible
- [ ]  Headings in a logical order, one main heading per page
- [ ]  Tap targets large enough on mobile

</details>

<details class="toggle"><summary>Security</summary>

- [ ]  HTTPS everywhere, with automatic redirect from HTTP
- [ ]  Protection against the common web risks: injection, cross-site scripting, broken access control
- [ ]  Admin areas behind strong login and two-factor where possible
- [ ]  File uploads restricted by type and size
- [ ]  Spam protection on public forms
- [ ]  Card data never touches the client's server; payments go through the payment provider's hosted fields or checkout

</details>

<details class="toggle"><summary>Conversion and content (for marketing sites and landing pages)</summary>

- [ ]  One clear primary action per page, visible without scrolling on mobile
- [ ]  Phone numbers tap-to-call on mobile
- [ ]  Form confirmation message and confirmation email work
- [ ]  Leads land in the client's CRM with source and campaign tags attached
- [ ]  Privacy policy and terms linked where personal data is collected

</details>

## Pre-launch checklist

- [ ]  Final content approved by the client in writing
- [ ]  Staging site reviewed by the client; launch date and time agreed in the client's zone
- [ ]  Full backup of the old site or app taken and stored in client-owned storage
- [ ]  Redirects mapped from every old URL that has traffic or links
- [ ]  Domain and DNS changes planned, with low record lifetimes set a day ahead
- [ ]  Search engines allowed to index the live site (staging blocks removed)
- [ ]  Sitemap and robots file correct
- [ ]  Analytics, tag manager, ad conversion events and CRM form connections tested on the live domain
- [ ]  Every form submitted once on live and received in the right inbox and CRM
- [ ]  Error pages (404, 500) branded and helpful
- [ ]  Uptime monitoring and error alerts switched on, sent to the client and the specialist
- [ ]  Mobile app: store listings, screenshots, privacy details and review notes ready; tested on real devices for both major mobile platforms where in scope
- [ ]  Rollback plan written: how to go back in under 15 minutes if launch fails
- [ ]  Launch timed for low traffic and when you and the client are both available

<div class="callout callout-coach">

Coach's note: never launch on a Friday or right before your shift ends. Launch when you have at least 3 working hours afterwards to watch logs, forms and analytics. The first hour after launch finds most of the problems.

</div>

## Reporting KPIs

| KPI | Target | Why it matters |
| --- | --- | --- |
| Milestones delivered on time | 90 percent or more | Predictability is the Narqix promise |
| Defects found by the client after release | Trending down; zero critical | Shows your testing is real |
| Main content load time on mobile | Under 2.5 seconds | Speed drives conversions and search visibility |
| Uptime (live sites and apps) | 99.9 percent or more | Downtime costs leads and trust |
| Form-to-CRM delivery | 100 percent | A lost lead is lost revenue |
| Time to fix critical bugs | Within 24 hours | Shows ownership |
| Conversion rate of key pages | Tracked against the pre-launch baseline | Ties the build to business results |

## Access and security rules

- The client owns the domain, hosting, repository, app store accounts and every paid service. You get a named seat.
- Production deploy keys, database passwords and API keys live in the vault or the hosting platform's secret settings. Never in chat, email or the code.
- Use separate keys for development, staging and production. Never test with production keys.
- Never copy production databases with real customer data to your laptop. Use anonymized or sample data for local work.
- Deploy to production only through the agreed process, never by editing files directly on the live server.
- Remove test accounts, debug modes and sample data before launch.

## Common mistakes

<details class="toggle"><summary>Open the list</summary>

- Building on your own hosting or under your own developer account "to move fast", then struggling to transfer it.
- Testing only on a desktop browser with a fast connection.
- Forgetting redirects on a rebuild, which wipes out years of search traffic.
- Launching with staging settings that block search engines.
- Forms that look like they work but send leads nowhere, or lose the campaign source.
- Large libraries added for one small feature.
- No documentation, so the next developer starts from zero.
- Treating "it works on my machine" as done.

</details>

## Red flags to escalate

| Red flag | Level | What to do |
| --- | --- | --- |
| Live site, app or checkout down | P1 | Roll back if safe, alert Delivery Lead in 15 minutes |
| Suspected breach, leaked key or unknown admin user | P1 | Rotate the key if you can, alert Delivery Lead in 15 minutes, do not delete evidence |
| Client asks you to store card numbers or passwords in plain text | P2 | Decline, explain the safe option, inform Delivery Lead |
| Client asks you to copy a competitor's site, code or images | P2 | Pause, inform Delivery Lead |
| A required license or plugin has unclear commercial terms | P3 | Flag before using it |
| Another developer is changing the same code without coordination | P3 | Raise it the same day |
| Scope creep through "small" bug reports that are really new features | P3 | Log as change requests |

<div class="callout callout-never">

Never do this: never push untested code to production, and never deploy a change you cannot roll back. If there is no rollback, there is no launch.

</div>

---

*© Narqix Academy*
