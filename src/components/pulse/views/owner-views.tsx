'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';

// Dashboard
import { PulseScore } from '@/components/pulse/dashboard/pulse-score';
import { BusinessHealth } from '@/components/pulse/dashboard/business-health';
import { AIInsight } from '@/components/pulse/dashboard/ai-insight';
import { TodayActionsDraggable } from '@/components/pulse/dashboard/today-actions-draggable';
import { TodayActions } from '@/components/pulse/dashboard/today-actions';
import { MetricsOverview } from '@/components/pulse/dashboard/metrics-overview';
import { WeeklyReport } from '@/components/pulse/dashboard/weekly-report';
import { AIInsightsFeed } from '@/components/pulse/dashboard/ai-insights-feed';
import { RealtimeBanner } from '@/components/pulse/dashboard/realtime-banner';
import { LiveOrders } from '@/components/pulse/dashboard/live-orders';
import { PerformanceRadar } from '@/components/pulse/dashboard/performance-radar';
import { PeakHours } from '@/components/pulse/dashboard/peak-hours';
import { RevenueGoalTracker } from '@/components/pulse/dashboard/revenue-goal-tracker';
import { ExpenseTracker } from '@/components/pulse/dashboard/expense-tracker';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useDBData } from '@/hooks/use-db-data';

// Shared
import { NotificationCenter } from '@/components/pulse/shared/notification-center';
import { WelcomeTour } from '@/components/pulse/shared/welcome-tour';
import { FeedbackPopup } from '@/components/pulse/shared/feedback-popup';
import { BottomSheet } from '@/components/pulse/shared/bottom-sheet';
import { NotificationHistory } from '@/components/pulse/shared/notification-history';
import { RevenueChart } from '@/components/pulse/shared/revenue-chart';
import { CustomerFeedback } from '@/components/pulse/shared/customer-feedback';
import { QuickStats } from '@/components/pulse/shared/quick-stats';
import { QRBusinessCard } from '@/components/pulse/shared/qr-business-card';

// Clients
import ClientsList from '@/components/pulse/clients/clients-list';
import Segments from '@/components/pulse/clients/segments';

// Promotions
import { PromotionsList } from '@/components/pulse/promotions/promotions-list';
import { AISimulator } from '@/components/pulse/promotions/ai-simulator';

// Goals & History
import Goals from '@/components/pulse/goals/goals';
import BusinessHistory from '@/components/pulse/goals/business-history';

// Other
import AICalendar from '@/components/pulse/calendar/ai-calendar';
import Competitors from '@/components/pulse/competitors/competitors';
import AudienceInsights from '@/components/pulse/audience/audience-insights';
import { ReviewsManager } from '@/components/pulse/reviews/reviews-manager';
import { StaffOverview } from '@/components/pulse/staff/staff-overview';
import { ProductSales } from '@/components/pulse/sales/product-sales';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sparkles,
  Settings,
  Moon,
  Sun,
  Store,
  Bell,
  Target,
  UserPlus,
  PenLine,
  Pencil,
  MessageSquare,
  Clock,
  Mail,
  Shield,
  Lock,
  MapPin,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

