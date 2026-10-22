import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner({ trade }) {
  const { language } = useLanguage();
  
  // Global disclaimer for all pages
  const disclaimerText = language === 'ar'
    ? 'أداة تقديرية — يجب التحقق حسب كود البناء السعودي (SBC) ومتطلبات الدفاع المدني ومواصفات المشروع والمعايير المعتمدة (NFPA/ASHRAE/IEC).'
    : 'Preliminary tool — verify per SBC, Civil Defense requirements, project specifications, and applicable standards (NFPA/ASHRAE/IEC).';
  
  const disclaimerTitle = language === 'ar' ? 'تنبيه' : 'Disclaimer';
  
  return (
    <div className="bg-amber-50 border-b border-amber-200 py-2 sm:py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start sm:items-center gap-2 sm:gap-3 text-amber-800">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs sm:text-sm">
            <span className="font-semibold">{disclaimerTitle}:</span>{' '}
            <span className="leading-relaxed">{disclaimerText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}