import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../components/i18n/LanguageContext';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, ArrowRight, ArrowLeftRight, Wind, Droplets, Ruler, 
  Gauge, Zap, Thermometer, Activity, Square, Box, Maximize, 
  TrendingUp, Sun, Search, Calculator
} from 'lucide-react';
import { motion } from 'framer-motion';
import ConverterInlinePanel from '../components/converters/ConverterInlinePanel';
import ElectricalMiniCalculator from '../components/converters/ElectricalMiniCalculator';

const categoryIcons = {
  flow: Droplets,
  pressure: Gauge,
  length: Ruler,
  area: Square,
  volume: Box,
  velocity: TrendingUp,
  temperature: Thermometer,
  power: Zap,
  energy: Activity,
  electrical: Activity,
  lighting: Sun
};

const categoryColors = {
  flow: 'from-teal-500 to-emerald-500',
  pressure: 'from-blue-500 to-cyan-500',
  length: 'from-purple-500 to-pink-500',
  area: 'from-violet-500 to-purple-500',
  volume: 'from-indigo-500 to-blue-500',
  velocity: 'from-green-500 to-teal-500',
  temperature: 'from-orange-500 to-red-500',
  power: 'from-yellow-500 to-amber-500',
  energy: 'from-amber-500 to-orange-500',
  electrical: 'from-cyan-500 to-blue-500',
  lighting: 'from-yellow-400 to-orange-400'
};

