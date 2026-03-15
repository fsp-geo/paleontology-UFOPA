import { NextRequest, NextResponse } from 'next/server';
import { SITE_LOCALE_COOKIE, normalizeSiteLocale } from '@/lib/site-locale';
import { sanitizeNextPath } from '@/lib/access-control';

export async function GET(request: NextRequest) {
  const locale = normalizeSiteLocale(request.nextUrl.searchParams.get('locale'));
  const returnTo = sanitizeNextPath(request.nextUrl.searchParams.get('returnTo')) || '/';
  const response = NextResponse.redirect(new URL(returnTo, request.url));

  response.cookies.set({
    name: SITE_LOCALE_COOKIE,
    value: locale === 'en' ? 'en' : 'pt-BR',
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
