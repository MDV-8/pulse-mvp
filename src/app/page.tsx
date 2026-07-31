'use client';

import { useAppStore } from '@/stores/app-store';

// Layout
import { Sidebar } from '@/components/pulse/layout/sidebar';
import { MobileHeader } from '@/components/pulse/layout/mobile-header';
import { ClientNav } from '@/components/pulse/layout/client-nav';
import { AdminNav } from '@/components/pulse/layout/admin-nav';

// Onboarding
import { OnboardingFlow } from '@/components/pulse/onboarding/onboarding-flow';

// Dashboard
import { PulseScore } from '@/components/pulse/dashboard/pulse-score';
import { BusinessHealth } from '@/components/pulse/dashboard/business-health';
import { AIInsight } from '@/components/pulse/dashboard/ai-insight';
import { TodayActions } from '@/components/pulse/dashboard/today-actions';
import { MetricsOverview } from '@/components/pulse/dashboard/metrics-overview';

// AI
import { AIAssistant } from '@/components/pulse/ai/ai-assistant';

// Promotions
import { PromotionsList } from '@/components/pulse/promotions/promotions-list';
import { CreatePromotion } from '@/components/pulse/promotions/create-promotion';
import { AISimulator } from '@/components/pulse/promotions/ai-simulator';
import { PromotionResults } from '@/components/pulse/promotions/promotion-results';

// Finance
import { FinanceDashboard } from '@/components/pulse/finance/finance-dashboard';

// Clients
import ClientsList from '@/components/pulse/clients/clients-list';
import Segments from '@/components/pulse/clients/segments';

// Loyalty
import LoyaltyProgram from '@/components/pulse/loyalty/loyalty-program';

// Client-facing
import ClientHome from '@/components/pulse/client-facing/client-home';
import ClientMap from '@/components/pulse/client-facing/client-map';
import ClientCoupons from '@/components/pulse/client-facing/client-coupons';

// Admin
import AdminDashboard from '@/components/pulse/admin/admin-dashboard';

// Goals & History
import Goals from '@/components/pulse/goals/goals';
import BusinessHistory from '@/components/pulse/goals/business-history';

// Other
import AICalendar from '@/components/pulse/calendar/ai-calendar';
import Competitors from '@/components/pulse/competitors/competitors';
import AIContent from '@/components/pulse/smm/ai-content';
import AudienceInsights from '@/components/pulse/audience/audience-insights';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sparkles,
  Settings,
  Moon,
  Sun,
  Store,
} from 'lucide-react';

// ============================================================
// Owner Dashboard Router
// ============================================================
function OwnerDashboard() {
  const ownerView = useAppStore((s) => s.ownerView);

  const renderView = () => {
    switch (ownerView) {
      case 'dashboard':
        return <DashboardView />;
      case 'today':
        return <TodayView />;
      case 'ai':
        return <AIAssistant />;
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
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-6 lg:p-8">{renderView()}</div>
      </ScrollArea>
    </div>
  );
}

// ============================================================
// Owner Views
// ============================================================
function DashboardView() {
  return (
    <div className="space-y-6">
      {/* PULSE Score + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PulseScore />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <AIInsight />
          <MetricsOverview />
        </div>
      </div>

      {/* Business Health */}
      <BusinessHealth />

      {/* What to do today */}
      <TodayActions />

      {/* AI Footer */}
      <div className="glass-card rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">
            Нужен совет? Задайте вопрос{' '}
            <span className="text-purple-400 font-medium">AI ассистенту</span>
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 shrink-0"
          onClick={() => useAppStore.getState().setOwnerView('ai')}
        >
          Открыть AI
        </Button>
      </div>
    </div>
  );
}

function TodayView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Что делать сегодня</h1>
        <p className="text-muted-foreground mt-1">
          AI выбрал приоритетные действия для вашего бизнеса
        </p>
      </div>
      <TodayActions />
    </div>
  );
}

