import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserContext } from '@/lib/current-user';
import { canReviewSubmissions, SUBMISSION_STATUSES } from '@/lib/submissions';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await getCurrentUserContext();

    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canReviewSubmissions(context.roleCodes)) {
      return NextResponse.json({ error: 'Somente professores podem revisar submissões' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const status = String(body.status || '').trim().toLowerCase();
    const reviewerNotes = typeof body.reviewerNotes === 'string' ? body.reviewerNotes.trim() : null;

    if (!SUBMISSION_STATUSES.includes(status as (typeof SUBMISSION_STATUSES)[number])) {
      return NextResponse.json({ error: 'Status invalido' }, { status: 400 });
    }

    const existing = await prisma.submission.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Submissao nao encontrada' }, { status: 404 });
    }

    const submission = await prisma.submission.update({
      where: { id },
      data: {
        status,
        reviewerId: context.supabaseUser.id,
        reviewerNotes,
        reviewedAt: new Date(),
        publishedAt: status === 'approved' ? new Date() : existing.publishedAt,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ submission });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
