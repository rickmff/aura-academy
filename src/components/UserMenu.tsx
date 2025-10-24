import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import UserMenuClient from '@/components/UserMenuClient';
import { getDictionary, getLocaleFromCookies, translate as t } from '@/i18n';

export default async function UserMenu() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = await getLocaleFromCookies();
  const dict = getDictionary(locale);

  if (!user) {
    return (
      <Link href="/signin" className="text-sm underline">
        {t(dict, 'auth.signIn')}
      </Link>
    );
  }

  const email = user.email ?? 'conta';
  return (
    <UserMenuClient
      email={email}
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
      }}
    />
  );
}


