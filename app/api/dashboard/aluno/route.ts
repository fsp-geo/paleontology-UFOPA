import { NextResponse } from 'next/server';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { getStudentDashboardData } from '@/lib/student-dashboard';

const ALLOWED_ROLES = ['admin', 'gestor', 'professor', 'aluno'];

export async function GET() {
  try {
    const context = await getCurrentUserContext();

    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasAnyAllowedRole(context.roleCodes, ALLOWED_ROLES)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const dashboard = await getStudentDashboardData(context.supabaseUser.id);
    return NextResponse.json({ dashboard });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Falha ao carregar dashboard.' }, { status: 500 });
  }
}
