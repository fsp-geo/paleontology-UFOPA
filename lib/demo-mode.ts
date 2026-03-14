export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const isDatabaseConfigured = Boolean(
  process.env.DATABASE_URL && process.env.DIRECT_URL
);

export const isLocalDemoMode =
  process.env.NEXT_PUBLIC_LOCAL_DEMO === 'true' || !isSupabaseConfigured;

export const demoUser = {
  id: 'demo-user',
  email: 'demo@magellan.local',
  aud: 'authenticated',
  role: 'authenticated',
  app_metadata: {},
  user_metadata: {
    full_name: 'Usuario Demo',
    role: 'Supervisor Operacional',
  },
  identities: [],
  created_at: '2026-03-11T00:00:00.000Z',
} as const;

export const demoStats = [
  {
    label: 'Pesquisadores Ativos',
    value: '48',
    type: 'COMMUNITY',
  },
  {
    label: 'Artigos Publicados',
    value: '126',
    type: 'PUBLICATIONS',
  },
  {
    label: 'Fosseis Catalogados',
    value: '2.430',
    type: 'COLLECTION',
  },
  {
    label: 'Registros na Wiki',
    value: '312',
    type: 'KNOWLEDGE',
  },
] as const;
