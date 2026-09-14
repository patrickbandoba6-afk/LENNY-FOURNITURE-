import { getLocales } from 'expo-localization';

import { en } from './locales/en';
import { fr, type TranslationSchema } from './locales/fr';

export type SupportedLocale = 'fr' | 'en';

const resources: Record<SupportedLocale, TranslationSchema> = { fr, en };

export function detectLocale(): SupportedLocale {
  const deviceLocale = getLocales()[0]?.languageCode;
  return deviceLocale === 'en' ? 'en' : 'fr';
}

type Path<T> = T extends object
  ? { [K in keyof T]: K extends string ? K | `${K}.${Path<T[K]> & string}` : never }[keyof T]
  : never;

export type TranslationKey = Path<TranslationSchema>;

function resolve(obj: unknown, path: string): string {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof value === 'string' ? value : path;
}

export function translate(locale: SupportedLocale, key: TranslationKey): string {
  return resolve(resources[locale], key);
}

export { resources };
