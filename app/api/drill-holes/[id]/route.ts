import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { isDatabaseConfigured, isLocalDemoMode } from '@/lib/demo-mode';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (isLocalDemoMode || !isDatabaseConfigured) {
      return NextResponse.json({ id, ...body, updatedAt: new Date().toISOString() });
    }

    const context = await getCurrentUserContext();
    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!hasAnyAllowedRole(context.roleCodes, ['admin', 'gestor', 'professor', 'pesquisador'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { holeId, project, area, status, method, targetDepth, currentDepth, rigId } = body;

    const existingHole = await prisma.drillHole.findUnique({
      where: { id },
    });

    if (!existingHole || existingHole.createdById !== context.supabaseUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedHole = await prisma.drillHole.update({
      where: { id },
      data: {
        holeId,
        project,
        area,
        status,
        method,
        targetDepth: targetDepth ? parseFloat(targetDepth) : undefined,
        currentDepth: currentDepth ? parseFloat(currentDepth) : undefined,
        rigId,
      },
    });

    return NextResponse.json(updatedHole);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isLocalDemoMode || !isDatabaseConfigured) {
      return NextResponse.json({ success: true, id });
    }

    const context = await getCurrentUserContext();
    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!hasAnyAllowedRole(context.roleCodes, ['admin', 'gestor', 'professor', 'pesquisador'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const existingHole = await prisma.drillHole.findUnique({
      where: { id },
    });

    if (!existingHole || existingHole.createdById !== context.supabaseUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.drillHole.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
