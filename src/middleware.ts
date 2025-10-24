import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { clientEnv } from '@/lib/env-client';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;
  const isAuthRoute =
    pathname === '/' ||
    pathname.startsWith('/signin') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password');
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // Allow reset-password when Supabase just created a recovery session (has `code` on URL)
  const isRecoveryWithToken = pathname.startsWith('/reset-password') && request.nextUrl.searchParams.has('code');

  if (session && isAuthRoute && !isRecoveryWithToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!session && isDashboardRoute) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Apply to all paths except static assets and API routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};


