'use client';

import { useEffect } from 'react';

type StitchIconEnhancerProps = {
  containerId: string;
};

const ICON_ALIASES: Record<string, string> = {
  ciencia: 'science',
  'ciência': 'science',
  museu: 'museum',
  martelo: 'gavel',
  verificado: 'verified',
  politica: 'policy',
  'política': 'policy',
  publico: 'public',
  'público': 'public',
  equilibrio: 'balance',
  'equilíbrio': 'balance',
  localizacao: 'location_on',
  'localização': 'location_on',
};

function normalizeIconName(value: string | null | undefined) {
  return (value || '').replace(/\s+/g, ' ').trim();
}

export function StitchIconEnhancer({ containerId }: StitchIconEnhancerProps) {
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) {
      return;
    }

    container.querySelectorAll<HTMLElement>('.material-symbols-outlined').forEach((element) => {
      const dataIcon = element.getAttribute('data-icon');
      const current = normalizeIconName(element.textContent);
      const normalized = ICON_ALIASES[current.toLowerCase()] || dataIcon || current;

      if (normalized) {
        element.textContent = normalized;
      }

      element.setAttribute('translate', 'no');
      element.setAttribute('aria-hidden', 'true');
    });
  }, [containerId]);

  return null;
}
