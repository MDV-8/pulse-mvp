'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  useRealtimeSimulation,
  type SimulatedMetrics,
} from '@/hooks/use-realtime-simulation';

type MetricKey = keyof SimulatedMetrics;

interface MetricDisplay {
  key: MetricKey;
  label: string;
  format: (v: number) => string;
}

const DISPLAY_METRICS: MetricDisplay[] = [
  { key: 'revenue', label: 'Выручка', format: (v) => `${Math.round(v).toLocaleString('ru-RU')} ₸` },
  { key: 'clients', label: 'Клиенты', format: (v) => String(Math.round(v)) },
  { key: 'averageCheck', label: 'Средний чек', format: (v) => `${Math.round(v).toLocaleString('ru-RU')} ₸` },
  { key: 'pulseScore', label: 'AI Score', format: (v) => String(Math.round(v)) },
];

/** Detect if a value changed and in which direction */
function getFlashClass(current: number, previous: number): string {
  if (current > previous) return 'text-emerald-400';
  if (current < previous) return 'text-red-400';
  return '';
}

function MetricValue({
  current,
  previous,
  formatter,
}: {
  current: number;
  previous: number;
  formatter: (v: number) => string;
}) {
  const [flash, setFlash] = useState<string | null>(null);
  const prevValRef = useRef(previous);

  useEffect(() => {
    if (current !== prevValRef.current) {
      const cls = getFlashClass(current, prevValRef.current);
      setFlash(cls);
      const timer = setTimeout(() => setFlash(null), 800);
      prevValRef.current = current;
      return () => clearTimeout(timer);
    }
  }, [current]);

  return (
    <span
      className={`tabular-nums font-semibold text-sm transition-colors duration-300 counter-flip ${flash ?? 'text-foreground'}`}
    >
      {formatter(current)}
    </span>
  );
}

export function RealtimeBanner() {
  const { metrics, previous } = useRealtimeSimulation();
  const [secondsAgo, setSecondsAgo] = useState(0);
  const metricsSnapshotRef = useRef<string>('');

  // Timer that both counts seconds AND detects metric changes
  useEffect(() => {
    const id = setInterval(() => {
      // Detect metric change by stringifying
      const snap = JSON.stringify(metrics);
      if (metricsSnapshotRef.current !== snap) {
        metricsSnapshotRef.current = snap;
        // Use a micro-task to avoid calling setState synchronously in effect body
        // — but actually the linter complains about calling setState in the effect body.
        // We restructure: set secondsAgo to 0 via a callback pattern.
        setSecondsAgo(0);
      } else {
        setSecondsAgo((s) => s + 1);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [metrics]);

  const timeLabel =
    secondsAgo < 5 ? 'только что' : `${secondsAgo} сек назад`;

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/50 backdrop-blur-md px-4 py-2">
      {/* Left: LIVE indicator */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="relative flex h-2 w-2 active-indicator">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
          Live
        </span>
      </div>

      {/* Metrics row */}
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto flex-1 justify-center">
        {DISPLAY_METRICS.map((m) => (
          <div key={m.key} className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              {m.label}:
            </span>
            <MetricValue
              current={metrics[m.key]}
              previous={previous[m.key]}
              formatter={m.format}
            />
          </div>
        ))}
      </div>

      {/* Right: last update time */}
      <div className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
        Обновлено: {timeLabel}
      </div>
    </div>
  );
}
