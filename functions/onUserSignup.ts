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

    console.log(`[onUserSignup] Granted 5 credits to ${userEmail}`);
    return Response.json({ ok: true, credits_granted: 5 });
  } catch (error) {
    console.error('[onUserSignup] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});