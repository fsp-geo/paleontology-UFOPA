import { prisma } from '@/lib/prisma';

const DEFAULT_TOPICS = [
  {
    slug: 'phylogeny-foundations',
    title: 'Phylogeny',
    category: 'evolution',
    description: 'Leituras fundamentais sobre filogenia e relacoes evolutivas.',
    estimatedMinutes: 60,
  },
  {
    slug: 'taxonomy-and-classification',
    title: 'Taxonomy',
    category: 'classification',
    description: 'Principios de taxonomia e classificacao paleontologica.',
    estimatedMinutes: 45,
  },
  {
    slug: 'excavation-ethics',
    title: 'Excavation Ethics',
    category: 'fieldwork',
    description: 'Boas praticas eticas em campo e preservacao do patrimonio fossilifero.',
    estimatedMinutes: 40,
  },
];

const DEFAULT_RECOMMENDATION = {
  title: 'The Permian-Triassic Extinction Event',
  summary:
    "Deep dive into the 'Great Dying' - the Earth's most severe known extinction event. This module includes newly uploaded high-resolution scans from the Siberian Traps.",
  contentType: 'study-module',
  href: '/wiki-de-estudos-paleontologicos',
  estimatedMinutes: 45,
  matchReason: 'Recomendado como ponto de partida para novos exploradores do portal.',
  imageUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDJFvrlWnF37AgdURVcDELpfWZYrVCri4I5TVUAjjtHNHUKWKNtlzUmOULEHSavIkKA75qRZXHBFyWFplQT8OMJiz2SIbKg-viDmHJou-AKNveA2iRz3Z3cEfGnZ8gebQqoVmg3iy1JtJksYKjc1EnY2PVx1uPod11nbFBArMCc9ZeM6DakTV9kwL-wLcB16gKs-Y3eNma6D0IldFkKRkntO3AEl1MH0tlEJ1VDYxrK71OOSPK3ftFSHqDDruu0k5Mtp0F46MWt_FM',
  priority: 100,
};

const LEVELS = [
  { minimumDays: 0, title: 'Explorer I' },
  { minimumDays: 5, title: 'Explorer II' },
  { minimumDays: 12, title: 'Explorer III' },
  { minimumDays: 20, title: 'Advanced Explorer' },
  { minimumDays: 35, title: 'Skilled Explorer' },
  { minimumDays: 50, title: 'Senior Explorer' },
  { minimumDays: 75, title: 'Expert Explorer' },
  { minimumDays: 110, title: 'Lead Explorer' },
  { minimumDays: 150, title: 'Principal Explorer' },
  { minimumDays: 210, title: 'Master Explorer' },
  { minimumDays: 280, title: 'Elite Explorer' },
  { minimumDays: 365, title: 'Legend Explorer' },
] as const;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isoDay(date: Date) {
  return startOfDay(date).toISOString().slice(0, 10);
}

function dateFromIsoDay(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function diffInDays(current: Date, previous: Date) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((startOfDay(current).getTime() - startOfDay(previous).getTime()) / msPerDay);
}

function getLevelTitle(activeDaysCount: number) {
  let levelTitle: string = LEVELS[0].title;

  for (const level of LEVELS) {
    if (activeDaysCount >= level.minimumDays) {
      levelTitle = level.title;
    } else {
      break;
    }
  }

  return levelTitle;
}

function getDisplayName(name: string | null | undefined, email: string) {
  if (name?.trim()) return name.trim();
  return email.split('@')[0] || 'Aluno';
}

function calculateStreakDays(activeDates: Date[]) {
  if (activeDates.length === 0) {
    return 0;
  }

  const distinctDates = Array.from(new Set(activeDates.map((date) => isoDay(date)))).sort().reverse();
  const today = startOfDay(new Date());
  const todayKey = isoDay(today);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = isoDay(yesterday);
  const latestKey = distinctDates[0];

  if (latestKey !== todayKey && latestKey !== yesterdayKey) {
    return 0;
  }

  let expectedKey = latestKey === todayKey ? todayKey : yesterdayKey;
  let streak = 0;

  for (const dateKey of distinctDates) {
    if (expectedKey !== dateKey) {
      break;
    }

    streak += 1;
    const previousDay = dateFromIsoDay(expectedKey);
    previousDay.setDate(previousDay.getDate() - 1);
    expectedKey = isoDay(previousDay);
  }

  return streak;
}

async function ensureLearningCatalog() {
  await Promise.all(
    DEFAULT_TOPICS.map((topic) =>
      prisma.learningTopic.upsert({
        where: { slug: topic.slug },
        update: {
          title: topic.title,
          category: topic.category,
          description: topic.description,
          estimatedMinutes: topic.estimatedMinutes,
        },
        create: topic,
      })
    )
  );
}

