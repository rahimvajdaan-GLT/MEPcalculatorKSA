import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar');
  const [isRTL, setIsRTL] = useState(true);

  // Fetch translations from database
  const { data: translationsData, isLoading } = useQuery({
    queryKey: ['translations'],
    queryFn: async () => {
      const data = await base44.entities.Translation.list();
      // Convert array to nested object structure
      const nested = {};
      data.forEach(item => {
        const keys = item.key.split('.');
        let current = nested;
        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            current[key] = { ar: item.ar, en: item.en };
          } else {
            current[key] = current[key] || {};
            current = current[key];
          }
        });
      });
      return nested;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

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

  // Translation function
  const t = (key) => {
    if (isLoading || !translationsData) return key;
    
    const keys = key.split('.');
    let value = translationsData;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if not found
      }
    }
    
    return value?.[language] || key;
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