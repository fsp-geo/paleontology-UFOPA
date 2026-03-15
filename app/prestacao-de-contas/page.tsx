import { redirect } from 'next/navigation';
import { InternalPortalShell } from '@/components/InternalPortalShell';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { getAccountabilityEntries, getAccountabilitySummary } from '@/lib/accountability';
import { AccountabilityWorkspace } from './AccountabilityWorkspace';

const ALLOWED_ROLES = ['professor', 'pesquisador'];

export default async function AccountabilityPage() {
  const context = await getCurrentUserContext();

  if (!context) {
    redirect('/acesso-ao-portal-interno?next=/prestacao-de-contas');
  }

  if (!hasAnyAllowedRole(context.roleCodes, ALLOWED_ROLES)) {
    redirect(context.homePath);
  }

  const [entries, summary] = await Promise.all([
    getAccountabilityEntries(context.roleCodes, context.supabaseUser.id),
    getAccountabilitySummary(context.roleCodes, context.supabaseUser.id),
  ]);

  return (
    <InternalPortalShell
      title="Prestacao de Contas"
      eyebrow="Fluxo Financeiro"
      description="Pesquisadores registram despesas e acompanham o historico. Professores recebem as prestacoes pendentes e fazem a aprovacao ou devolucao diretamente pelo portal."
      roleCodes={context.roleCodes}
      currentPath="/prestacao-de-contas"
      userName={context.profile?.name || context.supabaseUser.email || 'Usuario'}
      userRoleLabel={context.roleCodes.includes('professor') ? 'Professor' : 'Pesquisador'}
    >
      <AccountabilityWorkspace
        roleCodes={context.roleCodes}
        initialSummary={summary}
        initialEntries={entries.map((entry) => ({
          id: entry.id,
          title: entry.title,
          description: entry.description,
          category: entry.category,
          amountInCents: entry.amountInCents,
          expenseDate: entry.expenseDate.toISOString(),
          status: entry.status,
          receiptUrl: entry.receiptUrl,
          reviewerNotes: entry.reviewerNotes,
          reviewedAt: entry.reviewedAt?.toISOString() || null,
          createdAt: entry.createdAt.toISOString(),
          submitter: entry.submitter,
          reviewer: entry.reviewer,
        }))}
      />
    </InternalPortalShell>
  );
}
