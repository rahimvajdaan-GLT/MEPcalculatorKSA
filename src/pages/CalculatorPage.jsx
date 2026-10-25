import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../components/i18n/LanguageContext';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import UnitToggle from '../components/calculators/UnitToggle';
import ResultCard from '../components/calculators/ResultCard';
import WarningAlert from '../components/calculators/WarningAlert';
import FAQSection from '../components/calculators/FAQSection';
import WorkedExample from '../components/calculators/WorkedExample';
import AssumptionsSection from '../components/calculators/AssumptionsSection';
import RelatedCalculators from '../components/calculators/RelatedCalculators';
import HowItWorksCard from '../components/calculators/HowItWorksCard';
import ShareButton from '../components/calculators/ShareButton';
import SuggestedCalculations from '../components/calculators/SuggestedCalculations';
import { getCalculatorConfig, calculateResults, getDefaults, getRelatedCalculators, getTrade } from '../components/calculators/engines';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { useHistory } from '../components/calculators/useFavorites';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Calculator, RefreshCw, ArrowLeft, ArrowRight, Wind, Droplets, Flame, Cpu,
  Ruler, Gauge, TrendingUp, CheckCircle, AlertTriangle, Info, HelpCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

const tradeIcons = {
  hvac: Wind,
  plumbing: Droplets,
  firefighting: Flame,
  electrical: Cpu
};

const tradeColors = {
  hvac: 'from-blue-500 to-cyan-500',
  plumbing: 'from-teal-500 to-emerald-500',
  firefighting: 'from-red-500 to-orange-500',
  electrical: 'from-amber-500 to-yellow-500'
};

