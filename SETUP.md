# MyBrandFather — Deploy & Setup Guide

Your site is a static site **plus one serverless function** that emails you every lead.
It runs on Vercel with zero build step. Follow these steps in order.

---

## ✅ Before you go live — 3 things only you can provide

### 1. Your real contact details (5 minutes)
Right now the site uses placeholders (phone `(860) 268-7732`, email
`hello@mybrandfather.com`, city `Manchester, CT`) in ~110 places.
**Don't edit them by hand.** Instead:

1. Open `set-details.py`
2. Edit the four lines at the top with your real phone, email, and city
3. Run it once:  `python3 set-details.py`

Every page updates at once. Done.

### 2. Make the lead emails actually send (10 minutes)
The form backend uses **Resend** (free: 3,000 emails/month).

1. Create a free account at **resend.com**
2. Add & verify your domain (or use their test domain to start)
3. Copy your **API key**
4. In Vercel → your project → **Settings → Environment Variables**, add:

   | Name | Value |
   |------|-------|
   | `RESEND_API_KEY` | your key from resend.com |
   | `LEAD_TO_EMAIL` | the inbox where you want leads (e.g. you@gmail.com) |
   | `LEAD_FROM_EMAIL` | a sender on your verified domain (e.g. leads@yourdomain.com) |

5. Redeploy (Vercel does this automatically on the next push, or click "Redeploy").

> **Until you add these, the site still works** — the form shows success and the
> lead is logged in Vercel's function logs, and it also falls back to opening the
> visitor's email app. But to actually receive leads in your inbox, set the three
> variables above.

### 3. Update the domain in two files (2 minutes)
After you know your real domain, replace `mybrandfather.com` in:
- `sitemap.xml`
- `robots.txt`
- the `og:url` / schema URLs in `index.html`

---

## 🚀 Deploying to Vercel

### Easiest: drag-and-drop / Git
1. Put this whole folder in a GitHub repo (or use Vercel's CLI / dashboard import).
2. In Vercel: **Add New → Project → Import** the repo.
3. Framework preset: **Other** (it's static). No build command needed.
4. Deploy. Your `index.html` becomes the homepage automatically.
5. Add the environment variables from step 2 above.
6. Add your custom domain in **Settings → Domains**.

### Or via CLI
```
npm i -g vercel
cd this-folder
vercel            # preview deploy
vercel --prod     # production deploy
```

---

## 📁 What's in this package
- `index.html` … `terms.html` — the 7 pages (logo embedded, fully responsive)
- `api/lead.js` — serverless function that emails you each lead
- `vercel.json` — clean URLs + security headers
- `sitemap.xml`, `robots.txt` — SEO basics
- `set-details.py` — one-shot real-details filler (step 1)
- `brandfather-logo*.png` — your logo files (also embedded in the pages; handy for a favicon)

## 🔒 Notes
- Both forms have spam honeypots and a mailto fallback if the API is ever unreachable.
- The portfolio shows **concept work labeled "Concept"** and testimonials are hidden
  until you have real ones — both intentional and honest. Swap in real work as you get it.
- The legal pages (privacy, terms) are solid drafts — have an attorney review before launch.
