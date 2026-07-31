'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// ============================================================
// Client Views
// ============================================================
export function ClientBonuses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Мои бонусы</h1>
        <p className="text-muted-foreground mt-1">
          Накопленные баллы и уровень лояльности
        </p>
      </div>
      <div className="glass-card rounded-xl p-6 text-center space-y-4">
        <p className="text-sm text-muted-foreground uppercase tracking-wider">
          Ваш баланс
        </p>
        <p className="text-5xl font-bold pulse-text-gradient">2 480</p>
        <p className="text-muted-foreground">баллов</p>
        <Separator />
        <div className="flex justify-around">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">Серебро</p>
            <p className="text-xs text-muted-foreground">Уровень</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">2 500</p>
            <p className="text-xs text-muted-foreground">до Золота</p>
          </div>
        </div>
      </div>
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h3 className="font-semibold">Преимущества уровня Серебро</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Накопление 1.5₸ = 1 балл
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Сюрприз на день рождения
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Персональные предложения
          </li>
        </ul>
      </div>
      <div className="glass-card rounded-xl p-6 space-y-3">
        <h3 className="font-semibold">Реферальная программа</h3>
        <p className="text-sm text-muted-foreground">
          Пригласите друга и получите бонус после его первой покупки
        </p>
        <div className="bg-secondary rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground mb-2">Ваш промокод</p>
          <p className="text-2xl font-mono font-bold text-purple-400 tracking-widest">
            PULSE-USER-4821
          </p>
        </div>
        <Button variant="outline" className="w-full">
          Скопировать код
        </Button>
      </div>
    </div>
  );
}

export function ClientFavorites() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Избранное</h1>
        <p className="text-muted-foreground mt-1">
          Сохранённые заведения и акции
        </p>
      </div>
      <div className="glass-card rounded-xl p-12 text-center">
        <p className="text-muted-foreground">Пока нет избранных</p>
        <p className="text-sm text-muted-foreground mt-1">
          Нажмите ♡ на карточке заведения, чтобы сохранить
        </p>
      </div>
    </div>
  );
}
