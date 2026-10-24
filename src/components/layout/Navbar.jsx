import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, ChevronDown, Wind, Droplets, Flame, Cpu, Globe, Calculator, X, ArrowLeftRight, SlidersHorizontal, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import UnitPreferencesPanel from '../settings/UnitPreferencesPanel';

export default function Navbar() {
  const { language, isRTL, switchLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const trades = [
    { key: 'hvac', icon: Wind, href: `/${language}/hvac` },
    { key: 'plumbing', icon: Droplets, href: `/${language}/plumbing` },
    { key: 'firefighting', icon: Flame, href: `/${language}/firefighting` },
    { key: 'electrical', icon: Cpu, href: `/${language}/electrical` },
  ];

  const otherLang = language === 'ar' ? 'en' : 'ar';

  const NavLinks = ({ mobile = false, onClose }) => (
    <>
      {trades.map((trade) => (
        <Link
          key={trade.key}
          to={createPageUrl('CategoryPage') + `?lang=${language}&trade=${trade.key}`}
          onClick={onClose}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-emerald-600 transition-colors font-medium ${mobile ? 'w-full justify-start' : ''}`}
        >
          <trade.icon className="w-4 h-4" />
          {t(`nav.${trade.key}`)}
        </Link>
      ))}
      <Link
        to={createPageUrl('UnitConverterHub') + `?lang=${language}`}
        onClick={onClose}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-emerald-600 transition-colors font-medium ${mobile ? 'w-full justify-start' : ''}`}
      >
        <ArrowLeftRight className="w-4 h-4" />
        {language === 'ar' ? 'محولات الوحدات' : 'Unit Converters'}
      </Link>
      <Link
        to={createPageUrl('EngineeringGuides') + `?lang=${language}`}
        onClick={onClose}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-emerald-600 transition-colors font-medium ${mobile ? 'w-full justify-start' : ''}`}
      >
        <BookOpen className="w-4 h-4" />
        {language === 'ar' ? 'أدلة هندسية' : 'Guides'}
      </Link>
      <Link
        to={createPageUrl('StandardsPage') + `?lang=${language}`}
        onClick={onClose}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-emerald-600 transition-colors font-medium ${mobile ? 'w-full justify-start' : ''}`}
      >
        {t('nav.standards')}
      </Link>
    </>
  );

  return (
    <nav dir={isRTL ? "rtl" : "ltr"} className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={createPageUrl('Home') + `?lang=${language}`}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hidden sm:block">{language === 'ar' ? 'حاسبة MEP' : 'MEP Calculator'}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLinks />
          </div>

          {/* Language Switch & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Language Switch */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => switchLanguage(otherLang)}
              className="hidden sm:flex items-center gap-2 border-slate-200 hover:bg-slate-50 font-semibold"
            >
              <Globe className="w-4 h-4" />
              {otherLang === 'ar' ? 'العربية' : 'English'}
            </Button>

            {/* Mobile Language Switch */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => switchLanguage(otherLang)}
              className="sm:hidden"
              title={otherLang === 'ar' ? 'العربية' : 'English'}
            >
              <Globe className="w-5 h-5" />
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? 'right' : 'left'} className="w-80 overflow-y-auto">
                <div className="flex flex-col gap-2 mt-8">
                  <NavLinks mobile onClose={() => setMobileOpen(false)} />
                  <div className="border-t border-slate-100 mt-4 pt-4">
                    <UnitPreferencesPanel />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}