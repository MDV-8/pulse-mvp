'use client';

import { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const mockReviews = [
  {
    id: '1',
    name: 'Айгерим Нурланова',
    initials: 'АН',
    avatarColor: 'bg-purple-500/30 text-purple-300',
    date: '12 янв 2025',
    rating: 5,
    text: 'Отличная кофейня! Капучино просто невероятный, а персонал всегда приветливый. Стала постоянной клиенткой.',
    platform: 'Google' as const,
    status: 'replied' as const,
  },
  {
    id: '2',
    name: 'Дмитрий Соколов',
    initials: 'ДС',
    avatarColor: 'bg-blue-500/30 text-blue-300',
    date: '11 янв 2025',
    rating: 4,
    text: 'Хороший кофе и уютная атмосфера. Единственный минус — иногда приходится долго ждать в час пик.',
    platform: '2GIS' as const,
    status: 'new' as const,
  },
  {
    id: '3',
    name: 'Мария Ким',
    initials: 'МК',
    avatarColor: 'bg-pink-500/30 text-pink-300',
    date: '10 янв 2025',
    rating: 5,
    text: 'Лучший раф в городе! Десерты тоже на высоте. Очень рекомендую.',
    platform: 'Instagram' as const,
    status: 'replied' as const,
  },
  {
    id: '4',
    name: 'Арман Оспанов',
    initials: 'АО',
    avatarColor: 'bg-emerald-500/30 text-emerald-300',
    date: '9 янв 2025',
    rating: 3,
    text: 'Кофе нормальный, но цены немного завышены по сравнению с конкурентами. Порции могли бы быть больше.',
    platform: 'Google' as const,
    status: 'new' as const,
  },
  {
    id: '5',
    name: 'Елена Волкова',
    initials: 'ЕВ',
    avatarColor: 'bg-amber-500/30 text-amber-300',
    date: '8 янв 2025',
    rating: 5,
    text: 'Люблю приходить сюда каждое утро! Бариста всегда помнит мой заказ. Это потрясающий сервис!',
    platform: 'Instagram' as const,
    status: 'new' as const,
  },
  {
    id: '6',
    name: 'Тимур Жакупов',
    initials: 'ТЖ',
    avatarColor: 'bg-cyan-500/30 text-cyan-300',
    date: '7 янв 2025',
    rating: 2,
    text: 'Ждал 20 минут свой заказ, хотя в зале было мало людей. Кофе подали холодным. Очень разочарован.',
    platform: '2GIS' as const,
    status: 'new' as const,
  },
];

type RatingFilter = 'all' | 5 | 4 | 3 | 'negative';

const platformConfig = {
  Google: { color: 'bg-red-500/15 text-red-400 border-red-500/25', icon: 'G' },
  Instagram: { color: 'bg-pink-500/15 text-pink-400 border-pink-500/25', icon: 'IG' },
  '2GIS': { color: 'bg-green-500/15 text-green-400 border-green-500/25', icon: '2G' },
};

const statusConfig = {
  new: { label: 'Новый', color: 'bg-purple-500/15 text-purple-400 border-purple-500/25' },
  replied: { label: 'Ответ отправлен', color: 'bg-green-500/15 text-green-400 border-green-500/25' },
};

export function ReviewsManager() {
  const [activeFilter, setActiveFilter] = useState<RatingFilter>('all');

  const filters: { key: RatingFilter; label: string }[] = [
    { key: 'all', label: 'Все' },
    { key: 5, label: '5⭐' },
    { key: 4, label: '4⭐' },
    { key: 3, label: '3⭐' },
    { key: 'negative', label: 'Negative' },
  ];

  const filteredReviews = mockReviews.filter((r) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'negative') return r.rating <= 2;
    return r.rating === activeFilter;
  });

  const newCount = mockReviews.filter((r) => r.status === 'new').length;
  const unrepliedCount = mockReviews.filter((r) => r.status !== 'replied').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
            <MessageSquare className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Отзывы клиентов</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">4.7</span>
              </div>
              <span className="text-sm text-muted-foreground">248 отзывов</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-muted-foreground">Средний рейтинг</span>
            <span className="font-bold pulse-text-gradient text-lg">4.7</span>
          </div>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-muted-foreground">Новых:</span>
            <span className="font-semibold text-purple-400">3</span>
          </div>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-muted-foreground">Без ответа:</span>
            <span className="font-semibold text-amber-400">{unrepliedCount}</span>
          </div>
        </div>
      </div>

      {/* Tab Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <Button
            key={f.key}
            variant={activeFilter === f.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(f.key)}
            className={
              activeFilter === f.key
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : ''
            }
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
        {filteredReviews.map((review) => {
          const platform = platformConfig[review.platform];
          const status = statusConfig[review.status];

          return (
            <div
              key={review.id}
              className="glass-card rounded-xl p-4 card-hover"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${review.avatarColor}`}
                >
                  {review.initials}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Top Row: Name + Date + Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-semibold text-sm">{review.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {review.date}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${platform.color}`}
                    >
                      {platform.icon}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${status.color}`}
                    >
                      {status.label}
                    </Badge>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.text}
                  </p>

                  {/* Reply Button */}
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs text-purple-400 border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-300"
                    >
                      Ответить
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
