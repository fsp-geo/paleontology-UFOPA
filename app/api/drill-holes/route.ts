import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { demoDrillHoles, isDatabaseConfigured, isLocalDemoMode } from '@/lib/demo-mode';

export async function GET() {
  try {
    if (isLocalDemoMode || !isDatabaseConfigured) {
      return NextResponse.json(demoDrillHoles);
    }

    const context = await getCurrentUserContext();
    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!hasAnyAllowedRole(context.roleCodes, ['admin', 'gestor', 'professor', 'pesquisador'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const drillHoles = await prisma.drillHole.findMany({
      where: { createdById: context.supabaseUser.id },
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

    const context = await getCurrentUserContext();
    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!hasAnyAllowedRole(context.roleCodes, ['admin', 'gestor', 'professor', 'pesquisador'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
        createdById: context.supabaseUser.id,
      },
    });

    return NextResponse.json(drillHole);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
