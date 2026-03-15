import { redirect } from 'next/navigation';
import { hasAnyAllowedRole, getCurrentUserContext } from '@/lib/current-user';
import { StudentStitchPage } from '@/components/student-site/StudentStitchPage';

const ALLOWED_ROLES = ['admin', 'gestor', 'professor', 'pesquisador', 'aluno'];

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

function getProfileLabel(primaryRole: string) {
  if (primaryRole === 'aluno') {
    return 'Student Explorer';
  }

  const labels: Record<string, string> = {
    admin: 'Administrador',
    gestor: 'Gestor',
    professor: 'Professor',
    pesquisador: 'Pesquisador',
  };

  return labels[primaryRole] || 'Perfil interno';
}

export default async function ArchivePage() {
  const context = await getCurrentUserContext();

  if (!context) {
    redirect('/acesso-ao-portal-interno?next=/acervo-digital-de-fosseis');
  }

  if (!hasAnyAllowedRole(context.roleCodes, ALLOWED_ROLES)) {
    redirect(context.homePath);
  }

  const displayName = getDisplayName(context.profile?.name, context.supabaseUser.email);
  const avatarInitials = getAvatarInitials(displayName);

  return (
    <StudentStitchPage
      fileName="acervo-digital-de-fosseis.html"
      activeNav="archive"
      pageTitle="Digital Fossil Archive"
      displayName={displayName}
      profileLabel={getProfileLabel(context.primaryRole)}
      avatarInitials={avatarInitials}
      accessLog={{
        title: 'Digital Fossil Archive',
        category: 'Archive',
        contentType: 'page',
        contentKey: 'digital-fossil-archive',
        sourcePath: '/acervo-digital-de-fosseis',
      }}
    />
  );
}
