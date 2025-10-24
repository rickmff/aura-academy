"use server";

import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/db/client';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

  const admin = createSupabaseAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user!.id);
  if (error) {
    throw new Error(error.message);
  }
  // Remove user profile row
  await db.delete(users).where(eq(users.id, user!.id));
  // Ensure cookies/session cleared after deletion
  await server.auth.signOut();
  redirect('/');
}


