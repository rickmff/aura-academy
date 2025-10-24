import { db } from '@/db/client';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function ensureUserRecord(params: {
  id: string;
  email: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  theme?: 'light' | 'dark' | 'system' | null;
  locale?: 'en' | 'pt' | 'es' | 'fr' | null;
}) {
  const { id, email, fullName, avatarUrl, theme, locale } = params;
  const result = await db
    .insert(users)
    .values({ id, email, fullName: fullName ?? undefined, avatarUrl: avatarUrl ?? undefined, theme: theme ?? undefined, locale: locale ?? undefined })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email,
        fullName: fullName ?? undefined,
        avatarUrl: avatarUrl ?? undefined,
        theme: theme ?? undefined,
        locale: locale ?? undefined,
      },
    })
    .returning();
  return result[0];
}


