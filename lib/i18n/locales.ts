export const locales = [
  "en",
  "es",
  "fr",
  "de",
  "pt-BR",
  "it",
  "nl",
  "ru",
  "zh-CN",
  "zh-TW",
  "ja",
  "ko",
  "ar",
  "hi",
  "tr",
  "pl",
  "vi",
  "id",
] as const;

export type Locale = typeof locales[number];

export const defaultLocale: Locale = "en";

export const rtlLocales: Locale[] = ["ar"] as unknown as Locale[];

export const isRtl = (locale: string) => rtlLocales.includes(locale as Locale);
