import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isSupabaseConfigured } from './lib/demo-mode'
import { canAccessPath } from './lib/access-control'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/stitch/acesso-ao-portal-interno.html') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/acesso-ao-portal-interno'
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }

  if (!isSupabaseConfigured) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const protectedPaths = [
    '/gestao-de-usuarios',
    '/dashboard',
    '/prestacao-de-contas',
    '/aprovacoes',
    '/submissoes',
    '/trabalhos',
    '/posts-site',
    '/acervo-digital-de-fosseis',
    '/wiki-de-estudos-paleontologicos',
  ]
  const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  if (!user && isProtectedPath) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/acesso-ao-portal-interno'
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (user && isProtectedPath) {
    try {
      const profileResponse = await fetch(`${request.nextUrl.origin}/api/auth/profile?next=${encodeURIComponent(pathname)}`, {
        headers: {
          cookie: request.headers.get('cookie') ?? '',
        },
        cache: 'no-store',
      })

      if (profileResponse.ok) {
        const profile = await profileResponse.json()

        if (!canAccessPath(pathname, profile.roleCodes ?? [])) {
          const fallbackUrl = request.nextUrl.clone()
          fallbackUrl.pathname = profile.homePath || '/dashboard'
          fallbackUrl.search = ''
          return NextResponse.redirect(fallbackUrl)
        }
      }
    } catch {}
  }

  if (user && pathname === '/acesso-ao-portal-interno') {
    const profileResponse = await fetch(`${request.nextUrl.origin}/api/auth/profile`, {
      headers: {
        cookie: request.headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    }).catch(() => null)

    if (profileResponse?.ok) {
      const profile = await profileResponse.json()
      const dashboardUrl = request.nextUrl.clone()
      dashboardUrl.pathname = profile.homePath || '/dashboard'
      dashboardUrl.search = ''
      return NextResponse.redirect(dashboardUrl)
    }

    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    dashboardUrl.search = ''
    return NextResponse.redirect(dashboardUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|map|woff|woff2|ttf|ico)$).*)',
  ],
}
