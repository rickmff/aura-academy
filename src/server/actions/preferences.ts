"use server";

import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type Theme = 'light' | 'dark' | 'system';
type Locale = 'en' | 'pt';

export async function setThemeAction(formData: FormData) {
  const value = (formData.get('theme') as Theme) || 'system';
  const cookieStore = await cookies();
  cookieStore.set({ name: 'theme', value, path: '/', httpOnly: false, sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.auth.updateUser({ data: { theme: value } });
  }
}

export async function setLocaleAction(formData: FormData) {
  const value = (formData.get('locale') as Locale) || 'en';
  const cookieStore = await cookies();
  cookieStore.set({ name: 'locale', value, path: '/', httpOnly: false, sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.auth.updateUser({ data: { locale: value } });
  }
}


