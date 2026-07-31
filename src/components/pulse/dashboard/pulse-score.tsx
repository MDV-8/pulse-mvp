'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';

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

export function PulseScore() {
  const pulseScore = useAppStore((s) => s.pulseScore);
  const [animatedScore, setAnimatedScore] = useState(0);

  const score = pulseScore.total;
  const color = getScoreColor(score);
  const statusText = getStatusText(score);

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
          className="relative transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke="rgba(255,255,255,0.05)"
            fill="transparent"
            strokeWidth={strokeWidth}
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
          <motion.span
            className="text-5xl font-bold tracking-tighter"
            style={{ color }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {animatedScore}
          </motion.span>
          <span className="text-xs text-muted-foreground mt-0.5">
            из 100
          </span>
        </div>
      </div>

      {/* Status text */}
      <motion.p
        className="mt-4 text-sm font-medium text-muted-foreground text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {statusText}
      </motion.p>
    </div>
  );
}
