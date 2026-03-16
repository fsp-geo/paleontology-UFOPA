'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { SiteLocale } from '@/lib/site-locale';
import { isPortuguese } from '@/lib/site-locale';

type WeeklyHour = {
  dateKey: string;
  label: string;
  minutes: number;
  hours: number;
  percentOfDay: number;
  isToday: boolean;
};

type TopicProgress = {
  id: string;
  slug: string;
  title: string;
  percentComplete: number;
  minutesSpent: number;
};

type RecentAccess = {
  id: string;
  title: string;
  category: string;
  contentType: string;
  sourcePath?: string | null;
  accessedAt: string | Date;
};

type LeaderboardRow = {
  position: number;
  userId: string;
  name: string;
  points: number;
  isCurrentUser: boolean;
};

type Recommendation = {
  title: string;
  summary: string;
  href: string;
  estimatedMinutes: number | null;
  matchReason: string | null;
  imageUrl: string | null;
} | null;

type MyLearningClientProps = {
  locale: SiteLocale;
  profile: {
    name: string;
    levelTitle: string;
    streakDays: number;
    activeDaysCount: number;
    weeklyHours: WeeklyHour[];
    totalWeeklyMinutes: number;
    currentRank: number;
  };
  topicProgress: TopicProgress[];
  recentAccesses: RecentAccess[];
  leaderboard: LeaderboardRow[];
  recommendation: Recommendation;
};

function formatHours(totalMinutes: number) {
  return (totalMinutes / 60).toFixed(1);
}

function formatPoints(points: number, locale: SiteLocale) {
  return new Intl.NumberFormat(isPortuguese(locale) ? 'pt-BR' : 'en-US').format(points);
}

function getRecentAccessIcon(category: string) {
  const normalized = category.toLowerCase();

  if (normalized.includes('wiki')) return 'menu_book';
  if (normalized.includes('archive')) return 'database';
  if (normalized.includes('recommendation')) return 'auto_stories';
  return 'folder';
}

function getAchievementLabel(access: RecentAccess) {
  if (access.category.toLowerCase().includes('wiki')) return 'Wiki';
  if (access.category.toLowerCase().includes('archive')) return 'Archive';
  return access.category;
}

