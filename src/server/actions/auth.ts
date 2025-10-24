"use server";

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { deleteAccountByUserId } from '@/server/services/account';
import { cookies } from 'next/headers';
import { getDictionary, getLocaleFromCookies, translate as t } from '@/i18n';

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  const locale = await getLocaleFromCookies();
  const dict = getDictionary(locale);
  const store = await cookies();
  store.set({ name: 'flash', value: JSON.stringify({ title: t(dict, 'nav.signOut'), description: '' }), path: '/', httpOnly: false, sameSite: 'lax' });
  redirect('/');
}

export async function deleteMyAccountAction() {
  const server = await createSupabaseServerClient();
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
  store.set({ name: 'flash', value: JSON.stringify({ title: t(dict, 'actions.delete'), description: t(dict, 'account.delete.title') }), path: '/', httpOnly: false, sameSite: 'lax' });
  redirect('/');
}


