'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ShoppingCart,
  Receipt,
  BarChart3,
  Percent,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { StackedRevenueChart } from '@/components/pulse/shared/revenue-chart';
import { ExportButton } from '@/components/pulse/shared/export-button';
import { mockFinanceData } from '@/data/mock-data';
import type { FinanceData } from '@/data/mock-data';

type Period = 'today' | '7days' | '30days' | '6months' | '1year';

// Period-based mock data variations
const PERIOD_VARIANTS: Record<Period, Partial<FinanceData>> = {
  today: {
    revenue: 42800,
    expenses: 29900,
    netProfit: 12900,
    margin: 30.1,
    averageCheck: 5420,
    orders: 8,
    revenueChange: 5,
    expensesChange: 3,
    profitChange: 7,
    marginChange: 0.2,
    averageCheckChange: -1,
    ordersChange: 12,
    chartData: [
      { date: '09:00', revenue: 3200, expenses: 2200, profit: 1000 },
      { date: '10:00', revenue: 5800, expenses: 4100, profit: 1700 },
      { date: '11:00', revenue: 4200, expenses: 2900, profit: 1300 },
      { date: '12:00', revenue: 6400, expenses: 4500, profit: 1900 },
      { date: '13:00', revenue: 7200, expenses: 5100, profit: 2100 },
      { date: '14:00', revenue: 4800, expenses: 3300, profit: 1500 },
      { date: '15:00', revenue: 3600, expenses: 2500, profit: 1100 },
    ],
  },
  '7days': mockFinanceData,
  '30days': {
    revenue: 5136000,
    expenses: 3592000,
    netProfit: 1544000,
    margin: 30.1,
    averageCheck: 5280,
    orders: 972,
    revenueChange: 14,
    expensesChange: 10,
    profitChange: 12,
    marginChange: 0.8,
    averageCheckChange: -2,
    ordersChange: 18,
    chartData: [
      { date: '01.01', revenue: 620000, expenses: 435000, profit: 185000 },
      { date: '01.07', revenue: 710000, expenses: 498000, profit: 212000 },
      { date: '01.13', revenue: 590000, expenses: 412000, profit: 178000 },
      { date: '01.19', revenue: 740000, expenses: 520000, profit: 220000 },
      { date: '01.25', revenue: 820000, expenses: 575000, profit: 245000 },
      { date: '02.01', revenue: 890000, expenses: 622000, profit: 268000 },
      { date: '02.05', revenue: 764000, expenses: 530000, profit: 234000 },
    ],
  },
  '6months': {
    revenue: 30816000,
    expenses: 21504000,
    netProfit: 9312000,
    margin: 30.2,
    averageCheck: 5350,
    orders: 5760,
    revenueChange: 18,
    expensesChange: 14,
    profitChange: 22,
    marginChange: 1.2,
    averageCheckChange: 1,
    ordersChange: 24,
    chartData: [
      { date: 'Авг', revenue: 4800000, expenses: 3360000, profit: 1440000 },
      { date: 'Сен', revenue: 5100000, expenses: 3570000, profit: 1530000 },
      { date: 'Окт', revenue: 5200000, expenses: 3650000, profit: 1550000 },
      { date: 'Ноя', revenue: 5400000, expenses: 3790000, profit: 1610000 },
      { date: 'Дек', revenue: 5300000, expenses: 3720000, profit: 1580000 },
      { date: 'Янв', revenue: 5016000, expenses: 3414000, profit: 1602000 },
    ],
  },
  '1year': {
    revenue: 61632000,
    expenses: 43008000,
    netProfit: 18624000,
    margin: 30.2,
    averageCheck: 5350,
    orders: 11520,
    revenueChange: 28,
    expensesChange: 22,
    profitChange: 35,
    marginChange: 2.1,
    averageCheckChange: 3,
    ordersChange: 42,
    chartData: [
      { date: 'Янв', revenue: 4800000, expenses: 3360000, profit: 1440000 },
      { date: 'Фев', revenue: 4500000, expenses: 3150000, profit: 1350000 },
      { date: 'Мар', revenue: 5100000, expenses: 3570000, profit: 1530000 },
      { date: 'Апр', revenue: 5200000, expenses: 3650000, profit: 1550000 },
      { date: 'Май', revenue: 5400000, expenses: 3790000, profit: 1610000 },
      { date: 'Июн', revenue: 5500000, expenses: 3860000, profit: 1640000 },
      { date: 'Июл', revenue: 4700000, expenses: 3290000, profit: 1410000 },
    ],
  },
};

