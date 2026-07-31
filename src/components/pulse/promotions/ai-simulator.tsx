'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  AlertTriangle,
  Calculator,
  Rocket,
  TrendingUp,
  Users,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/stores/app-store';
import type { SimulationResult } from '@/data/mock-data';

const PRODUCTS = [
  'Капучино',
  'Латте',
  'Все кофейные напитки',
  'Кофе + выпечка',
  'Все меню',
  'Первый заказ',
];

const PERIODS = [
  { value: '3', label: '3 дня' },
  { value: '7', label: '7 дней' },
  { value: '14', label: '14 дней' },
  { value: '30', label: '30 дней' },
];

function simulate(
  discount: number,
  periodDays: number,
  product: string
): SimulationResult {
  // Base multiplier for product type
  const productMultiplier: Record<string, number> = {
    'Капучино': 0.9,
    'Латте': 0.85,
    'Все кофейные напитки': 1.2,
    'Кофе + выпечка': 1.1,
    'Все меню': 1.5,
    'Первый заказ': 0.7,
  };

  // Period multiplier (longer = more total but diminishing returns)
  const periodMultiplier = Math.min(periodDays / 7, 3) * (0.8 + 0.2 * (7 / periodDays));

  const pm = productMultiplier[product] || 1;

  // Higher discount = more clients, but less profit margin
  const clientEffect = Math.round((5 + discount * 0.9) * pm * Math.min(periodMultiplier, 2));
  const revenueEffect = Math.round((3 + discount * 0.5) * pm * Math.min(periodMultiplier, 2));
  const profitEffect = Math.round(
    (8 - discount * 0.15) * pm * Math.min(periodMultiplier, 2)
  );

  let risk: 'low' | 'medium' | 'high' = 'low';
  if (discount > 35 || (discount > 25 && profitEffect < 3)) {
    risk = 'high';
  } else if (discount > 25 || profitEffect < 5) {
    risk = 'medium';
  }

  let explanation = '';
  if (risk === 'low') {
    explanation = `Скидка ${discount}% на «${product}» в течение ${periodDays} дней выглядит оптимально. Ожидается рост клиентов на ${clientEffect}% и выручки на ${revenueEffect}%. Риск минимален, прибыль сохранит положительную динамику.`;
  } else if (risk === 'medium') {
    explanation = `Скидка ${discount}% на «${product}» даст заметный приток клиентов (+${clientEffect}%), но маржинальность может снизиться. Рекомендуем снизить скидку до ${Math.max(5, discount - 10)}% для лучшего баланса.`;
  } else {
    explanation = `Скидка ${discount}% слишком агрессивна для «${product}». Рост клиентов ожидается (+${clientEffect}%), но прибыль может упасть. Рекомендуем скидку не более 20% или выбрать более маржинальный продукт.`;
  }

  return {
    expectedClients: clientEffect,
    expectedRevenue: revenueEffect,
    expectedProfit: Math.max(profitEffect, -5),
    risk,
    explanation,
  };
}

const RISK_CONFIG = {
  low: { label: 'низкий', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  medium: { label: 'средний', className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  high: { label: 'высокий', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
};

export function AISimulator() {
  const { setShowCreatePromotion, setPromotionFromInsight } = useAppStore();
  const [discount, setDiscount] = useState([15]);
  const [period, setPeriod] = useState('7');
  const [product, setProduct] = useState('Все кофейные напитки');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    setResult(null);

    setTimeout(() => {
      const sim = simulate(discount[0], parseInt(period), product);
      setResult(sim);
      setIsCalculating(false);
    }, 800);
  };

  const handleLaunch = () => {
    setPromotionFromInsight('happy-hour');
    setShowCreatePromotion(true);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Что будет, если...?</h2>
            <p className="text-xs text-muted-foreground">
              AI симулятор прогнозирует результаты акции
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">
        {/* Discount Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Скидка</Label>
            <span className="text-lg font-semibold text-primary">{discount[0]}%</span>
          </div>
          <Slider
            value={discount}
            onValueChange={setDiscount}
            min={5}
            max={50}
            step={1}
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>5%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Period Select */}
        <div className="space-y-2">
          <Label className="text-sm">Период</Label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full bg-background border-border h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIODS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Product Select */}
        <div className="space-y-2">
          <Label className="text-sm">Товар</Label>
          <Select value={product} onValueChange={setProduct}>
            <SelectTrigger className="w-full bg-background border-border h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRODUCTS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Calculate Button */}
        <Button
          className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-2"
          onClick={handleCalculate}
          disabled={isCalculating}
        >
          {isCalculating ? (
            <motion.div
              className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <Calculator className="h-4 w-4" />
          )}
          Рассчитать прогноз
        </Button>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <Separator className="bg-border" />

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Прогноз AI</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center mb-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Users className="h-4 w-4 mx-auto mb-1.5 text-emerald-400" />
                      <div className="text-xl font-bold text-emerald-400">
                        +{result.expectedClients}%
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        Ожидаемые клиенты
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <TrendingUp className="h-4 w-4 mx-auto mb-1.5 text-emerald-400" />
                      <div className="text-xl font-bold text-emerald-400">
                        +{result.expectedRevenue}%
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        Выручка
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <DollarSign className={`h-4 w-4 mx-auto mb-1.5 ${result.expectedProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
                      <div className={`text-xl font-bold ${result.expectedProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {result.expectedProfit >= 0 ? '+' : ''}{result.expectedProfit}%
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        Прибыль
                      </div>
                    </motion.div>
                  </div>

                  {/* Risk Badge */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className={`h-3.5 w-3.5 ${
                        result.risk === 'low' ? 'text-emerald-400' :
                        result.risk === 'medium' ? 'text-amber-400' :
                        'text-red-400'
                      }`} />
                      <span className="text-sm text-muted-foreground">Риск:</span>
                      <Badge variant="outline" className={RISK_CONFIG[result.risk].className}>
                        {RISK_CONFIG[result.risk].label}
                      </Badge>
                    </div>
                  </div>

                  {/* AI Explanation */}
                  <div className="rounded-lg bg-background border border-border p-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {result.explanation}
                    </p>
                  </div>

                  {/* Disclaimer */}
                  <div className="flex items-center gap-1.5 mt-3 text-[10px] text-muted-foreground">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    <span>AI Simulation — прогноз на основе демо-данных</span>
                  </div>
                </CardContent>
              </Card>

              {/* Launch Button */}
              <Button
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
                onClick={handleLaunch}
              >
                <Rocket className="h-4 w-4" />
                ЗАПУСТИТЬ АКЦИЮ
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
