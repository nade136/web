"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultLocale, isRtl, locales, type Locale } from "./locales";

const LOCALE_COOKIE = "locale";

type Messages = Record<string, string>;

type Registry = Record<Locale, Messages>;

const messagesRegistry: Registry = {
  // Messages are hydrated at runtime via dynamic import fallback
  // We initialize as empty; provider will load the bundle
  "en": {},
  "es": {},
  "fr": {},
  "de": {},
  "pt-BR": {},
  "it": {},
  "nl": {},
  "ru": {},
  "zh-CN": {},
  "zh-TW": {},
  "ja": {},
  "ko": {},
  "ar": {},
  "hi": {},
  "tr": {},
  "pl": {},
  "vi": {},
  "id": {},
};

async function loadMessages(locale: Locale): Promise<Messages> {
  try {
    switch (locale) {
      case "en":
        return (await import("./messages/en.json")).default as Messages;
      case "es":
        return (await import("./messages/es.json")).default as Messages;
      case "fr":
        return (await import("./messages/fr.json")).default as Messages;
      case "de":
        return (await import("./messages/de.json")).default as Messages;
      case "pt-BR":
        return (await import("./messages/pt-BR.json")).default as Messages;
      case "it":
        return (await import("./messages/it.json")).default as Messages;
      case "nl":
        return (await import("./messages/nl.json")).default as Messages;
      case "ru":
        return (await import("./messages/ru.json")).default as Messages;
      case "zh-CN":
        return (await import("./messages/zh-CN.json")).default as Messages;
      case "zh-TW":
        return (await import("./messages/zh-TW.json")).default as Messages;
      case "ja":
        return (await import("./messages/ja.json")).default as Messages;
      case "ko":
        return (await import("./messages/ko.json")).default as Messages;
      case "ar":
        return (await import("./messages/ar.json")).default as Messages;
      case "hi":
        return (await import("./messages/hi.json")).default as Messages;
      case "tr":
        return (await import("./messages/tr.json")).default as Messages;
      case "pl":
        return (await import("./messages/pl.json")).default as Messages;
      case "vi":
        return (await import("./messages/vi.json")).default as Messages;
      case "id":
        return (await import("./messages/id.json")).default as Messages;
      default:
        return (await import("./messages/en.json")).default as Messages;
    }
  } catch {
    return (await import("./messages/en.json")).default as Messages;
  }
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
  return null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; Path=/; Expires=${expires}; SameSite=Lax`;
}

export type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  messages: Messages;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const fromCookie = getCookie(LOCALE_COOKIE) as Locale | null;
    const fromNavigator = typeof navigator !== "undefined" ? (navigator.language || navigator.languages?.[0]) : undefined;
    const normalized = (fromCookie || fromNavigator || defaultLocale) as string;
    let next: Locale = defaultLocale;
    if (locales.includes(normalized as Locale)) {
      next = normalized as Locale;
    } else {
      const lang = normalized.split("-")[0];
      const fallback = locales.find(l => l === lang || l.startsWith(`${lang}-`));
      next = (fallback || defaultLocale) as Locale;
    }
    return next;
  });
  const [messages, setMessages] = useState<Messages>({});

  // load messages whenever locale changes (and ensure English fallback is loaded)
  useEffect(() => {
    let active = true;
    (async () => {
      const bundle = await loadMessages(locale);
      if (!active) return;
      messagesRegistry[locale] = bundle;
      setMessages(bundle);
      // dir switching
      if (typeof document !== "undefined") {
        const dir = isRtl(locale) ? "rtl" : "ltr";
        document.documentElement.setAttribute("dir", dir);
        document.documentElement.setAttribute("lang", locale);
      }
      // Ensure English fallback is available even when current locale isn't en
      if (locale !== "en" && Object.keys(messagesRegistry["en"]).length === 0) {
        try {
          const enBundle = await loadMessages("en");
          if (active) messagesRegistry["en"] = enBundle;
        } catch { /* noop */ }
      }
    })();
    return () => {
      active = false;
    };
  }, [locale]);

  const setLocale = (l: Locale) => {
    setCookie(LOCALE_COOKIE, l);
    setLocaleState(l);
  };

  const t = useMemo(() => {
    return (key: string) => {
      const val = messages[key];
      if (val) return val;
      const en = messagesRegistry["en"][key];
      return en || key;
    };
  }, [messages]);

  const value = useMemo(() => ({ locale, setLocale, t, messages }), [locale, messages, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);

  const localeLabels: Record<Locale, string> = {
    "en": "English",
    "es": "Español",
    "fr": "Français",
    "de": "Deutsch",
    "pt-BR": "Português (Brasil)",
    "it": "Italiano",
    "nl": "Nederlands",
    "ru": "Русский",
    "zh-CN": "简体中文",
    "zh-TW": "繁體中文",
    "ja": "日本語",
    "ko": "한국어",
    "ar": "العربية",
    "hi": "हिन्दी",
    "tr": "Türkçe",
    "pl": "Polski",
    "vi": "Tiếng Việt",
    "id": "Bahasa Indonesia",
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest?.("[data-lang-switcher]")) setOpen(false);
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  return (
    <div className={`relative inline-block ${className || ""}`} data-lang-switcher>
      {/* Desktop: labeled button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="hidden items-center gap-2 rounded-full border border-cyan-400/40 bg-white/5 px-4 py-2 text-sm text-slate-100 backdrop-blur md:flex"
        aria-expanded={open}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10 text-cyan-200">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5"><path fill="currentColor" d="M12 2a10 10 0 0 0 0 20 10 10 0 0 0 0-20Zm7.8 9h-3.1a14 14 0 0 0-1.2-5 8 8 0 0 1 4.3 5Zm-5.3 0H9.5a12 12 0 0 1 1.3-5.3 12 12 0 0 1 1.3 5.3Zm-7.3 0H4.2a8 8 0 0 1 4.3-5 14 14 0 0 0-1.3 5Zm0 2a14 14 0 0 0 1.3 5 8 8 0 0 1-4.3-5Zm2.3 0h5a12 12 0 0 1-1.3 5.3A12 12 0 0 1 9.5 13Zm7.3 0h3.1a8 8 0 0 1-4.3 5 14 14 0 0 0 1.2-5Z"/></svg></span>
        {localeLabels[locale] || locale}
        <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate-200"><path fill="currentColor" d="M5.6 7.5a1 1 0 0 1 1.4 0L10 10.5l3-3a1 1 0 1 1 1.4 1.4l-3.7 3.7a1 1 0 0 1-1.4 0L5.6 8.9a1 1 0 0 1 0-1.4Z"/></svg>
      </button>

      {/* Mobile: icon-only button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/40 bg-white/5 text-slate-100 backdrop-blur"
        aria-label="Change language"
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-200"><path fill="currentColor" d="M12 2a10 10 0 0 0 0 20 10 10 0 0 0 0-20Zm7.8 9h-3.1a14 14 0 0 0-1.2-5 8 8 0 0 1 4.3 5Zm-5.3 0H9.5a12 12 0 0 1 1.3-5.3 12 12 0 0 1 1.3 5.3Zm-7.3 0H4.2a8 8 0 0 1 4.3-5 14 14 0 0 0-1.3 5Zm0 2a14 14 0 0 0 1.3 5 8 8 0 0 1-4.3-5Zm2.3 0h5a12 12 0 0 1-1.3 5.3A12 12 0 0 1 9.5 13Zm7.3 0h3.1a8 8 0 0 1-4.3 5 14 14 0 0 0 1.2-5Z"/></svg>
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 max-h-72 w-56 overflow-auto rounded-xl border border-white/10 bg-[#1a1130] p-1 text-sm text-slate-200 shadow-[0_18px_40px_rgba(4,10,22,0.6)]">
          {locales.map(l => (
            <button
              key={l}
              type="button"
              onClick={() => { setLocale(l); setOpen(false); }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left ${l===locale?"bg-white/10":"hover:bg-white/5"}`}
            >
              <span className="whitespace-nowrap">{localeLabels[l] || l}</span>
              {l === locale ? <span className="text-cyan-300">✓</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