// ============================================================
// Owner Views
// ============================================================
export function DashboardView() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showFeedback, setShowFeedback] = useState(false);
  const notifBellRef = useRef<HTMLButtonElement>(null);
  const prevPromoLengthRef = useRef<number>(0);
  const showNotifications = useAppStore((s) => s.showNotifications);
  const setShowNotifications = useAppStore((s) => s.setShowNotifications);
  const promotions = useAppStore((s) => s.promotions);
  const setShowCreatePromotion = useAppStore((s) => s.setShowCreatePromotion);
  const setShowReturnClients = useAppStore((s) => s.setShowReturnClients);
  const setShowAIContent = useAppStore((s) => s.setShowAIContent);
  const setOwnerView = useAppStore((s) => s.setOwnerView);
  const [showNotifHistory, setShowNotifHistory] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts();

  // Auto-trigger feedback popup when a new promotion is created
  useEffect(() => {
    const currentLen = promotions.length;
    if (prevPromoLengthRef.current > 0 && currentLen > prevPromoLengthRef.current) {
      const timer = setTimeout(() => setShowFeedback(true), 2000);
      return () => clearTimeout(timer);
    }
    prevPromoLengthRef.current = currentLen;
  }, [promotions.length]);

  // Live clock — update every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Greeting based on time of day
  const hour = currentTime.getHours();
  const greeting =
    hour >= 5 && hour < 12
      ? 'Доброе утро'
      : hour >= 12 && hour < 17
        ? 'Добрый день'
        : hour >= 17 && hour < 22
          ? 'Добрый вечер'
          : 'Доброй ночи';

  const timeString = currentTime.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const quickActions = [
    {
      icon: Target,
      label: 'Создать акцию',
      emoji: '🎯',
      action: () => setShowCreatePromotion(true),
    },
    {
      icon: UserPlus,
      label: 'Вернуть клиентов',
      emoji: '👥',
      action: () => setShowReturnClients(true),
    },
    {
      icon: PenLine,
      label: 'Создать контент',
      emoji: '✍️',
      action: () => setShowAIContent(true),
    },
    {
      icon: MessageSquare,
      label: 'Спросить AI',
      emoji: '💬',
      action: () => setOwnerView('ai'),
    },
    {
      icon: Bell,
      label: 'Уведомления',
      emoji: '🔔',
      action: () => setShowNotifHistory(true),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Tour */}
      <WelcomeTour />

      {/* ====== Animated Pulse Line ====== */}
      <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-purple-500 to-transparent pulse-line" />

      {/* ====== Feature 4: Status Banner ====== */}
      <div>
        <div className="h-[3px] rounded-full bg-gradient-to-r from-purple-500 via-violet-400 to-purple-500 gradient-sweep" />
        <p className="text-[11px] text-muted-foreground/50 mt-1.5 tracking-wider uppercase">
          PULSE • Online • Demo Account
        </p>
      </div>

      {/* ====== Live Activity Ticker ====== */}
      <RealtimeBanner />

      {/* ====== Live Orders Feed ====== */}
      <LiveOrders />

      {/* ====== Feature 2: Greeting Banner with Live Clock ====== */}
      <div className="rounded-xl glass-card-gradient border border-purple-500/10 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold glow-text-primary">
            {greeting}, владелец{' '}
            <span className="pulse-text-gradient">Coffee & Co</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Здесь обзор вашего бизнеса за сегодня
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground shrink-0">
          <Clock className="w-4 h-4" />
          <span className="text-2xl font-mono font-semibold tabular-nums">
            {timeString}
          </span>
        </div>
      </div>

      {/* ====== Notification Bell (desktop only) ====== */}
      <div className="relative hidden md:flex justify-end">
        <button
          ref={notifBellRef}
          className="relative w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-purple-400 transition-colors"
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="Уведомления"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-purple-500 ring-2 ring-background" />
        </button>
        <NotificationCenter
          open={showNotifications}
          onClose={() => setShowNotifications(false)}
          triggerRef={notifBellRef}
        />
      </div>

      {/* ====== Section Divider: Greeting → Score ====== */}
      <div className="section-divider" aria-hidden="true">
        <span className="divider-dot" />
      </div>

      {/* ====== PULSE Score + Metrics ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PulseScore />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <AIInsight />
          <MetricsOverview />
          <WeeklyReport />
        </div>
      </div>

      {/* ====== Feature 3: Quick Actions ====== */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          Быстрые действия
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {quickActions.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className={
                'glass-card rounded-xl p-4 flex flex-col items-center gap-2.5 text-center cursor-pointer ' +
                'quick-action-glow pulse-border pulse-border-hover'
              }
            >
              <span className="text-2xl leading-none">{item.emoji}</span>
              <span className="text-xs font-medium text-muted-foreground">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ====== Business Health ====== */}
      <BusinessHealth />

      {/* ====== AI Insights Feed ====== */}
      <AIInsightsFeed />

      {/* ====== Revenue Goal Tracker ====== */}
      <RevenueGoalTracker />

      {/* ====== Section Divider: AI Feed → Radar ====== */}
      <div className="section-divider" aria-hidden="true">
        <span className="divider-dot" />
      </div>

      {/* ====== Performance Radar ====== */}
      <PerformanceRadar />

      {/* ====== Quick Stats Mini-Dashboard ====== */}
      <QuickStats />

      {/* ====== Revenue Trend Chart ====== */}
      <RevenueChart />

      {/* ====== Expense Tracker ====== */}
      <ExpenseTracker />

      {/* ====== Sales by Product ====== */}
      <ProductSales />

      {/* ====== Peak Hours Heatmap ====== */}
      <PeakHours />

      {/* ====== Customer Feedback ====== */}
      <CustomerFeedback />

      {/* ====== What to do today ====== */}
      <TodayActionsDraggable />

      {/* ====== Section Divider: Today Actions → AI Footer ====== */}
      <div className="section-divider" aria-hidden="true">
        <span className="divider-dot" />
      </div>

      {/* ====== AI Footer ====== */}
      <div className="glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">
              Нужен совет? Задайте вопрос{' '}
              <span className="text-purple-400 font-medium">AI ассистенту</span>
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 shrink-0 hover-glow self-start sm:self-auto"
          onClick={() => useAppStore.getState().setOwnerView('ai')}
        >
          Открыть AI
        </Button>
      </div>

      {/* ====== Feedback Popup ====== */}
      <FeedbackPopup open={showFeedback} onClose={() => setShowFeedback(false)} />

      {/* ====== Notification History Bottom Sheet ====== */}
      <BottomSheet
        open={showNotifHistory}
        onClose={() => setShowNotifHistory(false)}
        title="Все уведомления"
      >
        <NotificationHistory />
      </BottomSheet>
    </div>
  );
}

