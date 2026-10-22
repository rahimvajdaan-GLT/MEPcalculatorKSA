import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

export default function FAQSection({ items = [] }) {
  const { t } = useLanguage();

  if (!items || items.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{t('common.faq')}</h2>
      </div>
      
      <Accordion type="single" collapsible className="space-y-3">
        {items.map((item, index) => (
          <AccordionItem 
            key={index} 
            value={`faq-${index}`}
            className="border border-slate-200 rounded-xl px-6 bg-white hover:border-emerald-200 transition-colors"
          >
            <AccordionTrigger className="text-start font-medium text-slate-900 hover:text-emerald-600">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}