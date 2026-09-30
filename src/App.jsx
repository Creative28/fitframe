import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AppLayout from '@/components/layout/AppLayout';
import { ChatProvider } from '@/lib/ChatContext';
import ChatBubble from '@/components/chat/ChatBubble';
import ErrorBoundary from '@/components/ErrorBoundary';

// Pages
const Landing = lazy(() => import('./pages/Landing'));
const Studio = lazy(() => import('./pages/Studio'));
const Result = lazy(() => import('./pages/Result'));
const Catalog = lazy(() => import('./pages/Catalog'));
const TryOnLinks = lazy(() => import('./pages/TryOnLinks'));
const Account = lazy(() => import('./pages/Account'));
const CustomerTryOn = lazy(() => import('./pages/CustomerTryOn'));
const MyPhotos = lazy(() => import('./pages/MyPhotos.jsx'));
const BulkStudio = lazy(() => import('./pages/BulkStudio.jsx'));

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
          <span className="font-playfair text-xl font-bold text-brand-text">Just Fit It</span>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    // For auth_required, still render public routes
  }

  return (
    <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center bg-brand-bg"><div className="w-8 h-8 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" /></div>}>
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<><Landing /><ChatBubble /></>} />
      <Route path="/Landing" element={<><Landing /><ChatBubble /></>} />
      <Route path="/try/:code" element={<CustomerTryOn />} />

      {/* Authenticated app shell */}
      <Route element={<AppLayout />}>
        <Route path="/studio" element={<Studio />} />
        <Route path="/bulk-studio" element={<BulkStudio />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="/my-photos" element={<MyPhotos />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/tryon-links" element={<TryOnLinks />} />
        <Route path="/account" element={<Account />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <ChatProvider>
            <Router>
              <AuthenticatedApp />
            </Router>
            <Toaster />
          </ChatProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App