'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Heart, Coffee, UtensilsCrossed, Scissors, Plus } from 'lucide-react';

// ============================================================
// ClientBonuses — with level progress ring
// ============================================================
function LevelProgressRing({ progress }: { progress: number }) {
  const radius = 52;
  const stroke = 6;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={radius * 2} height={radius * 2} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="rgba(139,92,246,0.12)"
          strokeWidth={stroke}
        />
        {/* Progress arc */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="url(#levelRingGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="levelRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-purple-400">99.2%</span>
        <span className="text-[9px] text-muted-foreground leading-tight">до Золота</span>
      </div>
    </div>
  );
}

export function ClientBonuses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Мои бонусы</h1>
        <p className="text-muted-foreground mt-1">
          Накопленные баллы и уровень лояльности
        </p>
      </div>
      <div className="glass-card rounded-xl p-6 text-center space-y-4">
        <p className="text-sm text-muted-foreground uppercase tracking-wider">
          Ваш баланс
        </p>
        <p className="text-5xl font-bold pulse-text-gradient">2 480</p>
        <p className="text-muted-foreground">баллов</p>
        <Separator />
        <div className="flex justify-around">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">Серебро</p>
            <p className="text-xs text-muted-foreground">Уровень</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">2 500</p>
            <p className="text-xs text-muted-foreground">до Золота</p>
          </div>
        </div>
      </div>

      {/* Level Progress Ring */}
      <div className="glass-card-deep rounded-xl p-6 flex flex-col items-center gap-4">
        <LevelProgressRing progress={99.2} />
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Серебро
          </span>
          <span className="text-border">→</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Золото
          </span>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <h3 className="font-semibold">Преимущества уровня Серебро</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Накопление 1.5₸ = 1 балл
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Сюрприз на день рождения
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Персональные предложения
          </li>
        </ul>
      </div>
      <div className="glass-card rounded-xl p-6 space-y-3">
        <h3 className="font-semibold">Реферальная программа</h3>
        <p className="text-sm text-muted-foreground">
          Пригласите друга и получите бонус после его первой покупки
        </p>
        <div className="bg-secondary rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground mb-2">Ваш промокод</p>
          <p className="text-2xl font-mono font-bold text-purple-400 tracking-widest">
            PULSE-USER-4821
          </p>
        </div>
        <Button variant="outline" className="w-full">
          Скопировать код
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// ClientFavorites — enhanced empty state with suggestions
// ============================================================
const popularPlaces = [
  { name: 'Coffee & Co', icon: Coffee, category: 'Кофейня' },
  { name: 'Burger House', icon: UtensilsCrossed, category: 'Ресторан' },
  { name: 'Beauty Salon', icon: Scissors, category: 'Салон красоты' },
];

export function ClientFavorites() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Избранное</h1>
        <p className="text-muted-foreground mt-1">
          Сохранённые заведения и акции
        </p>
      </div>

      {/* Centered illustration area */}
      <div className="glass-card rounded-xl p-10 flex flex-col items-center gap-5">
        <div className="relative">
          <Heart
            className="w-20 h-20 text-purple-400/60"
            strokeWidth={1}
            fill="none"
            style={{
              animation: 'heart-pulse-outline 2s ease-in-out infinite',
            }}
          />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold pulse-text-gradient">
            Начните добавлять любимые места!
          </p>
          <p className="text-sm text-muted-foreground mt-1.5">
            Нажмите ♡ на карточке заведения, чтобы сохранить
          </p>
        </div>
      </div>

      {/* Popular suggestions */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Популярные
        </p>
        <div className="space-y-2.5">
          {popularPlaces.map((place, index) => {
            const Icon = place.icon;
            return (
              <motion.div
                key={place.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="glass-card rounded-xl px-4 py-3.5 flex items-center gap-3 card-hover-lift cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{place.name}</p>
                  <p className="text-xs text-muted-foreground">{place.category}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 gap-1.5 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Добавить
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
