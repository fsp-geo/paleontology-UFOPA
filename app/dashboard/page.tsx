import { redirect } from 'next/navigation';
import { getCurrentUserContext } from '@/lib/current-user';

export default async function DashboardPage() {
  const context = await getCurrentUserContext();

  if (!context) {
    redirect('/acesso-ao-portal-interno?next=/dashboard');
  }

  redirect(context.homePath);
}
