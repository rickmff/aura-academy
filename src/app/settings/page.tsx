import { getDictionary, getLocaleFromCookies, translate as t } from '@/i18n';
import { setLocaleAction } from '@/server/actions/preferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DeleteAccountButton } from '@/components/DeleteAccountButton';
import ThemeSelector from '@/components/ThemeSelector';
import Link from 'next/link';

export default async function SettingsPage() {
  const locale = await getLocaleFromCookies();
  const dict = getDictionary(locale);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/signin?redirectTo=/settings');

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{t(dict, 'nav.settings')}</h1>
        <Link href="/dashboard">
          <Button variant="outline">{t(dict, 'nav.backToDashboard')}</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, 'preferences.theme')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ThemeSelector labels={{
            light: t(dict, 'preferences.theme.light'),
            dark: t(dict, 'preferences.theme.dark'),
            system: t(dict, 'preferences.theme.system'),
          }} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, 'preferences.language')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            <form action={setLocaleAction}><input type="hidden" name="locale" value="pt" /><button className="rounded-md border px-3 py-2 text-sm hover:bg-foreground/10 w-full" type="submit">{t(dict, 'language.portuguese')}</button></form>
            <form action={setLocaleAction}><input type="hidden" name="locale" value="en" /><button className="rounded-md border px-3 py-2 text-sm hover:bg-foreground/10 w-full" type="submit">{t(dict, 'language.english')}</button></form>
            <form action={setLocaleAction}><input type="hidden" name="locale" value="es" /><button className="rounded-md border px-3 py-2 text-sm hover:bg-foreground/10 w-full" type="submit">{t(dict, 'language.spanish')}</button></form>
            <form action={setLocaleAction}><input type="hidden" name="locale" value="fr" /><button className="rounded-md border px-3 py-2 text-sm hover:bg-foreground/10 w-full" type="submit">{t(dict, 'language.french')}</button></form>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, 'account.section')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-foreground/70">{user.email}</p>
          <div className="flex gap-2">
            <Link href="/reset-password">
              <Button variant="outline">{t(dict, 'account.resetPassword')}</Button>
            </Link>
            <DeleteAccountButton />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}


