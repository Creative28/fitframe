import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Entity automation payload: { event, data }
    const { event, data } = body;

    if (event?.type !== 'create') {
      return Response.json({ ok: true, skipped: true });
    }

    const userId = data?.id;
    const userEmail = data?.email;

    if (!userId || !userEmail) {
      return Response.json({ error: 'Missing user data' }, { status: 400 });
    }

    // Grant 5 free credits to new user
    await base44.asServiceRole.entities.CreditTransaction.create({
      amount: 5,
      type: 'signup_bonus',
      description: '5 free credits on signup',
      created_by: userEmail
    });

    // Set credits_remaining on the user
    // We use asServiceRole since this runs without user auth context
    const users = await base44.asServiceRole.entities.User.filter({ id: userId });
    if (users.length > 0) {
      await base44.asServiceRole.entities.User.update(userId, { credits_remaining: 5 });
    }

    // Send welcome email
    const userName = data?.full_name || 'there';
    const APP_URL = 'https://preview-sandbox--69b7303524165a13c96d4537.base44.app';
    const welcomeHtml = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#FAFAF8;">
        <h1 style="font-family:Georgia,serif;font-size:28px;color:#1A1A2E;margin-bottom:8px;">Welcome to Just Fit It, ${userName}! 👋</h1>
        <p style="color:#555;font-size:15px;line-height:1.6;">You're now part of the fastest way to create professional model photos for your clothing items — no studio, no models, no hassle.</p>

        <div style="background:#fff;border-radius:16px;padding:24px;margin:24px 0;border:1px solid #eee;">
          <p style="font-weight:700;color:#1A1A2E;margin-bottom:12px;font-size:15px;">Here's how it works:</p>
          <ol style="color:#555;font-size:14px;line-height:2;padding-left:20px;margin:0;">
            <li>📸 Upload a photo of your clothing item (flat-lay, hanger, or mannequin)</li>
            <li>🧍 Pick an AI model that fits your brand</li>
            <li>✨ Get a professional model photo in ~10 seconds</li>
            <li>📥 Download and start selling</li>
          </ol>
        </div>

        <div style="background:#1A1A2E;border-radius:12px;padding:16px 24px;margin:16px 0;display:flex;align-items:center;gap:8px;">
          <span style="color:#E8B86D;font-size:20px;">✦</span>
          <span style="color:#fff;font-size:15px;font-weight:600;">You have <span style="color:#E8B86D;">5 free credits</span> waiting for you — no card needed.</span>
        </div>

        <a href="${APP_URL}/studio" style="display:inline-block;background:#1A1A2E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;margin-top:8px;">
          Create Your First Photo →
        </a>

        <p style="color:#aaa;font-size:13px;margin-top:32px;">Questions? Just reply to this email — we're happy to help.</p>
        <p style="color:#aaa;font-size:13px;">— The Just Fit It Team</p>
      </div>
    `;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: userEmail,
      subject: 'Welcome to Just Fit It — create your first AI model photo ✨',
      body: welcomeHtml,
      from_name: 'Just Fit It'
    });

    console.log(`[onUserSignup] Granted 5 credits and sent welcome email to ${userEmail}`);
    return Response.json({ ok: true, credits_granted: 5 });
  } catch (error) {
    console.error('[onUserSignup] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});