// ============================================================
//  MyBrandFather — lead handler (Vercel serverless function)
//  Receives quote + contact form submissions and emails them
//  to your inbox via Resend. No external form service needed.
// ============================================================
//
//  SETUP (see SETUP.md): set these in Vercel → Project → Settings → Environment Variables
//    RESEND_API_KEY   your key from resend.com  (free: 3,000 emails/mo)
//    LEAD_TO_EMAIL    inbox where leads should arrive  (e.g. you@gmail.com)
//    LEAD_FROM_EMAIL  a verified sender on your domain (e.g. leads@mybrandfather.com)
//
//  Until RESEND_API_KEY is set, the function still returns success
//  and logs the lead, so the site never errors during testing.
// ============================================================

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

    // --- Honeypot: bots fill hidden fields; humans don't ---
    if (body.company_website) {
      return res.status(200).json({ ok: true }); // silently drop spam
    }

    const type = (body.type || 'Lead').toString().slice(0, 40);
    const name = (body.name || '').toString().slice(0, 120);
    const email = (body.email || '').toString().slice(0, 160);
    const phone = (body.phone || '').toString().slice(0, 60);

    // basic email sanity
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'Invalid email' });
    }

    // Build a readable lead body from whatever fields were sent
    const skip = new Set(['type', 'company_website']);
    const lines = Object.entries(body)
      .filter(([k, v]) => !skip.has(k) && v !== undefined && v !== '')
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`);

    const subject = `New ${type} — MyBrandFather${name ? ' — ' + name : ''}`;
    const text = `New ${type} from the MyBrandFather website\n\n${lines.join('\n')}\n`;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO = process.env.LEAD_TO_EMAIL;
    const FROM = process.env.LEAD_FROM_EMAIL || 'leads@mybrandfather.com';

    // If not configured yet, accept the lead so the UI works during setup
    if (!RESEND_API_KEY || !TO) {
      console.log('[lead] (email not configured yet)\n' + text);
      return res.status(200).json({ ok: true, note: 'logged (email not configured)' });
    }

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `MyBrandFather Leads <${FROM}>`,
        to: [TO],
        reply_to: email,
        subject,
        text,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error('[lead] Resend error', r.status, detail);
      return res.status(502).json({ ok: false, error: 'Email send failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[lead] handler error', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}
