import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../i18n/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, ArrowRight, ArrowLeft } from 'lucide-react';

const calculatorsByTrade = {
  hvac: ['duct-sizing', 'chilled-water-pipe-sizing', 'pump-head-loss', 'fan-esp'],
  plumbing: ['water-supply-sizing', 'drainage-sizing', 'tank-sizing-refill-time', 'water-heater-sizing'],
  firefighting: ['hazen-williams-friction-loss', 'fire-pump-sizing'],
  electrical: ['voltage-drop', 'cable-sizing', 'breaker-sizing', 'conduit-trunking-fill', 'short-circuit-level', 'transformer-sizing', 'load-schedule-summary'],
};

export default function SuggestedCalculations({ currentSlug, trade }) {
  const { language, isRTL, t } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const suggestions = (calculatorsByTrade[trade] || []).filter(s => s !== currentSlug);

  if (suggestions.length === 0) return null;

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-sm flex items-center gap-2 text-slate-700">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          {language === 'ar' ? 'حاسبات مقترحة' : 'Suggested Calculators'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-1">
        {suggestions.map(slug => (
          <Link
            key={slug}
            to={createPageUrl('CalculatorPage') + `?lang=${language}&trade=${trade}&slug=${slug}`}
            className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors group"
          >
            <span className="leading-snug">{t(`calculators.${slug}.title`)}</span>
            <Arrow className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 flex-shrink-0 transition-colors" />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}