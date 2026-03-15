import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AppLayout from '@/components/layout/AppLayout';

// Pages
import Landing from './pages/Landing';
import Studio from './pages/Studio';
import Result from './pages/Result';
import Catalog from './pages/Catalog';
import TryOnLinks from './pages/TryOnLinks';
import Account from './pages/Account';
import CustomerTryOn from './pages/CustomerTryOn';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#FAFAF8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#E8B86D]/30 border-t-[#E8B86D] rounded-full animate-spin" />
          <span className="font-playfair text-xl font-bold text-[#1A1A2E]">Just Fit It</span>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/try/:code" element={<CustomerTryOn />} />

      {/* Authenticated app shell */}
      <Route element={<AppLayout />}>
        <Route path="/studio" element={<Studio />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/tryon-links" element={<TryOnLinks />} />
        <Route path="/account" element={<Account />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App