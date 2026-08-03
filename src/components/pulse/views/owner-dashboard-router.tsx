'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

// Owner views
import {
  DashboardView,
  TodayView,
  ToolsView,
  SalesView,
  ClientsView,
  PromotionsView,
  AnalyticsView,
  GoalsView,
  SettingsView,
} from '@/components/pulse/views/owner-views';

// Other owner components
import { AIAssistant } from '@/components/pulse/ai/ai-assistant';
import { FinanceDashboard } from '@/components/pulse/finance/finance-dashboard';
import LoyaltyProgram from '@/components/pulse/loyalty/loyalty-program';
import { ReviewsManager } from '@/components/pulse/reviews/reviews-manager';
import { StaffOverview } from '@/components/pulse/staff/staff-overview';
import AIContent from '@/components/pulse/smm/ai-content';
import { InventoryList } from '@/components/pulse/inventory/inventory-list';
import { ReservationsView } from '@/components/pulse/reservations/reservations-view';
import { ScheduleView } from '@/components/pulse/staff/schedule-view';
import { CashierView } from '@/components/pulse/cashier/cashier-view';
import { WaitlistView } from '@/components/pulse/waitlist/waitlist-view';
import { SuppliersView } from '@/components/pulse/suppliers/suppliers-view';

// ============================================================
// Owner Dashboard Router
// ============================================================
export function OwnerDashboard() {
  const ownerView = useAppStore((s) => s.ownerView);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState(ownerView);

  useEffect(() => {
    if (ownerView !== currentView) {
      const startTimer = requestAnimationFrame(() => {
        setIsLoading(true);
      });
      const timer = setTimeout(() => {
        setCurrentView(ownerView);
        setIsLoading(false);
      }, 200);
      return () => {
        cancelAnimationFrame(startTimer);
        clearTimeout(timer);
      };
    }
  }, [ownerView]);

  const renderView = useCallback(() => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'today':
        return <TodayView />;
      case 'ai':
        return <AIAssistant />;
      case 'tools':
        return <ToolsView />;
      case 'sales':
        return <SalesView />;
      case 'clients':
        return <ClientsView />;
      case 'promotions':
        return <PromotionsView />;
      case 'finance':
        return <FinanceDashboard />;
      case 'analytics':
        return <AnalyticsView />;
      case 'loyalty':
        return <LoyaltyProgram />;
      case 'goals':
        return <GoalsView />;
      case 'settings':
        return <SettingsView />;
      case 'reviews':
        return <ReviewsManager />;
      case 'team':
        return <StaffOverview />;
      case 'schedule':
        return <ScheduleView />;
      case 'smm':
        return <AIContent />;
      case 'inventory':
        return <InventoryList />;
      case 'reservations':
        return <ReservationsView />;
      case 'cashier':
        return <CashierView />;
      case 'waitlist':
        return <WaitlistView />;
      case 'suppliers':
        return <SuppliersView />;
      default:
        return <DashboardView />;
    }
  }, [currentView]);

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-4 md:p-6 lg:p-8 space-y-6"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-48 rounded-xl" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="p-4 md:p-6 lg:p-8"
            >
              {renderView()}
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
