import { NextRequest, NextResponse } from 'next/server';
import {
  canAccessPath,
  getAllowedRolesForPath,
  getPostLoginRedirectPath,
  sanitizeNextPath,
} from '@/lib/access-control';
import { getCurrentUserContext } from '@/lib/current-user';

export async function GET(request: NextRequest) {
  const context = await getCurrentUserContext();

  if (!context) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const nextPath = sanitizeNextPath(request.nextUrl.searchParams.get('next'));
  const redirectPath = getPostLoginRedirectPath(nextPath, context.roleCodes);

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
    profile: context.profile,
  });
}
