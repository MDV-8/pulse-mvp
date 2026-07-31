'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const weeklyMetrics = [
  { label: 'Выручка', value: '+12%', positive: true },
  { label: 'Клиенты', value: '+8%', positive: true },
  { label: 'Средний чек', value: '+3%', positive: true },
  { label: 'Новые отзывы', value: '24', positive: true, neutral: true },
  { label: 'Повторные визиты', value: '+15%', positive: true },
];

const dailyRevenue = [
  { day: 'Пн', value: 168000, percent: 72 },
  { day: 'Вт', value: 142000, percent: 61 },
  { day: 'Ср', value: 155000, percent: 67 },
  { day: 'Чт', value: 178000, percent: 77 },
  { day: 'Пт', value: 234000, percent: 100 },
  { day: 'Сб', value: 198000, percent: 85 },
  { day: 'Вс', value: 156000, percent: 67 },
];

const aiSummary =
  'Недельная выручка выросла на 12%. Самый прибыльный день — пятница. Рекомендуем увеличить промо-активность в понедельник.';

function formatTenge(value: number): string {
  return (value / 1000).toFixed(0) + 'K ₸';
}

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export function WeeklyReport() {
  return (
    <motion.div
      className="glass-card-deep rounded-2xl p-5 sm:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Отчёт за неделю
          </h3>
          <p className="text-xs text-muted-foreground">
            20.01 - 26.01 . Coffee & Co
          </p>
        </div>
      </div>

      {/* 5 Key Metrics with trend arrows */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {weeklyMetrics.map((m) => (
          <div
            key={m.label}
            className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg bg-card/60 border border-border/50"
          >
            <span className="text-[11px] text-muted-foreground font-medium text-center leading-tight">
              {m.label}
            </span>
            <div className="flex items-center gap-0.5">
              {m.positive && !m.neutral && (
                <TrendingUp className="h-3 w-3 text-emerald-400" />
              )}
              {m.neutral && (
                <span className="text-xs text-muted-foreground">•</span>
              )}
              <span
                className={cn(
                  'text-sm font-bold tabular-nums',
                  m.positive ? 'text-emerald-400' : 'text-red-400'
                )}
              >
                {m.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mini horizontal bar chart — daily revenue */}
      <div className="mb-5">
        <p className="text-xs text-muted-foreground font-medium mb-3">
          Выручка по дням
        </p>
        <div className="space-y-1.5">
          {dailyRevenue.map((d, i) => (
            <div key={d.day} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-5 text-right shrink-0 tabular-nums">
                {d.day}
              </span>
              <div className="flex-1 h-5 rounded-md bg-card/80 border border-border/30 overflow-hidden relative">
                <motion.div
                  className={cn(
                    'h-full rounded-md',
                    i === 4
                      ? 'bg-gradient-to-r from-primary to-primary/70'
                      : 'bg-primary/30'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${d.percent}%` }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.06,
                    ease: 'easeOut',
                  }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium tabular-nums">
                  {formatTenge(d.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      <div className="rounded-xl bg-primary/5 border border-primary/10 p-3.5">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 shrink-0">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-primary mb-1">
              AI Резюме
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {aiSummary}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
