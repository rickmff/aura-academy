import 'server-only';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getDictionary, getLocaleFromCookies, translate as t } from '@/i18n';
import UserMenuHydrated from '@/components/UserMenuHydrated';

export const dynamic = 'force-dynamic';

export default async function UserMenu() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = await getLocaleFromCookies();
  const dict = getDictionary(locale);

  const initialEmail = user?.email ?? null;

  return (
    <UserMenuHydrated
      initialEmail={initialEmail}
      labels={{
        theme: t(dict, 'preferences.theme'),
        themeLight: t(dict, 'preferences.theme.light'),
        themeDark: t(dict, 'preferences.theme.dark'),
        themeSystem: t(dict, 'preferences.theme.system'),
        language: t(dict, 'preferences.language'),
        langPt: t(dict, 'language.portuguese'),
        langEn: t(dict, 'language.english'),
        langEs: t(dict, 'language.spanish'),
        langFr: t(dict, 'language.french'),
        settings: t(dict, 'nav.settings'),
        signOut: t(dict, 'nav.signOut'),
        signIn: t(dict, 'auth.signIn'),
      }}
    />
  );
}