function SalesView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Продажи</h1>
        <p className="text-muted-foreground mt-1">
          Анализ продаж и выручки
        </p>
      </div>
      <MetricsOverview />
      <BusinessHealth />
    </div>
  );
}

function ClientsView() {
  return (
    <div className="space-y-6">
      <ClientsList />
      <Segments />
    </div>
  );
}

function PromotionsView() {
  return (
    <div className="space-y-6">
      <PromotionsList />
      <AISimulator />
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Аналитика</h1>
        <p className="text-muted-foreground mt-1">
          Подробная аналитика вашего бизнеса
        </p>
      </div>
      <BusinessHistory />
      <AudienceInsights />
      <AICalendar />
      <Competitors />
    </div>
  );
}

function GoalsView() {
  return (
    <div className="space-y-6">
      <Goals />
      <BusinessHistory />
    </div>
  );
}

function SettingsView() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Настройки</h1>
        <p className="text-muted-foreground mt-1">
          Управление вашим профилем и бизнесом
        </p>
      </div>

      {/* Business Info */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Store className="w-5 h-5 text-purple-400" />
          Бизнес
        </h2>
        <Separator />
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Название</span>
            <span className="font-medium">Coffee & Co</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Категория</span>
            <span className="font-medium">Кофейня</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Город</span>
            <span className="font-medium">Алматы</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Размер</span>
            <span className="font-medium">Малый (1-5 сотрудников)</span>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          Внешний вид
        </h2>
        <Separator />
        <div className="flex items-center justify-between">
          <span>Тема оформления</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="gap-2"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4" /> Светлая тема
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" /> Тёмная тема
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Account */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Аккаунт</h2>
        <Separator />
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Тип аккаунта</span>
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
              Демо
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Версия</span>
            <span className="font-medium">PULSE MVP v1.0</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card rounded-xl p-6 space-y-4 border-red-500/20">
        <h2 className="text-lg font-semibold text-red-400">Опасная зона</h2>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Сбросить данные</p>
            <p className="text-sm text-muted-foreground">
              Удалить все демо-данные и начать заново
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              useAppStore.getState().setAppMode('onboarding');
            }}
          >
            Сбросить
          </Button>
        </div>
      </div>
    </div>
  );
}

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
        return <ClientProfile />;
      default:
        return <ClientHome />;
    }
  };

  return (
    <div className="flex-1 overflow-hidden pb-20 md:pb-0">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-6 lg:p-8">{renderView()}</div>
      </ScrollArea>
      <ClientNav />
    </div>
  );
}

function ClientBonuses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Мои бонусы</h1>
        <p className="text-muted-foreground mt-1">
          Накопленные баллы и уровень лояльности
        </p>
      </div>
      <div className="glass-card rounded-xl p-6 text-center space-y-4">
        <p className="text-sm text-muted-foreground uppercase tracking-wider">
          Ваш баланс
        </p>
        <p className="text-5xl font-bold pulse-text-gradient">2 480</p>
        <p className="text-muted-foreground">баллов</p>
        <Separator />
        <div className="flex justify-around">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">Серебро</p>
            <p className="text-xs text-muted-foreground">Уровень</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">2 500</p>
            <p className="text-xs text-muted-foreground">до Золота</p>
          </div>
        </div>
      </div>
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h3 className="font-semibold">Преимущества уровня Серебро</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Накопление 1.5₸ = 1 балл
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Сюрприз на день рождения
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Персональные предложения
          </li>
        </ul>
      </div>
      <div className="glass-card rounded-xl p-6 space-y-3">
        <h3 className="font-semibold">Реферальная программа</h3>
        <p className="text-sm text-muted-foreground">
          Пригласите друга и получите бонус после его первой покупки
        </p>
        <div className="bg-secondary rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground mb-2">Ваш промокод</p>
          <p className="text-2xl font-mono font-bold text-purple-400 tracking-widest">
            PULSE-USER-4821
          </p>
        </div>
        <Button variant="outline" className="w-full">
          Скопировать код
        </Button>
      </div>
    </div>
  );
}