async function syncStudentProfileMetrics(userId: string) {
  await prisma.learningSession.deleteMany({
    where: {
      userId,
      source: 'dashboard-seed',
    },
  });

  const [profile, sessionAggregate, accessCount, completedTopics, activeSessionDays] = await Promise.all([
    prisma.studentProfile.findUniqueOrThrow({
      where: { userId },
    }),
    prisma.learningSession.aggregate({
      where: { userId },
      _sum: {
        durationMinutes: true,
      },
    }),
    prisma.contentAccessLog.count({
      where: { userId },
    }),
    prisma.learningTopicProgress.count({
      where: {
        userId,
        percentComplete: {
          gte: 100,
        },
      },
    }),
    prisma.learningSession.findMany({
      where: { userId },
      select: {
        activityDate: true,
      },
      distinct: ['activityDate'],
      orderBy: {
        activityDate: 'desc',
      },
    }),
  ]);

  const totalStudyMinutes = sessionAggregate._sum.durationMinutes || 0;
  const activeDaysCount = activeSessionDays.length;
  const streakDays = calculateStreakDays(activeSessionDays.map((entry) => entry.activityDate));
  const points = totalStudyMinutes * 2 + accessCount * 5 + completedTopics * 100;
  const levelTitle = getLevelTitle(activeDaysCount);
  const lastActiveDate = activeSessionDays[0]?.activityDate ?? null;

  if (
    profile.totalStudyMinutes === totalStudyMinutes &&
    profile.points === points &&
    profile.streakDays === streakDays &&
    profile.levelTitle === levelTitle &&
    ((profile.lastActiveDate && lastActiveDate && isoDay(profile.lastActiveDate) === isoDay(lastActiveDate)) ||
      (!profile.lastActiveDate && !lastActiveDate))
  ) {
    return {
      profile,
      activeDaysCount,
      totalStudyMinutes,
    };
  }

  const updatedProfile = await prisma.studentProfile.update({
    where: { userId },
    data: {
      points,
      streakDays,
      totalStudyMinutes,
      lastActiveDate,
      levelTitle,
    },
  });

  return {
    profile: updatedProfile,
    activeDaysCount,
    totalStudyMinutes,
  };
}

export async function ensureStudentDashboardState(userId: string) {
  await ensureLearningCatalog();

  const profile = await prisma.studentProfile.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      points: 0,
      streakDays: 0,
      levelTitle: getLevelTitle(0),
      totalStudyMinutes: 0,
      preferredTopics: [],
      lastActiveDate: null,
    },
  });

  const topics = await prisma.learningTopic.findMany({
    where: {
      slug: {
        in: DEFAULT_TOPICS.map((topic) => topic.slug),
      },
    },
  });

  await Promise.all(
    topics.map((topic) =>
      prisma.learningTopicProgress.upsert({
        where: {
          userId_topicId: {
            userId,
            topicId: topic.id,
          },
        },
        update: {
          percentComplete: 0,
          minutesSpent: 0,
          completedAt: null,
        },
        create: {
          userId,
          topicId: topic.id,
          percentComplete: 0,
          minutesSpent: 0,
          completedAt: null,
        },
      })
    )
  );

  const existingRecommendation = await prisma.studyRecommendation.findFirst({
    where: {
      studentProfileId: profile.userId,
      isActive: true,
    },
  });

  if (!existingRecommendation) {
    await prisma.studyRecommendation.create({
      data: {
        studentProfileId: profile.userId,
        ...DEFAULT_RECOMMENDATION,
      },
    });
  }

  return syncStudentProfileMetrics(userId);
}

export async function recordLearningSession(userId: string, durationMinutes: number, source = 'site') {
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    throw new Error('Duracao invalida.');
  }

  const safeDuration = Math.max(1, Math.min(240, Math.round(durationMinutes)));
  const now = new Date();
  const startedAt = new Date(now.getTime() - safeDuration * 60 * 1000);

  await ensureStudentDashboardState(userId);

  await prisma.learningSession.create({
    data: {
      userId,
      startedAt,
      endedAt: now,
      durationMinutes: safeDuration,
      activityDate: startOfDay(now),
      source,
    },
  });

  return syncStudentProfileMetrics(userId);
}

export async function recordContentAccess(input: {
  userId: string;
  contentType: string;
  contentKey: string;
  title: string;
  category: string;
  sourcePath?: string | null;
}) {
  await ensureStudentDashboardState(input.userId);

  const access = await prisma.contentAccessLog.create({
    data: {
      userId: input.userId,
      contentType: input.contentType,
      contentKey: input.contentKey,
      title: input.title,
      category: input.category,
      sourcePath: input.sourcePath || null,
    },
  });

  await syncStudentProfileMetrics(input.userId);
  return access;
}

