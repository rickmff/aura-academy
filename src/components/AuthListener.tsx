"use client";

import { useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { setThemeAction } from '@/server/actions/preferences';

type Theme = 'light' | 'dark' | 'system';

function applyThemeClass(theme: Theme | undefined) {
  if (!theme) return;
  try {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
  } catch { }
}

export default function AuthListener() {
  const router = useRouter();
  const previousUserIdRef = useRef<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // Apply current preference on mount to guard against any client navigations without reload
    try {
      const t = (localStorage.getItem('theme') as Theme | null) ?? 'system';
      applyThemeClass(t as Theme);
      // keep in sync if system preference changes while theme is system
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => {
        const cur = (localStorage.getItem('theme') as Theme | null) ?? 'system';
        if (cur === 'system') applyThemeClass('system');
      };
      mq.addEventListener?.('change', handler);
      // cleanup will be inside return below
    } catch { }

    const supabase = createSupabaseBrowserClient();
    let isMounted = true;

    // Prime with current session without causing a refresh
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      previousUserIdRef.current = session?.user?.id ?? null;
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Ignore focus-driven refreshes and initial hydrate
      if (event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        return;
      }

      const currentUserId = session?.user?.id ?? null;
      const userChanged = previousUserIdRef.current !== currentUserId;

      if (
        (event === 'SIGNED_OUT' && previousUserIdRef.current !== null) ||
        (event === 'SIGNED_IN' && userChanged) ||
        event === 'USER_UPDATED'
      ) {
        previousUserIdRef.current = currentUserId;
        // If signed out, default to system theme (ignore previous local pref)
        if (event === 'SIGNED_OUT') {
          try {
            localStorage.setItem('theme', 'system');
            applyThemeClass('system');
            // also set a client cookie immediately so SSR reads system next
            const maxAge = 60 * 60 * 24 * 365; // 1 year
            document.cookie = `theme=system; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
          } catch { }
        }
        // On sign in or user update, immediately sync theme from user metadata
        if ((event === 'SIGNED_IN' && userChanged) || event === 'USER_UPDATED') {
          const metaTheme = (session?.user?.user_metadata?.theme as Theme | undefined);
          if (metaTheme) {
            try {
              localStorage.setItem('theme', metaTheme);
            } catch { }
            applyThemeClass(metaTheme);
            // Sync cookie + DB using server action (best-effort)
            startTransition(async () => {
              try {
                const fd = new FormData();
                fd.set('theme', metaTheme);
                await setThemeAction(fd);
              } catch { }
            });
          }
        }
        // Double-apply in the next frame to avoid transient flips
        requestAnimationFrame(() => {
          try {
            const t = (localStorage.getItem('theme') as Theme | null) ?? 'system';
            applyThemeClass(t as Theme);
          } catch { }
        });
        router.refresh();
      }
    });
    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  return null;
}


