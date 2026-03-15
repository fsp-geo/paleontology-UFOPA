import { prisma } from './prisma';

const DEFAULT_ROLES = [
  {
    code: 'admin',
    name: 'Administrador',
    description: 'Acesso total ao sistema e gerenciamento de perfis.',
  },
  {
    code: 'gestor',
    name: 'Gestor',
    description: 'Gerencia fluxos administrativos, aprovacoes e prestacao de contas.',
  },
  {
    code: 'professor',
    name: 'Professor',
    description: 'Acompanha estudantes, revisa conteudo e acessa dashboards academicos.',
  },
  {
    code: 'pesquisador',
    name: 'Pesquisador',
    description: 'Acessa conteudos internos de pesquisa e recursos do acervo.',
  },
  {
    code: 'aluno',
    name: 'Aluno',
    description: 'Acessa dashboard academico, submisses e feedbacks.',
  },
  {
    code: 'visitante',
    name: 'Visitante',
    description: 'Perfil basico para usuarios autenticados ainda nao aprovados.',
  },
];

type SyncableSupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

async function ensureRolesExist() {
  await Promise.all(
    DEFAULT_ROLES.map((role) =>
      prisma.role.upsert({
        where: { code: role.code },
        update: {
          name: role.name,
          description: role.description,
        },
        create: role,
      })
    )
  );
}

function extractRoleCodes(user: SyncableSupabaseUser) {
  const metadataRoles = user.user_metadata?.roles;
  const appRoles = user.app_metadata?.roles;
  const metadataRole = user.user_metadata?.role;
  const appRole = user.app_metadata?.role;
  const userType =
    typeof user.user_metadata?.user_type === 'string'
      ? user.user_metadata.user_type.trim().toLowerCase()
      : null;
  const providers = Array.isArray(user.app_metadata?.providers)
    ? user.app_metadata.providers.map((provider) => String(provider).trim().toLowerCase())
    : [];
  const source = Array.isArray(appRoles)
    ? appRoles
    : Array.isArray(metadataRoles)
      ? metadataRoles
      : appRole
        ? [appRole]
        : metadataRole
          ? [metadataRole]
          : [];
  const normalized = source
    .map((role) => String(role).trim().toLowerCase())
    .filter(Boolean);

  if (normalized.length > 0) {
    return Array.from(new Set(normalized));
  }

  if (userType === 'public') {
    return ['aluno'];
  }

  if (providers.includes('google')) {
    return ['aluno'];
  }

  return ['visitante'];
}

export async function syncUser(supabaseUser: SyncableSupabaseUser) {
  if (!supabaseUser.id || !supabaseUser.email) {
    return null;
  }

  await ensureRolesExist();

  const fullName =
    typeof supabaseUser.user_metadata?.full_name === 'string'
      ? supabaseUser.user_metadata.full_name
      : typeof supabaseUser.user_metadata?.name === 'string'
        ? supabaseUser.user_metadata.name
        : null;

  const institution =
    typeof supabaseUser.user_metadata?.institution === 'string'
      ? supabaseUser.user_metadata.institution
      : null;

  const department =
    typeof supabaseUser.user_metadata?.department === 'string'
      ? supabaseUser.user_metadata.department
      : null;

  const sigaaLogin =
    typeof supabaseUser.user_metadata?.sigaa_login === 'string'
      ? supabaseUser.user_metadata.sigaa_login
      : null;

  const lattesUrl =
    typeof supabaseUser.user_metadata?.lattes_url === 'string'
      ? supabaseUser.user_metadata.lattes_url
      : null;

  const scholarUrl =
    typeof supabaseUser.user_metadata?.scholar_url === 'string'
      ? supabaseUser.user_metadata.scholar_url
      : null;

  const researchgateUrl =
    typeof supabaseUser.user_metadata?.researchgate_url === 'string'
      ? supabaseUser.user_metadata.researchgate_url
      : null;

  const userType =
    typeof supabaseUser.user_metadata?.user_type === 'string'
      ? supabaseUser.user_metadata.user_type
      : 'internal';

  const status =
    typeof supabaseUser.user_metadata?.status === 'string'
      ? supabaseUser.user_metadata.status
      : 'active';

  const profile = await prisma.user.upsert({
    where: { id: supabaseUser.id },
    update: {
      email: supabaseUser.email,
      name: fullName,
      institution,
      department,
      sigaaLogin,
      lattesUrl,
      scholarUrl,
      researchgateUrl,
      userType,
      status,
      lastLoginAt: new Date(),
    },
    create: {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: fullName,
      institution,
      department,
      sigaaLogin,
      lattesUrl,
      scholarUrl,
      researchgateUrl,
      userType,
      status,
      lastLoginAt: new Date(),
    },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  const roleCodes = extractRoleCodes(supabaseUser);
  const roles = await prisma.role.findMany({
    where: {
      code: {
        in: roleCodes,
      },
    },
  });

  const existingRoleCodes = new Set(profile.userRoles.map((item) => item.role.code));
  const missingRoles = roles.filter((role) => !existingRoleCodes.has(role.code));

  if (missingRoles.length > 0) {
    await prisma.userRole.createMany({
      data: missingRoles.map((role) => ({
        userId: profile.id,
        roleId: role.id,
      })),
      skipDuplicates: true,
    });
  }

  return prisma.user.findUnique({
    where: { id: profile.id },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });
}
