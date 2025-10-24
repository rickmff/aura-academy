import { db } from '@/db/client';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function ensureUserRecord(params: {
  id: string;
  email: string;
  fullName?: string | null;
  avatarUrl?: string | null;
}) {
  const { id, email, fullName, avatarUrl } = params;
  const existing = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (existing.length > 0) return existing[0];
  const inserted = await db
    .insert(users)
    .values({ id, email, fullName: fullName ?? undefined, avatarUrl: avatarUrl ?? undefined })
    .returning();
  return inserted[0];
}


