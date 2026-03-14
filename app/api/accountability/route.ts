import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import {
  ACCOUNTABILITY_CATEGORIES,
  canSubmitAccountability,
  getAccountabilityEntries,
  getAccountabilitySummary,
} from '@/lib/accountability';

function parseAmountInCents(rawAmount: string) {
  const normalized = rawAmount.replace(/\./g, '').replace(',', '.').trim();
  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return Math.round(amount * 100);
}

export async function GET() {
  try {
    const context = await getCurrentUserContext();

    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasAnyAllowedRole(context.roleCodes, ['professor', 'pesquisador'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [entries, summary] = await Promise.all([
      getAccountabilityEntries(context.roleCodes, context.supabaseUser.id),
      getAccountabilitySummary(context.roleCodes, context.supabaseUser.id),
    ]);

    return NextResponse.json({
      entries: entries.map((entry) => ({
        id: entry.id,
        title: entry.title,
        description: entry.description,
        category: entry.category,
        amountInCents: entry.amountInCents,
        expenseDate: entry.expenseDate,
        status: entry.status,
        receiptUrl: entry.receiptUrl,
        reviewerNotes: entry.reviewerNotes,
        reviewedAt: entry.reviewedAt,
        createdAt: entry.createdAt,
        submitter: entry.submitter,
        reviewer: entry.reviewer,
      })),
      summary,
    });
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

    if (!canSubmitAccountability(context.roleCodes)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const title = String(body.title || '').trim();
    const description = String(body.description || '').trim();
    const category = String(body.category || '').trim().toLowerCase();
    const amountInCents = parseAmountInCents(String(body.amount || ''));
    const expenseDate = String(body.expenseDate || '').trim();

    if (!title || !description || !category || !amountInCents || !expenseDate) {
      return NextResponse.json({ error: 'Todos os campos principais da prestacao sao obrigatorios' }, { status: 400 });
    }

    if (!ACCOUNTABILITY_CATEGORIES.includes(category as (typeof ACCOUNTABILITY_CATEGORIES)[number])) {
      return NextResponse.json({ error: 'Categoria invalida' }, { status: 400 });
    }

    const entry = await prisma.accountabilityEntry.create({
      data: {
        title,
        description,
        category,
        amountInCents,
        expenseDate: new Date(expenseDate),
        submitterId: context.supabaseUser.id,
      },
      include: {
        submitter: {
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

    return NextResponse.json({
      entry: {
        id: entry.id,
        title: entry.title,
        description: entry.description,
        category: entry.category,
        amountInCents: entry.amountInCents,
        expenseDate: entry.expenseDate,
        status: entry.status,
        receiptUrl: entry.receiptUrl,
        reviewerNotes: entry.reviewerNotes,
        reviewedAt: entry.reviewedAt,
        createdAt: entry.createdAt,
        submitter: entry.submitter,
        reviewer: entry.reviewer,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
