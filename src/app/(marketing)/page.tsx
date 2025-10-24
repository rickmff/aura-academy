import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MarketingPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-3xl font-bold">Aura Academy</h1>
      <p className="text-muted-foreground">Aprenda com uma plataforma moderna.</p>
      <div className="flex gap-3">
        <Link href="/signin">
          <Button>Entrar</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline">Dashboard</Button>
        </Link>
      </div>
    </main>
  );
}





