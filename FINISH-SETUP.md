# Finish setting up Narqix Academy

Already done:
- **The site:** live at **https://academy.narqix.com**.
- **The admin dashboard:** at **https://narqix-academy.pages.dev/admin/**, locked to the hiring-team emails.
- **The NDA gate:** new accounts see a welcome page and upload their signed NDA. Lessons, exams and the dashboard stay locked until the hiring team approves the NDA in the admin dashboard.

Two things are left so that the emails go out automatically.

---

## 1. Automatic emails from the Academy (Resend, about 15 minutes)

These emails go out once this is set up:
- **To the candidate,** when their NDA is uploaded: "We received your signed NDA".
- **To the hiring team,** at the same moment: "New NDA to review", with a link to the dashboard.
- **To the candidate,** when the hiring team approves: "You are in", with a login link.
- **To the candidate,** when the hiring team rejects: "Please upload your NDA again", with the reason.

Until this is set up, nothing is emailed. The site still works: the hiring team checks the dashboard, and candidates see their status on the welcome page.

1. Sign up at **resend.com**. The free plan is enough: 3,000 emails a month, no card needed.
2. In Resend, go to **Domains → Add domain** and enter `narqix.com`.
3. Resend shows 3 or 4 DNS records (TXT and MX, for "send" and "resend._domainkey"). Add each one in **Hostinger → Domains → narqix.com → DNS / Nameservers**, the same way you added the `academy` record. Copy the **Name** and **Value** exactly.
   - These records sit on their own sub-names, such as `send` and `resend._domainkey`, so they don't touch your existing email.
4. Back in Resend, click **Verify**. Wait until it says **Verified**. It can take a few minutes, sometimes an hour.
5. In Resend, go to **API Keys → Create API key**, give it **Sending access** and copy the key. It starts with `re_`.
6. Store the key in Cloudflare yourself, so it never goes through chat:
   - Go to **Workers & Pages → narqix-academy → Settings → Variables and Secrets → Add**.
   - **Type:** Secret, **Name:** `RESEND_API_KEY`, **Value:** paste the key, then save.
7. **Switch it on:** go to **Workers & Pages → narqix-academy → Deployments**, open the menu (⋯) on the top **Production** deployment and click **Retry deployment**. The sender address `Narqix Academy <academy@narqix.com>` is already set. You can also just tell Claude it's done.

Bonus: this also turns on "email me a login code" for candidates who forget their password.

---

## 2. Automatic NDA email after someone applies (Google Form, about 10 minutes)

When someone submits your application form, they get an email with the NDA attached and the steps: sign it, create an account, upload it.

1. **Put the NDA in Google Drive** as a PDF, in the same Google account that owns the form.
2. **Make sure the form asks for an email address**, either by turning on **Settings → Responses → Collect email addresses** or with a question titled "Email". A question with "name" in its title is used for the greeting.
3. **Open the form**, then the three-dot menu at the top right → **Apps Script**.
4. **Delete everything there** and paste the whole contents of `scripts/google-form-nda-email.gs` from this repository.
5. **Find the NDA's file ID:** open the NDA in Google Drive and look at the link, `https://drive.google.com/file/d/`**`THIS-LONG-PART`**`/view`. Paste that long part between the quotes on the line `const NDA_FILE_ID = '...'`.
6. Click **Save** (the disk icon).
7. In the function dropdown at the top, choose **setup**, then click **Run**. Google asks for permissions: click **Review permissions**, pick the account, then **Advanced → Go to (project) → Allow**.
8. **Test it:** submit the form yourself with your own email. The NDA email should arrive within a minute.

The email comes from the Google account that owns the form, and replies go to hiring@narqix.com.

---

## Before asking Claude to redeploy

A redeploy needs the exam answer files, which are never stored in git. If you start a new Claude session, attach the Notion export zip (**Narqix Academy · Bangladesh → ⋯ → Export → Markdown & CSV, Include subpages**) with your message.
