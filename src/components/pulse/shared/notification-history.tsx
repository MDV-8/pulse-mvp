'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  TrendingUp,
  Star,
  AlertTriangle,
  Tag,
  Users,
  Brain,
  CalendarDays,
  Clock,
  FileText,
  Info,
  Rocket,
  CheckCheck,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ── Types ──────────────────────────────────────────────────

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  category: 'order' | 'analytics' | 'review' | 'warning' | 'promotion' | 'client' | 'ai' | 'reservation' | 'staff' | 'report' | 'system';
  iconColor: string;
  iconBg: string;
}

type FilterTab = 'all' | 'orders' | 'analytics' | 'ai' | 'system';

// ── Icon helper ────────────────────────────────────────────

function getNotifIcon(category: NotificationItem['category']) {
  switch (category) {
    case 'order':
      return <Bell className="w-4 h-4 text-purple-400" />;
    case 'analytics':
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    case 'review':
      return <Star className="w-4 h-4 text-amber-400" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-red-400" />;
    case 'promotion':
      return <Tag className="w-4 h-4 text-purple-400" />;
    case 'client':
      return <Users className="w-4 h-4 text-cyan-400" />;
    case 'ai':
      return <Brain className="w-4 h-4 text-purple-400" />;
    case 'reservation':
      return <CalendarDays className="w-4 h-4 text-blue-400" />;
    case 'staff':
      return <Clock className="w-4 h-4 text-violet-400" />;
    case 'report':
      return <FileText className="w-4 h-4 text-purple-400" />;
    case 'system':
    default:
      return <Info className="w-4 h-4 text-muted-foreground" />;
  }
}

function getIconBg(category: NotificationItem['category']): string {
  switch (category) {
    case 'order':
      return 'bg-purple-500/15';
    case 'analytics':
      return 'bg-green-500/15';
    case 'review':
      return 'bg-amber-500/15';
    case 'warning':
      return 'bg-red-500/15';
    case 'promotion':
      return 'bg-purple-500/15';
    case 'client':
      return 'bg-cyan-500/15';
    case 'ai':
      return 'bg-purple-500/15';
    case 'reservation':
      return 'bg-blue-500/15';
    case 'staff':
      return 'bg-violet-500/15';
    case 'report':
      return 'bg-purple-500/15';
    case 'system':
    default:
      return 'bg-muted/50';
  }
}

function getLeftGlow(category: NotificationItem['category']): string {
  switch (category) {
    case 'order':
      return 'border-l-purple-500/60';
    case 'analytics':
      return 'border-l-green-500/60';
    case 'review':
      return 'border-l-amber-500/60';
    case 'warning':
      return 'border-l-red-500/60';
    case 'promotion':
      return 'border-l-purple-500/60';
    case 'client':
      return 'border-l-cyan-500/60';
    case 'ai':
      return 'border-l-purple-500/60';
    case 'reservation':
      return 'border-l-blue-500/60';
    case 'staff':
      return 'border-l-violet-500/60';
    case 'report':
      return 'border-l-purple-500/60';
    case 'system':
    default:
      return 'border-l-muted-foreground/30';
  }
}

