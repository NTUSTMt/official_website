"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import zh from '../locales/zh.json';
import en from '../locales/en.json';

type Language = 'zh' | 'en';
type Translations = typeof zh;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, any>) => string;
}

const translations: Record<Language, any> = { zh, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('preferred_language') as Language;
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      setLanguage(savedLang);
    } else {
      // Auto detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('en')) {
        setLanguage('en');
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferred_language', lang);
  };

  const t = (key: string, variables?: Record<string, any>) => {
    const keys = key.split('.');
    let result = translations[language];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key;
      }
    }
    
    if (typeof result !== 'string') return key;

    // Handle variables like {{count}}
    if (variables) {
      Object.entries(variables).forEach(([name, value]) => {
        result = (result as string).replace(new RegExp(`{{${name}}}`, 'g'), String(value));
      });
    }
    
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
