'use client';

import { useMemo, useState, useTransition } from 'react';
import { LoaderCircle, MailPlus, RefreshCw, Save, ShieldCheck, Users } from 'lucide-react';
import { LogoutButton } from '@/components/LogoutButton';

type ManagedUser = {
  id: string;
  email: string;
  name: string | null;
  status: string;
  userType: string;
  institution: string | null;
  department: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  roleCodes: string[];
};

type AvailableRole = {
  code: string;
  name: string;
  description: string | null;
};

const STATUS_OPTIONS = ['active', 'invited', 'inactive', 'suspended'];
const USER_TYPE_OPTIONS = ['internal', 'public', 'student', 'researcher'];

function formatDate(date: string | null) {
  if (!date) {
    return 'Nunca';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

export function UserManagementWorkspace({
  initialUsers,
  roles,
  canInvite,
}: {
  initialUsers: ManagedUser[];
  roles: AvailableRole[];
  canInvite: boolean;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, startRefresh] = useTransition();
  const [isSubmittingInvite, startInvite] = useTransition();
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    roleCode: roles[0]?.code || 'pesquisador',
    userType: 'internal',
    institution: 'UFOPA',
    department: '',
  });
  const [drafts, setDrafts] = useState<Record<string, { roleCode: string; status: string; userType: string; institution: string; department: string }>>(
    () =>
      Object.fromEntries(
        initialUsers.map((user) => [
          user.id,
          {
            roleCode: user.roleCodes[0] || 'visitante',
            status: user.status,
            userType: user.userType,
            institution: user.institution || '',
            department: user.department || '',
          },
        ])
      )
  );

  const roleDescriptions = useMemo(
    () => Object.fromEntries(roles.map((role) => [role.code, role.description || role.name])),
    [roles]
  );

  const refreshUsers = () => {
    setError(null);
    startRefresh(async () => {
      const response = await fetch('/api/users', { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Nao foi possivel atualizar a lista de usuarios.');
        return;
      }

      setUsers(data.users);
      setDrafts(
        Object.fromEntries(
          data.users.map((user: ManagedUser) => [
            user.id,
            {
              roleCode: user.roleCodes[0] || 'visitante',
              status: user.status,
              userType: user.userType,
              institution: user.institution || '',
              department: user.department || '',
            },
          ])
        )
      );
      setFeedback('Lista de usuarios atualizada.');
    });
  };

  const updateDraft = (userId: string, field: 'roleCode' | 'status' | 'userType' | 'institution' | 'department', value: string) => {
    setDrafts((current) => ({
      ...current,
      [userId]: {
        ...current[userId],
        [field]: value,
      },
    }));
  };

  const saveUser = (userId: string) => {
    const draft = drafts[userId];
    if (!draft) {
      return;
    }

    setSavingUserId(userId);
    setError(null);
    setFeedback(null);

    void fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Nao foi possivel salvar as alteracoes.');
        }

        setUsers((current) => current.map((user) => (user.id === userId ? data.user : user)));
        setDrafts((current) => ({
          ...current,
          [userId]: {
            roleCode: data.user.roleCodes[0] || 'visitante',
            status: data.user.status,
            userType: data.user.userType,
            institution: data.user.institution || '',
            department: data.user.department || '',
          },
        }));
        setFeedback(`Perfil de ${data.user.email} atualizado com sucesso.`);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setSavingUserId(null);
      });
  };

  const submitInvite = () => {
    setError(null);
    setFeedback(null);

    startInvite(async () => {
      const response = await fetch('/api/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteForm),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Nao foi possivel enviar o convite.');
        return;
      }

      if (data.user) {
        setUsers((current) => [data.user, ...current]);
        setDrafts((current) => ({
          ...current,
          [data.user.id]: {
            roleCode: data.user.roleCodes[0] || 'visitante',
            status: data.user.status,
            userType: data.user.userType,
            institution: data.user.institution || '',
            department: data.user.department || '',
          },
        }));
      }

      setInviteForm({
        name: '',
        email: '',
        roleCode: roles[0]?.code || 'pesquisador',
        userType: 'internal',
        institution: 'UFOPA',
        department: '',
      });
      setFeedback(`Convite enviado para ${data.user?.email || inviteForm.email}.`);
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(146,114,72,0.16),_transparent_32%),linear-gradient(180deg,_#f6f0e6_0%,_#f3ece1_40%,_#efe7da_100%)] text-stone-900">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <section className="overflow-hidden rounded-[28px] border border-stone-200/80 bg-white/80 shadow-[0_24px_70px_-28px_rgba(38,27,12,0.25)] backdrop-blur">
          <div className="grid gap-8 border-b border-stone-200/80 px-8 py-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-stone-700">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-[0.28em]">Controle de Acessos</span>
              </div>
              <h1 className="font-headline text-5xl leading-none text-stone-900">Gestao de Usuarios</h1>
              <p className="max-w-2xl text-sm leading-7 text-stone-600">
                Aqui voce controla convites, papeis e status de acesso do portal. Esta tela substitui a gestao manual no painel do
                Supabase para o dia a dia do projeto.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[22px] border border-stone-200 bg-stone-50/80 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Usuarios</p>
                <p className="mt-3 flex items-end gap-2 text-4xl font-semibold text-stone-900">
                  {users.length}
                  <Users className="mb-1 h-5 w-5 text-stone-500" />
                </p>
                <p className="mt-2 text-sm text-stone-500">Perfis acompanhados pelo banco interno.</p>
              </div>
              <div className="rounded-[22px] border border-stone-200 bg-stone-50/80 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Papeis</p>
                <p className="mt-3 text-4xl font-semibold text-stone-900">{roles.length}</p>
                <p className="mt-2 text-sm text-stone-500">Niveis disponiveis para distribuicao de acesso.</p>
              </div>
              <LogoutButton
                label="Sair do sistema"
                className="inline-flex items-center justify-center gap-2 rounded-[22px] border border-stone-300 bg-white px-5 py-5 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:text-stone-950"
              />
            </div>
          </div>

          <div className="grid gap-8 px-8 py-8 lg:grid-cols-[0.86fr_1.14fr]">
            <section className="space-y-4 rounded-[24px] border border-stone-200/80 bg-[#fbf8f2] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Convite</p>
                  <h2 className="mt-2 font-headline text-3xl text-stone-900">Convidar novo usuario</h2>
                </div>
                <MailPlus className="h-5 w-5 text-stone-500" />
              </div>

              {!canInvite ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                  Configure `SUPABASE_SERVICE_ROLE_KEY` no ambiente para habilitar o envio real de convites por email.
                </div>
              ) : null}

              <div className="grid gap-4">
                <label className="space-y-1.5 text-sm text-stone-700">
                  <span className="font-medium">Nome</span>
                  <input
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-stone-400"
                    value={inviteForm.name}
                    onChange={(event) => setInviteForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Nome completo do usuario"
                  />
                </label>

                <label className="space-y-1.5 text-sm text-stone-700">
                  <span className="font-medium">Email</span>
                  <input
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-stone-400"
                    type="email"
                    value={inviteForm.email}
                    onChange={(event) => setInviteForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="email@instituicao.br"
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1.5 text-sm text-stone-700">
                    <span className="font-medium">Papel</span>
                    <select
                      className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-400"
                      value={inviteForm.roleCode}
                      onChange={(event) => setInviteForm((current) => ({ ...current, roleCode: event.target.value }))}
                    >
                      {roles.map((role) => (
                        <option key={role.code} value={role.code}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1.5 text-sm text-stone-700">
                    <span className="font-medium">Tipo de usuario</span>
                    <select
                      className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-400"
                      value={inviteForm.userType}
                      onChange={(event) => setInviteForm((current) => ({ ...current, userType: event.target.value }))}
                    >
                      {USER_TYPE_OPTIONS.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1.5 text-sm text-stone-700">
                    <span className="font-medium">Instituicao</span>
                    <input
                      className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-400"
                      value={inviteForm.institution}
                      onChange={(event) => setInviteForm((current) => ({ ...current, institution: event.target.value }))}
                    />
                  </label>

                  <label className="space-y-1.5 text-sm text-stone-700">
                    <span className="font-medium">Departamento</span>
                    <input
                      className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-400"
                      value={inviteForm.department}
                      onChange={(event) => setInviteForm((current) => ({ ...current, department: event.target.value }))}
                    />
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={submitInvite}
                disabled={isSubmittingInvite || !canInvite}
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
              >
                {isSubmittingInvite ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MailPlus className="h-4 w-4" />}
                Enviar convite
              </button>
            </section>

            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Operacao</p>
                  <h2 className="mt-2 font-headline text-3xl text-stone-900">Usuarios existentes</h2>
                </div>
                <button
                  type="button"
                  onClick={refreshUsers}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Atualizar lista
                </button>
              </div>

              {feedback ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{feedback}</div> : null}
              {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{error}</div> : null}

              <div className="space-y-4">
                {users.map((user) => {
                  const draft = drafts[user.id];
                  const primaryRole = user.roleCodes[0] || 'visitante';

                  return (
                    <article key={user.id} className="rounded-[24px] border border-stone-200/80 bg-white px-5 py-5 shadow-sm">
                      <div className="flex flex-col gap-5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-stone-900">{user.name || 'Sem nome definido'}</p>
                            <p className="mt-1 text-sm text-stone-600">{user.email}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded-full bg-stone-900 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-stone-50">
                                {primaryRole}
                              </span>
                              <span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-stone-700">
                                {user.status}
                              </span>
                              <span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-stone-700">
                                {user.userType}
                              </span>
                            </div>
                          </div>

                          <div className="grid gap-1 text-right text-xs text-stone-500">
                            <span>Criado em {formatDate(user.createdAt)}</span>
                            <span>Ultimo acesso: {formatDate(user.lastLoginAt)}</span>
                          </div>
                        </div>

                        <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]">
                          <label className="space-y-1.5 text-sm text-stone-700">
                            <span className="font-medium">Papel</span>
                            <select
                              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400"
                              value={draft?.roleCode || primaryRole}
                              onChange={(event) => updateDraft(user.id, 'roleCode', event.target.value)}
                            >
                              {roles.map((role) => (
                                <option key={role.code} value={role.code}>
                                  {role.name}
                                </option>
                              ))}
                            </select>
                            <span className="block text-xs text-stone-500">{roleDescriptions[draft?.roleCode || primaryRole]}</span>
                          </label>

                          <label className="space-y-1.5 text-sm text-stone-700">
                            <span className="font-medium">Status</span>
                            <select
                              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400"
                              value={draft?.status || user.status}
                              onChange={(event) => updateDraft(user.id, 'status', event.target.value)}
                            >
                              {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="space-y-1.5 text-sm text-stone-700">
                            <span className="font-medium">Tipo</span>
                            <select
                              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400"
                              value={draft?.userType || user.userType}
                              onChange={(event) => updateDraft(user.id, 'userType', event.target.value)}
                            >
                              {USER_TYPE_OPTIONS.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </label>

                          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2 xl:col-span-1">
                            <label className="space-y-1.5 text-sm text-stone-700">
                              <span className="font-medium">Instituicao</span>
                              <input
                                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400"
                                value={draft?.institution || ''}
                                onChange={(event) => updateDraft(user.id, 'institution', event.target.value)}
                              />
                            </label>
                            <label className="space-y-1.5 text-sm text-stone-700">
                              <span className="font-medium">Departamento</span>
                              <input
                                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-stone-400"
                                value={draft?.department || ''}
                                onChange={(event) => updateDraft(user.id, 'department', event.target.value)}
                              />
                            </label>
                          </div>

                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => saveUser(user.id)}
                              disabled={savingUserId === user.id}
                              className="inline-flex h-[50px] min-w-[132px] items-center justify-center gap-2 rounded-full bg-stone-900 px-5 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
                            >
                              {savingUserId === user.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                              Salvar
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
