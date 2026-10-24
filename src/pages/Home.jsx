import { getCalculatorConfig } from '../components/calculators/engines';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, Wind, Droplets, Flame, ArrowLeft, ArrowRight, 
  Target, Zap, Globe, Shield, CheckCircle, Star, Cpu, Clock, Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import HeroIllustration from '../components/graphics/HeroIllustration';
import { useFavorites, useHistory } from '../components/calculators/useFavorites';

const tradeIcons = {
  hvac: Wind,
  plumbing: Droplets,
  firefighting: Flame,
  electrical: Cpu
};

const tradeColors = {
  hvac: { bg: 'from-blue-500 to-cyan-500', light: 'bg-blue-100', text: 'text-blue-600' },
  plumbing: { bg: 'from-teal-500 to-emerald-500', light: 'bg-teal-100', text: 'text-teal-600' },
  firefighting: { bg: 'from-red-500 to-orange-500', light: 'bg-red-100', text: 'text-red-600' },
  electrical: { bg: 'from-amber-500 to-yellow-500', light: 'bg-amber-100', text: 'text-amber-600' }
};

const hvacCalculators = ['duct-sizing', 'chilled-water-pipe-sizing', 'pump-head-loss', 'fan-esp'];
const plumbingCalculators = ['water-supply-sizing', 'drainage-sizing', 'tank-sizing-refill-time', 'water-heater-sizing'];
const firefightingCalculators = ['hazen-williams-friction-loss', 'fire-pump-sizing'];
const electricalCalculators = ['voltage-drop', 'cable-sizing', 'breaker-sizing', 'conduit-trunking-fill', 'short-circuit-level', 'transformer-sizing', 'load-schedule-summary'];

