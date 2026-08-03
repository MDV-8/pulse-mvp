import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Simple in-memory rate limiting: max 20 requests per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  let entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimitMap.set(ip, entry);
  }

  entry.count++;
  return entry.count <= RATE_LIMIT_MAX;
}

const SYSTEM_PROMPT =
  'Ты — AI ассистент PULSE, операционная система для малого бизнеса. Ты помогаешь владельцам кофеен, ресторанов и салонов в Казахстане. Отвечай на русском языке. Используй символ ₸ для валюты. Давай конкретные, actionable советы. Бизнес демо — \'Coffee & Co\' в Алматы.';

const MOCK_RESPONSES = [
  'На основе данных вашего бизнеса "Coffee & Co", я рекомендую:\n\n1. Сосредоточьтесь на возврате клиентов — это самый выгодный канал\n2. Запустите Happy Hour с 17:00 до 19:00\n3. Увеличьте бюджет на Instagram-продвижение\n\nПрогноз: +15-20% выручки за месяц.',
  'Анализ вашего бизнеса показывает:\n\n• Средний чек: 2 450₸ (выше рынка на 8%)\n• Возврат клиентов: 34% (цель: 45%)\n• Лучшая акция: "Приведи друга" (ROI 4.1₸)\n\nРекомендую активировать программу лояльности для роста возврата.',
  'Ваши продажи за неделю:\n\n📊 Выручка: 1 245 800₸ (+12% к прошлой неделе)\n🏆 Топ продукт: Капучино (34% продаж)\n⚠️ Внимание: продажи десертов упали на 8%\n\nРекомендация: Добавьте комбо-предложение «Кофе + десерт» со скидкой 10%.',
  'Стратегия привлечения клиентов:\n\n1. Гео-маркетинг — таргет в радиусе 500м от кофейни\n2. Реферальная программа — бонус 500₸ за приведённого друга\n3. Корпоративные заказы — предложите бизнес-ланчи для офисов рядом\n\nОжидаемый результат: +25-30 новых клиентов за месяц.',
  'Оптимизация расходов:\n\n• Аренда: 450 000₸/мес (в норме)\n• Закупки: можно сэкономить 8% при переходе на другого поставщика\n• Маркетинг: ROI 3.2₸ на каждый 1₸ вложений\n\nРекомендую пересмотреть договор с поставщиком молочной продукции.',
  'Ключевые метрики бизнеса:\n\n✅ PULSE Score: 91/100 (отлично)\n📈 Тренд выручки: растущая динамика 3-й месяц\n👥 Клиентская база: 847 клиентов (+5% за месяц)\n⭐ Рейтинг: 4.7 на Google Maps\n\nВаш бизнес в топ-10% кофейен Алматы!',
];

function getMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('продаж') || lower.includes('выручк') || lower.includes('доход')) {
    return MOCK_RESPONSES[2];
  }
  if (lower.includes('клиент') || lower.includes('привлеч') || lower.includes('потерян')) {
    return MOCK_RESPONSES[1];
  }
  if (lower.includes('расход') || lower.includes('себестоим') || lower.includes('затрат')) {
    return MOCK_RESPONSES[4];
  }
  if (lower.includes('метрик') || lower.includes('показател') || lower.includes('оценк') || lower.includes('score')) {
    return MOCK_RESPONSES[5];
  }
  if (lower.includes('маркетинг') || lower.includes('продвижен') || lower.includes('реклам') || lower.includes('стратег')) {
    return MOCK_RESPONSES[3];
  }

  // Return a random response for other queries
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Слишком много запросов. Попробуйте через минуту.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { messages } = body as { messages: { role: string; content: string }[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Необходимо передать массив messages' },
        { status: 400 }
      );
    }

    const lastUserMessage = messages.filter((m) => m.role === 'user').pop()?.content || '';

    try {
      const zai = await ZAI.create();

      const chatMessages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: (m.role === 'user' ? 'user' as const : 'assistant' as const),
          content: m.content,
        })),
      ];

      const result = await zai.chat.completions.create({
        messages: chatMessages,
        thinking: { type: 'disabled' },
      });

      const responseText =
        result?.choices?.[0]?.message?.content ||
        result?.content ||
        'Не удалось получить ответ от AI. Попробуйте ещё раз.';

      return NextResponse.json({ success: true, response: responseText });
    } catch (aiError) {
      // SDK failed — return mock response as fallback
      console.warn('AI SDK failed, using mock fallback:', aiError);
      const mockResponse = getMockResponse(lastUserMessage);
      return NextResponse.json({ success: true, response: mockResponse });
    }
  } catch (error) {
    console.error('AI Chat API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Произошла ошибка при обработке запроса. Попробуйте ещё раз.',
      },
      { status: 500 }
    );
  }
}
