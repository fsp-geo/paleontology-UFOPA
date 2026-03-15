'use client';

import { useEffect } from 'react';

const ROUTES: Record<string, string> = {
  Articles: '/acesso-ao-portal-interno?origin=public',
  About: '/about',
  Region: '/region',
  Contact: '/contact',
  'Explore The Portal': '/acesso-ao-portal-interno?origin=public',
  'Internal Area': '/acesso-ao-portal-interno?origin=public',
  'Sign In to Portal': '/acesso-ao-portal-interno?origin=public',
  'View All Archives': '/acesso-ao-portal-interno?origin=public',
  'Research Papers': '/research-papers',
  'Field Guides': '/field-guides',
  'Dataset Access': '/dataset-access',
  'API Documentation': '/api-documentation',
  'About Us': '/about-us',
  Partnerships: '/partnerships',
  'Petrobras ESG': '/petrobras-esg',
  'Legal Notices': '/legal-notices',
  PETROBRAS: '/petrobras',
  'Privacy Policy': '/privacy-policy',
  'Terms of Use': '/terms-of-use',
  'Contact Us': '/contact',
  'Contact Curator': '/contact',
  'View Collections': '/acesso-ao-portal-interno?origin=public',
  'Review our Ethics Charter': '/legal-notices',
};

type PublicContentEnhancerProps = {
  containerId: string;
};

function normalizeText(value: string | null | undefined) {
  return (value || '').replace(/\s+/g, ' ').trim();
}

export function PublicContentEnhancer({ containerId }: PublicContentEnhancerProps) {
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) {
      return;
    }

    container.querySelectorAll<HTMLElement>('.material-symbols-outlined').forEach((element) => {
      const dataIcon = element.getAttribute('data-icon');
      if (dataIcon) {
        element.textContent = dataIcon;
      }

      element.setAttribute('translate', 'no');
      element.setAttribute('aria-hidden', 'true');
    });

    const listeners: Array<() => void> = [];

    container.querySelectorAll<HTMLElement>('[data-route]').forEach((element) => {
      const route = element.getAttribute('data-route');
      if (!route) {
        return;
      }

      if (element.tagName === 'A') {
        element.setAttribute('href', route);
        return;
      }

      element.style.cursor = 'pointer';
      const handler = () => {
        window.location.href = route;
      };
      element.addEventListener('click', handler);
      listeners.push(() => element.removeEventListener('click', handler));
    });

    container.querySelectorAll<HTMLAnchorElement>('a[href="#"]').forEach((element) => {
      const route = ROUTES[normalizeText(element.textContent)];
      if (route) {
        element.setAttribute('href', route);
        return;
      }

      const handler = (event: Event) => {
        event.preventDefault();
      };

      element.addEventListener('click', handler);
      listeners.push(() => element.removeEventListener('click', handler));
    });

    container.querySelectorAll<HTMLButtonElement>('button').forEach((element) => {
      if (element.hasAttribute('data-route')) {
        return;
      }

      const route = ROUTES[normalizeText(element.textContent)];
      if (route) {
        const handler = () => {
          window.location.href = route;
        };
        element.style.cursor = 'pointer';
        element.addEventListener('click', handler);
        listeners.push(() => element.removeEventListener('click', handler));
        return;
      }

      const handler = (event: Event) => {
        event.preventDefault();
      };

      element.addEventListener('click', handler);
      listeners.push(() => element.removeEventListener('click', handler));
    });

    container.querySelectorAll('form').forEach((form) => {
      const handler = (event: Event) => {
        event.preventDefault();
      };

      form.addEventListener('submit', handler);
      listeners.push(() => form.removeEventListener('submit', handler));
    });

    return () => {
      listeners.forEach((dispose) => dispose());
    };
  }, [containerId]);

  return null;
}
