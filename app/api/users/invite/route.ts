import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserContext, hasAnyAllowedRole } from '@/lib/current-user';
import { createAdminClient, isSupabaseAdminConfigured } from '@/lib/supabase-admin';
import { syncUser } from '@/lib/user-sync';
import { getManageableRoles, replaceUserRoles, MANAGE_USERS_ROLES, USER_TYPES } from '@/lib/user-management';

export async function POST(request: Request) {
  try {
    const context = await getCurrentUserContext();

    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasAnyAllowedRole(context.roleCodes, [...MANAGE_USERS_ROLES])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!isSupabaseAdminConfigured) {
      return NextResponse.json(
        { error: 'Supabase service role key is not configured for sending invitations' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const name = String(body.name || '').trim();
    const roleCode = String(body.roleCode || '').trim().toLowerCase();
    const userType = String(body.userType || '').trim().toLowerCase();
    const institution = String(body.institution || '').trim();
    const department = String(body.department || '').trim();

    if (!email || !roleCode || !userType) {
      return NextResponse.json({ error: 'Email, role and user type are required' }, { status: 400 });
    }

    if (!USER_TYPES.includes(userType as (typeof USER_TYPES)[number])) {
      return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
    }

    if (!context.roleCodes.includes('admin') && roleCode === 'admin') {
      return NextResponse.json({ error: 'Only admins can invite admin accounts' }, { status: 403 });
    }

    const allowedRoles = await getManageableRoles(context.roleCodes);
    if (!allowedRoles.some((role) => role.code === roleCode)) {
      return NextResponse.json({ error: 'Invalid or unauthorized role selection' }, { status: 400 });
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Supabase admin client unavailable' }, { status: 503 });
    }

    const redirectTo = process.env.NEXT_PUBLIC_SITE_URL || 'http://127.0.0.1:3000/acesso-ao-portal-interno';

    const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo,
      data: {
        full_name: name || null,
        role: roleCode,
        roles: [roleCode],
        status: 'invited',
        user_type: userType,
        institution: institution || null,
        department: department || null,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Supabase did not return the invited user' }, { status: 500 });
    }

    const syncedUser = await syncUser(data.user);

    if (syncedUser) {
      await prisma.user.update({
        where: { id: syncedUser.id },
        data: {
          status: 'invited',
          userType,
          institution: institution || null,
          department: department || null,
          invitedById: context.supabaseUser.id,
          name: name || syncedUser.name,
        },
      });

      await replaceUserRoles(syncedUser.id, [roleCode], context.supabaseUser.id);
    }

    const finalUser = syncedUser
      ? await prisma.user.findUnique({
          where: { id: syncedUser.id },
          include: {
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        })
      : null;

    return NextResponse.json({
      success: true,
      user: finalUser
        ? {
            id: finalUser.id,
            email: finalUser.email,
            name: finalUser.name,
            status: finalUser.status,
            userType: finalUser.userType,
            institution: finalUser.institution,
            department: finalUser.department,
            lastLoginAt: finalUser.lastLoginAt,
            createdAt: finalUser.createdAt,
            roleCodes: finalUser.userRoles.map((item) => item.role.code),
          }
        : null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
