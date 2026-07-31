'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  ShoppingBag,
  Ticket,
  MessageSquare,
  Calendar,
  Star,
  Crown,
  Flame,
  Coffee,
  Settings,
  Bell,
  Moon,
  ChevronRight,
  Gift,
  Heart,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const recentOrders = [
  {
    id: '1',
    items: 'Капучино × 2, Чизкейк',
    amount: '11 800₸',
    date: '15 янв 2025',
    status: 'Получен' as const,
  },
  {
    id: '2',
    items: 'Латте, Круассан',
    amount: '5 400₸',
    date: '12 янв 2025',
    status: 'Получен' as const,
  },
  {
    id: '3',
    items: 'Раф, Мокко × 2',
    amount: '12 800₸',
    date: '10 янв 2025',
    status: 'Активен' as const,
  },
];

const achievements = [
  {
    id: '1',
    icon: Coffee,
    title: 'Кофейный гурман',
    description: '10 различных видов кофе',
    color: 'from-amber-500/30 to-orange-600/20',
    iconColor: 'text-amber-400',
  },
  {
    id: '2',
    icon: Flame,
    title: '7 дней подряд',
    description: 'Покупки каждый день неделю',
    color: 'from-red-500/30 to-rose-600/20',
    iconColor: 'text-red-400',
  },
  {
    id: '3',
    icon: Heart,
    title: 'Любимец',
    description: '3 отзыва с рейтингом 5★',
    color: 'from-pink-500/30 to-fuchsia-600/20',
    iconColor: 'text-pink-400',
  },
];

const stats = [
  { icon: ShoppingBag, label: 'Покупки', value: '34' },
  { icon: Ticket, label: 'Купоны', value: '2' },
  { icon: MessageSquare, label: 'Отзывы', value: '8' },
  { icon: Calendar, label: 'Месяцы', value: '3' },
];

export function ClientProfileEnhanced() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const currentPoints = 2480;
  const targetPoints = 2500;
  const progressPercent = ((currentPoints / targetPoints) * 100).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-deep rounded-2xl p-6 relative overflow-hidden"
      >
        {/* Background gradient decoration */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-purple-600/30 via-violet-500/20 to-transparent pointer-events-none" />
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-4">
          {/* Animated Gradient Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-500 p-[3px] animate-[gradient-sweep_4s_ease-in-out_infinite] bg-[length:200%_100%]">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                <span className="text-2xl font-bold pulse-text-gradient">
                  А
                </span>
              </div>
            </div>
            {/* Online indicator */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-card" />
          </div>

          {/* Name & Phone */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold">Айдана</h2>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1 text-sm text-muted-foreground">
              <Phone className="w-3.5 h-3.5" />
              <span>+7 701 234 5678</span>
            </div>
          </div>

          {/* Level Badge */}
          <Badge className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/30 px-3 py-1">
            <Crown className="w-3.5 h-3.5 mr-1" />
            Серебро
          </Badge>
        </div>

        {/* Level Progress Bar */}
        <div className="relative mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              Серебро → <span className="text-amber-300 font-medium">Золото</span>
            </span>
            <span className="text-xs font-semibold text-foreground">
              {currentPoints.toLocaleString('ru')}/{targetPoints.toLocaleString('ru')} очков
            </span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-violet-400 to-amber-400 relative"
            >
              <div className="absolute inset-0 shimmer rounded-full" />
            </motion.div>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            До следующего уровня осталось <span className="text-amber-300 font-medium">{targetPoints - currentPoints} очков</span> ({progressPercent}%)
          </p>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.08 }}
            className="glass-card rounded-xl p-3.5 text-center card-hover"
          >
            <stat.icon className="w-5 h-5 mx-auto text-purple-400 mb-1.5" />
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Последние заказы</h3>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
            Все заказы
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Button>
        </div>

        <div className="glass-card rounded-xl overflow-hidden divide-y divide-border/40">
          {recentOrders.map((order, index) => (
            <div
              key={order.id}
              className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.02]"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{order.items}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {order.date}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold">{order.amount}</p>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-[10px] px-1.5 py-0 mt-1',
                    order.status === 'Получен'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                  )}
                >
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievement Badges */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Достижения</h3>
          <Badge variant="outline" className="text-xs text-purple-400 border-purple-500/30">
            <Star className="w-3 h-3 mr-1" />
            3 из 12
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {achievements.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.08 }}
              className={cn(
                'glass-card rounded-xl p-4 relative overflow-hidden card-hover',
              )}
            >
              {/* Gradient background */}
              <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none', badge.color)} />

              <div className="relative flex items-start gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0',
                )}>
                  <badge.icon className={cn('w-5 h-5', badge.iconColor)} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{badge.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{badge.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-base font-semibold">Настройки</h3>
        </div>

        <div className="glass-card rounded-xl overflow-hidden divide-y divide-border/40">
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Уведомления</p>
                <p className="text-xs text-muted-foreground">Push-уведомления об акциях</p>
              </div>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <Moon className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Тёмная тема</p>
                <p className="text-xs text-muted-foreground">Внешний вид приложения</p>
              </div>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>

          {/* Support Link */}
          <div className="flex items-center justify-between px-4 py-3.5 cursor-pointer transition-colors hover:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <Gift className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Поддержка</p>
                <p className="text-xs text-muted-foreground">Связаться с нами</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
