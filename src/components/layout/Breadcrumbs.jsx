import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../i18n/LanguageContext';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  const { language, isRTL, t } = useLanguage();
  const Chevron = isRTL ? ChevronLeft : ChevronRight;

  return (
    <nav className="flex items-center gap-2 text-sm text-white/70 overflow-x-auto pb-2">
      <Link
        to={createPageUrl('Home') + `?lang=${language}`}
        className="flex items-center gap-1 hover:text-white transition-colors flex-shrink-0"
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">{t('nav.home')}</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <Chevron className="w-4 h-4 flex-shrink-0 text-white/40" />
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-white transition-colors flex-shrink-0"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium flex-shrink-0">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}