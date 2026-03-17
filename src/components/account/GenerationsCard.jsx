import { Sparkles, RefreshCw, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import {
  PLAN_MONTHLY_CREDITS,
  PLAN_LABELS,
  PLAN_COLORS,
  daysUntilReset,
  nextResetLabel,
  currentMonthLabel,
  usedCredits,
  creditWarningLevel,
} from '@/lib/creditUtils';

export default function GenerationsCard({ user, onUpgrade, onTopUp }) {
  const plan = user?.plan || 'free';
  const monthlyTotal = PLAN_MONTHLY_CREDITS[plan];
  const isPro = plan === 'pro';
  const remaining = user?.credits_remaining ?? 0;
  const topupCredits = user?.topup_credits || 0;
  const used = usedCredits(user);
  const level = creditWarningLevel(user);
  const days = daysUntilReset();
  const resetLabel = nextResetLabel();
  const monthLabel = currentMonthLabel();
  const usePct = isPro ? 0 : Math.min(100, (used / monthlyTotal) * 100);
  const showCountdown = !isPro && (remaining / monthlyTotal) <= 0.2 && remaining > 0;

  return (
    <div className="bg-[#1A1A2E] rounded-2xl p-5 text-white">
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-dm text-sm text-white/60">{monthLabel} generations</p>
          {isPro ? (
            <div className="flex items-center gap-2 mt-1">
              <Sparkles size={18} className="text-[#E8B86D]" />
              <span className="font-playfair text-3xl font-bold">Unlimited</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5 mt-1">
              <Sparkles size={16} className="text-[#E8B86D] self-center" />
              <span className="font-playfair text-3xl font-bold">{remaining}</span>
              <span className="font-dm text-white/50 text-base">/ {monthlyTotal}</span>
            </div>
          )}
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-dm font-semibold ${PLAN_COLORS[plan]}`}>
          {PLAN_LABELS[plan]}
        </span>
      </div>

      {/* Progress bar */}
      {!isPro && (
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all ${
              level === 'empty' ? 'bg-red-500' : level === 'low' ? 'bg-orange-400' : 'bg-[#E8B86D]'
            }`}
            style={{ width: `${usePct}%` }}
          />
        </div>
      )}

      {/* Stats row */}
      {!isPro && (
        <div className="flex items-center justify-between text-xs font-dm text-white/50 mb-4">
          <span>{used} used</span>
          <span className="flex items-center gap-1">
            <RefreshCw size={10} />
            Resets {resetLabel} · {days} day{days !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Top-up credits row */}
      {topupCredits > 0 && (
        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 mb-4">
          <Package size={14} className="text-[#E8B86D]" />
          <span className="font-dm text-sm text-white/80">
            <span className="font-semibold text-white">{topupCredits}</span> purchased top-ups (never expire)
          </span>
        </div>
      )}

      {/* Countdown warning (80%+ used) */}
      {showCountdown && level === 'warning' && (
        <div className="bg-[#E8B86D]/15 border border-[#E8B86D]/30 rounded-xl px-3 py-2.5 mb-4 flex items-start gap-2">
          <TrendingUp size={14} className="text-[#E8B86D] mt-0.5 flex-shrink-0" />
          <p className="font-dm text-xs text-white/80">
            You have <span className="font-semibold text-white">{remaining} generations left</span> this month.
            Resets in <span className="font-semibold text-white">{days} days</span>.
          </p>
        </div>
      )}

      {/* Low credit warning (≤ 5) */}
      {level === 'low' && (
        <div className="bg-orange-500/15 border border-orange-400/30 rounded-xl px-3 py-2.5 mb-4 flex items-start gap-2">
          <AlertTriangle size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-dm text-xs text-white/80 mb-1.5">
              Almost out! You have <span className="font-semibold text-white">{remaining} generation{remaining !== 1 ? 's' : ''} left</span>.
            </p>
            <div className="flex gap-2">
              <button onClick={onTopUp} className="text-xs font-dm font-semibold text-[#E8B86D] underline underline-offset-2">
                Top up now →
              </button>
              <span className="text-white/30">or</span>
              <button onClick={onUpgrade} className="text-xs font-dm font-semibold text-white/70 underline underline-offset-2">
                Upgrade to Pro →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {level === 'empty' && (
        <div className="bg-red-500/15 border border-red-400/30 rounded-xl px-3 py-3 mb-4">
          <p className="font-dm text-sm font-semibold text-white mb-1">
            You've used all your generations this month!
          </p>
          <p className="font-dm text-xs text-white/70 mb-2.5">
            Your <span className="text-white font-semibold">{monthlyTotal} fresh generations</span> reset in {days} days on {resetLabel}.
          </p>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={onTopUp}
              className="w-full py-2 bg-[#E8B86D] text-[#1A1A2E] rounded-xl font-dm font-semibold text-xs hover:bg-[#d4a55e] transition-colors"
            >
              Top up now →
            </button>
            <button
              onClick={onUpgrade}
              className="w-full py-2 bg-white/10 text-white rounded-xl font-dm font-semibold text-xs hover:bg-white/20 transition-colors"
            >
              Upgrade to Pro for unlimited →
            </button>
          </div>
        </div>
      )}

      {/* CTA buttons for normal / warning states */}
      {(level === 'ok' || level === 'warning' || showCountdown) && level !== 'empty' && (
        <div className="flex gap-2">
          <button
            onClick={onTopUp}
            className="flex-1 py-3 bg-white/10 text-white rounded-xl font-dm font-semibold text-sm hover:bg-white/20 transition-colors"
          >
            Top Up
          </button>
          <button
            onClick={onUpgrade}
            className="flex-1 py-3 bg-[#E8B86D] text-[#1A1A2E] rounded-xl font-dm font-semibold text-sm hover:bg-[#d4a55e] transition-colors"
          >
            Upgrade Plan
          </button>
        </div>
      )}
    </div>
  );
}