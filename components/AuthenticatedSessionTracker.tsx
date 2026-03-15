'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type AuthenticatedSessionTrackerProps = {
  sourcePrefix?: string;
};

function postTrackedMinutes(durationMinutes: number, source: string) {
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    return;
  }

  const payload = JSON.stringify({
    durationMinutes,
    source,
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon('/api/dashboard/aluno/session', blob);
    return;
  }

  fetch('/api/dashboard/aluno/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

export function AuthenticatedSessionTracker({
  sourcePrefix = 'internal',
}: AuthenticatedSessionTrackerProps) {
  const pathname = usePathname();

  useEffect(() => {
    let startedAt = Date.now();
    let lastFlushedAt = Date.now();

    const source = `${sourcePrefix}:${pathname || '/'}`;

    const flushTrackedMinutes = (force: boolean) => {
      const now = Date.now();
      const elapsedMinutes = Math.floor((now - lastFlushedAt) / 60000);
      const durationMinutes = force && elapsedMinutes < 1
        ? Math.round((now - startedAt) / 60000)
        : elapsedMinutes;

      if (durationMinutes <= 0) {
        return;
      }

      postTrackedMinutes(durationMinutes, source);
      lastFlushedAt = now;
      startedAt = now;
    };

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        flushTrackedMinutes(false);
      }
    }, 60000);

    const handlePageHide = () => {
      flushTrackedMinutes(true);
      window.clearInterval(intervalId);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushTrackedMinutes(true);
      } else {
        startedAt = Date.now();
        lastFlushedAt = Date.now();
      }
    };

    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      flushTrackedMinutes(true);
      window.clearInterval(intervalId);
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname, sourcePrefix]);

  return null;
}
