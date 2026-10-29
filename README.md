# Narqix Academy

Public learning and pre-certification site for Narqix Hiring Hub candidates in Bangladesh, served at **academy.narqix.com**.

- **Site:** Astro (static) + Tailwind, on Cloudflare Pages. Lesson pages ship no framework JavaScript.
- **API:** Cloudflare Pages Functions (`functions/`).
- **Data:** Cloudflare D1 (SQLite, `migrations/`).
- **Bot protection:** Cloudflare Turnstile on sign-up and exam submit.
- **Admin protection:** Cloudflare Access on `/admin`.

Everything runs on free tiers.

> **This repository is public.** The raw Notion export (`academy-export/`) and the exam answer keys (`exam-data/`) are git-ignored and must never be committed. Deploy from a machine that has them (see "Deploying").

---

## How it fits together

| Path | What it is |
| --- | --- |
| `academy-export/` | The Notion export (Markdown & CSV). **Not in git.** |
| `scripts/import-notion.mjs` | Converts the export into the site's content and exam data |
| `src/content/lessons/` | Generated lesson pages (public) |
| `src/data/lessons.json` | Generated lesson index and per-track learning paths (public) |
| `src/data/exams.json` | Generated exam metadata: counts, time limits, rules. No questions (public) |
| `exam-data/*.json` | Generated questions **and answer keys**. Imported only by Pages Functions, never sent to the browser. **Not in git.** |
| `functions/_lib/exams.ts` | Shuffling, server-side timer, grading, gate and part rules, retake rules, certificates |
| `functions/api/…` | Sign-up, login, progress, exams, verification and admin endpoints |
| `functions/verify/[id].ts` | Server-rendered public page `/verify/<certificate-id>` |

**Learning path per track:** Start Here → Narqix Standards → Core Skills → the track → the track's Script Library entries (plus the 5 Core scripts) → Exams.

**What the importer leaves out:**
- The exam pages (01 to 09) are turned into server-only data.
- Role-Play Certification (10 to 17), Practical Certification Tasks (18) and Certification Record and Sign-Off (19) are skipped.
- The NDA, agreement and login steps in "Your First Week" are removed.
- Pay bands, internal funding program sizes and staff-name placeholders such as `(TRAINER NAME)` are removed.
- The New VA First Week and New Client Launch checklists are excluded.

The import fails if any of this content would still be published (see `FORBIDDEN` in the importer). Every "Narqix Academy · Confidential · v1.0" footer becomes "© Narqix Academy".

**Exam rules** (checked against each Notion exam page on every import):

| Exam | Questions | Pass | Gates | Extra rule |
| --- | --- | --- | --- | --- |
| Foundation | 40 | 32 (80%) | 12 | |
| Real Estate | 50 | 40 | 7 | Acquisitions and Dispositions need ≥12/15 in Part 6 |
| Transaction Coordination | 40 | 32 | 4 | |
| Solar | 35 | 28 | 7 | |
| HVAC & Home Services | 35 | 28 | 9 | |
| Property Preservation | 35 | 28 | 5 | |
| Strategic Funding | 35 | 28 | 6 | Processors need ≥5/6 in Part 4 |
| Back Office | 30 | 24 | 6 | |
| Customer Support | 30 | 24 | 5 | |

How exams behave:
- A missed 🔒 gate question is a fail whatever the total.
- Questions and options are shuffled per attempt.
- The timer runs on the server. Answers autosave, and when time runs out the saved answers are graded.
- Retakes: earliest 2 days after a fail, at most 3 attempts per exam in any 30 days.
- After grading, the candidate sees their score, pass/fail and the lesson to reread for each missed question, never the correct letter.
- Passing Foundation plus a Track exam issues "Narqix Academy Pre-Certified — &lt;Track&gt;" with a public `/verify/<id>` page and a PDF generated in the browser.

---

## Local development

Requires Node 20+.

```bash
npm install
```

Unzip the Notion export into `academy-export/`, then generate the content and exam data:

```bash
npm run import
```

```bash
npm run fetch-logo
```

Set up the local database and a local admin login (localhost only):

```bash
npm run db:migrate:local
```

```bash
echo "DEV_ADMIN_EMAIL=you@example.com" > .dev.vars
```

Build and run the full stack (site + API + local D1) at http://localhost:8788:

```bash
npm run preview
```

