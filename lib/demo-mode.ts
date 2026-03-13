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
    label: 'Metros Perfurados',
    value: '12.480m',
    type: 'PRODUCTION',
  },
  {
    label: 'Sondas Ativas',
    value: '18/20',
    type: 'AVAILABILITY',
  },
  {
    label: 'Furos Concluidos',
    value: '25',
    type: 'DRILLING',
  },
  {
    label: 'Em Andamento',
    value: '45',
    type: 'DRILLING',
  },
] as const;

export const demoDrillHoles = [
  {
    id: 'demo-hole-1',
    holeId: 'F-2024-001',
    project: 'Machichie',
    area: 'Zona Norte',
    status: 'EM_ANDAMENTO',
    method: 'RC',
    targetDepth: 190,
    currentDepth: 124,
    rigId: 'demo-rig-1',
    rig: {
      id: 'demo-rig-1',
      name: 'S-01',
      type: 'RC',
      status: 'ATIVA',
      contractor: 'Equipe Local',
    },
    createdById: demoUser.id,
    createdAt: '2026-03-11T00:00:00.000Z',
    updatedAt: '2026-03-11T00:00:00.000Z',
  },
  {
    id: 'demo-hole-2',
    holeId: 'F-2024-002',
    project: 'Central',
    area: 'Setor Sul',
    status: 'CONCLUIDO',
    method: 'DDH',
    targetDepth: 85,
    currentDepth: 85,
    rigId: 'demo-rig-2',
    rig: {
      id: 'demo-rig-2',
      name: 'S-03',
      type: 'DDH',
      status: 'ATIVA',
      contractor: 'Equipe Local',
    },
    createdById: demoUser.id,
    createdAt: '2026-03-10T00:00:00.000Z',
    updatedAt: '2026-03-10T00:00:00.000Z',
  },
] as const;
