'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { isLocalDemoMode } from '@/lib/demo-mode';

export function LogoutButton({
  label = 'Sair do sistema',
  className = '',
}: {
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleLogout = async () => {
    setSubmitting(true);

    try {
      if (!isLocalDemoMode && supabase) {
        await supabase.auth.signOut();
      }
    } finally {
      router.replace('/acesso-ao-portal-interno');
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={submitting}
      className={className}
    >
      <LogOut className="h-4 w-4" />
      {submitting ? 'Saindo...' : label}
    </button>
  );
}
