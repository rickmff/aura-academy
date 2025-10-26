import { getDictionary, getLocaleFromCookies, translate as t } from '@/i18n';
import { setLocaleAction } from '@/server/actions/preferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DeleteAccountButton } from '@/components/DeleteAccountButton';
import ThemeSelector from '@/components/ThemeSelector';
import { BillingSection } from '@/components/BillingSection';
import { AccountEditForm } from '@/components/AccountEditForm';
import { getUserSubscription } from '@/server/actions/stripe';
import Link from 'next/link';

export default async function SettingsPage() {
  const locale = await getLocaleFromCookies();
  const dict = getDictionary(locale);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/signin?redirectTo=/settings');

  const subscription = await getUserSubscription(user.id);

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{t(dict, 'nav.settings')}</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard">{t(dict, 'nav.backToDashboard')}</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, 'preferences.theme')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ThemeSelector labels={{
            light: t(dict, 'preferences.theme.light'),
            dark: t(dict, 'preferences.theme.dark'),
            system: t(dict, 'preferences.theme.system'),
          }} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, 'preferences.language')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            <form action={setLocaleAction}><input type="hidden" name="locale" value="pt" /><button className="rounded-md border px-3 py-2 text-sm hover:bg-foreground/10 w-full" type="submit">{t(dict, 'language.portuguese')}</button></form>
            <form action={setLocaleAction}><input type="hidden" name="locale" value="en" /><button className="rounded-md border px-3 py-2 text-sm hover:bg-foreground/10 w-full" type="submit">{t(dict, 'language.english')}</button></form>
            <form action={setLocaleAction}><input type="hidden" name="locale" value="es" /><button className="rounded-md border px-3 py-2 text-sm hover:bg-foreground/10 w-full" type="submit">{t(dict, 'language.spanish')}</button></form>
            <form action={setLocaleAction}><input type="hidden" name="locale" value="fr" /><button className="rounded-md border px-3 py-2 text-sm hover:bg-foreground/10 w-full" type="submit">{t(dict, 'language.french')}</button></form>
          </div>
        </CardContent>
      </Card>

      <BillingSection
        subscription={subscription}
        userId={user.id}
        labels={{
          subscription: t(dict, 'billing.subscription'),
          manageSubscription: t(dict, 'billing.manageSubscription'),
          noActiveSubscriptionDescription: t(dict, 'billing.noActiveSubscriptionDescription'),
          viewPlans: t(dict, 'billing.viewPlans'),
          status: t(dict, 'billing.status'),
          currentPlan: t(dict, 'billing.currentPlan'),
          active: t(dict, 'billing.active'),
          canceled: t(dict, 'billing.canceled'),
          pastDue: t(dict, 'billing.pastDue'),
          incomplete: t(dict, 'billing.incomplete'),
          incompleteExpired: t(dict, 'billing.incompleteExpired'),
          trialing: t(dict, 'billing.trialing'),
          unpaid: t(dict, 'billing.unpaid'),
        }}
      />

      <AccountEditForm
        user={user}
        labels={{
          editProfile: t(dict, 'account.editProfile'),
          personalInfo: t(dict, 'account.personalInfo'),
          fullName: t(dict, 'account.fullName'),
          email: t(dict, 'account.email'),
          avatar: t(dict, 'account.avatar'),
          changeAvatar: t(dict, 'account.changeAvatar'),
          removeAvatar: t(dict, 'account.removeAvatar'),
          saving: t(dict, 'account.saving'),
          confirm: t(dict, 'actions.confirm'),
          cancel: t(dict, 'actions.cancel'),
          profileUpdated: t(dict, 'account.profileUpdated'),
          errorUpdatingProfile: t(dict, 'account.errorUpdatingProfile'),
          uploading: t(dict, 'account.uploading'),
          uploadError: t(dict, 'account.uploadError'),
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, 'account.section')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/reset-password">{t(dict, 'account.resetPassword')}</Link>
            </Button>
            <DeleteAccountButton />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}


