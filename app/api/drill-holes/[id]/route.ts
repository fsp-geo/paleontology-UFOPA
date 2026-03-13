import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
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

    const { holeId, project, area, status, method, targetDepth, currentDepth, rigId } = body;

    const existingHole = await prisma.drillHole.findUnique({
      where: { id },
    });

    if (!existingHole || existingHole.createdById !== user.id) {
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

    const existingHole = await prisma.drillHole.findUnique({
      where: { id },
    });

    if (!existingHole || existingHole.createdById !== user.id) {
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
