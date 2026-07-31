'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  CreditCard,
  Banknote,
  Receipt,
  Clock,
  CheckCircle,
  ArrowRight,
  Coffee,
  Plus,
  QrCode,
  X,
  CakeSlice,
  Croissant,
  CupSoda,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ============================================================
// Types
// ============================================================

type OrderStatus = 'new' | 'ready' | 'paid';
type PaymentMethod = 'cash' | 'card' | 'account';
type FilterTab = 'all' | 'new' | 'ready' | 'paid';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  number: string;
  time: string;
  customer: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
}

interface QuickProduct {
  name: string;
  price: number;
  icon: React.ElementType;
}

interface Transaction {
  id: string;
  time: string;
  amount: number;
  method: 'cash' | 'card' | 'account';
}

// ============================================================
// Mock Data
// ============================================================

const mockOrders: Order[] = [
  {
    id: '8',
    number: '#008',
    time: '14:52',
    customer: 'Айдана',
    items: [
      { name: 'Капучино', qty: 2, price: 1200 },
      { name: 'Чизкейк', qty: 1, price: 2800 },
    ],
    total: 5200,
    status: 'new',
  },
  {
    id: '7',
    number: '#007',
    time: '14:48',
    customer: 'Марат',
    items: [
      { name: 'Латте', qty: 1, price: 1400 },
      { name: 'Круассан', qty: 1, price: 1600 },
    ],
    total: 3000,
    status: 'ready',
  },
  {
    id: '6',
    number: '#006',
    time: '14:45',
    customer: 'Дина',
    items: [{ name: 'Раф', qty: 1, price: 1500 }],
    total: 1500,
    status: 'ready',
  },
  {
    id: '5',
    number: '#005',
    time: '14:38',
    customer: 'Бекзат',
    items: [{ name: 'Американо', qty: 3, price: 900 }],
    total: 2700,
    status: 'paid',
  },
  {
    id: '4',
    number: '#004',
    time: '14:32',
    customer: 'Сания',
    items: [
      { name: 'Капучино', qty: 1, price: 1200 },
      { name: 'Латте', qty: 2, price: 1400 },
      { name: 'Мокко', qty: 1, price: 1900 },
    ],
    total: 5900,
    status: 'paid',
  },
  {
    id: '3',
    number: '#003',
    time: '14:25',
    customer: 'Ерлан',
    items: [
      { name: 'Флэт уайт', qty: 1, price: 1300 },
      { name: 'Чизкейк', qty: 2, price: 2800 },
    ],
    total: 6900,
    status: 'paid',
  },
  {
    id: '2',
    number: '#002',
    time: '14:18',
    customer: 'Асель',
    items: [{ name: 'Латте', qty: 1, price: 1400 }],
    total: 1400,
    status: 'paid',
  },
  {
    id: '1',
    number: '#001',
    time: '14:10',
    customer: 'Данияр',
    items: [
      { name: 'Капучино', qty: 2, price: 1200 },
      { name: 'Круассан', qty: 1, price: 1600 },
    ],
    total: 4000,
    status: 'paid',
  },
];

const quickProducts: QuickProduct[] = [
  { name: 'Капучино', price: 1200, icon: Coffee },
  { name: 'Латте', price: 1400, icon: CupSoda },
  { name: 'Раф', price: 1500, icon: Coffee },
  { name: 'Американо', price: 900, icon: Coffee },
  { name: 'Чизкейк', price: 2800, icon: CakeSlice },
  { name: 'Круассан', price: 1600, icon: Croissant },
];

const recentTransactions: Transaction[] = [
  { id: 't1', time: '14:38', amount: 2700, method: 'cash' },
  { id: 't2', time: '14:32', amount: 5900, method: 'card' },
  { id: 't3', time: '14:25', amount: 6900, method: 'card' },
  { id: 't4', time: '14:18', amount: 1400, method: 'account' },
  { id: 't5', time: '14:10', amount: 4000, method: 'cash' },
];

// ============================================================
// Config
// ============================================================

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }>
= {
  new: {
    label: 'Новый',
    className: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  },
  ready: {
    label: 'Готов',
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  paid: {
    label: 'Оплачен',
    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
};

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'new', label: 'Новый' },
  { key: 'ready', label: 'Готов' },
  { key: 'paid', label: 'Оплачен' },
];

const paymentMethods: {
  key: PaymentMethod;
  label: string;
  icon: React.ElementType;
}[] = [
  { key: 'cash', label: 'Наличные', icon: Banknote },
  { key: 'card', label: 'Картой', icon: CreditCard },
  { key: 'account', label: 'Счёт', icon: QrCode },
];

// ============================================================
// Animation Variants
// ============================================================

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

// ============================================================
// Component
// ============================================================

