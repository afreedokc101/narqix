# Finish setting up Narqix Academy

Already done:
- **The site:** live at **https://academy.narqix.com**.
- **The admin dashboard:** at **https://narqix-academy.pages.dev/admin/**, locked to the hiring-team emails.
- **The NDA flow:** candidates create an account, download the NDA on the welcome page, sign it and upload it. Lessons, exams and the dashboard stay locked until the hiring team approves the NDA in the admin dashboard.
- **Applying:** link your socials straight to **https://academy.narqix.com/signup/**. Creating an account is the application, so no Google Form is needed. If you still want a Google Form, put that link in the form's confirmation message: Settings → Presentation → Confirmation message.

One step is left.

---

## Turn on the automatic emails (about 3 minutes)

The site sends its emails from the **hiring@narqix.com** mailbox you already have on Hostinger. It only needs that mailbox's password:

1. **Check the mailbox exists** in **Hostinger → Emails → narqix.com**. If hiring@narqix.com isn't listed, create it there.
2. In Cloudflare, go to **Workers & Pages → narqix-academy → Settings → Variables and Secrets → Add**.
3. **Type:** Secret, **Name:** `SMTP_PASSWORD`, **Value:** the password of hiring@narqix.com, then **Save**.
4. **Tell Claude it's done.** Claude redeploys the site so it picks up the password, then sends a test email.

These emails then go out automatically:
- **To the candidate,** after uploading: "We received your signed NDA".
- **To the hiring team,** at the same moment: "New NDA to review", with a link to the dashboard.
- **To the candidate,** after approval: "You are in", with a login link.
- **To the candidate,** after a rejection: "Please upload your NDA again", with the reason.
- **To candidates who forget their password:** a login code.

Until then, nothing is emailed. The site still works: the hiring team checks the dashboard, and candidates see their status on the welcome page.

If you ever change that mailbox's password in Hostinger, update `SMTP_PASSWORD` in Cloudflare too.

---

## Before asking Claude to redeploy

A redeploy needs the exam answer files, which are never stored in git. If you start a new Claude session, attach the Notion export zip (**Narqix Academy · Bangladesh → ⋯ → Export → Markdown & CSV, Include subpages**) with your message.
