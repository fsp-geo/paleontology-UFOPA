import { NextResponse } from 'next/server';
import { isDatabaseConfigured, isLocalDemoMode, isSupabaseConfigured } from '@/lib/demo-mode';

export async function GET() {
  const keys = Object.keys(process.env).filter((key) =>
    key.includes('URL') || key.includes('KEY') || key.includes('SECRET')
  );

  return NextResponse.json({
    keys,
    isLocalDemoMode,
    hasSupabaseConfig: isSupabaseConfigured,
    hasDatabaseConfig: isDatabaseConfigured,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasDirectUrl: !!process.env.DIRECT_URL,
    nodeEnv: process.env.NODE_ENV,
  });
}
