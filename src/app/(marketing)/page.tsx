import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function MarketingPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Card>
        <CardContent className="p-8 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Aura Academy</h1>
          <p className="text-foreground/70">Aprenda com uma plataforma moderna.</p>
          <div className="flex gap-3">
            <Link href="/signin">
              <Button>Entrar</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}





