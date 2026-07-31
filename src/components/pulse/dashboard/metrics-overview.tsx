'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Users, Receipt, PiggyBank } from 'lucide-react';
import { mockMetrics } from '@/data/mock-data';
import { cn } from '@/lib/utils';

const metricIcons = [DollarSign, Users, Receipt, PiggyBank];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function MetricsOverview() {
  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {mockMetrics.map((metric, index) => {
        const Icon = metricIcons[index];
        const isPositive = metric.change > 0;

        return (
          <motion.div
            key={metric.label}
            variants={item}
            className={cn(
              'group rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/15 card-hover'
            )}
          >
            {/* Icon + Label */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-4 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {metric.label}
                </span>
              </div>
            </div>

            {/* Value */}
            <div className="mt-3 flex items-end justify-between">
              <span className="text-lg sm:text-xl font-bold text-foreground tabular-nums tracking-tight">
                {metric.value}
              </span>
              <div
                className={cn(
                  'flex items-center gap-0.5 text-xs font-semibold tabular-nums',
                  isPositive ? 'text-emerald-400' : 'text-red-400'
                )}
              >
                {isPositive ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {isPositive ? '+' : ''}
                {metric.change}%
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
