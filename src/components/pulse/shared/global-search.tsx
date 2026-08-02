'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAppStore, type OwnerView } from '@/stores/app-store';
import { Search } from 'lucide-react';

// ============================================================
// Search Index
// ============================================================

interface SearchableItem {
  id: string;
  label: string;
  view: OwnerView;
  category: string;
  emoji: string;
}

const searchableItems: SearchableItem[] = [
  // Navigation items (all 20)
  { id: 'nav-dashboard', label: 'Главная страница', view: 'dashboard', category: 'Навигация', emoji: '🏠' },
  { id: 'nav-today', label: 'Что делать сегодня', view: 'today', category: 'Навигация', emoji: '⚡' },
  { id: 'nav-ai', label: 'AI Ассистент', view: 'ai', category: 'AI', emoji: '🤖' },
  { id: 'nav-sales', label: 'Продажи и выручка', view: 'sales', category: 'Продажи', emoji: '📈' },
  { id: 'nav-clients', label: 'Клиенты и CRM', view: 'clients', category: 'Клиенты', emoji: '👥' },
  { id: 'nav-promotions', label: 'Акции и промо', view: 'promotions', category: 'Акции', emoji: '🏷️' },
  { id: 'nav-finance', label: 'Финансы и расходы', view: 'finance', category: 'Финансы', emoji: '💰' },
  { id: 'nav-analytics', label: 'Аналитика бизнеса', view: 'analytics', category: 'Аналитика', emoji: '📊' },
  { id: 'nav-loyalty', label: 'Программа лояльности', view: 'loyalty', category: 'Лояльность', emoji: '❤️' },
  { id: 'nav-goals', label: 'Цели бизнеса', view: 'goals', category: 'Цели', emoji: '🎯' },
  { id: 'nav-settings', label: 'Настройки и профиль', view: 'settings', category: 'Настройки', emoji: '⚙️' },
  { id: 'nav-reviews', label: 'Отзывы клиентов', view: 'reviews', category: 'Отзывы', emoji: '💬' },
  { id: 'nav-team', label: 'Команда и сотрудники', view: 'team', category: 'Команда', emoji: '👨\u200d💼' },
  { id: 'nav-smm', label: 'SMM и контент', view: 'smm', category: 'Маркетинг', emoji: '📱' },
  { id: 'nav-inventory', label: 'Инвентарь и склад', view: 'inventory', category: 'Инвентарь', emoji: '📦' },
  { id: 'nav-reservations', label: 'Бронирования', view: 'reservations', category: 'Бронирования', emoji: '📅' },
  { id: 'nav-schedule', label: 'График работы', view: 'schedule', category: 'График', emoji: '🗓️' },
  { id: 'nav-cashier', label: 'Касса и POS', view: 'cashier', category: 'Касса', emoji: '🧮' },
  { id: 'nav-waitlist', label: 'Очередь ожидания', view: 'waitlist', category: 'Очередь', emoji: '📋' },
  { id: 'nav-suppliers', label: 'Поставщики', view: 'suppliers', category: 'Поставщики', emoji: '🚚' },
  // Extra searchable aliases
  { id: 'alias-money', label: 'Деньги и бюджет', view: 'finance', category: 'Финансы', emoji: '💰' },
  { id: 'alias-revenue', label: 'Выручка', view: 'sales', category: 'Продажи', emoji: '📈' },
  { id: 'alias-marketing', label: 'Маркетинг', view: 'smm', category: 'Маркетинг', emoji: '📱' },
  { id: 'alias-stock', label: 'Склад и запасы', view: 'inventory', category: 'Инвентарь', emoji: '📦' },
  { id: 'alias-profile', label: 'Личный кабинет', view: 'settings', category: 'Настройки', emoji: '👤' },
  { id: 'alias-account', label: 'Аккаунт', view: 'settings', category: 'Настройки', emoji: '⚙️' },
  { id: 'alias-chat', label: 'Чат с AI', view: 'ai', category: 'AI', emoji: '🤖' },
  { id: 'alias-automation', label: 'Автоматизация', view: 'ai', category: 'AI', emoji: '🤖' },
  { id: 'alias-coupons', label: 'Купоны и скидки', view: 'promotions', category: 'Акции', emoji: '🏷️' },
  { id: 'alias-segments', label: 'Сегменты клиентов', view: 'clients', category: 'Клиенты', emoji: '👥' },
];