const PERIOD_LABELS: Record<Period, string> = {
  today: 'Сегодня',
  '7days': '7 дней',
  '30days': '30 дней',
  '6months': '6 месяцев',
  '1year': '1 год',
};

function ChangeIndicator({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        isPositive ? 'text-emerald-400' : 'text-red-400'
      }`}
    >
      {isPositive ? (
        <ArrowUpRight className="h-3 w-3" />
      ) : (
        <ArrowDownRight className="h-3 w-3" />
      )}
      {isPositive ? '+' : ''}
      {value}%
    </span>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  index,
  valueGlowClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: number;
  index: number;
  valueGlowClass?: string;
}) {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="bg-card border-border card-hover card-hover-lift hover-scale">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Icon className={`h-3.5 w-3.5 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`} />
              <span className="text-[10px] sm:text-xs text-muted-foreground">{label}</span>
            </div>
            <ChangeIndicator value={change} />
          </div>
          <div className={`text-sm sm:text-lg font-semibold number-glow ${valueGlowClass || ''}`}>{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function FinanceDashboard() {
  const [activePeriod, setActivePeriod] = useState<Period>('7days');
  const [isSwitching, setIsSwitching] = useState(false);
  const [displayPeriod, setDisplayPeriod] = useState<Period>('7days');

  const handlePeriodChange = useCallback((newPeriod: string) => {
    const p = newPeriod as Period;
    if (p === activePeriod || isSwitching) return;
    setDisplayPeriod(p);
    setIsSwitching(true);
    setTimeout(() => {
      setActivePeriod(p);
      setIsSwitching(false);
    }, 300);
  }, [activePeriod, isSwitching]);

  const data = useMemo(() => {
    const base = mockFinanceData;
    const variant = PERIOD_VARIANTS[activePeriod];
    return { ...base, ...variant };
  }, [activePeriod]);

  const chartData = useMemo(
    () =>
      data.chartData.map((d) => ({
        label: d.date,
        revenue: d.revenue,
        expenses: d.expenses,
      })),
    [data.chartData]
  );

  const metrics = [
    {
      icon: TrendingUp,
      label: 'Выручка',
      value: `${data.revenue.toLocaleString('ru-RU')} ₸`,
      change: data.revenueChange,
      valueGlowClass: 'stat-glow-green',
    },
    {
      icon: BarChart3,
      label: 'Расходы',
      value: `${data.expenses.toLocaleString('ru-RU')} ₸`,
      change: data.expensesChange,
      valueGlowClass: 'stat-glow-red',
    },
    {
      icon: Wallet,
      label: 'Чистая прибыль',
      value: `${data.netProfit.toLocaleString('ru-RU')} ₸`,
      change: data.profitChange,
      valueGlowClass: 'stat-glow-purple',
    },
    {
      icon: Percent,
      label: 'Маржинальность',
      value: `${data.margin}%`,
      change: data.marginChange,
    },
    {
      icon: Receipt,
      label: 'Средний чек',
      value: `${data.averageCheck.toLocaleString('ru-RU')} ₸`,
      change: data.averageCheckChange,
    },
    {
      icon: ShoppingCart,
      label: 'Заказы',
      value: data.orders.toLocaleString('ru-RU'),
      change: data.ordersChange,
    },
  ];

  const prevPeriod: Record<Period, Period> = {
    today: '7days',
    '7days': '30days',
    '30days': '6months',
    '6months': '1year',
    '1year': '1year',
  };

  const prevData = PERIOD_VARIANTS[prevPeriod[activePeriod]];

  return (
    <div className="flex h-full flex-col glass-card-premium rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gradient-animate text-gradient-cycle">Финансы</h2>
          </div>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px]">
            Демо-данные
          </Badge>
        </div>
        <ExportButton
          title="Финансы"
          headers={['Метрика', 'Значение', 'Изменение']}
          rows={[
            ['Выручка', `${data.revenue.toLocaleString('ru-RU')} ₸`, `${data.revenueChange > 0 ? '+' : ''}${data.revenueChange}%`],
            ['Расходы', `${data.expenses.toLocaleString('ru-RU')} ₸`, `${data.expensesChange > 0 ? '+' : ''}${data.expensesChange}%`],
            ['Чистая прибыль', `${data.netProfit.toLocaleString('ru-RU')} ₸`, `${data.profitChange > 0 ? '+' : ''}${data.profitChange}%`],
            ['Маржинальность', `${data.margin}%`, `${data.marginChange > 0 ? '+' : ''}${data.marginChange}%`],
            ['Средний чек', `${data.averageCheck.toLocaleString('ru-RU')} ₸`, `${data.averageCheckChange > 0 ? '+' : ''}${data.averageCheckChange}%`],
            ['Заказы', data.orders.toLocaleString('ru-RU'), `${data.ordersChange > 0 ? '+' : ''}${data.ordersChange}%`],
          ]}
        />
      </div>

      <ScrollArea className="flex-1 px-4 sm:px-6 py-4 space-y-5">
        {/* Period Selector */}
        <Tabs
          value={displayPeriod}
          onValueChange={handlePeriodChange}
        >
          <TabsList className="bg-muted/50 h-9 w-full overflow-x-auto">
            {(Object.entries(PERIOD_LABELS) as [Period, string][]).map(([key, label]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="text-[11px] sm:text-xs px-2 sm:px-3 h-7 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Key Metrics Grid */}
        {isSwitching ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                  <Skeleton className="h-5 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {metrics.map((m, i) => (
              <MetricCard key={m.label} {...m} index={i} />
            ))}
          </div>
        )}

        {/* Vertical Neon Line Separator */}
        <div className="flex items-center justify-center py-1">
          <div className="neon-line-vertical h-8" />
        </div>

        {/* Revenue/Expenses Chart */}
        <Card className="bg-card border-border bg-gradient-to-b from-primary/3 to-transparent">
          <CardHeader className="pb-2 pt-4 px-4 sm:px-5">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Выручка / Расходы
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-5 pb-4">
            <div className="flex items-center gap-4 mb-4 text-[10px] sm:text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm bg-primary" />
                <span>Выручка</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm bg-muted" />
                <span>Расходы</span>
              </div>
            </div>
            {isSwitching ? (
              <Skeleton className="w-full h-[180px] rounded-lg" />
            ) : (
              <StackedRevenueChart data={chartData} height={180} />
            )}
          </CardContent>
        </Card>

        {/* Neon Line Separator */}
        <div className="neon-line" />

        {/* AI Financial Summary */}
        <Card className="bg-primary/5 border-primary/15">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI Анализ</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Выручка выросла на {data.revenueChange}%, но прибыль только на {data.profitChange}%, потому что увеличились расходы на продвижение.
              Рекомендуем оптимизировать маркетинговый бюджет.
            </p>
          </CardContent>
        </Card>

        {/* Period Comparison */}
        {prevData && activePeriod !== '1year' && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-2 pt-4 px-4 sm:px-5">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                Сравнить периоды
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-5 pb-4">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 text-sm">
                  <span className="text-muted-foreground">Выручка</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {PERIOD_LABELS[prevPeriod[activePeriod]]}: {prevData.revenue?.toLocaleString('ru-RU')} ₸
                    </span>
                    <ChangeIndicator
                      value={
                        prevData.revenue
                          ? Math.round(
                              ((data.revenue - prevData.revenue) / prevData.revenue) * 100
                            )
                          : 0
                      }
                    />
                  </div>
                </div>
                <Separator className="bg-border" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 text-sm">
                  <span className="text-muted-foreground">Прибыль</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {PERIOD_LABELS[prevPeriod[activePeriod]]}: {prevData.netProfit?.toLocaleString('ru-RU')} ₸
                    </span>
                    <ChangeIndicator
                      value={
                        prevData.netProfit
                          ? Math.round(
                              ((data.netProfit - prevData.netProfit) / prevData.netProfit) * 100
                            )
                          : 0
                      }
                    />
                  </div>
                </div>
                <Separator className="bg-border" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 text-sm">
                  <span className="text-muted-foreground">Средний чек</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {PERIOD_LABELS[prevPeriod[activePeriod]]}: {prevData.averageCheck?.toLocaleString('ru-RU')} ₸
                    </span>
                    <ChangeIndicator
                      value={
                        prevData.averageCheck
                          ? Math.round(
                              ((data.averageCheck - prevData.averageCheck) / prevData.averageCheck) * 100
                            )
                          : 0
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </ScrollArea>
    </div>
  );
}
