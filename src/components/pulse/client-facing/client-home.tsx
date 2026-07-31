'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock, Tag, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { mockNearbyPlaces } from '@/data/mock-data';

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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-1"
      >
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            PULSE
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Найдите лучшие предложения рядом
        </p>
      </motion.div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            className={
              activeCategory === cat
                ? 'bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap'
                : 'whitespace-nowrap'
            }
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Open Now Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">Открыто сейчас</span>
        </div>
        <Switch checked={openOnly} onCheckedChange={setOpenOnly} />
      </div>

      {/* Places Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((place, i) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="cursor-pointer hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/5 p-0 overflow-hidden">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{place.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {place.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {place.distance}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={place.isOpen ? 'default' : 'secondary'}
                    className={
                      place.isOpen
                        ? 'bg-green-500/20 text-green-400 border-green-500/30 text-xs'
                        : 'bg-red-500/20 text-red-400 border-red-500/30 text-xs'
                    }
                  >
                    {place.isOpen ? 'Открыто' : 'Закрыто'}
                  </Badge>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star
                        key={si}
                        className={`w-3.5 h-3.5 ${
                          si < Math.floor(place.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-muted-foreground/30'
                        }`
                      }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{place.rating}</span>
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
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <MapPin className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p>Нет заведений по выбранному фильтру</p>
        </div>
      )}
    </div>
  );
}
