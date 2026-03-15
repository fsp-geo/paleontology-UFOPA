import { redirect } from 'next/navigation';
import { InternalPortalShell } from '@/components/InternalPortalShell';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { getSubmissionSummary, getSubmissions } from '@/lib/submissions';
import { SubmissionWorkspace } from './SubmissionWorkspace';

const ALLOWED_ROLES = ['pesquisador'];

export default async function SubmissionsPage() {
  const context = await getCurrentUserContext();

  if (!context) {
    redirect('/acesso-ao-portal-interno?next=/submissoes');
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
      title="Submissoes"
      eyebrow="Fluxo do Pesquisador"
      description="Envie trabalhos e propostas de posts do site a partir de uma unica area. Os materiais seguem para avaliacao do professor responsavel."
      roleCodes={context.roleCodes}
      currentPath="/submissoes"
      userName={context.profile?.name || context.supabaseUser.email || 'Pesquisador'}
      userRoleLabel="Pesquisador"
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
        allowCreate
      />
    </InternalPortalShell>
  );
}
