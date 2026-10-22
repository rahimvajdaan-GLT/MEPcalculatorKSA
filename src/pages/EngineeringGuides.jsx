import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../components/i18n/LanguageContext';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Wind, Droplets, Flame, Cpu, BookOpen, Search, Clock, ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const tradeColors = {
  hvac:         { bg: 'from-blue-500 to-cyan-500',    badge: 'bg-blue-100 text-blue-700' },
  plumbing:     { bg: 'from-teal-500 to-emerald-500', badge: 'bg-teal-100 text-teal-700' },
  firefighting: { bg: 'from-red-500 to-orange-500',   badge: 'bg-red-100 text-red-700' },
  electrical:   { bg: 'from-amber-500 to-yellow-500', badge: 'bg-amber-100 text-amber-700' },
  general:      { bg: 'from-slate-500 to-slate-600',  badge: 'bg-slate-100 text-slate-700' },
};

const tradeIcons = { hvac: Wind, plumbing: Droplets, firefighting: Flame, electrical: Cpu, general: Layers };

const TRADES = ['all', 'hvac', 'plumbing', 'firefighting', 'electrical', 'general'];

export default function EngineeringGuides() {
  const { language, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [search, setSearch] = useState('');
  const [activeTrade, setActiveTrade] = useState('all');

  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang') || language;

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.title = lang === 'ar'
      ? 'أدلة هندسية | حاسبة MEP'
      : 'Engineering Guides | MEP Calculator';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = lang === 'ar'
      ? 'أدلة هندسية تقنية شاملة لأنظمة التكييف والسباكة ومكافحة الحريق والكهرباء في المشاريع السعودية.'
      : 'Comprehensive technical engineering guides for HVAC, plumbing, firefighting, and electrical systems in Saudi projects.';
  }, [lang]);

  const { data: guides = [], isLoading } = useQuery({
    queryKey: ['engineeringGuides'],
    queryFn: () => base44.entities.EngineeringGuide.filter({ status: 'published' }),
    staleTime: 1000 * 60 * 5,
  });

  const filtered = guides.filter(g => {
    const title = lang === 'ar' ? g.title_ar : g.title_en;
    const intro = lang === 'ar' ? g.intro_ar : g.intro_en;
    const matchSearch = !search || title?.toLowerCase().includes(search.toLowerCase()) || intro?.toLowerCase().includes(search.toLowerCase());
    const matchTrade = activeTrade === 'all' || g.trade === activeTrade;
    return matchSearch && matchTrade;
  }).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const tradeLabel = (key) => {
    const labels = {
      all:          { ar: 'الكل',          en: 'All' },
      hvac:         { ar: 'تكييف',         en: 'HVAC' },
      plumbing:     { ar: 'سباكة',         en: 'Plumbing' },
      firefighting: { ar: 'حريق',          en: 'Fire' },
      electrical:   { ar: 'كهرباء',        en: 'Electrical' },
      general:      { ar: 'عام',           en: 'General' },
    };
    return labels[key]?.[lang] ?? key;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {lang === 'ar' ? 'أدلة هندسية' : 'Engineering Guides'}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {lang === 'ar'
                ? 'مقالات تقنية متعمقة لمهندسي MEP في المشاريع السعودية'
                : 'In-depth technical articles for MEP engineers working on Saudi projects'}
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path fill="#f8fafc" d="M0,40 C360,60 720,20 1440,40 L1440,60 L0,60 Z" /></svg>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث في الأدلة...' : 'Search guides...'}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {TRADES.map(t => (
              <button
                key={t}
                onClick={() => setActiveTrade(t)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  activeTrade === t
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                }`}
              >
                {tradeLabel(t)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              {lang === 'ar' ? 'لا توجد أدلة منشورة حالياً' : 'No guides published yet'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((guide, i) => {
                const title = lang === 'ar' ? guide.title_ar : guide.title_en;
                const intro = lang === 'ar' ? guide.intro_ar : guide.intro_en;
                const colors = tradeColors[guide.trade] || tradeColors.general;
                const Icon = tradeIcons[guide.trade] || Layers;
                return (
                  <motion.div key={guide.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link to={createPageUrl('EngineeringGuideDetail') + `?lang=${lang}&slug=${guide.slug}`}>
                      <Card className="h-full group hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-emerald-300">
                        {guide.coverImage && (
                          <div className="h-40 overflow-hidden rounded-t-lg">
                            <img src={guide.coverImage} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                        )}
                        {!guide.coverImage && (
                          <div className={`h-24 bg-gradient-to-br ${colors.bg} rounded-t-lg flex items-center justify-center`}>
                            <Icon className="w-10 h-10 text-white/70" />
                          </div>
                        )}
                        <CardContent className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>
                              {tradeLabel(guide.trade)}
                            </span>
                            {guide.readingTimeMinutes && (
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {guide.readingTimeMinutes} {lang === 'ar' ? 'دقيقة' : 'min'}
                              </span>
                            )}
                          </div>
                          <h2 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-2 line-clamp-2">
                            {title}
                          </h2>
                          {intro && <p className="text-sm text-slate-500 line-clamp-3">{intro}</p>}
                          <div className="mt-4 flex items-center gap-1 text-emerald-600 text-sm font-medium">
                            {lang === 'ar' ? 'اقرأ المزيد' : 'Read more'}
                            <Arrow className="w-4 h-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}