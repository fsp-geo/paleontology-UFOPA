export type SiteLocale = 'pt-BR' | 'en';

export const SITE_LOCALE_COOKIE = 'site-locale';

export function normalizeSiteLocale(value: string | null | undefined): SiteLocale {
  return value === 'en' ? 'en' : 'pt-BR';
}

export function isPortuguese(locale: SiteLocale) {
  return locale === 'pt-BR';
}
