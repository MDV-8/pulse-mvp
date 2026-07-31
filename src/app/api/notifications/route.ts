import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET — Return unread notifications
export async function GET() {
  try {
    const notifications = await db.notificationRecord.findMany({
      where: { read: false },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('[GET /api/notifications]', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить уведомления' },
      { status: 500 }
    );
  }
}

// POST — Mark notification as read
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Отсутствует обязательное поле (id)' },
        { status: 400 }
      );
    }

    const notification = await db.notificationRecord.update({
      where: { id },
      data: { read: true },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('[POST /api/notifications]', error);
    return NextResponse.json(
      { error: 'Не удалось отметить уведомление' },
      { status: 500 }
    );
  }
}
