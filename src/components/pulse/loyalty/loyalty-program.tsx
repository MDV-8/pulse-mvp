'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, Gift, Users, Star, Copy, Check,
  Award, Crown, Shield, Gem,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { mockLoyaltyData } from '@/data/mock-data';

const tierConfig = [
  {
    name: 'Бронза',
    minPoints: 0,
    icon: Shield,
    color: 'text-amber-600',
    borderColor: 'border-amber-700/30',
    bgColor: 'bg-amber-500/5',
    accentColor: 'bg-amber-600',
    progressColor: 'bg-amber-600',
    iconBg: 'bg-amber-500/20',
  },
  {
    name: 'Серебро',
    minPoints: 5000,
    icon: Award,
    color: 'text-slate-300',
    borderColor: 'border-slate-400/30',
    bgColor: 'bg-slate-400/5',
    accentColor: 'bg-slate-300',
    progressColor: 'bg-slate-300',
    iconBg: 'bg-slate-400/20',
  },
  {
    name: 'Золото',
    minPoints: 15000,
    icon: Crown,
    color: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
    bgColor: 'bg-yellow-500/5',
    accentColor: 'bg-yellow-400',
    progressColor: 'bg-yellow-400',
    iconBg: 'bg-yellow-500/20',
  },
  {
    name: 'Платина',
    minPoints: 30000,
    icon: Gem,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/5',
    accentColor: 'bg-purple-500',
    progressColor: 'bg-purple-500',
    iconBg: 'bg-purple-500/20',
  },
];

export default function LoyaltyProgram() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'PULSE-AID-2847';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    {
      label: 'Баллов начислено',
      value: mockLoyaltyData.totalPointsIssued.toLocaleString('ru'),
      icon: Star,
      color: 'text-purple-400',
    },
    {
      label: 'Баллов использовано',
      value: mockLoyaltyData.totalPointsUsed.toLocaleString('ru'),
      icon: Gift,
      color: 'text-green-400',
    },
    {
      label: 'Активных участников',
      value: mockLoyaltyData.activeMembers.toLocaleString('ru'),
      icon: Users,
      color: 'text-blue-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-pink-500/20">
          <Heart className="w-5 h-5 text-pink-400" />
        </div>
        <h1 className="text-2xl font-bold">Программа лояльности</h1>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="py-4 px-4">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${s.color}`}>
                    <s.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-xl font-bold">{s.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Loyalty Levels */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Уровни программы</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockLoyaltyData.levels.map((level, i) => {
            const config = tierConfig[i];
            const nextLevel = i < tierConfig.length - 1 ? mockLoyaltyData.levels[i + 1].minPoints : level.minPoints;
            const fillPercent = i === 0 ? 100 : Math.min(100, Math.round((level.count / 420) * 100));
            
            return (
              <motion.div
                key={level.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                <Card className={`border ${config.borderColor} ${config.bgColor} overflow-hidden`}>
                  <div className={`h-1 ${config.accentColor}`} />
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.iconBg}`}>
                          <config.icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${config.color}`}>{level.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            от {level.minPoints.toLocaleString('ru')} баллов
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {level.count} чел.
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{level.benefits}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{level.minPoints.toLocaleString('ru')}</span>
                        <span>{nextLevel.toLocaleString('ru')}</span>
                      </div>
                      <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`absolute left-0 top-0 h-full rounded-full ${config.progressColor} transition-all duration-700`}
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Referral Program */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Gift className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-base">Программа «Приведи друга»</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Реферальная программа для привлечения новых клиентов
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                Каждый клиент имеет персональный реферальный код. Поделитесь им с друзьями —
                и они получат бонус после первой реальной покупки.
              </p>
              <p className="text-xs text-muted-foreground/70">
                * Бонус начисляется только после подтверждения первой покупки (защита от мошенничества)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 flex items-center gap-2 bg-background/50 border border-border/50 rounded-lg px-4 py-3">
                <code className="text-lg font-mono font-bold tracking-wider text-purple-300">
                  {referralCode}
                </code>
              </div>
              <Button
                onClick={handleCopy}
                variant={copied ? 'default' : 'outline'}
                className={
                  copied
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'
                }
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Скопировано
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Скопировать код
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
