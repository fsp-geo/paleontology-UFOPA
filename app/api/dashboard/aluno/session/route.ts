import { NextResponse } from 'next/server';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { recordLearningSession } from '@/lib/student-dashboard';

const ALLOWED_ROLES = ['admin', 'gestor', 'professor', 'pesquisador', 'aluno'];

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
    const durationMinutes = Number(body.durationMinutes);
    const source = typeof body.source === 'string' ? body.source : 'site';

    const profile = await recordLearningSession(context.supabaseUser.id, durationMinutes, source);
    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Falha ao registrar sessao.' }, { status: 400 });
  }
}
