'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Zap,
  Brain,
  TrendingUp,
  Users,
  Tag,
  Wallet,
  BarChart3,
  Heart,
  Target,
  Settings,
  Smartphone,
  Shield,
  Search,
  Sun,
  Moon,
  MessageSquare,
  PenLine,
  Package,
  CalendarDays,
  CalendarRange,
} from 'lucide-react';
import { useAppStore, type OwnerView } from '@/stores/app-store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const navItems: { label: string; icon: React.ElementType; view: OwnerView }[] = [
  { label: 'Главная', icon: LayoutDashboard, view: 'dashboard' },
  { label: 'Что делать', icon: Zap, view: 'today' },
  { label: 'AI Ассистент', icon: Brain, view: 'ai' },
  { label: 'Продажи', icon: TrendingUp, view: 'sales' },
  { label: 'Клиенты', icon: Users, view: 'clients' },
  { label: 'Акции', icon: Tag, view: 'promotions' },
  { label: 'Финансы', icon: Wallet, view: 'finance' },
  { label: 'Аналитика', icon: BarChart3, view: 'analytics' },
  { label: 'Лояльность', icon: Heart, view: 'loyalty' },
  { label: 'Цели', icon: Target, view: 'goals' },
  { label: 'Настройки', icon: Settings, view: 'settings' },
  { label: 'Отзывы', icon: MessageSquare, view: 'reviews' },
  { label: 'Команда', icon: Users, view: 'team' },
  { label: 'SMM', icon: PenLine, view: 'smm' },
  { label: 'Инвентарь', icon: Package, view: 'inventory' },
  { label: 'Бронирования', icon: CalendarDays, view: 'reservations' },
  { label: 'График', icon: CalendarRange, view: 'schedule' },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const ownerView = useAppStore((s) => s.ownerView);
  const setOwnerView = useAppStore((s) => s.setOwnerView);
  const setAppMode = useAppStore((s) => s.setAppMode);
  const isDemoAccount = useAppStore((s) => s.isDemoAccount);
  const setShowSearch = useAppStore((s) => s.setShowSearch);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  const handleNavClick = (view: OwnerView) => {
    setOwnerView(view);
    onNavigate?.();
  };

  const handleSwitchToClient = () => {
    setAppMode('client');
    onNavigate?.();
  };

  const handleSwitchToAdmin = () => {
    setAppMode('admin');
    onNavigate?.();
  };

  return (
    <div className="flex h-full flex-col bg-sidebar glass-shine">
      {/* Logo with animated gradient ring */}
      <div className="flex flex-col">
        <div className="flex h-16 items-center justify-center px-5">
          {/* Animated gradient ring behind logo */}
          <div className="absolute left-0 top-0 w-full h-16 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-10 rounded-full opacity-30"
              style={{
                background: 'conic-gradient(from 0deg, #8b5cf6, #d946ef, #06b6d4, #8b5cf6)',
                animation: 'gradient-border-rotate 4s linear infinite',
                filter: 'blur(8px)',
              }}
            />
          </div>
          <div className="relative flex flex-col items-center">
            <span className="text-2xl font-bold tracking-tight pulse-text-gradient float-y">
              PULSE
            </span>
            <span className="text-[9px] text-muted-foreground/40 tracking-widest">v1.3</span>
          </div>
        </div>
        {/* Animated gradient line below logo */}
        <div className="mx-5 h-[2px] rounded-full bg-gradient-to-r from-purple-500/80 via-violet-400/60 to-transparent sidebar-gradient-line" />
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Search button */}
      <div className="px-3 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
          onClick={() => setShowSearch(true)}
        >
          <Search className="size-4" />
          <span className="text-xs">Поиск...</span>
          <kbd className="ml-auto h-5 items-center gap-1 rounded border border-white/10 bg-muted/50 px-1 font-mono text-[9px] text-muted-foreground/60 hidden sm:inline-flex">
            ⌘K
          </kbd>
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-2 scrollbar-thin">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = ownerView === item.view;
            const isAI = item.view === 'ai';
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={cn(
                  'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {/* Active indicator bar on the left */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                {/* Active aurora border background */}
                {isActive && (
                  <div className="aurora-border absolute inset-0 rounded-lg pointer-events-none" style={{ zIndex: 0 }} />
                )}
                {/* Subtle background glow for active item */}
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-primary/5 pointer-events-none" />
                )}
                <Icon className={cn('size-4 shrink-0 relative z-10', isActive && 'text-primary')} />
                <span className="relative z-10">{item.label}</span>
                {/* Live status dot next to AI Ассистент */}
                {isAI && (
                  <span className="ml-auto inline-block h-2 w-2 rounded-full bg-emerald-400 pulse-dot relative z-10" />
                )}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border p-3">
        {isDemoAccount && (
          <div className="mb-3 flex justify-center">
            <Badge
              variant="outline"
              className="border-amber-500/20 bg-amber-500/5 text-[10px] font-medium tracking-wider uppercase px-2.5 py-0.5 breathe"
            >
              <span className="gradient-text-warm font-semibold">DEMO</span>
            </Badge>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground transition-colors duration-150"
            onClick={handleSwitchToClient}
          >
            <Smartphone className="size-4" />
            <span className="text-xs">Клиентская часть</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground transition-colors duration-150"
            onClick={handleSwitchToAdmin}
          >
            <Shield className="size-4" />
            <span className="text-xs">Админ-панель</span>
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground transition-colors duration-150"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            <span className="text-xs">{theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}</span>
          </Button>

          {/* Support link */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            <MessageSquare className="size-4" />
            <span className="text-xs">Поддержка</span>
          </Button>
        </div>

        {/* Keyboard shortcuts hint */}
        <p className="text-[9px] text-muted-foreground/30 text-center mt-2">
          ⌘K поиск
        </p>
      </div>
    </div>
  );
}

export function Sidebar() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[240px] shrink-0 h-screen sticky top-0 border-r border-sidebar-border">
        <div className="w-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile sidebar as Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[260px] p-0 bg-sidebar border-sidebar-border">
          <SheetHeader className="sr-only">
            <SheetTitle>Меню навигации</SheetTitle>
          </SheetHeader>
          <SidebarContent onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
