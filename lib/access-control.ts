const ROLE_PRIORITY = ['admin', 'gestor', 'professor', 'pesquisador', 'aluno', 'visitante'] as const;

export const DEFAULT_ROLE = 'visitante';

export const ROLE_HOME_PATH: Record<string, string> = {
  admin: '/dashboard/professor',
  gestor: '/prestacao-de-contas',
  professor: '/dashboard/professor',
  pesquisador: '/acervo-digital-de-fosseis',
  aluno: '/dashboard/aluno',
  visitante: '/wiki-de-estudos-paleontologicos',
};

const PATH_ROLE_RULES = [
  {
    path: '/dashboard/professor',
    roles: ['admin', 'gestor', 'professor'],
  },
  {
    path: '/dashboard/aluno',
    roles: ['admin', 'gestor', 'professor', 'aluno'],
  },
  {
    path: '/prestacao-de-contas',
    roles: ['admin', 'gestor'],
  },
  {
    path: '/acervo-digital-de-fosseis',
    roles: ['admin', 'gestor', 'professor', 'pesquisador', 'aluno'],
  },
  {
    path: '/wiki-de-estudos-paleontologicos',
    roles: ['admin', 'gestor', 'professor', 'pesquisador', 'aluno', 'visitante'],
  },
] as const;

type RoleBearingProfile = {
  userRoles?: Array<{
    role?: {
      code?: string | null;
    } | null;
  }>;
} | null;

export function getRoleCodesFromProfile(profile: RoleBearingProfile) {
  const codes = profile?.userRoles
    ?.map((item) => item.role?.code?.trim().toLowerCase())
    .filter((role): role is string => Boolean(role));

  if (!codes || codes.length === 0) {
    return [DEFAULT_ROLE];
  }

  return Array.from(new Set(codes));
}

export function getPrimaryRoleFromCodes(roleCodes: string[]) {
  return ROLE_PRIORITY.find((role) => roleCodes.includes(role)) || roleCodes[0] || DEFAULT_ROLE;
}

export function getHomePathForRoles(roleCodes: string[]) {
  const primaryRole = getPrimaryRoleFromCodes(roleCodes);
  return ROLE_HOME_PATH[primaryRole] || ROLE_HOME_PATH[DEFAULT_ROLE];
}

export function sanitizeNextPath(nextPath: string | null | undefined) {
  if (!nextPath || !nextPath.startsWith('/')) {
    return null;
  }

  return nextPath;
}

export function getAllowedRolesForPath(pathname: string) {
  const matchedRule = PATH_ROLE_RULES.find(
    (rule) => pathname === rule.path || pathname.startsWith(`${rule.path}/`)
  );

  return matchedRule?.roles ?? null;
}

export function canAccessPath(pathname: string, roleCodes: string[]) {
  const allowedRoles = getAllowedRolesForPath(pathname);

  if (!allowedRoles) {
    return true;
  }

  return allowedRoles.some((role) => roleCodes.includes(role));
}

export function getPostLoginRedirectPath(nextPath: string | null | undefined, roleCodes: string[]) {
  const safeNextPath = sanitizeNextPath(nextPath);

  if (safeNextPath && canAccessPath(safeNextPath, roleCodes)) {
    return safeNextPath;
  }

  return getHomePathForRoles(roleCodes);
}
