import 'server-only';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { db } from '@/db/client';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function deleteAccountByUserId(userId: string) {
  const admin = createSupabaseAdminClient();

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    throw new Error(error.message);
  }

  await db.delete(users).where(eq(users.id, userId));
}


