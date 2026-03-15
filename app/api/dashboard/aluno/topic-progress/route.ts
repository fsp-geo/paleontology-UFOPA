import { NextResponse } from 'next/server';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { upsertTopicProgress } from '@/lib/student-dashboard';

const ALLOWED_ROLES = ['admin', 'gestor', 'professor', 'aluno'];

export async function POST(request: Request) {
  try {
    const context = await getCurrentUserContext();

    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasAnyAllowedRole(context.roleCodes, ALLOWED_ROLES)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    const topicSlug = String(body.topicSlug || '').trim();
    const title = String(body.title || '').trim();
    const category = String(body.category || '').trim();
    const percentComplete = Number(body.percentComplete);
    const minutesSpent = body.minutesSpent == null ? undefined : Number(body.minutesSpent);

    if (!topicSlug || !title || !category || !Number.isFinite(percentComplete)) {
      return NextResponse.json({ error: 'Dados de progresso invalidos.' }, { status: 400 });
    }

    const progress = await upsertTopicProgress({
      userId: context.supabaseUser.id,
      topicSlug,
      title,
      category,
      description: typeof body.description === 'string' ? body.description : undefined,
      estimatedMinutes: body.estimatedMinutes == null ? undefined : Number(body.estimatedMinutes),
      percentComplete,
      minutesSpent,
    });

    return NextResponse.json({ progress });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Falha ao atualizar progresso.' }, { status: 400 });
  }
}
