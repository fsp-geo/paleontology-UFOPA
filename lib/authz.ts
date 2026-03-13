import { prisma } from './prisma';
import { getPrimaryRoleFromCodes, getRoleCodesFromProfile } from './access-control';

export async function getUserProfileWithRoles(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });
}

export async function userHasAnyRole(userId: string, allowedRoles: string[]) {
  const profile = await getUserProfileWithRoles(userId);
  if (!profile) {
    return false;
  }

  const roleCodes = getRoleCodesFromProfile(profile);
  return allowedRoles.some((role) => roleCodes.includes(role));
}

export async function getPrimaryRole(userId: string) {
  const profile = await getUserProfileWithRoles(userId);
  if (!profile) {
    return null;
  }

  return getPrimaryRoleFromCodes(getRoleCodesFromProfile(profile));
}
