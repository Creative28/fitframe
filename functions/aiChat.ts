import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const SYSTEM_PROMPT = `You are the friendly support assistant for Just Fit It — an AI fashion photo studio for clothing sellers. You help sellers understand how to use the app, troubleshoot problems, and get the most out of their subscription.

You know everything about the app:
- How to upload clothing photos
- How to pick AI models
- How to generate professional model photos
- How to download and share photos
- How to create try-on links and where to share them
- How credits work
- How pricing and plans work
- How the customer try-on experience works
- How to use the catalog
- Tips for getting the best photo results

Always be friendly, encouraging, and concise.
Give step by step guidance when needed.
Keep responses short — maximum 3-4 sentences.
If you don't know something say: 'Let me connect you with our team for that one!'

Never discuss anything unrelated to Just Fit It or clothing selling.`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'messages array required' }, { status: 400 });
    }

    const reply = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}\n\n---\n\nConversation so far:\n${messages
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n')}\n\nAssistant:`,
      model: 'claude_sonnet_4_6',
    });

    return Response.json({ reply });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});