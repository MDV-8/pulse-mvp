'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Minus,
  Clock,
  UserPlus,
  X,
  ChevronRight,
  Armchair,
  Sparkles,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// ============================================================
// Types
// ============================================================

interface QueueCustomer {
  id: string;
  name: string;
  partySize: number;
  time: string;
  waitMinutes: number;
  notes: string;
}

type TableStatus = 'free' | 'occupied' | 'reserved' | 'waiting';

interface Table {
  id: number;
  capacity: number;
  status: TableStatus;
}

interface RecentSeating {
  id: string;
  time: string;
  name: string;
  table: number;
  partySize: number;
}

// ============================================================
// Mock Data
// ============================================================

const initialQueue: QueueCustomer[] = [
  { id: 'q1', name: 'Динара', partySize: 4, time: '14:32', waitMinutes: 22, notes: 'Столик для 4' },
  { id: 'q2', name: 'Марат', partySize: 2, time: '14:38', waitMinutes: 16, notes: 'У окна' },
  { id: 'q3', name: 'Айдана', partySize: 6, time: '14:40', waitMinutes: 14, notes: 'VIP зона' },
  { id: 'q4', name: 'Бекзат', partySize: 2, time: '14:45', waitMinutes: 9, notes: 'Барная стойка' },
  { id: 'q5', name: 'Сания', partySize: 4, time: '14:48', waitMinutes: 6, notes: 'Столик для 4' },
  { id: 'q6', name: 'Ерлан', partySize: 1, time: '14:50', waitMinutes: 4, notes: 'Любой' },
  { id: 'q7', name: 'Асель', partySize: 3, time: '14:52', waitMinutes: 2, notes: 'У окна' },
  { id: 'q8', name: 'Данияр', partySize: 2, time: '14:55', waitMinutes: 0, notes: 'Терраса' },
];

const initialTables: Table[] = [
  { id: 1, capacity: 4, status: 'occupied' },
  { id: 2, capacity: 2, status: 'free' },
  { id: 3, capacity: 2, status: 'free' },
  { id: 4, capacity: 6, status: 'reserved' },
  { id: 5, capacity: 4, status: 'occupied' },
  { id: 6, capacity: 2, status: 'free' },
  { id: 7, capacity: 4, status: 'waiting' },
  { id: 8, capacity: 2, status: 'occupied' },
  { id: 9, capacity: 6, status: 'free' },
];

const initialRecentSeatings: RecentSeating[] = [
  { id: 's1', time: '14:30', name: 'Тимур', table: 1, partySize: 3 },
  { id: 's2', time: '14:15', name: 'Карина', table: 5, partySize: 4 },
  { id: 's3', time: '13:50', name: 'Олжас', table: 8, partySize: 2 },
  { id: 's4', time: '13:35', name: 'Наргиз', table: 2, partySize: 2 },
  { id: 's5', time: '13:10', name: 'Арман', table: 9, partySize: 5 },
];

// ============================================================
// Helpers
// ============================================================

function waitColor(minutes: number) {
  if (minutes < 5) return 'text-emerald-400';
  if (minutes <= 15) return 'text-amber-400';
  return 'text-red-400';
}

function waitBg(minutes: number) {
  if (minutes < 5) return 'bg-emerald-400/10 border-emerald-400/20';
  if (minutes <= 15) return 'bg-amber-400/10 border-amber-400/20';
  return 'bg-red-400/10 border-red-400/20';
}

function waitDot(minutes: number) {
  if (minutes < 5) return 'bg-emerald-400';
  if (minutes <= 15) return 'bg-amber-400';
  return 'bg-red-400';
}

function tableStatusColor(status: TableStatus) {
  switch (status) {
    case 'free': return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400';
    case 'occupied': return 'border-violet-500/40 bg-violet-500/10 text-violet-400';
    case 'reserved': return 'border-red-500/40 bg-red-500/10 text-red-400';
    case 'waiting': return 'border-amber-500/40 bg-amber-500/10 text-amber-400';
  }
}

function tableStatusLabel(status: TableStatus) {
  switch (status) {
    case 'free': return 'Свободен';
    case 'occupied': return 'Занят';
    case 'reserved': return 'Резерв';
    case 'waiting': return 'Ожидает';
  }
}

function tableStatusDot(status: TableStatus) {
  switch (status) {
    case 'free': return 'bg-emerald-400';
    case 'occupied': return 'bg-violet-400';
    case 'reserved': return 'bg-red-400';
    case 'waiting': return 'bg-amber-400';
  }
}

// ============================================================
// Component
// ============================================================

