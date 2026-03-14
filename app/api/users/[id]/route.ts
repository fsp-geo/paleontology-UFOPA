import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { createAdminClient, isSupabaseAdminConfigured } from '@/lib/supabase-admin';
import { getManageableRoles, replaceUserRoles, MANAGE_USERS_ROLES, USER_STATUSES, USER_TYPES } from '@/lib/user-management';

function isValidOption(value: string, options: readonly string[]) {
  return options.includes(value);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await getCurrentUserContext();

    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasAnyAllowedRole(context.roleCodes, [...MANAGE_USERS_ROLES])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const roleCode = String(body.roleCode || '').trim().toLowerCase();
    const status = String(body.status || '').trim().toLowerCase();
    const userType = String(body.userType || '').trim().toLowerCase();

    if (!roleCode || !status || !userType) {
      return NextResponse.json({ error: 'Role, status and user type are required' }, { status: 400 });
    }

    if (!isValidOption(status, USER_STATUSES) || !isValidOption(userType, USER_TYPES)) {
      return NextResponse.json({ error: 'Invalid status or user type' }, { status: 400 });
    }

    if (!context.roleCodes.includes('admin') && roleCode === 'admin') {
      return NextResponse.json({ error: 'Only admins can assign the admin role' }, { status: 403 });
    }

    const allowedRoles = await getManageableRoles(context.roleCodes);
    if (!allowedRoles.some((role) => role.code === roleCode)) {
      return NextResponse.json({ error: 'Invalid or unauthorized role selection' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const existingRoleCodes = existingUser.userRoles.map((item) => item.role.code);

    if (!context.roleCodes.includes('admin') && existingRoleCodes.includes('admin')) {
      return NextResponse.json({ error: 'Only admins can edit admin accounts' }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        status,
        userType,
        institution: typeof body.institution === 'string' ? body.institution.trim() || null : existingUser.institution,
        department: typeof body.department === 'string' ? body.department.trim() || null : existingUser.department,
      },
    });

    await replaceUserRoles(updatedUser.id, [roleCode], context.supabaseUser.id);

    const hydratedUser = await prisma.user.findUnique({
      where: { id: updatedUser.id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      user: {
        id: hydratedUser!.id,
        email: hydratedUser!.email,
        name: hydratedUser!.name,
        status: hydratedUser!.status,
        userType: hydratedUser!.userType,
        institution: hydratedUser!.institution,
        department: hydratedUser!.department,
        lastLoginAt: hydratedUser!.lastLoginAt,
        createdAt: hydratedUser!.createdAt,
        roleCodes: hydratedUser!.userRoles.map((item) => item.role.code),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await getCurrentUserContext();

    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasAnyAllowedRole(context.roleCodes, [...MANAGE_USERS_ROLES])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    if (id === context.supabaseUser.id) {
      return NextResponse.json({ error: 'Voce nao pode excluir a propria conta por esta tela' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (existingUser.userRoles.some((item) => item.role.code === 'admin')) {
      return NextResponse.json({ error: 'Contas admin devem ser removidas manualmente por seguranca' }, { status: 400 });
    }

    if (!isSupabaseAdminConfigured) {
      return NextResponse.json({ error: 'Supabase admin client unavailable' }, { status: 503 });
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Supabase admin client unavailable' }, { status: 503 });
    }

    const { error } = await adminClient.auth.admin.deleteUser(id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedUserId: id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
