'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Brain,
  ChevronRight,
  Clock,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type InsightType = 'insight' | 'trend' | 'warning' | 'idea' | 'ai';
type FilterTab = 'all' | 'insight' | 'warning' | 'idea';

interface AIInsightItem {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  timestamp: string;
  action?: string;
}

const mockInsights: AIInsightItem[] = [
  {
    id: '1',
    type: 'insight',
    title: 'Пиковая нагрузка',
    description: 'Утренний трафик вырос на 23%. Рекомендуем добавить бариста с 8:00 до 10:00.',
    timestamp: '5 мин назад',
    action: 'Расписание',
  },
  {
    id: '2',
    type: 'trend',
    title: 'Тренд: Латте',
    description: 'Продажи латте выросли на 34% за неделю. Рассмотрите сезонное дополнение.',
    timestamp: '1 час назад',
    action: 'Подробнее',
  },
  {
    id: '3',
    type: 'warning',
    title: 'Предупреждение',
    description: 'Запас сиропа ванильного закончится через 2 дня.',
    timestamp: '2 часа назад',
    action: 'Заказать',
  },
  {
    id: '4',
    type: 'idea',
    title: 'Идея',
    description: 'Добавьте комбо "Кофе + Круассан" — AI прогнозирует +18% продаж.',
    timestamp: '3 часа назад',
    action: 'Создать акцию',
  },
  {
    id: '5',
    type: 'trend',
    title: 'Новые отзывы',
    description: '3 новых отзыва, средний рейтинг 4.8. Ответьте на все.',
    timestamp: '5 часов назад',
    action: 'Открыть',
  },
  {
    id: '6',
    type: 'ai',
    title: 'AI Аналитика',
    description: 'Ваши клиенты чаще покупают в интервале 15:00-17:00. Рекомендуем Happy Hour.',
    timestamp: '6 часов назад',
    action: 'Подробнее',
  },
];

const typeConfig: Record<
  InsightType,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
    label: string;
  }
> = {
  insight: {
    icon: Sparkles,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/15',
    borderColor: 'border-purple-500/20',
    label: 'Аналитика',
  },
  trend: {
    icon: TrendingUp,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/20',
    label: 'Тренд',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/15',
    borderColor: 'border-amber-500/20',
    label: 'Предупреждение',
  },
  idea: {
    icon: Lightbulb,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/15',
    borderColor: 'border-cyan-500/20',
    label: 'Идея',
  },
  ai: {
    icon: Brain,
    color: 'pulse-text-gradient',
    bgColor: 'bg-gradient-to-br from-purple-500/20 to-cyan-500/20',
    borderColor: 'border-purple-500/20',
    label: 'AI',
  },
};

const filterTabs: { key: FilterTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'all', label: 'Все', icon: Sparkles },
  { key: 'insight', label: 'Аналитика', icon: TrendingUp },
  { key: 'warning', label: 'Предупреждения', icon: AlertTriangle },
  { key: 'idea', label: 'Идеи', icon: Lightbulb },
];

function filterInsight(insight: AIInsightItem, tab: FilterTab): boolean {
  if (tab === 'all') return true;
  if (tab === 'insight') return insight.type === 'insight' || insight.type === 'ai';
  if (tab === 'warning') return insight.type === 'warning';
  if (tab === 'idea') return insight.type === 'idea';
  return true;
}

export function AIInsightsFeed() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filtered = mockInsights.filter((i) => filterInsight(i, activeTab));

  return (
    <div className="space-y-4">
      {/* Header with shimmer */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600/10 via-purple-500/5 to-cyan-500/10 border border-purple-500/15 p-4 sm:p-5">
        <div className="absolute inset-0 shimmer pointer-events-none" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Инсайты</h2>
              <p className="text-xs text-muted-foreground">
                {mockInsights.length} рекомендаций для бизнеса
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-purple-500/30 bg-purple-500/10 text-purple-400 text-[10px] font-semibold uppercase tracking-wider"
          >
            <Zap className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filterTabs.map((tab) => {
          const count =
            tab.key === 'all'
              ? mockInsights.length
              : mockInsights.filter((i) => filterInsight(i, tab.key)).length;
          return (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'shrink-0 text-xs',
                activeTab === tab.key
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : ''
              )}
            >
              <tab.icon className="w-3.5 h-3.5 mr-1.5" />
              {tab.label}
              <span className="ml-1.5 text-[10px] opacity-70">{count}</span>
            </Button>
          );
        })}
      </div>

      {/* Scrollable Feed */}
      <div className="max-h-[400px] overflow-y-auto space-y-2.5 pr-1">
        <AnimatePresence mode="popLayout">
          {filtered.map((insight, index) => {
            const config = typeConfig[insight.type];
            const IconComponent = config.icon;
            const isAI = insight.type === 'ai';

            return (
              <motion.div
                key={insight.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className={cn(
                  'glass-card rounded-xl p-4 transition-all duration-200 hover:bg-white/[0.03]',
                  config.borderColor,
                  isAI && 'ai-glow-card'
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                      config.bgColor
                    )}
                  >
                    <IconComponent
                      className={cn('w-4 h-4', config.color)}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title Row */}
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold truncate">
                        {insight.title}
                      </h4>
                      {insight.type === 'ai' && (
                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-purple-400" />
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                      {insight.description}
                    </p>

                    {/* Footer: timestamp + action */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                        <Clock className="w-3 h-3" />
                        {insight.timestamp}
                      </div>

                      {insight.action && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[10px] text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                        >
                          {insight.action}
                          <ChevronRight className="w-3 h-3 ml-0.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Нет инсайтов в этой категории
          </div>
        )}
      </div>
    </div>
  );
}
