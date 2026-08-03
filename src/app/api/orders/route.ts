import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET — Return recent 20 orders (sorted by createdAt desc)
export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('[GET /api/orders]', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить заказы' },
      { status: 500 }
    );
  }
}

// POST — Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, total } = body;

    if (!items || total == null) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля (items, total)' },
        { status: 400 }
      );
    }

    // Generate next order number
    const lastOrder = await db.order.findFirst({
      orderBy: { orderNumber: 'desc' },
    });
    const nextNumber = (lastOrder?.orderNumber ?? 0) + 1;

    const order = await db.order.create({
      data: {
        orderNumber: nextNumber,
        items: typeof items === 'string' ? items : JSON.stringify(items),
        total: Number(total),
        status: 'new',
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('[POST /api/orders]', error);
    return NextResponse.json(
      { error: 'Не удалось создать заказ' },
      { status: 500 }
    );
  }
}
