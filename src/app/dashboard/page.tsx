import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ensureUserRecord } from '@/lib/users';
import { signOutAction } from './actions';
import { DeleteAccountButton } from './DeleteAccountButton';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  await ensureUserRecord({
    id: user.id,
    email: user.email ?? '',
    fullName: user.user_metadata?.full_name ?? null,
    avatarUrl: user.user_metadata?.avatar_url ?? null,
  });

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-2">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Bem-vindo, {user?.email}</p>
      <form action={signOutAction}>
        <button className="mt-4 rounded-md border px-3 py-2">Sair</button>
      </form>
      <DeleteAccountButton />
    </main>
  );
}