export default function CalculatorPage() {
  const { language, isRTL, t } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug') || 'duct-sizing';
  const trade = params.get('trade') || getTrade(slug);
  
  const [unitsMode, setUnitsMode] = useState(() => {
    try {
      const stored = localStorage.getItem('mep_user_preferences');
      if (stored) return JSON.parse(stored).unitsMode || 'metric';
    } catch {}
    return 'metric';
  });
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [inputErrors, setInputErrors] = useState({});

  const { preferences } = useUserPreferences();

  const config = useMemo(() => getCalculatorConfig(slug, language), [slug, language]);
  const defaults = useMemo(() => getDefaults(slug, unitsMode), [slug, unitsMode]);
  const relatedSlugs = useMemo(() => getRelatedCalculators(slug), [slug]);
  
  const TradeIcon = tradeIcons[trade] || Wind;
  const tradeColor = tradeColors[trade] || tradeColors.hvac;

  useEffect(() => {
    if (config?.useCustomPage) {
      const customPage = language === 'ar' ? config.customPageAR : config.customPageEN;
      if (customPage) {
        window.location.href = createPageUrl(customPage);
      }
    }
  }, [config, language]);

  useEffect(() => {
    const lang = params.get('lang');
    if (lang && (lang === 'ar' || lang === 'en')) {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }

    if (config) {
      const pageTitle = `${config.title} | MEP Calculators`;
      const pageDescription = config.description;
      document.title = pageTitle;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.name = 'description'; document.head.appendChild(metaDesc); }
      metaDesc.content = pageDescription;

      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property', 'og:title'); document.head.appendChild(ogTitle); }
      ogTitle.content = pageTitle;

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property', 'og:description'); document.head.appendChild(ogDesc); }
      ogDesc.content = pageDescription;

      let ogType = document.querySelector('meta[property="og:type"]');
      if (!ogType) { ogType = document.createElement('meta'); ogType.setAttribute('property', 'og:type'); document.head.appendChild(ogType); }
      ogType.content = 'website';

      let twitterCard = document.querySelector('meta[name="twitter:card"]');
      if (!twitterCard) { twitterCard = document.createElement('meta'); twitterCard.name = 'twitter:card'; document.head.appendChild(twitterCard); }
      twitterCard.content = 'summary_large_image';

      let twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (!twitterTitle) { twitterTitle = document.createElement('meta'); twitterTitle.name = 'twitter:title'; document.head.appendChild(twitterTitle); }
      twitterTitle.content = pageTitle;

      let twitterDesc = document.querySelector('meta[name="twitter:description"]');
      if (!twitterDesc) { twitterDesc = document.createElement('meta'); twitterDesc.name = 'twitter:description'; document.head.appendChild(twitterDesc); }
      twitterDesc.content = pageDescription;

      let structuredData = document.getElementById('calculator-structured-data');
      if (!structuredData) { structuredData = document.createElement('script'); structuredData.id = 'calculator-structured-data'; structuredData.type = 'application/ld+json'; document.head.appendChild(structuredData); }
      structuredData.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": config.title,
        "description": config.description,
        "applicationCategory": "EngineeringApplication",
        "operatingSystem": "Web Browser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "150" },
        "inLanguage": language === 'ar' ? 'ar-SA' : 'en-US',
        "about": { "@type": "Thing", "name": t(`nav.${trade}`) }
      });
    }
  }, [config, language, slug, trade, t]);

  useEffect(() => {
    if (defaults && Object.keys(defaults).length > 0) {
      setInputs(defaults);
    }
  }, [defaults]);

  useEffect(() => {
    setResults(null);
    setHasCalculated(false);
    if (defaults && Object.keys(defaults).length > 0) {
      setInputs(defaults);
    }
  }, [unitsMode]);

  const validateInput = (key, value, inputConfig) => {
    if (!inputConfig) return null;
    const numValue = parseFloat(value);
    if (value === '' || value === null || value === undefined) {
      return language === 'ar' ? 'مطلوب' : 'Required';
    }
    if (typeof value === 'number' || !isNaN(numValue)) {
      if (isNaN(numValue)) return language === 'ar' ? 'قيمة غير صالحة' : 'Invalid value';
      if (numValue < 0) return language === 'ar' ? 'يجب أن تكون القيمة موجبة' : 'Value must be positive';
      if (key === 'pf' && (numValue < 0.1 || numValue > 1)) return language === 'ar' ? 'معامل القدرة بين 0.1 و 1.0' : 'Power factor must be between 0.1 and 1.0';
      if (key === 'maxVD' && numValue > 10) return language === 'ar' ? 'هبوط الجهد عادة أقل من 10%' : 'Voltage drop typically less than 10%';
      if ((key === 'deratingFactor' || key === 'demandFactor') && (numValue < 0 || numValue > 1)) return language === 'ar' ? 'يجب أن تكون القيمة بين 0 و 1' : 'Value must be between 0 and 1';
    }
    return null;
  };

  const handleInputChange = (key, value) => {
    const isDropdown = ['system', 'loadType', 'conductor', 'phase', 'unit', 'panelType', 'mode'].includes(key);
    const processedValue = isDropdown ? value : (parseFloat(value) || 0);
    setInputs(prev => ({ ...prev, [key]: processedValue }));
    setInputErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
  };

  const handleCalculate = () => {
    const errors = {};
    if (config.inputs) {
      Object.entries(config.inputs).forEach(([key, inputConfig]) => {
        const error = validateInput(key, inputs[key], inputConfig);
        if (error) errors[key] = error;
      });
    }
    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      toast.error(language === 'ar' ? 'الرجاء تصحيح الأخطاء' : 'Please fix errors');
      return;
    }
    setIsCalculating(true);
    setTimeout(() => {
      const result = calculateResults(slug, inputs, unitsMode, language);
      setResults(result);
      setHasCalculated(true);
      setIsCalculating(false);
      if (!result.errors || result.errors.length === 0) {
        toast.success(language === 'ar' ? 'تم الحساب بنجاح' : 'Calculated successfully');
        setTimeout(() => {
          const resultsCard = document.querySelector('.results-card');
          if (resultsCard && window.innerWidth < 1024) {
            resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      }
    }, 600);
  };

  const handleReset = () => {
    setInputs(defaults);
    setResults(null);
    setHasCalculated(false);
    setInputErrors({});
    toast.success(language === 'ar' ? 'تم إعادة التعيين' : 'Reset complete');
  };

  const breadcrumbItems = [
    { label: t(`nav.${trade}`), href: createPageUrl('CategoryPage') + `?lang=${language}&trade=${trade}` },
    { label: config?.title || t(`calculators.${slug}.title`) }
  ];

  if (!config) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
          <Card className="mt-8">
            <CardContent className="p-12 text-center">
              <Calculator className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{t(`calculators.${slug}.title`)}</h2>
              <p className="text-slate-500 mb-6">
                {language === 'ar' ? 'هذه الحاسبة قيد التطوير وستكون متاحة قريباً' : 'This calculator is under development and will be available soon'}
              </p>
              <Link to={createPageUrl('CategoryPage') + `?lang=${language}&trade=${trade}`}>
                <Button variant="outline">
                  <Arrow className="w-4 h-4 me-2 rotate-180" />
                  {t('common.backToCategory')} {t(`nav.${trade}`)}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const dropdownOptions = {
    system: [
      { value: '1P', label: language === 'ar' ? 'أحادي الطور' : '1-Phase' },
      { value: '3P', label: language === 'ar' ? 'ثلاثي الطور' : '3-Phase' }
    ],
    loadType: [{ value: 'kW', label: 'kW' }, { value: 'kVA', label: 'kVA' }, { value: 'A', label: 'A' }],
    conductor: [
      { value: 'Cu', label: language === 'ar' ? 'نحاس (Cu)' : 'Copper (Cu)' },
      { value: 'Al', label: language === 'ar' ? 'ألومنيوم (Al)' : 'Aluminum (Al)' }
    ],
    phase: [{ value: '1P', label: '1P' }, { value: '3P', label: '3P' }],
    unit: [{ value: 'kW', label: 'kW' }, { value: 'kVA', label: 'kVA' }, { value: 'A', label: 'A' }],
    mode: [
      { value: 'check', label: language === 'ar' ? 'فحص مقاس محدد' : 'Check Given Size' },
      { value: 'recommend', label: language === 'ar' ? 'اختيار مقاس' : 'Recommend Size' }
    ]
  };

  const tooltips = {
    system: language === 'ar' ? 'اختر نظام الأحمال: أحادي الطور (230V) أو ثلاثي الطور (400V)' : 'Choose load system: 1-Phase (230V) or 3-Phase (400V)',
    voltage: language === 'ar' ? 'جهد التشغيل المقنن للحمل' : 'Rated operating voltage for the load',
    loadType: language === 'ar' ? 'نوع قيمة الحمل: القدرة (kW)، القدرة الظاهرية (kVA)، أو التيار (A)' : 'Load value type: Power (kW), Apparent Power (kVA), or Current (A)',
    pf: language === 'ar' ? 'معامل القدرة (0.1-1.0). القيمة النموذجية 0.9 للأحمال الاستقرائية' : 'Power factor (0.1-1.0). Typical value 0.9 for inductive loads',
    length: language === 'ar' ? 'طول الكابل من المصدر إلى الحمل (اتجاه واحد)' : 'Cable length from source to load (one way)',
    conductor: language === 'ar' ? 'مادة الموصل: نحاس (أعلى سعة) أو ألومنيوم' : 'Conductor material: Copper (higher capacity) or Aluminum',
    maxVD: language === 'ar' ? 'الحد الأقصى المسموح لهبوط الجهد (عادة 3-5%)' : 'Maximum allowable voltage drop (typically 3-5%)',
    deratingFactor: language === 'ar' ? 'معامل التخفيض للحرارة وطريقة التركيب (0.1-1.0)' : 'Derating factor for temperature and installation method (0.1-1.0)',
    demandFactor: language === 'ar' ? 'معامل الطلب (0-1.0). استخدم 1.0 للحمل الكامل، 0 للأحمال الاحتياطية' : 'Demand factor (0-1.0). Use 1.0 for full load, 0 for standby loads'
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${tradeColor} text-white`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative">
          <div className="mb-3 sm:mb-4">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <TradeIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 sm:mb-2">{config.title}</h1>
              <p className="text-sm sm:text-base lg:text-lg text-white/90">{config.description}</p>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f8fafc" d="M0,40 C360,60 720,20 1440,40 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Left Sidebar: Inputs + Results + Suggested */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">

              {/* Inputs Card */}
              <Card className="shadow-lg border-slate-200">
                <CardHeader className="border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Ruler className="w-5 h-5 text-emerald-600" />
                      {t('common.inputs')}
                    </CardTitle>
                    <UnitToggle value={unitsMode} onChange={setUnitsMode} />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                  <TooltipProvider>
                    {config.inputs && Object.entries(config.inputs).map(([key, inputConfig]) => {
                      const isDropdown = ['system', 'loadType', 'conductor', 'phase', 'unit', 'panelType', 'mode'].includes(key);
                      return (
                        <div key={key} className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <Label htmlFor={key} className="text-slate-700 font-medium">
                              {inputConfig.label}
                              {inputConfig.unit && inputConfig.unit[unitsMode] && (
                                <span className="text-slate-400 font-normal ms-1">({inputConfig.unit[unitsMode]})</span>
                              )}
                            </Label>
                            {tooltips[key] && (
                              <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent side="right" className="max-w-xs">
                                  <p className="text-xs">{tooltips[key]}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          {isDropdown && dropdownOptions[key] ? (
                            <Select value={inputs[key] || ''} onValueChange={(value) => handleInputChange(key, value)}>
                              <SelectTrigger className="text-base sm:text-lg">
                                <SelectValue placeholder={`${language === 'ar' ? 'اختر' : 'Select'} ${inputConfig.label}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {dropdownOptions[key].map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div>
                              <Input
                                id={key}
                                type="number"
                                value={inputs[key] || ''}
                                onChange={(e) => handleInputChange(key, e.target.value)}
                                className={`text-base sm:text-lg transition-all ${
                                  inputErrors[key] ? 'border-red-300 focus-visible:ring-red-500'
                                  : inputs[key] && !inputErrors[key] ? 'border-emerald-300 focus-visible:ring-emerald-500' : ''
                                }`}
                                placeholder={`${language === 'ar' ? 'أدخل' : 'Enter'} ${inputConfig.label}`}
                              />
                              <AnimatePresence>
                                {inputErrors[key] && (
                                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-xs text-red-600 mt-1">
                                    {inputErrors[key]}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </TooltipProvider>

                  <div className="flex gap-2 sm:gap-3 pt-4">
                    <Button
                      onClick={handleCalculate}
                      disabled={isCalculating || Object.keys(inputErrors).length > 0}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      size="lg"
                    >
                      {isCalculating ? (
                        <><Loader2 className="w-4 h-4 sm:w-5 sm:h-5 me-2 animate-spin" />{language === 'ar' ? 'جاري الحساب...' : 'Calculating...'}</>
                      ) : (
                        <><Calculator className="w-4 h-4 sm:w-5 sm:h-5 me-2" />{t('common.calculate')}</>
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleReset} disabled={isCalculating} size="lg" className="px-3 sm:px-4 transition-all hover:scale-105 active:scale-95">
                      <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isCalculating ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Calculating Indicator */}
              <AnimatePresence>
                {isCalculating && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <Card className="shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                      <CardContent className="p-6 text-center">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-3" />
                        <p className="text-lg font-semibold text-blue-900 mb-1">{language === 'ar' ? 'جاري الحساب...' : 'Calculating...'}</p>
                        <p className="text-sm text-blue-600">{language === 'ar' ? 'الرجاء الانتظار' : 'Please wait'}</p>
                        <div className="mt-4 w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                          <motion.div className="h-full bg-blue-600" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 0.6, ease: "easeInOut" }} />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results Card */}
              {hasCalculated && results && !isCalculating && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="results-card">
                  <Card className={`shadow-lg border-2 ${
                    results.errors && results.errors.length > 0
                      ? 'border-red-200 bg-gradient-to-br from-red-50 to-pink-50'
                      : 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50'
                  }`}>
                    <CardHeader className={`border-b ${results.errors && results.errors.length > 0 ? 'border-red-100' : 'border-emerald-100'}`}>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className={`flex items-center gap-2 ${results.errors && results.errors.length > 0 ? 'text-red-800' : 'text-emerald-800'}`}>
                          {results.errors && results.errors.length > 0 ? (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                              <AlertTriangle className="w-5 h-5" />
                            </motion.div>
                          ) : (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}>
                              <CheckCircle className="w-5 h-5" />
                            </motion.div>
                          )}
                          {results.errors && results.errors.length > 0
                            ? (language === 'ar' ? 'خطأ في المدخلات' : 'Input Error')
                            : t('common.results')
                          }
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {(!results.errors || results.errors.length === 0) && (
                            <ShareButton title={config?.title} results={results} slug={slug} />
                          )}
                          {config?.version && (
                            <Badge variant="outline" className="bg-white/50">v{config.version}</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 space-y-4">
                      {results.errors && results.errors.length > 0 && (
                        <div className="space-y-2">
                          {results.errors.map((error, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="flex gap-3 p-3 bg-red-100 border border-red-200 rounded-lg">
                              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-red-900">{error}</p>
                                <p className="text-xs text-red-700 mt-1">{language === 'ar' ? 'تحقق من القيمة المدخلة وحاول مرة أخرى' : 'Please check the input value and try again'}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                      {results.warnings && results.warnings.length > 0 && (
                        <div className="space-y-2">
                          {results.warnings.map((warning, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-amber-900">{warning}</p>
                            </motion.div>
                          ))}
                        </div>
                      )}
                      {(!results.errors || results.errors.length === 0) && config.outputs && Object.entries(config.outputs).map(([key, outputConfig], index) => (
                        <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1 }}
                          className={`flex justify-between items-center py-3 ${index < Object.keys(config.outputs).length - 1 ? 'border-b border-emerald-100' : ''}`}
                        >
                          <span className="text-sm sm:text-base text-slate-600">{outputConfig.label}</span>
                          <div className="text-end">
                            <span className="text-lg sm:text-xl font-bold text-emerald-700">{results.outputs[key] ?? '-'}</span>
                            {outputConfig.unit && outputConfig.unit[unitsMode] && (
                              <span className="text-xs sm:text-sm text-slate-500 ms-1">{outputConfig.unit[unitsMode]}</span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Suggested Calculations */}
              <SuggestedCalculations currentSlug={slug} trade={trade} />

            </div>
          </div>

          {/* Content Panel */}
          <div className="lg:col-span-2 space-y-8">
            <HowItWorksCard calculatorSlug={slug} />

            <Card className="shadow-md">
              <CardContent className="p-8">
                <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-table:text-sm">
                  <ReactMarkdown>{config.introContent}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {config.workedExample && (
              <WorkedExample
                inputs={config.workedExample.inputs}
                outputs={config.workedExample.outputs}
                inputLabels={config.inputs ? Object.fromEntries(Object.entries(config.inputs).map(([k, v]) => [k, v.label])) : {}}
                outputLabels={config.outputs ? Object.fromEntries(Object.entries(config.outputs).map(([k, v]) => [k, v.label])) : {}}
                description={config.workedExample.description}
              />
            )}

            {config.assumptions && <AssumptionsSection items={config.assumptions} />}

            {config.faq && <FAQSection items={config.faq} />}

            {relatedSlugs.length > 0 && <RelatedCalculators slugs={relatedSlugs} trade={trade} />}

            <div className="pt-8">
              <Link to={createPageUrl('CategoryPage') + `?lang=${language}&trade=${trade}`}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Arrow className="w-5 h-5 me-2 rotate-180" />
                  {t('common.backToCategory')} {t(`nav.${trade}`)}
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}