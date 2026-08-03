'use client';

import React from 'react';
import {
  LayoutDashboard,
  Wrench,
  FileText,
  Users,
  PenLine,
  ArrowLeft,
} from 'lucide-react';
import { useAppStore, type AdminView } from '@/stores/app-store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems: { label: string; icon: React.ElementType; view: AdminView }[] = [
  { label: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' },
  { label: 'Инструменты', icon: Wrench, view: 'tools' },
  { label: 'Шаблоны', icon: FileText, view: 'templates' },
  { label: 'Пользователи', icon: Users, view: 'users' },
  { label: 'Контент', icon: PenLine, view: 'content' },
];

function AdminNavContent({ onNavigate }: { onNavigate?: () => void }) {
  const adminView = useAppStore((s) => s.adminView);
  const setAdminView = useAppStore((s) => s.setAdminView);
  const setAppMode = useAppStore((s) => s.setAppMode);

  const handleNavClick = (view: AdminView) => {
    setAdminView(view);
    onNavigate?.();
  };

  const handleBack = () => {
    setAppMode('owner');
    onNavigate?.();
  };

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-5">
        <span className="text-2xl font-bold tracking-tight pulse-text-gradient">
          PULSE
        </span>
        <span className="text-xs text-muted-foreground font-medium">ADMIN</span>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = adminView === item.view;
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className={cn('size-4 shrink-0', isActive && 'text-primary')} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="admin-nav-active"
                    className="absolute left-0 h-7 w-[3px] rounded-r-full bg-primary"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Back button */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={handleBack}
        >
          <ArrowLeft className="size-4" />
          <span className="text-xs">Назад к бизнесу</span>
        </Button>
      </div>
    </div>
  );
}

export function AdminNav() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[240px] shrink-0 h-screen sticky top-0 border-r border-sidebar-border">
        <div className="w-full">
          <AdminNavContent />
        </div>
      </aside>

      {/* Mobile sidebar as Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[260px] p-0 bg-sidebar border-sidebar-border">
          <SheetHeader className="sr-only">
            <SheetTitle>Меню администратора</SheetTitle>
          </SheetHeader>
          <AdminNavContent onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
