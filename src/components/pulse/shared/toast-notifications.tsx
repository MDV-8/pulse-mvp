'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, Bell, X } from 'lucide-react';

type ToastType = 'ai' | 'success' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: ToastType;
}

const TOAST_CONFIG: Record<ToastType, { borderColor: string; icon: React.ReactNode; bg: string }> = {
  ai: {
    borderColor: 'border-l-purple-500',
    icon: <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />,
    bg: 'bg-purple-500/5',
  },
  success: {
    borderColor: 'border-l-emerald-500',
    icon: <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" />,
    bg: 'bg-emerald-500/5',
  },
  warning: {
    borderColor: 'border-l-amber-500',
    icon: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />,
    bg: 'bg-amber-500/5',
  },
  info: {
    borderColor: 'border-l-blue-500',
    icon: <Bell className="h-4 w-4 text-blue-400 shrink-0" />,
    bg: 'bg-blue-500/5',
  },
};

const MOCK_TOASTS: Omit<ToastMessage, 'id'>[] = [
  { title: 'Новый клиент', description: 'Айжан К. впервые в Coffee & Co', type: 'info' },
  { title: 'Рост выручки', description: 'Выручка за час +15% к среднему', type: 'success' },
  { title: 'AI рекомендация', description: 'Пополните запас молока до вечера', type: 'ai' },
  { title: 'Лояльность', description: 'Дарига получила уровень Золото', type: 'success' },
  { title: 'Отзыв', description: 'Новый 5⭐ отзыв на Google', type: 'success' },
  { title: 'Акция', description: 'Happy Hour: уже 12 использований', type: 'info' },
  { title: 'Запасы', description: 'Арабика: остаток 2 дня', type: 'warning' },
  { title: 'Прогноз', description: 'Ожидается пик в 16:00', type: 'ai' },
  { title: 'Клиент вернулся', description: 'Меруерт после 45 дней', type: 'success' },
  { title: 'Показатель', description: 'Средний чек вырос до 5480₸', type: 'success' },
  { title: 'AI анализ', description: 'Выявлена аномалия в продажах', type: 'ai' },
  { title: 'Напоминание', description: 'Срок акции заканчивается завтра', type: 'warning' },
];

const MAX_VISIBLE = 3;
const AUTO_DISMISS_MS = 5000;

let globalCounter = 0;

function generateId(): string {
  globalCounter += 1;
  return `toast-${Date.now()}-${globalCounter}`;
}

export function ToastNotifications() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const dismissedSet = useRef<Set<string>>(new Set());
  const queueRef = useRef<ToastMessage[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pickRandomToast = useCallback((): ToastMessage | null => {
    // Avoid repeating recently dismissed toasts by cycling through all
    const available = MOCK_TOASTS.filter(
      (t) => !dismissedSet.current.has(`${t.title}:${t.description}`)
    );

    // If all have been dismissed, reset tracking
    if (available.length === 0) {
      dismissedSet.current.clear();
      return null;
    }

    const chosen = available[Math.floor(Math.random() * available.length)];
    return { ...chosen, id: generateId() };
  }, []);

  const addToast = useCallback(() => {
    const toast = pickRandomToast();
    if (!toast) return;

    // Mark as recently shown so it won't repeat immediately
    dismissedSet.current.add(`${toast.title}:${toast.description}`);

    setToasts((prev) => {
      const updated = [...prev, toast];
      // If more than MAX_VISIBLE, remove the oldest
      if (updated.length > MAX_VISIBLE) {
        return updated.slice(updated.length - MAX_VISIBLE);
      }
      return updated;
    });
  }, [pickRandomToast]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Auto-dismiss after AUTO_DISMISS_MS for each toast
  useEffect(() => {
    if (toasts.length === 0) return;

    const latest = toasts[toasts.length - 1];
    const timeout = setTimeout(() => {
      dismissToast(latest.id);
    }, AUTO_DISMISS_MS);

    return () => clearTimeout(timeout);
  }, [toasts, dismissToast]);

  // Periodic toast every 15-25 seconds
  useEffect(() => {
    const scheduleNext = () => {
      const delay = 15000 + Math.random() * 10000; // 15-25s
      timerRef.current = setTimeout(() => {
        addToast();
        scheduleNext();
      }, delay);
    };

    // First toast appears after a short delay (3-5s)
    timerRef.current = setTimeout(() => {
      addToast();
      scheduleNext();
    }, 3000 + Math.random() * 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = TOAST_CONFIG[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`glass-card ${config.bg} rounded-lg border-l-[3px] ${config.borderColor} p-3 shadow-lg`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{config.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    {toast.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {toast.description}
                  </p>
                </div>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0 p-0.5 rounded hover:bg-muted/50"
                  aria-label="Закрыть"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
