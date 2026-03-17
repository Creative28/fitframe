/**
 * Shared credit / generation utility helpers.
 */

export const PLAN_MONTHLY_CREDITS = {
  free: 5,
  starter: 30,
  growth: 150,
  pro: Infinity,
};

export const PLAN_LABELS = { free: 'Free', starter: 'Starter', growth: 'Growth', pro: 'Pro' };
export const PLAN_COLORS = {
  free: 'bg-gray-100 text-gray-600',
  starter: 'bg-blue-100 text-blue-700',
  growth: 'bg-[#E8B86D]/20 text-[#1A1A2E]',
  pro: 'bg-[#1A1A2E] text-white',
};

export const TOPUP_PACKS = [
  { id: 'pack_10', credits: 10, price: 5, label: '10 generations', badge: null },
  { id: 'pack_30', credits: 30, price: 10, label: '30 generations', badge: 'Best Value' },
  { id: 'pack_100', credits: 100, price: 25, label: '100 generations', badge: null },
];

/** Returns days until the next 1st of month */
export function daysUntilReset() {
  const now = new Date();
  const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const diff = nextReset - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/** Returns the next reset date string, e.g. "April 1" */
export function nextResetLabel() {
  const now = new Date();
  const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextReset.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

/** Returns current month label, e.g. "March" */
export function currentMonthLabel() {
  return new Date().toLocaleDateString('en-US', { month: 'long' });
}

/** Returns used credits this month */
export function usedCredits(user) {
  const plan = user?.plan || 'free';
  const total = PLAN_MONTHLY_CREDITS[plan];
  if (total === Infinity) return 0;
  const remaining = user?.credits_remaining ?? 0;
  return Math.max(0, total - remaining);
}

/** Determine warning level: 'empty' | 'low' | 'warning' | 'ok' */
export function creditWarningLevel(user) {
  const remaining = user?.credits_remaining ?? 0;
  const plan = user?.plan || 'free';
  const total = PLAN_MONTHLY_CREDITS[plan];
  if (total === Infinity) return 'ok';
  if (remaining <= 0) return 'empty';
  if (remaining <= 5) return 'low';
  if (remaining / total <= 0.2) return 'warning';
  return 'ok';
}