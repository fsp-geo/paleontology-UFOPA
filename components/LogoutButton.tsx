'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';

export function LogoutButton({
  label = 'Sair do sistema',
  className = '',
}: {
  label?: string;
  className?: string;
}) {
  const [submitting, setSubmitting] = useState(false);

  const handleLogout = async () => {
    setSubmitting(true);
    window.location.replace('/sair');
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
