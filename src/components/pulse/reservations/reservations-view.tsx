'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  Users,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type ReservationStatus = 'confirmed' | 'pending' | 'cancelled';

interface Reservation {
  id: string;
  time: string;
  name: string;
  partySize: number;
  table: string;
  status: ReservationStatus;
  notes: string;
}

const reservations: Reservation[] = [
  {
    id: '1',
    time: '10:00',
    name: 'Айсулу',
    partySize: 2,
    table: 'Столик 3',
    status: 'confirmed',
    notes: 'Капучино x2',
  },
  {
    id: '2',
    time: '12:00',
    name: 'Дмитрий',
    partySize: 4,
    table: 'Столик 7',
    status: 'confirmed',
    notes: 'Деловой обед',
  },
  {
    id: '3',
    time: '14:00',
    name: 'Мария',
    partySize: 6,
    table: 'Столик 1 (VIP)',
    status: 'pending',
    notes: 'День рождения',
  },
  {
    id: '4',
    time: '16:00',
    name: 'Тимур',
    partySize: 2,
    table: 'Столик 5',
    status: 'confirmed',
    notes: 'Встреча',
  },
  {
    id: '5',
    time: '18:00',
    name: 'Елена',
    partySize: 8,
    table: 'Столик 1+2',
    status: 'confirmed',
    notes: 'Корпоратив',
  },
  {
    id: '6',
    time: '20:00',
    name: 'Арман',
    partySize: 3,
    table: 'Столик 4',
    status: 'cancelled',
    notes: 'Ужин',
  },
];

const timeSlots = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

const statusConfig: Record<ReservationStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className: string;
  borderColor: string;
}> = {
  confirmed: {
    label: 'Подтверждено',
    variant: 'default',
    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20',
    borderColor: 'border-l-emerald-500',
  },
  pending: {
    label: 'Ожидает',
    variant: 'secondary',
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/20',
    borderColor: 'border-l-amber-500',
  },
  cancelled: {
    label: 'Отменено',
    variant: 'destructive',
    className: 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/20',
    borderColor: 'border-l-red-500',
  },
};

type TableStatus = 'free' | 'reserved' | 'occupied' | 'reserved_soon';

const tables: { id: number; status: TableStatus }[] = [
  { id: 1, status: 'reserved' },
  { id: 2, status: 'reserved' },
  { id: 3, status: 'occupied' },
  { id: 4, status: 'reserved_soon' },
  { id: 5, status: 'reserved' },
  { id: 6, status: 'free' },
  { id: 7, status: 'occupied' },
  { id: 8, status: 'free' },
  { id: 9, status: 'free' },
  { id: 10, status: 'occupied' },
  { id: 11, status: 'free' },
  { id: 12, status: 'reserved' },
];

const tableStatusColors: Record<TableStatus, { bg: string; border: string; label: string }> = {
  free: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', label: 'Свободен' },
  reserved: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', label: 'Забронирован' },
  occupied: { bg: 'bg-red-500/20', border: 'border-red-500/40', label: 'Занят' },
  reserved_soon: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', label: 'Скоро бронь' },
};

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

