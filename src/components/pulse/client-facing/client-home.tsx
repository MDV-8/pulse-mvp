'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, Clock, Tag, Sparkles, Coffee, UtensilsCrossed,
  Scissors, Dumbbell, ShoppingBag, Wrench, SearchX,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { mockNearbyPlaces } from '@/data/mock-data';
import { cn } from '@/lib/utils';

const categoryConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; gradient: string }> = {
  'Кофе': { icon: Coffee, gradient: 'from-amber-800/60 to-orange-900/40' },
  'Еда': { icon: UtensilsCrossed, gradient: 'from-red-800/60 to-rose-900/40' },
  'Красота': { icon: Scissors, gradient: 'from-pink-800/60 to-fuchsia-900/40' },
  'Фитнес': { icon: Dumbbell, gradient: 'from-cyan-800/60 to-blue-900/40' },
  'Магазины': { icon: ShoppingBag, gradient: 'from-emerald-800/60 to-green-900/40' },
  'Услуги': { icon: Wrench, gradient: 'from-yellow-800/60 to-amber-900/40' },
};

const categories = ['Все', 'Кофе', 'Еда', 'Красота', 'Фитнес', 'Магазины', 'Услуги'];

export default function ClientHome() {
  const [activeCategory, setActiveCategory] = useState('Все');
  const [openOnly, setOpenOnly] = useState(false);

  const filtered = mockNearbyPlaces.filter((p) => {
    const matchesCat =
      activeCategory === 'Все' ||
      (activeCategory === 'Кофе' && p.category === 'Кофейня') ||
      p.category === activeCategory;
    const matchesOpen = !openOnly || p.isOpen;
    return matchesCat && matchesOpen;
  });

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-transparent border border-purple-500/10 p-6 sm:p-8"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[60px]" />
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Что хотите <span className="pulse-text-gradient">сегодня</span>?
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Лучшие заведения и акции рядом с вами
          </p>
        </div>
      </motion.div>

      {/* Category Pills with Icons */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => {
          const config = cat !== 'Все' ? categoryConfig[cat] : null;
          const Icon = config?.icon || Sparkles;
          const isActive = activeCategory === cat;
          return (
            <Button
              key={cat}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'whitespace-nowrap gap-1.5 transition-all duration-200',
                isActive
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                  : 'hover:border-purple-500/30 hover:bg-purple-500/5'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat}
            </Button>
          );
        })}
      </div>

      {/* Open Now Toggle - More prominent */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
            openOnly ? 'bg-green-500/20' : 'bg-muted'
          )}>
            <Clock className={cn('w-4 h-4 transition-colors', openOnly ? 'text-green-400' : 'text-muted-foreground')} />
          </div>
          <div>
            <span className="text-sm font-medium">Открыто сейчас</span>
            <p className="text-xs text-muted-foreground">{openOnly ? `${filtered.length} заведений` : 'Все заведения'}</p>
          </div>
        </div>
        <Switch checked={openOnly} onCheckedChange={setOpenOnly} />
      </div>

      {/* Places Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory + openOnly}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((place, i) => {
                const catKey = Object.entries(categoryConfig).find(
                  ([, v]) => v.icon.displayName?.includes(place.category) ||
                    (place.category === 'Кофейня' && v.icon === Coffee) ||
                    (place.category === 'Еда' && v.icon === UtensilsCrossed)
                )?.[0] || 'Кофе';
                const config = categoryConfig[catKey] || categoryConfig['Кофе'];
                const PlaceIcon = config.icon;
                const stars = Math.floor(place.rating);
                const hasHalf = place.rating - stars >= 0.3;

                return (
                  <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="cursor-pointer hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 p-0 overflow-hidden group">
                      {/* Image placeholder with gradient + icon */}
                      <div className={cn(
                        'h-28 bg-gradient-to-br flex items-center justify-center relative overflow-hidden',
                        config.gradient
                      )}>
                        <div className="absolute inset-0 opacity-10"
                          style={{
                            backgroundImage: `radial-gradient(circle at 30% 40%, rgba(255,255,255,0.1) 0%, transparent 60%)`,
                          }}
                        />
                        <PlaceIcon className="w-10 h-10 text-white/30" />
                        {/* Status badge overlay */}
                        <div className="absolute top-2 right-2">
                          <Badge
                            className={cn(
                              'text-[10px] font-medium backdrop-blur-sm border-0',
                              place.isOpen
                                ? 'bg-green-500/80 text-white'
                                : 'bg-red-500/80 text-white'
                            )}
                          >
                            {place.isOpen ? 'Открыто' : 'Закрыто'}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate group-hover:text-purple-400 transition-colors">{place.name}</h3>
                            <Badge variant="outline" className="text-[10px] mt-1">
                              {place.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                            <MapPin className="w-3 h-3 text-purple-400/60" />
                            {place.distance}
                          </div>
                        </div>

                        {/* Star Rating */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, si) => (
                              <Star
                                key={si}
                                className={cn(
                                  'w-3.5 h-3.5',
                                  si < stars
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : si === stars && hasHalf
                                      ? 'text-yellow-400 fill-yellow-400/50'
                                      : 'text-muted-foreground/20'
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold">{place.rating}</span>
                        </div>

                        {/* Promo Tag */}
                        {place.promo && (
                          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <Tag className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span className="text-xs text-purple-300 font-medium">
                              {place.promo}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <SearchX className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-lg font-medium text-muted-foreground">Ничего не найдено</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Попробуйте изменить фильтры или отключить «Открыто сейчас»
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => { setActiveCategory('Все'); setOpenOnly(false); }}
              >
                Сбросить фильтры
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
