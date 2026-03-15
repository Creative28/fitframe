import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AppHeader from '@/components/layout/AppHeader';
import { Sparkles, CreditCard, LogOut, ChevronRight, Store, User, Check } from 'lucide-react';
import CreditsModal from '@/components/studio/CreditsModal';

const PLAN_LABELS = { free: 'Free', starter: 'Starter', growth: 'Growth', pro: 'Pro' };
const PLAN_COLORS = { free: 'bg-gray-100 text-gray-600', starter: 'bg-blue-100 text-blue-700', growth: 'bg-[#E8B86D]/20 text-[#1A1A2E]', pro: 'bg-[#1A1A2E] text-white' };

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [saving, setSaving] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const u = await base44.auth.me();
      setUser(u);
      setBusinessName(u.business_name || '');
      const txns = await base44.entities.CreditTransaction.filter({ created_by: u.email }, '-created_date', 10);
      setTransactions(txns);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveBusiness = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ business_name: businessName });
      setUser(prev => ({ ...prev, business_name: businessName }));
      setEditingBusiness(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8]">
        <AppHeader title="Account" />
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#E8B86D]/30 border-t-[#E8B86D] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const credits = user?.credits_remaining ?? 5;
  const plan = user?.plan || 'free';

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <AppHeader title="Account" />
      <div className="px-4 py-6 flex flex-col gap-4">

        {/* Profile card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-[#1A1A2E] flex items-center justify-center">
              <span className="text-white font-playfair text-xl font-bold">
                {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="font-playfair text-lg font-bold text-[#1A1A2E]">{user?.full_name || 'Seller'}</p>
              <p className="text-sm text-gray-400 font-dm">{user?.email}</p>
            </div>
          </div>

          {editingBusiness ? (
            <div className="flex gap-2">
              <input
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="Your business name"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-dm"
              />
              <button
                onClick={saveBusiness}
                disabled={saving}
                className="px-4 py-2 bg-[#1A1A2E] text-white rounded-xl text-sm font-dm font-medium"
              >
                {saving ? '…' : 'Save'}
              </button>
              <button onClick={() => setEditingBusiness(false)} className="px-3 py-2 bg-gray-100 rounded-xl text-sm font-dm">
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingBusiness(true)}
              className="flex items-center gap-2 text-sm font-dm text-gray-500 hover:text-[#1A1A2E]"
            >
              <Store size={14} />
              {user?.business_name || 'Add your business name'}
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Credits */}
        <div className="bg-[#1A1A2E] rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-dm text-sm text-white/60">Credits remaining</p>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles size={18} className="text-[#E8B86D]" />
                <span className="font-playfair text-3xl font-bold">{credits}</span>
              </div>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-sm font-dm font-semibold ${PLAN_COLORS[plan]}`}>
              {PLAN_LABELS[plan]}
            </span>
          </div>
          <button
            onClick={() => setShowCreditsModal(true)}
            className="w-full py-3 bg-[#E8B86D] text-[#1A1A2E] rounded-xl font-dm font-semibold text-sm hover:bg-[#d4a55e] transition-colors"
          >
            Upgrade Plan
          </button>
        </div>

        {/* Credit history */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <h3 className="font-playfair text-base font-bold text-[#1A1A2E] mb-3">Recent Activity</h3>
            <div className="flex flex-col gap-2">
              {transactions.map(txn => (
                <div key={txn.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <p className="text-sm font-dm text-gray-600">{txn.description || txn.type}</p>
                  <span className={`font-dm font-semibold text-sm ${txn.amount > 0 ? 'text-green-500' : 'text-gray-500'}`}>
                    {txn.amount > 0 ? '+' : ''}{txn.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sign out */}
        <button
          onClick={() => base44.auth.logout()}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border border-gray-200 text-gray-500 rounded-2xl font-dm font-medium text-sm hover:bg-gray-50"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {showCreditsModal && <CreditsModal onClose={() => setShowCreditsModal(false)} />}
    </div>
  );
}