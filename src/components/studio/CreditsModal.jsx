import { useState } from 'react';
import { Sparkles, X, Package } from 'lucide-react';
import TopUpModal from './TopUpModal';
import { daysUntilReset, nextResetLabel, PLAN_MONTHLY_CREDITS } from '@/lib/creditUtils';

const PLANS = [
  { name: 'Starter', price: 19, credits: 30, features: ['30 credits/mo', 'HD downloads', 'Email support'] },
  { name: 'Growth', price: 49, credits: 150, features: ['150 credits/mo', 'Unlimited try-on links', 'Priority support'], popular: true },
  { name: 'Pro', price: 99, credits: '∞', features: ['Unlimited everything', 'API access', 'Dedicated support'] },
];

export default function CreditsModal({ onClose, user }) {
  const [showTopUp, setShowTopUp] = useState(false);
  const days = daysUntilReset();
  const resetLabel = nextResetLabel();
  const plan = user?.plan || 'free';
  const monthlyTotal = PLAN_MONTHLY_CREDITS[plan];
  const isPro = plan === 'pro';

  if (showTopUp) {
    return <TopUpModal onClose={onClose} onSuccess={onClose} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center px-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 pb-10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-playfair text-2xl font-bold text-[#1A1A2E]">
              {isPro ? 'You're on Pro' : 'You're out of generations'}
            </h2>
            <p className="text-gray-500 font-dm text-sm mt-1">
              {isPro
                ? 'Unlimited generations every month.'
                : `${!isPro && monthlyTotal !== Infinity ? monthlyTotal : ''} fresh generations reset in ${days} days on ${resetLabel}.`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Top-up option at top */}
        {!isPro && (
          <button
            onClick={() => setShowTopUp(true)}
            className="w-full mt-4 flex items-center justify-between px-4 py-3.5 bg-[#E8B86D]/10 border-2 border-[#E8B86D]/40 rounded-2xl hover:bg-[#E8B86D]/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Package size={18} className="text-[#E8B86D]" />
              <div className="text-left">
                <p className="font-dm font-semibold text-[#1A1A2E] text-sm">Buy a top-up pack</p>
                <p className="font-dm text-xs text-gray-500">10, 30, or 100 generations — never expire</p>
              </div>
            </div>
            <span className="font-dm font-bold text-[#1A1A2E] text-sm">From $5 →</span>
          </button>
        )}

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs font-dm text-gray-400">or upgrade your plan</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <div className="flex flex-col gap-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-4 rounded-2xl border-2 ${
                plan.popular ? 'border-[#E8B86D] bg-[#E8B86D]/5' : 'border-gray-100'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-4 bg-[#E8B86D] text-[#1A1A2E] text-xs font-semibold px-3 py-1 rounded-full font-dm">
                  Most Popular
                </span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-playfair text-lg font-bold text-[#1A1A2E]">{plan.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Sparkles size={13} className="text-[#E8B86D]" />
                    <span className="text-sm text-gray-500 font-dm">{plan.credits} credits/mo</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-playfair text-2xl font-bold text-[#1A1A2E]">${plan.price}</p>
                  <p className="text-xs text-gray-400 font-dm">/month</p>
                </div>
              </div>
              <button className={`mt-3 w-full py-3 rounded-xl font-dm font-semibold text-sm transition-colors ${
                plan.popular
                  ? 'bg-[#1A1A2E] text-white hover:bg-[#2a2a4e]'
                  : 'bg-gray-100 text-[#1A1A2E] hover:bg-gray-200'
              }`}>
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}