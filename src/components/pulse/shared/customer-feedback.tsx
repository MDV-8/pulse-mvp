'use client';

import { motion } from 'framer-motion';
import { Star, Brain, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ratingDistribution = [
  { stars: 5, percentage: 45, count: 67 },
  { stars: 4, percentage: 30, count: 45 },
  { stars: 3, percentage: 15, count: 22 },
  { stars: 2, percentage: 7, count: 10 },
  { stars: 1, percentage: 3, count: 5 },
];

const recentReviews = [
  {
    name: 'Айдана',
    initials: 'А',
    rating: 5,
    text: 'Отличный латте! Обязательно вернусь снова',
    date: '2 дня назад',
  },
  {
    name: 'Дмитрий',
    initials: 'Д',
    rating: 4,
    text: 'Хороший кофе, но обслуживание могло быть быстрее',
    date: '3 дня назад',
  },
  {
    name: 'Мария',
    initials: 'М',
    rating: 5,
    text: 'Люблю это место! Лучший капучино в городе',
    date: '5 дней назад',
  },
];

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = star <= Math.floor(rating);
        const isPartial = star === Math.ceil(rating) && rating % 1 !== 0;
        return (
          <div key={star} className="relative" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="text-zinc-600 fill-zinc-600"
              strokeWidth={1.5}
            />
            {isFull && (
              <Star
                size={size}
                className="absolute inset-0 text-amber-400 fill-amber-400"
                strokeWidth={1.5}
              />
            )}
            {isPartial && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
                <Star
                  size={size}
                  className="text-amber-400 fill-amber-400"
                  strokeWidth={1.5}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function getBarColor(stars: number) {
  if (stars >= 4) return 'bg-amber-500';
  if (stars === 3) return 'bg-amber-500/60';
  return 'bg-zinc-500';
}

export function CustomerFeedback() {
  return (
    <div className="glass-card-premium rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <Star size={18} className="text-amber-400 fill-amber-400" />
          <h3 className="text-sm font-semibold text-foreground">Отзывы клиентов</h3>
          <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/20 text-xs font-medium px-2 py-0">
            4.8 из 5
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
        >
          Все отзывы
          <ChevronRight size={14} className="ml-0.5" />
        </Button>
      </div>

      {/* Overall Rating */}
      <div className="flex items-end gap-3 mb-5">
        <span className="text-4xl font-bold number-glow text-foreground">4.8</span>
        <div className="flex flex-col gap-1 pb-1">
          <StarRating rating={4.8} size={18} />
          <span className="text-xs text-muted-foreground">149 отзывов</span>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2 mb-6">
        {ratingDistribution.map((item, index) => (
          <motion.div
            key={item.stars}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: index * 0.07 }}
            className="flex items-center gap-2.5"
          >
            <span className="text-xs text-muted-foreground w-6 text-right shrink-0">
              {item.stars}★
            </span>
            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${getBarColor(item.stars)}`}
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.6, delay: index * 0.07, ease: 'easeOut' }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-8 text-right shrink-0">
              {item.percentage}%
            </span>
            <span className="text-xs text-zinc-500 w-7 text-right shrink-0">
              {item.count}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Recent Reviews */}
      <div className="space-y-3 mb-5">
        {recentReviews.map((review, index) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.08 }}
            className="card-hover-lift rounded-lg border border-white/5 bg-white/[0.03] p-3.5 cursor-default"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-purple-400">
                  {review.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {review.name}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">
                    {review.date}
                  </span>
                </div>
                <div className="mb-1.5">
                  <StarRating rating={review.rating} size={12} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {review.text}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Insight Box */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.65 }}
        className="rounded-lg p-3.5"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.08))',
          border: '1px solid rgba(139, 92, 246, 0.15)',
        }}
      >
        <div className="flex items-start gap-2.5">
          <Brain size={16} className="text-purple-400 mt-0.5 shrink-0" />
          <p className="text-xs text-purple-200/90 leading-relaxed">
            <span className="font-semibold text-purple-300">AI рекомендует:</span>{' '}
            Ответить на 2 новых отзыва для повышения рейтинга
          </p>
        </div>
      </motion.div>
    </div>
  );
}
