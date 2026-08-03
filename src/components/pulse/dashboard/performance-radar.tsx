'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain } from 'lucide-react';

interface RadarMetric {
  label: string;
  value: number;
}

const metrics: RadarMetric[] = [
  { label: 'Продажи', value: 85 },
  { label: 'Клиенты', value: 72 },
  { label: 'Удовлетворённость', value: 91 },
  { label: 'Маркетинг', value: 65 },
  { label: 'Инновации', value: 78 },
  { label: 'Финансы', value: 88 },
];

const NUM_AXES = metrics.length;
const ANGLE_STEP = (2 * Math.PI) / NUM_AXES;
const START_ANGLE = -Math.PI / 2; // Start from top

const CENTER_X = 150;
const CENTER_Y = 150;
const MAX_RADIUS = 110;

/** Generate polygon points for a given radius level (0-100) */
function getPolygonPoints(level: number): string {
  const r = (level / 100) * MAX_RADIUS;
  return Array.from({ length: NUM_AXES }, (_, i) => {
    const angle = START_ANGLE + i * ANGLE_STEP;
    return `${CENTER_X + r * Math.cos(angle)},${CENTER_Y + r * Math.sin(angle)}`;
  }).join(' ');
}

/** Generate data polygon points based on metric values */
function getDataPolygonPoints(): string {
  return metrics.map((m, i) => {
    const angle = START_ANGLE + i * ANGLE_STEP;
    const r = (m.value / 100) * MAX_RADIUS;
    return `${CENTER_X + r * Math.cos(angle)},${CENTER_Y + r * Math.sin(angle)}`;
  }).join(' ');
}

/** Generate axis line endpoints */
function getAxisLines() {
  return Array.from({ length: NUM_AXES }, (_, i) => {
    const angle = START_ANGLE + i * ANGLE_STEP;
    return {
      x2: CENTER_X + MAX_RADIUS * Math.cos(angle),
      y2: CENTER_Y + MAX_RADIUS * Math.sin(angle),
    };
  });
}

/** Generate label positions */
function getLabelPositions() {
  return metrics.map((m, i) => {
    const angle = START_ANGLE + i * ANGLE_STEP;
    const labelR = MAX_RADIUS + 24;
    return {
      x: CENTER_X + labelR * Math.cos(angle),
      y: CENTER_Y + labelR * Math.sin(angle),
      metric: m,
      angle,
    };
  });
}

export function PerformanceRadar() {
  const gridLevels = [33, 66, 100];
  const axisLines = getAxisLines();
  const dataPoints = getDataPolygonPoints();
  const labels = getLabelPositions();

  // Data point circle positions
  const dataCircles = metrics.map((m, i) => {
    const angle = START_ANGLE + i * ANGLE_STEP;
    const r = (m.value / 100) * MAX_RADIUS;
    return {
      cx: CENTER_X + r * Math.cos(angle),
      cy: CENTER_Y + r * Math.sin(angle),
      value: m.value,
    };
  });

  return (
    <motion.div
      className="glass-card rounded-xl p-4 sm:p-6 breathe-glow"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15">
          <Activity className="size-4 text-purple-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">Производительность</h3>
          <p className="text-[10px] text-muted-foreground">6 ключевых метрик</p>
        </div>
      </div>

      {/* SVG Radar Chart */}
      <div className="flex justify-center spotlight-container">
        <svg
          viewBox="0 0 300 300"
          className="w-full max-w-[300px]"
          aria-label="Радарная диаграмма производительности"
          role="img"
        >
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.35)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.15)" />
            </linearGradient>
            <filter id="radarGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid polygons */}
          {gridLevels.map((level) => (
            <polygon
              key={level}
              points={getPolygonPoints(level)}
              fill="none"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="1"
            />
          ))}

          {/* Axis lines */}
          {axisLines.map((line, i) => (
            <line
              key={i}
              x1={CENTER_X}
              y1={CENTER_Y}
              x2={line.x2}
              y2={line.y2}
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="1"
            />
          ))}

          {/* Data polygon with animation */}
          <motion.polygon
            points={dataPoints}
            fill="url(#radarGradient)"
            stroke="rgba(139, 92, 246, 0.8)"
            strokeWidth="2"
            strokeLinejoin="round"
            filter="url(#radarGlow)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            style={{ transformOrigin: `${CENTER_X}px ${CENTER_Y}px` }}
          />

          {/* Data points (circles at vertices) */}
          {dataCircles.map((circle, i) => (
            <motion.circle
              key={i}
              cx={circle.cx}
              cy={circle.cy}
              r="4"
              fill="#8b5cf6"
              stroke="#0a0a0f"
              strokeWidth="2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              style={{ transformOrigin: `${circle.cx}px ${circle.cy}px` }}
            />
          ))}

          {/* Labels */}
          {labels.map((label, i) => {
            const isTop = label.angle < -Math.PI / 2 + 0.1 && label.angle > -Math.PI / 2 - 0.1;
            const isBottom = label.angle > Math.PI / 2 - 0.1 && label.angle < Math.PI / 2 + 0.1;
            const isLeft = label.x < CENTER_X;
            const isRight = label.x > CENTER_X;

            let anchor = 'middle';
            if (isLeft) anchor = 'end';
            else if (isRight) anchor = 'start';

            const yOffset = isTop ? -4 : isBottom ? 12 : 2;

            return (
              <g key={i}>
                <text
                  x={label.x}
                  y={label.y + yOffset}
                  textAnchor={anchor}
                  className="text-[10px] fill-muted-foreground font-medium"
                  dominantBaseline="middle"
                >
                  {label.metric.label}
                </text>
                <text
                  x={label.x}
                  y={label.y + yOffset + 13}
                  textAnchor={anchor}
                  className="text-[11px] fill-foreground font-bold"
                  dominantBaseline="middle"
                >
                  {label.metric.value}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* AI Analysis Box */}
      <div className="mt-4 rounded-xl bg-purple-500/8 border border-purple-500/15 p-3">
        <div className="flex items-start gap-2">
          <Brain className="size-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-semibold text-purple-400 mb-1">Анализ AI</p>
            <p className="text-xs text-foreground/80 leading-relaxed">
              Ваша сильная сторона — Удовлетворённость клиентов{' '}
              <span className="text-emerald-400 font-bold">(91%)</span>.
              Улучшите Маркетинг{' '}
              <span className="text-amber-400 font-bold">(65%)</span> — запуск SMM кампании может поднять на{' '}
              <span className="text-purple-300 font-medium">15-20%</span>.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
