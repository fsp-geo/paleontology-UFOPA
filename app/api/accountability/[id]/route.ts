import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserContext } from '@/lib/current-user';
import { ACCOUNTABILITY_STATUSES, canManageAccountability } from '@/lib/accountability';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await getCurrentUserContext();

    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const status = String(body.status || '').trim().toLowerCase();
    const reviewerNotes = typeof body.reviewerNotes === 'string' ? body.reviewerNotes.trim() : null;

    if (!ACCOUNTABILITY_STATUSES.includes(status as (typeof ACCOUNTABILITY_STATUSES)[number])) {
      return NextResponse.json({ error: 'Status invalido' }, { status: 400 });
    }

    const existingEntry = await prisma.accountabilityEntry.findUnique({
      where: { id },
    });

    if (!existingEntry) {
      return NextResponse.json({ error: 'Prestacao nao encontrada' }, { status: 404 });
    }

    if (!canManageAccountability(context.roleCodes)) {
      return NextResponse.json({ error: 'Somente professores podem revisar prestacoes' }, { status: 403 });
    }

    const updatedEntry = await prisma.accountabilityEntry.update({
      where: { id },
      data: {
        status,
        reviewerId: canManageAccountability(context.roleCodes) ? context.supabaseUser.id : existingEntry.reviewerId,
        reviewerNotes,
        reviewedAt: canManageAccountability(context.roleCodes) ? new Date() : existingEntry.reviewedAt,
      },
    });

    return NextResponse.json({ entry: updatedEntry });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
