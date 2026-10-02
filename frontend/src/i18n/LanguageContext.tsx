import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { en } from './translations/en';
import { gu } from './translations/gu';
import { hi } from './translations/hi';

export type Language = 'en' | 'gu' | 'hi';

type Translations = typeof en;

const translations: Record<Language, Translations> = {
  en,
  gu,
  hi,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('monsoonguard-language');
    if (saved === 'en' || saved === 'gu' || saved === 'hi') {
      return saved as Language;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem('monsoonguard-language', lang);
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    let enFallback: any = translations['en'];

    for (const k of keys) {
      if (result) result = result[k];
      if (enFallback) enFallback = enFallback[k];
    }

    if (result !== undefined) {
      return result as string;
    }

    if (enFallback !== undefined) {
      return enFallback as string;
    }

    return key; // return key if missing completely
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
