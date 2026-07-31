'use client';

import { useState } from 'react';
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  UserCircle,
  Edit3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ── Mock data ──────────────────────────────────────────────

interface Shift {
  time: string;
  type: 'morning' | 'afternoon' | 'off';
}

interface EmployeeSchedule {
  name: string;
  role: string;
  shifts: Shift[]; // 7 days
  totalHours: number;
}

const employees: EmployeeSchedule[] = [
  {
    name: 'Айдана',
    role: 'Бариста',
    totalHours: 40,
    shifts: [
      { time: '8:00-16:00', type: 'morning' },
      { time: '8:00-16:00', type: 'morning' },
      { time: 'Выходной', type: 'off' },
      { time: '8:00-16:00', type: 'morning' },
      { time: '8:00-16:00', type: 'morning' },
      { time: '10:00-18:00', type: 'afternoon' },
      { time: '10:00-18:00', type: 'afternoon' },
    ],
  },
  {
    name: 'Дима',
    role: 'Кассир',
    totalHours: 40,
    shifts: [
      { time: '10:00-18:00', type: 'afternoon' },
      { time: '10:00-18:00', type: 'afternoon' },
      { time: '10:00-18:00', type: 'afternoon' },
      { time: 'Выходной', type: 'off' },
      { time: '10:00-18:00', type: 'afternoon' },
      { time: '10:00-18:00', type: 'afternoon' },
      { time: 'Выходной', type: 'off' },
    ],
  },
  {
    name: 'Мария',
    role: 'Менеджер',
    totalHours: 42,
    shifts: [
      { time: '8:00-16:00', type: 'morning' },
      { time: '8:00-16:00', type: 'morning' },
      { time: '8:00-16:00', type: 'morning' },
      { time: '8:00-16:00', type: 'morning' },
      { time: '8:00-16:00', type: 'morning' },
      { time: '10:00-18:00', type: 'afternoon' },
      { time: '10:00-18:00', type: 'afternoon' },
    ],
  },
  {
    name: 'Нурлан',
    role: 'Повар',
    totalHours: 40,
    shifts: [
      { time: 'Выходной', type: 'off' },
      { time: '8:00-16:00', type: 'morning' },
      { time: '8:00-16:00', type: 'morning' },
      { time: '8:00-16:00', type: 'morning' },
      { time: '8:00-16:00', type: 'morning' },
      { time: '8:00-16:00', type: 'morning' },
      { time: 'Выходной', type: 'off' },
    ],
  },
  {
    name: 'Саша',
    role: 'Курьер',
    totalHours: 34,
    shifts: [
      { time: '10:00-18:00', type: 'afternoon' },
      { time: '10:00-18:00', type: 'afternoon' },
      { time: 'Выходной', type: 'off' },
      { time: '10:00-18:00', type: 'afternoon' },
      { time: '10:00-18:00', type: 'afternoon' },
      { time: 'Выходной', type: 'off' },
      { time: '10:00-18:00', type: 'afternoon' },
    ],
  },
];

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Simulated current day (Thursday = index 3)
const CURRENT_DAY_INDEX = 3;

// ── Helpers ────────────────────────────────────────────────

function shiftCellClass(type: Shift['type'], isCurrentDay: boolean) {
  if (type === 'off') return 'text-muted-foreground/50';
  const base = isCurrentDay ? 'aurora-border ' : '';
  if (type === 'morning') return `${base}bg-purple-500/15 text-purple-300`;
  return `${base}bg-amber-500/15 text-amber-300`;
}

// ── Component ──────────────────────────────────────────────

export function ScheduleView() {
  const [weekLabel] = useState('27 января — 2 февраля');

  const totalHours = employees.reduce((acc, e) => acc + e.totalHours, 0);
  const avgHours = (totalHours / employees.length).toFixed(1);
  const overtimeCount = employees.filter((e) => e.totalHours > 40).length;
  const overtimeEmployee = employees.find((e) => e.totalHours > 40);

  return (
    <div className="space-y-5">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-shadow-glow">График сотрудников</h2>
            <p className="text-sm text-muted-foreground">
              Расписание на неделю
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
        >
          <Plus className="w-4 h-4" />
          Добавить смену
        </Button>
      </div>

      {/* ── Week Navigator ────────────────────────────────── */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-sm">{weekLabel}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* ── Schedule Grid ───────────────────────────────── */}
        <div className="mt-4 overflow-x-auto scrollbar-thin">
          <div className="min-w-[640px]">
            {/* Column headers: employee name + 7 days */}
            <div className="grid grid-cols-[140px_repeat(7,1fr)] gap-1.5 mb-2">
              <div className="text-xs text-muted-foreground font-medium px-2 py-1" />
              {DAYS.map((day, i) => (
                <div
                  key={day}
                  className={`text-center text-xs font-medium py-1 rounded-lg ${
                    i === CURRENT_DAY_INDEX
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'text-muted-foreground'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Employee rows */}
            {employees.map((emp) => (
              <div
                key={emp.name}
                className="grid grid-cols-[140px_repeat(7,1fr)] gap-1.5 mb-1.5"
              >
                {/* Employee label */}
                <div className="flex items-center gap-2 px-2 py-1">
                  <UserCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">
                      {emp.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {emp.role}
                    </p>
                  </div>
                </div>

                {/* Shift cells */}
                {emp.shifts.map((shift, dayIdx) => (
                  <div
                    key={`${emp.name}-${dayIdx}`}
                    className={
                      'flex items-center justify-center text-[10px] sm:text-xs font-medium py-2 rounded-lg transition-colors ' +
                      shiftCellClass(shift.type, dayIdx === CURRENT_DAY_INDEX)
                    }
                  >
                    {shift.time}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── Legend ───────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-purple-500/15 border border-purple-500/30" />
            <span className="text-[10px] text-muted-foreground">
              Утренняя смена
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-500/15 border border-amber-500/30" />
            <span className="text-[10px] text-muted-foreground">
              Дневная смена
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-muted" />
            <span className="text-[10px] text-muted-foreground">
              Выходной
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded aurora-border" />
            <span className="text-[10px] text-muted-foreground">
              Сегодня
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Всего часов</p>
            <p className="text-lg font-bold stat-glow-purple">
              {totalHours} ч
            </p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/20">
            <Edit3 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Среднее на сотрудника
            </p>
            <p className="text-lg font-bold stat-glow-cyan">
              {avgHours} ч
            </p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 flex items-center gap-3 ribbon">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/20">
            <Calendar className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Переработки</p>
            <p className="text-lg font-bold stat-glow-amber">
              {overtimeCount}
            </p>
            {overtimeEmployee && (
              <p className="text-[10px] text-amber-400/80">
                {overtimeEmployee.name} — {overtimeEmployee.totalHours} ч
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── AI Suggestion Box ──────────────────────────────── */}
      <div className="glass-card rounded-xl p-4 ai-glow-card breathe-glow">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20 shrink-0 mt-0.5">
            <span className="text-sm">🤖</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
              Рекомендация AI
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="text-amber-400 font-medium">
                {overtimeEmployee?.name ?? 'Мария'}
              </span>{' '}
              работает {overtimeEmployee?.totalHours ?? 42} часа (переработка).
              Рекомендуем сократить до 40. Саша свободен в среду —可以考虑 подмену.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
