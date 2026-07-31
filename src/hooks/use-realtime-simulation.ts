'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface SimulatedMetrics {
  revenue: number;
  clients: number;
  averageCheck: number;
  profit: number;
  pulseScore: number;
}

const BASE: SimulatedMetrics = {
  revenue: 245800,
  clients: 156,
  averageCheck: 1576,
  profit: 89600,
  pulseScore: 91,
};

/** Clamp a value between min and max */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Fluctuate a numeric value by a given percentage (±) */
function fluctuate(base: number, pct: number): number {
  const factor = 1 + (Math.random() * 2 - 1) * (pct / 100);
  return base * factor;
}

export function useRealtimeSimulation(intervalMs = 15000) {
  const [metrics, setMetrics] = useState<SimulatedMetrics>(BASE);
  const [previous, setPrevious] = useState<SimulatedMetrics>(BASE);
  const metricsRef = useRef<SimulatedMetrics>(BASE);

  const tick = useCallback(() => {
    const newRevenue = Math.round(fluctuate(BASE.revenue, 2));
    const newClients = clamp(
      Math.round(fluctuate(BASE.clients, 1)),
      BASE.clients - 3,
      BASE.clients + 3
    );
    const newAvgCheck = Math.round(fluctuate(BASE.averageCheck, 1));
    const newProfit = Math.round(fluctuate(BASE.profit, 3));
    const newPulse = clamp(
      Math.round(BASE.pulseScore + (Math.random() * 2 - 1)),
      85,
      98
    );

    const updated: SimulatedMetrics = {
      revenue: newRevenue,
      clients: newClients,
      averageCheck: newAvgCheck,
      profit: newProfit,
      pulseScore: newPulse,
    };

    setPrevious(metricsRef.current);
    metricsRef.current = updated;
    setMetrics(updated);
  }, []);

  useEffect(() => {
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [tick, intervalMs]);

  return { metrics, previous };
}