export default function UnitConverterHub() {
  const { language, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCard, setExpandedCard] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang') || language;

  // Fetch data from database
  const { data: converterCards = [], isLoading: loadingCards } = useQuery({
    queryKey: ['converterCards'],
    queryFn: () => base44.entities.ConverterCard.list(),
  });

  const { data: dimensions = [], isLoading: loadingDimensions } = useQuery({
    queryKey: ['unitDimensions'],
    queryFn: () => base44.entities.UnitDimension.list(),
  });

  const { data: units = [], isLoading: loadingUnits } = useQuery({
    queryKey: ['units'],
    queryFn: () => base44.entities.Unit.list(),
  });

  const isLoading = loadingCards || loadingDimensions || loadingUnits;

  // Group cards by dimension
  const cardsByDimension = useMemo(() => {
    if (!converterCards.length || !dimensions.length) return {};
    
    const grouped = {};
    dimensions.forEach(dim => {
      grouped[dim.key] = converterCards
        .filter(card => card.dimensionKey === dim.key)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    });
    return grouped;
  }, [converterCards, dimensions]);

  // Filter cards based on search and category
  const filteredCards = useMemo(() => {
    let filtered = converterCards;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(card => card.dimensionKey === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(card => {
        const title = lang === 'ar' ? card.titleAr : card.titleEn;
        const keywords = lang === 'ar' ? card.keywordsAr : card.keywordsEn;
        return title.toLowerCase().includes(query) || 
               (keywords && keywords.toLowerCase().includes(query));
      });
    }

    return filtered;
  }, [converterCards, selectedCategory, searchQuery, lang]);

  // Set language direction and page title
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    document.title = lang === 'ar' 
      ? 'مركز تحويل الوحدات الهندسية | MEP Calculators'
      : 'MEP Unit Conversion Center | MEP Calculators';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = lang === 'ar'
      ? 'مركز شامل لتحويل الوحدات الهندسية - التدفق، الضغط، الطول، المساحة، الحجم، السرعة، الحرارة، القدرة، الطاقة، الكهرباء، والإضاءة'
      : 'Complete MEP unit conversion center - flow, pressure, length, area, volume, velocity, temperature, power, energy, electrical, and lighting conversions';
  }, [lang]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <ArrowLeftRight className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {lang === 'ar' ? 'مركز تحويل الوحدات الهندسية' : 'MEP Unit Conversion Center'}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl">
              {lang === 'ar' 
                ? 'مكتبة شاملة لتحويل الوحدات الهندسية - التدفق، الضغط، الطول، المساحة، الحجم، السرعة، الحرارة، القدرة، الطاقة، الكهرباء، والإضاءة'
                : 'Comprehensive MEP unit conversion library - flow, pressure, length, area, volume, velocity, temperature, power, energy, electrical, and lighting'}
            </p>
          </motion.div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f8fafc" d="M0,40 C360,60 720,20 1440,40 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* SEO Intro Content */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed">
              {lang === 'ar' 
                ? 'مركز تحويل الوحدات الهندسية الشامل يوفر لك أدوات سريعة ودقيقة لتحويل جميع الوحدات المستخدمة في مشاريع MEP (التكييف، السباكة، مكافحة الحريق، والكهرباء). يشمل المركز محولات التدفق (L/min, m³/h, GPM)، الضغط (bar, kPa, psi)، الطول والمساحة والحجم، السرعة، درجة الحرارة، القدرة والطاقة، بالإضافة إلى حاسبات كهربائية خاصة لتحويل kW ↔ A، kVA ↔ A، وkW ↔ kVA. جميع المحولات تدعم أنظمة الوحدات المترية والإمبراطورية مع نتائج دقيقة ونسخ سريع.'
                : 'This comprehensive MEP Unit Conversion Center provides quick and accurate tools for converting all units used in MEP projects (HVAC, Plumbing, Firefighting, Electrical). The center includes flow converters (L/min, m³/h, GPM), pressure (bar, kPa, psi), length/area/volume, velocity, temperature, power and energy, plus special electrical calculators for kW ↔ A, kVA ↔ A, and kW ↔ kVA conversions. All converters support both metric and imperial units with precise results and quick copy functionality.'}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6 sm:py-8 bg-slate-100 border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder={lang === 'ar' ? 'ابحث عن محول...' : 'Search converters...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg bg-white"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="overflow-x-auto">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="inline-flex h-auto p-1 bg-white shadow-sm">
                <TabsTrigger value="all" className="px-4 py-2">
                  {lang === 'ar' ? 'الكل' : 'All'}
                  <Badge variant="secondary" className="ml-2">{converterCards.length}</Badge>
                </TabsTrigger>
                {dimensions
                  .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                  .map(dim => {
                    const Icon = categoryIcons[dim.key];
                    const count = cardsByDimension[dim.key]?.length || 0;
                    return (
                      <TabsTrigger key={dim.key} value={dim.key} className="px-4 py-2">
                        {Icon && <Icon className="w-4 h-4 mr-2" />}
                        {lang === 'ar' ? dim.nameAr : dim.nameEn}
                        <Badge variant="secondary" className="ml-2">{count}</Badge>
                      </TabsTrigger>
                    );
                  })}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Converter Cards */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <p className="text-slate-500 mt-4">
                {lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </p>
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">
                {lang === 'ar' ? 'لم يتم العثور على محولات' : 'No converters found'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-emerald-600 hover:text-emerald-700"
                >
                  {lang === 'ar' ? 'مسح البحث' : 'Clear search'}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((card, index) => {
                const dimension = dimensions.find(d => d.key === card.dimensionKey);
                const Icon = categoryIcons[card.dimensionKey] || ArrowLeftRight;
                const gradient = categoryColors[card.dimensionKey] || 'from-slate-500 to-slate-600';
                const title = lang === 'ar' ? card.titleAr : card.titleEn;
                const desc = lang === 'ar' ? card.descAr : card.descEn;
                
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full group hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-emerald-300">
                      <CardContent className="p-5">
                        <div 
                          className="flex items-start gap-3 mb-3 cursor-pointer"
                          onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                        >
                          <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors mb-1">
                              {title}
                            </h3>
                            {desc && (
                              <p className="text-xs text-slate-500">{desc}</p>
                            )}
                          </div>
                        </div>
                        
                        {expandedCard === card.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-slate-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {card.isSpecial ? (
                              <ElectricalMiniCalculator card={card} language={lang} />
                            ) : (
                              <ConverterInlinePanel card={card} units={units} language={lang} />
                            )}
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Link to MEP Calculators */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            {lang === 'ar' ? 'تحتاج حسابات هندسية متقدمة؟' : 'Need Advanced Engineering Calculations?'}
          </h3>
          <p className="text-slate-600 mb-6">
            {lang === 'ar' 
              ? 'استخدم حاسبات MEP الاحترافية لحسابات الدكت، المواسير، الكابلات والمزيد'
              : 'Use our professional MEP calculators for duct sizing, pipe sizing, cable sizing, and more'
            }
          </p>
          <Link to={createPageUrl('Home') + `?lang=${lang}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              <Calculator className="w-5 h-5 inline-block mr-2" />
              {lang === 'ar' ? 'تصفح حاسبات MEP' : 'Browse MEP Calculators'}
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
}