With that running, in another terminal:

```bash
npm test
```

```bash
npm run check:leaks
```

`npm test` runs the end-to-end API tests: pass, fail on total, fail on one gate, part rules, retake lock, the 3-in-30-days cap, server timer, certificate and verification, and admin. `npm run check:leaks` builds proof that no answers reach the browser. It scans every file in `dist/` and opens every exam in Chromium, checking the page source and every network response.

Without `TURNSTILE_SECRET_KEY`, Turnstile checks are skipped locally. Sign-up is rate-limited to 10 per hour per IP; if tests hit that, delete `.wrangler/state` and re-run `npm run db:migrate:local`.

---

## Deploying (first time)

Steps marked **(you)** need your Cloudflare account. Everything else is a command run from this folder.

### 1. Log in to Cloudflare (you)

```bash
npx wrangler login
```

### 2. Create the D1 database

```bash
npx wrangler d1 create narqix-academy
```

Copy the `database_id` it prints into `wrangler.toml`, replacing `00000000-0000-0000-0000-000000000000`. Then create the tables:

```bash
npm run db:migrate:remote
```

### 3. Create the Pages project

```bash
npx wrangler pages project create narqix-academy --production-branch main
```

Note the `*.pages.dev` address it prints, usually `narqix-academy.pages.dev`. If that name was taken, Cloudflare adds a suffix; use the address it shows wherever this README says `narqix-academy.pages.dev`.

### 4. Turnstile keys (you)

1. In the Cloudflare dashboard, open **Turnstile → Add widget**.
2. Name it "Narqix Academy", add the hostnames `academy.narqix.com` and `narqix-academy.pages.dev`, and choose **Managed** mode.
3. Put the **site key** in `wrangler.toml` as `TURNSTILE_SITE_KEY`.
4. Store the **secret key** as a Pages secret:

```bash
npx wrangler pages secret put TURNSTILE_SECRET_KEY --project-name narqix-academy
```

### 5. Deploy

```bash
npm run deploy
```

This refuses to run if `exam-data/` is missing or the D1 id is still the placeholder.

### 6. Custom domain academy.narqix.com (you)

1. In the dashboard open **Workers & Pages → narqix-academy → Custom domains → Set up a custom domain** and enter `academy.narqix.com`.
2. Then add this record at your DNS provider:

| Type | Name / Host | Target / Value | TTL |
| --- | --- | --- | --- |
| CNAME | `academy` | `narqix-academy.pages.dev` | Auto (or 3600) |

Notes:
- Add the domain in Pages first, then the CNAME. Pages shows "Active" once DNS has propagated, usually within minutes and occasionally a few hours. SSL is issued automatically.
- If narqix.com's DNS is already on Cloudflare, Pages creates this record for you.

### 7. Protect /admin with Cloudflare Access (you)

**a) Set up Zero Trust.** In the dashboard open **Zero Trust**. The first time, pick a team name (for example `narqix`) and the **Free** plan, which covers up to 50 users. Your team domain is `narqix.cloudflareaccess.com`.

**b) Create the application.** Go to **Access → Applications → Add an application → Self-hosted**:
- **Name:** Narqix Academy admin.
- **Session duration:** 24 hours.
- **Public hostnames:** add these four entries:
  - `narqix-academy.pages.dev`, path `admin`
  - `narqix-academy.pages.dev`, path `api/admin`
  - `academy.narqix.com`, path `admin` (only if narqix.com's DNS is on Cloudflare)
  - `academy.narqix.com`, path `api/admin` (same condition)
- **Policy:** name it "Hiring team", action **Allow**, include **Emails**: `afreed@narqix.com`, `ayman@narqix.com`, `sakib@narqix.com`, `hiring@narqix.com`.
- **Login method:** One-time PIN (emailed code; works for any email address).

**c) Copy the AUD.** After saving, open the application's **Overview**, copy the **Application Audience (AUD) Tag** and put it in `wrangler.toml`:

```toml
ACCESS_TEAM_DOMAIN = "narqix.cloudflareaccess.com"
ACCESS_AUD = "<the AUD tag>"
```

**d) Deploy again:**

```bash
npm run deploy
```

The hiring team then opens **https://narqix-academy.pages.dev/admin/** (or `https://academy.narqix.com/admin/` when narqix.com's DNS is on Cloudflare). Cloudflare Access only works on hostnames that Cloudflare proxies. That is why the `pages.dev` address is always protected, and the custom domain only when its DNS is on Cloudflare.

