'use client';

import { useEffect } from 'react';

type StudentContentAccessTrackerProps = {
  title: string;
  category: string;
  contentType: string;
  contentKey: string;
  sourcePath: string;
};

export function StudentContentAccessTracker({
  title,
  category,
  contentType,
  contentKey,
  sourcePath,
}: StudentContentAccessTrackerProps) {
  useEffect(() => {
    const payload = JSON.stringify({
      title,
      category,
      contentType,
      contentKey,
      sourcePath,
    });

    fetch('/api/dashboard/aluno/content-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }, [category, contentKey, contentType, sourcePath, title]);

  return null;
}
