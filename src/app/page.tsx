'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';

// Layout
import { Sidebar } from '@/components/pulse/layout/sidebar';
import { MobileHeader } from '@/components/pulse/layout/mobile-header';
import { ClientNav } from '@/components/pulse/layout/client-nav';
import { AdminNav } from '@/components/pulse/layout/admin-nav';

// Auth
import { AuthScreen } from '@/components/pulse/auth/auth-screen';

// Onboarding
import { OnboardingFlow } from '@/components/pulse/onboarding/onboarding-flow';

// Shared
import { GlobalSearch } from '@/components/pulse/shared/global-search';
import { ToastNotifications } from '@/components/pulse/shared/toast-notifications';

// Dashboard ambient background
import { DashboardBackground } from '@/components/pulse/dashboard/dashboard-background';

// Promotions (dialog)
import { CreatePromotion } from '@/components/pulse/promotions/create-promotion';

// Client-facing
import ClientHome from '@/components/pulse/client-facing/client-home';
import ClientMap from '@/components/pulse/client-facing/client-map';
import ClientCoupons from '@/components/pulse/client-facing/client-coupons';
import { ClientProfileEnhanced } from '@/components/pulse/client-facing/client-profile-enhanced';

// Admin
import AdminDashboard from '@/components/pulse/admin/admin-dashboard';

// Extracted view files
import { OwnerDashboard } from '@/components/pulse/views/owner-dashboard-router';
import { ClientBonuses, ClientFavorites } from '@/components/pulse/views/client-views';
import { ReturnClientsDialog, AIContentDialog } from '@/components/pulse/views/dialog-views';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// ============================================================
// Client Dashboard Router
// ============================================================
function ClientDashboard() {
  const clientView = useAppStore((s) => s.clientView);

  const renderView = () => {
    switch (clientView) {
      case 'home':
        return <ClientHome />;
      case 'map':
        return <ClientMap />;
      case 'promotions':
        return <ClientCoupons />;
      case 'bonuses':
        return <ClientBonuses />;
      case 'favorites':
        return <ClientFavorites />;
      case 'profile':
        return <ClientProfileEnhanced />;
      default:
        return <ClientHome />;
    }
  };

  return (
    <div className="flex-1 overflow-hidden pb-20 md:pb-0">
      <ScrollArea className="h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={clientView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="p-4 md:p-6 lg:p-8"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </ScrollArea>
      <ClientNav />
    </div>
  );
}

// ============================================================
// Main Page Component
// ============================================================
export default function HomePage() {
  const appMode = useAppStore((s) => s.appMode);
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const setAppMode = useAppStore((s) => s.setAppMode);
  const showCreatePromotion = useAppStore((s) => s.showCreatePromotion);
  const setShowCreatePromotion = useAppStore((s) => s.setShowCreatePromotion);
  const promotionFromInsight = useAppStore((s) => s.promotionFromInsight);
  const showReturnClients = useAppStore((s) => s.showReturnClients);
  const setShowReturnClients = useAppStore((s) => s.setShowReturnClients);
  const showAIContent = useAppStore((s) => s.showAIContent);
  const setShowAIContent = useAppStore((s) => s.setShowAIContent);
  const theme = useAppStore((s) => s.theme);

  // Auto-redirect to owner if logged in but stuck on auth screen (e.g. after reload)
  useEffect(() => {
    if (appMode === 'auth' && isLoggedIn) {
      setAppMode('owner');
    }
  }, []);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen flex bg-background">
        {/* Dashboard Ambient Background (owner mode, dark theme only) */}
        {appMode === 'owner' && <DashboardBackground />}

        {/* Global Search (always rendered) */}
        <GlobalSearch />

        {/* Auth */}
        {appMode === 'auth' && <AuthScreen />}

        {/* Onboarding */}
        {appMode === 'onboarding' && (
          <div className="flex-1 flex items-center justify-center p-4">
            <OnboardingFlow />
          </div>
        )}

        {/* Owner Mode */}
        {appMode === 'owner' && (
          <>
            <Sidebar />
            <MobileHeader />
            <OwnerDashboard />
          </>
        )}

        {/* Client Mode */}
        {appMode === 'client' && (
          <>
            <div className="hidden md:flex md:w-64 md:flex-col md:border-r border-border bg-card pb-20">
              <div className="p-6">
                <h1 className="text-xl font-bold pulse-text-gradient">PULSE</h1>
                <p className="text-xs text-muted-foreground mt-1">Клиентская часть</p>
              </div>
              <div className="flex-1" />
              <div className="px-4 pb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => useAppStore.getState().setAppMode('owner')}
                >
                  Режим бизнеса
                </Button>
              </div>
            </div>
            <div className="md:hidden">
              <MobileHeader />
            </div>
            <ClientDashboard />
          </>
        )}

        {/* Admin Mode */}
        {appMode === 'admin' && (
          <>
            <AdminNav />
            <MobileHeader />
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="admin"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="p-4 md:p-6 lg:p-8"
                  >
                    <AdminDashboard />
                  </motion.div>
                </AnimatePresence>
              </ScrollArea>
            </div>
          </>
        )}

        {/* Dialogs */}
        {showCreatePromotion && (
          <CreatePromotion
            prefillDiscount={promotionFromInsight === 'happy-hour' ? 15 : undefined}
            prefillProduct={
              promotionFromInsight === 'happy-hour'
                ? 'Все кофейные напитки'
                : undefined
            }
            prefillName={
              promotionFromInsight === 'happy-hour' ? 'Happy Hour' : undefined
            }
          />
        )}

        {showReturnClients && (
          <ReturnClientsDialog onClose={() => setShowReturnClients(false)} />
        )}

        {showAIContent && (
          <AIContentDialog onClose={() => setShowAIContent(false)} />
        )}

        {/* Toast Notifications */}
        <ToastNotifications />
      </div>
    </div>
  );
}
