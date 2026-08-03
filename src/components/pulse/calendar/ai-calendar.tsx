'use client';

import { motion } from 'framer-motion';
import {
  Calendar, Sparkles, AlertTriangle, TrendingUp, Gift, PartyPopper,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const monthDays = [
  // February 2025 (mock month)
  '', '', '', '', '', 1, 2,
  3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23,
  24, 25, 26, 27, 28,
];

const calendarEvents: Record<number, { type: 'demand' | 'holiday' | 'season'; text: string }> = {
  5: { type: 'demand', text: 'Через 3 дня ожидается высокий спрос — пополните запас' },
  8: { type: 'holiday', text: 'Праздник: 8 марта — увеличьте персонал' },
  14: { type: 'season', text: 'Сезонный тренд: рост спроса на горячие напитки' },
  21: { type: 'demand', text: 'Прогнозируемое снижение потока — запустите акцию' },
};

const predictions = [
  {
    id: 'p1',
    icon: AlertTriangle,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    text: 'Вторник–среда: ожидается рост спроса на 15% по сравнению с прошлой неделей',
  },
  {
    id: 'p2',
    icon: PartyPopper,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    text: '8 марта: рекомендуется увеличить запас на 40% и нанять 1 доп. сотрудника',
  },
  {
    id: 'p3',
    icon: TrendingUp,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    text: 'Вторая половина месяца: сезонный тренд на горячие напитки (+20%)',
  },
  {
    id: 'p4',
    icon: Gift,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    text: 'Конец февраля: оптимальное время для акции «Приведи друга»',
  },
];

const eventDotColors: Record<string, string> = {
  demand: 'bg-yellow-400',
  holiday: 'bg-pink-400',
  season: 'bg-green-400',
};

export default function AICalendar() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
          <Calendar className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">AI Календарь</h1>
            <Badge variant="outline" className="text-[10px] text-purple-400 border-purple-500/30 bg-purple-500/10">
              ROADMAP
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Февраль 2025</p>
        </div>
      </motion.div>

      {/* Calendar Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-1">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
              {monthDays.map((day, i) => {
                const hasEvent = day && calendarEvents[day];
                return (
                  <div
                    key={i}
                    className={`relative flex flex-col items-center justify-center py-2 rounded-lg text-sm transition-colors ${
                      day
                        ? hasEvent
                          ? 'bg-purple-500/10 text-foreground'
                          : 'hover:bg-muted/50 text-foreground'
                        : ''
                    }`}
                  >
                    {day && <span>{day}</span>}
                    {hasEvent && (
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-0.5 ${eventDotColors[hasEvent.type]}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Events Legend */}
            <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                Спрос
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-pink-400" />
                Праздник
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                Сезон
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Calendar Events */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">События месяца</h2>
        {Object.entries(calendarEvents).map(([day, event], i) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
          >
            <Card className="p-0">
              <CardContent className="p-3 flex items-start gap-3">
                <div className="text-center shrink-0">
                  <span className="text-lg font-bold">{day}</span>
                  <p className="text-[10px] text-muted-foreground">фев</p>
                </div>
                <div className={`w-px self-stretch ${eventDotColors[event.type].replace('bg-', 'bg-')}/30`} />
                <p className="text-sm">{event.text}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <CardTitle className="text-base">Прогноз на следующую неделю</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predictions.map((pred, i) => (
                <motion.div
                  key={pred.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className={`p-1.5 rounded-md ${pred.bgColor} mt-0.5`}>
                    <pred.icon className={`w-4 h-4 ${pred.color}`} />
                  </div>
                  <p className="text-sm text-muted-foreground">{pred.text}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground/60 px-1">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Функция в разработке. Данные основаны на демо-прогнозах.</span>
      </div>
    </div>
  );
}
