import Link from 'next/link';
import type {ReactNode} from 'react';

export function MaterialIcon({
  children,
  className = '',
  filled = false,
}: {
  children: ReactNode;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`}}
    >
      {children}
    </span>
  );
}

export function PublicHeader() {
  const nav = [
    ['Articles', '/wiki-de-estudos-paleontologicos'],
    ['About', '/acervo-digital-de-fosseis'],
    ['Region', '/prestacao-de-contas'],
    ['Contact', '/acesso-ao-portal-interno'],
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-outline-variant/15 bg-surface/80 px-6 py-4 backdrop-blur-md lg:px-20">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-3 text-on-surface">
          <div className="size-6 text-primary">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="font-headline text-xl font-bold leading-tight tracking-tight">PaleoPortal</h2>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map(([label, href]) => (
            <Link key={label} href={href} className="text-sm font-medium text-on-surface-variant hover:text-primary">
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden items-center gap-2 rounded-lg border border-transparent bg-surface-container-highest px-3 py-1.5 lg:flex">
          <MaterialIcon className="text-[20px] text-outline">search</MaterialIcon>
          <input className="w-48 bg-transparent p-0 text-sm placeholder:text-outline" placeholder="Search archives..." />
        </div>
        <Link href="/acesso-ao-portal-interno" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold tracking-wide text-on-primary shadow-sm hover:bg-on-primary-fixed-variant">
          Internal Area
        </Link>
      </div>
    </header>
  );
}

export function PaleoFooter() {
  return (
    <footer className="border-t border-outline-variant/20 bg-surface-dim px-6 py-16 lg:px-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-6">
          <div className="flex items-center gap-3 text-on-surface">
            <div className="size-5 text-primary">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="font-headline text-lg font-bold">PaleoPortal</h2>
          </div>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            A collaborative initiative supported by Petrobras, dedicated to the preservation, documentation, and study of regional paleontological treasures.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-12 lg:grid-cols-3">
          {[
            ['Resources', ['Research Papers', 'Field Guides', 'Dataset Access', 'API Documentation']],
            ['Institution', ['About Us', 'Partnerships', 'Petrobras ESG', 'Legal Notices']],
            ['Institutional', ['PETROBRAS']],
          ].map(([title, items]) => (
            <div key={title as string} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface">{title}</h4>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                {(items as string[]).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function PaleoFooterCompact() {
  return (
    <footer className="border-t border-outline-variant/15 bg-surface-container px-8 py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
          <span className="font-headline text-2xl text-primary">PaleoPortal</span>
          <p className="max-w-xs text-sm text-on-surface-variant">
            A digital stratigraphy platform for institutional research and paleontological archiving.
          </p>
          <p className="text-[10px] uppercase tracking-widest text-outline">© 2024 Petrobras Paleontology Division. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

type SidebarItem = {
  label: string;
  href: string;
  icon: string;
  active?: boolean;
};

export function InternalSidebar({
  title,
  subtitle,
  items,
  userName,
  userRole,
  userImage,
}: {
  title: string;
  subtitle: string;
  items: SidebarItem[];
  userName: string;
  userRole: string;
  userImage: string;
}) {
  return (
    <aside className="hide-scrollbar sticky top-0 hidden h-screen w-72 flex-col overflow-y-auto border-r border-outline-variant/15 bg-surface-container lg:flex">
      <div className="p-8">
        <div className="mb-6 flex items-center gap-3">
          <img alt="User Profile" className="h-12 w-12 rounded-full object-cover" src={userImage} />
          <div>
            <h2 className="font-headline text-lg font-semibold leading-tight text-on-surface">{title}</h2>
            <p className="text-xs tracking-wider text-on-surface-variant">{subtitle}</p>
          </div>
        </div>
        <nav className="mt-8 flex flex-col gap-2">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 rounded-md px-4 py-3 ${
                item.active
                  ? 'bg-primary/10 font-semibold text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <MaterialIcon filled={item.active}>{item.icon}</MaterialIcon>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-8">
        <div className="rounded-md bg-surface-container-high p-4">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-outline">{userName}</p>
          <p className="text-xs font-medium text-on-surface">{userRole}</p>
        </div>
      </div>
    </aside>
  );
}

export function InternalTopBar({simpleTitle = 'PaleoPortal'}: {simpleTitle?: string}) {
  return (
    <header className="glass-nav sticky top-0 z-30 flex h-20 items-center justify-between border-b border-outline-variant/15 px-6 md:px-12">
      <div className="flex items-center gap-8">
        <h1 className="font-headline text-2xl font-bold tracking-tight text-primary">{simpleTitle}</h1>
        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/" className="text-sm text-on-surface-variant hover:text-primary">Public Blog</Link>
          <Link href="/acesso-ao-portal-interno" className="text-sm font-semibold text-on-surface">Internal Area</Link>
          <Link href="/wiki-de-estudos-paleontologicos" className="text-sm text-on-surface-variant hover:text-primary">Resources</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden w-64 items-center rounded-full bg-surface-container-highest px-4 py-2 md:flex">
          <MaterialIcon className="text-sm text-outline">search</MaterialIcon>
          <input className="ml-2 w-full bg-transparent text-sm placeholder:text-outline" placeholder="Search archive..." />
        </div>
        <Link href="/acesso-ao-portal-interno" className="rounded-sm bg-primary px-6 py-2 text-sm font-bold tracking-wide text-on-primary shadow-sm hover:brightness-110">
          Login
        </Link>
      </div>
    </header>
  );
}

export function InternalFooter() {
  return (
    <footer className="mt-auto flex flex-col items-center justify-between gap-8 border-t border-outline-variant/15 bg-surface-container-low px-12 py-12 md:flex-row">
      <p className="text-xs tracking-wider text-outline">© 2024 Petrobras Paleontology Division. All rights reserved.</p>
      <div className="flex gap-8">
        <Link href="/acesso-ao-portal-interno" className="text-xs text-on-surface-variant hover:text-primary">Contact Us</Link>
        <Link href="/" className="text-xs text-on-surface-variant hover:text-primary">Privacy Policy</Link>
        <Link href="/wiki-de-estudos-paleontologicos" className="text-xs text-on-surface-variant hover:text-primary">Institutional Site</Link>
      </div>
    </footer>
  );
}
