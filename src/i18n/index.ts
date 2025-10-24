import { cookies, headers } from 'next/headers';
import en from './dictionaries/en';
import pt from './dictionaries/pt';
import es from './dictionaries/es';
import fr from './dictionaries/fr';

export type Locale = 'en' | 'pt' | 'es' | 'fr';
export type Dict = Record<string, string>;

const DICTS: Record<Locale, Dict> = { en, pt, es, fr } as const;

function pickLocaleFromAcceptLanguage(headerValue: string | undefined): Locale | null {
  if (!headerValue) return null;
  const candidates = headerValue
    .split(',')
    .map((entry) => entry.trim().split(';')[0]?.toLowerCase())
    .filter(Boolean) as string[];
  for (const tag of candidates) {
    const primary = tag.split('-')[0] as Locale;
    if (primary === 'en' || primary === 'pt' || primary === 'es' || primary === 'fr') {
      return primary;
    }
  }
  return null;
}

export async function getLocaleFromCookies(): Promise<Locale> {
  const store = await cookies();
  const cookieLocale = store.get('locale')?.value as Locale | undefined;
  if (cookieLocale && (['en', 'pt', 'es', 'fr'] as readonly string[]).includes(cookieLocale)) {
    return cookieLocale;
  }

  const hdrs = await headers();
  const acceptLanguage = hdrs.get('accept-language') || undefined;
  const detected = pickLocaleFromAcceptLanguage(acceptLanguage) || 'en';

  // Persist for future requests to avoid re-detection and ensure consistent SSR
  store.set({ name: 'locale', value: detected, path: '/', httpOnly: false, sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });
  return detected;
}

export function getDictionary(locale: Locale): Dict {
  return DICTS[locale] || DICTS.en;
}

export function translate(dict: Dict, key: string, params?: Record<string, string | number>): string {
  const template = dict[key] ?? key;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ''));
}