function ClientFavorites() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Избранное</h1>
        <p className="text-muted-foreground mt-1">
          Сохранённые заведения и акции
        </p>
      </div>
      <div className="glass-card rounded-xl p-12 text-center">
        <p className="text-muted-foreground">Пока нет избранных</p>
        <p className="text-sm text-muted-foreground mt-1">
          Нажмите ♡ на карточке заведения, чтобы сохранить
        </p>
      </div>
    </div>
  );
}

function ClientProfile() {
  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
          <span className="text-3xl font-bold text-purple-400">А</span>
        </div>
        <div>
          <h2 className="text-xl font-bold">Айдана</h2>
          <p className="text-muted-foreground">+7 771 123 4567</p>
        </div>
      </div>
      <div className="glass-card rounded-xl p-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Баллы</span>
          <span className="font-bold text-purple-400">2 480</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Уровень</span>
          <span className="font-medium">Серебро</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Покупки</span>
          <span className="font-medium">34</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Купоны</span>
          <span className="font-medium">2</span>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => useAppStore.getState().setAppMode('owner')}
      >
        Перейти в режим бизнеса
      </Button>
    </div>
  );
}

// ============================================================
// Main Page Component
// ============================================================
export default function HomePage() {
  const appMode = useAppStore((s) => s.appMode);
  const showCreatePromotion = useAppStore((s) => s.showCreatePromotion);
  const setShowCreatePromotion = useAppStore((s) => s.setShowCreatePromotion);
  const promotionFromInsight = useAppStore((s) => s.promotionFromInsight);
  const showReturnClients = useAppStore((s) => s.showReturnClients);
  const setShowReturnClients = useAppStore((s) => s.setShowReturnClients);
  const showAIContent = useAppStore((s) => s.showAIContent);
  const setShowAIContent = useAppStore((s) => s.setShowAIContent);
  const theme = useAppStore((s) => s.theme);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen flex bg-background">
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
            <div className="hidden md:flex md:w-64 md:flex-col md:border-r border-border bg-card">
              <div className="p-6">
                <h1 className="text-xl font-bold pulse-text-gradient">PULSE</h1>
                <p className="text-xs text-muted-foreground mt-1">Клиентская часть</p>
              </div>
              <div className="flex-1" />
              <div className="p-4">
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
            <div className="hidden md:block">
              <MobileHeader />
            </div>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 md:p-6 lg:p-8">
                  <AdminDashboard />
                </div>
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
      </div>
    </div>
  );
}

// ============================================================
// Dialog Components
// ============================================================
function ReturnClientsDialog({ onClose }: { onClose: () => void }) {
  const addPromotion = useAppStore((s) => s.addPromotion);

  const handleCreate = () => {
    addPromotion({
      id: `p-${Date.now()}`,
      name: 'Возвращение клиентов',
      discount: 15,
      product: 'Любой напиток',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      audience: 'Потерянные клиенты',
      status: 'active',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-6 w-full max-w-md space-y-4">
        <div>
          <h2 className="text-xl font-bold">Вернуть клиентов</h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI создал персональное предложение для 18 потерянных клиентов
          </p>
        </div>
        <Separator />
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-muted-foreground">Бонус:</span>
            <span className="font-medium">500 ₸ на следующий визит</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-muted-foreground">Аудитория:</span>
            <span className="font-medium">18 потерянных клиентов</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-muted-foreground">Прогноз:</span>
            <span className="font-medium">Возврат 40–60% клиентов</span>
          </div>
        </div>
        <div className="bg-purple-500/10 rounded-lg p-3">
          <p className="text-xs text-purple-300">
            ⚠ AI прогноз на основе демо-данных
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Отмена
          </Button>
          <Button className="flex-1" onClick={handleCreate}>
            Создать акцию
          </Button>
        </div>
      </div>
    </div>
  );
}

function AIContentDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <AIContent />
        </div>
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
}
