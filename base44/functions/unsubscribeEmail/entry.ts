import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: 'Missing email' }, { status: 400 });
    }

    const users = await base44.asServiceRole.entities.User.filter({ email });
    if (!users || users.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    await base44.asServiceRole.entities.User.update(users[0].id, { receive_marketing_emails: false });
    console.log(`[unsubscribeEmail] Unsubscribed: ${email}`);
    return Response.json({ ok: true });

  } catch (error) {
    console.error('[unsubscribeEmail] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});