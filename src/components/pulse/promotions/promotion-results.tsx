'use client';

import { motion } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Users, Repeat, Receipt, DollarSign, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Promotion } from '@/data/mock-data';

interface PromotionResultsProps {
  promotion: Promotion;
  onClose: () => void;
}

function ChangeIndicator({ value, suffix = '%' }: { value: number; suffix?: string }) {
  const isPositive = value >= 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
  const color = isPositive ? 'text-emerald-400' : 'text-red-400';

  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${color}`}>
      <Icon className="h-3 w-3" />
      {isPositive ? '+' : ''}{value}{suffix}
    </span>
  );
}

function MetricBar({ label, before, after, unit }: { label: string; before: number; after: number; unit: string }) {
  const change = ((after - before) / before) * 100;
  const isPositive = change >= 0;
  const maxVal = Math.max(before, after);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <ChangeIndicator value={Math.round(change)} />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground w-10">До</span>
          <span className="text-foreground font-medium">{before.toLocaleString('ru-RU')}{unit}</span>
          <div className="flex-1 mx-3 h-2.5 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(before / maxVal) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${isPositive ? 'bg-muted-foreground/30' : 'bg-muted-foreground/30'}`}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground w-10">Во время</span>
          <span className="text-foreground font-medium">{after.toLocaleString('ru-RU')}{unit}</span>
          <div className="flex-1 mx-3 h-2.5 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(after / maxVal) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className={`h-full rounded-full ${isPositive ? 'bg-emerald-500/70' : 'bg-red-500/70'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PromotionResults({ promotion, onClose }: PromotionResultsProps) {
  if (!promotion.results) return null;

  const r = promotion.results;

  const metrics = [
    {
      icon: Users,
      label: 'Новые клиенты',
      value: r.newClients,
      change: r.newClientsChange,
    },
    {
      icon: Repeat,
      label: 'Повторные покупки',
      value: r.repeatPurchases,
      change: r.repeatPurchasesChange,
    },
    {
      icon: Receipt,
      label: 'Средний чек',
      value: `${r.averageCheck.toLocaleString('ru-RU')} ₸`,
      change: r.averageCheckChange,
    },
    {
      icon: DollarSign,
      label: 'Выручка',
      value: `${r.revenue.toLocaleString('ru-RU')} ₸`,
      change: r.revenueChange,
    },
    {
      icon: TrendingUp,
      label: 'Прибыль',
      value: `${r.profit.toLocaleString('ru-RU')} ₸`,
      change: r.profitChange,
    },
  ];

  const overallPositive = r.revenueChange > 0 && r.profitChange > 0;
  const aiConclusion = overallPositive
    ? `Акция увеличила поток клиентов, но снизила маржинальность на ${Math.abs(r.averageCheckChange)}%. Общий эффект положительный. Рекомендуем повторить через 2 недели.`
    : `Акция увеличила выручку, но снизила прибыль. Рассмотрите уменьшение скидки или изменение аудитории.`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="font-semibold">Результаты акции</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{promotion.name} − {promotion.discount}%</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="max-h-[calc(90vh-8rem)]">
          <div className="px-5 py-4 space-y-5">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {metrics.map((m, i) => {
                const Icon = m.icon;
                const isPositive = m.change >= 0;
                return (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-lg bg-background border border-border p-3"
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <Icon className={`h-3.5 w-3.5 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`} />
                      <span className="text-[10px] sm:text-xs text-muted-foreground">{m.label}</span>
                    </div>
                    <div className="text-sm sm:text-base font-semibold">
                      {typeof m.value === 'string' ? m.value : `${m.value} (+${m.change}%)`}
                    </div>
                    {typeof m.value === 'number' && (
                      <ChangeIndicator value={m.change} />
                    )}
                    {typeof m.value === 'string' && (
                      <ChangeIndicator value={m.change} />
                    )}
                  </motion.div>
                );
              })}
            </div>

            <Separator className="bg-border" />

            {/* Before/During Comparison Bars */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Сравнение до / во время</h4>
              <MetricBar
                label="Новые клиенты"
                before={Math.round(r.newClients / (1 + r.newClientsChange / 100))}
                after={r.newClients}
                unit=""
              />
              <MetricBar
                label="Повторные покупки"
                before={Math.round(r.repeatPurchases / (1 + r.repeatPurchasesChange / 100))}
                after={r.repeatPurchases}
                unit=""
              />
              <MetricBar
                label="Средний чек"
                before={Math.round(r.averageCheck / (1 + r.averageCheckChange / 100))}
                after={r.averageCheck}
                unit=" ₸"
              />
              <MetricBar
                label="Выручка"
                before={Math.round(r.revenue / (1 + r.revenueChange / 100))}
                after={r.revenue}
                unit=" ₸"
              />
              <MetricBar
                label="Прибыль"
                before={Math.round(r.profit / (1 + r.profitChange / 100))}
                after={r.profit}
                unit=" ₸"
              />
            </div>

            <Separator className="bg-border" />

            {/* AI Conclusion */}
            <Card className="bg-primary/5 border-primary/15">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Вывод AI</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{aiConclusion}</p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
}
