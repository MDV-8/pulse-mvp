'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Sparkles, Users, PenLine, MessageSquare, ClipboardList } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TodayAction } from '@/data/mock-data';

// ── Color helpers (same as original) ───────────────────────

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

function getPriorityDotColor(priority: number): string {
  if (priority <= 2) return 'bg-red-400';
  if (priority <= 3) return 'bg-amber-400';
  return 'bg-emerald-400';
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

// ── Component ──────────────────────────────────────────────

export function TodayActionsDraggable() {
  const todayActions = useAppStore((s) => s.todayActions);
  const setShowCreatePromotion = useAppStore((s) => s.setShowCreatePromotion);
  const setShowReturnClients = useAppStore((s) => s.setShowReturnClients);
  const setShowAIContent = useAppStore((s) => s.setShowAIContent);

  // Ordered IDs (initial order = original array order)
  const [orderedIds, setOrderedIds] = useState<string[]>(
    () => todayActions.map((a) => a.id)
  );

  // Track drag state
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<'before' | 'after'>('before');
  const [dragItemId, setDragItemId] = useState<string | null>(null);

  const totalCount = todayActions.length;

  const handleAction = useCallback((actionType: string) => {
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
  }, [setShowCreatePromotion, setShowReturnClients, setShowAIContent]);

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    setDragItemId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    // We rely on CSS classes for visual feedback (added inline)
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== dragItemId) {
      setDragOverId(id);
      // Determine whether cursor is in top or bottom half of the element
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      setDragOverPosition(e.clientY < midY ? 'before' : 'after');
    }
  }, [dragItemId]);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    setDragItemId(null);
    if (!draggedId || draggedId === targetId) {
      setDragOverId(null);
      return;
    }

    setOrderedIds((prev) => {
      const newOrder = [...prev];
      const dragIdx = newOrder.indexOf(draggedId);
      const targetIdx = newOrder.indexOf(targetId);
      if (dragIdx === -1 || targetIdx === -1) return prev;

      // Remove dragged from old position
      newOrder.splice(dragIdx, 1);
      // Determine new insert index
      const insertIdx = newOrder.indexOf(targetId);
      newOrder.splice(
        dragOverPosition === 'before' ? insertIdx : insertIdx + 1,
        0,
        draggedId
      );
      return newOrder;
    });

    setDragOverId(null);
  }, [dragOverPosition]);

  const handleDragEnd = useCallback(() => {
    setDragOverId(null);
    setDragItemId(null);
  }, []);

  // Build action lookup
  const actionMap = new Map<string, TodayAction>();
  for (const a of todayActions) {
    actionMap.set(a.id, a);
  }

  const orderedActions = orderedIds.map((id) => actionMap.get(id)).filter(Boolean) as TodayAction[];

  return (
    <div className="glass-card-premium rounded-2xl p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Что делать сегодня
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Перетаскивайте для изменения приоритета
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground tabular-nums">
            {totalCount}
          </span>
          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary/40 w-full" />
          </div>
        </div>
      </div>

      <motion.div
        className="space-y-2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {orderedActions.map((action, index) => {
          const isDragged = dragItemId === action.id;
          const isDropTarget = dragOverId === action.id;

          return (
            <motion.div
              key={action.id}
              variants={item}
              layout
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative"
            >
              {/* Drop indicator line */}
              {isDropTarget && (
                <div
                  className={cn(
                    'absolute left-0 right-0 h-[2px] rounded-full bg-purple-500 z-10',
                    dragOverPosition === 'before'
                      ? '-top-1'
                      : '-bottom-1'
                  )}
                />
              )}

              <div
                draggable
                onDragStart={(e) => handleDragStart(e, action.id)}
                onDragOver={(e) => handleDragOver(e, action.id)}
                onDrop={(e) => handleDrop(e, action.id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  'flex items-start gap-3 rounded-xl border border-border border-l-[3px] bg-card p-3 md:p-4',
                  'transition-all duration-200 cursor-grab active:cursor-grabbing',
                  'hover:border-primary/10 card-hover-lift',
                  getActionBorderColor(action.actionType),
                  isDragged && 'opacity-50 -translate-y-0.5',
                  isDropTarget && 'ring-1 ring-purple-500/30'
                )}
              >
                {/* Grip handle */}
                <div className="flex items-center justify-center mt-1.5 shrink-0 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors">
                  <GripVertical className="w-4 h-4" />
                </div>

                {/* Number badge with gradient */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-xs font-bold text-purple-300 relative">
                  {index + 1}
                  <span
                    className={cn(
                      'absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full',
                      getPriorityDotColor(action.priority)
                    )}
                  />
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
                    'shrink-0 text-[11px] font-semibold h-8 px-3 pointer-events-none',
                    getActionColor(action.actionType)
                  )}
                  onClick={() => handleAction(action.actionType)}
                >
                  {action.actionLabel}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
