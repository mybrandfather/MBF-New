# MyBrandFather

Creative + AI agency website — branding, web design, and AI automation under one roof.
Static site + one Vercel serverless function that emails every lead via Resend.

## Deploy
1. Push this repo to GitHub.
2. Import it in Vercel (Framework preset: **Other** — no build step).
3. Add environment variables (see `SETUP.md`): `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`.
4. Add your custom domain in Vercel → Settings → Domains.

## First-run
- Run `python3 set-details.py` once to insert your real phone / email / city.
- Full instructions in **SETUP.md**.

## Structure
- `*.html` — 7 pages (logo embedded, responsive)
- `api/lead.js` — serverless lead handler (Resend)
- `vercel.json` — clean URLs + security headers
- `sitemap.xml`, `robots.txt` — SEO
- `set-details.py` — one-shot real-details filler
