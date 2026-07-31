'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee,
  UtensilsCrossed,
  ShoppingBag,
  Scissors,
  Dumbbell,
  Wrench,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const TOTAL_STEPS = 5;

const categories = [
  { label: 'Кофейня', icon: Coffee, id: 'coffee', gradient: 'from-amber-900/40 to-orange-900/20' },
  { label: 'Ресторан', icon: UtensilsCrossed, id: 'restaurant', gradient: 'from-red-900/40 to-rose-900/20' },
  { label: 'Магазин', icon: ShoppingBag, id: 'shop', gradient: 'from-emerald-900/40 to-green-900/20' },
  { label: 'Салон красоты', icon: Scissors, id: 'beauty', gradient: 'from-pink-900/40 to-fuchsia-900/20' },
  { label: 'Фитнес', icon: Dumbbell, id: 'fitness', gradient: 'from-cyan-900/40 to-blue-900/20' },
  { label: 'Услуги', icon: Wrench, id: 'services', gradient: 'from-yellow-900/40 to-amber-900/20' },
  { label: 'Другое', icon: HelpCircle, id: 'other', gradient: 'from-purple-900/40 to-violet-900/20' },
];

const cities = ['Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе', 'Тараз', 'Павлодар'];

const sizeOptions = [
  { label: '1–5 сотрудников', id: 'small' },
  { label: '6–15 сотрудников', id: 'medium' },
  { label: '16+ сотрудников', id: 'large' },
];

