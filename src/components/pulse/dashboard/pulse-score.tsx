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
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Purple glow behind ring */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-30"
          style={{ backgroundColor: '#8b5cf6' }}
        />

        <svg
          width={radius * 2}
          height={radius * 2}
          className="relative transform -rotate-90 score-glow"
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
                className="text-5xl font-bold tracking-tighter pulse-text-gradient cursor-default"
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

      {/* PULSE SCORE label */}
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">
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

      {/* Mini metric breakdown with tooltips */}
      <div className="mt-4 space-y-1.5 w-full max-w-[200px]">
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
