import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { syncUser } from '@/lib/user-sync';
import { demoDrillHoles, isDatabaseConfigured, isLocalDemoMode } from '@/lib/demo-mode';

export async function GET() {
  try {
    if (isLocalDemoMode || !isDatabaseConfigured) {
      return NextResponse.json(demoDrillHoles);
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(demoDrillHoles);
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await syncUser(user);

    const drillHoles = await prisma.drillHole.findMany({
      where: { createdById: user.id },
      include: { rig: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(drillHoles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (isLocalDemoMode || !isDatabaseConfigured) {
      return NextResponse.json({
        id: 'demo-created-hole',
        ...body,
        status: body.status || 'PLANEJADO',
        createdById: 'demo-user',
      });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await syncUser(user);

    const { holeId, project, area, status, method, targetDepth, rigId } = body;

    if (!holeId || !project || !targetDepth) {
      return NextResponse.json({ error: 'Hole ID, Project and Target Depth are required' }, { status: 400 });
    }

    const drillHole = await prisma.drillHole.create({
      data: {
        holeId,
        project,
        area,
        status: status || 'PLANEJADO',
        method,
        targetDepth: parseFloat(targetDepth),
        rigId,
        createdById: user.id,
      },
    });

    return NextResponse.json(drillHole);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
