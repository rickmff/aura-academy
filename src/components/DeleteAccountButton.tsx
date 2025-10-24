import { getDictionary, getLocaleFromCookies, translate as t } from '@/i18n';
import { DeleteAccountButtonClient } from '@/components/DeleteAccountButtonClient';

export async function DeleteAccountButton() {
  const locale = await getLocaleFromCookies();
  const dict = getDictionary(locale);
  return (
    <DeleteAccountButtonClient
      buttonLabel={t(dict, 'account.delete.button')}
      title={t(dict, 'account.delete.title')}
      description={t(dict, 'account.delete.description')}
      cancelLabel={t(dict, 'actions.cancel')}
      deleteLabel={t(dict, 'actions.delete')}
    />
  );
}


