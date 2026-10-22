import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../components/i18n/LanguageContext';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Calculator, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Wind, Droplets, Flame, Cpu, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

const tradeColors = {
  hvac:         'from-blue-500 to-cyan-500',
  plumbing:     'from-teal-500 to-emerald-500',
  firefighting: 'from-red-500 to-orange-500',
  electrical:   'from-amber-500 to-yellow-500',
  general:      'from-slate-500 to-slate-600',
};
const tradeIcons = { hvac: Wind, plumbing: Droplets, firefighting: Flame, electrical: Cpu, general: Layers };

// Maps calculator slugs to their display titles (bilingual)
const calcTitles = {
  'duct-sizing':               { ar: 'تصميم مجاري الهواء',     en: 'Duct Sizing' },
  'chilled-water-pipe-sizing': { ar: 'مواسير المياه المبردة',   en: 'Chilled Water Pipe Sizing' },
  'pump-head-loss':            { ar: 'هيد المضخة',             en: 'Pump Head Loss' },
  'fan-esp':                   { ar: 'ضغط المروحة الاستاتيكي', en: 'Fan ESP' },
  'water-supply-sizing':       { ar: 'تصميم شبكة المياه',       en: 'Water Supply Sizing' },
  'drainage-sizing':           { ar: 'تصميم شبكة الصرف',        en: 'Drainage Sizing' },
  'tank-sizing-refill-time':   { ar: 'حجم الخزان ووقت الملء',  en: 'Tank Sizing & Refill Time' },
  'water-heater-sizing':       { ar: 'سخان المياه',             en: 'Water Heater Sizing' },
  'hazen-williams-friction-loss': { ar: 'فقدان الاحتكاك هازن ويليامز', en: 'Hazen-Williams Friction Loss' },
  'fire-pump-sizing':          { ar: 'اختيار مضخة الحريق',      en: 'Fire Pump Sizing' },
  'voltage-drop':              { ar: 'هبوط الجهد',              en: 'Voltage Drop' },
  'cable-sizing':              { ar: 'اختيار مقاس الكابل',      en: 'Cable Sizing' },
  'breaker-sizing':            { ar: 'اختيار القاطع',           en: 'Breaker Sizing' },
  'conduit-trunking-fill':     { ar: 'نسبة تعبئة المواسير',     en: 'Conduit & Trunking Fill' },
  'short-circuit-level':       { ar: 'مستوى تيار القصر',        en: 'Short Circuit Level' },
  'transformer-sizing':        { ar: 'اختيار المحول',           en: 'Transformer Sizing' },
  'load-schedule-summary':     { ar: 'جدول الأحمال',            en: 'Load Schedule' },
};

const tradeForSlug = (slug) => {
  if (['duct-sizing','chilled-water-pipe-sizing','pump-head-loss','fan-esp'].includes(slug)) return 'hvac';
  if (['water-supply-sizing','drainage-sizing','tank-sizing-refill-time','water-heater-sizing'].includes(slug)) return 'plumbing';
  if (['hazen-williams-friction-loss','fire-pump-sizing'].includes(slug)) return 'firefighting';
  return 'electrical';
};

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 text-start font-medium text-slate-900 hover:bg-slate-50 transition-colors"
      >
        {question}
        {open ? <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
      </button>
      {open && <div className="px-4 pb-4 text-slate-600 text-sm leading-relaxed">{answer}</div>}
    </div>
  );
}

