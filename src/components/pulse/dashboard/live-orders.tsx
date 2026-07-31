'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, Clock, CheckCircle2, Package } from 'lucide-react';

// ---- Mock data ----

interface OrderItem {
  name: string;
  qty: number;
}

interface LiveOrder {
  id: number;
  items: OrderItem[];
  total: number;
  status: 'new' | 'ready';
  createdAt: number;
}

const MENU_ITEMS: { name: string; price: number }[] = [
  { name: 'Капучино', price: 1800 },
  { name: 'Латте', price: 1900 },
  { name: 'Американо', price: 1500 },
  { name: 'Раф кофе', price: 2200 },
  { name: 'Флэт уайт', price: 2100 },
  { name: 'Эспрессо', price: 1200 },
  { name: 'Чизкейк', price: 2500 },
  { name: 'Тирамису', price: 2800 },
  { name: 'Круассан', price: 1600 },
  { name: 'Брауни', price: 2000 },
  { name: 'Морковный торт', price: 2300 },
  { name: 'Чай зелёный', price: 1000 },
  { name: 'Чай чёрный', price: 1000 },
  { name: 'Матча латте', price: 2500 },
  { name: 'Горячий шоколад', price: 2200 },
];

function generateItems(): OrderItem[] {
  const count = 1 + Math.floor(Math.random() * 4); // 1-4 items
  const shuffled = [...MENU_ITEMS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  return selected.map((item) => ({
    name: item.name,
    qty: 1 + Math.floor(Math.random() * 2), // 1-2
  }));
}

function formatTime(createdAt: number): string {
  const diff = Math.floor((Date.now() - createdAt) / 1000);
  if (diff < 5) return 'только что';
  if (diff < 60) return `${diff} сек назад`;
  const mins = Math.floor(diff / 60);
  if (mins === 1) return '1 мин назад';
  if (mins < 5) return `${mins} мин назад`;
  return `${mins} мин назад`;
}

const MAX_ORDERS = 10;
const ORDER_START = 1247;

// ---- Component ----

export function LiveOrders() {
  const [orders, setOrders] = useState<LiveOrder[]>([]);
  const nextIdRef = useRef(ORDER_START);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Add a new order at random interval (8-12s)
  const addOrder = useCallback(() => {
    const items = generateItems();
    const total = items.reduce((sum, it) => {
      const menuItem = MENU_ITEMS.find((m) => m.name === it.name);
      return sum + (menuItem?.price ?? 0) * it.qty;
    }, 0);

    const order: LiveOrder = {
      id: nextIdRef.current++,
      items,
      total,
      status: 'new',
      createdAt: Date.now(),
    };

    setOrders((prev) => {
      const next = [order, ...prev];
      return next.slice(0, MAX_ORDERS);
    });
  }, []);

  useEffect(() => {
    // Generate initial order
    addOrder();

    // Schedule next order at 8-12s random interval
    let timeoutId: ReturnType<typeof setTimeout>;
    function scheduleNext() {
      const delay = 8000 + Math.random() * 4000;
      timeoutId = setTimeout(() => {
        addOrder();
        scheduleNext();
      }, delay);
    }
    scheduleNext();

    return () => clearTimeout(timeoutId);
  }, [addOrder]);

  // Promote orders from 'new' to 'ready' after 5 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.status === 'new' && Date.now() - o.createdAt > 5000) {
            return { ...o, status: 'ready' as const };
          }
          return o;
        })
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Auto-scroll to top when new order arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [orders.length]);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <ShoppingBag className="size-4 text-primary" />
          <span className="text-sm font-semibold">Live заказы</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] text-muted-foreground">Live</span>
        </div>
      </div>

      {/* Order feed */}
      <div
        ref={scrollRef}
        className="max-h-[300px] overflow-y-auto"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
      >
        <AnimatePresence initial={false}>
          {orders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="border-b border-border/30 last:border-b-0"
            >
              <div className="flex items-start gap-3 px-4 py-3">
                {/* Icon */}
                <div className="mt-0.5 shrink-0">
                  {order.status === 'new' ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                      <Package className="size-4 text-purple-400" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-foreground">
                      Заказ #{order.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        order.status === 'new'
                          ? 'bg-purple-500/15 text-purple-400'
                          : 'bg-emerald-500/15 text-emerald-400'
                      }`}
                    >
                      {order.status === 'new' ? 'Новый' : 'Готов'}
                    </span>
                  </div>

                  {/* Items list */}
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                    {order.items.map((it, i) => (
                      <span key={i} className="text-xs text-muted-foreground">
                        {it.name} x{it.qty}
                      </span>
                    ))}
                  </div>

                  {/* Bottom: total + time */}
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground tabular-nums">
                      {order.total.toLocaleString('ru-RU')} ₸
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="size-3" />
                      <span>{formatTime(order.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <ShoppingBag className="size-8 opacity-30" />
            <span className="text-xs mt-2">Ожидание заказов...</span>
          </div>
        )}
      </div>
    </div>
  );
}
