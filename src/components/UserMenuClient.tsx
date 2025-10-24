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
import { setLocaleAction, setThemeAction } from '@/server/actions/preferences';

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
      <DropdownMenuTrigger asChild>
        <button type="button" className="list-none cursor-pointer select-none inline-flex items-center gap-2">
          <span className="hidden sm:inline text-sm text-foreground/80 max-w-[180px] truncate">{email}</span>
          <span className="rounded-full bg-foreground text-background w-8 h-8 inline-flex items-center justify-center">
            {initials}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/settings">
          <DropdownMenuItem asChild>
            <span className="block w-full text-left">{labels?.settings ?? 'Settings'}</span>
          </DropdownMenuItem>
        </Link>
        <form action={signOutAction}>
          <DropdownMenuItem asChild>
            <button className="block w-full text-left">{labels?.signOut ?? 'Sign out'}</button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


