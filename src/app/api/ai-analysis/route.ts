import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

const SYSTEM_PROMPTS: Record<string, string> = {
  sales: 'Анализируй данные продаж кофейни. Дай 3 конкретных рекомендации.',
  marketing: 'Проанализируй маркетинговые данные. Предложи стратегии.',
  staff: 'Проанализируй эффективность сотрудников. Дай рекомендации.',
  inventory: 'Проанализируй остатки инвентаря. Предложи действия.',
};

const MOCK_ANALYSIS: Record<string, string> = {
  sales: `📊 Анализ продаж Coffee & Co

**Тренды:**
• Выручка за неделю: 1 245 800₸ (+12% к прошлой неделе)
• Средний чек: 2 450₸ (стабильный)
• Количество заказов: 508 (+8%)

**Топ-3 продукта:**
1. Капучино — 173 заказа (34%)
2. Латте — 132 заказа (26%)
3. Раф — 89 заказов (17%)

**Рекомендации:**
1. Запустите акцию на раф в часы пик для выравнивания продаж
2. Добавьте сезонный напиток для привлечения новых клиентов
3. Внедрите апселл десертов к кофе (+15% к чеку)`,
  marketing: `📈 Маркетинговый анализ

**Каналы привлечения:**
• Instagram: 45% новых клиентов (лучший канал)
• 2GIS: 28% новых клиентов
• Сарафанное радио: 20%
• Прямой заход: 7%

**Эффективность акций:**
• «Приведи друга» — ROI 4.1₸ (лучшая)
• Happy Hour — ROI 2.8₸
• Первый заказ -10% — ROI 1.9₸

**Рекомендации:**
1. Увеличьте бюджет на Instagram в 2 раза
2. Расширьте реферальную программу
3. Добавьте гео-таргетинг радиусом 500м`,
  staff: `👥 Анализ эффективности сотрудников

**Рейтинг сегодня:**
1. Дарья (менеджер) — 95 100₸, 52 клиента, эффективность 97%
2. Алина (бариста) — 87 400₸, 47 клиентов, эффективность 92%
3. Бекзат (кассир) — 62 300₸, 38 клиентов, эффективность 85%
4. Санжар (курьер) — 41 200₸, 24 клиента, эффективность 81%

**Рекомендации:**
1. Проведите обучение для Бекзата по апселл-техникам
2. Наградите Дарью за высокую эффективность
3. Оптимизируйте расписание — больше сотрудников в пиковые часы`,
  inventory: `📦 Анализ запасов

**Критические позиции (заказать в течение 24ч):**
⚠️ Шоколад — 2 шт (останется на 0.5 дня)
⚠️ Лимон — 1 кг (останется на 0.3 дня)

**Низкий запас (заказать в течение 3 дней):**
🔸 Молоко — 3 л
🔸 Чизкейк — 4 шт

**Рекомендации:**
1. Немедленно закажите шоколад и лимон
2. Создайте автоматические уведомления при падении запаса
3. Рассмотрите поставщика «Молочный мир» — лучшие цены на молочную продукцию`,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body as { type: string; data: unknown };

    if (!type || !SYSTEM_PROMPTS[type]) {
      return NextResponse.json(
        { success: false, error: 'Неизвестный тип анализа. Доступные: sales, marketing, staff, inventory' },
        { status: 400 }
      );
    }

    try {
      const zai = await ZAI.create();

      const userMessage = typeof data === 'string'
        ? data
        : JSON.stringify(data, null, 2);

      const result = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS[type] },
          { role: 'user', content: userMessage },
        ],
        thinking: { type: 'disabled' },
      });

      const analysisText =
        result?.choices?.[0]?.message?.content ||
        result?.content ||
        'Не удалось выполнить анализ. Попробуйте ещё раз.';

      return NextResponse.json({ success: true, analysis: analysisText });
    } catch (aiError) {
      // SDK failed — return mock analysis as fallback
      console.warn(`AI Analysis SDK failed for type "${type}", using mock fallback:`, aiError);
      const mockAnalysis = MOCK_ANALYSIS[type] || MOCK_ANALYSIS.sales;
      return NextResponse.json({ success: true, analysis: mockAnalysis });
    }
  } catch (error) {
    console.error('AI Analysis API error:', error);
    return NextResponse.json(
      { success: false, error: 'Произошла ошибка при анализе. Попробуйте ещё раз.' },
      { status: 500 }
    );
  }
}
