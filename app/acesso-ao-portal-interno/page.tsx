'use client';

import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, FlaskConical, Globe, Landmark, LibraryBig, Lock, Mail, Mountain, Orbit } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export default function AccessPortalPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPath] = useState(() => {
    if (typeof window === 'undefined') {
      return '/dashboard/professor';
    }

    return new URLSearchParams(window.location.search).get('next') || '/dashboard/professor';
  });

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    let active = true;

    const resolveRedirect = async () => {
      try {
        const response = await fetch(`/api/auth/profile?next=${encodeURIComponent(nextPath)}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          router.replace('/dashboard');
          return;
        }

        const data = await response.json();
        if (active) {
          router.replace(data.redirectPath || '/dashboard');
        }
      } catch {
        if (active) {
          router.replace('/dashboard');
        }
      }
    };

    resolveRedirect();

    return () => {
      active = false;
    };
  }, [loading, nextPath, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!supabase) {
      setError('Servico de autenticacao indisponivel no momento.');
      setSubmitting(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError('Credenciais invalidas. Verifique seu email e senha.');
      setSubmitting(false);
      return;
    }

    if (data.user) {
      try {
        await fetch('/api/auth/sync', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({user: data.user}),
        });
        const profileResponse = await fetch(`/api/auth/profile?next=${encodeURIComponent(nextPath)}`, {
          cache: 'no-store',
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          router.replace(profileData.redirectPath || '/dashboard');
          router.refresh();
          return;
        }
      } catch {}

      router.replace('/dashboard');
      router.refresh();
      return;
    }

    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Image
          alt="Macro texture of ancient sedimentary rock"
          className="h-full w-full object-cover opacity-10 mix-blend-multiply"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDw5UJ-S-_XjPCxRhwToMX44Tjs14DNMKheA1SSBza7ut8QwGu2OMu_knj_TnMNaVqIp3xk8yjt9fpvm2kIoAkAZ3SgeqwIXRN_YfbocIHPK0zeFKoU4ti5OhlNXj50oWBdNnJ1kX6kKf_zHBBAq9jVXjUgM-pDbEd-Pu6S8n4Dnug9N9Zl7ejig4wXJV4x03_qJ--LVDtcBYrJxqryrD5ZOg01L28w6bALxZKs7gcZn1ctxBdugtAxGzoh1pazVYdHP7iAzI-sB6U"
          fill
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60" />
      </div>

      <main className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_24px_48px_-12px_rgba(30,27,20,0.08)] lg:grid-cols-12">
        <div className="relative overflow-hidden bg-surface-container p-12 lg:col-span-5 lg:p-16">
          <div className="relative z-10">
            <div className="mb-12 flex items-center gap-3">
              <div className="lithic-gradient flex h-10 w-10 items-center justify-center rounded-sm text-on-primary">
                <Mountain aria-hidden="true" className="h-6 w-6" fill="currentColor" strokeWidth={1.8} />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Internal Portal</span>
            </div>
            <h1 className="font-headline mb-6 text-5xl leading-tight text-primary lg:text-6xl">PaleoPortal</h1>
            <p className="font-headline mb-8 text-2xl italic text-on-surface-variant">Strata Archive</p>
            <div className="mb-8 h-px w-12 bg-outline-variant/30" />
            <p className="max-w-xs leading-relaxed text-on-surface-variant opacity-80">
              Access the world&apos;s most comprehensive digital stratigraphy and fossilized record database.
            </p>
          </div>

          <div className="relative z-10 mt-12">
            <div className="mb-4 flex -space-x-3">
              {[
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDQArQRWsy6SAXi7JMZItph8WiL4sSwPVDOLeL2Sx4FQiG4E2cHp2FmfHIMEe9X6lptJoZFxjDQKByTPFKj2WeRNKEcnuyi3LRsE6sho1z0QFi8ZXRIEJAIxvHTv19CZD76DbOxAlgu9FQebw_sSpcjv9szDEQT112oQXBu5T6aywkv3YKsALeWoYboaUopeW7yJt_PX26dhM10tncdrNanKNQC8OAiO2ytOl99wIfj5Wg_Ng7oWuP71dIA8LWzKzAUDHmnyrqbMMo',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuB9GQUnhAeuyNXYrdOYi12qUIZXUBO8PfzvXxG6UfLwTL6DPHRoveqBkvpZU_EkTDPSNVpOgpZC1qVhzYaEdJOi4Hr30-l8R0tEOYjHe2ImR7ZpR14CQZ8yGYRAzfYQ11nmgiUMT5qG2ycaJPZVZTa6u9hklZi__JYdnDBwXPXvpcGwv49PngRUfna696x_T14MFh2DDReNt8KLEBjhLN10kkUbdHDAQInJnerVk6EAH4pVnB7PD_7MMHZXZ-pgQ8OCnqJ-8x9Vtco',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuAzjMOZEl6uBc_ewAm-yIcvCw_cAwH-Zyf6lBmhZNU5MMsH8K7gdchQi43_V-6IF-KgEsklyv8cWLt-nPy6qE2rWGgO7vNi3If-gO9vHz3KJQy2suchEDbKFxomzBkUrYvBCTo0R-IB4FkEWOzO1fP35ZbeLvHKXQxC-99auURMoADVV3x1N6kB33HGS3LQu0hQrwjC9qLOXe2sNxKrm9_JenhyLHFsVt-DDeytU2NIhKBV7fFKauEzJ2HasBmLIuOoxsYM-CgTse0',
              ].map((src, index) => (
                <Image
                  key={src}
                  alt="Researcher profile"
                  className="h-10 w-10 rounded-full border-2 border-surface-container-lowest object-cover"
                  src={src}
                  width={40}
                  height={40}
                  sizes="40px"
                  priority={index === 0}
                />
              ))}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-secondary-container text-[10px] font-bold text-on-secondary-container">
                +2k
              </div>
            </div>
            <p className="text-xs font-label tracking-wider text-on-surface-variant">JOINING 2,400+ ACTIVE RESEARCHERS</p>
          </div>

          <Orbit aria-hidden="true" className="pointer-events-none absolute -bottom-10 -right-10 h-[240px] w-[240px] rotate-12 text-surface-variant/40" strokeWidth={1.2} />
        </div>

        <div className="flex flex-col justify-center bg-surface-container-lowest p-12 lg:col-span-7 lg:p-20">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-10">
              <h2 className="font-headline mb-2 text-3xl text-on-surface">Welcome Back</h2>
              <p className="text-sm text-on-surface-variant">
                Please enter your institutional credentials to access the strata archive.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-outline">
                  Institutional Email or ID
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-lg bg-surface-container-highest px-4 py-4 pr-12 text-on-surface placeholder:text-outline/50 transition-all duration-200"
                    placeholder="researcher@university.edu"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                  <Mail aria-hidden="true" className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline/40" strokeWidth={1.8} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-outline">Password</label>
                  <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-tertiary hover:underline">
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    className="w-full rounded-lg bg-surface-container-highest px-4 py-4 pr-12 text-on-surface placeholder:text-outline/50 transition-all duration-200"
                    placeholder="••••••••••••"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <Lock aria-hidden="true" className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline/40" strokeWidth={1.8} />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input id="remember" className="h-4 w-4 rounded-sm border-outline-variant text-primary" type="checkbox" />
                <label htmlFor="remember" className="text-xs text-on-surface-variant">
                  Keep me signed in for 30 days
                </label>
              </div>

              {error ? (
                <div className="rounded-lg border border-error/20 bg-error-container px-4 py-3 text-sm text-on-error-container">
                  {error}
                </div>
              ) : null}

              <div className="pt-4">
                <button
                  className="lithic-gradient flex w-full items-center justify-center gap-2 rounded-sm py-4 text-sm font-bold tracking-widest text-on-primary shadow-lg shadow-primary/10 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  type="submit"
                  disabled={submitting || loading}
                >
                  {submitting ? 'AUTHENTICATING...' : 'AUTHENTICATE ARCHIVE'}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </form>

            <div className="mt-12 border-t border-outline-variant/15 pt-8">
              <p className="mb-6 text-center text-xs text-on-surface-variant">Or continue with institutional SSO</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 rounded-sm bg-surface-container-high px-4 py-3 text-xs font-bold tracking-tight text-on-surface transition-colors hover:bg-surface-variant"
                >
                  <Landmark aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  UNIVERSITY
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 rounded-sm bg-surface-container-high px-4 py-3 text-xs font-bold tracking-tight text-on-surface transition-colors hover:bg-surface-variant"
                >
                  <FlaskConical aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  RESEARCH LAB
                </button>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/" className="text-sm font-bold text-primary underline underline-offset-4">
                Back to public portal
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 flex w-full max-w-5xl flex-col items-center gap-6">
        <div className="flex gap-8 opacity-40 grayscale">
          <div className="flex items-center gap-2">
            <LibraryBig aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
            <span className="text-[10px] font-bold tracking-widest">NATURAL HISTORY FOUNDATION</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
            <span className="text-[10px] font-bold tracking-widest">GLOBAL STRATA NETWORK</span>
          </div>
        </div>
        <div className="flex gap-6">
          <a className="text-xs text-on-surface-variant underline decoration-outline-variant/30 underline-offset-4 transition-colors hover:text-primary" href="#">
            Privacy Policy
          </a>
          <a className="text-xs text-on-surface-variant underline decoration-outline-variant/30 underline-offset-4 transition-colors hover:text-primary" href="#">
            Terms of Use
          </a>
          <a className="text-xs text-on-surface-variant underline decoration-outline-variant/30 underline-offset-4 transition-colors hover:text-primary" href="#">
            Accessibility
          </a>
        </div>
      </footer>
    </div>
  );
}
