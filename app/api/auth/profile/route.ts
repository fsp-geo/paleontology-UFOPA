import { NextRequest, NextResponse } from 'next/server';
import {
  canAccessPath,
  getAllowedRolesForPath,
  getPostLoginRedirectPath,
  sanitizeNextPath,
} from '@/lib/access-control';
import { getCurrentUserContext } from '@/lib/current-user';

function getDisplayName(name: string | null | undefined, email: string | undefined) {
  if (name?.trim()) {
    return name.trim();
  }

  return email?.split('@')[0] || 'Usuario';
}

function getAvatarInitials(displayName: string) {
  const parts = displayName
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return 'U';
  }

  return parts.map((part) => part[0]?.toUpperCase() || '').join('');
}

function getRoleLabel(primaryRole: string) {
  const labels: Record<string, string> = {
    admin: 'Administrador',
    gestor: 'Gestor',
    professor: 'Professor',
    pesquisador: 'Pesquisador',
    aluno: 'Aluno',
    visitante: 'Visitante',
  };

  return labels[primaryRole] || 'Usuario autenticado';
}

export async function GET(request: NextRequest) {
  const context = await getCurrentUserContext();

  if (!context) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const nextPath = sanitizeNextPath(request.nextUrl.searchParams.get('next'));
  const redirectPath = getPostLoginRedirectPath(nextPath, context.roleCodes);
  const displayName = getDisplayName(context.profile?.name, context.supabaseUser.email);
  const avatarInitials = getAvatarInitials(displayName);
  const displayRoleLabel = getRoleLabel(context.primaryRole);

  return NextResponse.json({
    userId: context.supabaseUser.id,
    email: context.supabaseUser.email,
    roleCodes: context.roleCodes,
    primaryRole: context.primaryRole,
    homePath: context.homePath,
    nextPath,
    redirectPath,
    allowedRolesForNextPath: nextPath ? getAllowedRolesForPath(nextPath) : null,
    canAccessNextPath: nextPath ? canAccessPath(nextPath, context.roleCodes) : true,
    displayName,
    avatarInitials,
    displayRoleLabel,
    profile: context.profile,
  });
}
