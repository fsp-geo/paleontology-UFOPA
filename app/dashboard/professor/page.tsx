import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CheckCheck, Files, ScrollText, Wallet } from 'lucide-react';
import { InternalPortalShell } from '@/components/InternalPortalShell';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { getAccountabilitySummary } from '@/lib/accountability';

const ALLOWED_ROLES = ['admin', 'gestor', 'professor'];

export default async function ProfessorDashboardPage() {
  const context = await getCurrentUserContext();

  if (!context) {
    redirect('/acesso-ao-portal-interno?next=/dashboard/professor');
  }

  if (!hasAnyAllowedRole(context.roleCodes, ALLOWED_ROLES)) {
    redirect(context.homePath);
  }

  const accountability = await getAccountabilitySummary(context.roleCodes, context.supabaseUser.id);

  const cards = [
    {
      title: 'Aprovacoes pendentes',
      value: accountability.pendingEntries,
      description: 'Prestacoes aguardando avaliacao do professor responsavel.',
      href: '/aprovacoes',
      icon: CheckCheck,
    },
    {
      title: 'Prestacoes aprovadas',
      value: accountability.approvedEntries,
      description: 'Historico aprovado no fluxo financeiro do portal.',
      href: '/prestacao-de-contas',
      icon: Wallet,
    },
    {
      title: 'Posts do site',
      value: 'Editorial',
      description: 'Curadoria de publicacoes, chamadas e comunicados institucionais.',
      href: '/posts-site',
      icon: Files,
    },
    {
      title: 'Acervo e wiki',
      value: '2 modulos',
      description: 'Acesso rapido ao acervo digital e aos estudos colaborativos.',
      href: '/acervo-digital-de-fosseis',
      icon: ScrollText,
    },
  ];

  return (
    <InternalPortalShell
      title="Dashboard Professor"
      eyebrow="Painel Academico"
      description="A partir daqui o perfil de professor acompanha aprovacoes, acessa a prestacao de contas, revisa o conteudo do site e navega pelos modulos internos liberados."
      roleCodes={context.roleCodes}
      currentPath="/dashboard/professor"
      userName={context.profile?.name || context.supabaseUser.email || 'Professor'}
      userRoleLabel="Professor"
    >
      <section className="grid gap-5 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-[26px] border border-stone-200/80 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-34px_rgba(46,31,11,0.45)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-900 text-stone-50">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">{card.title}</p>
              <p className="mt-3 font-headline text-4xl leading-none text-stone-900">{card.value}</p>
              <p className="mt-4 text-sm leading-7 text-stone-600">{card.description}</p>
            </Link>
          );
        })}
      </section>
    </InternalPortalShell>
  );
}
