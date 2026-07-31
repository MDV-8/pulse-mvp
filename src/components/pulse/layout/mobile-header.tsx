'use client';

import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { Button } from '@/components/ui/button';

export function MobileHeader() {
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  return (
    <header className="sticky top-0 z-40 flex md:hidden h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4">
      {/* Hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="size-9 text-muted-foreground"
        onClick={() => setSidebarOpen(true)}
        aria-label="Открыть меню"
      >
        <Menu className="size-5" />
      </Button>

      {/* Logo */}
      <span className="text-lg font-bold tracking-tight pulse-text-gradient">
        PULSE
      </span>

      {/* Notification bell */}
      <Button
        variant="ghost"
        size="icon"
        className="size-9 text-muted-foreground relative"
        aria-label="Уведомления"
      >
        <Bell className="size-5" />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
      </Button>
    </header>
  );
}