export default function EngineeringGuideDetail() {
  const { language } = useLanguage();
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang') || language;
  const slug = params.get('slug') || '';
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const { data: guides = [], isLoading } = useQuery({
    queryKey: ['engineeringGuide', slug],
    queryFn: () => base44.entities.EngineeringGuide.filter({ slug, status: 'published' }),
    enabled: !!slug,
  });

  const guide = guides[0] || null;

  useEffect(() => {
    if (!guide) return;
    const title = lang === 'ar' ? (guide.meta_title_ar || guide.title_ar) : (guide.meta_title_en || guide.title_en);
    const desc  = lang === 'ar' ? guide.meta_desc_ar : guide.meta_desc_en;
    document.title = title ? `${title} | MEP Calculator` : 'MEP Calculator';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    if (desc) meta.content = desc;

    // FAQ JSON-LD
    if (guide.faq?.length) {
      let ld = document.getElementById('guide-faq-ld');
      if (!ld) { ld = document.createElement('script'); ld.id = 'guide-faq-ld'; ld.type = 'application/ld+json'; document.head.appendChild(ld); }
      ld.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": guide.faq.map(f => ({
          "@type": "Question",
          "name": lang === 'ar' ? f.question_ar : f.question_en,
          "acceptedAnswer": { "@type": "Answer", "text": lang === 'ar' ? f.answer_ar : f.answer_en }
        }))
      });
    }
  }, [guide, lang]);

  const gradient = guide ? (tradeColors[guide.trade] || tradeColors.general) : 'from-slate-700 to-slate-900';
  const TradeIcon = guide ? (tradeIcons[guide.trade] || Layers) : Layers;

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!guide) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <BookOpen className="w-16 h-16 text-slate-300" />
      <p className="text-xl text-slate-500">{lang === 'ar' ? 'الدليل غير موجود' : 'Guide not found'}</p>
      <Link to={createPageUrl('EngineeringGuides') + `?lang=${lang}`} className="text-emerald-600 hover:underline">
        {lang === 'ar' ? '← العودة إلى الأدلة' : '← Back to Guides'}
      </Link>
    </div>
  );

  const title = lang === 'ar' ? guide.title_ar : guide.title_en;
  const h1    = lang === 'ar' ? (guide.h1_ar || guide.title_ar) : (guide.h1_en || guide.title_en);
  const intro = lang === 'ar' ? guide.intro_ar : guide.intro_en;
  const body  = lang === 'ar' ? guide.body_ar : guide.body_en;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${gradient} text-white`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative">
          <Link
            to={createPageUrl('EngineeringGuides') + `?lang=${lang}`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm transition-colors"
          >
            <Arrow className="w-4 h-4 rotate-180" />
            {lang === 'ar' ? 'الأدلة الهندسية' : 'Engineering Guides'}
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <TradeIcon className="w-5 h-5 text-white" />
              </div>
              {guide.readingTimeMinutes && (
                <span className="flex items-center gap-1 text-white/70 text-sm">
                  <Clock className="w-4 h-4" />
                  {guide.readingTimeMinutes} {lang === 'ar' ? 'دقيقة قراءة' : 'min read'}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{h1}</h1>
            {intro && <p className="text-white/85 text-lg leading-relaxed">{intro}</p>}
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path fill="#f8fafc" d="M0,40 C360,60 720,20 1440,40 L1440,60 L0,60 Z" /></svg>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Article Body */}
          <div className="lg:col-span-2 space-y-8">
            {body && (
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h3:text-xl prose-h3:font-semibold prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-table:text-sm">
                    <ReactMarkdown>{body}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQ */}
            {guide.faq?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  {lang === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
                </h2>
                <div className="space-y-2">
                  {guide.faq.map((f, i) => (
                    <FAQItem
                      key={i}
                      question={lang === 'ar' ? f.question_ar : f.question_en}
                      answer={lang === 'ar' ? f.answer_ar : f.answer_en}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Calculators */}
            {guide.relatedCalculators?.length > 0 && (
              <Card className="border-emerald-200">
                <CardContent className="p-5">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-600" />
                    {lang === 'ar' ? 'الحاسبات المرتبطة' : 'Related Calculators'}
                  </h3>
                  <div className="space-y-2">
                    {guide.relatedCalculators.map(calcSlug => {
                      const calcTitle = calcTitles[calcSlug];
                      const trade = tradeForSlug(calcSlug);
                      if (!calcTitle) return null;
                      return (
                        <Link
                          key={calcSlug}
                          to={createPageUrl('CalculatorPage') + `?lang=${lang}&trade=${trade}&slug=${calcSlug}`}
                          className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors group"
                        >
                          <Calculator className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700">
                            {lang === 'ar' ? calcTitle.ar : calcTitle.en}
                          </span>
                          <Arrow className="w-4 h-4 text-emerald-400 ms-auto" />
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Guides */}
            {guide.relatedGuides?.length > 0 && (
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-slate-600" />
                    {lang === 'ar' ? 'أدلة ذات صلة' : 'Related Guides'}
                  </h3>
                  <div className="space-y-2 text-sm text-emerald-600">
                    {guide.relatedGuides.map(relSlug => (
                      <Link
                        key={relSlug}
                        to={createPageUrl('EngineeringGuideDetail') + `?lang=${lang}&slug=${relSlug}`}
                        className="block hover:underline"
                      >
                        {relSlug}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}