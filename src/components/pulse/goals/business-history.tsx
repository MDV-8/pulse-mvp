'use client';

import { motion } from 'framer-motion';
import { Clock, Heart, Tag, Megaphone, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockBusinessHistory, type BusinessEvent } from '@/data/mock-data';

const typeIcons: Record<BusinessEvent['type'], React.ComponentType<{ className?: string }>> = {
  loyalty: Heart,
  promotion: Tag,
  marketing: Megaphone,
  other: Sparkles,
};

const typeColors: Record<BusinessEvent['type'], string> = {
  loyalty: 'text-pink-400 bg-pink-500/20',
  promotion: 'text-green-400 bg-green-500/20',
  marketing: 'text-blue-400 bg-blue-500/20',
  other: 'text-purple-400 bg-purple-500/20',
};

function isPositiveResult(result: string): boolean {
  const positiveWords = ['+', 'рост', 'увелич'];
  return positiveWords.some((w) => result.toLowerCase().includes(w));
}

function formatDate(dateStr: string): string {
  const months = [
    'янв', 'фев', 'мар', 'апр', 'май', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
  ];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function BusinessHistory() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
          <Clock className="w-5 h-5 text-purple-400" />
        </div>
        <h1 className="text-2xl font-bold text-shadow-glow">История бизнеса</h1>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-6">
          {mockBusinessHistory.map((event, i) => {
            const Icon = typeIcons[event.type];
            const positive = isPositiveResult(event.result);
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="relative pl-12"
              >
                {/* Icon node */}
                <div className={`absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center ${typeColors[event.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <Card className="p-0">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm">{event.title}</h3>
                          <Badge variant="outline" className="text-[10px]">
                            {formatDate(event.date)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      </div>
                    </div>

                    {/* Result indicator */}
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        positive ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {positive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="font-medium">{event.result}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Next Action Card - AI Prediction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="font-semibold text-sm">Следующая акция</h3>
              <Badge variant="outline" className="text-[10px] text-purple-400 border-purple-500/30">
                AI прогноз
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              На основе исторических данных и сезонных трендов, рекомендуется запустить
              «Весеннее обновление» в начале марта. Прогнозируемый эффект: +15% новых клиентов,
              +8% повторных покупок.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                Точность прогноза: 87%
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
