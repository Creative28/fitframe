import { Sparkles, X } from 'lucide-react';

const PLANS = [
  { name: 'Starter', price: 19, credits: 30, features: ['30 credits/mo', 'HD downloads', 'Email support'] },
  { name: 'Growth', price: 49, credits: 150, features: ['150 credits/mo', 'Unlimited try-on links', 'Priority support'], popular: true },
  { name: 'Pro', price: 99, credits: '∞', features: ['Unlimited everything', 'API access', 'Dedicated support'] },
];

export default function CreditsModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center px-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-playfair text-2xl font-bold text-[#1A1A2E]">You're out of credits</h2>
            <p className="text-gray-500 font-dm text-sm mt-1">Upgrade to keep generating</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
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