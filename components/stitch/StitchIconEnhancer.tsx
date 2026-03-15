'use client';

import { useEffect } from 'react';

type StitchIconEnhancerProps = {
  containerId: string;
};

const ICON_ALIASES: Record<string, string> = {
  account_balance: 'account_balance',
  database: 'database',
  verified: 'verified',
  school: 'school',
  science: 'science',
  museum: 'museum',
  nature_people: 'nature_people',
  north_east: 'north_east',
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
      const fill = element.getAttribute('data-weight') === 'fill' ? 1 : 0;

      if (normalized) {
        element.textContent = normalized;
      }

      element.style.fontFamily = '"Material Symbols Outlined"';
      element.style.fontWeight = '400';
      element.style.fontStyle = 'normal';
      element.style.lineHeight = '1';
      element.style.display = 'inline-flex';
      element.style.alignItems = 'center';
      element.style.justifyContent = 'center';
      element.style.fontVariationSettings = `"FILL" ${fill}, "wght" 400, "GRAD" 0, "opsz" 24`;
      element.setAttribute('translate', 'no');
      element.setAttribute('aria-hidden', 'true');
    });
  }, [containerId]);

  return null;
}