The admin API checks the signed Access token and the email allow-list in code as well. Without a valid token it returns 403 on any hostname, so candidate data is never exposed even on an unprotected address.

### 8. Optional: email login codes (Resend free tier)

Without this, candidates log in with phone + password, the built-in fallback. To also offer 6-digit email codes:

1. Create a Resend account and verify the domain `narqix.com`. Resend gives you DNS records to add.
2. Set `EMAIL_FROM = "Narqix Academy <academy@narqix.com>"` in `wrangler.toml`.
3. Store the API key and redeploy:

```bash
npx wrangler pages secret put RESEND_API_KEY --project-name narqix-academy
```

```bash
npm run deploy
```

Cloudflare Email Workers can only send to verified destination addresses, so they cannot email candidates. That is why Resend is used here.

---

## Re-importing updated Notion content

1. In Notion, open **Narqix Academy · Bangladesh → ⋯ → Export**. Choose **Markdown & CSV** and turn on **Include subpages**.
2. Delete the old `academy-export/` folder and unzip the new export into a fresh `academy-export/`.
3. Run the import:

```bash
npm run import
```

The importer prints every exam it parsed and stops with a clear message if anything does not match:
- a question count, gate count or pass mark that differs from the rules table above;
- a toggle answer that disagrees with the examiners' answer key;
- forbidden content still left in a lesson.

It also warns when an exam answer names a "Source" page that no longer exists.

4. Review the changes, commit `src/` (never `academy-export/` or `exam-data/`), then deploy:

```bash
git status
```

```bash
npm run deploy
```

Lesson progress is stored by Notion page ID, so renaming or moving pages in Notion keeps candidates' progress. New pages appear automatically in their section and track path.

To exclude another internal page, add its title to `EXCLUDED_TITLES` in `scripts/import-notion.mjs`. To strip a new kind of internal line, add a pattern to `STRIP_LINE_PATTERNS`.

## Editing exam questions

Exam questions live in Notion, on the exam pages under **Quizzes & Certification**. Edit them there, keeping the existing format:

```
**Q12. 🔒 Question text?**

- A. option
- B. option
- C. option
- D. option
- Answer Q12   (toggle)
    **Correct: C.** Explanation…
    Source: Page Name; Another Page Name.
```

- 🔒 straight after the number marks a gate question. Keep the examiners' answer key table and the "Gate questions (N): …" line in step, because the importer cross-checks all three.
- `Source:` names the lesson page(s) shown to candidates who miss the question. Use the exact page titles.
- Then re-import and deploy as above.

To change a pass rule (question count, gate count or a part rule such as "≥12 of 15 in Part 6"), edit the `EXAMS` list at the top of `scripts/import-notion.mjs`. The pass mark is always 80% of the questions, rounded up. Retake timing lives in `functions/_lib/exams.ts` (`RETAKE_WAIT_MS`, `WINDOW_MS`, `MAX_ATTEMPTS`).

Attempts already in progress keep the question set they started with, because each attempt stores its own layout. Answers are graded against the deployed data.

## Adding an admin email

Two places, both required:

1. **Cloudflare Access:** in **Zero Trust → Access → Applications → Narqix Academy admin → Policies → Hiring team**, add the email to **Include → Emails** and save.
2. **The app's allow-list:** add the email to `ADMIN_EMAILS` in `wrangler.toml` (comma-separated), then redeploy:

```bash
npm run deploy
```

Remove someone the same way, from both places.

## Hiring team dashboard

`/admin/` shows every candidate with these columns:
- name, phone, email, district and CV link;
- track and progress % through their track's learning path;
- every exam attempt with its score;
- certificate status.

Filter by track, certificate status or hiring status, and search by name, phone, email or district. Sort with **Pre-Certified first**, newest or most progress. **Export CSV** downloads the filtered list. The **New / Contacted / Interview / Hired** buttons record the hiring status, and each change is logged with the admin's email in `status_history`.

To revoke a certificate (it then shows "Revoked" on its verify page):

```bash
npx wrangler d1 execute narqix-academy --remote --command "UPDATE certificates SET status='revoked' WHERE id='NQX-XXXX-XXXX'"
```

© Narqix Academy
