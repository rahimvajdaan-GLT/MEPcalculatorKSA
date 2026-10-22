import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../i18n/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Calculator } from 'lucide-react';

export default function RelatedCalculators({ slugs = [], trade }) {
  const { language, isRTL, t } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  if (!slugs || slugs.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <Calculator className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{t('common.relatedCalculators')}</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {slugs.map((slug) => (
          <a
            key={slug}
            href={createPageUrl('CalculatorPage') + `?lang=${language}&trade=${trade}&slug=${slug}`}
          >
            <Card className="group hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-purple-300 h-full">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900 group-hover:text-purple-600 transition-colors">
                      {t(`calculators.${slug}.title`)}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {t(`calculators.${slug}.shortDesc`)}
                    </p>
                  </div>
                  <Arrow className="w-5 h-5 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}