export function ReservationsView() {
  const [localReservations, setLocalReservations] = useState(reservations);

  const handleConfirm = (id: string) => {
    setLocalReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'confirmed' as const } : r))
    );
  };

  const handleCancel = (id: string) => {
    setLocalReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const } : r))
    );
  };

  const getReservationsForSlot = (slot: string) => {
    return localReservations.filter((r) => r.time === slot);
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15">
            <CalendarDays className="size-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-shadow-glow">Бронирования</h2>
            <p className="text-xs text-muted-foreground">Управление столиками и бронями</p>
          </div>
        </div>
        <Button
          size="sm"
          className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          onClick={() => toast.info('Функция создания бронирования будет доступна в следующей версии')}
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Новое бронирование</span>
        </Button>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-3 gap-3"
      >
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="size-4 text-purple-400" />
            <span className="text-xs text-muted-foreground">Сегодня</span>
          </div>
          <p className="text-2xl font-bold text-foreground stat-glow-purple tabular-nums">12</p>
          <p className="text-xs text-muted-foreground mt-0.5">броней</p>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground">Свободно</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400 stat-glow-green tabular-nums">4</p>
          <p className="text-xs text-muted-foreground mt-0.5">столиков</p>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="size-4 text-red-400" />
            <span className="text-xs text-muted-foreground">Отменено</span>
          </div>
          <p className="text-2xl font-bold text-red-400 tabular-nums">2</p>
          <p className="text-xs text-muted-foreground mt-0.5">брони</p>
        </div>
      </motion.div>

      {/* Date Navigator */}
      <motion.div variants={itemVariants} className="glass-card rounded-xl p-3">
        <div className="flex items-center justify-center gap-4">
          <button className="p-1 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-purple-400" />
            <span className="text-sm font-semibold text-foreground">31 января, пятница</span>
          </div>
          <button className="p-1 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </motion.div>

      {/* Timeline View */}
      <motion.div variants={itemVariants} className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin pr-1 spotlight-container">
        {timeSlots.map((slot) => {
          const slotReservations = getReservationsForSlot(slot);
          return (
            <div key={slot} className="flex gap-3">
              {/* Time label */}
              <div className="flex-shrink-0 w-14 text-right">
                <span className="text-xs font-mono text-muted-foreground">{slot}</span>
              </div>

              {/* Timeline dot + line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={cn(
                  'w-2.5 h-2.5 rounded-full mt-0.5',
                  slotReservations.some(r => r.status === 'confirmed')
                    ? 'bg-emerald-500 active-indicator'
                    : slotReservations.length > 0
                      ? 'bg-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.4)]'
                      : 'bg-muted-foreground/20'
                )} />
                <div className="w-px flex-1 bg-border" />
              </div>

              {/* Reservation cards */}
              <div className="flex-1 pb-4 space-y-2">
                {slotReservations.length === 0 ? (
                  <div className="text-xs text-muted-foreground/40 italic py-2">
                    Нет бронирований
                  </div>
                ) : (
                  slotReservations.map((res) => {
                    const config = statusConfig[res.status];
                    return (
                      <div
                        key={res.id}
                        className={cn(
                          'glass-card rounded-xl p-4 border-l-2 transition-all duration-200 card-hover-lift',
                          config.borderColor
                        )}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          {/* Main info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-foreground text-sm">{res.name}</span>
                              <Badge
                                variant="outline"
                                className={cn('text-[10px] px-1.5 py-0', config.className)}
                              >
                                {config.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {res.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="size-3" />
                                {res.partySize} {res.partySize === 1 ? 'персона' : res.partySize < 5 ? 'персоны' : 'персон'}
                              </span>
                              <span className="font-medium text-foreground/70">{res.table}</span>
                            </div>
                            {res.notes && (
                              <p className="text-xs text-muted-foreground/70 mt-1">{res.notes}</p>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {res.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs gap-1 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300"
                                onClick={() => handleConfirm(res.id)}
                              >
                                <CheckCircle2 className="size-3" />
                                Подтвердить
                              </Button>
                            )}
                            {res.status === 'confirmed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs gap-1 text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
                                onClick={() => handleCancel(res.id)}
                              >
                                <XCircle className="size-3" />
                                Отменить
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* AI Suggestion Box */}
      <motion.div variants={itemVariants}>
        <div className="glass-card-premium rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <AlertTriangle className="size-4 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-purple-400 mb-1">Рекомендация AI</p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                В 14:00 бронь на 6 персон (день рождения). Рекомендуем подготовить столик 1 с декором.{' '}
                <span className="text-purple-300 font-medium">Предложите бесплатный десерт.</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Table Map */}
      <motion.div variants={itemVariants}>
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Карта зала</h3>
          <div className="grid grid-cols-4 gap-2">
            {tables.map((table) => {
              const colors = tableStatusColors[table.status];
              return (
                <div
                  key={table.id}
                  className="group relative"
                  title={`${table.status === 'free' ? 'Свободен' : table.status === 'reserved' ? 'Забронирован' : table.status === 'occupied' ? 'Занят' : 'Скоро бронь'}`}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center h-12 rounded-lg border transition-all duration-200 cursor-default',
                      colors.bg,
                      colors.border,
                      'hover:scale-105 hover:shadow-lg'
                    )}
                  >
                    <span className="text-xs font-bold text-foreground">{table.id}</span>
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-popover border border-border text-[10px] text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                    Столик {table.id} — {colors.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-border">
            {(Object.entries(tableStatusColors) as [TableStatus, typeof tableStatusColors.free][]).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={cn('w-2.5 h-2.5 rounded-sm', val.bg, 'border', val.border)} />
                <span className="text-[10px] text-muted-foreground">{val.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
