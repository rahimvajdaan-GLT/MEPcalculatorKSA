import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, CheckCircle } from 'lucide-react';

export default function AssumptionsSection({ items = [] }) {
  const { t } = useLanguage();

  if (!items || items.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Info className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{t('common.assumptions')}</h2>
      </div>

      <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
        <CardContent className="p-6">
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}