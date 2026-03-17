import { useState } from 'react';
import { X, Sparkles, Package } from 'lucide-react';
import { TOPUP_PACKS } from '@/lib/creditUtils';
import { base44 } from '@/api/base44Client';

export default function TopUpModal({ onClose, onSuccess }) {
  const [purchasing, setPurchasing] = useState(null);

  const handlePurchase = async (pack) => {
    setPurchasing(pack.id);
    try {
      // Fetch current user to update
      const user = await base44.auth.me();
      const newTopup = (user.topup_credits || 0) + pack.credits;

      // Set expiry 12 months from now
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);

      await base44.auth.updateMe({
        topup_credits: newTopup,
        topup_expires_at: expires.toISOString(),
      });

      await base44.entities.CreditTransaction.create({
        amount: pack.credits,
        type: 'purchase',
        description: `Top-up: ${pack.label} ($${pack.price})`,
      });

      onSuccess?.(pack);
      onClose();
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center px-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 pb-10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-playfair text-2xl font-bold text-[#1A1A2E]">Top Up Generations</h2>
            <p className="text-gray-500 font-dm text-sm mt-1">Purchased credits never expire — valid 12 months</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-3 mt-5">
          {TOPUP_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`relative p-4 rounded-2xl border-2 ${
                pack.badge ? 'border-[#E8B86D] bg-[#E8B86D]/5' : 'border-gray-100'
              }`}
            >
              {pack.badge && (
                <span className="absolute -top-3 left-4 bg-[#E8B86D] text-[#1A1A2E] text-xs font-semibold px-3 py-1 rounded-full font-dm">
                  {pack.badge}
                </span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-[#E8B86D]" />
                    <p className="font-playfair text-lg font-bold text-[#1A1A2E]">{pack.label}</p>
                  </div>
                  <p className="text-xs text-gray-400 font-dm mt-0.5">Never expire · valid 12 months</p>
                </div>
                <div className="text-right">
                  <p className="font-playfair text-2xl font-bold text-[#1A1A2E]">${pack.price}</p>
                  <p className="text-xs text-gray-400 font-dm">${(pack.price / pack.credits).toFixed(2)}/gen</p>
                </div>
              </div>
              <button
                onClick={() => handlePurchase(pack)}
                disabled={!!purchasing}
                className={`mt-3 w-full py-3 rounded-xl font-dm font-semibold text-sm transition-colors ${
                  pack.badge
                    ? 'bg-[#1A1A2E] text-white hover:bg-[#2a2a4e]'
                    : 'bg-gray-100 text-[#1A1A2E] hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {purchasing === pack.id ? 'Processing…' : `Buy ${pack.credits} generations`}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 font-dm mt-4">
          Top-ups stack on top of your monthly plan.
        </p>
      </div>
    </div>
  );
}