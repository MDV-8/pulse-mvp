import { create } from 'zustand';
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
} from '@/data/mock-data';

// ============================================================
// Types
// ============================================================

export type AppMode = 'onboarding' | 'owner' | 'client' | 'admin';
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
  | 'settings';
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

  // Settings
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // App mode
  appMode: 'onboarding',
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

  // Settings
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
}));