export default function Home() {
  const { language, isRTL, t, switchLanguage } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const { favorites } = useFavorites();
  const { history } = useHistory();

  // Detect language from URL - default to Arabic
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang') || 'ar';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // If no lang param, add it
    if (!params.get('lang')) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('lang', 'ar');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, []);

  const trades = [
    { key: 'hvac', calculators: hvacCalculators },
    { key: 'plumbing', calculators: plumbingCalculators },
    { key: 'firefighting', calculators: firefightingCalculators },
    { key: 'electrical', calculators: electricalCalculators }
  ];

  const features = [
    { key: 'accurate', icon: Target },
    { key: 'fast', icon: Zap },
    { key: 'bilingual', icon: Globe },
    { key: 'saudiStandards', icon: Shield }
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="absolute inset-0 opacity-20 hidden md:block">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-start"
            >
            <Badge className="mb-4 sm:mb-6 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm inline-flex items-center">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 me-1 sm:me-2" />
              {language === 'ar' ? 'أدوات هندسية متقدمة' : 'Advanced Engineering Tools'}
            </Badge>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              {language === 'ar' ? 'حاسبات MEP للمشاريع السعودية' : 'MEP Calculator'}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 mb-3 sm:mb-4 leading-relaxed">
              {language === 'ar' ? 'أدوات هندسية دقيقة وسريعة للمشاريع في السعودية.' : 'Fast MEP sizing calculators for Saudi projects.'}
            </p>

            <p className="text-sm sm:text-base text-slate-300 mb-6 sm:mb-8 leading-relaxed">
              {language === 'ar' 
                ? 'تقدم منصة حاسبات MEP أدوات هندسية عملية للمهندسين في المملكة العربية السعودية، تشمل حسابات التكييف والتهوية، وشبكات المياه والصرف، وأنظمة مكافحة الحريق، والأعمال الكهربائية. تساعدك الأدوات على حساب أبعاد مجاري الهواء، ومقاسات الأنابيب، وفاقد الضغط، وهبوط الجهد، واختيار الكابلات والقواطع. تتوفر الحاسبات بالعربية والإنجليزية، مع أمثلة تطبيقية وافتراضات واضحة لدعم مراجعة التصميم والتنسيق الهندسي.'
                : 'MEP Calc KSA provides fast, practical calculators for HVAC, Plumbing, Firefighting, and Electrical works used in Saudi projects. Use tools like duct sizing, chilled water pipe sizing, pump head loss, Hazen-Williams friction loss, voltage drop, cable sizing, and breaker sizing. The site is bilingual (Arabic + English), mobile-friendly, and includes worked examples and clear assumptions to support engineering checks and site coordination.'}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 mb-4">
              <a href={createPageUrl('CategoryPage') + `?lang=${language}&trade=hvac`}>
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl min-h-[44px]">
                  <Calculator className="w-5 h-5 me-2" />
                  {language === 'ar' ? 'الدخول إلى الحاسبات' : 'Open Calculators'}
                </Button>
              </a>
              <a href={createPageUrl('StandardsPage') + `?lang=${language}`}>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white shadow-xl min-h-[44px]">
                  {language === 'ar' ? 'عرض المعايير' : 'View Standards'}
                </Button>
              </a>
            </div>
            </motion.div>

            {/* Hero Illustration */}
            <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
            >
            <HeroIllustration />
            </motion.div>
            </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f8fafc" d="M0,60 C360,100 720,0 1440,60 L1440,100 L0,100 Z" />
          </svg>
        </div>
      </section>

      {/* Category Cards Section */}
      <section className="py-8 sm:py-12 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 sm:mb-4">
              {language === 'ar' ? 'أقسام الحاسبات' : 'Calculator Categories'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trades.map((trade, index) => {
              const Icon = tradeIcons[trade.key];
              const colors = tradeColors[trade.key];
              return (
                <motion.div
                  key={trade.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={createPageUrl('CategoryPage') + `?lang=${language}&trade=${trade.key}`}>
                    <Card className="h-full border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                      <CardContent className="p-6">
                        <div className={`w-14 h-14 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="font-semibold text-lg text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                          {t(`nav.${trade.key}`)}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          {t(`trades.${trade.key}.cardDesc`)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Favorites & Recent */}
      {(favorites.length > 0 || history.length > 0) && (
        <section className="py-8 sm:py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {favorites.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-pink-600" />
                  <h2 className="text-2xl font-bold text-slate-900">
                    {language === 'ar' ? 'المفضلة' : 'Favorites'}
                  </h2>
                  <Badge variant="secondary">{favorites.length}</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {favorites.slice(0, 4).map((slug) => {
                    const trade = hvacCalculators.includes(slug) ? 'hvac' : 
                                  plumbingCalculators.includes(slug) ? 'plumbing' : 
                                  firefightingCalculators.includes(slug) ? 'firefighting' : 'electrical';
                    const Icon = tradeIcons[trade];
                    const colors = tradeColors[trade];
                    return (
                      <Link
                        key={slug}
                        to={createPageUrl('CalculatorPage') + `?lang=${language}&trade=${trade}&slug=${slug}`}
                      >
                        <Card className="h-full group hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-pink-300">
                          <CardContent className="p-5">
                            <div className={`w-10 h-10 bg-gradient-to-br ${colors.bg} rounded-lg flex items-center justify-center mb-3`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="font-semibold text-slate-900 group-hover:text-pink-600 transition-colors">
                              {(getCalculatorConfig(slug, language)?.title || t(`calculators.${slug}.title`))}
                            </h4>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-slate-900">
                    {language === 'ar' ? 'المستخدمة مؤخراً' : 'Recently Used'}
                  </h2>
                  <Badge variant="secondary">{history.length}</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {history.slice(0, 4).map((slug) => {
                    const trade = hvacCalculators.includes(slug) ? 'hvac' : 
                                  plumbingCalculators.includes(slug) ? 'plumbing' : 
                                  firefightingCalculators.includes(slug) ? 'firefighting' : 'electrical';
                    const Icon = tradeIcons[trade];
                    const colors = tradeColors[trade];
                    return (
                      <Link
                        key={slug}
                        to={createPageUrl('CalculatorPage') + `?lang=${language}&trade=${trade}&slug=${slug}`}
                      >
                        <Card className="h-full group hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-blue-300">
                          <CardContent className="p-5">
                            <div className={`w-10 h-10 bg-gradient-to-br ${colors.bg} rounded-lg flex items-center justify-center mb-3`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {(getCalculatorConfig(slug, language)?.title || t(`calculators.${slug}.title`))}
                            </h4>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Calculators by Trade */}
      <section className="py-8 sm:py-12 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 sm:mb-4">
              {t('home.allCalculators')}
            </h2>
          </motion.div>

          <div className="space-y-8 sm:space-y-12">
            {trades.map((trade, tradeIndex) => {
              const Icon = tradeIcons[trade.key];
              const colors = tradeColors[trade.key];
              
              return (
                <motion.div
                  key={trade.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: tradeIndex * 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${colors.bg} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                        {t(`trades.${trade.key}.title`)}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-500 truncate">
                        {t(`trades.${trade.key}.description`)}
                      </p>
                    </div>
                    <Link 
                      to={createPageUrl('CategoryPage') + `?lang=${language}&trade=${trade.key}`}
                      className="w-full sm:w-auto"
                    >
                      <Button variant="outline" className="border-slate-200 hover:border-emerald-300 w-full sm:w-auto min-h-[44px]">
                        {t('common.moreInfo')}
                        <Arrow className="w-4 h-4 ms-2" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {trade.calculators.map((slug) => (
                      <Link
                        key={slug}
                        to={createPageUrl('CalculatorPage') + `?lang=${language}&trade=${trade.key}&slug=${slug}`}
                      >
                        <Card className="h-full group hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-emerald-300">
                          <CardContent className="p-5">
                            <div className={`w-10 h-10 ${colors.light} rounded-lg flex items-center justify-center mb-3 group-hover:bg-gradient-to-br ${colors.bg} transition-all`}>
                              <Calculator className={`w-5 h-5 ${colors.text} group-hover:text-white transition-colors`} />
                            </div>
                            <h4 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors mb-1">
                              {(getCalculatorConfig(slug, language)?.title || t(`calculators.${slug}.title`))}
                            </h4>
                            <p className="text-sm text-slate-500 line-clamp-2">
                              {(getCalculatorConfig(slug, language)?.description || t(`calculators.${slug}.shortDesc`))}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
              {language === 'ar' 
                ? 'ابدأ باستخدام الحاسبات الآن' 
                : 'Start Using Calculators Now'}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-emerald-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              {language === 'ar'
                ? 'جميع الحاسبات مجانية ومتاحة للاستخدام الفوري'
                : 'All calculators are free and available for immediate use'}
            </p>
            <Link to={createPageUrl('CategoryPage') + `?lang=${language}&trade=hvac`}>
              <Button size="lg" variant="secondary" className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl min-h-[44px] w-full sm:w-auto">
                <Calculator className="w-5 h-5 me-2" />
                {t('common.useCalculator')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}