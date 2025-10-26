"use client";

import Link from 'next/link';
import { useMemo } from 'react';
import { signOutAction } from '@/server/actions/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function UserMenuClient({ email, labels }: {
  email: string; labels?: {
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
  }
}) {
  const initials = useMemo(() => email?.[0]?.toUpperCase() ?? 'U', [email]);

  return (
    <DropdownMenu>
      <form id="signout-form" action={signOutAction} className="hidden"></form>
      <DropdownMenuTrigger asChild>
        <button type="button" className="list-none cursor-pointer select-none inline-flex items-center gap-2 outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0">
          <span className="hidden sm:inline text-sm text-foreground/80 max-w-[180px] truncate">{email}</span>
          <span className="rounded-full bg-foreground text-background w-8 h-8 inline-flex items-center justify-center">
            {initials}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="block w-full text-left">
            {labels?.settings ?? 'Settings'}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            try {
              // Force system theme immediately to avoid light flash during sign-out navigation
              localStorage.setItem('theme', 'system');
              const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (typeof document !== 'undefined') {
                document.documentElement.classList.toggle('dark', !!prefersDark);
                // set a client cookie right away so the next SSR load reads it before hydration
                const maxAge = 60 * 60 * 24 * 365;
                document.cookie = `theme=system; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
              }
            } catch { }
            const form = document.getElementById('signout-form') as HTMLFormElement | null;
            form?.requestSubmit();
          }}
        >
          {labels?.signOut ?? 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


