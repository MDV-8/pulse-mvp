'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock } from 'lucide-react';

// ── Data ───────────────────────────────────────────────────

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const TIME_SLOTS = ['9', '11', '13', '15', '17', '19', '21'];

/*
 * Traffic percentages: rows = days (Mon-Sun), cols = time slots (9-21 in 2h)
 * Each value is 0-100 representing relative traffic.
 * Weekend (Сб index 5, Вс index 6) has higher afternoon, lower morning.
 */
const HEATMAP_DATA: number[][] = [
  // 9-11  11-13  13-15  15-17  17-19  19-21  21-22
  [15, 55, 20, 75, 85, 50, 15], // Пн
  [20, 60, 18, 72, 82, 45, 12], // Вт
  [12, 50, 22, 78, 88, 55, 18], // Ср
  [18, 58, 15, 80, 90, 48, 14], // Чт
  [25, 65, 25, 85, 95, 58, 20], // Пт
  [10, 30, 55, 90, 80, 45, 10], // Сб
  [8, 25, 50, 85, 75, 40, 8],   // Вс
];

/* Estimated orders per percentage point (rough, for tooltip) */
function estimateOrders(percentage: number): number {
  return Math.round((percentage / 100) * 28);
}

// ── Color helpers ──────────────────────────────────────────

function cellColor(value: number): string {
  if (value >= 90) return 'bg-purple-500/80 shadow-[0_0_12px_rgba(139,92,246,0.5)]';
  if (value >= 70) return 'bg-purple-500/60';
  if (value >= 50) return 'bg-purple-500/40';
  if (value >= 30) return 'bg-purple-500/20';
  return 'bg-purple-500/8';
}

function cellTextColor(value: number): string {
  if (value >= 70) return 'text-white font-semibold';
  if (value >= 40) return 'text-purple-200';
  return 'text-muted-foreground/60';
}

// ── Animation config ───────────────────────────────────────

const cellVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.015,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
};

// ── Component ──────────────────────────────────────────────

export function PeakHours() {
  // Track hovered cell for tooltip
  const [hoveredCell, setHoveredCell] = useState<{
    day: string;
    time: string;
    value: number;
    orders: number;
  } | null>(null);

  return (
    <div className="space-y-4">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/20">
          <Flame className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Часы пик</h2>
          <p className="text-sm text-muted-foreground">
            Загруженность по дням и часам
          </p>
        </div>
      </div>

      {/* ── Heatmap Grid ──────────────────────────────────── */}
      <div className="gradient-border-card rounded-xl p-4 sm:p-5">
          {/* Column labels (time slots) */}
          <div className="grid grid-cols-[36px_repeat(7,1fr)] gap-1 sm:gap-1.5 mb-1.5">
            <div /> {/* spacer for row labels */}
            {TIME_SLOTS.map((t) => (
              <div
                key={t}
                className="text-center text-[10px] sm:text-xs text-muted-foreground font-medium"
              >
                {t}:00
              </div>
            ))}
          </div>

          {/* Rows: one per day */}
          {DAYS.map((day, dayIdx) => (
            <div
              key={day}
              className="grid grid-cols-[36px_repeat(7,1fr)] gap-1 sm:gap-1.5 mb-1 sm:mb-1.5"
            >
              {/* Row label */}
              <div className="flex items-center text-xs font-medium text-muted-foreground">
                {day}
              </div>

              {/* Cells */}
              {HEATMAP_DATA[dayIdx].map((value, slotIdx) => {
                const cellIndex = dayIdx * 7 + slotIdx;
                const orders = estimateOrders(value);
                const timeRange = `${TIME_SLOTS[slotIdx]}:00-${slotIdx < 6 ? TIME_SLOTS[slotIdx + 1] : '22'}:00`;

                return (
                  <motion.div
                    key={`${day}-${slotIdx}`}
                    custom={cellIndex}
                    variants={cellVariants}
                    initial="hidden"
                    animate="visible"
                    className={
                      'relative flex items-center justify-center h-8 sm:h-10 rounded-md cursor-default ' +
                      cellColor(value) +
                      ' transition-all duration-200 hover:ring-1 hover:ring-white/20'
                    }
                    onMouseEnter={() =>
                      setHoveredCell({ day, time: timeRange, value, orders })
                    }
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <span
                      className={`text-[9px] sm:text-xs tabular-nums ${cellTextColor(value)}`}
                    >
                      {value}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ))}

          {/* ── Hover Info Bar ─────────────────────────────── */}
          {hoveredCell && (
            <motion.div
              className="mt-3 pt-3 border-t border-border flex items-center gap-4 text-xs"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {hoveredCell.day}, {hoveredCell.time}
                </span>
              </div>
              <span className="font-semibold text-purple-300 number-display">
                {hoveredCell.value}%
              </span>
              <span className="text-muted-foreground number-display">
                ≈ {hoveredCell.orders} заказов
              </span>
            </motion.div>
          )}
        </div>

      {/* ── Color Legend ───────────────────────────────────── */}
      <div className="glass-card rounded-xl p-4">
        <p className="text-xs text-muted-foreground mb-2.5 font-medium">
          Шкала загруженности
        </p>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground mr-1">Мало</span>
          <div className="h-3 flex-1 rounded-full bg-purple-500/8" />
          <div className="h-3 flex-1 rounded-full bg-purple-500/20" />
          <div className="h-3 flex-1 rounded-full bg-purple-500/40" />
          <div className="h-3 flex-1 rounded-full bg-purple-500/60" />
          <div className="h-3 flex-1 rounded-full bg-purple-500/80 shadow-[0_0_10px_rgba(139,92,246,0.4)]" />
          <span className="text-[10px] text-muted-foreground ml-1">Пик</span>
        </div>
      </div>

      {/* ── AI Summary ─────────────────────────────────────── */}
      <div className="glass-card rounded-xl p-4 ai-glow-card">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20 shrink-0 mt-0.5">
            <span className="text-sm">🤖</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
              Инсайт AI
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Пик нагрузки:{' '}
              <span className="text-purple-300 font-medium">
                Пт 17:00-19:00 (95%)
              </span>
              . Рекомендуем Happy Hour в{' '}
              <span className="text-purple-300 font-medium">
                Пн 15:00
              </span>{' '}
              для выравнивания нагрузки.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
