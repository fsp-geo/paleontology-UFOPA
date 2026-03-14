import { prisma } from './prisma';

export const MANAGE_USERS_ROLES = ['admin'] as const;

export const USER_STATUSES = ['active', 'invited', 'inactive', 'suspended'] as const;
export const USER_TYPES = ['internal', 'public', 'student', 'researcher'] as const;

export async function getManageableRoles(requesterRoleCodes: string[]) {
  const roles = await prisma.role.findMany({
    orderBy: { name: 'asc' },
  });

  if (requesterRoleCodes.includes('admin')) {
    return roles;
  }

  return roles.filter((role) => role.code !== 'admin');
}

export async function getUsersForManagement() {
  return prisma.user.findMany({
    include: {
      userRoles: {
        include: {
          role: true,
        },
        orderBy: {
          assignedAt: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function replaceUserRoles(userId: string, roleCodes: string[], assignedById?: string | null) {
  const roles = await prisma.role.findMany({
    where: {
      code: {
        in: roleCodes,
      },
    },
  });

  await prisma.userRole.deleteMany({
    where: { userId },
  });

  if (roles.length === 0) {
    return;
  }

  await prisma.userRole.createMany({
    data: roles.map((role) => ({
      userId,
      roleId: role.id,
      assignedById: assignedById || null,
    })),
    skipDuplicates: true,
  });
}
