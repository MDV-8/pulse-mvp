'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertTriangle, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/stores/app-store';
import { toast } from '@/hooks/use-toast';
import type { Promotion } from '@/data/mock-data';

const PRODUCTS = [
  'Капучино',
  'Латте',
  'Все кофейные напитки',
  'Кофе + выпечка',
  'Все меню',
  'Первый заказ',
];

const AUDIENCES = [
  'Все клиенты',
  'Новые клиенты',
  'Постоянные клиенты',
  'VIP',
];

interface CreatePromotionProps {
  prefillDiscount?: number;
  prefillProduct?: string;
  prefillName?: string;
}

export function CreatePromotion({ prefillDiscount, prefillProduct, prefillName }: CreatePromotionProps) {
  const {
    showCreatePromotion,
    setShowCreatePromotion,
    promotionFromInsight,
    setPromotionFromInsight,
    addPromotion,
  } = useAppStore();

  const getInitialValues = useCallback(() => {
    if (promotionFromInsight === 'happy-hour') {
      return {
        name: prefillName || 'Happy Hour',
        discount: [prefillDiscount || 15] as number[],
        product: prefillProduct || 'Все кофейные напитки',
        audience: 'Все клиенты',
      };
    }
    if (prefillName) {
      return {
        name: prefillName,
        discount: prefillDiscount ? [prefillDiscount] as number[] : [15] as number[],
        product: prefillProduct || '',
        audience: '',
      };
    }
    return {
      name: '',
      discount: [15] as number[],
      product: '',
      audience: '',
    };
  }, [promotionFromInsight, prefillName, prefillDiscount, prefillProduct]);

  const [name, setName] = useState(() => getInitialValues().name);
  const [discount, setDiscount] = useState(() => getInitialValues().discount);
  const [product, setProduct] = useState(() => getInitialValues().product);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [audience, setAudience] = useState(() => getInitialValues().audience);

  const handleClose = () => {
    setShowCreatePromotion(false);
    setPromotionFromInsight(null);
    setName('');
    setDiscount([15]);
    setProduct('');
    setStartTime('');
    setEndTime('');
    setAudience('');
  };

  const handleCreate = () => {
    if (!name.trim()) {
      toast({ title: 'Укажите название акции', variant: 'destructive' });
      return;
    }
    if (!product) {
      toast({ title: 'Выберите товар/услугу', variant: 'destructive' });
      return;
    }
    if (!audience) {
      toast({ title: 'Выберите аудиторию', variant: 'destructive' });
      return;
    }
    if (!startTime || !endTime) {
      toast({ title: 'Укажите период проведения', variant: 'destructive' });
      return;
    }

    const newPromotion: Promotion = {
      id: `p-${Date.now()}`,
      name: name.trim(),
      discount: discount[0],
      product,
      startTime: startTime.replace('T', ' '),
      endTime: endTime.replace('T', ' '),
      audience,
      status: 'active',
    };

    addPromotion(newPromotion);
    toast({
      title: 'Акция запущена!',
      description: `«${name.trim()}» со скидкой ${discount[0]}%`,
    });
    handleClose();
  };

  const isFormValid = name.trim() && product && audience && startTime && endTime;

  // AI forecast calculation based on discount
  const forecastClients = Math.round(10 + discount[0] * 0.8);
  const forecastRevenue = Math.round(5 + discount[0] * 0.4);
  const forecastProfit = Math.round(8 - discount[0] * 0.1);

  return (
    <AnimatePresence>
      {showCreatePromotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-10 w-full sm:max-w-md bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Rocket className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Создать акцию</h3>
                  <p className="text-xs text-muted-foreground">Настройте параметры</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="max-h-[calc(90vh-12rem)]">
              <div className="px-5 py-4 space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Название акции</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Например: Happy Hour"
                    className="bg-background border-border h-10 text-sm"
                  />
                </div>

                {/* Discount Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Скидка</Label>
                    <span className="text-sm font-semibold text-primary">{discount[0]}%</span>
                  </div>
                  <Slider
                    value={discount}
                    onValueChange={setDiscount}
                    min={5}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>5%</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* Product Select */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Товар / Услуга</Label>
                  <Select value={product} onValueChange={setProduct}>
                    <SelectTrigger className="w-full bg-background border-border h-10 text-sm">
                      <SelectValue placeholder="Выберите товар" />
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

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Дата начала</Label>
                    <Input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="bg-background border-border h-10 text-sm [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Дата окончания</Label>
                    <Input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="bg-background border-border h-10 text-sm [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Audience Select */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Аудитория</Label>
                  <Select value={audience} onValueChange={setAudience}>
                    <SelectTrigger className="w-full bg-background border-border h-10 text-sm">
                      <SelectValue placeholder="Выберите аудиторию" />
                    </SelectTrigger>
                    <SelectContent>
                      {AUDIENCES.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-border" />

                {/* AI Forecast */}
                <div className="rounded-xl bg-primary/5 border border-primary/15 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">AI Прогноз</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <motion.div
                        key={discount[0]}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-lg font-semibold text-emerald-400"
                      >
                        +{forecastClients}%
                      </motion.div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Клиенты</div>
                    </div>
                    <div>
                      <motion.div
                        key={`rev-${discount[0]}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-lg font-semibold text-emerald-400"
                      >
                        +{forecastRevenue}%
                      </motion.div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Выручка</div>
                    </div>
                    <div>
                      <motion.div
                        key={`prof-${discount[0]}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-lg font-semibold ${forecastProfit >= 5 ? 'text-emerald-400' : 'text-amber-400'}`}
                      >
                        +{Math.max(forecastProfit, 0)}%
                      </motion.div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Прибыль</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center mt-3">
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs"
                    >
                      Риск: низкий
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 text-[10px] text-muted-foreground">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Это AI прогноз на основе демо-данных</span>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Footer Actions */}
            <div className="px-5 py-4 border-t border-border flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-10 text-sm border-border"
                onClick={handleClose}
              >
                Отмена
              </Button>
              <Button
                className="flex-1 h-10 text-sm bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                onClick={handleCreate}
                disabled={!isFormValid}
              >
                ЗАПУСТИТЬ
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
