import { redirect } from 'next/navigation';
import { InternalPortalShell } from '@/components/InternalPortalShell';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { getSubmissionSummary, getSubmissions } from '@/lib/submissions';
import { SubmissionWorkspace } from '@/app/submissoes/SubmissionWorkspace';

const ALLOWED_ROLES = ['professor', 'pesquisador'];

export default async function WorksPage() {
  const context = await getCurrentUserContext();

  if (!context) {
    redirect('/acesso-ao-portal-interno?next=/trabalhos');
  }

  if (!hasAnyAllowedRole(context.roleCodes, ALLOWED_ROLES)) {
    redirect(context.homePath);
  }

  const [submissions, summary] = await Promise.all([
    getSubmissions(context.roleCodes, context.supabaseUser.id, 'work'),
    getSubmissionSummary(context.roleCodes, context.supabaseUser.id),
  ]);

  return (
    <InternalPortalShell
      title="Trabalhos"
      eyebrow="Producoes"
      description="Area dedicada aos trabalhos submetidos. Pesquisadores acompanham o proprio material e professores revisam o conjunto de itens pendentes."
      roleCodes={context.roleCodes}
      currentPath="/trabalhos"
      userName={context.profile?.name || context.supabaseUser.email || 'Usuario'}
      userRoleLabel={context.roleCodes.includes('professor') ? 'Professor' : 'Pesquisador'}
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
        filterType="work"
        reviewMode={context.roleCodes.includes('professor')}
      />
    </InternalPortalShell>
  );
}
