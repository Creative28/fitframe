import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Admin only
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { subject, body_html, preview_text } = await req.json();
    if (!subject || !body_html) {
      return Response.json({ error: 'Missing subject or body_html' }, { status: 400 });
    }

    // Get all opted-in users
    const users = await base44.asServiceRole.entities.User.list();
    const recipients = users.filter(u => u.receive_marketing_emails !== false && u.email);

    const APP_URL = 'https://preview-sandbox--69b7303524165a13c96d4537.base44.app';

    let sent = 0;
    let failed = 0;

    for (const recipient of recipients) {
      const unsubscribeUrl = `${APP_URL}/account?unsubscribe=1&email=${encodeURIComponent(recipient.email)}`;

      const fullHtml = `
        ${body_html}
        <br/><br/>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="font-size:12px;color:#999;text-align:center;font-family:sans-serif;">
          You're receiving this because you signed up for Just Fit It.<br/>
          <a href="${unsubscribeUrl}" style="color:#999;">Unsubscribe</a>
        </p>
      `;

      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: recipient.email,
          subject,
          body: fullHtml,
          from_name: 'Just Fit It'
        });
        sent++;
      } catch (e) {
        console.error(`Failed to send to ${recipient.email}:`, e.message);
        failed++;
      }
    }

    console.log(`[sendMarketingEmail] Sent: ${sent}, Failed: ${failed}`);
    return Response.json({ ok: true, sent, failed, total: recipients.length });

  } catch (error) {
    console.error('[sendMarketingEmail] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});