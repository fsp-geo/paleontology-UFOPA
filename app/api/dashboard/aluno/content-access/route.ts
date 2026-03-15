import { NextResponse } from 'next/server';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { recordContentAccess } from '@/lib/student-dashboard';

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
    const title = String(body.title || '').trim();
    const category = String(body.category || '').trim();
    const contentType = String(body.contentType || '').trim();
    const contentKey = String(body.contentKey || '').trim();
    const sourcePath = body.sourcePath ? String(body.sourcePath) : null;

    if (!title || !category || !contentType || !contentKey) {
      return NextResponse.json({ error: 'Dados de acesso incompletos.' }, { status: 400 });
    }

    const access = await recordContentAccess({
      userId: context.supabaseUser.id,
      title,
      category,
      contentType,
      contentKey,
      sourcePath,
    });

    return NextResponse.json({ access });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Falha ao registrar acesso.' }, { status: 400 });
  }
}
