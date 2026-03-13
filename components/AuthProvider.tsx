'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { demoUser, isLocalDemoMode, isSupabaseConfigured } from '@/lib/demo-mode';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const isDemoContext = isLocalDemoMode || !isSupabaseConfigured || !supabase;
  const [user, setUser] = useState<User | null>(() => (isDemoContext ? (demoUser as unknown as User) : null));
  const [loading, setLoading] = useState(!isDemoContext);

  useEffect(() => {
    if (isDemoContext) {
      return;
    }

    const client = supabase!;

    const setData = async () => {
      const {
        data: { session },
        error,
      } = await client.auth.getSession();

      if (error) {
        throw error;
      }

      setUser(session?.user ?? null);
      setLoading(false);
    };

    const {
      data: listener,
    } = client.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        try {
          const res = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: session.user }),
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('Sync failed with status:', res.status, errorData);
          }
        } catch (err) {
          console.error('Network error during user sync:', err);
        }
      }
    });

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [isDemoContext]);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
