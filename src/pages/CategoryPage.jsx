import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../components/i18n/LanguageContext';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import CalculatorCard from '../components/calculators/CalculatorCard';
import { calculatorRegistry } from '../components/calculators/engines';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wind, Droplets, Flame, Calculator, ArrowLeft, ArrowRight, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const tradeIcons = {
  hvac: Wind,
  plumbing: Droplets,
  firefighting: Flame,
  electrical: Cpu
};

const tradeColors = {
  hvac: { gradient: 'from-blue-500 to-cyan-500', light: 'bg-blue-50', border: 'border-blue-200' },
  plumbing: { gradient: 'from-teal-500 to-emerald-500', light: 'bg-teal-50', border: 'border-teal-200' },
  firefighting: { gradient: 'from-red-500 to-orange-500', light: 'bg-red-50', border: 'border-red-200' },
  electrical: { gradient: 'from-amber-500 to-yellow-500', light: 'bg-amber-50', border: 'border-amber-200' }
};

const calculatorsByTrade = {
  hvac: ['duct-sizing', 'chilled-water-pipe-sizing', 'pump-head-loss', 'fan-esp'],
  plumbing: ['water-supply-sizing', 'drainage-sizing', 'tank-sizing-refill-time', 'water-heater-sizing'],
  firefighting: ['hazen-williams-friction-loss', 'fire-pump-sizing'],
  electrical: ['voltage-drop', 'cable-sizing', 'breaker-sizing', 'conduit-trunking-fill', 'short-circuit-level', 'transformer-sizing', 'load-schedule-summary']
};

export default function CategoryPage() {
  const { language, isRTL, t } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  
  // Get trade from URL
  const params = new URLSearchParams(window.location.search);
  const trade = params.get('trade') || 'hvac';
  
  const Icon = tradeIcons[trade] || Wind;
  const colors = tradeColors[trade] || tradeColors.hvac;
  const calculators = Object.keys(calculatorRegistry).filter(slug => calculatorRegistry[slug].trade === trade);

  useEffect(() => {
    const lang = params.get('lang');
    if (lang && (lang === 'ar' || lang === 'en')) {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }, []);

  const breadcrumbItems = [
    { label: t(`nav.${trade}`), href: null }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${colors.gradient} text-white`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative">
          <div className="mb-4 sm:mb-6">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">
                {t(`trades.${trade}.title`)}
              </h1>
              <p className="text-base sm:text-lg text-white/80">
                {t(`trades.${trade}.description`)}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f8fafc" d="M0,40 C360,60 720,20 1440,40 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Category Intro Content */}
      <section className="py-6 sm:py-8 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed">
              {trade === 'hvac' && language === 'ar' && 'حاسبات التكييف HVAC لأشهر فحوصات الاختيار المستخدمة في مشاريع السعودية، مثل طرق حساب مقاس الدكت، اختيار مواسير المياه المبردة، حساب هيد المضخة، وتقدير الضغط الاستاتيكي للمروحة. استخدم هذه الأدوات للمقارنات السريعة والتنسيق والتحقق المبدئي، ثم اعتمد القيم النهائية حسب مواصفات المشروع والاعتمادات.'}
              {trade === 'hvac' && language === 'en' && 'HVAC calculators for common sizing checks used in Saudi projects, including duct sizing methods, chilled water pipe sizing, pump head loss, and fan static pressure estimates. Use these tools for quick comparisons, coordination, and preliminary engineering checks, then verify with project specifications and approved submittals.'}
              
              {trade === 'plumbing' && language === 'ar' && 'حاسبات السباكة لعمليات التحقق من مقاسات تغذية المياه والصرف الصحي المستخدمة بالموقع وأثناء تطوير التصميم. تساعدك على توحيد الافتراضات ومقارنة الخيارات ودعم مراجعة السبمتالات مع الالتزام بمتطلبات المشروع والكود.'}
              {trade === 'plumbing' && language === 'en' && 'Plumbing calculators for water supply and drainage sizing checks used on site and during design development. Build consistent assumptions, compare options, and support submittal reviews — always aligned with project requirements and codes.'}
              
              {trade === 'firefighting' && language === 'ar' && 'حاسبات مكافحة الحريق للتحقق المبدئي من فاقد الاحتكاك وأدوات مساعدة لاختيار مضخة الحريق. تفيد في التنسيق المبكر والمراجعة الهندسية، لكن الاعتماد النهائي يجب أن يكون حسب متطلبات الدفاع المدني والحسابات المعتمدة ومواصفات المشروع.'}
              {trade === 'firefighting' && language === 'en' && 'Firefighting calculators for preliminary friction-loss checks and pump sizing helpers. These tools support early coordination and engineering review, but final design must follow Civil Defense requirements, approved calculations, and project specifications.'}
              
              {trade === 'electrical' && language === 'ar' && 'حاسبات الكهرباء لفحوصات شائعة وفق منهج IEC المستخدمة في مشاريع السعودية، مثل هبوط الجهد، اختيار مقاس الكابل، نسبة تعبئة المواسير/التراكنج، اختيار القواطع، تيار القصر (مبسط)، واختيار المحول. تُستخدم للتحقق السريع والتنسيق، ثم يتم الاعتماد النهائي حسب الدراسات التفصيلية ومواصفات المشروع.'}
              {trade === 'electrical' && language === 'en' && 'Electrical calculators for common IEC-style checks used in Saudi projects, including voltage drop, cable sizing, conduit/trunking fill, breaker sizing, short-circuit level (basic), and transformer sizing. Use for quick validation and coordination, then confirm final selections with detailed studies and project specs.'}
            </p>
          </div>
        </div>
      </section>

      {/* Calculators Grid */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {language === 'ar' ? 'جميع الحاسبات' : 'All Calculators'}
            </h2>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs sm:text-sm">
              {calculators.length} {language === 'ar' ? 'حاسبة' : 'calculators'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {calculators.map((slug, index) => (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CalculatorCard slug={slug} trade={trade} icon={Calculator} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Categories */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">
            {language === 'ar' ? 'الأقسام الأخرى' : 'Other Categories'}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Object.keys(calculatorsByTrade)
              .filter(tradeKey => tradeKey !== trade)
              .map((tradeKey) => {
                const TIcon = tradeIcons[tradeKey];
                const tColors = tradeColors[tradeKey];
                return (
                  <Link
                    key={tradeKey}
                    to={createPageUrl('CategoryPage') + `?lang=${language}&trade=${tradeKey}`}
                  >
                    <div className={`p-6 rounded-2xl ${tColors.light} ${tColors.border} border-2 hover:shadow-lg transition-all duration-300 group`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${tColors.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                          <TIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {t(`trades.${tradeKey}.title`)}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {Object.values(calculatorRegistry).filter(item => item.trade === tradeKey).length} {language === 'ar' ? 'حاسبة' : 'calculators'}
                          </p>
                        </div>
                        <Arrow className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
}