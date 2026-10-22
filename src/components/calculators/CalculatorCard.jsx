import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../i18n/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Calculator, Star } from 'lucide-react';
import { useFavorites } from './useFavorites';

export default function CalculatorCard({ slug, trade, icon: Icon }) {
  const { language, isRTL, t } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const title = t(`calculators.${slug}.title`);
  const shortDesc = t(`calculators.${slug}.shortDesc`);
  const favorite = isFavorite(slug);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(slug);
  };

  return (
    <Link to={createPageUrl('CalculatorPage') + `?lang=${language}&trade=${trade}&slug=${slug}`}>
      <Card className="h-full group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-slate-200 hover:border-emerald-300 overflow-hidden relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 end-3 z-10 h-8 w-8"
          onClick={handleFavoriteClick}
        >
          <Star className={`w-4 h-4 ${favorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`} />
        </Button>
        <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        <CardContent className="p-6 pe-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center group-hover:from-emerald-500 group-hover:to-teal-500 transition-all duration-300 shadow-sm">
              {Icon ? (
                <Icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
              ) : (
                <Calculator className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors">
                {title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-3">
                {shortDesc}
              </p>
              <Button 
                variant="ghost" 
                size="sm"
                className="px-0 h-auto text-emerald-600 hover:text-emerald-700 hover:bg-transparent group/btn"
              >
                {t('common.useCalculator')}
                <Arrow className="w-4 h-4 ms-1 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}