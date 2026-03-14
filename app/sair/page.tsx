'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { isLocalDemoMode } from '@/lib/demo-mode';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        if (!isLocalDemoMode && supabase) {
          await supabase.auth.signOut();
        }
      } finally {
        router.replace('/acesso-ao-portal-interno');
        router.refresh();
      }
    };

    run();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f1e8db] px-6 text-stone-800">
      <div className="rounded-[28px] border border-stone-200 bg-white px-8 py-10 text-center shadow-[0_24px_70px_-28px_rgba(38,27,12,0.25)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">Encerrando sessao</p>
        <p className="mt-4 text-lg text-stone-900">Estamos finalizando seu acesso com seguranca.</p>
      </div>
    </main>
  );
}
