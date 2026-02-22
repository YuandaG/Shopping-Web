import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, type Language } from './translations';

type Translation = typeof translations.zh;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
  shortcutName: string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const LANGUAGE_STORAGE_KEY = 'shopping-web-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'en' || stored === 'zh') {
      return stored;
    }
    // 默认根据浏览器语言判断
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('zh') ? 'zh' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const t = translations[language];
  const shortcutName = translations[language].shortcutName;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, shortcutName }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Helper hook for getting translated category name
export function useCategoryName(categoryId: string): string {
  const { t } = useLanguage();
  const categoryMap: Record<string, keyof typeof t.categories> = {
    meat: 'meat',
    vegetable: 'vegetable',
    seafood: 'seafood',
    condiment: 'condiment',
    grain: 'grain',
    dairy: 'dairy',
    drink: 'drink',
    fruit: 'fruit',
    frozen: 'frozen',
    snack: 'snack',
    other: 'other',
  };
  return t.categories[categoryMap[categoryId] || 'other'];
}
