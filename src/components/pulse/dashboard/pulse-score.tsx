'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

const METRIC_INFO: Record<string, { delta: string }> = {
  sales: { delta: 'на 2 больше чем на прошлой неделе' },
  clients: { delta: 'на 1 больше чем на прошлой неделе' },
  loyalty: { delta: 'без изменений' },
  marketing: { delta: 'на 3 меньше чем на прошлой неделе' },
  profit: { delta: 'на 2 больше чем на прошлой неделе' },
};

const METRIC_LABELS: Record<string, string> = {
  sales: 'Продажи',
  clients: 'Клиенты',
  loyalty: 'Лояльность',
  marketing: 'Маркетинг',
  profit: 'Прибыль',
};

function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}

function getStatusText(score: number): string {
  if (score >= 90) return 'Ваш бизнес в отличной форме';
  if (score >= 80) return 'Ваш бизнес стабилен';
  if (score >= 60) return 'Есть зоны для улучшения';
  return 'Требуется внимание';
}

function MetricTooltip({
  metricKey,
  score,
}: {
  metricKey: string;
  score: number;
}) {
  const info = METRIC_INFO[metricKey];
  const label = METRIC_LABELS[metricKey];
  if (!info || !label) return <>{score}</>;

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span className="cursor-default font-semibold tabular-nums" style={{ color: getScoreColor(score) }}>
          {score}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 text-sm">
        <p className="font-medium">{label}: {score}/100</p>
        <p className="text-xs text-muted-foreground mt-1">{info.delta}</p>
      </HoverCardContent>
    </HoverCard>
  );
}

/* Mini sparkline showing last 7 days of scores */
const WEEKLY_SCORES = [85, 87, 86, 88, 89, 90, 91];

function MiniSparkline() {
  const max = Math.max(...WEEKLY_SCORES);
  const min = Math.min(...WEEKLY_SCORES);
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-[3px] h-6 mt-1">
      {WEEKLY_SCORES.map((s, i) => {
        const height = 4 + ((s - min) / range) * 20;
        return (
          <div
            key={i}
            className="w-[4px] rounded-full transition-all duration-500"
            style={{
              height: `${height}px`,
              backgroundColor: i === WEEKLY_SCORES.length - 1
                ? '#8b5cf6'
                : 'rgba(139, 92, 246, 0.3)',
              opacity: i === WEEKLY_SCORES.length - 1 ? 1 : 0.5 + (i / WEEKLY_SCORES.length) * 0.5,
            }}
          />
        );
      })}
    </div>
  );
}

export function PulseScore() {
  const pulseScore = useAppStore((s) => s.pulseScore);
  const [animatedScore, setAnimatedScore] = useState(0);

  const score = pulseScore.total;
  const color = getScoreColor(score);
  const statusText = getStatusText(score);
  const breakdown = pulseScore.breakdown;

  // SVG circle params
  const radius = 80;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="flex flex-col items-center justify-center aurora-border rounded-2xl p-4 md:p-6">
      <div className="relative breathe">
        {/* Purple glow behind ring */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-30"
          style={{ backgroundColor: '#8b5cf6' }}
        />

        <svg
          width={radius * 2}
          height={radius * 2}
          className="relative transform -rotate-90 score-glow glow-rotate"
        >
          {/* Background circle */}
          <circle
            stroke="rgba(255,255,255,0.05)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Score circle */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference + ' ' + circumference}
            style={{
              strokeDashoffset,
              transition: 'stroke 0.5s ease',
            }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="score-ring"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <HoverCard openDelay={400} closeDelay={100}>
            <HoverCardTrigger asChild>
              <motion.span
                className="text-5xl font-bold tracking-tighter pulse-text-gradient cursor-default stat-glow-purple text-gradient-cycle"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {animatedScore}
              </motion.span>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 text-sm">
              <p className="font-medium">{score} из 100 баллов</p>
              <p className="text-xs text-muted-foreground mt-1">+3 за неделю</p>
            </HoverCardContent>
          </HoverCard>
          <span className="text-xs text-muted-foreground mt-0.5">
            из 100
          </span>
        </div>
      </div>

      {/* "AI оценивает" label with pulse dot */}
      <div className="mt-2 flex items-center gap-1.5">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-purple-400 pulse-dot" />
        <span className="text-[10px] text-muted-foreground/70 font-medium">AI оценивает</span>
      </div>

      {/* PULSE SCORE label */}
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
        PULSE SCORE
      </p>

      {/* Status text - improved styling */}
      <motion.p
        className="mt-1 text-sm font-medium text-center max-w-[180px]"
        style={{ color }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {statusText}
      </motion.p>

      {/* Mini sparkline — last 7 days */}
      <div className="mt-3 w-full max-w-[200px]">
        <p className="text-[9px] text-muted-foreground/50 mb-1 text-center uppercase tracking-wider">7 дней</p>
        <MiniSparkline />
      </div>

      {/* Mini metric breakdown with tooltips */}
      <div className="mt-3 space-y-1.5 w-full max-w-[200px]">
        <div className="badge-bounce inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold mb-1">
          Top 5%
        </div>
        {(Object.entries(breakdown) as [string, number][]).map(([key, val]) => (
          <div key={key} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{METRIC_LABELS[key] ?? key}</span>
            <MetricTooltip metricKey={key} score={val} />
          </div>
        ))}
      </div>
    </div>
  );
}