export async function upsertTopicProgress(input: {
  userId: string;
  topicSlug: string;
  title: string;
  category: string;
  description?: string;
  estimatedMinutes?: number;
  percentComplete: number;
  minutesSpent?: number;
}) {
  await ensureStudentDashboardState(input.userId);

  const topic = await prisma.learningTopic.upsert({
    where: { slug: input.topicSlug },
    update: {
      title: input.title,
      category: input.category,
      description: input.description,
      estimatedMinutes: input.estimatedMinutes,
    },
    create: {
      slug: input.topicSlug,
      title: input.title,
      category: input.category,
      description: input.description,
      estimatedMinutes: input.estimatedMinutes,
    },
  });

  const safePercent = Math.max(0, Math.min(100, Math.round(input.percentComplete)));
  const safeMinutes = Math.max(0, Math.round(input.minutesSpent ?? 0));

  const progress = await prisma.learningTopicProgress.upsert({
    where: {
      userId_topicId: {
        userId: input.userId,
        topicId: topic.id,
      },
    },
    update: {
      percentComplete: safePercent,
      minutesSpent: safeMinutes,
      lastReadAt: new Date(),
      completedAt: safePercent >= 100 ? new Date() : null,
    },
    create: {
      userId: input.userId,
      topicId: topic.id,
      percentComplete: safePercent,
      minutesSpent: safeMinutes,
      completedAt: safePercent >= 100 ? new Date() : null,
    },
  });

  await syncStudentProfileMetrics(input.userId);
  return progress;
}

export async function getStudentDashboardData(userId: string) {
  await ensureStudentDashboardState(userId);

  const [
    user,
    synced,
    sessions,
    progressEntries,
    recentAccesses,
    leaderboard,
    recommendation,
  ] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
    }),
    syncStudentProfileMetrics(userId),
    prisma.learningSession.findMany({
      where: {
        userId,
        activityDate: {
          gte: startOfDay(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)),
        },
      },
      orderBy: {
        activityDate: 'asc',
      },
    }),
    prisma.learningTopicProgress.findMany({
      where: { userId },
      include: {
        topic: true,
      },
      orderBy: {
        topic: {
          title: 'asc',
        },
      },
      take: 3,
    }),
    prisma.contentAccessLog.findMany({
      where: { userId },
      orderBy: {
        accessedAt: 'desc',
      },
      take: 4,
    }),
    prisma.studentProfile.findMany({
      orderBy: [{ points: 'desc' }, { updatedAt: 'asc' }],
      take: 20,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.studyRecommendation.findFirst({
      where: {
        studentProfileId: userId,
        isActive: true,
      },
      orderBy: [{ priority: 'desc' }, { updatedAt: 'desc' }],
    }),
  ]);

  const profile = synced.profile;
  const activeDaysCount = synced.activeDaysCount;
  const today = startOfDay(new Date());
  const dailyMap = new Map<string, number>();
  const weeklyDates = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - offset));
    return date;
  });

  weeklyDates.forEach((date) => {
    dailyMap.set(isoDay(date), 0);
  });

  sessions.forEach((session) => {
    const key = isoDay(session.activityDate);
    dailyMap.set(key, (dailyMap.get(key) || 0) + session.durationMinutes);
  });

  const weeklyHours = weeklyDates.map((date) => {
    const dateKey = isoDay(date);
    const minutes = dailyMap.get(dateKey) || 0;

    return {
      dateKey,
      label: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
      minutes,
      hours: Number((minutes / 60).toFixed(1)),
      percentOfDay: Number(((Math.min(minutes, 24 * 60) / (24 * 60)) * 100).toFixed(2)),
      isToday: dateKey === isoDay(today),
    };
  });

  const leaderboardRows = leaderboard.map((row, index) => ({
    position: index + 1,
    userId: row.user.id,
    name: getDisplayName(row.user.name, row.user.email),
    points: row.points,
    isCurrentUser: row.user.id === userId,
  }));

  const currentRank = leaderboardRows.find((row) => row.isCurrentUser)?.position ?? leaderboardRows.length + 1;
  const totalWeeklyMinutes = weeklyHours.reduce((sum, item) => sum + item.minutes, 0);

  return {
    profile: {
      name: getDisplayName(user.name, user.email),
      email: user.email,
      streakDays: profile.streakDays,
      activeDaysCount,
      levelTitle: profile.levelTitle,
      points: profile.points,
      totalStudyMinutes: profile.totalStudyMinutes,
      weeklyHours,
      totalWeeklyMinutes,
      currentRank,
    },
    topicProgress: progressEntries.map((entry) => ({
      id: entry.id,
      slug: entry.topic.slug,
      title: entry.topic.title,
      percentComplete: entry.percentComplete,
      minutesSpent: entry.minutesSpent,
    })),
    recentAccesses: recentAccesses.map((access) => ({
      id: access.id,
      title: access.title,
      category: access.category,
      contentType: access.contentType,
      sourcePath: access.sourcePath,
      accessedAt: access.accessedAt,
    })),
    leaderboard: leaderboardRows,
    recommendation: recommendation
      ? {
          title: recommendation.title,
          summary: recommendation.summary,
          href: recommendation.href,
          estimatedMinutes: recommendation.estimatedMinutes,
          matchReason: recommendation.matchReason,
          imageUrl: recommendation.imageUrl,
        }
      : null,
    levelRoadmap: LEVELS,
  };
}
