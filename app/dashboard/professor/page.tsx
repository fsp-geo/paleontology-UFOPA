import { redirect } from 'next/navigation';
import { hasAnyAllowedRole, getCurrentUserContext } from '@/lib/current-user';

const ALLOWED_ROLES = ['admin', 'gestor', 'professor'];

export default async function ProfessorDashboardPage() {
  const context = await getCurrentUserContext();

  if (!context) {
    redirect('/acesso-ao-portal-interno?next=/dashboard/professor');
  }

  if (!hasAnyAllowedRole(context.roleCodes, ALLOWED_ROLES)) {
    redirect(context.homePath);
  }

  return (
    <main className="h-screen w-full overflow-hidden bg-white">
      <object data="/stitch/dashboard-professor.html" type="text/html" className="h-full w-full" aria-label="Dashboard do Professor" />
    </main>
  );
}
