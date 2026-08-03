'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  Phone,
  ShoppingBag,
  Star,
  Search,
  CreditCard,
  Package,
  Clock,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// ---- Types ----

type SupplierStatus = 'active' | 'waiting' | 'paused';

type FilterTab = 'all' | 'active' | 'waiting' | 'paused';

interface Supplier {
  name: string;
  categories: string[];
  ordersPerMonth: number;
  rating: number;
  debt: number;
  status: SupplierStatus;
  avatarGradient: string;
}

// ---- Data ----

const suppliers: Supplier[] = [
  {
    name: 'Молочный мир',
    categories: ['Молоко', 'сливки', 'сиропы'],
    ordersPerMonth: 3,
    rating: 4.8,
    debt: 45000,
    status: 'active',
    avatarGradient: 'from-emerald-500 to-teal-400',
  },
  {
    name: 'Зерновой дом',
    categories: ['Кофейные зёрна'],
    ordersPerMonth: 2,
    rating: 4.9,
    debt: 0,
    status: 'active',
    avatarGradient: 'from-amber-500 to-orange-400',
  },
  {
    name: 'Свежая выпечка',
    categories: ['Круассаны', 'кексы'],
    ordersPerMonth: 5,
    rating: 4.5,
    debt: 68000,
    status: 'waiting',
    avatarGradient: 'from-pink-500 to-rose-400',
  },
  {
    name: 'Packaging KZ',
    categories: ['Стаканы', 'крышки'],
    ordersPerMonth: 1,
    rating: 4.2,
    debt: 12000,
    status: 'active',
    avatarGradient: 'from-cyan-500 to-blue-400',
  },
  {
    name: 'Sugar Land',
    categories: ['Сахар', 'специи'],
    ordersPerMonth: 4,
    rating: 4.7,
    debt: 85000,
    status: 'waiting',
    avatarGradient: 'from-purple-500 to-violet-400',
  },
  {
    name: 'CleanPro',
    categories: ['Средства уборки'],
    ordersPerMonth: 1,
    rating: 3.8,
    debt: 75000,
    status: 'paused',
    avatarGradient: 'from-red-500 to-red-400',
  },
];

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'active', label: 'Активные' },
  { key: 'waiting', label: 'Ожидает' },
  { key: 'paused', label: 'Пауза' },
];

const statusConfig: Record<SupplierStatus, { label: string; dotColor: string; textColor: string; bgColor: string }> = {
  active: {
    label: 'Активен',
    dotColor: 'bg-emerald-400',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/15',
  },
  waiting: {
    label: 'Ожидает',
    dotColor: 'bg-amber-400',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/15',
  },
  paused: {
    label: 'Пауза',
    dotColor: 'bg-red-400',
    textColor: 'text-red-400',
    bgColor: 'bg-red-500/15',
  },
};

function formatAmount(value: number): string {
  return value.toLocaleString('ru-RU');
}

// ---- Star Rating ----

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const halfFilled = !filled && i < rating;
        return (
          <Star
            key={i}
            className={cn(
              'size-3',
              filled
                ? 'text-amber-400 fill-amber-400'
                : halfFilled
                  ? 'text-amber-400 fill-amber-400/50'
                  : 'text-muted-foreground/30'
            )}
          />
        );
      })}
      <span className="ml-1 text-[10px] font-semibold text-foreground tabular-nums">{rating}</span>
    </div>
  );
}

// ---- Supplier Card ----

