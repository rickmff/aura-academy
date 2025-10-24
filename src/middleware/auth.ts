import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function requireAuth(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const url = new URL('/signin', req.url);
    url.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return res;
}