export function MyLearningClient({
  locale,
  profile,
  topicProgress,
  recentAccesses,
  leaderboard,
  recommendation,
}: MyLearningClientProps) {
  const [animateChart, setAnimateChart] = useState(false);
  const pt = isPortuguese(locale);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setAnimateChart(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const weeklyHoursText = formatHours(profile.totalWeeklyMinutes);
  const currentRankText = profile.currentRank > 0 ? `#${profile.currentRank}` : pt ? 'Sem rankeamento' : 'Unranked';

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <header className="mb-16 grid grid-cols-1 items-end gap-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">
            {pt ? 'Bem-vindo de volta, arquivista' : 'Welcome back, Archivist'}
          </p>
          <h1 className="mb-6 font-headline text-5xl leading-tight text-on-background md:text-6xl">{profile.name}</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-on-surface-variant">
            {pt ? (
              <>
                Voce estudou <strong>{weeklyHoursText} horas</strong> nesta semana, acumulou{' '}
                <strong>{profile.activeDaysCount} dia(s) ativo(s)</strong> no portal, e sua posicao atual na comunidade e{' '}
                <strong>{currentRankText}</strong>.
              </>
            ) : (
              <>
                You&apos;ve studied <strong>{weeklyHoursText} hours</strong> this week, accumulated{' '}
                <strong>{profile.activeDaysCount} active day(s)</strong> in the portal, and your current standing in the community is{' '}
                <strong>{currentRankText}</strong>.
              </>
            )}
          </p>
        </div>

        <div className="flex justify-start md:col-span-5 md:justify-end">
          <div className="flex items-center gap-6 rounded-xl bg-surface-container-highest p-6 shadow-sm">
            <div className="text-center">
              <p className="text-[11px] font-label uppercase tracking-widest text-on-surface-variant">{pt ? 'Sequencia Diaria' : 'Daily Streak'}</p>
              <p className="font-headline text-3xl text-primary">
                {profile.streakDays} {pt ? 'Dias' : 'Days'}
              </p>
            </div>
            <div className="h-10 w-px bg-outline-variant/30"></div>
            <div className="text-center">
              <p className="text-[11px] font-label uppercase tracking-widest text-on-surface-variant">{pt ? 'Nivel' : 'Rank'}</p>
              <p className="font-headline text-3xl text-primary">{profile.levelTitle}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <section className="space-y-8 md:col-span-8">
          <div className="rounded-xl bg-surface-container-low p-8">
            <div className="mb-10 flex items-center justify-between">
              <h3 className="font-headline text-2xl">{pt ? 'Horas Estudadas' : 'Hours Studied'}</h3>
              <span className="rounded bg-surface-container-highest px-3 py-1 text-[11px] font-label uppercase tracking-wider">
                {pt ? 'Esta Semana' : 'This Week'}
              </span>
            </div>

            <div className="grid h-48 grid-cols-7 gap-4 px-2">
              {profile.weeklyHours.map((item) => {
                const height = item.minutes > 0 ? Math.max(4, item.percentOfDay) : 0;
                return (
                  <div key={item.dateKey} className="group relative h-full min-h-48 overflow-visible rounded-t-2xl">
                    <div className="absolute inset-0 overflow-hidden rounded-t-2xl bg-surface-container-highest">
                      <div
                        className={`absolute bottom-0 left-0 right-0 rounded-t-2xl bg-primary-container/40 transition-[height,box-shadow,opacity,transform] duration-1000 ease-out ${
                          item.isToday ? 'animate-[active-day-pulse_2.4s_ease-in-out_infinite] bg-primary shadow-[0_0_0_1px_rgba(120,88,48,0.08),0_10px_18px_-12px_rgba(120,88,48,0.45)]' : ''
                        }`}
                        style={{ height: `${animateChart ? height : 0}%` }}
                      />
                    </div>
                    <div
                      className={`absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold transition-opacity ${
                        item.isToday ? 'text-primary opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {item.hours.toFixed(1)}h
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-7 gap-4 px-2 text-[11px] font-label uppercase tracking-widest text-on-surface-variant/60">
              {profile.weeklyHours.map((item) => (
                <span
                  key={`${item.dateKey}-label`}
                  className={item.isToday ? 'font-bold text-primary' : undefined}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="rounded-xl bg-surface-container-low p-8">
              <h3 className="mb-6 font-headline text-xl">{pt ? 'Topicos Concluidos' : 'Topic Completion'}</h3>
              <div className="space-y-6">
                {topicProgress.map((topic) => (
                  <div key={topic.id}>
                    <div className="mb-2 flex justify-between">
                      <span className="text-sm font-label">{topic.title}</span>
                      <span className="text-sm font-label text-primary">{topic.percentComplete}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-highest">
                      <div className="h-full bg-primary transition-[width] duration-700" style={{ width: `${topic.percentComplete}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid overflow-hidden rounded-xl bg-surface-container-low">
              <Link
                className="flex flex-col justify-between bg-surface-container p-6 transition-colors hover:bg-surface-container-high"
                href="/acervo-digital-de-fosseis"
                prefetch={false}
              >
                <span className="material-symbols-outlined text-primary">database</span>
                <span className="font-headline text-lg">{pt ? 'Acervo Digital de Fosseis' : 'Digital Fossil Archive'}</span>
              </Link>
              <button
                className="flex cursor-not-allowed flex-col justify-between bg-surface-container p-6 text-left opacity-70"
                disabled
                type="button"
              >
                <span className="material-symbols-outlined text-primary">construction</span>
                <span className="font-headline text-lg">{pt ? 'Ferramentas Avancadas de Estudo' : 'Advanced Study Tools'}</span>
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-8 md:col-span-4">
          <div className="rounded-xl bg-surface-container p-8">
            <h3 className="mb-6 font-headline text-2xl">{pt ? 'Ranking de Conhecimento' : 'Knowledge Ranking'}</h3>
            <div className="space-y-4">
              {leaderboard.slice(0, 6).map((row) => (
                <div
                  key={row.userId}
                  className={row.isCurrentUser ? 'flex items-center gap-4 rounded-lg border-l-4 border-primary bg-surface-container-highest p-3' : 'flex items-center gap-4'}
                >
                  <span className={`w-4 font-headline text-lg ${row.isCurrentUser ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {row.position}
                  </span>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${row.isCurrentUser ? 'bg-primary text-on-primary' : 'bg-primary-container/20 text-primary'}`}>
                    <span className="text-xs font-bold uppercase">{row.name.slice(0, 1)}</span>
                  </div>
                  <span className={`flex-grow text-base ${row.isCurrentUser ? 'font-bold' : 'font-medium'}`}>{row.name}</span>
                  <span className="text-sm font-bold text-primary">{formatPoints(row.points, locale)} pts</span>
                </div>
              ))}
            </div>
            <button className="mt-8 w-full border-t border-outline-variant/30 py-3 text-xs font-label uppercase tracking-widest text-tertiary transition-colors hover:text-on-surface">
              {pt ? 'Ver Ranking Completo' : 'View Full Leaderboard'}
            </button>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-surface-container-high p-8">
            <h3 className="relative mb-8 font-headline text-2xl">{pt ? 'Atividades Recentes' : 'Recent Achievements'}</h3>
            <div className="relative grid grid-cols-2 gap-4">
              {recentAccesses.length > 0 ? (
                recentAccesses.slice(0, 4).map((access) => (
                  <div key={access.id} className="flex flex-col items-center rounded-lg bg-surface/60 p-4 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {getRecentAccessIcon(access.category)}
                      </span>
                    </div>
                    <p className="text-[11px] font-label font-bold leading-tight">{access.title}</p>
                    <p className="mt-1 text-[10px] font-label uppercase tracking-wider text-on-surface-variant">{getAchievementLabel(access)}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 rounded-lg bg-surface/40 p-6 text-center text-sm text-on-surface-variant">
                  {pt ? 'Suas visitas mais recentes ao acervo e a wiki aparecerao aqui.' : 'Your latest archive and wiki visits will appear here.'}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-16 flex flex-col overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container shadow-sm md:flex-row">
        <div className="flex flex-col justify-center p-12 md:w-1/2">
          <span className="mb-4 block text-[11px] font-label uppercase tracking-[0.3em] text-tertiary">
            {pt ? 'Estudo Recomendado' : 'Recommended Study'}
          </span>
          <h2 className="mb-6 font-headline text-4xl">
            {recommendation?.title ?? (pt ? 'Seu proximo percurso de estudo recomendado aparecera aqui.' : 'Your next recommended study path will appear here.')}
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-on-surface-variant">
            {recommendation?.summary ??
              (pt
                ? 'Conforme seu perfil evoluir, o portal sugerira materiais alinhados aos seus interesses de aprendizado.'
                : 'As your profile evolves, the portal will suggest materials aligned to your learning interests.')}
          </p>
          <div className="flex items-center gap-6">
            <Link
              className="rounded-sm bg-primary px-8 py-3 text-sm font-label uppercase tracking-widest text-on-primary transition-all hover:brightness-110"
              href={recommendation?.href ?? '/wiki-de-estudos-paleontologicos'}
              prefetch={false}
            >
              {pt ? 'Retomar Estudo' : 'Resume Session'}
            </Link>
            <span className="text-sm font-label text-on-surface-variant">
              {recommendation?.estimatedMinutes
                ? pt
                  ? `Estimado: ${recommendation.estimatedMinutes} min`
                  : `Estimated: ${recommendation.estimatedMinutes} min`
                : pt
                  ? 'Estimado: --'
                  : 'Estimated: --'}
            </span>
          </div>
        </div>
        <div className="relative min-h-[300px] md:w-1/2">
          <Image
            alt={recommendation?.title ?? 'Recommended study'}
            className="absolute inset-0 h-full w-full object-cover"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            src={
              recommendation?.imageUrl ??
              'https://lh3.googleusercontent.com/aida-public/AB6AXuDJFvrlWnF37AgdURVcDELpfWZYrVCri4I5TVUAjjtHNHUKWKNtlzUmOULEHSavIkKA75qRZXHBFyWFplQT8OMJiz2SIbKg-viDmHJou-AKNveA2iRz3Z3cEfGnZ8gebQqoVmg3iy1JtJksYKjc1EnY2PVx1uPod11nbFBArMCc9ZeM6DakTV9kwL-wLcB16gKs-Y3eNma6D0IldFkKRkntO3AEl1MH0tlEJ1VDYxrK71OOSPK3ftFSHqDDruu0k5Mtp0F46MWt_FM'
            }
          />
          <div className="lithic-gradient absolute inset-0 opacity-20 mix-blend-multiply"></div>
        </div>
      </section>

      <footer className="mt-24 flex flex-col items-center justify-between gap-8 border-t border-outline-variant/30 pt-12 md:flex-row">
        <div className="flex items-center gap-12 opacity-40 grayscale">
          <span className="font-headline text-lg italic text-on-surface">Petrobras Global</span>
          <span className="font-headline text-lg italic text-on-surface">Smithsonian Institution</span>
          <span className="font-headline text-lg italic text-on-surface">Cambridge University</span>
        </div>
        <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
          {pt ? '© 2024 PaleoPortal • Estratigrafia do Conhecimento Humano' : '© 2024 PaleoPortal • Stratigraphy of Human Knowledge'}
        </p>
      </footer>
    </div>
  );
}
