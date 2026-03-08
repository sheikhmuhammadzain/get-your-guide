"use client";

import { useMemo, useSyncExternalStore } from "react";

export type AppLanguage = "en" | "tr" | "de" | "fr" | "es" | "ar";
export type AppCurrency = "USD" | "EUR" | "TRY" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";

export interface AppPreferences {
  language: AppLanguage;
  currency: AppCurrency;
}

export const DEFAULT_APP_PREFERENCES: AppPreferences = {
  language: "en",
  currency: "USD",
};

export const APP_PREFERENCES_STORAGE_KEY = "gyg_app_preferences_v1";
export const APP_PREFERENCES_EVENT = "app:preferences-changed";
let cachedPreferencesRaw: string | null | undefined;
let cachedPreferencesValue = DEFAULT_APP_PREFERENCES;

export const LANGUAGE_OPTIONS: Array<{ code: AppLanguage; label: string; nativeLabel: string; locale: string }> = [
  { code: "en", label: "English", nativeLabel: "English", locale: "en-US" },
  { code: "tr", label: "Turkish", nativeLabel: "Turkce", locale: "tr-TR" },
  { code: "de", label: "German", nativeLabel: "Deutsch", locale: "de-DE" },
  { code: "fr", label: "French", nativeLabel: "Francais", locale: "fr-FR" },
  { code: "es", label: "Spanish", nativeLabel: "Espanol", locale: "es-ES" },
  { code: "ar", label: "Arabic", nativeLabel: "Arabic", locale: "ar-SA" },
];

export const CURRENCY_OPTIONS: Array<{ code: AppCurrency; label: string; symbol: string }> = [
  { code: "USD", label: "U.S. Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "EUR" },
  { code: "TRY", label: "Turkish Lira", symbol: "TRY" },
  { code: "GBP", label: "British Pound", symbol: "GBP" },
  { code: "CAD", label: "Canadian Dollar", symbol: "CAD" },
  { code: "AUD", label: "Australian Dollar", symbol: "AUD" },
  { code: "CHF", label: "Swiss Franc", symbol: "CHF" },
  { code: "JPY", label: "Japanese Yen", symbol: "JPY" },
];

export function getLanguageLocale(language: AppLanguage) {
  return LANGUAGE_OPTIONS.find((item) => item.code === language)?.locale ?? "en-US";
}

export function readAppPreferences(): AppPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_APP_PREFERENCES;
  }

  const raw = window.localStorage.getItem(APP_PREFERENCES_STORAGE_KEY);
  if (raw === cachedPreferencesRaw) {
    return cachedPreferencesValue;
  }
  if (!raw) {
    cachedPreferencesRaw = null;
    cachedPreferencesValue = DEFAULT_APP_PREFERENCES;
    return cachedPreferencesValue;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AppPreferences>;
    const languageValid = LANGUAGE_OPTIONS.some((item) => item.code === parsed.language);
    const currencyValid = CURRENCY_OPTIONS.some((item) => item.code === parsed.currency);
    cachedPreferencesRaw = raw;
    cachedPreferencesValue = {
      language: languageValid ? (parsed.language as AppLanguage) : DEFAULT_APP_PREFERENCES.language,
      currency: currencyValid ? (parsed.currency as AppCurrency) : DEFAULT_APP_PREFERENCES.currency,
    };
  } catch {
    cachedPreferencesRaw = raw;
    cachedPreferencesValue = DEFAULT_APP_PREFERENCES;
  }

  return cachedPreferencesValue;
}

export function writeAppPreferences(next: AppPreferences) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(next);
  cachedPreferencesRaw = raw;
  cachedPreferencesValue = next;
  window.localStorage.setItem(APP_PREFERENCES_STORAGE_KEY, raw);
  window.dispatchEvent(new CustomEvent(APP_PREFERENCES_EVENT, { detail: next }));
}

function subscribeToPreferences(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onChange = () => callback();
  window.addEventListener(APP_PREFERENCES_EVENT, onChange as EventListener);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(APP_PREFERENCES_EVENT, onChange as EventListener);
    window.removeEventListener("storage", onChange);
  };
}

export function useAppPreferences() {
  const preferences = useSyncExternalStore(
    subscribeToPreferences,
    readAppPreferences,
    () => DEFAULT_APP_PREFERENCES,
  );

  const locale = useMemo(() => getLanguageLocale(preferences.language), [preferences.language]);

  return { preferences, setPreferences: writeAppPreferences, locale };
}
