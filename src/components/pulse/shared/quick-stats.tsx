'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowUpRight, TrendingUp, Users, ShoppingCart, Receipt, Target, Repeat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAnimatedCounter } from '@/hooks/use-animated-counter';

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
  glowClass: string;
  iconBg: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  formatValue?: (v: number) => string;
}

const stats: StatItem[] = [
  {
    label: 'Выручка сегодня',
    value: 185400,
    suffix: '₸',
    icon: <TrendingUp size={16} />,
    glowClass: 'stat-glow-purple',
    iconBg: 'bg-purple-500/15 text-purple-400',
    trend: { value: '+8.2%', positive: true },
    formatValue: (v: number) => v.toLocaleString('ru-RU'),
  },
  {
    label: 'Заказы',
    value: 47,
    suffix: '',
    icon: <ShoppingCart size={16} />,
    glowClass: 'stat-glow-emerald',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
    trend: { value: '+12 vs вчера', positive: true },
  },
  {
    label: 'Новые клиенты',
    value: 8,
    suffix: '',
    icon: <Users size={16} />,
    glowClass: 'stat-glow-cyan',
    iconBg: 'bg-cyan-500/15 text-cyan-400',
  },
  {
    label: 'Средний чек',
    value: 3940,
    suffix: '₸',
    icon: <Receipt size={16} />,
    glowClass: 'stat-glow-amber',
    iconBg: 'bg-amber-500/15 text-amber-400',
    trend: { value: '+3.1%', positive: true },
    formatValue: (v: number) => v.toLocaleString('ru-RU'),
  },
  {
    label: 'Конверсия',
    value: 34,
    suffix: '%',
    icon: <Target size={16} />,
    glowClass: 'stat-glow-pink',
    iconBg: 'bg-pink-500/15 text-pink-400',
  },
  {
    label: 'Повторные',
    value: 62,
    suffix: '%',
    icon: <Repeat size={16} />,
    glowClass: 'stat-glow-green',
    iconBg: 'bg-green-500/15 text-green-400',
  },
];

export function QuickStats() {
  const [lastUpdate, setLastUpdate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-card-premium rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <Zap size={18} className="text-purple-400" />
          <h3 className="text-sm font-semibold text-foreground">Быстрая статистика</h3>
          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-xs font-medium px-2 py-0 gap-1.5">
            <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Live
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>

      {/* Last Update */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <p className="text-xs text-muted-foreground">
          Последнее обновление: {lastUpdate} сек назад
        </p>
      </div>
    </div>
  );
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const animatedValue = useAnimatedCounter(stat.value, 1500);
  const displayValue = stat.formatValue
    ? stat.formatValue(animatedValue)
    : String(Math.round(animatedValue));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      className={`rounded-lg border border-white/5 bg-white/[0.03] p-3.5 stagger-${Math.min(index, 5)} card-hover-lift`}
    >
      {/* Icon */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${stat.iconBg}`}
      >
        {stat.icon}
      </div>

      {/* Label */}
      <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>

      {/* Value + Trend */}
      <div className="flex items-end justify-between gap-1.5">
        <span className={`text-xl font-bold text-foreground number-glow ${stat.glowClass}`}>
          {displayValue}{stat.suffix}
        </span>
        {stat.trend && (
          <div className="flex items-center gap-0.5 shrink-0 mb-0.5">
            <ArrowUpRight
              size={13}
              className={stat.trend.positive ? 'text-emerald-400' : 'text-red-400'}
            />
            <span
              className={`text-xs font-medium ${
                stat.trend.positive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {stat.trend.value}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
