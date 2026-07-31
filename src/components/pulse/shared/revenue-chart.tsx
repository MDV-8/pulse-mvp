'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================
// Self-contained Revenue Trend Widget
// ============================================================

const MOCK_DATA = [142000, 158000, 165000, 148000, 175000, 205000, 185000];
const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

type Period = 'Неделя' | 'Месяц' | '3 Месяца';

const PERIODS: Period[] = ['Неделя', 'Месяц', '3 Месяца'];

/** Map JS day-of-week (0=Sun … 6=Sat) to our index (0=Пн … 6=Вс) */
function getCurrentDayIndex(): number {
  const jsDay = new Date().getDay(); // 0=Sun
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function RevenueChart() {
  const [activePeriod, setActivePeriod] = useState<Period>('Неделя');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentDayIndex = getCurrentDayIndex();
  const maxValue = Math.max(...MOCK_DATA, 1);

  const avg = Math.round(MOCK_DATA.reduce((a, b) => a + b, 0) / MOCK_DATA.length);
  const max = Math.max(...MOCK_DATA);
  // Growth: compare last 3 days avg vs first 3 days avg
  const firstHalf = Math.round(MOCK_DATA.slice(0, 3).reduce((a, b) => a + b, 0) / 3);
  const secondHalf = Math.round(MOCK_DATA.slice(4, 7).reduce((a, b) => a + b, 0) / 3);
  const growth = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf * 100) : 0;

  return (
    <div className="glass-card rounded-xl p-6">
      {/* ---- Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </div>
          <h3 className="text-base font-semibold">Динамика выручки</h3>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 glass-card rounded-lg p-1">
          {PERIODS.map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
                activePeriod === period
                  ? 'bg-purple-500/20 text-purple-300 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Bar Chart ---- */}
      <div className="relative h-[220px] flex items-end gap-2 sm:gap-3 mb-2">
        {MOCK_DATA.map((value, index) => {
          const barHeight = (value / maxValue) * 100;
          const isCurrentDay = index === currentDayIndex;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={DAY_LABELS[index]}
              className="relative flex flex-1 flex-col items-center justify-end h-full"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Value label above bar */}
              <span className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 tabular-nums whitespace-nowrap">
                {(value / 1000).toFixed(0)} {(value / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}к
              </span>

              {/* Tooltip on hover */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 rounded-lg bg-popover border border-border px-3 py-1.5 text-xs font-medium text-popover-foreground whitespace-nowrap shadow-lg"
                >
                  {value.toLocaleString('ru-RU')} ₸
                </motion.div>
              )}

              {/* Bar */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${barHeight}%` }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.05,
                  ease: 'easeOut',
                }}
                className={cn(
                  'w-full rounded-t-md min-h-[4px] transition-all duration-200',
                  isCurrentDay && 'shadow-[0_0_16px_rgba(139,92,246,0.5)]',
                  isHovered && 'brightness-125'
                )}
                style={{
                  background: isCurrentDay
                    ? 'linear-gradient(to top, #8b5cf6, #a78bfa)'
                    : 'linear-gradient(to top, #8b5cf6, #7c3aed)',
                  opacity: isHovered ? 1 : isCurrentDay ? 1 : 0.75,
                }}
              />

              {/* Day label */}
              <span
                className={cn(
                  'mt-2 text-[10px] sm:text-xs transition-colors duration-200',
                  isCurrentDay ? 'text-purple-400 font-semibold' : 'text-muted-foreground'
                )}
              >
                {DAY_LABELS[index]}
              </span>
            </div>
          );
        })}
      </div>

      {/* ---- Summary Cards ---- */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <SummaryCard label="Среднее" value={`${avg.toLocaleString('ru-RU')} ₸`} />
        <SummaryCard label="Максимум" value={`${max.toLocaleString('ru-RU')} ₸`} />
        <SummaryCard
          label="Рост"
          value={`${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`}
          positive={growth > 0}
        />
      </div>
    </div>
  );
}

// ============================================================
// Internal helpers
// ============================================================

function SummaryCard({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="glass-card rounded-lg p-3 text-center card-hover-lift">
      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">{label}</p>
      <p
        className={cn(
          'text-sm sm:text-base font-semibold tabular-nums',
          positive !== undefined
            ? positive
              ? 'text-emerald-400 number-glow'
              : 'text-red-400'
            : 'stat-glow-purple'
        )}
      >
        {value}
      </p>
    </div>
  );
}

// ============================================================
// StackedRevenueChart (used by finance-dashboard.tsx)
// ============================================================

export interface ChartBarData {
  label: string;
  value: number;
  color?: string;
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
