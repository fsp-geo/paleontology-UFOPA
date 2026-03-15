import { redirect } from 'next/navigation';
import { hasAnyAllowedRole, getCurrentUserContext } from '@/lib/current-user';
import { getStudentDashboardData } from '@/lib/student-dashboard';
import { StudentPortalShell } from '@/components/student-site/StudentPortalShell';
import { MyLearningClient } from '@/components/student-site/MyLearningClient';
import { isPortuguese } from '@/lib/site-locale';
import { getSiteLocale } from '@/lib/site-locale-server';

const ALLOWED_ROLES = ['admin', 'gestor', 'professor', 'aluno'];

function getDisplayName(name: string | null | undefined, email: string | undefined) {
  if (name?.trim()) {
    return name.trim();
  }

  return email?.split('@')[0] || 'Aluno';
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

export default async function StudentDashboardPage() {
  const locale = await getSiteLocale();
  const pt = isPortuguese(locale);
  const context = await getCurrentUserContext();

  if (!context) {
    redirect('/acesso-ao-portal-interno?next=/dashboard/aluno');
  }

  if (!hasAnyAllowedRole(context.roleCodes, ALLOWED_ROLES)) {
    redirect(context.homePath);
  }

  const dashboard = await getStudentDashboardData(context.supabaseUser.id);
  const displayName = getDisplayName(context.profile?.name, context.supabaseUser.email);
  const avatarInitials = getAvatarInitials(displayName);

  return (
    <StudentPortalShell
      activeNav="learning"
      pageTitle={pt ? 'Minha Jornada' : 'My Learning'}
      displayName={displayName}
      profileLabel={dashboard.profile.levelTitle}
      avatarInitials={avatarInitials}
      locale={locale}
    >
      <MyLearningClient
        locale={locale}
        profile={dashboard.profile}
        topicProgress={dashboard.topicProgress}
        recentAccesses={dashboard.recentAccesses}
        leaderboard={dashboard.leaderboard}
        recommendation={dashboard.recommendation}
      />
    </StudentPortalShell>
  );
}
