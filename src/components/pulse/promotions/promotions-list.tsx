'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Calendar, Percent, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ExportButton } from '@/components/pulse/shared/export-button';
import { useAppStore } from '@/stores/app-store';
import { PromotionResults } from './promotion-results';
import type { Promotion } from '@/data/mock-data';

const STATUS_CONFIG: Record<Promotion['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
  active: { label: 'Активная', variant: 'default', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25' },
  completed: { label: 'Завершена', variant: 'secondary', className: 'bg-muted text-muted-foreground border-border hover:bg-muted/80' },
  planned: { label: 'Плановая', variant: 'default', className: 'bg-sky-500/15 text-sky-400 border-sky-500/30 hover:bg-sky-500/25' },
  draft: { label: 'Черновик', variant: 'default', className: 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25' },
};

function getAIConclusion(promotion: Promotion): string | null {
  if (promotion.status !== 'completed' || !promotion.results) return null;
  const r = promotion.results;
  if (r.revenueChange > 0 && r.profitChange > 0) {
    return `Акция дала положительный результат. Рекомендуем повторить через 2 недели.`;
  }
  if (r.revenueChange > 0 && r.profitChange <= 0) {
    return `Акция увеличила выручку на ${r.revenueChange}%, но снизила маржинальность. Рассмотрите уменьшение скидки.`;
  }
  return `Акция не дала ожидаемого эффекта. Рекомендуем пересмотреть параметры.`;
}

function PromotionCard({ promotion, onSelectResults }: { promotion: Promotion; onSelectResults: (p: Promotion) => void }) {
  const statusConfig = STATUS_CONFIG[promotion.status];
  const hasResults = promotion.status === 'completed' && promotion.results;
  const aiConclusion = getAIConclusion(promotion);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="bg-card border-border card-hover card-hover-lift">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-semibold text-sm truncate">{promotion.name}</h3>
                <Badge variant="outline" className={statusConfig.className}>
                  {promotion.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot inline-block mr-1.5" />}
                  {statusConfig.label}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-primary font-medium text-sm">
                <Percent className="h-3.5 w-3.5" />
                <span>−{promotion.discount}%</span>
                <Separator orientation="vertical" className="h-3.5 mx-1 bg-border" />
                <span className="text-foreground/70 font-normal">{promotion.product}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{promotion.startTime.split(' ')[0]} — {promotion.endTime.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{promotion.audience}</span>
            </div>
          </div>

          {/* Results Summary for Completed Promotions */}
          {hasResults && (
            <div className="mt-3">
              <Separator className="mb-3 bg-border" />
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-semibold text-emerald-400">
                    +{promotion.results!.newClientsChange}%
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Новых клиентов</div>
                </div>
                <div>
                  <div className={`text-lg font-semibold ${promotion.results!.revenueChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                  >
                    {promotion.results!.revenueChange >= 0 ? '+' : ''}{promotion.results!.revenueChange}%
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Выручка</div>
                </div>
                <div>
                  <div className={`text-lg font-semibold ${promotion.results!.profitChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                  >
                    {promotion.results!.profitChange >= 0 ? '+' : ''}{promotion.results!.profitChange}%
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Прибыль</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => onSelectResults(promotion)}
              >
                Подробные результаты
              </Button>
            </div>
          )}

          {/* AI Conclusion */}
          {aiConclusion && (
            <div className="mt-3 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2.5 flex items-start gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">{aiConclusion}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

type FilterTab = 'all' | 'active' | 'completed' | 'planned';

export function PromotionsList() {
  const { promotions, setShowCreatePromotion } = useAppStore();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  const filteredPromotions = promotions.filter((p) => {
    if (activeTab === 'all') return true;
    return p.status === activeTab;
  });

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 sm:px-6 py-4">
        <h2 className="text-base font-semibold text-gradient-animate">Акции</h2>
        <div className="flex items-center gap-2">
          <ExportButton
            title="Акции"
            headers={['Название', 'Скидка', 'Продукт', 'Статус']}
            rows={filteredPromotions.map((p) => [
              p.name,
              `-${p.discount}%`,
              p.product,
              STATUS_CONFIG[p.status].label,
            ])}
          />
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 border-glow shine-sweep"
            onClick={() => setShowCreatePromotion(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Создать акцию</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-6 pt-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
          <TabsList className="bg-muted/50 h-9">
            <TabsTrigger value="all" className="text-xs px-3 h-7 slide-in-right stagger-1">Все</TabsTrigger>
            <TabsTrigger value="active" className="text-xs px-3 h-7 slide-in-right stagger-2">Активные</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs px-3 h-7 slide-in-right stagger-3">Завершённые</TabsTrigger>
            <TabsTrigger value="planned" className="text-xs px-3 h-7 slide-in-right stagger-4">Плановые</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Promotions List */}
      <ScrollArea className="flex-1 px-4 sm:px-6 py-4">
        <div className="space-y-3 count-up">
          {filteredPromotions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Percent className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Нет акций в этой категории</p>
            </div>
          ) : (
            filteredPromotions.map((promotion) => (
              <PromotionCard
                key={promotion.id}
                promotion={promotion}
                onSelectResults={setSelectedPromotion}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Promotion Results Dialog */}
      {selectedPromotion && selectedPromotion.results && (
        <PromotionResults
          promotion={selectedPromotion}
          onClose={() => setSelectedPromotion(null)}
        />
      )}
    </div>
  );
}
