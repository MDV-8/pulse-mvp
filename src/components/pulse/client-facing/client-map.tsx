'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock, Tag, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockNearbyPlaces } from '@/data/mock-data';

const pinPositions = [
  { id: 'np1', top: '35%', left: '48%', name: 'Coffee & Co' },
  { id: 'np2', top: '42%', left: '62%', name: 'Bean & Brew' },
  { id: 'np3', top: '55%', left: '35%', name: 'Pizza Milano' },
  { id: 'np4', top: '28%', left: '72%', name: 'Style Studio' },
  { id: 'np5', top: '65%', left: '55%', name: 'FitZone' },
  { id: 'np6', top: '45%', left: '25%', name: 'CityMart' },
  { id: 'np7', top: '72%', left: '40%', name: 'DryClean Pro' },
];

export default function ClientMap() {
  const [openOnly, setOpenOnly] = useState(false);
  const [activePin, setActivePin] = useState<string | null>(null);

  const filtered = mockNearbyPlaces.filter((p) => {
    return !openOnly || p.isOpen;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
            <Navigation className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Карта заведений рядом</h1>
            <p className="text-xs text-muted-foreground">Найдите лучшие предложения поблизости</p>
          </div>
        </div>
      </motion.div>

      {/* Open Now Toggle */}
      <div className="flex items-center justify-end gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm">Открыто сейчас</span>
        <Switch checked={openOnly} onCheckedChange={setOpenOnly} />
      </div>

      {/* Mock Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden p-0">
          <div className="relative w-full h-64 sm:h-80 bg-gradient-to-br from-slate-800 via-purple-900/40 to-slate-900 overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute left-0 right-0 border-t border-white/20"
                  style={{ top: `${(i + 1) * 10}%` }}
                />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute top-0 bottom-0 border-l border-white/20"
                  style={{ left: `${(i + 1) * 10}%` }}
                />
              ))}
            </div>

            {/* Center dot (You are here) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-lg shadow-purple-500/50" />
              <div className="absolute -inset-3 bg-purple-500/20 rounded-full animate-ping" />
            </div>

            {/* Location Pins */}
            {pinPositions
              .filter((pin) => {
                if (!openOnly) return true;
                const place = mockNearbyPlaces.find((p) => p.id === pin.id);
                return place?.isOpen;
              })
              .map((pin) => {
                const place = mockNearbyPlaces.find((p) => p.id === pin.id);
                const isActive = activePin === pin.id;
                return (
                  <motion.button
                    key={pin.id}
                    className={`absolute z-20 transform -translate-x-1/2 -translate-y-full transition-all ${
                      isActive ? 'scale-110' : 'hover:scale-105'
                    }`}
                    style={{ top: pin.top, left: pin.left }}
                    onClick={() => setActivePin(isActive ? null : pin.id)}
                  >
                    <div className="relative">
                      <MapPin
                        className={`w-6 h-6 ${
                          place?.isOpen
                            ? 'text-purple-400'
                            : 'text-muted-foreground/50'
                        }`}
                        fill={place?.isOpen ? '#8b5cf6' : 'none'}
                      />
                      {isActive && place && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className="absolute top-8 left-1/2 -translate-x-1/2 bg-popover border border-border rounded-lg p-2 shadow-xl whitespace-nowrap z-30"
                        >
                          <p className="text-xs font-semibold">{place.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {place.category} · {place.distance}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
          </div>
        </Card>
      </motion.div>

      {/* Compact Place List */}
      <ScrollArea className="max-h-[320px]">
        <div className="space-y-2">
          {filtered.map((place, i) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card
                className="cursor-pointer hover:border-purple-500/50 transition-colors p-0"
                onClick={() => setActivePin(activePin === place.id ? null : place.id)}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {place.name}
                      </span>
                      <Badge
                        variant={
                          place.isOpen ? 'default' : 'secondary'
                        }
                        className={`text-[10px] px-1.5 py-0 ${
                          place.isOpen
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}
                      >
                        {place.isOpen ? 'Открыто' : 'Закрыто'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{place.category}</span>
                      <span>{place.distance}</span>
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        {place.rating}
                      </span>
                    </div>
                  </div>
                  {place.promo && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 shrink-0">
                      <Tag className="w-3 h-3 text-purple-400" />
                      <span className="text-[10px] text-purple-300">
                        {place.promo}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
