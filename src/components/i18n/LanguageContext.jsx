import { getCalculatorConfig } from '../calculators/engines';
import React, { createContext, useContext, useState, useEffect } from 'react';

import { translations, getTranslation } from './translations';


const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar');
  const [isRTL, setIsRTL] = useState(true);

  const translationsData = translations[language];
  const isLoading = false;

  useEffect(() => {
    // Detect language from URL query param
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    if (lang && (lang === 'ar' || lang === 'en')) {
      setLanguage(lang);
      setIsRTL(lang === 'ar');
    } else {
      // Default to Arabic
      setLanguage('ar');
      setIsRTL(true);
    }
  }, []);

  useEffect(() => {
    // Update document direction
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRTL, language]);

  const switchLanguage = (newLang) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('lang', newLang);
    window.location.href = currentUrl.toString();
  };

  const t = (key) => {
    const value = getTranslation(language, key);
    if (typeof value === 'string' && value !== key) return value;

    const match = key.match(/^calculators\.(.+)\.(title|shortDesc)$/);
    if (match) {
      const config = getCalculatorConfig(match[1], language);
      const label = match[2] === 'title'
        ? config?.title : config?.description;
      if (label) return label;
    }

    if (key === 'trades.electrical.title')
      return language === 'ar' ? 'حاسبات الكهرباء' : 'Electrical Calculators';

    if (key === 'trades.electrical.description')
      return language === 'ar'
        ? 'حاسبات كهربائية للمشاريع السعودية'
        : 'Electrical engineering calculators';

    return key.split('.').pop().replace(/[-_]/g, ' ');
  };

  return (
    <LanguageContext.Provider value={{
      language,
      isRTL,
      switchLanguage,
      t,
      translations: translationsData,
      isLoadingTranslations: isLoading
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};