import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  BusinessData,
  PulseScore,
  Promotion,
  TodayAction,
  AIInsight,
} from '@/data/mock-data';
import {
  mockBusiness,
  mockPulseScore,
  mockPromotions,
  mockTodayActions,
  mockInsights,
  mockAdminTools,
  mockAdminTemplates,
} from '@/data/mock-data';

// Admin types (used by admin-dashboard and store)
export interface AdminTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export interface AdminTemplate {
  id: string;
  name: string;
  description: string;
  discount: number;
  category: string;
}

// ============================================================
// Types
// ============================================================

export type AppMode = 'auth' | 'onboarding' | 'owner' | 'client' | 'admin';
export type OwnerView =
  | 'dashboard'
  | 'today'
  | 'ai'
  | 'sales'
  | 'clients'
  | 'promotions'
  | 'finance'
  | 'analytics'
  | 'loyalty'
  | 'goals'
  | 'settings'
  | 'reviews'
  | 'team'
  | 'smm'
  | 'inventory'
  | 'reservations'
  | 'schedule'
  | 'cashier'
  | 'waitlist'
  | 'suppliers';
export type ClientView =
  | 'home'
  | 'map'
  | 'promotions'
  | 'bonuses'
  | 'favorites'
  | 'profile';
export type AdminView =
  | 'dashboard'
  | 'tools'
  | 'templates'
  | 'users'
  | 'content';

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// ============================================================
// App Store
// ============================================================

interface AppStore {
  // App mode
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;

  // Owner views
  ownerView: OwnerView;
  setOwnerView: (view: OwnerView) => void;

  // Client views
  clientView: ClientView;
  setClientView: (view: ClientView) => void;

  // Admin views
  adminView: AdminView;
  setAdminView: (view: AdminView) => void;

  // Onboarding
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  business: BusinessData | null;
  setBusiness: (b: Partial<BusinessData>) => void;

  // Business data
  pulseScore: PulseScore;
  setPulseScore: (s: PulseScore) => void;

  // Insights
  insights: AIInsight[];
  setInsights: (insights: AIInsight[]) => void;

  // Today actions
  todayActions: TodayAction[];
  setTodayActions: (actions: TodayAction[]) => void;

  // Promotions
  promotions: Promotion[];
  setPromotions: (promotions: Promotion[]) => void;
  addPromotion: (p: Promotion) => void;

  // AI Chat
  aiChatMessages: AIChatMessage[];
  addAIChatMessage: (msg: Omit<AIChatMessage, 'id' | 'timestamp'>) => void;
  clearAIChat: () => void;

  // Client coupons
  clientCoupons: { id: string; title: string; used: boolean; code: string }[];
  addClientCoupon: (coupon: { id: string; title: string; code: string }) => void;
  useClientCoupon: (id: string) => void;

  // Admin
  isDemoAccount: boolean;

  // Mobile sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Promotion creation dialog
  showCreatePromotion: boolean;
  setShowCreatePromotion: (show: boolean) => void;
  promotionFromInsight: string | null;
  setPromotionFromInsight: (insight: string | null) => void;

  // Return clients dialog
  showReturnClients: boolean;
  setShowReturnClients: (show: boolean) => void;

  // AI Content dialog
  showAIContent: boolean;
  setShowAIContent: (show: boolean) => void;

  // Global search
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Notification state
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;

  // Auth
  userEmail: string | null;
  userName: string | null;
  isLoggedIn: boolean;
  isFirstTime: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;

  // Settings
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;

  // User Settings (persisted)
  userSettings: { name: string; email: string; city: string; businessType: string };
  setUserSettings: (s: Partial<{ name: string; email: string; city: string; businessType: string }>) => void;

  // Admin Tools (persisted)
  adminTools: AdminTool[];
  setAdminTools: (tools: AdminTool[]) => void;
  addAdminTool: (tool: AdminTool) => void;
  updateAdminTool: (id: string, updates: Partial<AdminTool>) => void;
  deleteAdminTool: (id: string) => void;
  toggleAdminTool: (id: string) => void;

  // Admin Templates (persisted)
  adminTemplates: AdminTemplate[];
  setAdminTemplates: (templates: AdminTemplate[]) => void;
  addAdminTemplate: (template: AdminTemplate) => void;
  deleteAdminTemplate: (id: string) => void;

  // Reset all data
  resetAllData: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // App mode
      appMode: 'auth',
      setAppMode: (mode) => set({ appMode: mode }),

      // Owner views
      ownerView: 'dashboard',
      setOwnerView: (view) => set({ ownerView: view }),

      // Client views
      clientView: 'home',
      setClientView: (view) => set({ clientView: view }),

      // Admin views
      adminView: 'dashboard',
      setAdminView: (view) => set({ adminView: view }),

      // Onboarding
      onboardingStep: 1,
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      business: null,
      setBusiness: (b) =>
        set((state) => ({
          business: { ...((state.business || {}) as BusinessData), ...b },
        })),

      // Business data
      pulseScore: mockPulseScore,
      setPulseScore: (s) => set({ pulseScore: s }),

      // Insights
      insights: mockInsights,
      setInsights: (insights) => set({ insights }),

      // Today actions
      todayActions: mockTodayActions,
      setTodayActions: (actions) => set({ todayActions: actions }),

