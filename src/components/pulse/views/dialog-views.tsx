'use client';

import { useAppStore } from '@/stores/app-store';
import AIContent from '@/components/pulse/smm/ai-content';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// ============================================================
// Dialog Components
// ============================================================
export function ReturnClientsDialog({ onClose }: { onClose: () => void }) {
  const addPromotion = useAppStore((s) => s.addPromotion);

  const handleCreate = () => {
    addPromotion({
      id: `p-${Date.now()}`,
      name: 'Возвращение клиентов',
      discount: 15,
      product: 'Любой напиток',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      audience: 'Потерянные клиенты',
      status: 'active',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 w-full sm:max-w-md space-y-4 max-h-[85vh] overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold">Вернуть клиентов</h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI создал персональное предложение для 18 потерянных клиентов
          </p>
        </div>
        <Separator />
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-muted-foreground">Бонус:</span>
            <span className="font-medium">500 ₸ на следующий визит</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-muted-foreground">Аудитория:</span>
            <span className="font-medium">18 потерянных клиентов</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-muted-foreground">Прогноз:</span>
            <span className="font-medium">Возврат 40–60% клиентов</span>
          </div>
        </div>
        <div className="bg-purple-500/10 rounded-lg p-3">
          <p className="text-xs text-purple-300">
            ⚠ AI прогноз на основе демо-данных
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Отмена
          </Button>
          <Button className="flex-1" onClick={handleCreate}>
            Создать акцию
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AIContentDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AIContent />
        </div>
        <div className="p-4 border-t border-border shrink-0">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
}
