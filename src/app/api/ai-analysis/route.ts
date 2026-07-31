import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

const SYSTEM_PROMPTS: Record<string, string> = {
  sales: 'Анализируй данные продаж кофейни. Дай 3 конкретных рекомендации.',
  marketing: 'Проанализируй маркетинговые данные. Предложи стратегии.',
  staff: 'Проанализируй эффективность сотрудников. Дай рекомендации.',
  inventory: 'Проанализируй остатки инвентаря. Предложи действия.',
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
  } catch (error) {
    console.error('AI Analysis API error:', error);
    return NextResponse.json(
      { success: false, error: 'Произошла ошибка при анализе. Попробуйте ещё раз.' },
      { status: 500 }
    );
  }
}
