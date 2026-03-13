import { redirect } from 'next/navigation';
import { hasAnyAllowedRole, getCurrentUserContext } from '@/lib/current-user';

const ALLOWED_ROLES = ['admin', 'gestor', 'professor', 'aluno'];

export default async function StudentDashboardPage() {
  const context = await getCurrentUserContext();

  if (!context) {
    redirect('/acesso-ao-portal-interno?next=/dashboard/aluno');
  }

  if (!hasAnyAllowedRole(context.roleCodes, ALLOWED_ROLES)) {
    redirect(context.homePath);
  }

  return (
    <main className="h-screen w-full overflow-hidden bg-white">
      <object data="/stitch/dashboard-aluno.html" type="text/html" className="h-full w-full" aria-label="Dashboard do Aluno" />
    </main>
  );
}
