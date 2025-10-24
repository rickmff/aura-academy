"use client";

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

function ForgotContent() {
  const params = useSearchParams();
  const redirectTo = params.get('redirectTo') ?? '/reset-password';
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState('');
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
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: absoluteRedirect,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Recuperar senha</h1>
      {sent ? (
        <p>Se o email existir, enviamos um link de recuperação para {email}.</p>
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
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar email de recuperação'}
          </Button>
        </form>
      )}
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotContent />
    </Suspense>
  );
}


