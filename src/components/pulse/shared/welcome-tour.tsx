'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOUR_STEPS = [
  {
    emoji: '❤️',
    title: 'PULSE SCORE',
    description: 'Здесь отображается общее состояние вашего бизнеса',
  },
  {
    emoji: '🧠',
    title: 'AI INSIGHT',
    description: 'AI находит проблемы и предлагает решения',
  },
  {
    emoji: '✅',
    title: 'Что делать',
    description: 'Приоритетные действия на сегодня',
  },
];

export function WelcomeTour() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('pulse-tour-completed');
    if (!completed) {
      // Small delay so the dashboard renders first
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('pulse-tour-completed', 'true');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleDismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Tour Card */}
          <motion.div
            className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-card/95 backdrop-blur-xl p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ delay: 0.1, duration: 0.35, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="text-center mb-5">
              <h2 className="text-xl font-bold">
                Добро пожаловать в PULSE! 👋
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Давайте познакомим вас с главным экраном
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3 mb-6">
              {TOUR_STEPS.map((step, i) => (
                <motion.div
                  key={step.title}
                  className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/5 p-3"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <span className="text-lg leading-none mt-0.5">{step.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{step.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Понятно!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
