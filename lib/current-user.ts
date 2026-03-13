import { demoUser, isDatabaseConfigured, isLocalDemoMode } from './demo-mode';
import { createClient } from './supabase-server';
import { syncUser } from './user-sync';
import { getHomePathForRoles, getPrimaryRoleFromCodes, getRoleCodesFromProfile } from './access-control';

export async function getCurrentUserContext() {
  if (isLocalDemoMode || !isDatabaseConfigured) {
    const roleCodes = ['admin'];

    return {
      supabaseUser: demoUser,
      profile: null,
      roleCodes,
      primaryRole: 'admin',
      homePath: getHomePathForRoles(roleCodes),
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const profile = await syncUser(user);
  const roleCodes = getRoleCodesFromProfile(profile);

  return {
    supabaseUser: user,
    profile,
    roleCodes,
    primaryRole: getPrimaryRoleFromCodes(roleCodes),
    homePath: getHomePathForRoles(roleCodes),
  };
}

export function hasAnyAllowedRole(roleCodes: string[], allowedRoles: string[]) {
  return allowedRoles.some((role) => roleCodes.includes(role));
}
