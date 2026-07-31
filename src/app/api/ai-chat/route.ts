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
