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

function getGlowClass(key: string): string {
  switch (key) {
    case 'sales': return 'stat-glow-green';
    case 'clients': return 'stat-glow-purple';
    case 'loyalty': return 'stat-glow-cyan';
    case 'marketing': return 'stat-glow-amber';
    case 'profit': return 'stat-glow-green';
    default: return '';
  }
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

function MiniDonut({ score, size = 32 }: { score: number; size?: number }) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const color = getHealthColor(score);

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

export function BusinessHealth() {
  const pulseScore = useAppStore((s) => s.pulseScore);
  const breakdown = pulseScore.breakdown;

  const overallColor = getHealthColor(pulseScore.total);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          BUSINESS HEALTH
        </h3>
        <div className="flex items-center gap-2">
          <MiniDonut score={pulseScore.total} size={28} />
          <span className="text-sm font-bold tabular-nums" style={{ color: overallColor }}>
            {pulseScore.total}
          </span>
        </div>
      </div>

      <motion.div
        className="space-y-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {healthLabels.map((metric) => {
          const score = breakdown[metric.key];
          const color = getHealthColor(score);
          const glowClass = getGlowClass(metric.key);
          return (
            <motion.div
              key={metric.key}
              variants={item}
              className="glass-card-premium card-hover-lift micro-interaction rounded-xl p-3 sm:p-4 group cursor-default space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{metric.label}</span>
                <span
                  className={cn('text-sm font-semibold tabular-nums', glowClass)}
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
              {/* Subtle gradient fill bar */}
              <div className="h-[2px] w-full rounded-full overflow-hidden bg-muted/50">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${score}%`,
                    background: `linear-gradient(90deg, ${color}66, ${color})`,
                  }}
                />
              </div>
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-muted-foreground/60">
                Оценка: {score}/100
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