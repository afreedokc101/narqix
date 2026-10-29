# Finish setting up Narqix Academy

The site is live at **https://narqix-academy.pages.dev**. Three things are left. Do them in any order.

---

## 1. Let the hiring team into the admin dashboard (about 10 minutes)

Right now the admin page is locked to everyone. This step lets three email addresses in, using a code sent to their inbox.

1. Log in at **dash.cloudflare.com** and click **Zero Trust** in the left menu.
2. If this is your first time there, it asks for a **team name**. Type `narqix` and pick the **Free** plan. It may ask for a card even though the plan is free.
3. Go to **Access → Applications → Add an application → Self-hosted**. In newer layouts, Applications may sit under "Access controls".
4. Fill it in:
   - **Name:** `Narqix Academy admin`
   - **Session duration:** 24 hours
   - **Add two public hostnames.** Both use the domain `narqix-academy.pages.dev`: one with the path `admin`, the other with the path `api/admin`.
5. On the **Policy** step:
   - **Name:** `Hiring team`
   - **Action:** Allow
   - **Include → Emails:** `afreed@narqix.com`, `ayman@narqix.com`, `sakib@narqix.com`, `hiring@narqix.com`
6. On the login methods step, keep **One-time PIN**, then save.
7. Open the app you just made. On its **Overview** tab, copy the long code labelled **Application Audience (AUD) Tag**.
8. **Send Claude that code and your team name.** Claude adds them to `wrangler.toml` and redeploys. Both are safe to share.

After that, the team goes to **https://narqix-academy.pages.dev/admin/**, enters their email, and types the code they're sent.

---

## 2. Put the site on academy.narqix.com (about 5 minutes, plus waiting)

1. In the Cloudflare dashboard, go to **Workers & Pages → narqix-academy → Custom domains → Set up a custom domain**.
2. Type `academy.narqix.com` and continue.
3. Log in to wherever narqix.com's DNS is managed (GoDaddy, Namecheap, etc.) and add this record:

   | Type | Name / Host | Value / Points to |
   |---|---|---|
   | CNAME | `academy` | `narqix-academy.pages.dev` |

4. Wait. It usually goes live within minutes, but it can take a few hours. Cloudflare shows **Active** when it's done, and the padlock (HTTPS) is added automatically.

**Remember:** candidates can use academy.narqix.com, but the hiring team should always use the **pages.dev** address for admin. The login protection only works there, because narqix.com's DNS isn't on Cloudflare.

---

## 3. Optional: email login codes

Skip this if phone + password login is fine for candidates.

1. Sign up at **resend.com** (the free plan is enough).
2. Add the domain `narqix.com`. Resend shows you a few DNS records. Add them at your DNS provider, the same place as step 2, and wait until Resend says **Verified**.
3. In Resend, create an **API key** and copy it.
4. Store the key in Cloudflare yourself, so it never goes through chat:
   - Go to **Workers & Pages → narqix-academy → Settings → Variables and Secrets → Add**.
   - **Type:** Secret, **Name:** `RESEND_API_KEY`, **Value:** paste the key, then save.
5. Tell Claude it's done. Claude sets the sender to `Narqix Academy <academy@narqix.com>` and redeploys.

---

## Before asking Claude to redeploy

A redeploy needs the exam answer files, which are never stored in git. If you start a new Claude session, attach the Notion export zip (**Narqix Academy · Bangladesh → ⋯ → Export → Markdown & CSV, Include subpages**) with your message.
