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
  const baseClassName = className || 'flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant';

  return (
    <div className={baseClassName}>
      <Link
        className={locale === 'pt-BR' ? 'text-primary' : 'hover:text-primary'}
        href={`/api/preferences/locale?locale=pt-BR&returnTo=${encodeURIComponent(pathname)}`}
      >
        PT
      </Link>
      <span>/</span>
      <Link
        className={locale === 'en' ? 'text-primary' : 'hover:text-primary'}
        href={`/api/preferences/locale?locale=en&returnTo=${encodeURIComponent(pathname)}`}
      >
        EN
      </Link>
    </div>
  );
}
