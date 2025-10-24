import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getDictionary, getLocaleFromCookies, translate as t } from '@/i18n';

export default async function MarketingPage() {
  const locale = await getLocaleFromCookies();
  const dict = getDictionary(locale);
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Card>
        <CardContent className="p-8 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">{t(dict, 'app.name')}</h1>
          <p className="text-foreground/70">{t(dict, 'marketing.subtitle')}</p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/signin">{t(dict, 'auth.signIn')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">{t(dict, 'nav.dashboard')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}





