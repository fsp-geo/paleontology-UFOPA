'use client';

import { useMemo, useState, useTransition } from 'react';
import { Check, FilePlus2, LoaderCircle, Send, X } from 'lucide-react';

type Submission = {
  id: string;
  type: string;
  title: string;
  summary: string;
  body: string;
  status: string;
  reviewerNotes: string | null;
  reviewedAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
  reviewer: {
    id: string;
    name: string | null;
    email: string;
  } | null;
};

type SubmissionSummary = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  works: number;
  posts: number;
};

type SubmissionType = 'work' | 'site_post';

const TYPE_LABELS: Record<string, string> = {
  work: 'Trabalho',
  site_post: 'Post do site',
};

export function SubmissionWorkspace({
  roleCodes,
  initialSubmissions,
  initialSummary,
  filterType,
  allowCreate,
  reviewMode,
}: {
  roleCodes: string[];
  initialSubmissions: Submission[];
  initialSummary: SubmissionSummary;
  filterType?: 'work' | 'site_post';
  allowCreate?: boolean;
  reviewMode?: boolean;
}) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [summary, setSummary] = useState(initialSummary);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isSubmitting, startSubmitting] = useTransition();
  const [form, setForm] = useState({
    type: (filterType || 'work') as SubmissionType,
    title: '',
    summary: '',
    body: '',
  });

  const visibleSubmissions = useMemo(
    () => submissions.filter((submission) => (filterType ? submission.type === filterType : true)),
    [submissions, filterType]
  );

  async function refreshSubmissions() {
    const query = filterType ? `?type=${filterType}` : '';
    const response = await fetch(`/api/submissions${query}`, { cache: 'no-store' });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Nao foi possivel atualizar as submissões.');
    }

    setSubmissions(data.submissions);
    setSummary(data.summary);
  }

  const submit = () => {
    setError(null);
    setFeedback(null);

    startSubmitting(async () => {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Nao foi possivel enviar a submissao.');
        return;
      }

      setForm({
        type: (filterType || 'work') as SubmissionType,
        title: '',
        summary: '',
        body: '',
      });
      setFeedback('Submissao registrada com sucesso.');
      await refreshSubmissions();
    });
  };

  const review = async (id: string, status: 'approved' | 'rejected') => {
    setBusyId(id);
    setError(null);
    setFeedback(null);

    try {
      const reviewerNotes =
        status === 'approved'
          ? 'Submissao aprovada para o fluxo editorial.'
          : 'Submissao devolvida para ajustes de conteudo.';

      const response = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, reviewerNotes }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Nao foi possivel revisar a submissao.');
      }

      setFeedback(status === 'approved' ? 'Submissao aprovada.' : 'Submissao rejeitada.');
      await refreshSubmissions();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-4">
        <article className="rounded-[24px] border border-stone-200/80 bg-white/80 p-6 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Total</p>
          <p className="mt-3 font-headline text-4xl leading-none text-stone-900">{summary.total}</p>
        </article>
        <article className="rounded-[24px] border border-stone-200/80 bg-white/80 p-6 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Pendentes</p>
          <p className="mt-3 font-headline text-4xl leading-none text-amber-700">{summary.pending}</p>
        </article>
        <article className="rounded-[24px] border border-stone-200/80 bg-white/80 p-6 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Trabalhos</p>
          <p className="mt-3 font-headline text-4xl leading-none text-stone-900">{summary.works}</p>
        </article>
        <article className="rounded-[24px] border border-stone-200/80 bg-white/80 p-6 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Posts</p>
          <p className="mt-3 font-headline text-4xl leading-none text-stone-900">{summary.posts}</p>
        </article>
      </section>

      {feedback ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{feedback}</div> : null}
      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{error}</div> : null}

      <div className={`grid gap-8 ${allowCreate ? 'xl:grid-cols-[0.9fr_1.1fr]' : ''}`}>
        {allowCreate ? (
          <section className="rounded-[28px] border border-stone-200/80 bg-white/80 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Nova submissao</p>
                <h2 className="mt-3 font-headline text-3xl text-stone-900">Enviar material</h2>
              </div>
              <FilePlus2 className="h-5 w-5 text-stone-500" />
            </div>

            <div className="mt-6 grid gap-4">
              {!filterType ? (
                <select
                  className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-400"
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, type: event.target.value as SubmissionType }))
                  }
                >
                  <option value="work">Trabalho</option>
                  <option value="site_post">Post do site</option>
                </select>
              ) : null}
              <input
                className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-400"
                placeholder="Titulo"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              />
              <textarea
                className="min-h-24 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-400"
                placeholder="Resumo"
                value={form.summary}
                onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
              />
              <textarea
                className="min-h-44 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-400"
                placeholder="Conteudo principal"
                value={form.body}
                onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
              />
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={isSubmitting}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
            >
              {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Enviar submissao
            </button>
          </section>
        ) : null}

        <section className="space-y-4">
          {visibleSubmissions.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-stone-200 bg-white/70 px-5 py-6 text-sm text-stone-500">
              Nenhum item encontrado nesta area.
            </div>
          ) : (
            visibleSubmissions.map((submission) => (
              <article key={submission.id} className="rounded-[28px] border border-stone-200/80 bg-white/80 p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-stone-900 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                        {TYPE_LABELS[submission.type] || submission.type}
                      </span>
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-stone-700">
                        {submission.status}
                      </span>
                    </div>
                    <h3 className="mt-4 font-headline text-3xl text-stone-900">{submission.title}</h3>
                    <p className="mt-2 text-sm text-stone-500">
                      {submission.author.name || submission.author.email} · {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(submission.createdAt))}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-stone-700">{submission.summary}</p>
                <div className="mt-4 rounded-[24px] bg-stone-50 px-5 py-4 text-sm leading-7 text-stone-600">{submission.body}</div>

                {submission.reviewerNotes ? (
                  <div className="mt-4 rounded-[22px] border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-stone-600">
                    Parecer: {submission.reviewerNotes}
                  </div>
                ) : null}

                {reviewMode && submission.status === 'pending' ? (
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => review(submission.id, 'approved')}
                      disabled={busyId === submission.id}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
                    >
                      {busyId === submission.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Aprovar
                    </button>
                    <button
                      type="button"
                      onClick={() => review(submission.id, 'rejected')}
                      disabled={busyId === submission.id}
                      className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-300"
                    >
                      {busyId === submission.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                      Rejeitar
                    </button>
                  </div>
                ) : null}
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
