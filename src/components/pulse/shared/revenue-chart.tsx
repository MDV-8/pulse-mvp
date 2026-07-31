'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface ChartBarData {
  label: string;
  value: number;
  color?: string;
}

interface RevenueChartProps {
  data: ChartBarData[];
  height?: number;
  className?: string;
}

export function RevenueChart({ data, height = 200, className }: RevenueChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn('relative w-full', className)} style={{ height }}>
      <div className="absolute inset-0 flex items-end gap-1.5 sm:gap-2">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          const isHovered = hoveredIndex === index;
          const barColor = item.color || 'var(--pulse-purple)';

          return (
            <div
              key={item.label}
              className="relative flex flex-1 flex-col items-center justify-end h-full"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-popover border border-border px-2 py-1 text-xs font-medium text-popover-foreground whitespace-nowrap z-10 shadow-lg"
                >
                  {item.value.toLocaleString('ru-RU')} ₸
                </motion.div>
              )}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${barHeight}%` }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: 'easeOut',
                }}
                className={cn(
                  'w-full rounded-t-sm min-h-[2px] transition-all duration-200',
                  isHovered && 'brightness-125'
                )}
                style={{
                  backgroundColor: barColor,
                  opacity: isHovered ? 1 : 0.85,
                }}
              />
              <span className="mt-2 text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface StackedRevenueChartProps {
  data: { label: string; revenue: number; expenses: number }[];
  height?: number;
  className?: string;
}

export function StackedRevenueChart({ data, height = 200, className }: StackedRevenueChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className={cn('relative w-full', className)} style={{ height }}>
      <div className="absolute inset-0 flex items-end gap-1.5 sm:gap-2">
        {data.map((item, index) => {
          const totalHeight = (item.revenue / maxRevenue) * 100;
          const expenseHeight = (item.expenses / item.revenue) * 100;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={item.label}
              className="relative flex flex-1 flex-col items-center justify-end h-full"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-14 left-1/2 -translate-x-1/2 rounded-md bg-popover border border-border px-2.5 py-1.5 text-xs z-10 shadow-lg space-y-0.5"
                >
                  <div className="text-popover-foreground font-medium">
                    Выр: {item.revenue.toLocaleString('ru-RU')} ₸
                  </div>
                  <div className="text-muted-foreground">
                    Расх: {item.expenses.toLocaleString('ru-RU')} ₸
                  </div>
                </motion.div>
              )}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${totalHeight}%` }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.08,
                  ease: 'easeOut',
                }}
                className={cn(
                  'w-full rounded-t-sm flex flex-col justify-end transition-all duration-200 overflow-hidden',
                  isHovered && 'brightness-110'
                )}
              >
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    backgroundColor: 'var(--pulse-purple)',
                    height: `${100 - expenseHeight}%`,
                  }}
                />
                <div
                  className="w-full"
                  style={{
                    backgroundColor: 'var(--muted)',
                    height: `${expenseHeight}%`,
                    opacity: 0.5,
                  }}
                />
              </motion.div>
              <span className="mt-2 text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
