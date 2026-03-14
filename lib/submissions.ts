import { prisma } from './prisma';

export const SUBMISSION_TYPES = ['work', 'site_post'] as const;
export const SUBMISSION_STATUSES = ['pending', 'approved', 'rejected'] as const;

export function canReviewSubmissions(roleCodes: string[]) {
  return roleCodes.includes('professor');
}

export function canSubmitContent(roleCodes: string[]) {
  return roleCodes.includes('pesquisador');
}

export function canReadContent(roleCodes: string[]) {
  return roleCodes.includes('professor') || roleCodes.includes('pesquisador');
}

export async function getSubmissions(roleCodes: string[], userId: string, type?: (typeof SUBMISSION_TYPES)[number]) {
  const where = {
    ...(type ? { type } : {}),
    ...(canReviewSubmissions(roleCodes) ? {} : { authorId: userId }),
  };

  return prisma.submission.findMany({
    where,
    include: {
      author: {
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

export async function getSubmissionSummary(roleCodes: string[], userId: string) {
  const where = canReviewSubmissions(roleCodes) ? {} : { authorId: userId };

  const [total, pending, approved, rejected, works, posts] = await Promise.all([
    prisma.submission.count({ where }),
    prisma.submission.count({ where: { ...where, status: 'pending' } }),
    prisma.submission.count({ where: { ...where, status: 'approved' } }),
    prisma.submission.count({ where: { ...where, status: 'rejected' } }),
    prisma.submission.count({ where: { ...where, type: 'work' } }),
    prisma.submission.count({ where: { ...where, type: 'site_post' } }),
  ]);

  return {
    total,
    pending,
    approved,
    rejected,
    works,
    posts,
  };
}
