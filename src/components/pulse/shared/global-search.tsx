'use client';

import React, { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAppStore, type OwnerView } from '@/stores/app-store';
import {
  LayoutDashboard,
  Brain,
  Wallet,
  Users,
  Tag,
  Settings,
  Search,
} from 'lucide-react';

const quickActions: {
  label: string;
  icon: React.ElementType;
  emoji: string;
  view: OwnerView;
}[] = [
  { label: 'Перейти на главную', icon: LayoutDashboard, emoji: '🏠', view: 'dashboard' },
  { label: 'Открыть AI ассистент', icon: Brain, emoji: '🤖', view: 'ai' },
  { label: 'Финансы', icon: Wallet, emoji: '📊', view: 'finance' },
  { label: 'Клиенты', icon: Users, emoji: '👥', view: 'clients' },
  { label: 'Акции', icon: Tag, emoji: '🏷️', view: 'promotions' },
  { label: 'Настройки', icon: Settings, emoji: '⚙️', view: 'settings' },
];

export function GlobalSearch() {
  const showSearch = useAppStore((s) => s.showSearch);
  const setShowSearch = useAppStore((s) => s.setShowSearch);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const setOwnerView = useAppStore((s) => s.setOwnerView);
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

  const filteredActions = searchQuery
    ? quickActions.filter((a) =>
        a.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : quickActions;

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

        {/* Quick Actions */}
        <div className="px-2 py-2 max-h-[360px] overflow-y-auto">
          <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Быстрые действия
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {filteredActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.view}
                  onClick={() => handleNavigate(action.view)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span className="text-base leading-none">{action.emoji}</span>
                  <span className="truncate">{action.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mock search results (shown when query exists) */}
          {searchQuery && (
            <>
              <p className="px-2 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                Результаты
              </p>
              <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-6 text-center">
                <Search className="h-5 w-5 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground/50">
                  Поиск по &laquo;{searchQuery}&raquo; не дал результатов
                </p>
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
