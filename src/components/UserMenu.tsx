import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { signOutAction } from '@/server/actions/auth';

export default async function UserMenu() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link href="/signin" className="text-sm underline">
        Entrar
      </Link>
    );
  }

  const email = user.email ?? 'conta';
  const initials = email?.[0]?.toUpperCase() ?? 'U';

  return (
    <details className="relative">
      <summary className="list-none cursor-pointer select-none inline-flex items-center gap-2">
        <span className="hidden sm:inline text-sm text-foreground/80 max-w-[180px] truncate">{email}</span>
        <span className="rounded-full bg-foreground text-background w-8 h-8 inline-flex items-center justify-center">
          {initials}
        </span>
      </summary>
      <div className="absolute right-0 mt-2 w-56 rounded-md border bg-background p-2 shadow-md">
        <div className="px-2 py-1 text-sm text-foreground/70 truncate">{email}</div>
        <Link href="/settings" className="block w-full text-left rounded-md px-2 py-1 hover:bg-foreground/10 text-sm">
          Settings
        </Link>
        <form action={signOutAction}>
          <button className="block w-full text-left rounded-md px-2 py-1 hover:bg-foreground/10 text-sm">
            Sair
          </button>
        </form>
      </div>
    </details>
  );
}


