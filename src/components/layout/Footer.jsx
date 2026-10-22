import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../i18n/LanguageContext';
import { Calculator, Wind, Droplets, Flame, Mail, Phone, MapPin, ArrowLeftRight } from 'lucide-react';

export default function Footer() {
  const { language, t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const trades = [
    { key: 'hvac', icon: Wind },
    { key: 'plumbing', icon: Droplets },
    { key: 'firefighting', icon: Flame },
    { key: 'electrical', icon: Calculator },
  ];

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                {language === 'ar' ? 'MEP Calc KSA' : 'MEP Calc KSA'}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {language === 'ar' 
                ? 'MEP Calc KSA — حاسبات التكييف والسباكة والحريق والكهرباء'
                : 'MEP Calc KSA — HVAC, Plumbing, Firefighting & Electrical Calculators'}
            </p>
          </div>

          {/* Calculators */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('nav.calculators')}</h3>
            <ul className="space-y-2">
              {trades.map((trade) => (
                <li key={trade.key}>
                  <Link
                    to={createPageUrl('CategoryPage') + `?lang=${language}&trade=${trade.key}`}
                    className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2"
                  >
                    <trade.icon className="w-4 h-4" />
                    {t(`nav.${trade.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {language === 'ar' ? 'أدوات' : 'Tools'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to={createPageUrl('UnitConverterHub') + `?lang=${language}`}
                  className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  {language === 'ar' ? 'محولات الوحدات' : 'Unit Converters'}
                </Link>
              </li>
              <li>
                <Link
                  to={createPageUrl('StandardsPage') + `?lang=${language}`}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {t('nav.standards')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {language === 'ar' ? 'روابط قانونية' : 'Legal'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to={createPageUrl('PrivacyPage') + `?lang=${language}`}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {t('nav.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  to={createPageUrl('TermsPage') + `?lang=${language}`}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {t('nav.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © {currentYear} MEP Calc KSA. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {language === 'ar' ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}