'use client';

import React, { useRef } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { Button } from '@/components/ui/button';
import { NotificationCenter } from '@/components/pulse/shared/notification-center';

export function MobileHeader() {
  const appMode = useAppStore((s) => s.appMode);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const showNotifications = useAppStore((s) => s.showNotifications);
  const setShowNotifications = useAppStore((s) => s.setShowNotifications);
  const notifBellRef = useRef<HTMLButtonElement>(null);

  return (
    <header className="sticky top-0 z-40 flex md:hidden h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4">
      {/* Hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="size-11 text-muted-foreground"
        onClick={() => setSidebarOpen(true)}
        aria-label="Открыть меню"
      >
        <Menu className="size-5" />
      </Button>

      {/* Logo */}
      <div className="flex flex-col items-center leading-none">
        <span className="text-lg font-bold tracking-tight pulse-text-gradient">
          PULSE
        </span>
        {appMode === 'owner' && (
          <span className="text-[10px] text-muted-foreground/70 mt-0.5">
            Coffee & Co
          </span>
        )}
      </div>

      {/* Notification bell — functional */}
      <div className="relative">
        <Button
          ref={notifBellRef}
          variant="ghost"
          size="icon"
          className="size-11 text-muted-foreground relative"
          aria-label="Уведомления"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
        </Button>
        <NotificationCenter
          open={showNotifications}
          onClose={() => setShowNotifications(false)}
          triggerRef={notifBellRef}
        />
      </div>
    </header>
  );
}