export function TodayView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-shadow-glow">Что делать сегодня</h1>
        <p className="text-muted-foreground mt-1">
          AI выбрал приоритетные действия для вашего бизнеса
        </p>
      </div>
      <TodayActions showHeader={false} />
    </div>
  );
}

export function SalesView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-shadow-glow">Продажи</h1>
        <p className="text-muted-foreground mt-1">
          Анализ продаж и выручки
        </p>
      </div>
      <MetricsOverview />
      <ProductSales />
      <BusinessHealth />
    </div>
  );
}

export function ClientsView() {
  return (
    <div className="space-y-6">
      <ClientsList />
      <Segments />
    </div>
  );
}

export function PromotionsView() {
  const { promotions: dbPromotions } = useDBData();
  const isSynced = dbPromotions.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Акции и промо</h1>
        {isSynced ? (
          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 text-xs gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Синхронизировано
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
            Демо режим
          </Badge>
        )}
      </div>
      <PromotionsList />
      <AISimulator />
    </div>
  );
}

export function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-shadow-glow">Аналитика</h1>
        <p className="text-muted-foreground mt-1">
          Подробная аналитика вашего бизнеса
        </p>
      </div>
      <BusinessHistory />
      <AudienceInsights />
      <AICalendar />
      <Competitors />
      <ReviewsManager />
      <StaffOverview />
    </div>
  );
}

export function GoalsView() {
  return (
    <div className="space-y-6">
      <Goals />
      <BusinessHistory />
    </div>
  );
}

export function SettingsView() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Настройки</h1>
        <p className="text-muted-foreground mt-1">
          Управление вашим профилем и бизнесом
        </p>
      </div>

      {/* Profile Section */}
      <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-violet-500/20 flex items-center justify-center border-2 border-purple-500/30 shrink-0">
            <span className="text-2xl font-bold pulse-text-gradient">CC</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">Coffee & Co</h2>
            <p className="text-sm text-muted-foreground truncate">owner@coffee-co.kz</p>
            <Badge variant="secondary" className="mt-1 bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
              Демо аккаунт
            </Badge>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 self-start shrink-0" onClick={() => toast.info('Функция редактирования профиля будет доступна в следующей версии')}>
            <Pencil className="w-3.5 h-3.5" />
            Редактировать
          </Button>
        </div>
      </div>

      {/* Business Info */}
      <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Store className="w-5 h-5 text-purple-400" />
          Бизнес
        </h2>
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-2 text-sm">
              <Store className="w-4 h-4 text-muted-foreground/50 shrink-0" />
              Название
            </span>
            <span className="font-medium text-sm truncate">Coffee & Co</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-muted-foreground/50 shrink-0" />
              Категория
            </span>
            <span className="font-medium text-sm">Кофейня</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground/50 shrink-0" />
              Город
            </span>
            <span className="font-medium text-sm">Алматы</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-2 text-sm">
              <UserPlus className="w-4 h-4 text-muted-foreground/50 shrink-0" />
              Размер
            </span>
            <span className="font-medium text-sm text-right">Малый (1-5 сотрудников)</span>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4">
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

      {/* Notifications */}
      <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-400" />
          Уведомления
        </h2>
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground/50" />
                Email уведомления
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Получайте важные обновления на почту</p>
            </div>
            <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground/50" />
                Push-уведомления
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Мгновенные уведомления в браузере</p>
            </div>
            <Switch checked={notifPush} onCheckedChange={setNotifPush} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground/50" />
                Еженедельный отчёт
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Сводка за неделю каждую пятницу</p>
            </div>
            <Switch checked={notifWeekly} onCheckedChange={setNotifWeekly} />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-400" />
          Безопасность
        </h2>
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground/50" />
                Смена пароля
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Последняя смена: 30 дней назад</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info('Функция смены пароля будет доступна в следующей версии')}>
              Изменить
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground/50" />
                Двухфакторная аутентификация
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Дополнительная защита аккаунта</p>
            </div>
            <Badge
              variant="secondary"
              className={`${twoFactor ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-muted text-muted-foreground'} text-xs cursor-pointer hover:opacity-80 transition-opacity`}
              onClick={() => {
                const next = !twoFactor;
                setTwoFactor(next);
                toast.info(next ? 'Двухфакторная аутентификация включена (демо)' : 'Двухфакторная аутентификация выключена (демо)');
              }}
            >
              {twoFactor ? 'Вкл' : 'Выкл'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4">
        <h2 className="text-lg font-semibold">Аккаунт</h2>
        <Separator />
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Версия</span>
            <span className="font-medium">PULSE MVP v1.7</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.08)]">
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
