'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  AlertTriangle,
  TrendingDown,
  Plus,
  Search,
  Filter,
  Sparkles,
  ShoppingCart,
  ArrowUpRight,
  ArrowRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StockStatus = 'normal' | 'low' | 'critical';
type TrendDirection = 'up' | 'down' | 'stable';

type InventoryFilter = 'all' | 'low' | 'critical';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  status: StockStatus;
  trend: TrendDirection;
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Кофе зерновой',
    category: 'Напитки',
    price: '4 500₸/кг',
    stock: '12 кг',
    status: 'normal',
    trend: 'up',
  },
  {
    id: '2',
    name: 'Молоко',
    category: 'Молочные',
    price: '800₸/л',
    stock: '3 л',
    status: 'low',
    trend: 'down',
  },
  {
    id: '3',
    name: 'Сироп ванильный',
    category: 'Добавки',
    price: '2 500₸',
    stock: '8 шт',
    status: 'normal',
    trend: 'stable',
  },
  {
    id: '4',
    name: 'Чизкейк',
    category: 'Десерты',
    price: '3 800₸',
    stock: '4 шт',
    status: 'low',
    trend: 'down',
  },
  {
    id: '5',
    name: 'Круассан',
    category: 'Выпечка',
    price: '1 200₸',
    stock: '15 шт',
    status: 'normal',
    trend: 'up',
  },
  {
    id: '6',
    name: 'Шоколад',
    category: 'Добавки',
    price: '3 200₸',
    stock: '2 шт',
    status: 'critical',
    trend: 'down',
  },
  {
    id: '7',
    name: 'Чай зелёный',
    category: 'Напитки',
    price: '1 800₸/пач',
    stock: '10 пач',
    status: 'normal',
    trend: 'stable',
  },
  {
    id: '8',
    name: 'Лимон',
    category: 'Фрукты',
    price: '600₸/кг',
    stock: '1 кг',
    status: 'low',
    trend: 'down',
  },
];

const statusConfig: Record<StockStatus, { label: string; color: string; dotColor: string }> = {
  normal: {
    label: 'Норма',
    color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dotColor: 'bg-emerald-400',
  },
  low: {
    label: 'Низкий',
    color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    dotColor: 'bg-amber-400',
  },
  critical: {
    label: 'Критический',
    color: 'bg-red-500/15 text-red-400 border-red-500/30',
    dotColor: 'bg-red-400',
  },
};

const trendIcons: Record<TrendDirection, React.ReactNode> = {
  up: <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />,
  down: <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />,
  stable: <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />,
};

const filters: { key: InventoryFilter; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'low', label: 'Низкий запас' },
  { key: 'critical', label: 'Критический' },
];

export function InventoryList() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<InventoryFilter>('all');

  const filtered = mockInventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === 'all' || item.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const criticalCount = mockInventory.filter(
    (i) => i.status === 'critical'
  ).length;
  const lowCount = mockInventory.filter((i) => i.status === 'low').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
            <Package className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gradient-warm">Инвентарь и меню</h2>
            <p className="text-xs text-muted-foreground">
              Управление запасами и меню
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Добавить
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="text-2xl font-bold">{mockInventory.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Всего позиций</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-400">{lowCount}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Низкий запас</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{criticalCount}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Критический</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или категории..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <Button
              key={f.key}
              variant={activeFilter === f.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(f.key)}
              className={
                activeFilter === f.key
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : ''
              }
            >
              {f.key === 'critical' && criticalCount > 0 && (
                <span className="relative flex h-2 w-2 mr-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
                </span>
              )}
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Table Header (desktop) */}
      <div className="hidden md:grid md:grid-cols-[1fr_0.7fr_0.7fr_0.6fr_0.9fr_0.6fr_0.5fr] gap-3 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <span>Название</span>
        <span>Категория</span>
        <span>Цена</span>
        <span>Запас</span>
        <span>Статус</span>
        <span>Тренд</span>
        <span className="text-right">Действие</span>
      </div>

      {/* Inventory Items */}
      <div className="glass-card rounded-xl overflow-hidden divide-y divide-border/40">
        {filtered.map((item, index) => {
          const statusCfg = statusConfig[item.status];
          const isCritical = item.status === 'critical';

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className={cn(
                'grid grid-cols-1 md:grid-cols-[1fr_0.7fr_0.7fr_0.6fr_0.9fr_0.6fr_0.5fr] gap-2 md:gap-3 px-4 py-3.5 items-center transition-colors hover:bg-white/[0.02] card-press',
                isCritical && 'bg-red-500/[0.03]'
              )}
            >
              {/* Name + Category (mobile) */}
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground md:hidden">
                    {item.category} · {item.price}
                  </p>
                </div>
              </div>

              {/* Category (desktop) */}
              <span className="hidden md:block text-sm text-muted-foreground">
                {item.category}
              </span>

              {/* Price (desktop) */}
              <span className="hidden md:block text-sm font-medium">
                {item.price}
              </span>

              {/* Stock */}
              <div className="flex items-center gap-2">
                <span className="text-sm">{item.stock}</span>
                {isCritical && (
                  <span className="relative flex h-2 w-2 shrink-0 active-indicator">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400 pulse-dot" />
                  </span>
                )}
              </div>

              {/* Status */}
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 w-fit',
                  statusCfg.color
                )}
              >
                <span
                  className={cn('w-1.5 h-1.5 rounded-full mr-1.5', statusCfg.dotColor)}
                />
                {statusCfg.label}
              </Badge>

              {/* Trend (desktop) */}
              <div className="hidden md:flex items-center">
                {trendIcons[item.trend]}
              </div>

              {/* Trend (mobile) + Action */}
              <div className="flex items-center gap-3 md:justify-end">
                <div className="md:hidden flex items-center">
                  {trendIcons[item.trend]}
                </div>
                {isCritical ? (
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white text-xs h-7 px-3"
                  >
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Заказать
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs h-7 px-3 text-muted-foreground hover:text-foreground"
                  >
                    Подробнее
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Ничего не найдено
          </div>
        )}
      </div>

      {/* AI Recommendation Box */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass-card rounded-xl p-4 sm:p-5 border-amber-500/20 relative overflow-hidden"
      >
        {/* Ambient glow */}
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-amber-500/5 blur-2xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              AI Рекомендация по запасам
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-foreground leading-relaxed">
              <span className="text-red-400 font-semibold">Шоколад</span> и{' '}
              <span className="text-red-400 font-semibold">лимон</span> —
              критически низкий запас. Рекомендуем заказать в ближайшие{' '}
              <span className="font-semibold text-amber-400">24 часа</span>.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Прогноз расхода на неделю:{' '}
              <span className="text-foreground">5 кг шоколада</span>,{' '}
              <span className="text-foreground">3 кг лимонов</span>.
            </p>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
              Заказать всё
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs border-border"
            >
              <TrendingDown className="w-3.5 h-3.5 mr-1.5" />
              Аналитика запасов
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
