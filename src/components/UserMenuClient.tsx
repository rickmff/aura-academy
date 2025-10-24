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
        <Link href="/settings">
          <DropdownMenuItem asChild>
            <span className="block w-full text-left">{labels?.settings ?? 'Settings'}</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
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


