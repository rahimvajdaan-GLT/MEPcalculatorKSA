import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';

const calculators = [
  { slug: 'voltage-drop', title: 'حساب هبوط الجهد', description: 'حساب انخفاض الجهد في الكابلات' },
  { slug: 'cable-sizing', title: 'حساب مقاس الكابل', description: 'اختيار مقطع الكابل المناسب' },
  { slug: 'breaker-sizing', title: 'حساب مقاس القاطع', description: 'اختيار تيار القاطع' },
  { slug: 'conduit-trunking-fill', title: 'حساب تعبئة المواسير والتراكنج', description: 'نسبة تعبئة الكابلات' },
  { slug: 'short-circuit-level', title: 'حساب تيار القصر', description: 'تيار القصر المتوقع' },
  { slug: 'transformer-sizing', title: 'حساب مقاس المحول', description: 'اختيار سعة المحول' },
  { slug: 'load-schedule-summary', title: 'ملخص جدول الأحمال', description: 'حساب إجمالي الأحمال' }
];

export default function AR_Electrical_Category() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen" dir="rtl">
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-yellow-500 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Cpu className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                  حاسبات الكهرباء
                </h1>
                <p className="text-base sm:text-lg text-white/80">
                  حسابات الكهرباء للمشاريع في المملكة العربية السعودية
                </p>
              </div>
            </div>
            <LanguageSwitcher currentLanguage="ar" targetPage="EN_Electrical_Category" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f8fafc" d="M0,40 C360,60 720,20 1440,40 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      <section className="py-6 sm:py-8 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-slate-600 leading-relaxed">
            حاسبات الكهرباء لفحوصات شائعة وفق منهج IEC المستخدمة في مشاريع السعودية، مثل هبوط الجهد، اختيار مقاس الكابل، نسبة تعبئة المواسير/التراكنج، اختيار القواطع، تيار القصر (مبسط)، واختيار المحول. تُستخدم للتحقق السريع والتنسيق، ثم يتم الاعتماد النهائي حسب الدراسات التفصيلية ومواصفات المشروع.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl font-bold text-slate-900">جميع الحاسبات</h2>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              {calculators.length} حاسبة
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {calculators.map((calc, index) => (
              <motion.div
                key={calc.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-amber-300"
                  onClick={() => navigate(createPageUrl('CalculatorPage') + `?slug=${calc.slug}&trade=electrical&lang=ar`)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-white" />
                      </div>
                      {calc.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-sm">{calc.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}