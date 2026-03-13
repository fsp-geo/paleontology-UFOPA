import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { demoStats, isDatabaseConfigured, isLocalDemoMode } from '@/lib/demo-mode';

export async function GET() {
  try {
    if (isLocalDemoMode || !isDatabaseConfigured) {
      return NextResponse.json(demoStats);
    }

    const context = await getCurrentUserContext();
    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!hasAnyAllowedRole(context.roleCodes, ['admin', 'gestor', 'professor', 'pesquisador', 'aluno'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const drillHoles = await prisma.drillHole.findMany({
      where: { createdById: context.supabaseUser.id },
    });

    const rigs = await prisma.rig.findMany();

    const totalMeters = drillHoles.reduce((acc, curr) => acc + (curr.currentDepth || 0), 0);
    const activeRigs = rigs.filter((rig) => rig.status === 'ATIVA').length;
    const completedHoles = drillHoles.filter((hole) => hole.status === 'CONCLUIDO').length;
    const inProgressHoles = drillHoles.filter((hole) => hole.status === 'EM_ANDAMENTO').length;

    const stats = [
      {
        label: 'Metros Perfurados',
        value: `${totalMeters.toLocaleString()}m`,
        type: 'PRODUCTION',
      },
      {
        label: 'Sondas Ativas',
        value: `${activeRigs}/${rigs.length}`,
        type: 'AVAILABILITY',
      },
      {
        label: 'Furos Concluidos',
        value: completedHoles.toString(),
        type: 'DRILLING',
      },
      {
        label: 'Em Andamento',
        value: inProgressHoles.toString(),
        type: 'DRILLING',
      },
    ];

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
