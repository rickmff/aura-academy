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
            <Link href="/signin">
              <Button>{t(dict, 'auth.signIn')}</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">{t(dict, 'nav.dashboard')}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}