const goalOptions = [
  { label: 'Больше клиентов', id: 'more_clients' },
  { label: 'Увеличить прибыль', id: 'more_profit' },
  { label: 'Вернуть клиентов', id: 'return_clients' },
  { label: 'Улучшить маркетинг', id: 'better_marketing' },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export function OnboardingFlow() {
  const setAppMode = useAppStore((s) => s.setAppMode);
  const setBusiness = useAppStore((s) => s.setBusiness);
  const onboardingStep = useAppStore((s) => s.onboardingStep);
  const setOnboardingStep = useAppStore((s) => s.setOnboardingStep);

  const [step, setStep] = useState(onboardingStep);
  const [direction, setDirection] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const goToNext = () => {
    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep(step + 1);
      setOnboardingStep(step + 1);
    }
  };

  const goToPrev = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
      setOnboardingStep(step - 1);
    }
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((g) => g !== goalId)
        : [...prev, goalId]
    );
  };

  const handleComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
      setShowSuccess(true);
      setTimeout(() => {
        const categoryObj = categories.find((c) => c.id === selectedCategory);
        const sizeObj = sizeOptions.find((s) => s.id === selectedSize);
        const goalLabels = goalOptions
          .filter((g) => selectedGoals.includes(g.id))
          .map((g) => g.label);

        setBusiness({
          name: businessName || 'Мой бизнес',
          category: categoryObj?.label || 'Другое',
          city: city || 'Алматы',
          size: sizeObj?.label || 'малый (1-5 сотрудников)',
          goals: goalLabels.length > 0 ? goalLabels : ['Больше клиентов'],
          createdAt: new Date().toISOString().split('T')[0],
        });
        setAppMode('owner');
      }, 1200);
    }, 300);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return businessName.trim().length > 0;
      case 2:
        return selectedCategory !== null;
      case 3:
        return city.trim().length > 0;
      case 4:
        return selectedSize !== null;
      case 5:
        return selectedGoals.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.08)_0%,_transparent_70%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[120px] animate-pulse" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* PULSE Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold pulse-text-gradient tracking-tight">PULSE</h1>
          <p className="text-xs text-muted-foreground/60 mt-1 tracking-widest uppercase">AI Operating System</p>
        </div>

        {/* Progress dots - purple, active larger/brighter */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  'rounded-full transition-all duration-500 ease-out',
                  s === step
                    ? 'w-6 h-6 bg-purple-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]'
                    : s < step
                      ? 'w-3 h-3 bg-purple-500/60'
                      : 'w-2.5 h-2.5 bg-muted-foreground/20'
                )}
              />
              {s < TOTAL_STEPS && (
                <div
                  className={cn(
                    'w-6 h-0.5 mx-0.5 transition-all duration-500',
                    s < step ? 'bg-purple-500/40' : 'bg-muted-foreground/10'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card container */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-6 sm:p-8 pulse-glow">
          {/* Success animation overlay */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/95 backdrop-blur-xl rounded-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mb-4"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
                  >
                    <Check className="w-10 h-10 text-purple-400" strokeWidth={3} />
                  </motion.div>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl font-bold pulse-text-gradient"
                >
                  PULSE готов
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-sm text-muted-foreground mt-1"
                >
                  Загружаем ваш дашборд...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                      Добро пожаловать в{' '}
                      <span className="pulse-text-gradient">PULSE</span>
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Давайте настроим ваш бизнес за 1 минуту
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Название бизнеса
                    </label>
                    <Input
                      placeholder="Например, Coffee & Co"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="h-12 bg-background border-input text-foreground placeholder:text-muted-foreground/50"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && canProceed()) goToNext();
                      }}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      Чем вы занимаетесь?
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Выберите категорию вашего бизнеса
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={cn(
                            'flex flex-col items-center gap-2.5 rounded-xl border p-4 transition-all duration-300 cursor-pointer group',
                            isSelected
                              ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                              : 'border-border bg-background text-muted-foreground hover:border-purple-500/30 hover:bg-accent hover:shadow-[0_0_15px_rgba(139,92,246,0.08)]'
                          )}
                        >
                          <div className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300',
                            isSelected
                              ? 'bg-purple-500/20'
                              : `bg-gradient-to-br ${cat.gradient}`
                          )}>
                            <Icon className={cn('size-5 transition-colors', isSelected ? 'text-purple-400' : 'text-muted-foreground group-hover:text-foreground')} />
                          </div>
                          <span className="text-xs font-medium">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      Где находится ваш бизнес?
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Укажите город для локальной аналитики
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Введите ваш город"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-12 bg-background border-input text-foreground placeholder:text-muted-foreground/50"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && canProceed()) goToNext();
                      }}
                    />
                    <div className="flex flex-wrap gap-2 mt-3">
                      {cities.map((c) => (
                        <button
                          key={c}
                          onClick={() => setCity(c)}
                          className={cn(
                            'rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer',
                            city === c
                              ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.15)]'
                              : 'border-border text-muted-foreground hover:border-purple-500/30 hover:text-foreground'
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      Сколько у вас сотрудников?
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Это поможет настроить рекомендации под масштаб
                    </p>
                  </div>
                  <div className="space-y-3">
                    {sizeOptions.map((opt) => {
                      const isSelected = selectedSize === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedSize(opt.id)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-xl border p-4 transition-all duration-200 cursor-pointer',
                            isSelected
                              ? 'border-purple-500 bg-purple-500/10'
                              : 'border-border bg-background hover:border-purple-500/30 hover:bg-accent'
                          )}
                        >
                          <div
                            className={cn(
                              'h-4 w-4 rounded-full border-2 transition-all duration-200',
                              isSelected
                                ? 'border-purple-500 bg-purple-500'
                                : 'border-muted-foreground/40'
                            )}
                          >
                            {isSelected && (
                              <div className="h-full w-full rounded-full bg-purple-500-foreground/20 flex items-center justify-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                              </div>
                            )}
                          </div>
                          <span
                            className={cn(
                              'text-sm font-medium',
                              isSelected ? 'text-purple-400' : 'text-foreground'
                            )}
                          >
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      Что для вас важнее всего?
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Можно выбрать несколько вариантов
                    </p>
                  </div>
                  <div className="space-y-3">
                    {goalOptions.map((goal) => {
                      const isChecked = selectedGoals.includes(goal.id);
                      return (
                        <button
                          key={goal.id}
                          onClick={() => toggleGoal(goal.id)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-xl border p-4 transition-all duration-200 cursor-pointer',
                            isChecked
                              ? 'border-purple-500 bg-purple-500/10'
                              : 'border-border bg-background hover:border-purple-500/30 hover:bg-accent'
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-4 w-4 items-center justify-center rounded border-2 transition-all duration-200',
                              isChecked
                                ? 'border-purple-500 bg-purple-500'
                                : 'border-muted-foreground/40'
                            )}
                          >
                            {isChecked && (
                              <svg
                                className="h-2.5 w-2.5 text-white"
                                viewBox="0 0 12 12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <path d="M2 6l3 3 5-5" />
                              </svg>
                            )}
                          </div>
                          <span
                            className={cn(
                              'text-sm font-medium',
                              isChecked ? 'text-purple-400' : 'text-foreground'
                            )}
                          >
                            {goal.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrev}
                className="gap-1.5 text-muted-foreground"
              >
                <ArrowLeft className="size-4" />
                Назад
              </Button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <Button
                onClick={goToNext}
                disabled={!canProceed()}
                className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-shadow hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
              >
                Далее
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed() || isCompleting}
                className="gap-1.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-shadow hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]"
              >
                <span className="font-bold">
                  PULSE готов
                </span>
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Step indicator text */}
        <p className="text-center text-xs text-muted-foreground/50 mt-4">
          Шаг {step} из {TOTAL_STEPS}
        </p>
      </div>
    </div>
  );
}
