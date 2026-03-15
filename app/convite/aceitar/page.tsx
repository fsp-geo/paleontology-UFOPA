'use client';

import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type InviteState = 'loading' | 'ready' | 'success' | 'error';

function extractHashParams() {
  if (typeof window === 'undefined') {
    return new URLSearchParams();
  }

  return new URLSearchParams(window.location.hash.replace(/^#/, ''));
}

export default function AcceptInvitePage() {
  const client = supabase;
  const [inviteState, setInviteState] = useState<InviteState>('loading');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(() => (client ? null : 'Servico de autenticacao indisponivel no momento.'));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!client) {
      return;
    }

    const initializeInvite = async () => {
      const hashParams = extractHashParams();
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const hashError = hashParams.get('error_code') || hashParams.get('error_description');

      if (hashError) {
        setInviteState('error');
        setError('Este convite e invalido ou expirou. Solicite um novo convite.');
        return;
      }

      try {
        if (accessToken && refreshToken) {
          const { error: sessionError } = await client.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            setInviteState('error');
            setError('Nao foi possivel validar o convite. Solicite um novo envio.');
            return;
          }

          window.history.replaceState(null, '', '/convite/aceitar');
        }

        const {
          data: { session },
        } = await client.auth.getSession();

        if (!session?.user) {
          setInviteState('error');
          setError('Sessao de convite nao encontrada. Abra novamente o link mais recente enviado por email.');
          return;
        }

        await fetch('/api/auth/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: session.user }),
        }).catch(() => null);

        setInviteState('ready');
      } catch {
        setInviteState('error');
        setError('Nao foi possivel concluir a preparacao do convite.');
      }
    };

    initializeInvite();
  }, [client]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!client) {
      setError('Servico de autenticacao indisponivel no momento.');
      return;
    }

    if (password.length < 8) {
      setError('A senha precisa ter pelo menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas digitadas nao coincidem.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: updateError } = await client.auth.updateUser({
      password,
    });

    if (updateError) {
      setSubmitting(false);
      setError('Nao foi possivel definir sua senha. Tente novamente.');
      return;
    }

    const {
      data: { user },
    } = await client.auth.getUser();

    if (user) {
      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      }).catch(() => null);
    }

    setInviteState('success');

    await client.auth.signOut().catch(() => null);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f1e8db] px-6 py-10 text-stone-900">
      <div className="absolute inset-0">
        <Image
          src="https://wyzitrfkiekhkipweesj.supabase.co/storage/v1/object/public/site-assets/email/logoconvite.png"
          alt="Fossil invite artwork"
          fill
          priority
          className="object-contain object-right opacity-[0.10]"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.55),_transparent_38%),linear-gradient(135deg,_rgba(248,240,228,0.92)_0%,_rgba(239,223,199,0.88)_52%,_rgba(232,212,183,0.9)_100%)]" />

      <main className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-stone-200/80 bg-[#fbf7f1]/90 shadow-[0_30px_90px_-32px_rgba(57,39,16,0.35)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="border-b border-stone-200/70 px-8 py-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14">
          <div className="mb-8 text-[11px] font-bold uppercase tracking-[0.34em] text-stone-500">PaleoPortal UFOPA</div>
          <h1 className="font-headline text-5xl leading-[0.95] text-stone-900 md:text-6xl">
            Ative seu
            <span className="block italic font-normal text-[#7a5b38]">acesso inicial</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-stone-700">
            Conclua o aceite do convite definindo sua senha. Depois disso, voce sera redirecionado ao ambiente adequado do portal.
          </p>

          <div className="mt-10 rounded-[24px] border border-stone-200 bg-stone-50/80 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-stone-900 p-3 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-stone-900">Fluxo seguro de primeiro acesso</p>
                <p className="text-sm leading-7 text-stone-600">
                  O convite do Supabase gera uma sessao temporaria. Esta tela transforma esse primeiro acesso em uma conta permanente com senha definida por voce.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-8 py-10 lg:px-12 lg:py-14">
          {inviteState === 'loading' ? (
            <div className="rounded-[24px] border border-stone-200 bg-white p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">Validando convite</p>
              <p className="mt-4 text-base leading-7 text-stone-700">Estamos preparando seu primeiro acesso com seguranca.</p>
            </div>
          ) : null}

          {inviteState === 'error' || !client ? (
            <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-700">Convite indisponivel</p>
              <p className="mt-4 text-base leading-7 text-rose-900">{error}</p>
              <Link href="/acesso-ao-portal-interno" className="mt-6 inline-flex text-sm font-semibold text-rose-900 underline underline-offset-4">
                Voltar para o portal de acesso
              </Link>
            </div>
          ) : null}

          {inviteState === 'ready' || inviteState === 'success' ? (
            <div className="rounded-[24px] border border-stone-200 bg-white p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-full bg-[#7a5932] p-3 text-white">
                  {inviteState === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
                    {inviteState === 'success' ? 'Convite aceito' : 'Definir senha'}
                  </p>
                  <p className="mt-1 text-lg text-stone-900">
                    {inviteState === 'success'
                      ? 'Seu acesso foi confirmado com sucesso.'
                      : 'Escolha sua senha para concluir o primeiro acesso.'}
                  </p>
                </div>
              </div>

              {inviteState === 'ready' ? (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-stone-700">Nova senha</span>
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-stone-900 outline-none transition focus:border-stone-400"
                      placeholder="Minimo de 8 caracteres"
                      required
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-stone-700">Confirmar senha</span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-stone-900 outline-none transition focus:border-stone-400"
                      placeholder="Repita a senha"
                      required
                    />
                  </label>

                  {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{error}</div> : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
                  >
                    {submitting ? 'Concluindo acesso...' : 'Concluir primeiro acesso'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <p className="text-base leading-7 text-stone-700">
                    Cadastro finalizado com sucesso. Sua senha ja foi definida e seu acesso esta pronto para uso.
                  </p>

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-900">
                    Para manter o fluxo claro e seguro, o proximo passo e entrar normalmente pela tela de login do portal.
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/acesso-ao-portal-interno?origin=public"
                      className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-stone-700"
                    >
                      Ir para o login
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      href="/"
                      className="inline-flex items-center rounded-full border border-stone-300 px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-stone-700 transition hover:border-stone-500 hover:text-stone-900"
                    >
                      Voltar para a home
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
