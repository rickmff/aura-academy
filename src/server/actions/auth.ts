"use server";

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { deleteAccountByUserId } from '@/server/services/account';

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
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
  redirect('/');
}