function SupplierCard({ supplier, index }: { supplier: Supplier; index: number }) {
  const status = statusConfig[supplier.status];
  const initial = supplier.name.charAt(0);
  const hasDebt = supplier.debt > 0;

  return (
    <motion.div
      className="rounded-xl border border-border bg-card p-4 card-hover-lift overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      layout
    >
      {/* Top row: Avatar + Name + Status */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white font-bold text-sm',
            supplier.avatarGradient
          )}
        >
          {initial}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground truncate">{supplier.name}</h3>
            {/* Status badge */}
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0',
                status.bgColor,
                status.textColor
              )}
            >
              {supplier.status === 'active' && (
                <span className={cn('relative flex h-1.5 w-1.5', status.dotColor)}>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-current" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                </span>
              )}
              {supplier.status !== 'active' && (
                <span className={cn('h-1.5 w-1.5 rounded-full', status.dotColor)} />
              )}
              {status.label}
            </span>
          </div>

          {/* Category tags */}
          <div className="mt-1.5 flex flex-wrap gap-1">
            {supplier.categories.map((cat) => (
              <Badge
                key={cat}
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-5 border-border/60 text-muted-foreground font-normal"
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {/* Orders per month */}
        <div className="rounded-lg bg-background/50 p-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="size-3 text-purple-400" />
            <span className="text-xs font-bold text-foreground tabular-nums">{supplier.ordersPerMonth}</span>
          </div>
          <p className="text-[9px] text-muted-foreground mt-0.5">заказов/мес</p>
        </div>

        {/* Rating */}
        <div className="rounded-lg bg-background/50 p-2 text-center">
          <StarRating rating={supplier.rating} />
          <p className="text-[9px] text-muted-foreground mt-0.5">рейтинг</p>
        </div>

        {/* Debt */}
        <div className="rounded-lg bg-background/50 p-2 text-center">
          <span
            className={cn(
              'text-xs font-bold tabular-nums',
              hasDebt ? 'text-red-400' : 'text-emerald-400'
            )}
          >
            {hasDebt ? `${formatAmount(supplier.debt)}₸` : '0₸'}
          </span>
          <p className="text-[9px] text-muted-foreground mt-0.5">долг</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex items-center gap-2">
        <Button
          size="sm"
          className="h-8 text-[11px] font-semibold bg-purple-600 hover:bg-purple-700 text-white px-3"
          onClick={() => toast.success(`Заказ отправлен: ${supplier.name}`)}
        >
          <Package className="mr-1.5 size-3" />
          Заказать
        </Button>
        {hasDebt && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-[11px] font-semibold border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 px-3"
            onClick={() => toast.success(`Оплата ${supplier.debt.toLocaleString('ru-RU')}₸ отправлена (${supplier.name})`)}
          >
            <CreditCard className="mr-1.5 size-3" />
            Оплатить
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-[11px] font-semibold border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent/50 px-3 ml-auto"
          onClick={() => toast.info(`Звонок в ${supplier.name}: функция будет доступна в следующей версии`)}
        >
          <Phone className="mr-1.5 size-3" />
          Позвонить
        </Button>
      </div>
    </motion.div>
  );
}

// ---- Main Component ----

export function SuppliersView() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.categories.some((c) => c.toLowerCase().includes(search.toLowerCase()));
      const matchesFilter =
        activeFilter === 'all' || s.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  const activeCount = suppliers.filter((s) => s.status === 'active').length;
  const waitingCount = suppliers.filter((s) => s.status === 'waiting').length;
  const totalDebt = suppliers.reduce((sum, s) => sum + s.debt, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Truck className="size-5 text-primary" />
          <h2 className="text-lg font-bold text-shadow-glow">Поставщики</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Управление поставками и заказами</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          className="rounded-xl border border-border bg-card p-3 glass-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Активных
          </p>
          <p className="text-xl font-bold mt-1 stat-glow-purple tabular-nums">{activeCount}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">поставщиков</p>
        </motion.div>

        <motion.div
          className="rounded-xl border border-border bg-card p-3 glass-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Ожидают
          </p>
          <p className="text-xl font-bold mt-1 stat-glow-amber tabular-nums">{waitingCount}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">доставку</p>
        </motion.div>

        <motion.div
          className="rounded-xl border border-border bg-card p-3 glass-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Общий долг
          </p>
          <p className="text-lg font-bold mt-1 stat-glow-red tabular-nums tracking-tight">
            {formatAmount(totalDebt)} ₸
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">к оплате</p>
        </motion.div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Поиск поставщиков..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 bg-card border-border/60 text-sm"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap',
              activeFilter === tab.key
                ? 'bg-primary text-primary-foreground shadow-[0_0_16px_rgba(139,92,246,0.3)]'
                : 'bg-card text-muted-foreground border border-border/60 hover:text-foreground hover:border-primary/30'
            )}
          >
            {tab.label}
            {tab.key !== 'all' && (
              <span className="ml-1.5 text-[10px] opacity-70">
                ({suppliers.filter((s) => (tab.key === 'all' ? true : s.status === tab.key)).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Supplier list */}
      <div
        className="max-h-[600px] overflow-y-auto space-y-3 pr-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
      >
        <AnimatePresence mode="popLayout">
          {filteredSuppliers.map((supplier, index) => (
            <SupplierCard key={supplier.name} supplier={supplier} index={index} />
          ))}
        </AnimatePresence>

        {filteredSuppliers.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-12 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Truck className="size-8 opacity-30" />
            <span className="text-xs mt-2">Поставщики не найдены</span>
          </motion.div>
        )}
      </div>

      {/* AI suggestion box */}
      <motion.div
        className="relative rounded-xl border border-purple-500/20 overflow-hidden glass-card-deep aurora-border"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="size-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">AI Подсказки</span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10 p-3">
              <Clock className="size-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="text-amber-400 font-semibold">Свежая выпечка</span> ожидает доставку 3 дня. Рекомендуется позвонить для уточнения статуса.
              </p>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg bg-purple-500/5 border border-purple-500/10 p-3">
              <Package className="size-4 text-purple-400 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="text-purple-400 font-semibold">Заказ кофе от Зерновой дом</span> — истекает срок через 2 дня
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
