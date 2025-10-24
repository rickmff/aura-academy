"use client";

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

function SignUpContent() {
  const params = useSearchParams();
  const redirectTo = params.get('redirectTo') ?? '/dashboard';
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const absoluteRedirect = origin
      ? new URL(redirectTo.startsWith('/') ? redirectTo : `/${redirectTo}`, origin).toString()
      : redirectTo;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: absoluteRedirect,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setSent(true);
  }

  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Criar conta</h1>
      {sent ? (
        <div className="space-y-2">
          <p>Enviamos um email de confirmação para {email}. Verifique sua caixa de entrada.</p>
          <Button onClick={() => router.push('/signin')} variant="outline">Ir para login</Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2"
              placeholder="seu@email.com"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2"
              placeholder="••••••••"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Criar conta'}
          </Button>
        </form>
      )}
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpContent />
    </Suspense>
  );
}


