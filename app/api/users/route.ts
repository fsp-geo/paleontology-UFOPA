import { NextResponse } from 'next/server';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { getUsersForManagement, MANAGE_USERS_ROLES } from '@/lib/user-management';

export async function GET() {
  try {
    const context = await getCurrentUserContext();

    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasAnyAllowedRole(context.roleCodes, [...MANAGE_USERS_ROLES])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const users = await getUsersForManagement();

    return NextResponse.json({
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
        userType: user.userType,
        institution: user.institution,
        department: user.department,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        roleCodes: user.userRoles.map((item) => item.role.code),
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