// ── Mock Data ──────────────────────────────────────────────

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Новый заказ #1251',
    description: 'Латте + круассан — 2,800 ₸',
    timestamp: '2 мин назад',
    read: false,
    category: 'order',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/15',
  },
  {
    id: 'n-2',
    title: 'Выручка за час: +₸12,400',
    description: 'Рост на 18% по сравнению с прошлым часом',
    timestamp: '15 мин назад',
    read: false,
    category: 'analytics',
    iconColor: 'text-green-400',
    iconBg: 'bg-green-500/15',
  },
  {
    id: 'n-3',
    title: 'Отзыв от Анны: 5⭐',
    description: '"Лучший кофе в Алматы!"',
    timestamp: '32 мин назад',
    read: false,
    category: 'review',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/15',
  },
  {
    id: 'n-4',
    title: 'Запас сиропа: низкий',
    description: 'Ванильный сироп — осталось 2 порции',
    timestamp: '1 час',
    read: true,
    category: 'warning',
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/15',
  },
  {
    id: 'n-5',
    title: 'Акция "Happy Hour" запущена',
    description: 'Скидка 30% на все напитки с 17:00 до 19:00',
    timestamp: '2 часа',
    read: true,
    category: 'promotion',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/15',
  },
  {
    id: 'n-6',
    title: 'Новый клиент: Марат',
    description: 'Зарегистрирован через QR-код',
    timestamp: '3 часа',
    read: true,
    category: 'client',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/15',
  },
  {
    id: 'n-7',
    title: 'AI рекомендация: увеличить Латте',
    description: 'Популярность +24% за неделю',
    timestamp: '4 часа',
    read: true,
    category: 'ai',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/15',
  },
  {
    id: 'n-8',
    title: 'Резервирование подтверждено',
    description: 'Столик #5 на 19:00 — 4 персоны',
    timestamp: '5 часов',
    read: true,
    category: 'reservation',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/15',
  },
  {
    id: 'n-9',
    title: 'Смена завершена: Айдана',
    description: 'Продано 47 заказов, выручка: ₸89,200',
    timestamp: '6 часов',
    read: true,
    category: 'staff',
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/15',
  },
  {
    id: 'n-10',
    title: 'Еженедельный отчёт готов',
    description: 'Подробная аналитика за прошлую неделю',
    timestamp: 'вчера',
    read: true,
    category: 'report',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/15',
  },
  {
    id: 'n-11',
    title: 'Система обновлена до v1.3',
    description: 'Новые функции: drag & drop, уведомления',
    timestamp: 'вчера',
    read: true,
    category: 'system',
    iconColor: 'text-muted-foreground',
    iconBg: 'bg-muted/50',
  },
  {
    id: 'n-12',
    title: 'PULSE запущен впервые',
    description: 'Добро пожаловать в систему управления бизнесом',
    timestamp: '2 дня назад',
    read: true,
    category: 'system',
    iconColor: 'text-muted-foreground',
    iconBg: 'bg-muted/50',
  },
];

// ── Category → filter mapping ───────────────────────────────

function categoryToFilter(cat: NotificationItem['category']): FilterTab {
  switch (cat) {
    case 'order':
      return 'orders';
    case 'analytics':
      return 'analytics';
    case 'ai':
      return 'ai';
    case 'system':
      return 'system';
    default:
      return 'all';
  }
}

// ── Filter tabs ───────────────────────────────────────────

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'orders', label: 'Заказы' },
  { key: 'analytics', label: 'Аналитика' },
  { key: 'ai', label: 'AI' },
  { key: 'system', label: 'Система' },
];

// ── Animation variants ──────────────────────────────────────

const listItem = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 12 },
};

// ── Component ──────────────────────────────────────────────

export function NotificationHistory() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filteredNotifications = useMemo(() => {
    let result = notifications;

    // Filter by tab
    if (activeFilter !== 'all') {
      result = result.filter((n) => categoryToFilter(n.category) === activeFilter);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [notifications, activeFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Уведомления
        </h2>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 gap-1.5"
            onClick={handleMarkAllRead}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Отметить все прочитанными
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
        <input
          type="text"
          placeholder="Поиск уведомлений..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 pl-9 pr-3 rounded-lg glass-card border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-colors"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap',
              activeFilter === tab.key
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted/80 hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto overscroll-contain pr-1 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.map((notif) => (
            <motion.div
              key={notif.id}
              variants={listItem}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={{ duration: 0.2 }}
              className={cn(
                'flex items-start gap-3 rounded-xl border border-border/50 bg-card p-3 transition-all duration-200',
                'hover:bg-card/80',
                !notif.read && cn(
                  'border-l-[3px]',
                  getLeftGlow(notif.category),
                  'shadow-[inset_3px_0_8px_-4px_rgba(168,85,247,0.15)]'
                )
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                  getIconBg(notif.category)
                )}
              >
                {getNotifIcon(notif.category)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className={cn(
                      'text-sm font-medium truncate',
                      notif.read ? 'text-muted-foreground' : 'text-foreground'
                    )}
                  >
                    {notif.title}
                  </h3>
                  {!notif.read && (
                    <span className="h-2 w-2 rounded-full bg-purple-500 shrink-0" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground truncate">
                  {notif.description}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground/60">
                  {notif.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredNotifications.length === 0 && (
          <div className="py-8 text-center">
            <Rocket className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Нет уведомлений
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
