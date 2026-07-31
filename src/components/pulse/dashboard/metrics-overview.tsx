'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Users, Receipt, PiggyBank } from 'lucide-react';
import { mockMetrics } from '@/data/mock-data';
import { cn } from '@/lib/utils';
import { useAnimatedCounter } from '@/hooks/use-animated-counter';

const metricIcons = [DollarSign, Users, Receipt, PiggyBank];

// Numeric targets for animated counters (matched by order to mockMetrics)
const metricTargets = [1284000, 1248, 5420, 386000];

// Whether each metric has a currency symbol
const metricHasCurrency = [true, false, true, true];

// Mini sparkline data for each metric (4 bars)
const sparklineData = [
  [60, 80, 70, 95],
  [50, 65, 75, 90],
  [85, 80, 70, 60],
  [55, 70, 80, 88],
];

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

/** Format a number with space as thousands separator */
function formatNumber(value: number, currency: boolean): string {
  const formatted = Math.round(value).toLocaleString('ru-RU', {
    useGrouping: true,
    maximumFractionDigits: 0,
  });
  return currency ? `${formatted} ₸` : formatted;
}

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const maxVal = Math.max(...data);
  const color = positive ? '#10b981' : '#ef4444';

  return (
    <div className="flex items-end gap-[2px] h-6">
      {data.map((val, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full transition-all duration-500"
          style={{
            height: `${(val / maxVal) * 100}%`,
            backgroundColor: i === data.length - 1 ? color : 'rgba(255,255,255,0.08)',
            opacity: 0.4 + (i / data.length) * 0.6,
          }}
        />
      ))}
    </div>
  );
}

function MetricCard({
  metric,
  index,
}: {
  metric: (typeof mockMetrics)[number];
  index: number;
}) {
  const Icon = metricIcons[index];
  const isPositive = metric.change > 0;
  const target = metricTargets[index];
  const hasCurrency = metricHasCurrency[index];

  const animatedValue = useAnimatedCounter(target, 1500);

  return (
    <motion.div
      key={metric.label}
      variants={item}
      className={cn(
        'group relative rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/15 card-hover overflow-hidden'
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
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

        {/* Value + Trend */}
        <div className="mt-3 flex items-end justify-between">
          <span className="text-lg sm:text-xl font-bold text-foreground tabular-nums tracking-tight number-glow">
            {formatNumber(animatedValue, hasCurrency)}
          </span>
          <MiniSparkline data={sparklineData[index]} positive={isPositive} />
        </div>

        {/* Trend indicator */}
        <div className="mt-2 flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="size-4 text-emerald-400" />
          ) : (
            <TrendingDown className="size-4 text-red-400" />
          )}
          <span
            className={cn(
              'text-xs font-bold tabular-nums',
              isPositive ? 'text-emerald-400' : 'text-red-400'
            )}
          >
            {isPositive ? '+' : ''}
            {metric.change}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function MetricsOverview() {
  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {mockMetrics.map((metric, index) => (
        <MetricCard key={metric.label} metric={metric} index={index} />
      ))}
    </motion.div>
  );
}
