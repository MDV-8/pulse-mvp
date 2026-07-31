'use client';

import { motion } from 'framer-motion';
import { UserSearch, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockAudienceInsight } from '@/data/mock-data';

export default function AudienceInsights() {
  const { ageGroups, peakHours, popularProducts, visitFrequency, averageCheckBySegment, aiSummary } =
    mockAudienceInsight;

  const maxVisits = Math.max(...peakHours.map((h) => h.visits));
  const maxProduct = Math.max(...popularProducts.map((p) => p.percent));
  const maxCheck = Math.max(...averageCheckBySegment.map((s) => s.check));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
          <UserSearch className="w-5 h-5 text-purple-400" />
        </div>
        <h1 className="text-2xl font-bold">Кто ваши клиенты?</h1>
      </motion.div>

      {/* Age Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Возраст</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ageGroups.map((group) => (
              <div key={group.group} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span>{group.group}</span>
                  <span className="text-muted-foreground font-medium">{group.percent}%</span>
                </div>
                <div className="relative h-3 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${group.percent}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Peak Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Пиковые часы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-1 h-40">
              {peakHours.map((hour, i) => {
                const height = (hour.visits / maxVisits) * 100;
                const isPeak = hour.visits >= maxVisits * 0.8;
                return (
                  <div key={hour.hour} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.6, delay: 0.15 + i * 0.03 }}
                      className={`w-full rounded-t-sm min-h-[4px] ${
                        isPeak
                          ? 'bg-gradient-to-t from-purple-600 to-purple-400'
                          : 'bg-muted'
                      }`}
                    />
                    <span className="text-[9px] text-muted-foreground hidden sm:block">
                      {hour.hour}
                    </span>
                    {isPeak && (
                      <span className="text-[9px] text-purple-400 font-medium">
                        {hour.visits}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex sm:hidden justify-between mt-2 px-1">
              <span className="text-[9px] text-muted-foreground">07:00</span>
              <span className="text-[9px] text-muted-foreground">13:00</span>
              <span className="text-[9px] text-muted-foreground">20:00</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Popular Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Популярные продукты</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {popularProducts.map((product) => (
              <div key={product.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span>{product.name}</span>
                  <span className="text-muted-foreground font-medium">{product.percent}%</span>
                </div>
                <Progress
                  value={product.percent}
                  className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-400"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Visit Frequency + Average Check by Segment (side by side on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Visit Frequency - Donut-like */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Частота посещений</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Donut representation */}
              <div className="flex justify-center mb-4">
                <div className="relative w-36 h-36">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                    {(() => {
                      const segments = visitFrequency.map((v, vi) => {
                        const colors = ['#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff'];
                        const dashLen = v.percent * 2.51;
                        const prevSegments = visitFrequency.slice(0, vi);
                        const prevOffset = prevSegments.reduce((acc, prev) => acc + prev.percent * 2.51, 0);
                        return (
                          <circle
                            key={v.label}
                            cx="50" cy="50" r="40" fill="none"
                            stroke={colors[vi]}
                            strokeWidth="10"
                            strokeDasharray={`${dashLen} ${100 * 2.51}`}
                            strokeDashoffset={`${-prevOffset}`}
                          />
                        );
                      });
                      return segments;
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold">63%</span>
                    <span className="text-[10px] text-muted-foreground">1+ раз/нед</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                {visitFrequency.map((v, i) => {
                  const colors = ['bg-purple-500', 'bg-purple-400', 'bg-purple-300', 'bg-purple-200', 'bg-purple-100'];
                  return (
                    <div key={v.label} className="flex items-center gap-2 text-xs">
                      <div className={`w-2.5 h-2.5 rounded-sm ${colors[i]}`} />
                      <span className="flex-1">{v.label}</span>
                      <span className="text-muted-foreground font-medium">{v.percent}%</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Average Check by Segment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Средний чек по сегментам</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {averageCheckBySegment.map((seg) => {
                const width = (seg.check / maxCheck) * 100;
                return (
                  <div key={seg.segment} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span>{seg.segment}</span>
                      <span className="font-medium">
                        {seg.check.toLocaleString('ru')} ₸
                      </span>
                    </div>
                    <div className="relative h-6 w-full bg-muted rounded-md overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="absolute left-0 top-0 h-full rounded-md bg-gradient-to-r from-purple-600 to-purple-400 flex items-center px-2"
                      >
                        <span className="text-[10px] font-medium text-white truncate">
                          {seg.check.toLocaleString('ru')} ₸
                        </span>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Резюме</h3>
                <p className="text-sm text-muted-foreground mt-1">{aiSummary}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
