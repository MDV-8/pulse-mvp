'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Calendar, Sparkles } from 'lucide-react';

// --- Data ---
const GOAL_DATA = {
  target: 4_200_000,
  current: 3_240_000,
  percentage: 78,
  daysLeft: 12,
  month: 'Июль',
  year: 2025,
  prediction: 'цель будет достигнута к 28 июля',
};

function formatCurrency(value: number): string {
  return Math.round(value).toLocaleString('ru-RU') + ' ₸';
}

// --- SVG Ring ---
function GoalRing({ percentage }: { percentage: number }) {
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      {/* Purple glow behind ring */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-25"
        style={{ backgroundColor: '#8b5cf6' }}
      />

      <svg width={size} height={size} className="relative transform -rotate-90">
        <defs>
          <linearGradient id="goal-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          stroke="rgba(139, 92, 246, 0.1)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Progress arc */}
        <motion.circle
          stroke="url(#goal-ring-gradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold tracking-tighter number-glow"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          {GOAL_DATA.percentage}%
        </motion.span>
        <span className="text-sm mt-1 pulse-text-gradient font-semibold tabular-nums">
          {formatCurrency(GOAL_DATA.current)}
        </span>
      </div>
    </div>
  );
}

// --- Metric Card ---
function MetricCard({
  label,
  value,
  glowClass,
}: {
  label: string;
  value: string;
  glowClass?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-3">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className={`text-lg font-bold tabular-nums mt-1 ${glowClass ?? 'text-foreground'}`}>
        {value}
      </p>
    </div>
  );
}

// --- Main Component ---
export function RevenueGoalTracker() {
  const remaining = GOAL_DATA.target - GOAL_DATA.current;

  return (
    <motion.div
      className="aurora-border rounded-2xl p-4 md:p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15">
          <Target className="size-4 text-purple-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-shadow-glow">Цель по выручке</h3>
          <p className="text-xs text-muted-foreground">
            {GOAL_DATA.month} {GOAL_DATA.year}
          </p>
        </div>
      </div>

      {/* Main content: Ring + Metrics */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Left: SVG Ring */}
        <GoalRing percentage={GOAL_DATA.percentage} />

        {/* Right: Metric Cards */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MetricCard label="Цель" value={formatCurrency(GOAL_DATA.target)} />

          <MetricCard
            label="Текущая"
            value={formatCurrency(GOAL_DATA.current)}
            glowClass="stat-glow-green"
          />

          <MetricCard
            label="Осталось"
            value={formatCurrency(remaining)}
            glowClass="stat-glow-amber"
          />

          {/* Days left card */}
          <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-3">
            <p className="text-xs text-muted-foreground font-medium">Дней осталось</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar className="size-4 text-purple-400" />
              <span className="text-lg font-bold tabular-nums text-foreground">
                {GOAL_DATA.daysLeft}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="relative h-2.5 w-full rounded-full bg-purple-500/10 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full shimmer"
            style={{
              background: 'linear-gradient(90deg, #8b5cf6, #7c3aed, #a78bfa)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${GOAL_DATA.percentage}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-muted-foreground/60 font-medium">
            0 ₸
          </span>
          <span className="text-[10px] text-muted-foreground/60 font-medium">
            {formatCurrency(GOAL_DATA.target)}
          </span>
        </div>
      </div>

      {/* AI Prediction */}
      <motion.div
        className="mt-4 glass-card-deep aurora-border rounded-xl p-3 flex items-center gap-2.5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/15">
          <Sparkles className="size-3.5 text-purple-400" />
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider shrink-0">
            AI прогноз:
          </span>
          <span className="text-sm text-foreground font-medium truncate">
            {GOAL_DATA.prediction}
          </span>
        </div>
        <TrendingUp className="size-4 text-emerald-400 shrink-0 ml-auto" />
      </motion.div>
    </motion.div>
  );
}
