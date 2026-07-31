import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET — Return all promotions (sorted by createdAt desc)
export async function GET() {
  try {
    const promotions = await db.promotion.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(promotions);
  } catch (error) {
    console.error('[GET /api/promotions]', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить акции' },
      { status: 500 }
    );
  }
}

// POST — Create new promotion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, discount, product, audience, startDate, endDate } = body;

    if (!name || discount == null || !product || !audience || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля' },
        { status: 400 }
      );
    }

    const promotion = await db.promotion.create({
      data: {
        name,
        discount: Number(discount),
        product,
        audience,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json(promotion, { status: 201 });
  } catch (error) {
    console.error('[POST /api/promotions]', error);
    return NextResponse.json(
      { error: 'Не удалось создать акцию' },
      { status: 500 }
    );
  }
}

// PUT — Update promotion status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля (id, status)' },
        { status: 400 }
      );
    }

    const promotion = await db.promotion.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(promotion);
  } catch (error) {
    console.error('[PUT /api/promotions]', error);
    return NextResponse.json(
      { error: 'Не удалось обновить акцию' },
      { status: 500 }
    );
  }
}
