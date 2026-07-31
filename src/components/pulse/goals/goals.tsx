'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Plus, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  mockGoals,
  type BusinessGoal,
} from '@/data/mock-data';

const statusConfig = {
  on_track: { label: 'На пути', color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20', icon: CheckCircle2 },
  behind: { label: 'Отстаём', color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20', icon: TrendingDown },
  ahead: { label: 'Опережаем', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20', icon: TrendingUp },
};

interface LocalGoal extends BusinessGoal {
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  plan: { month: number; target: number; actual?: number }[];
  status: 'on_track' | 'behind' | 'ahead';
}

export default function Goals() {
  const [goals, setGoals] = useState<LocalGoal[]>(mockGoals);
  const [showDialog, setShowDialog] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formTarget, setFormTarget] = useState('');
  const [formUnit, setFormUnit] = useState('');
  const [formDeadline, setFormDeadline] = useState('');

  const addGoal = () => {
    if (!formTitle.trim() || !formTarget) return;
    const newGoal: LocalGoal = {
      id: `g-${Date.now()}`,
      title: formTitle,
      targetValue: parseFloat(formTarget) || 0,
      currentValue: 0,
      unit: formUnit || 'шт',
      deadline: formDeadline || '2025-12-31',
      plan: [],
      status: 'on_track',
    };
    setGoals((prev) => [...prev, newGoal]);
    setShowDialog(false);
    setFormTitle('');
    setFormTarget('');
    setFormUnit('');
    setFormDeadline('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold">Цели</h1>
        </div>
        <Button
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white border-glow"
          onClick={() => setShowDialog(true)}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Поставить цель
        </Button>
      </motion.div>

      {/* Neon Line Separator */}
      <div className="neon-line" />

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal, i) => {
          const cfg = statusConfig[goal.status];
          const percent = goal.targetValue > 0
            ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
            : 0;
          const StatusIcon = cfg.icon;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className={`border ${cfg.borderColor} ${cfg.bgColor} card-hover-lift`}>
                <CardContent className="p-4 space-y-4">
                  {/* Title + Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{goal.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Дедлайн: {goal.deadline}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${cfg.color} ${cfg.borderColor}`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {cfg.label}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                      <span className={`${cfg.color} stat-glow-purple`}>{percent}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-purple-400 transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Monthly Plan */}
                  {goal.plan.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Месячный план</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {goal.plan.map((m) => {
                          const mPercent = m.target > 0 ? Math.min(100, Math.round(((m.actual ?? 0) / m.target) * 100)) : 0;
                          return (
                            <div
                              key={m.month}
                              className="p-2 rounded-lg bg-background/50 border border-border/30 text-center space-y-1"
                            >
                              <p className="text-[10px] text-muted-foreground">Месяц {m.month}</p>
                              <div className="relative h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`absolute left-0 top-0 h-full rounded-full transition-all ${
                                    mPercent >= 100
                                      ? 'bg-green-500'
                                      : mPercent >= 70
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                  }`}
                                  style={{ width: `${mPercent}%` }}
                                />
                              </div>
                              <p className="text-[10px]">
                                <span className="text-foreground font-medium">
                                  {m.actual ?? '–'}
                                </span>
                                <span className="text-muted-foreground"> / {m.target}</span>
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* AI Message for behind goals */}
                  {goal.status === 'behind' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-red-300">
                          Текущий темп ниже необходимого. Рекомендуем увеличить повторные покупки.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Add Goal Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Поставить цель</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Название цели</label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Например: Увеличить продажи на 20%"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Целевое значение</label>
                <Input
                  value={formTarget}
                  onChange={(e) => setFormTarget(e.target.value)}
                  placeholder="20"
                  type="number"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Единица</label>
                <Input
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                  placeholder="%"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Дедлайн</label>
              <Input
                value={formDeadline}
                onChange={(e) => setFormDeadline(e.target.value)}
                placeholder="2025-06-30"
                type="date"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Отмена</Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={addGoal}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
