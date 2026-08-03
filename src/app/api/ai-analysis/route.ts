import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// Google Gemini REST API — no extra SDK needed
// ============================================================
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY;
}

/** Call Gemini generateContent endpoint and return the text. */
async function callGemini(
  systemPrompt: string,
  userContent: string,
  apiKey: string,
): Promise<string> {
  const url = `${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const payload = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [
      { role: 'user' as const, parts: [{ text: userContent }] },
    ],
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 2048,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
  }

  const data = (await response.json()) as {
    candidates?: {
      content?: {
        parts?: { text?: string }[];
      };
    }[];
  };

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ============================================================
// System prompts per analysis type (unchanged)
// ============================================================
const SYSTEM_PROMPTS: Record<string, string> = {
  sales: 'Анализируй данные продаж кофейни. Дай 3 конкретных рекомендации.',
  marketing: 'Проанализируй маркетинговые данные. Предложи стратегии.',
  staff: 'Проанализируй эффективность сотрудников. Дай рекомендации.',
  inventory: 'Проанализируй остатки инвентаря. Предложи действия.',
};

// ============================================================
// Mock analysis fallback (unchanged)
// ============================================================
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

// ============================================================
// POST handler
// ============================================================
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

    const userMessage = typeof data === 'string'
      ? data
      : JSON.stringify(data, null, 2);

    // Check if Gemini API key is configured
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      console.warn('GEMINI_API_KEY not set — using mock analysis fallback');
      return NextResponse.json({ success: true, analysis: MOCK_ANALYSIS[type] || MOCK_ANALYSIS.sales });
    }

    try {
      const analysisText = await callGemini(SYSTEM_PROMPTS[type], userMessage, apiKey);

      if (!analysisText.trim()) {
        console.warn('Gemini returned empty analysis — using mock fallback');
        return NextResponse.json({ success: true, analysis: MOCK_ANALYSIS[type] || MOCK_ANALYSIS.sales });
      }

      return NextResponse.json({ success: true, analysis: analysisText });
    } catch (aiError) {
      // Gemini API failed — return mock analysis as fallback
      console.warn(`Gemini API failed for type "${type}", using mock fallback:`, aiError);
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
