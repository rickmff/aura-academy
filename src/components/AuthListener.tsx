"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function AuthListener() {
  const router = useRouter();
  const previousUserIdRef = useRef<string | null>(null);

  useEffect(() => {
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


