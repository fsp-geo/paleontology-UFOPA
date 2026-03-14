import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserContext } from '@/lib/current-user';
import {
  canReadContent,
  canSubmitContent,
  getSubmissionSummary,
  getSubmissions,
  SUBMISSION_TYPES,
} from '@/lib/submissions';

export async function GET(request: NextRequest) {
  try {
    const context = await getCurrentUserContext();

    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canReadContent(context.roleCodes)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const typeParam = request.nextUrl.searchParams.get('type');
    const type =
      typeParam && SUBMISSION_TYPES.includes(typeParam as (typeof SUBMISSION_TYPES)[number])
        ? (typeParam as (typeof SUBMISSION_TYPES)[number])
        : undefined;

    const [submissions, summary] = await Promise.all([
      getSubmissions(context.roleCodes, context.supabaseUser.id, type),
      getSubmissionSummary(context.roleCodes, context.supabaseUser.id),
    ]);

    return NextResponse.json({ submissions, summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const context = await getCurrentUserContext();

    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canSubmitContent(context.roleCodes)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const type = String(body.type || '').trim().toLowerCase();
    const title = String(body.title || '').trim();
    const summary = String(body.summary || '').trim();
    const bodyContent = String(body.body || '').trim();

    if (!SUBMISSION_TYPES.includes(type as (typeof SUBMISSION_TYPES)[number])) {
      return NextResponse.json({ error: 'Tipo de submissao invalido' }, { status: 400 });
    }

    if (!title || !summary || !bodyContent) {
      return NextResponse.json({ error: 'Titulo, resumo e conteudo sao obrigatorios' }, { status: 400 });
    }

    const submission = await prisma.submission.create({
      data: {
        type,
        title,
        summary,
        body: bodyContent,
        authorId: context.supabaseUser.id,
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
