import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

let listeners = [];
let cachedCredits = null;

function notify(value) {
  cachedCredits = value;
  listeners.forEach(fn => fn(value));
}

export function useCredits() {
  const [credits, setCredits] = useState(cachedCredits);

  useEffect(() => {
    listeners.push(setCredits);
    if (cachedCredits === null) {
      base44.auth.me().then(user => {
        if (user) notify(user.credits_remaining ?? 5);
      }).catch(() => {});
    } else {
      setCredits(cachedCredits);
    }
    return () => {
      listeners = listeners.filter(fn => fn !== setCredits);
    };
  }, []);

  const refresh = useCallback(async () => {
    const user = await base44.auth.me();
    if (user) notify(user.credits_remaining ?? 5);
  }, []);

  const deduct = useCallback(async (amount = 1) => {
    const next = Math.max(0, (cachedCredits ?? 0) - amount);
    notify(next);
    await base44.auth.updateMe({ credits_remaining: next });
  }, []);

  return { credits, refresh, deduct };
}