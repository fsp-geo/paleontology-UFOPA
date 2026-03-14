import { redirect } from 'next/navigation';
import { InternalPortalShell } from '@/components/InternalPortalShell';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { getSubmissionSummary, getSubmissions } from '@/lib/submissions';
import { SubmissionWorkspace } from '@/app/submissoes/SubmissionWorkspace';

const ALLOWED_ROLES = ['professor', 'pesquisador'];

export default async function SitePostsPage() {
  const context = await getCurrentUserContext();

  if (!context) {
    redirect('/acesso-ao-portal-interno?next=/posts-site');
  }

  if (!hasAnyAllowedRole(context.roleCodes, ALLOWED_ROLES)) {
    redirect(context.homePath);
  }

  const [submissions, summary] = await Promise.all([
    getSubmissions(context.roleCodes, context.supabaseUser.id, 'site_post'),
    getSubmissionSummary(context.roleCodes, context.supabaseUser.id),
  ]);

  return (
    <InternalPortalShell
      title="Posts do Site"
      eyebrow="Fluxo Editorial"
      description="Propostas editoriais e textos do portal. Pesquisadores submetem rascunhos e professores decidem a aprovacao para publicacao."
      roleCodes={context.roleCodes}
      currentPath="/posts-site"
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
        filterType="site_post"
        reviewMode={context.roleCodes.includes('professor')}
      />
    </InternalPortalShell>
  );
}