export function CashierView() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quickAddAnim, setQuickAddAnim] = useState<string | null>(null);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const activeOrder = orders.find((o) => o.id === activeOrderId) ?? null;

  const filteredOrders =
    activeTab === 'all'
      ? orders
      : orders.filter((o) => o.status === activeTab);

  const handleAccept = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'ready' as const } : o)),
    );
  };

  const handleServe = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'paid' as const } : o)),
    );
  };

  const handleQuickAdd = (product: QuickProduct) => {
    if (!activeOrder) return;
    setQuickAddAnim(product.name);
    setTimeout(() => setQuickAddAnim(null), 400);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== activeOrder.id) return o;
        const existing = o.items.find((i) => i.name === product.name);
        if (existing) {
          return {
            ...o,
            items: o.items.map((i) =>
              i.name === product.name ? { ...i, qty: i.qty + 1 } : i,
            ),
            total: o.total + product.price,
          };
        }
        return {
          ...o,
          items: [...o.items, { name: product.name, qty: 1, price: product.price }],
          total: o.total + product.price,
        };
      }),
    );
  };

  const handleRemoveItem = (orderItemId: number) => {
    if (!activeOrder) return;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== activeOrder.id) return o;
        const item = o.items[orderItemId];
        if (!item) return o;
        const newItems = o.items
          .map((i, idx) =>
            idx === orderItemId
              ? i.qty > 1
                ? { ...i, qty: i.qty - 1 }
                : null
              : i,
          )
          .filter(Boolean) as OrderItem[];
        return {
          ...o,
          items: newItems,
          total: newItems.reduce((sum, i) => sum + i.price * i.qty, 0),
        };
      }),
    );
  };

  const formatCurrency = (amount: number) =>
    amount.toLocaleString('ru-RU') + ' ₸';

  const dateStr = currentTime.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = currentTime.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getMethodIcon = (method: 'cash' | 'card' | 'account') => {
    switch (method) {
      case 'cash':
        return <Banknote className="size-3.5 text-amber-400" />;
      case 'card':
        return <CreditCard className="size-3.5 text-purple-400" />;
      case 'account':
        return <QrCode className="size-3.5 text-cyan-400" />;
    }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* ====== Header ====== */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15">
            <Calculator className="size-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-shadow-glow">Касса</h2>
            <p className="text-xs text-muted-foreground">
              Управление заказами и платежами
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              Касса открыта
            </span>
          </div>
          {/* Date/Time */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="size-3.5" />
            <span className="text-xs tabular-nums">
              {dateStr}, {timeStr}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ====== Neon Line Divider ====== */}
      <motion.div variants={itemVariants}>
        <div className="neon-line" />
      </motion.div>

      {/* ====== Stats Row ====== */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {/* Today */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="size-4 text-purple-400" />
            <span className="text-xs text-muted-foreground">Сегодня</span>
          </div>
          <p className="text-2xl font-bold text-foreground stat-glow-purple tabular-nums number-glow">
            386 000 ₸
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            47 заказов
          </p>
        </div>

        {/* Average Check */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="size-4 text-purple-400" />
            <span className="text-xs text-muted-foreground">
              Средний чек
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums number-glow">
            8 214 ₸
          </p>
          <p className="text-xs text-emerald-400 mt-0.5">+12% от вчера</p>
        </div>

        {/* Work Time */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="size-4 text-purple-400" />
            <span className="text-xs text-muted-foreground">
              Время работы
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums number-glow">
            7ч 32м
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            С 07:30 до текущего
          </p>
        </div>
      </motion.div>

      {/* ====== Main Content: 2 columns ====== */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-5 gap-4"
      >
        {/* Left Column — Order Queue (3/5) */}
        <div className="lg:col-span-3 space-y-3">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 glass-card rounded-xl">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200',
                  activeTab === tab.key
                    ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Order List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, idx) => {
                const config = statusConfig[order.status];
                const isActive = activeOrderId === order.id;
                const staggerClass =
                  idx < 5
                    ? (cn('stagger-' + (idx + 1) as 'stagger-1' | 'stagger-2' | 'stagger-3' | 'stagger-4' | 'stagger-5'))
                    : '';
                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className={cn(
                      'glass-card rounded-xl p-4 cursor-pointer transition-all duration-200 card-hover-lift',
                      'slide-in-right opacity-0',
                      staggerClass,
                      isActive && 'ring-1 ring-purple-500/40 border-purple-500/20',
                    )}
                    onClick={() => setActiveOrderId(order.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Left: Order info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-foreground tabular-nums">
                            {order.number}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px] px-1.5 py-0',
                              config.className,
                            )}
                          >
                            {config.label}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground ml-auto">
                            {order.time}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {order.customer}
                        </p>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                          {order.items.map((item, iIdx) => (
                            <span
                              key={iIdx}
                              className="text-[11px] text-muted-foreground/80"
                            >
                              {item.name} x{item.qty}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Total + Action */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-sm font-bold text-foreground tabular-nums">
                          {formatCurrency(order.total)}
                        </span>
                        {order.status === 'new' && (
                          <Button
                            size="sm"
                            className="h-7 text-[11px] gap-1 bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_10px_rgba(139,92,246,0.25)]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAccept(order.id);
                            }}
                          >
                            <ArrowRight className="size-3" />
                            Принять
                          </Button>
                        )}
                        {order.status === 'ready' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px] gap-1 text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleServe(order.id);
                            }}
                          >
                            <CheckCircle className="size-3" />
                            Выдать
                          </Button>
                        )}
                        {order.status === 'paid' && (
                          <CheckCircle className="size-4 text-emerald-400" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column — Active Order + Quick Add (2/5) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active Order Details */}
          <div className="glass-card-premium rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Receipt className="size-4 text-purple-400" />
              Текущий заказ
            </h3>
            <AnimatePresence mode="wait">
              {activeOrder ? (
                <motion.div
                  key={activeOrder.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-lg font-bold text-foreground tabular-nums">
                        {activeOrder.number}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {activeOrder.customer} · {activeOrder.time}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] px-1.5 py-0',
                        statusConfig[activeOrder.status].className,
                      )}
                    >
                      {statusConfig[activeOrder.status].label}
                    </Badge>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2 mb-3 max-h-48 overflow-y-auto scrollbar-thin">
                    {activeOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-accent/50"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Coffee className="size-3 text-purple-400/60 shrink-0" />
                          <span className="text-xs text-foreground truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            x{item.qty}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-medium text-foreground tabular-nums">
                            {formatCurrency(item.price * item.qty)}
                          </span>
                          {activeOrder.status === 'new' && (
                            <button
                              className="p-0.5 rounded hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
                              onClick={() => handleRemoveItem(idx)}
                              aria-label={`Удалить ${item.name}`}
                            >
                              <X className="size-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="neon-line mb-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      Итого
                    </span>
                    <span className="text-lg font-bold text-foreground stat-glow-purple tabular-nums number-glow">
                      {formatCurrency(activeOrder.total)}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
                    <Receipt className="size-5 text-purple-400/50" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Выберите заказ
                  </p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">
                    Нажмите на заказ из списка слева
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Add Products */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Plus className="size-4 text-purple-400" />
              Быстрое добавление
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickProducts.map((product) => {
                const Icon = product.icon;
                const isAnimating = quickAddAnim === product.name;
                return (
                  <motion.button
                    key={product.name}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAdd(product)}
                    disabled={!activeOrder || activeOrder?.status !== 'new'}
                    className={cn(
                      'glass-card rounded-lg p-3 text-left transition-all duration-200',
                      'hover:border-purple-500/30 hover:shadow-[0_0_12px_rgba(139,92,246,0.15)]',
                      'disabled:opacity-40 disabled:cursor-not-allowed',
                      isAnimating && 'border-glow border-purple-500/40',
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="size-3.5 text-purple-400" />
                      <span className="text-[11px] font-medium text-foreground">
                        {product.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatCurrency(product.price)}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <CreditCard className="size-4 text-purple-400" />
              Способ оплаты
            </h3>
            <div className="flex gap-2">
              {paymentMethods.map((pm) => {
                const Icon = pm.icon;
                return (
                  <button
                    key={pm.key}
                    onClick={() => setPaymentMethod(pm.key)}
                    className={cn(
                      'flex-1 flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all duration-200 border',
                      paymentMethod === pm.key
                        ? 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent',
                    )}
                  >
                    <Icon className="size-4" />
                    <span className="text-[11px] font-medium">{pm.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ====== Section Divider ====== */}
      <div className="section-divider" aria-hidden="true">
        <span className="divider-dot" />
      </div>

      {/* ====== Recent Transactions ====== */}
      <motion.div variants={itemVariants}>
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Receipt className="size-4 text-purple-400" />
            Последние транзакции
          </h3>
          <div className="space-y-2">
            {recentTransactions.map((tx, idx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + idx * 0.08 }}
                className={cn(
                  'flex items-center justify-between py-2 px-3 rounded-lg bg-accent/30',
                  'slide-in-right opacity-0',
                  idx < 5 && 'stagger-' + (idx + 1),
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground tabular-nums w-10">
                    {tx.time}
                  </span>
                  {getMethodIcon(tx.method)}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground tabular-nums">
                    {formatCurrency(tx.amount)}
                  </span>
                  <CheckCircle className="size-3.5 text-emerald-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
