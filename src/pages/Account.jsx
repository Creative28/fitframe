import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AppHeader from '@/components/layout/AppHeader';
import { LogOut, ChevronRight, Store, Bell, Trash2 } from 'lucide-react';
import CreditsModal from '@/components/studio/CreditsModal';
import TopUpModal from '@/components/studio/TopUpModal';
import GenerationsCard from '@/components/account/GenerationsCard';

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [saving, setSaving] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('unsubscribe') === '1') {
      base44.auth.me().then(u => {
        if (u) {
          base44.auth.updateMe({ receive_marketing_emails: false });
          setUser(prev => prev ? { ...prev, receive_marketing_emails: false } : prev);
        }
      }).catch(() => {});
    }
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

  const handleTopUpSuccess = async () => {
    const u = await base44.auth.me();
    setUser(u);
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

        {/* Generations card */}
        <GenerationsCard
          user={user}
          onUpgrade={() => setShowCreditsModal(true)}
          onTopUp={() => setShowTopUpModal(true)}
        />

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

        {/* Email Preferences */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-playfair text-base font-bold text-[#1A1A2E] mb-3 flex items-center gap-2">
            <Bell size={16} /> Email Preferences
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-dm text-gray-700">Marketing & announcement emails</p>
              <p className="text-xs font-dm text-gray-400 mt-0.5">New features, models, and promotions</p>
            </div>
            <button
              onClick={async () => {
                const newVal = !(user?.receive_marketing_emails ?? true);
                await base44.auth.updateMe({ receive_marketing_emails: newVal });
                setUser(prev => ({ ...prev, receive_marketing_emails: newVal }));
              }}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                (user?.receive_marketing_emails ?? true) ? 'bg-[#1A1A2E]' : 'bg-gray-200'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                (user?.receive_marketing_emails ?? true) ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border border-red-200 text-red-500 rounded-2xl font-dm font-medium text-sm hover:bg-red-50"
        >
          <Trash2 size={16} />
          Delete Account
        </button>

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
      {showTopUpModal && (
        <TopUpModal
          onClose={() => setShowTopUpModal(false)}
          onSuccess={handleTopUpSuccess}
        />
      )}

      {/* Delete Account Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h2 className="font-playfair text-xl font-bold text-[#1A1A2E] text-center mb-2">Delete Account?</h2>
            <p className="text-sm font-dm text-gray-500 text-center mb-6">
              This will permanently delete your account and all your data — photos, garments, and try-on links. This cannot be undone.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={async () => {
                  setDeleting(true);
                  try {
                    await base44.auth.updateMe({ is_deleted: true, deleted_reason: 'user_requested' });
                    base44.auth.logout();
                  } catch (e) {
                    console.error(e);
                    setDeleting(false);
                  }
                }}
                disabled={deleting}
                className="w-full py-3.5 bg-red-500 text-white rounded-2xl font-dm font-semibold text-sm hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Yes, Delete My Account'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-dm font-semibold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}