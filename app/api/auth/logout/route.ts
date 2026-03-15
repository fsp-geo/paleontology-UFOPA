import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/demo-mode';

function buildLogoutResponse(request: NextRequest) {
  const loginUrl = new URL('/acesso-ao-portal-interno?origin=public', request.url);
  return NextResponse.json({ ok: true, redirectTo: loginUrl.toString() });
}

function clearSupabaseCookies(request: NextRequest, response: NextResponse) {
  request.cookies
    .getAll()
    .map((cookie) => cookie.name)
    .filter((name) => name.includes('sb-') || name.includes('supabase-auth-token'))
    .forEach((name) => {
      response.cookies.set({
        name,
        value: '',
        expires: new Date(0),
        path: '/',
      });
    });
}

async function performLogout(request: NextRequest) {
  const response = buildLogoutResponse(request);

  if (!isSupabaseConfigured) {
    clearSupabaseCookies(request, response);
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  try {
    await supabase.auth.signOut();
  } catch {
    // Fall through to explicit cookie cleanup.
  }

  clearSupabaseCookies(request, response);
  return response;
}

export async function POST(request: NextRequest) {
  return performLogout(request);
}

export async function GET(request: NextRequest) {
  const response = await performLogout(request);
  const redirectTo = new URL('/acesso-ao-portal-interno?origin=public', request.url);
  const redirectResponse = NextResponse.redirect(redirectTo);

  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}
