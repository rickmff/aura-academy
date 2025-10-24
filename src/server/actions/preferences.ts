"use server";

import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { enforceRateLimitOrThrow, getClientIp } from '@/lib/rate-limit';

type Theme = 'light' | 'dark' | 'system';
type Locale = 'en' | 'pt' | 'es' | 'fr';

const themeSchema = z.object({ theme: z.enum(['light', 'dark', 'system']).default('system') });
const localeSchema = z.object({ locale: z.enum(['en', 'pt', 'es', 'fr']).default('en') });

export async function setThemeAction(formData: FormData) {
  const ip = await getClientIp();
  await enforceRateLimitOrThrow({ key: `prefs:theme:${ip}`, limit: 20, windowMs: 60_000 });
  const parsed = themeSchema.safeParse({ theme: formData.get('theme') });
  if (!parsed.success) {
    throw new Error('Invalid theme');
  }
  const value = parsed.data.theme as Theme;
  const cookieStore = await cookies();
  cookieStore.set({ name: 'theme', value, path: '/', httpOnly: false, sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.auth.updateUser({ data: { theme: value } });
  }
}

export async function setLocaleAction(formData: FormData) {
  const ip = await getClientIp();
  await enforceRateLimitOrThrow({ key: `prefs:locale:${ip}`, limit: 20, windowMs: 60_000 });
  const parsed = localeSchema.safeParse({ locale: formData.get('locale') });
  if (!parsed.success) {
    throw new Error('Invalid locale');
  }
  const value = parsed.data.locale as Locale;
  const cookieStore = await cookies();
  cookieStore.set({ name: 'locale', value, path: '/', httpOnly: false, sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.auth.updateUser({ data: { locale: value } });
  }
}


