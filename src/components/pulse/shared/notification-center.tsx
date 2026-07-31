'use client';

import React, { useState } from 'react';
import {
  Tag,
  Crown,
  Star,
  Target,
  Brain,
  Heart,
  Bell,
  CheckCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// ============================================================
// Types & Mock Data
// ============================================================

interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  icon: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Happy Hour запущен',
    desc: 'Акция активна с 18:00 до 20:00',
    time: '5 мин назад',
    read: false,
    icon: 'Tag',
  },
  {
    id: '2',
    title: 'Новый VIP-клиент',
    desc: 'Айдана К. перешла на уровень Золото',
    time: '12 мин назад',
    read: false,
    icon: 'Crown',
  },
  {
    id: '3',
    title: 'Отзыв от клиента',
    desc: 'Новый 5-звёздочный отзыв на Google',
    time: '1 час назад',
    read: false,
    icon: 'Star',
  },
  {
    id: '4',
    title: 'Цель обновлена',
    desc: 'Прибыль за месяц: +9% (цель: +20%)',
    time: '3 часа назад',
    read: true,
    icon: 'Target',
  },
  {
    id: '5',
    title: 'AI рекомендация',
    desc: 'Рекомендуем увеличить запас арабики',
    time: '5 часов назад',
    read: true,
    icon: 'Brain',
  },
  {
    id: '6',
    title: 'Программа лояльности',
    desc: '3 клиента получили уровень Серебро',
    time: 'вчера',
    read: true,
    icon: 'Heart',
  },
];

const iconMap: Record<string, React.ElementType> = {
  Tag,
  Crown,
  Star,
  Target,
  Brain,
  Heart,
};

const iconColorMap: Record<string, string> = {
  Tag: 'text-amber-400 bg-amber-500/15',
  Crown: 'text-yellow-400 bg-yellow-500/15',
  Star: 'text-green-400 bg-green-500/15',
  Target: 'text-purple-400 bg-purple-500/15',
  Brain: 'text-cyan-400 bg-cyan-500/15',
  Heart: 'text-pink-400 bg-pink-500/15',
};

// ============================================================
// Component
// ============================================================

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function NotificationCenter({
  open,
  onClose,
  triggerRef,
}: NotificationCenterProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Close on click outside
  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        !(target as Element).closest('[data-notification-panel]')
      ) {
        onClose();
      }
    };

    // Small delay to avoid immediate close from the same click
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose, triggerRef]);

  return (
    <>
      {/* Backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        data-notification-panel
        className={
          'absolute right-0 top-full mt-2 z-50 w-[360px] max-w-[calc(100vw-2rem)] ' +
          'rounded-xl border border-border glass-card overflow-hidden ' +
          'shadow-2xl shadow-black/40 ' +
          'transition-all duration-300 ease-out ' +
          (open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none')
        }
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold">Уведомления</span>
            {unreadCount > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 gap-1.5"
              onClick={markAllRead}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Прочитать все
            </Button>
          )}
        </div>

        {/* List */}
        <ScrollArea className="max-h-[400px]">
          <div className="divide-y divide-border">
            {notifications.map((n) => {
              const IconComp = iconMap[n.icon] || Bell;
              const colorClass = iconColorMap[n.icon] || 'text-muted-foreground bg-muted';
              return (
                <div
                  key={n.id}
                  className={
                    'flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent/50 ' +
                    (!n.read ? 'bg-purple-500/[0.03]' : '')
                  }
                >
                  <div
                    className={
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ' +
                      colorClass
                    }
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <p
                        className={
                          'text-sm leading-snug ' +
                          (!n.read ? 'font-medium text-foreground' : 'text-muted-foreground')
                        }
                      >
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {n.desc}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1">
                      {n.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