const quickActions: {
  label: string;
  emoji: string;
  view: OwnerView;
}[] = [
  { label: 'Перейти на главную', emoji: '🏠', view: 'dashboard' },
  { label: 'Открыть AI ассистент', emoji: '🤖', view: 'ai' },
  { label: 'Финансы', emoji: '📊', view: 'finance' },
  { label: 'Клиенты', emoji: '👥', view: 'clients' },
  { label: 'Акции', emoji: '🏷️', view: 'promotions' },
  { label: 'Настройки', emoji: '⚙️', view: 'settings' },
];

// ============================================================
// Component
// ============================================================

export function GlobalSearch() {
  const showSearch = useAppStore((s) => s.showSearch);
  const setShowSearch = useAppStore((s) => s.setShowSearch);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const setOwnerView = useAppStore((s) => s.setOwnerView);
  const promotions = useAppStore((s) => s.promotions);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(!useAppStore.getState().showSearch);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setShowSearch]);

  // Auto-focus input when opened
  useEffect(() => {
    if (showSearch) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [showSearch, setSearchQuery]);

  const handleNavigate = (view: OwnerView) => {
    setOwnerView(view);
    setShowSearch(false);
  };

  // Build search results
  const uniqueResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    // Dynamic promotion items
    const promotionItems: SearchableItem[] = promotions.map((p) => ({
      id: `promo-${p.id}`,
      label: p.name,
      view: 'promotions' as OwnerView,
      category: 'Акции',
      emoji: '🏷️',
    }));

    const allItems = [...searchableItems, ...promotionItems];

    const query = searchQuery.toLowerCase();
    const results = allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );

    // Deduplicate by view (keep first match per view)
    const unique: SearchableItem[] = [];
    const seenViews = new Set<string>();
    for (const r of results) {
      if (!seenViews.has(r.view)) {
        seenViews.add(r.view);
        unique.push(r);
      }
    }

    return unique;
  }, [searchQuery, promotions]);

  return (
    <Dialog open={showSearch} onOpenChange={setShowSearch}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden border-white/10 bg-card/95 backdrop-blur-xl">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по PULSE..."
            className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-auto p-0 text-sm placeholder:text-muted-foreground/50"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-muted/50 px-1.5 font-mono text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Content */}
        <div className="px-2 py-2 max-h-[360px] overflow-y-auto">
          {searchQuery.trim() ? (
            uniqueResults.length > 0 ? (
              <>
                <p className="px-2 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                  Результаты ({uniqueResults.length})
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {uniqueResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.view)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <span className="text-base leading-none">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <span className="truncate block">{item.label}</span>
                        <span className="text-[10px] text-muted-foreground/50">{item.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-6 text-center">
                <Search className="h-5 w-5 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground/50">
                  Ничего не найдено.
                </p>
              </div>
            )
          ) : (
            <>
              <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                Быстрые действия
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {quickActions.map((action) => (
                  <button
                    key={action.view}
                    onClick={() => handleNavigate(action.view)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span className="text-base leading-none">{action.emoji}</span>
                    <span className="truncate">{action.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-white/5 px-4 py-2.5 flex items-center gap-4 text-[10px] text-muted-foreground/40">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-white/10 bg-muted/50 px-1 py-0.5 font-mono text-[9px]">
              ⌘K
            </kbd>
            открыть поиск
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-white/10 bg-muted/50 px-1 py-0.5 font-mono text-[9px]">
              ESC
            </kbd>
            закрыть
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
