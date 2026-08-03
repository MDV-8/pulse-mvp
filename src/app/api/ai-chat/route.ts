import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// Google Gemini REST API — no extra SDK needed
// ============================================================
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY;
}

/** Build Gemini `contents` array from our messages format.
 *  Gemini uses "user" / "model" (not "assistant"). */
function buildGeminiContents(messages: { role: string; content: string }[]) {
  return messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
      parts: [{ text: m.content }],
    }));
}

/** Call Gemini generateContent endpoint and return the text. */
async function callGemini(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  apiKey: string,
): Promise<string> {
  const url = `${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const payload = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: buildGeminiContents(messages),
    generationConfig: {
      temperature: 0.7,
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
// Rate limiting (unchanged)
// ============================================================
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

// ============================================================
// System prompt (unchanged)
// ============================================================
const SYSTEM_PROMPT =
  'Ты — AI ассистент PULSE, операционная система для малого бизнеса. Ты помогаешь владельцам кофеен, ресторанов и салонов в Казахстане. Отвечай на русском языке. Используй символ ₸ для валюты. Давай конкретные, actionable советы. Бизнес демо — \'Coffee & Co\' в Алматы.';

// ============================================================
// Mock fallback responses (unchanged)
// ============================================================
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

// ============================================================
// POST handler
// ============================================================
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

    // Check if Gemini API key is configured
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      console.warn('GEMINI_API_KEY not set — using mock fallback');
      const mockResponse = getMockResponse(lastUserMessage);
      return NextResponse.json({ success: true, response: mockResponse });
    }

    try {
      const responseText = await callGemini(SYSTEM_PROMPT, messages, apiKey);

      if (!responseText.trim()) {
        console.warn('Gemini returned empty response — using mock fallback');
        return NextResponse.json({ success: true, response: getMockResponse(lastUserMessage) });
      }

      return NextResponse.json({ success: true, response: responseText });
    } catch (aiError) {
      // Gemini API failed — return mock response as fallback
      console.warn('Gemini API failed, using mock fallback:', aiError);
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
