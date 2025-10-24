"use server";

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { deleteAccountByUserId } from '@/server/services/account';
import { enforceRateLimitOrThrow, getClientIp } from '@/lib/rate-limit';
import { cookies } from 'next/headers';
import { getDictionary, getLocaleFromCookies, translate as t } from '@/i18n';

export async function signOutAction() {
  const ip = await getClientIp();
  await enforceRateLimitOrThrow({ key: `auth:signout:${ip}`, limit: 10, windowMs: 60_000 });
  // Preserve current theme cookie value across sign out
  const reqCookies = await cookies();
  const preservedTheme = reqCookies.get('theme')?.value;
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  const locale = await getLocaleFromCookies();
  const dict = getDictionary(locale);
  const store = await cookies();
  if (preservedTheme) {
    store.set({ name: 'theme', value: preservedTheme, path: '/', httpOnly: false, sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });
  }
  store.set({ name: 'flash', value: JSON.stringify({ title: t(dict, 'nav.signOut'), description: '' }), path: '/', httpOnly: false, sameSite: 'lax' });
  redirect('/');
}

export async function deleteMyAccountAction() {
  const ip = await getClientIp();
  await enforceRateLimitOrThrow({ key: `auth:delete:${ip}`, limit: 3, windowMs: 60_000 });
  const server = await createSupabaseServerClient();
  // Preserve current theme cookie value across account deletion
  const reqCookies = await cookies();
  const preservedTheme = reqCookies.get('theme')?.value;
  const {
    data: { user },
  } = await server.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  await deleteAccountByUserId(user!.id);

  await server.auth.signOut();
  const locale = await getLocaleFromCookies();
  const dict = getDictionary(locale);
  const store = await cookies();
  if (preservedTheme) {
    store.set({ name: 'theme', value: preservedTheme, path: '/', httpOnly: false, sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });
  }
  store.set({ name: 'flash', value: JSON.stringify({ title: t(dict, 'actions.delete'), description: t(dict, 'account.delete.title') }), path: '/', httpOnly: false, sameSite: 'lax' });
  redirect('/');
}


