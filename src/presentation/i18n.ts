import en from '@locales/en.json';
import type { Language } from './types/navigation';

type Locale = typeof en;

export function translate(
  key: string,
  hindi: string,
  language: Language,
  locale: Locale = en,
): string {
  if (language === 'hi') return hindi;
  const value = key
    .split('.')
    .reduce<unknown>(
      (current, part) =>
        typeof current === 'object' && current !== null
          ? (current as Record<string, unknown>)[part]
          : undefined,
      locale,
    );
  return typeof value === 'string' ? value : key;
}
