import { prisma } from './prisma';

export async function syncUser(supabaseUser: { id: string; email?: string; user_metadata?: any }) {
  console.log('syncUser called for:', supabaseUser.id);
  if (!supabaseUser.id || !supabaseUser.email) {
    console.log('syncUser: missing id or email');
    return null;
  }

  try {
    console.log('syncUser: attempting upsert');
    const result = await prisma.user.upsert({
      where: { id: supabaseUser.id },
      update: {
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
      },
      create: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
      },
    });
    console.log('syncUser: upsert successful');
    return result;
  } catch (error) {
    console.error('syncUser: upsert failed:', error);
    throw error;
  }
}
