import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthenticatedSessionTracker } from '@/components/AuthenticatedSessionTracker';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import type { SiteLocale } from '@/lib/site-locale';
import { isPortuguese } from '@/lib/site-locale';

type StudentPortalShellProps = {
  activeNav: 'learning' | 'archive' | 'wiki';
  pageTitle: string;
  displayName: string;
  profileLabel: string;
  avatarInitials: string;
  locale: SiteLocale;
  children: ReactNode;
};

function avatarDataUrl(label: string) {
  const safeLabel = String(label || 'U').slice(0, 2).toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="80" fill="#2f2418" />
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Manrope, Arial, sans-serif" font-size="58" font-weight="700" letter-spacing="4" fill="#f8f0e3">${safeLabel}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function StudentPortalShell({
  activeNav,
  pageTitle,
  displayName,
  profileLabel,
  avatarInitials,
  locale,
  children,
}: StudentPortalShellProps) {
  const avatarSrc = avatarDataUrl(avatarInitials);
  const pt = isPortuguese(locale);
  const navItems = [
    { key: 'learning', href: '/dashboard/aluno', label: pt ? 'Minha Jornada' : 'My Learning', icon: 'dashboard' },
    { key: 'archive', href: '/acervo-digital-de-fosseis', label: pt ? 'Acervo de Fosseis' : 'Fossil Archive', icon: 'database' },
    { key: 'wiki', href: '/wiki-de-estudos-paleontologicos', label: pt ? 'Wiki Educacional' : 'Educational Wiki', icon: 'menu_book' },
  ] as const;

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes active-day-pulse {
              0%, 100% { opacity: 0.8; transform: translateY(0); }
              50% { opacity: 1; transform: translateY(-2px); }
            }
          `,
        }}
      />
      <AuthenticatedSessionTracker sourcePrefix="student-portal" />

      <nav className="glass-nav fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-outline-variant/15 px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <span className="font-headline text-[2rem] font-semibold leading-none text-primary">Strata Archive</span>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <label className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
              search
            </span>
            <input
              className="w-[16rem] rounded-full border-none bg-surface-container-highest py-2.5 pl-10 pr-4 text-base focus:ring-1 focus:ring-primary xl:w-[18rem]"
              placeholder={pt ? 'Pesquisar acervo...' : 'Search archive...'}
              type="text"
            />
          </label>
          <button className="relative rounded-full p-2 transition-colors hover:bg-surface-container" type="button">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-tertiary"></span>
          </button>
          <div className="h-8 w-8 overflow-hidden rounded-full border border-outline-variant/30 bg-surface-container-highest">
            <Image alt={displayName} className="h-full w-full object-cover" height={32} src={avatarSrc} unoptimized width={32} />
          </div>
        </div>
      </nav>

      <div className="flex min-h-screen pt-16">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[19rem] flex-col border-r border-outline-variant/15 bg-surface-container p-6 lg:flex">
          <div className="mb-10">
            <div className="mb-1 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-primary text-on-primary">
                <span className="material-symbols-outlined">account_balance</span>
              </div>
              <div>
                <h2 className="font-headline text-xl leading-none">Strata Archive</h2>
                <p className="mt-1 text-[11px] font-label uppercase tracking-widest text-on-surface-variant">My Learning</p>
              </div>
            </div>
          </div>

          <nav className="flex-grow space-y-2">
            {navItems.map((item) => {
              const isActive = item.key === activeNav;
              return (
                <Link
                  key={item.href}
                  prefetch={false}
                  className={
                    isActive
                      ? 'flex items-center gap-3 rounded px-5 py-3.5 font-medium text-primary bg-surface-container-high transition-all'
                      : 'flex items-center gap-3 rounded px-5 py-3.5 font-medium text-on-surface-variant transition-all hover:bg-surface-container-highest'
                  }
                  href={item.href}
                >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-label text-base">{item.label}</span>
              </Link>
            );
          })}

            <button
              className="flex w-full cursor-not-allowed items-center gap-3 rounded px-5 py-3.5 font-medium text-on-surface-variant/60"
              disabled
              type="button"
            >
              <span className="material-symbols-outlined">construction</span>
              <span className="font-label text-base">{pt ? 'Ferramentas de Estudo' : 'Study Tools'}</span>
            </button>
          </nav>

          <div className="mt-auto border-t border-outline-variant/30 pt-6">
            <div className="rounded-xl bg-secondary-container p-4 text-on-secondary-container">
              <p className="mb-2 text-[11px] font-label uppercase tracking-wider">{pt ? 'Nota da Curadoria' : 'Curator Note'}</p>
              <p className="text-[15px] italic leading-relaxed">
                &quot;Nature is an infinite sphere of which the center is everywhere.&quot;
              </p>
            </div>

            <div className="mt-6 space-y-1">
              <div className="px-4 py-2">
                <LocaleSwitcher locale={locale} />
              </div>
              <button
                className="flex w-full cursor-not-allowed items-center gap-4 px-4 py-2.5 text-left text-sm text-on-surface-variant/60"
                disabled
                type="button"
            >
              <span className="material-symbols-outlined text-xl">settings</span>
              <span className="font-body">{pt ? 'Configuracoes' : 'Settings'}</span>
            </button>
            <Link
              prefetch={false}
              className="flex items-center gap-4 px-4 py-2.5 text-sm text-on-surface-variant transition-colors hover:text-error"
              href="/sair"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              <span className="font-body">{pt ? 'Sair' : 'Logout'}</span>
            </Link>
          </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl bg-surface-container-high px-4 py-3">
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <Image alt={displayName} className="h-full w-full object-cover" height={40} src={avatarSrc} unoptimized width={40} />
              </div>
              <div>
                <p className="text-sm font-bold leading-none">{displayName}</p>
                <p className="mt-1 text-[10px] font-label uppercase tracking-wider text-on-surface-variant">{profileLabel}</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-6 pb-16 pt-8 md:px-8 xl:px-10 2xl:px-12">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <div>
              <p className="text-[11px] font-label uppercase tracking-widest text-on-surface-variant">Strata Archive</p>
              <h2 className="font-headline text-2xl text-on-surface">{pageTitle}</h2>
            </div>
            <Link className="text-sm font-semibold text-primary" href="/sair" prefetch={false}>
              {pt ? 'Sair' : 'Logout'}
            </Link>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
