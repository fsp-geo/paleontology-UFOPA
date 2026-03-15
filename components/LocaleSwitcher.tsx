'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { SiteLocale } from '@/lib/site-locale';

type LocaleSwitcherProps = {
  locale: SiteLocale;
  className?: string;
};

export function LocaleSwitcher({ locale, className }: LocaleSwitcherProps) {
  const pathname = usePathname() || '/';
  const baseClassName = className || '';

  return (
    <div className={`inline-flex items-center gap-3 ${baseClassName}`}>
      <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">Idioma</span>
      <div className="relative inline-grid grid-cols-2 rounded-full bg-surface-container-high p-1 shadow-inner">
        <span
          className={`absolute bottom-1 top-1 w-[calc(50%-0.25rem)] rounded-full bg-primary transition-transform duration-300 ${
            locale === 'en' ? 'translate-x-full' : 'translate-x-0'
          }`}
        />
        <Link
          className={`relative z-10 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] ${
            locale === 'pt-BR' ? 'text-on-primary' : 'text-on-surface-variant hover:text-primary'
          }`}
          href={`/api/preferences/locale?locale=pt-BR&returnTo=${encodeURIComponent(pathname)}`}
        >
          PT
        </Link>
        <Link
          className={`relative z-10 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] ${
            locale === 'en' ? 'text-on-primary' : 'text-on-surface-variant hover:text-primary'
          }`}
          href={`/api/preferences/locale?locale=en&returnTo=${encodeURIComponent(pathname)}`}
        >
          EN
        </Link>
      </div>
    </div>
  );
}
