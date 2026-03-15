import { redirect } from 'next/navigation';
import { InternalPortalShell } from '@/components/InternalPortalShell';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { getSubmissionSummary, getSubmissions } from '@/lib/submissions';
import { SubmissionWorkspace } from '@/app/submissoes/SubmissionWorkspace';

const ALLOWED_ROLES = ['professor'];

export default async function ApprovalsPage() {
  const context = await getCurrentUserContext();

  if (!context) {
    redirect('/acesso-ao-portal-interno?next=/aprovacoes');
  }

  if (!hasAnyAllowedRole(context.roleCodes, ALLOWED_ROLES)) {
    redirect(context.homePath);
  }

  const [submissions, summary] = await Promise.all([
    getSubmissions(context.roleCodes, context.supabaseUser.id),
    getSubmissionSummary(context.roleCodes, context.supabaseUser.id),
  ]);

  return (
    <InternalPortalShell
      title="Aprovacoes"
      eyebrow="Fila do Professor"
      description="Aqui o professor acompanha todos os trabalhos e posts em andamento, com foco nos materiais pendentes para revisao e aprovacao."
      roleCodes={context.roleCodes}
      currentPath="/aprovacoes"
      userName={context.profile?.name || context.supabaseUser.email || 'Professor'}
      userRoleLabel="Professor"
    >
      <SubmissionWorkspace
        roleCodes={context.roleCodes}
        initialSubmissions={submissions.map((submission) => ({
          ...submission,
          reviewedAt: submission.reviewedAt?.toISOString() || null,
          publishedAt: submission.publishedAt?.toISOString() || null,
          createdAt: submission.createdAt.toISOString(),
        }))}
        initialSummary={summary}
        reviewMode
      />
    </InternalPortalShell>
  );
}
