'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';

function getHealthColor(score: number): string {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}

const healthLabels: { key: keyof typeof import('@/data/mock-data').mockPulseScore.breakdown; label: string }[] = [
  { key: 'sales', label: 'Продажи' },
  { key: 'clients', label: 'Клиенты' },
  { key: 'loyalty', label: 'Лояльность' },
  { key: 'marketing', label: 'Маркетинг' },
  { key: 'profit', label: 'Прибыль' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0 },
};

export function BusinessHealth() {
  const pulseScore = useAppStore((s) => s.pulseScore);
  const breakdown = pulseScore.breakdown;

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Business Health
      </h3>

      <motion.div
        className="space-y-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {healthLabels.map((metric) => {
          const score = breakdown[metric.key];
          const color = getHealthColor(score);
          return (
            <motion.div key={metric.key} variants={item} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{metric.label}</span>
                <span
                  className="text-sm font-semibold tabular-nums"
                  style={{ color }}
                >
                  {score}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* AI Summary */}
      <motion.div
        className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-primary font-medium">AI:</span>{' '}
          Основная зона риска — привлечение новых клиентов и маркетинг.
        </p>
      </motion.div>
    </div>
  );
}
