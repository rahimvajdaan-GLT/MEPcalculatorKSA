import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ChevronDown, ChevronUp, ArrowRight, ArrowLeft } from 'lucide-react';

export default function WorkedExample({ 
  inputs = {}, 
  outputs = {},
  inputLabels = {},
  outputLabels = {},
  description
}) {
  const { t, isRTL } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{t('common.example')}</h2>
      </div>

      <Card className="border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-amber-900">
              {t('common.viewExample')}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-amber-700 hover:text-amber-900 hover:bg-amber-100"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4 me-1" />
                  {isRTL ? 'إخفاء' : 'Hide'}
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 me-1" />
                  {isRTL ? 'عرض' : 'Show'}
                </>
              )}
            </Button>
          </div>
          {description && (
            <p className="text-sm text-amber-700 mt-2">{description}</p>
          )}
        </CardHeader>

        {expanded && (
          <CardContent className="pt-0">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Inputs */}
              <div className="bg-white rounded-xl p-4 border border-amber-200">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    {t('common.inputs')}
                  </Badge>
                </h4>
                <ul className="space-y-2">
                  {Object.entries(inputs).map(([key, value]) => (
                    <li key={key} className="flex justify-between text-sm">
                      <span className="text-slate-600">{inputLabels[key] || key}:</span>
                      <span className="font-medium text-slate-900">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center absolute inset-0 pointer-events-none">
                <Arrow className="w-8 h-8 text-amber-400" />
              </div>

              {/* Outputs */}
              <div className="bg-white rounded-xl p-4 border border-emerald-200">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    {t('common.results')}
                  </Badge>
                </h4>
                <ul className="space-y-2">
                  {Object.entries(outputs).map(([key, value]) => (
                    <li key={key} className="flex justify-between text-sm">
                      <span className="text-slate-600">{outputLabels[key] || key}:</span>
                      <span className="font-medium text-emerald-700">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </section>
  );
}