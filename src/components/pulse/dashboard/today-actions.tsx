'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function getActionColor(type: string): string {
  switch (type) {
    case 'promotion':
      return 'bg-primary text-primary-foreground hover:bg-primary/90';
    case 'clients':
      return 'bg-cyan-600 text-white hover:bg-cyan-600/90';
    case 'content':
      return 'bg-pink-600 text-white hover:bg-pink-600/90';
    case 'reviews':
      return 'bg-orange-500 text-white hover:bg-orange-500/90';
    default:
      return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
  }
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function TodayActions() {
  const todayActions = useAppStore((s) => s.todayActions);
  const setShowCreatePromotion = useAppStore((s) => s.setShowCreatePromotion);
  const setShowReturnClients = useAppStore((s) => s.setShowReturnClients);
  const setShowAIContent = useAppStore((s) => s.setShowAIContent);

  const handleAction = (actionType: string) => {
    switch (actionType) {
      case 'promotion':
        setShowCreatePromotion(true);
        break;
      case 'clients':
        setShowReturnClients(true);
        break;
      case 'content':
        setShowAIContent(true);
        break;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Что делать сегодня
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          AI выбрал приоритетные действия для вас
        </p>
      </div>

      <motion.div
        className="space-y-2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {todayActions.map((action, index) => (
          <motion.div
            key={action.id}
            variants={item}
            className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors duration-200 hover:border-primary/10"
          >
            {/* Number */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
              {index + 1}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground">
                {action.title}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {action.reason}
              </p>
              <p className="mt-1 text-xs text-primary/70">
                {action.expectedEffect}
              </p>
            </div>

            {/* Action button */}
            <Button
              size="sm"
              className={cn(
                'shrink-0 text-[11px] font-semibold h-8 px-3',
                getActionColor(action.actionType)
              )}
              onClick={() => handleAction(action.actionType)}
            >
              {action.actionLabel}
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
