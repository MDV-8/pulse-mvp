'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Share2, Download, Printer, MapPin, Star, Sparkles } from 'lucide-react';

// --- Decorative CSS QR Pattern (5x5) ---
const QR_PATTERN = [
  [1, 1, 0, 1, 1],
  [1, 0, 1, 0, 1],
  [0, 1, 1, 1, 0],
  [1, 0, 1, 0, 1],
  [1, 1, 0, 1, 1],
];

function DecorativeQR() {
  return (
    <div className="relative">
      {/* QR grid */}
      <div className="grid grid-cols-5 gap-1.5 w-24 h-24">
        {QR_PATTERN.flat().map((filled, i) => (
          <motion.div
            key={i}
            className={`rounded-sm ${
              filled
                ? 'bg-purple-500'
                : 'bg-purple-500/15'
            }`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.4 + i * 0.04,
              type: 'spring',
              stiffness: 400,
              damping: 20,
            }}
          />
        ))}
      </div>

      {/* Center pulse dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="inline-block h-2 w-2 rounded-full bg-purple-400 pulse-dot" />
      </div>
    </div>
  );
}

// --- Share Button ---
function ShareButton({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <motion.button
      className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card/60 backdrop-blur-sm px-4 py-3 transition-all hover:border-purple-500/20 hover:bg-purple-500/5 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      <Icon className="size-4 text-purple-400" />
      <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
    </motion.button>
  );
}

// --- Main Component ---
export function QRBusinessCard() {
  return (
    <motion.div
      className="glass-card-premium aurora-border rounded-2xl p-4 md:p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15">
          <QrCode className="size-4 text-purple-400" />
        </div>
        <h3 className="text-base font-semibold text-gradient-animate">Ваша визитка</h3>
      </div>

      {/* Business card preview mockup */}
      <motion.div
        className="rounded-2xl overflow-hidden shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed, #a78bfa)',
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="p-5 text-white">
          {/* Business name */}
          <h4 className="text-xl font-bold tracking-tight">Coffee & Co</h4>
          <p className="text-sm text-white/70 mt-0.5">Кофейня</p>

          {/* Address */}
          <div className="flex items-center gap-1.5 mt-3">
            <MapPin className="size-3.5 text-white/60" />
            <span className="text-sm text-white/80">ул. Абай 45, Алматы</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <Star className="size-4 text-amber-300 fill-amber-300" />
            <span className="text-sm font-semibold">4.8</span>
            <span className="text-xs text-white/60">(248 отзывов)</span>
          </div>

          {/* Promo badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white/15 backdrop-blur-sm px-3 py-1.5">
            <Sparkles className="size-3.5 text-amber-300" />
            <span className="text-xs font-semibold text-white/90">-15% на первый заказ</span>
          </div>
        </div>
      </motion.div>

      {/* QR Code section */}
      <div className="mt-5 flex flex-col items-center">
        <p className="text-xs text-muted-foreground font-medium mb-3">QR-код для клиентов</p>
        <DecorativeQR />
      </div>

      {/* Share buttons row */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <ShareButton icon={Share2} label="Поделиться" />
        <ShareButton icon={Download} label="Сохранить" />
        <ShareButton icon={Printer} label="Распечатать" />
      </div>

      {/* Subtext */}
      <p className="mt-4 text-center text-xs text-muted-foreground/60 leading-relaxed">
        Поделитесь с клиентами для получения бонусов
      </p>
    </motion.div>
  );
}
