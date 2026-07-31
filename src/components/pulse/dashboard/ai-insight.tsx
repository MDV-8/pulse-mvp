'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronRight, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function InsightIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case 'warning':
      return <AlertTriangle className={className} />;
    case 'opportunity':
      return <TrendingUp className={className} />;
    case 'info':
      return <Users className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

export function AIInsight() {
  const insights = useAppStore((s) => s.insights);
  const setShowCreatePromotion = useAppStore((s) => s.setShowCreatePromotion);
  const setPromotionFromInsight = useAppStore((s) => s.setPromotionFromInsight);
  const setShowReturnClients = useAppStore((s) => s.setShowReturnClients);

  const mainInsight = insights[0];
  const secondaryInsights = insights.slice(1);

  if (!mainInsight) return null;

  const handleApplyInsight = () => {
    if (mainInsight.action === 'create_promotion') {
      setPromotionFromInsight('happy-hour');
      setShowCreatePromotion(true);
    } else if (mainInsight.action === 'return_clients') {
      setShowReturnClients(true);
    }
  };

  return (
    <div className="space-y-3">
      {/* Main insight card */}
      <motion.div
        className="relative rounded-xl border border-primary/20 bg-card p-4 sm:p-5 overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Subtle purple glow */}
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

        {/* Badge */}
        <Badge
          variant="outline"
          className="mb-3 border-primary/30 bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider"
        >
          <Sparkles className="mr-1 size-3" />
          AI Insight
        </Badge>

        {/* Icon + Title */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <div className="relative">
              <InsightIcon type={mainInsight.type} className="size-5 text-amber-400" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground leading-snug">
              {mainInsight.title}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              {mainInsight.description}
            </p>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-3 ml-8 rounded-lg bg-background/50 p-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">Рекомендация: </span>
            {mainInsight.recommendation}
          </p>
        </div>

        {/* Expected effect */}
        {mainInsight.expectedEffect && (
          <p className="mt-2 ml-8 text-xs text-muted-foreground/60">
            {mainInsight.expectedEffect}
          </p>
        )}

        {/* Action button */}
        <div className="mt-4 ml-8">
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs"
            onClick={handleApplyInsight}
          >
            ПРИМЕНИТЬ
            <ChevronRight className="ml-1 size-3.5" />
          </Button>
        </div>
      </motion.div>

      {/* Secondary insight cards */}
      {secondaryInsights.length > 0 && (
        <div className="space-y-2">
          {secondaryInsights.map((insight, index) => (
            <motion.div
              key={insight.id}
              className="group flex items-start gap-3 rounded-lg border border-border bg-card p-3 cursor-pointer transition-all duration-200 hover:border-primary/20 hover:bg-accent/50"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            >
              <InsightIcon type={insight.type} className="mt-0.5 size-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {insight.title}
                </h4>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                  {insight.description}
                </p>
              </div>
              <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