      // Promotions
      promotions: mockPromotions,
      setPromotions: (promotions) => set({ promotions }),
      addPromotion: (p) =>
        set((state) => ({ promotions: [...state.promotions, p] })),

      // AI Chat
      aiChatMessages: [],
      addAIChatMessage: (msg) =>
        set((state) => ({
          aiChatMessages: [
            ...state.aiChatMessages,
            {
              ...msg,
              id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              timestamp: Date.now(),
            },
          ],
        })),
      clearAIChat: () => set({ aiChatMessages: [] }),

      // Client coupons
      clientCoupons: [],
      addClientCoupon: (coupon) =>
        set((state) => ({
          clientCoupons: [...state.clientCoupons, { ...coupon, used: false }],
        })),
      useClientCoupon: (id) =>
        set((state) => ({
          clientCoupons: state.clientCoupons.map((c) =>
            c.id === id ? { ...c, used: true } : c
          ),
        })),

      // Admin
      isDemoAccount: true,

      // Mobile sidebar
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Promotion creation
      showCreatePromotion: false,
      setShowCreatePromotion: (show) => set({ showCreatePromotion: show }),
      promotionFromInsight: null,
      setPromotionFromInsight: (insight) => set({ promotionFromInsight: insight }),

      // Return clients
      showReturnClients: false,
      setShowReturnClients: (show) => set({ showReturnClients: show }),

      // AI Content
      showAIContent: false,
      setShowAIContent: (show) => set({ showAIContent: show }),

      // Global search
      showSearch: false,
      setShowSearch: (show) => set({ showSearch: show }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Notification state
      showNotifications: false,
      setShowNotifications: (show) => set({ showNotifications: show }),

      // Auth
      userEmail: null,
      userName: null,
      isLoggedIn: false,
      isFirstTime: true,
      login: (email, name) =>
        set({
          userEmail: email,
          userName: name,
          isLoggedIn: true,
          isFirstTime: false,
        }),
      logout: () =>
        set({
          userEmail: null,
          userName: null,
          isLoggedIn: false,
          isFirstTime: true,
          appMode: 'auth',
        }),

      // Settings
      theme: 'dark',
      setTheme: (theme) => set({ theme }),

      // User Settings
      userSettings: { name: 'Coffee & Co', email: 'owner@coffee-co.kz', city: 'Алматы', businessType: 'Кофейня' },
      setUserSettings: (s) => set((state) => ({
        userSettings: { ...state.userSettings, ...s },
      })),

      // Admin Tools
      adminTools: mockAdminTools,
      setAdminTools: (tools) => set({ adminTools: tools }),
      addAdminTool: (tool) => set((state) => ({ adminTools: [...state.adminTools, tool] })),
      updateAdminTool: (id, updates) => set((state) => ({
        adminTools: state.adminTools.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      })),
      deleteAdminTool: (id) => set((state) => ({ adminTools: state.adminTools.filter((t) => t.id !== id) })),
      toggleAdminTool: (id) => set((state) => ({
        adminTools: state.adminTools.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
      })),

      // Admin Templates
      adminTemplates: mockAdminTemplates,
      setAdminTemplates: (templates) => set({ adminTemplates: templates }),
      addAdminTemplate: (template) => set((state) => ({ adminTemplates: [...state.adminTemplates, template] })),
      deleteAdminTemplate: (id) => set((state) => ({ adminTemplates: state.adminTemplates.filter((t) => t.id !== id) })),

      // Reset all data
      resetAllData: () => {
        // Clear all localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('pulse-storage');
          localStorage.removeItem('pulse-admin-tools');
          sessionStorage.clear();
        }
        // Reset store to initial defaults
        set({
          appMode: 'onboarding',
          ownerView: 'dashboard',
          clientView: 'home',
          adminView: 'dashboard',
          onboardingStep: 1,
          business: null,
          pulseScore: mockPulseScore,
          insights: mockInsights,
          todayActions: mockTodayActions,
          promotions: mockPromotions,
          aiChatMessages: [],
          clientCoupons: [],
          isDemoAccount: true,
          sidebarOpen: false,
          showCreatePromotion: false,
          promotionFromInsight: null,
          showReturnClients: false,
          showAIContent: false,
          showSearch: false,
          searchQuery: '',
          showNotifications: false,
          userEmail: null,
          userName: null,
          isLoggedIn: false,
          isFirstTime: true,
          theme: 'dark',
          userSettings: { name: 'Coffee & Co', email: 'owner@coffee-co.kz', city: 'Алматы', businessType: 'Кофейня' },
          adminTools: mockAdminTools,
          adminTemplates: mockAdminTemplates,
        });
      },
    }),
    {
      name: 'pulse-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        appMode: state.appMode,
        ownerView: state.ownerView,
        clientView: state.clientView,
        adminView: state.adminView,
        business: state.business,
        pulseScore: state.pulseScore,
        insights: state.insights,
        todayActions: state.todayActions,
        promotions: state.promotions,
        theme: state.theme,
        userEmail: state.userEmail,
        userName: state.userName,
        isLoggedIn: state.isLoggedIn,
        isFirstTime: state.isFirstTime,
        userSettings: state.userSettings,
        adminTools: state.adminTools,
        adminTemplates: state.adminTemplates,
      }),
    }
  )
);
