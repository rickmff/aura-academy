import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ensureUserRecord } from '@/lib/users';
import { getDictionary, getLocaleFromCookies, translate as t } from '@/i18n';

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

  const locale = await getLocaleFromCookies();
  const dict = getDictionary(locale);
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-3xl font-semibold">{t(dict, 'dashboard.title')}</h1>
      <p className="text-foreground/70">{t(dict, 'dashboard.welcome', { email: user?.email ?? '' })}</p>
    </main>
  );
}





