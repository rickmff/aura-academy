"use client";

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
    <main className="mx-auto max-w-md p-6">
      <Card>
        <CardHeader>
          <CardTitle>Recuperar senha</CardTitle>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p>Se o email existir, enviamos um link de recuperação para {email}.</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                />
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <Button type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar email de recuperação'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
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


