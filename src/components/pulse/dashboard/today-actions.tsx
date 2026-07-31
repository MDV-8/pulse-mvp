'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, PenLine, MessageSquare, ClipboardList } from 'lucide-react';
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

function getActionBorderColor(type: string): string {
  switch (type) {
    case 'promotion':
      return 'border-l-purple-500';
    case 'clients':
      return 'border-l-cyan-500';
    case 'content':
      return 'border-l-pink-500';
    case 'reviews':
      return 'border-l-orange-500';
    default:
      return 'border-l-muted-foreground/30';
  }
}

function getActionIcon(type: string) {
  switch (type) {
    case 'promotion':
      return <Sparkles className="size-3.5 text-purple-400" />;
    case 'clients':
      return <Users className="size-3.5 text-cyan-400" />;
    case 'content':
      return <PenLine className="size-3.5 text-pink-400" />;
    case 'reviews':
      return <MessageSquare className="size-3.5 text-orange-400" />;
    default:
      return <ClipboardList className="size-3.5 text-muted-foreground" />;
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

export function TodayActions({ showHeader = true }: { showHeader?: boolean }) {
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
      {showHeader && (
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Что делать сегодня
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          AI выбрал приоритетные действия для вас
        </p>
      </div>
      )}

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
            className={cn(
              'flex items-start gap-3 rounded-xl border border-border border-l-[3px] bg-card p-4 transition-colors duration-200 hover:border-primary/10',
              getActionBorderColor(action.actionType)
            )}
          >
            {/* Number badge with gradient */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-xs font-bold text-purple-300">
              {index + 1}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {getActionIcon(action.actionType)}
                <h3 className="text-sm font-medium text-foreground">
                  {action.title}
                </h3>
              </div>
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
