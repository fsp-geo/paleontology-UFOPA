import { prisma } from './prisma';

export const ACCOUNTABILITY_CATEGORIES = [
  'travel',
  'lab',
  'field',
  'publication',
  'other',
] as const;

export const ACCOUNTABILITY_STATUSES = ['pending', 'approved', 'rejected'] as const;

export type AccountabilityRole = 'admin' | 'professor' | 'pesquisador';

export function canManageAccountability(roleCodes: string[]) {
  return roleCodes.includes('professor');
}

export function canSubmitAccountability(roleCodes: string[]) {
  return roleCodes.includes('professor') || roleCodes.includes('pesquisador');
}

export async function getAccountabilityEntries(roleCodes: string[], userId: string) {
  const where = canManageAccountability(roleCodes) ? {} : { submitterId: userId };

  return prisma.accountabilityEntry.findMany({
    where,
    include: {
      submitter: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getAccountabilitySummary(roleCodes: string[], userId: string) {
  const where = canManageAccountability(roleCodes) ? {} : { submitterId: userId };

  const [totalEntries, pendingEntries, approvedEntries, rejectedEntries, totalAmount] = await Promise.all([
    prisma.accountabilityEntry.count({ where }),
    prisma.accountabilityEntry.count({ where: { ...where, status: 'pending' } }),
    prisma.accountabilityEntry.count({ where: { ...where, status: 'approved' } }),
    prisma.accountabilityEntry.count({ where: { ...where, status: 'rejected' } }),
    prisma.accountabilityEntry.aggregate({
      where,
      _sum: {
        amountInCents: true,
      },
    }),
  ]);

  return {
    totalEntries,
    pendingEntries,
    approvedEntries,
    rejectedEntries,
    totalAmountInCents: totalAmount._sum.amountInCents ?? 0,
  };
}
