'use client';

import React from 'react';
import { Home, Map, Tag, Gift, User } from 'lucide-react';
import { useAppStore, type ClientView } from '@/stores/app-store';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems: { label: string; icon: React.ElementType; view: ClientView }[] = [
  { label: 'Главная', icon: Home, view: 'home' },
  { label: 'Карта', icon: Map, view: 'map' },
  { label: 'Акции', icon: Tag, view: 'promotions' },
  { label: 'Бонусы', icon: Gift, view: 'bonuses' },
  { label: 'Профиль', icon: User, view: 'profile' },
];

export function ClientNav() {
  const clientView = useAppStore((s) => s.clientView);
  const setClientView = useAppStore((s) => s.setClientView);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-md">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = clientView === item.view;
          const Icon = item.icon;
          return (
            <button
              key={item.view}
              onClick={() => setClientView(item.view)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors duration-200 min-w-[56px] cursor-pointer',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="client-nav-active"
                  className="absolute -top-[1px] left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={cn('size-5', isActive && 'drop-shadow-[0_0_6px_rgba(139,92,246,0.5)]')} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
