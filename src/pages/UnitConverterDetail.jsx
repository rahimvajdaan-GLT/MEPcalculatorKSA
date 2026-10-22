import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../components/i18n/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, ArrowLeft, ArrowLeftRight, Calculator, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function UnitConverterDetail() {
  const { language, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const lang = params.get('lang') || language;

  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [isReverse, setIsReverse] = useState(false);

  const { data: converters = [] } = useQuery({
    queryKey: ['converters'],
    queryFn: () => base44.entities.Converter.list(),
  });

  const converter = converters.find(c => c.slug === slug);

  useEffect(() => {
    if (!converter) return;

    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    const title = lang === 'ar' ? converter.meta_title_ar : converter.meta_title_en;
    const description = lang === 'ar' ? converter.meta_desc_ar : converter.meta_desc_en;

    document.title = title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // Add JSON-LD schemas
    let webAppSchema = document.getElementById('converter-webapp-schema');
    if (!webAppSchema) {
      webAppSchema = document.createElement('script');
      webAppSchema.id = 'converter-webapp-schema';
      webAppSchema.type = 'application/ld+json';
      document.head.appendChild(webAppSchema);
    }

    webAppSchema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": lang === 'ar' ? converter.title_ar : converter.title_en,
      "applicationCategory": "EngineeringApplication",
      "operatingSystem": "All",
      "description": description,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    });

    // FAQ Schema
    const faqSchema = lang === 'ar' ? converter.schema_faq_ar : converter.schema_faq_en;
    if (faqSchema) {
      let faqSchemaEl = document.getElementById('converter-faq-schema');
      if (!faqSchemaEl) {
        faqSchemaEl = document.createElement('script');
        faqSchemaEl.id = 'converter-faq-schema';
        faqSchemaEl.type = 'application/ld+json';
        document.head.appendChild(faqSchemaEl);
      }
      faqSchemaEl.textContent = faqSchema;
    }
  }, [converter, lang]);

  useEffect(() => {
    if (!converter) return;
    
    if (isReverse) {
      // Calculate fromValue from toValue
      if (toValue !== '') {
        const val = parseFloat(toValue);
        if (!isNaN(val)) {
          const result = (val - converter.offset) / converter.factor;
          setFromValue(result.toFixed(6).replace(/\.?0+$/, ''));
        }
      } else {
        setFromValue('');
      }
    } else {
      // Calculate toValue from fromValue
      if (fromValue !== '') {
        const val = parseFloat(fromValue);
        if (!isNaN(val)) {
          const result = val * converter.factor + converter.offset;
          setToValue(result.toFixed(6).replace(/\.?0+$/, ''));
        }
      } else {
        setToValue('');
      }
    }
  }, [fromValue, toValue, isReverse, converter]);

  const handleSwap = () => {
    setIsReverse(!isReverse);
    const temp = fromValue;
    setFromValue(toValue);
    setToValue(temp);
  };

  if (!converter) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Calculator className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">
            {lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  const h1 = lang === 'ar' ? converter.h1_ar : converter.h1_en;
  const intro = lang === 'ar' ? converter.intro_ar : converter.intro_en;
  const note = lang === 'ar' ? converter.note_ar : converter.note_ar;
  const formula = lang === 'ar' ? converter.formula_ar : converter.formula_en;
  const examples = lang === 'ar' ? converter.examples_ar : converter.examples_en;
  const faq = lang === 'ar' ? converter.faq_ar : converter.faq_en;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-4">
              <Link to={createPageUrl('UnitConverterHub') + `?lang=${lang}`} className="text-white/80 hover:text-white text-sm">
                {isRTL && <ArrowRight className="inline w-4 h-4 me-2" />}
                {lang === 'ar' ? 'محولات الوحدات' : 'Unit Converters'}
                {!isRTL && <ArrowLeft className="inline w-4 h-4 ms-2" />}
              </Link>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{h1}</h1>
            <p className="text-lg text-white/90 max-w-3xl">{intro}</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Converter Tool */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-indigo-600" />
                    {lang === 'ar' ? 'المحول' : 'Converter'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{converter.from_unit}</Label>
                    <Input
                      type="number"
                      value={fromValue}
                      onChange={(e) => {
                        setFromValue(e.target.value);
                        setIsReverse(false);
                      }}
                      placeholder={lang === 'ar' ? 'أدخل القيمة' : 'Enter value'}
                      className="text-lg"
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button variant="outline" size="icon" onClick={handleSwap}>
                      <ArrowLeftRight className="w-5 h-5" />
                    </Button>
                  </div>

                  <div>
                    <Label>{converter.to_unit}</Label>
                    <Input
                      type="number"
                      value={toValue}
                      onChange={(e) => {
                        setToValue(e.target.value);
                        setIsReverse(true);
                      }}
                      placeholder={lang === 'ar' ? 'النتيجة' : 'Result'}
                      className="text-lg"
                    />
                  </div>

                  {note && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                      {note}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Common Conversions Table */}
            {converter.common_rows && converter.common_rows.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {lang === 'ar' ? 'جدول التحويل السريع' : 'Quick Conversion Table'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="p-3 text-start font-semibold">{converter.from_unit}</th>
                          <th className="p-3 text-start font-semibold">{converter.to_unit}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {converter.common_rows.map((row, idx) => (
                          <tr key={idx} className="border-b hover:bg-slate-50">
                            <td className="p-3">{row.from}</td>
                            <td className="p-3 font-semibold text-indigo-600">{row.to}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Formula */}
            {formula && (
              <Card>
                <CardHeader>
                  <CardTitle>{lang === 'ar' ? 'الصيغة' : 'Formula'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 leading-relaxed">{formula}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Examples */}
            {examples && (
              <Card>
                <CardHeader>
                  <CardTitle>{lang === 'ar' ? 'أمثلة' : 'Examples'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">{examples}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQ */}
            {faq && faq.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{lang === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faq.map((item, idx) => (
                      <AccordionItem key={idx} value={`item-${idx}`}>
                        <AccordionTrigger className="text-start">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-slate-600">{item.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {/* Related Tools */}
            <Card>
              <CardHeader>
                <CardTitle>{lang === 'ar' ? 'أدوات ذات صلة' : 'Related Tools'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={createPageUrl('UnitConverterHub') + `?lang=${lang}`}>
                  <Button variant="outline" className="w-full justify-between">
                    {lang === 'ar' ? 'جميع محولات الوحدات' : 'All Unit Converters'}
                    <Arrow className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to={createPageUrl('Home') + `?lang=${lang}`}>
                  <Button variant="outline" className="w-full justify-between">
                    {lang === 'ar' ? 'حاسبات MEP الهندسية' : 'MEP Engineering Calculators'}
                    <Arrow className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}