export function WaitlistView() {
  const [queue, setQueue] = useState<QueueCustomer[]>(initialQueue);
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [recentSeatings, setRecentSeatings] = useState<RecentSeating[]>(initialRecentSeatings);
  const [nameInput, setNameInput] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [activeFilter, setActiveFilter] = useState<'all' | 'long-wait'>('all');
  const [tooltipTable, setTooltipTable] = useState<number | null>(null);
  const [seatedRecently, setSeatedRecently] = useState<string | null>(null);

  const filteredQueue = activeFilter === 'all'
    ? queue
    : queue.filter(c => c.waitMinutes > 15);

  const totalWaiting = queue.length;
  const avgWait = queue.length > 0
    ? Math.round(queue.reduce((sum, c) => sum + c.waitMinutes, 0) / queue.length)
    : 0;
  const servedToday = 34;

  const handleAddToQueue = () => {
    if (!nameInput.trim()) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newCustomer: QueueCustomer = {
      id: `q${Date.now()}`,
      name: nameInput.trim(),
      partySize,
      time: timeStr,
      waitMinutes: 0,
      notes: partySize >= 6 ? 'VIP зона' : partySize >= 4 ? 'Столик для 4' : 'Любой',
    };
    setQueue(prev => [...prev, newCustomer]);
    setNameInput('');
    setPartySize(2);
  };

  const handleSeat = (customerId: string) => {
    setQueue(prev => prev.filter(c => c.id !== customerId));
    const customer = queue.find(c => c.id === customerId);
    if (customer) {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const freeTable = tables.find(t => t.status === 'free');
      const seating: RecentSeating = {
        id: `s${Date.now()}`,
        time: timeStr,
        name: customer.name,
        table: freeTable?.id ?? 1,
        partySize: customer.partySize,
      };
      setRecentSeatings(prev => [seating, ...prev.slice(0, 4)]);
      if (freeTable) {
        setTables(prev => prev.map(t => t.id === freeTable.id ? { ...t, status: 'occupied' as TableStatus } : t));
      }
      setSeatedRecently(customerId);
      setTimeout(() => setSeatedRecently(null), 2000);
    }
  };

  const handleSkip = (customerId: string) => {
    setQueue(prev => {
      const idx = prev.findIndex(c => c.id === customerId);
      if (idx < 0 || idx === prev.length - 1) return prev;
      const updated = [...prev];
      [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
      return updated;
    });
  };

  const handleRemove = (customerId: string) => {
    setQueue(prev => prev.filter(c => c.id !== customerId));
  };

  const handleAcceptAI = () => {
    // Seat Динара (first in queue) at table 5
    const d = queue.find(c => c.name === 'Динара');
    if (d) handleSeat(d.id);
  };

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30">
            <Users className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-shadow-glow">
              Лист ожидания
            </h2>
            <p className="text-sm text-muted-foreground">Управление очередью клиентов</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/25 px-3 py-1 badge-bounce">
            <span className="pulse-dot bg-amber-400 mr-1.5" style={{ width: 6, height: 6, display: 'inline-block', borderRadius: '50%' }} />
            {totalWaiting} в очереди
          </Badge>
        </div>
      </div>

      {/* ===== Stats Row ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Ожидают */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 stat-glow-amber"
        >
          <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ожидают</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold number-glow text-amber-400">{totalWaiting}</span>
            <span className="text-sm text-muted-foreground">человек</span>
          </div>
        </motion.div>

        {/* Среднее время */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Среднее время</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold number-glow">{avgWait}</span>
            <span className="text-sm text-muted-foreground">мин</span>
          </div>
        </motion.div>

        {/* Обслужено сегодня */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 stat-glow-green"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Обслужено сегодня</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold number-glow text-emerald-400">{servedToday}</span>
            <span className="text-sm text-muted-foreground">клиентов</span>
          </div>
        </motion.div>
      </div>

      {/* ===== Main Content: 2 Columns ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ===== Left Column — Queue (3/5) ===== */}
        <div className="lg:col-span-3 space-y-4">
          {/* Add Customer Form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <UserPlus className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium">Добавить клиента</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="Имя клиента"
                className="flex-1 bg-white/5 border-white/10 text-sm h-9"
                onKeyDown={e => e.key === 'Enter' && handleAddToQueue()}
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Гостей:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPartySize(p => Math.max(1, p - 1))}
                    className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{partySize}</span>
                  <button
                    onClick={() => setPartySize(p => Math.min(6, p + 1))}
                    className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <Button
                onClick={handleAddToQueue}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm h-9 px-4 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Добавить
              </Button>
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                activeFilter === 'all'
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                  : 'bg-white/5 text-muted-foreground border border-white/5 hover:bg-white/10'
              )}
            >
              Все ({queue.length})
            </button>
            <button
              onClick={() => setActiveFilter('long-wait')}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                activeFilter === 'long-wait'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-white/5 text-muted-foreground border border-white/5 hover:bg-white/10'
              )}
            >
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              Долго ждут ({queue.filter(c => c.waitMinutes > 15).length})
            </button>
          </div>

          {/* Queue List */}
          <div className="max-h-[500px] overflow-y-auto scrollbar-thin space-y-2 pr-1">
            <AnimatePresence mode="popLayout">
              {filteredQueue.map((customer, index) => (
                <motion.div
                  key={customer.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -60, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.03, type: 'spring', stiffness: 400, damping: 30 }}
                  className={cn(
                    'glass-card p-3 border card-hover-lift slide-up-fade',
                    waitBg(customer.waitMinutes)
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Position number */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <span className="text-lg font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                      <span
                        className={cn('w-2 h-2 rounded-full', waitDot(customer.waitMinutes), customer.waitMinutes > 15 && 'pulse-dot')}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-sm truncate">{customer.name}</span>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-white/5 border-white/10">
                          {customer.partySize} чел.
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {customer.time}
                        </span>
                        <span className={cn('font-medium', waitColor(customer.waitMinutes))}>
                          {customer.waitMinutes} мин ожидания
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {customer.notes}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleSeat(customer.id)}
                        className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 text-xs font-medium hover:bg-emerald-500/25 transition-colors border border-emerald-500/20"
                      >
                        Посадить
                      </button>
                      <button
                        onClick={() => handleSkip(customer.id)}
                        className="px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-400 text-xs font-medium hover:bg-amber-500/25 transition-colors border border-amber-500/20"
                      >
                        Пропустить
                      </button>
                      <button
                        onClick={() => handleRemove(customer.id)}
                        className="w-7 h-7 rounded-md bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors border border-red-500/20"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredQueue.length === 0 && (
              <div className="glass-card p-8 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Очередь пуста</p>
              </div>
            )}
          </div>
        </div>

        {/* ===== Right Column — Tables & AI (2/5) ===== */}
        <div className="lg:col-span-2 space-y-4">
          {/* Table Status Grid */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Armchair className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium">Столики</span>
              <div className="ml-auto flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Свободен</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-violet-400" /> Занят</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Резерв</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Ожидает</span>
              </div>
            </div>
            <div
              className="grid grid-cols-3 gap-2"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}
            >
              {tables.map((table, i) => (
                <div
                  key={table.id}
                  className="relative"
                  onMouseEnter={() => setTooltipTable(table.id)}
                  onMouseLeave={() => setTooltipTable(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + i * 0.03 }}
                    className={cn(
                      'rounded-xl border p-3 text-center hover-scale cursor-pointer transition-all',
                      tableStatusColor(table.status)
                    )}
                  >
                    <div className="text-lg font-bold">{table.id}</div>
                    <div className="text-[10px] opacity-70">{table.capacity} места</div>
                    <div className={cn('w-1.5 h-1.5 rounded-full mx-auto mt-1.5', tableStatusDot(table.status))} />
                  </motion.div>

                  {/* Tooltip */}
                  <AnimatePresence>
                    {tooltipTable === table.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-black/90 border border-white/10 text-xs text-white whitespace-nowrap shadow-xl pointer-events-none"
                      >
                        Столик {table.id} — {tableStatusLabel(table.status)} — {table.capacity} места
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-black/90" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Suggestion */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card-deep p-4 border-pulse-soft relative overflow-hidden"
          >
            {/* aurora-border effect via pseudo-element simulation */}
            <div className="absolute inset-0 rounded-xl pointer-events-none border border-violet-500/20" style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.08), transparent 40%, rgba(168,85,247,0.05) 80%)',
            }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-semibold text-violet-300">AI рекомендация</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Ближайшее освобождение: <span className="text-amber-400 font-medium">Столик 5</span> через ~5 мин. Рекомендуется посадить{' '}
                <span className="text-white font-medium">Динару</span>{' '}
                (6 чел., 22 мин ожидания) — соответствует VIP зоне
              </p>
              <Button
                onClick={handleAcceptAI}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs h-8 px-3"
              >
                Принять
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </motion.div>

          {/* Recent Seatings */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium">Последние посадки</span>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {recentSeatings.map((seating, i) => (
                  <motion.div
                    key={seating.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                    className="flex items-center gap-3 py-1.5"
                  >
                    <span className="text-xs text-muted-foreground w-10 shrink-0">{seating.time}</span>
                    <span className="text-sm font-medium flex-1 truncate">{seating.name}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-white/10 bg-white/5">
                      Столик {seating.table}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{seating.partySize} чел.</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== Section Divider ===== */}
      <div className="neon-line" />
    </div>
  );
}
