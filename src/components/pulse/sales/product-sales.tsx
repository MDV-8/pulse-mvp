'use client';

import { useState } from 'react';
import { Coffee, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Period = 'today' | '7days' | '30days';

const periodData: Record<Period, { label: string; products: Product[]; total: number }> = {
  today: {
    label: 'Сегодня',
    products: [
      { rank: 1, name: 'Капучино', sold: 42, revenue: 37800, share: 18.5, trend: 5.2 },
      { rank: 2, name: 'Латте', sold: 38, revenue: 34200, share: 16.7, trend: 12.4 },
      { rank: 3, name: 'Раф', sold: 35, revenue: 35000, share: 17.1, trend: 8.7 },
      { rank: 4, name: 'Американо', sold: 28, revenue: 19600, share: 9.6, trend: -2.1 },
      { rank: 5, name: 'Мокко', sold: 22, revenue: 22000, share: 10.8, trend: 3.3 },
      { rank: 6, name: 'Флэт уайт', sold: 18, revenue: 18000, share: 8.8, trend: 1.5 },
      { rank: 7, name: 'Чизкейк', sold: 15, revenue: 22500, share: 11.0, trend: -4.8 },
      { rank: 8, name: 'Круассан', sold: 12, revenue: 14400, share: 7.1, trend: 0.8 },
    ],
    total: 204500,
  },
  '7days': {
    label: '7 дней',
    products: [
      { rank: 1, name: 'Капучино', sold: 287, revenue: 258300, share: 17.8, trend: 3.1 },
      { rank: 2, name: 'Латте', sold: 264, revenue: 237600, share: 16.4, trend: 9.8 },
      { rank: 3, name: 'Раф', sold: 241, revenue: 241000, share: 16.6, trend: 7.2 },
      { rank: 4, name: 'Американо', sold: 198, revenue: 138600, share: 9.6, trend: -1.5 },
      { rank: 5, name: 'Мокко', sold: 153, revenue: 153000, share: 10.6, trend: 2.7 },
      { rank: 6, name: 'Флэт уайт', sold: 126, revenue: 126000, share: 8.7, trend: 0.9 },
      { rank: 7, name: 'Чизкейк', sold: 108, revenue: 162000, share: 11.2, trend: -3.4 },
      { rank: 8, name: 'Круассан', sold: 87, revenue: 104400, share: 7.2, trend: 1.2 },
    ],
    total: 1450900,
  },
  '30days': {
    label: '30 дней',
    products: [
      { rank: 1, name: 'Капучино', sold: 1210, revenue: 1089000, share: 18.2, trend: 4.5 },
      { rank: 2, name: 'Латте', sold: 1098, revenue: 988200, share: 16.5, trend: 11.2 },
      { rank: 3, name: 'Раф', sold: 1024, revenue: 1024000, share: 17.1, trend: 9.1 },
      { rank: 4, name: 'Американо', sold: 842, revenue: 589400, share: 9.9, trend: -0.8 },
      { rank: 5, name: 'Мокко', sold: 654, revenue: 654000, share: 10.9, trend: 3.9 },
      { rank: 6, name: 'Флэт уайт', sold: 534, revenue: 534000, share: 8.9, trend: 1.8 },
      { rank: 7, name: 'Чизкейк', sold: 467, revenue: 700500, share: 11.7, trend: -2.6 },
      { rank: 8, name: 'Круассан', sold: 378, revenue: 453600, share: 7.6, trend: 2.1 },
    ],
    total: 6032700,
  },
};

interface Product {
  rank: number;
  name: string;
  sold: number;
  revenue: number;
  share: number;
  trend: number;
}

const rankGradients = [
  'from-purple-500 to-violet-600',
  'from-violet-500 to-purple-600',
  'from-fuchsia-500 to-pink-600',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-orange-600',
  'from-orange-500 to-red-600',
  'from-cyan-500 to-blue-600',
  'from-blue-500 to-indigo-600',
];

export function ProductSales() {
  const [period, setPeriod] = useState<Period>('today');
  const data = periodData[period];

  const periods: { key: Period; label: string }[] = [
    { key: 'today', label: 'Сегодня' },
    { key: '7days', label: '7 дней' },
    { key: '30days', label: '30 дней' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
            <Coffee className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold">Продажи по продуктам</h2>
        </div>

        {/* Period Tabs */}
        <div className="flex gap-2">
          {periods.map((p) => (
            <Button
              key={p.key}
              variant={period === p.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(p.key)}
              className={
                period === p.key
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : ''
              }
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="glass-card rounded-xl p-4 space-y-1">
        {data.products.map((product) => {
          const isPositive = product.trend >= 0;

          return (
            <div
              key={product.rank}
              className="flex items-center gap-3 py-3 border-b border-border/30 last:border-0 last:pb-0"
            >
              {/* Rank */}
              <div
                className={`w-7 h-7 rounded-lg bg-gradient-to-br ${rankGradients[product.rank - 1]} flex items-center justify-center text-xs font-bold text-white shrink-0`}
              >
                {product.rank}
              </div>

              {/* Product Name + Sold */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm truncate">
                    {product.name}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                    {product.sold.toLocaleString('ru')} шт.
                  </span>
                </div>

                {/* Share Progress Bar */}
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-500"
                    style={{ width: `${product.share}%` }}
                  />
                </div>
              </div>

              {/* Revenue */}
              <div className="text-right shrink-0 w-24">
                <p className="text-sm font-semibold">
                  {product.revenue.toLocaleString('ru')} ₸
                </p>
                <div
                  className={`flex items-center justify-end gap-0.5 text-xs ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  <span className="font-medium">
                    {isPositive ? '+' : ''}
                    {product.trend}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Revenue */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Общая выручка за период
          </span>
          <span className="text-xl font-bold pulse-text-gradient">
            {data.total.toLocaleString('ru')} ₸
          </span>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="glass-card rounded-xl p-4 border-purple-500/20 relative overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-violet-500/5 pointer-events-none" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              AI рекомендация
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Латте и Раф показывают рост. Рекомендуем продвигать эти напитки.
          </p>
        </div>
      </div>
    </div>
  );
}
