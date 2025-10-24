import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DeleteAccountButton } from '@/components/DeleteAccountButton';

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/signin?redirectTo=/settings');

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <a href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </a>
      </div>
      <section className="space-y-2">
        <h2 className="text-xl font-medium">Conta</h2>
        <p className="text-foreground/70">{user.email}</p>
        <div className="flex gap-2">
          <a href="/reset-password">
            <Button variant="outline">Resetar senha</Button>
          </a>
          <DeleteAccountButton />
        </div>
      </section>
    </main>
  );
}


