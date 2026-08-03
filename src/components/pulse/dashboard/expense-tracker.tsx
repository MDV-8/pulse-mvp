'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Receipt,
  TrendingDown,
  AlertTriangle,
  ShoppingBag,
  CreditCard,
  Home,
  Zap,
  MoreHorizontal,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ---- Types ----

interface CategoryBar {
  label: string;
  amount: number;
  percent: number;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  icon: React.ElementType;
}

interface RecentExpense {
  name: string;
  amount: number;
  time: string;
  category: string;
  icon: React.ElementType;
}

// ---- Data ----

const TOTAL_SPENT = 142500;
const DAILY_BUDGET = 152000;
const BUDGET_PERCENT = Math.round((TOTAL_SPENT / DAILY_BUDGET) * 100);

const categories: CategoryBar[] = [
  {
    label: 'Продукты',
    amount: 68000,
    percent: 48,
    color: 'bg-emerald-500',
    gradientFrom: '#10b981',
    gradientTo: '#34d399',
    icon: ShoppingBag,
  },
  {
    label: 'Зарплата',
    amount: 45000,
    percent: 32,
    color: 'bg-purple-500',
    gradientFrom: '#8b5cf6',
    gradientTo: '#a78bfa',
    icon: CreditCard,
  },
  {
    label: 'Аренда',
    amount: 15000,
    percent: 10,
    color: 'bg-cyan-500',
    gradientFrom: '#06b6d4',
    gradientTo: '#22d3ee',
    icon: Home,
  },
  {
    label: 'Коммунальные',
    amount: 8500,
    percent: 6,
    color: 'bg-amber-500',
    gradientFrom: '#f59e0b',
    gradientTo: '#fbbf24',
    icon: Zap,
  },
  {
    label: 'Прочее',
    amount: 6000,
    percent: 4,
    color: 'bg-muted',
    gradientFrom: '#71717a',
    gradientTo: '#a1a1aa',
    icon: MoreHorizontal,
  },
];

const recentExpenses: RecentExpense[] = [
  {
    name: 'Закупка молока и сиропов',
    amount: 12500,
    time: '15:30',
    category: 'Продукты',
    icon: ShoppingBag,
  },
  {
    name: 'Оплата курьеру',
    amount: 8000,
    time: '14:20',
    category: 'Прочее',
    icon: MoreHorizontal,
  },
  {
    name: 'Электричество',
    amount: 8500,
    time: '09:00',
    category: 'Коммунальные',
    icon: Zap,
  },
];

function formatAmount(value: number): string {
  return value.toLocaleString('ru-RU');
}

// ---- Category Bar ----

function CategoryBarRow({ cat, index }: { cat: CategoryBar; index: number }) {
  const Icon = cat.icon;
  return (
    <motion.div
      className="space-y-1.5"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.06 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="size-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">{cat.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground tabular-nums">
            {formatAmount(cat.amount)} ₸
          </span>
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {cat.percent}%
          </span>
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${cat.gradientFrom}, ${cat.gradientTo})`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${cat.percent}%` }}
          transition={{ duration: 0.8, delay: 0.15 + index * 0.08, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

// ---- Recent Expense Item ----

function RecentExpenseItem({ expense, index }: { expense: RecentExpense; index: number }) {
  const Icon = expense.icon;
  return (
    <motion.div
      className="flex items-center gap-3 rounded-lg bg-background/40 p-2.5 slide-up-fade"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.5 + index * 0.08 }}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">{expense.name}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{expense.category}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-bold text-foreground tabular-nums">{formatAmount(expense.amount)} ₸</p>
        <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-muted-foreground">
          <Clock className="size-2.5" />
          <span>{expense.time}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Main Component ----

export function ExpenseTracker() {
  const overBudget = BUDGET_PERCENT > 80;

  return (
    <motion.div
      className="rounded-xl border border-border bg-card overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
        <Receipt className="size-4 text-primary" />
        <span className="text-sm font-semibold text-shadow-glow">Расходы сегодня</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Total summary */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
              Потрачено
            </p>
            <span className="text-2xl font-bold number-glow stat-glow-amber tabular-nums tracking-tight">
              {formatAmount(TOTAL_SPENT)} ₸
            </span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            <TrendingDown className="size-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 tabular-nums">-8%</span>
            <span className="text-[10px] text-emerald-400/70 hidden sm:inline">от вчера</span>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Категории
          </p>
          {categories.map((cat, i) => (
            <CategoryBarRow key={cat.label} cat={cat} index={i} />
          ))}
        </div>

        {/* Recent expenses */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Последние расходы
          </p>
          <div className="space-y-1.5">
            {recentExpenses.map((expense, i) => (
              <RecentExpenseItem key={expense.name} expense={expense} index={i} />
            ))}
          </div>
        </div>

        {/* AI Alert Box */}
        {overBudget && (
          <motion.div
            className={cn(
              'relative rounded-xl border overflow-hidden glass-card-accent-amber shimmer-overlay'
            )}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <div className="relative z-10 p-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="size-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-400 mb-1">
                    Расходы на {BUDGET_PERCENT}% от дневного бюджета ({formatAmount(DAILY_BUDGET)}₸)
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Рекомендуется сократить закупки.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
