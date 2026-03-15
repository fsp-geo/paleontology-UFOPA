import type { ComponentType, ReactNode } from 'react';
import Link from 'next/link';
import { BookOpen, BriefcaseBusiness, ClipboardCheck, FolderKanban, LayoutDashboard, LogOut, Newspaper, ScrollText, SendHorizontal, Settings, Wrench, Users } from 'lucide-react';
import { AuthenticatedSessionTracker } from '@/components/AuthenticatedSessionTracker';

type InternalPortalShellProps = {
  title: string;
  eyebrow: string;
  description: string;
  roleCodes: string[];
  currentPath: string;
  userName: string;
  userRoleLabel: string;
  children: ReactNode;
};

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  visible: (roleCodes: string[]) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: '/dashboard/professor',
    label: 'Dashboard Professor',
    icon: LayoutDashboard,
    visible: (roles) => roles.includes('admin') || roles.includes('professor'),
  },
  {
    href: '/dashboard/pesquisador',
    label: 'Dashboard Pesquisador',
    icon: BriefcaseBusiness,
    visible: (roles) => roles.includes('admin') || roles.includes('pesquisador'),
  },
  {
    href: '/dashboard/aluno',
    label: 'Minha Jornada',
    icon: FolderKanban,
    visible: (roles) => roles.includes('aluno'),
  },
  {
    href: '/acervo-digital-de-fosseis',
    label: 'Acervo Publico',
    icon: ScrollText,
    visible: (roles) => roles.some((role) => ['admin', 'professor', 'pesquisador', 'aluno'].includes(role)),
  },
  {
    href: '/wiki-de-estudos-paleontologicos',
    label: 'Wiki / Estudos',
    icon: BookOpen,
    visible: () => true,
  },
  {
    href: '/prestacao-de-contas',
    label: 'Prestacao de Contas',
    icon: BriefcaseBusiness,
    visible: (roles) => roles.includes('professor') || roles.includes('pesquisador'),
  },
  {
    href: '/aprovacoes',
    label: 'Aprovacoes',
    icon: ClipboardCheck,
    visible: (roles) => roles.includes('professor'),
  },
  {
    href: '/submissoes',
    label: 'Submissoes',
    icon: SendHorizontal,
    visible: (roles) => roles.includes('pesquisador'),
  },
  {
    href: '/trabalhos',
    label: 'Trabalhos',
    icon: FolderKanban,
    visible: (roles) => roles.includes('professor') || roles.includes('pesquisador'),
  },
  {
    href: '/posts-site',
    label: 'Posts site',
    icon: Newspaper,
    visible: (roles) => roles.includes('professor') || roles.includes('pesquisador'),
  },
  {
    href: '/gestao-de-usuarios',
    label: 'Gestao de Usuarios',
    icon: Users,
    visible: (roles) => roles.includes('admin'),
  },
];

export function InternalPortalShell({
  title,
  eyebrow,
  description,
  roleCodes,
  currentPath,
  userName,
  userRoleLabel,
  children,
}: InternalPortalShellProps) {
  const visibleItems = NAV_ITEMS.filter((item) => item.visible(roleCodes));
  const initials = userName
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'U';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(157,120,73,0.2),_transparent_24%),linear-gradient(180deg,_#f7f0e6_0%,_#f4ede2_45%,_#efe6da_100%)] text-stone-900">
      <AuthenticatedSessionTracker sourcePrefix="portal" />
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[288px_1fr]">
        <aside className="border-r border-stone-200/80 bg-[#f4ebde]/90 px-6 py-8 backdrop-blur">
          <div className="rounded-[28px] border border-stone-200/80 bg-white/70 p-6 shadow-[0_18px_48px_-24px_rgba(46,31,11,0.35)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-stone-500">PaleoPortal</p>
            <h2 className="mt-4 font-headline text-3xl leading-none text-stone-900">Area Interna</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Navegacao adaptada ao perfil autenticado. Somente os modulos permitidos aparecem no menu.
            </p>
          </div>

          <nav className="mt-8 flex flex-col gap-2">
            {visibleItems.map((item) => {
              const isActive = currentPath === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-stone-900 text-stone-50 shadow-[0_18px_38px_-22px_rgba(46,31,11,0.6)]'
                      : 'text-stone-700 hover:bg-white/80 hover:text-stone-950'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/70 px-4 py-2.5 text-sm font-semibold text-stone-600"
              disabled
              aria-disabled="true"
            >
              <Wrench className="h-4 w-4" />
              Ferramentas
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/70 px-4 py-2.5 text-sm font-semibold text-stone-600"
              disabled
              aria-disabled="true"
            >
              <Settings className="h-4 w-4" />
              Configuracoes
            </button>
            <Link
              href="/sair"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/70 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-950"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-[22px] border border-stone-200/80 bg-white/70 px-4 py-4 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-sm font-bold tracking-[0.18em] text-stone-50">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-stone-900">{userName}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-stone-500">{userRoleLabel}</p>
            </div>
          </div>
        </aside>

        <main className="px-6 py-8 lg:px-10">
          <section className="rounded-[32px] border border-stone-200/80 bg-white/80 px-8 py-8 shadow-[0_24px_70px_-28px_rgba(38,27,12,0.25)] backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-stone-500">{eyebrow}</p>
            <h1 className="mt-4 font-headline text-5xl leading-none text-stone-900">{title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">{description}</p>
          </section>

          <div className="mt-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
