import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileUp, FolderOpenDot, Newspaper, Wallet } from 'lucide-react';
import { InternalPortalShell } from '@/components/InternalPortalShell';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { getAccountabilitySummary } from '@/lib/accountability';

const ALLOWED_ROLES = ['admin', 'gestor', 'pesquisador'];

export default async function ResearcherDashboardPage() {
  const context = await getCurrentUserContext();

  if (!context) {
    redirect('/acesso-ao-portal-interno?next=/dashboard/pesquisador');
  }

  if (!hasAnyAllowedRole(context.roleCodes, ALLOWED_ROLES)) {
    redirect(context.homePath);
  }

  const accountability = await getAccountabilitySummary(context.roleCodes, context.supabaseUser.id);

  const cards = [
    {
      title: 'Submissoes',
      value: accountability.totalEntries,
      description: 'Quantidade de prestacoes e materiais enviados pelo seu perfil.',
      href: '/prestacao-de-contas',
      icon: FileUp,
    },
    {
      title: 'Em analise',
      value: accountability.pendingEntries,
      description: 'Itens aguardando retorno do professor revisor.',
      href: '/prestacao-de-contas',
      icon: Wallet,
    },
    {
      title: 'Trabalhos',
      value: 'Producoes',
      description: 'Espaco de organizacao dos seus materiais e relatorios.',
      href: '/wiki-de-estudos-paleontologicos',
      icon: FolderOpenDot,
    },
    {
      title: 'Posts do site',
      value: 'Colaboracao',
      description: 'Submeta conteudo para publicacao no portal institucional.',
      href: '/wiki-de-estudos-paleontologicos',
      icon: Newspaper,
    },
  ];

  return (
    <InternalPortalShell
      title="Dashboard Pesquisador"
      eyebrow="Painel de Pesquisa"
      description="Este painel concentra submissao de materiais, acompanhamento da prestacao de contas e atalhos para os modulos de acervo e estudos."
      roleCodes={context.roleCodes}
      currentPath="/dashboard/pesquisador"
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
