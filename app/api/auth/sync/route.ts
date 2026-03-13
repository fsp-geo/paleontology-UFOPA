import { NextResponse } from 'next/server';
import { syncUser } from '@/lib/user-sync';
import { isDatabaseConfigured } from '@/lib/demo-mode';

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured) {
      return NextResponse.json({ success: true, skipped: 'Database not configured' });
    }

    const body = await request.json();
    const { user } = body;

    if (!user) {
      return NextResponse.json({ error: 'User data required' }, { status: 400 });
    }

    const syncedUser = await syncUser(user);

    return NextResponse.json({ success: true, user: syncedUser });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
