import { cookies } from 'next/headers';
import { normalizeSiteLocale } from '@/lib/site-locale';

export async function getSiteLocale() {
  const cookieStore = await cookies();
  return normalizeSiteLocale(cookieStore.get('site-locale')?.value);
}
