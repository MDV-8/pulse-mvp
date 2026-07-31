'use client';

import { motion } from 'framer-motion';
import {
  Eye, ArrowUpRight, ArrowDownRight, Minus, Tag, TrendingDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockCompetitors } from '@/data/mock-data';

const yourAvgCheck = 5420;

function CompareCheck({ competitorCheck }: { competitorCheck: number }) {
  const diff = yourAvgCheck - competitorCheck;
  const percent = Math.round((diff / competitorCheck) * 100);
  const isHigher = diff > 0;

  return (
    <div className="flex items-center gap-1.5 text-xs">
      {isHigher ? (
        <ArrowUpRight className="w-3 h-3 text-green-400" />
      ) : diff < 0 ? (
        <ArrowDownRight className="w-3 h-3 text-red-400" />
      ) : (
        <Minus className="w-3 h-3 text-muted-foreground" />
      )}
      <span className={isHigher ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-muted-foreground'}>
        {isHigher ? '+' : ''}{percent}% {isHigher ? 'дороже' : diff < 0 ? 'дешевле' : 'равно'}
      </span>
    </div>
  );
}

export default function Competitors() {
  const avgCompetitorCheck = Math.round(
    mockCompetitors.reduce((s, c) => s + c.avgCheck, 0) / mockCompetitors.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
          <Eye className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Рынок рядом</h1>
          <Badge variant="outline" className="text-[10px] text-purple-400 border-purple-500/30 bg-purple-500/10">
            DEMO
          </Badge>
        </div>
      </motion.div>

      {/* Competitor Cards */}
      <div className="space-y-4">
        {mockCompetitors.map((comp, i) => (
          <motion.div
            key={comp.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
          >
            <Card className="p-0 overflow-hidden">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{comp.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {comp.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Средний чек: {comp.avgCheck.toLocaleString('ru')} ₸
                      </span>
                    </div>
                  </div>
                  <CompareCheck competitorCheck={comp.avgCheck} />
                </div>

                {/* Popular Offers */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Популярное</p>
                  <div className="flex flex-wrap gap-1.5">
                    {comp.popularOffers.map((offer) => (
                      <Badge
                        key={offer}
                        variant="secondary"
                        className="text-xs"
                      >
                        {offer}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Active Promotions */}
                {comp.promotions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Акции
                    </p>
                    <div className="space-y-1">
                      {comp.promotions.map((promo) => (
                        <div
                          key={promo}
                          className="flex items-center gap-2 text-xs p-1.5 rounded bg-green-500/5 border border-green-500/10"
                        >
                          <TrendingDown className="w-3 h-3 text-green-400 shrink-0" />
                          <span className="text-green-300">{promo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Separator />

      {/* AI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-900/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Резюме</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Средний чек конкурентов: {avgCompetitorCheck.toLocaleString('ru')} ₸.{' '}
                  {yourAvgCheck > avgCompetitorCheck
                    ? `Ваш чек (${yourAvgCheck.toLocaleString('ru')} ₸) немного выше среднего.`
                    : `Ваш чек (${yourAvgCheck.toLocaleString('ru')} ₸) ниже среднего.`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-muted-foreground/60">
        Данные представлены для демонстрации функционала
      </div>
    </div>
  );
}
