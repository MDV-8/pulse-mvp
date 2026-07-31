'use client';

import { motion } from 'framer-motion';
import { PieChart, UserCheck, Zap, ArrowRight, AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { mockClientSegments } from '@/data/mock-data';

const aiSegments = [
  {
    id: 's1',
    title: 'Неактивные более 30 дней',
    count: 28,
    description: '28 клиентов не приходили более 30 дней',
    risk: 'high' as const,
    action: 'Отправить персональное предложение',
    icon: AlertCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
  },
  {
    id: 's2',
    title: 'Высокий потенциал',
    count: 12,
    description: '12 клиентов с высоким потенциалом (часто покупают, но редко тратят)',
    risk: 'opportunity' as const,
    action: 'Предложить VIP-программу',
    icon: TrendingUp,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
  {
    id: 's3',
    title: 'Новые с высокой конверсией',
    count: 8,
    description: '8 новых клиентов, которые совершили 2+ покупки за неделю',
    risk: 'opportunity' as const,
    action: 'Отправить бонусное предложение',
    icon: Zap,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
];

const segmentData = [
  { label: 'Постоянные', count: mockClientSegments.regular, color: 'bg-green-500', percent: Math.round((mockClientSegments.regular / mockClientSegments.total) * 100) },
  { label: 'VIP', count: mockClientSegments.vip, color: 'bg-purple-500', percent: Math.round((mockClientSegments.vip / mockClientSegments.total) * 100) },
  { label: 'Новые', count: mockClientSegments.new, color: 'bg-blue-500', percent: Math.round((mockClientSegments.new / mockClientSegments.total) * 100) },
  { label: 'Потерянные', count: mockClientSegments.lost, color: 'bg-red-500', percent: Math.round((mockClientSegments.lost / mockClientSegments.total) * 100) },
];

export default function Segments() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
          <PieChart className="w-5 h-5 text-purple-400" />
        </div>
        <h1 className="text-2xl font-bold text-shadow-glow">Сегменты клиентов</h1>
      </motion.div>

      {/* Segment Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Распределение клиентов</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Donut-like visualization */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Background circle */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
                  {/* Regular: 58% */}
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="#22c55e"
                    strokeWidth="12"
                    strokeDasharray={`${58 * 2.51} ${100 * 2.51}`}
                    strokeDashoffset="0"
                  />
                  {/* VIP: 14% */}
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="12"
                    strokeDasharray={`${14 * 2.51} ${100 * 2.51}`}
                    strokeDashoffset={`${-58 * 2.51}`}
                  />
                  {/* New: 12% */}
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="#3b82f6"
                    strokeWidth="12"
                    strokeDasharray={`${12 * 2.51} ${100 * 2.51}`}
                    strokeDashoffset={`${-72 * 2.51}`}
                  />
                  {/* Lost: 16% */}
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="#ef4444"
                    strokeWidth="12"
                    strokeDasharray={`${16 * 2.51} ${100 * 2.51}`}
                    strokeDashoffset={`${-84 * 2.51}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{mockClientSegments.total.toLocaleString('ru')}</span>
                  <span className="text-xs text-muted-foreground">всего</span>
                </div>
              </div>
            </div>

            {/* Bar breakdown */}
            <div className="space-y-3">
              {segmentData.map((seg) => (
                <div key={seg.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-sm ${seg.color}`} />
                      <span>{seg.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{seg.count.toLocaleString('ru')}</span>
                      <span className="text-xs">({seg.percent}%)</span>
                    </div>
                  </div>
                  <Progress value={seg.percent} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-purple-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Separator />

      {/* AI-Found Segments */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-purple-400" />
          <h2 className="text-lg font-semibold">AI-сегменты</h2>
          <Badge variant="outline" className="text-purple-400 border-purple-500/30 bg-purple-500/10">Авто</Badge>
        </div>

        <div className="space-y-3">
          {aiSegments.map((seg, i) => (
            <motion.div
              key={seg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Card className={`border ${seg.borderColor} ${seg.bgColor} p-0`}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${seg.bgColor} mt-0.5`}>
                        <seg.icon className={`w-5 h-5 ${seg.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">{seg.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {seg.count}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {seg.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-purple-600/10 border-purple-500/30 text-purple-400 hover:bg-purple-600/20 whitespace-nowrap"
                    >
                      {seg.action}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Segment Actions Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-900/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <UserCheck className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold">Рекомендации AI</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  На основе анализа 1 248 клиентов, мы рекомендуем сосредоточиться на удержании постоянных клиентов и конверсии новых в постоянных. Наибольший потенциал роста — сегмент «Высокий потенциал» (12 клиентов).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
