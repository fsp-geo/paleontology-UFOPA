import { redirect } from 'next/navigation';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { getManageableRoles, getUsersForManagement, MANAGE_USERS_ROLES } from '@/lib/user-management';
import { isSupabaseAdminConfigured } from '@/lib/supabase-admin';
import { UserManagementWorkspace } from './UserManagementWorkspace';

export default async function UserManagementPage() {
  const context = await getCurrentUserContext();

  if (!context) {
    redirect('/acesso-ao-portal-interno?next=/gestao-de-usuarios');
  }

  if (!hasAnyAllowedRole(context.roleCodes, [...MANAGE_USERS_ROLES])) {
    redirect(context.homePath);
  }

  const [users, roles] = await Promise.all([
    getUsersForManagement(),
    getManageableRoles(context.roleCodes),
  ]);

  return (
    <UserManagementWorkspace
      canInvite={isSupabaseAdminConfigured}
      roles={roles.map((role) => ({
        code: role.code,
        name: role.name,
        description: role.description,
      }))}
      initialUsers={users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
        userType: user.userType,
        institution: user.institution,
        department: user.department,
        lastLoginAt: user.lastLoginAt?.toISOString() || null,
        createdAt: user.createdAt.toISOString(),
        roleCodes: user.userRoles.map((item) => item.role.code),
      }))}
    />
  );
}
