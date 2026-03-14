'use client';

import { useMemo, useState, useTransition } from 'react';
import { Check, LoaderCircle, Send, X } from 'lucide-react';

type AccountabilityEntry = {
  id: string;
  title: string;
  description: string;
  category: string;
  amountInCents: number;
  expenseDate: string;
  status: string;
  receiptUrl: string | null;
  reviewerNotes: string | null;
  reviewedAt: string | null;
  createdAt: string;
  submitter: {
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

type AccountabilitySummary = {
  totalEntries: number;
  pendingEntries: number;
  approvedEntries: number;
  rejectedEntries: number;
  totalAmountInCents: number;
};

function formatMoney(amountInCents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amountInCents / 100);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
  }).format(new Date(date));
}

export function AccountabilityWorkspace({
  roleCodes,
  initialEntries,
  initialSummary,
}: {
  roleCodes: string[];
  initialEntries: AccountabilityEntry[];
  initialSummary: AccountabilitySummary;
}) {
  const isProfessor = roleCodes.includes('professor') || roleCodes.includes('admin');
  const canSubmit = roleCodes.includes('pesquisador') || roleCodes.includes('professor') || roleCodes.includes('admin');
  const [entries, setEntries] = useState(initialEntries);
  const [summary, setSummary] = useState(initialSummary);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, startSubmit] = useTransition();
  const [busyEntryId, setBusyEntryId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'travel',
    amount: '',
    expenseDate: '',
  });

  const pendingEntries = useMemo(() => entries.filter((entry) => entry.status === 'pending'), [entries]);

  const refreshEntries = async () => {
    const response = await fetch('/api/accountability', { cache: 'no-store' });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Nao foi possivel atualizar as prestacoes.');
    }

    setEntries(data.entries);
    setSummary(data.summary);
  };

  const submitEntry = () => {
    setError(null);
    setFeedback(null);

    startSubmit(async () => {
      const response = await fetch('/api/accountability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Nao foi possivel registrar a prestacao.');
        return;
      }

      setForm({
        title: '',
        description: '',
        category: 'travel',
        amount: '',
        expenseDate: '',
      });
      setFeedback('Prestacao registrada com sucesso.');
      await refreshEntries();
    });
  };

  const reviewEntry = async (entryId: string, status: 'approved' | 'rejected') => {
    const reviewerNotes =
      status === 'approved'
        ? 'Prestacao aprovada pelo professor responsavel.'
        : 'Prestacao devolvida para ajuste documental.';

    setBusyEntryId(entryId);
    setError(null);
    setFeedback(null);

    try {
      const response = await fetch(`/api/accountability/${entryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, reviewerNotes }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Nao foi possivel atualizar a prestacao.');
      }

      setFeedback(status === 'approved' ? 'Prestacao aprovada.' : 'Prestacao rejeitada para revisao.');
      await refreshEntries();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyEntryId(null);
    }
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-4">
        <article className="rounded-[24px] border border-stone-200/80 bg-white/80 p-6 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Total</p>
          <p className="mt-3 font-headline text-4xl leading-none text-stone-900">{summary.totalEntries}</p>
        </article>
        <article className="rounded-[24px] border border-stone-200/80 bg-white/80 p-6 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Pendentes</p>
          <p className="mt-3 font-headline text-4xl leading-none text-amber-700">{summary.pendingEntries}</p>
        </article>
        <article className="rounded-[24px] border border-stone-200/80 bg-white/80 p-6 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Aprovadas</p>
          <p className="mt-3 font-headline text-4xl leading-none text-emerald-700">{summary.approvedEntries}</p>
        </article>
        <article className="rounded-[24px] border border-stone-200/80 bg-white/80 p-6 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Valor acumulado</p>
          <p className="mt-3 font-headline text-4xl leading-none text-stone-900">{formatMoney(summary.totalAmountInCents)}</p>
        </article>
      </section>

      {feedback ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{feedback}</div> : null}
      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{error}</div> : null}

      <div className="grid gap-8 xl:grid-cols-[0.86fr_1.14fr]">
        {canSubmit ? (
          <section className="rounded-[28px] border border-stone-200/80 bg-white/80 p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Nova submissao</p>
            <h2 className="mt-3 font-headline text-3xl text-stone-900">Registrar prestacao</h2>

            <div className="mt-6 grid gap-4">
              <input
                className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-400"
                placeholder="Titulo da despesa"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              />
              <textarea
                className="min-h-28 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-400"
                placeholder="Descricao detalhada"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              />
              <div className="grid gap-4 md:grid-cols-3">
                <select
                  className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-400"
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                >
                  <option value="travel">Viagem</option>
                  <option value="lab">Laboratorio</option>
                  <option value="field">Campo</option>
                  <option value="publication">Publicacao</option>
                  <option value="other">Outro</option>
                </select>
                <input
                  className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-400"
                  placeholder="Valor em BRL"
                  value={form.amount}
                  onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
                />
                <input
                  className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-400"
                  type="date"
                  value={form.expenseDate}
                  onChange={(event) => setForm((current) => ({ ...current, expenseDate: event.target.value }))}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={submitEntry}
              disabled={isSubmitting}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
            >
              {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Enviar para avaliacao
            </button>
          </section>
        ) : null}

        <section className="space-y-6">
          {isProfessor ? (
            <article className="rounded-[28px] border border-stone-200/80 bg-white/80 p-6 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Fila de aprovacao</p>
              <h2 className="mt-3 font-headline text-3xl text-stone-900">Pendencias dos pesquisadores</h2>

              <div className="mt-6 space-y-4">
                {pendingEntries.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-stone-200 px-4 py-5 text-sm text-stone-500">
                    Nenhuma prestacao pendente no momento.
                  </div>
                ) : (
                  pendingEntries.map((entry) => (
                    <div key={entry.id} className="rounded-[22px] border border-stone-200 bg-stone-50/80 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-stone-900">{entry.title}</p>
                          <p className="mt-1 text-sm text-stone-600">{entry.submitter.name || entry.submitter.email}</p>
                        </div>
                        <p className="text-sm font-semibold text-stone-900">{formatMoney(entry.amountInCents)}</p>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-stone-600">{entry.description}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => reviewEntry(entry.id, 'approved')}
                          disabled={busyEntryId === entry.id}
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
                        >
                          {busyEntryId === entry.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          Aprovar
                        </button>
                        <button
                          type="button"
                          onClick={() => reviewEntry(entry.id, 'rejected')}
                          disabled={busyEntryId === entry.id}
                          className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-300"
                        >
                          {busyEntryId === entry.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                          Rejeitar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </article>
          ) : null}

          <article className="rounded-[28px] border border-stone-200/80 bg-white/80 p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Historico</p>
            <h2 className="mt-3 font-headline text-3xl text-stone-900">
              {isProfessor ? 'Todas as prestacoes' : 'Suas prestacoes'}
            </h2>

            <div className="mt-6 space-y-4">
              {entries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-200 px-4 py-5 text-sm text-stone-500">
                  Nenhuma prestacao encontrada.
                </div>
              ) : (
                entries.map((entry) => (
                  <div key={entry.id} className="rounded-[22px] border border-stone-200 bg-stone-50/80 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-stone-900">{entry.title}</p>
                        <p className="mt-1 text-sm text-stone-600">
                          {entry.submitter.name || entry.submitter.email} · {formatDate(entry.expenseDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-stone-900">{formatMoney(entry.amountInCents)}</p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">{entry.status}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-stone-600">{entry.description}</p>
                    {entry.reviewerNotes ? (
                      <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-stone-600">
                        Parecer: {entry.reviewerNotes}
                      </p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
