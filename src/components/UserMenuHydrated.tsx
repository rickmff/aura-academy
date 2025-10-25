"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import UserMenuClient from '@/components/UserMenuClient';

type Labels = {
  theme: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  language: string;
  langPt: string;
  langEn: string;
  langEs: string;
  langFr: string;
  settings: string;
  signOut: string;
  signIn: string;
};

export default function UserMenuHydrated({ initialEmail, labels }: { initialEmail?: string | null; labels: Labels }) {
  const [email, setEmail] = useState<string | null>(initialEmail ?? null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setEmail(session?.user?.email ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (!email) {
    return (
      <Link href="/signin" className="text-sm underline">
        {labels.signIn}
      </Link>
    );
  }

  return <UserMenuClient email={email} labels={labels} />;
}



