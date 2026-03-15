import type { ReactNode } from 'react';
import Link from 'next/link';
import { FileText, Globe, Mail, Search } from 'lucide-react';

const footerGroups = [
  {
    title: 'Resources',
    links: [
      { href: '/research-papers', label: 'Research Papers' },
      { href: '/field-guides', label: 'Field Guides' },
      { href: '/dataset-access', label: 'Dataset Access' },
      { href: '/api-documentation', label: 'API Documentation' },
    ],
  },
  {
    title: 'Institution',
    links: [
      { href: '/about-us', label: 'About Us' },
      { href: '/partnerships', label: 'Partnerships' },
      { href: '/petrobras-esg', label: 'Petrobras ESG' },
      { href: '/legal-notices', label: 'Legal Notices' },
    ],
  },
] as const;

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <div className={small ? 'size-5 text-primary' : 'size-6 text-primary'}>
      <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
      </svg>
    </div>
  );
}

type PublicSiteShellProps = {
  children: ReactNode;
};

export function PublicSiteShell({ children }: PublicSiteShellProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background selection:bg-primary-container selection:text-on-primary-container">
      <header className="glass-nav sticky top-0 z-50 flex items-center justify-between border-b border-outline-variant/15 px-6 py-4 lg:px-20">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3 text-on-surface">
            <BrandMark />
            <Link className="font-headline text-xl font-bold leading-tight tracking-tight text-on-surface" href="/">
              PaleoPortal
            </Link>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <Link className="text-sm font-medium text-on-surface-variant hover:text-primary" href="/acesso-ao-portal-interno?origin=public">
              Articles
            </Link>
            <Link className="text-sm font-medium text-on-surface-variant hover:text-primary" href="/about">
              About
            </Link>
            <Link className="text-sm font-medium text-on-surface-variant hover:text-primary" href="/region">
              Region
            </Link>
            <Link className="text-sm font-medium text-on-surface-variant hover:text-primary" href="/contact">
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <label className="hidden items-center gap-2 rounded-lg border border-transparent bg-surface-container-highest px-3 py-1.5 focus-within:border-primary/30 lg:flex">
            <Search aria-hidden="true" className="h-5 w-5 text-outline" />
            <input
              className="w-48 border-none bg-transparent p-0 text-sm text-on-surface placeholder:text-outline focus:outline-none"
              placeholder="Search archives..."
              type="text"
            />
          </label>

          <Link
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold tracking-wide text-on-primary shadow-sm hover:bg-on-primary-fixed-variant lg:px-6"
            href="/acesso-ao-portal-interno?origin=public"
          >
            Internal Area
          </Link>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="border-t border-outline-variant/20 bg-surface-dim px-6 py-16 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-12">
          <div className="flex flex-col items-start justify-between gap-12 md:flex-row">
            <div className="max-w-sm space-y-6">
              <div className="flex items-center gap-3 text-on-surface">
                <BrandMark small />
                <Link className="font-headline text-lg font-bold text-on-surface" href="/">
                  PaleoPortal
                </Link>
              </div>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                A collaborative initiative supported by Petrobras, dedicated to the preservation, documentation, and study
                of regional paleontological treasures.
              </p>
              <div className="flex gap-4 text-outline">
                <Link aria-label="Public portal" className="hover:text-primary" href="/">
                  <Globe className="h-5 w-5" />
                </Link>
                <Link aria-label="Contact" className="hover:text-primary" href="/contact">
                  <Mail className="h-5 w-5" />
                </Link>
                <Link aria-label="Legal notices" className="hover:text-primary" href="/legal-notices">
                  <FileText className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 lg:grid-cols-3">
              {footerGroups.map((group) => (
                <div key={group.title} className="space-y-4">
                  <h4 className="text-xs font-label font-bold uppercase tracking-widest text-on-surface">{group.title}</h4>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link className="hover:text-primary" href={link.href}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="col-span-2 space-y-4 lg:col-span-1">
                <h4 className="text-xs font-label font-bold uppercase tracking-widest text-on-surface">Institutional</h4>
                <Link className="flex cursor-pointer items-center opacity-60 grayscale transition-all hover:grayscale-0" href="/petrobras">
                  <div className="flex h-10 w-auto items-center rounded border border-outline-variant/30 bg-surface-container px-4">
                    <span className="text-[10px] font-bold tracking-tighter">PETROBRAS</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 text-xs text-outline md:flex-row">
            <p>© 2024 PaleoPortal Project. All rights reserved.</p>
            <div className="flex gap-6">
              <Link className="hover:text-on-surface-variant" href="/privacy-policy">
                Privacy Policy
              </Link>
              <Link className="hover:text-on-surface-variant" href="/terms-of-use">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
