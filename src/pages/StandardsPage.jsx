import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../components/i18n/LanguageContext';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Building, Shield, FileText, ExternalLink, 
  CheckCircle, AlertTriangle, Info, Scale, Wind, Droplets, Flame, Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StandardsPage() {
  const { language, isRTL, t } = useLanguage();

  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    const lang = params.get('lang');
    if (lang && (lang === 'ar' || lang === 'en')) {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }, []);

  const content = {
    ar: {
      title: "المعايير والمراجع",
      subtitle: "الأسس الهندسية والمعايير المستخدمة في الحاسبات",
      sections: {
        hvac: {
          title: "معايير التكييف والتهوية",
          standards: [
            { name: "ASHRAE Handbook - Fundamentals", desc: "المرجع الأساسي لحسابات التكييف والتهوية" },
            { name: "ASHRAE Standard 62.1", desc: "معايير جودة الهواء الداخلي والتهوية" },
            { name: "SMACNA HVAC Duct Construction", desc: "معايير تصنيع وتركيب مجاري الهواء" },
            { name: "كود البناء السعودي (SBC 601)", desc: "متطلبات التكييف والتهوية للمباني في المملكة" }
          ]
        },
        plumbing: {
          title: "معايير السباكة",
          standards: [
            { name: "International Plumbing Code (IPC)", desc: "الكود الدولي للسباكة" },
            { name: "Uniform Plumbing Code (UPC)", desc: "الكود الموحد للسباكة" },
            { name: "ASPE Data Books", desc: "مراجع الجمعية الأمريكية لمهندسي السباكة" },
            { name: "كود البناء السعودي (SBC 501)", desc: "متطلبات السباكة للمباني في المملكة" }
          ]
        },
        firefighting: {
          title: "معايير مكافحة الحريق",
          standards: [
            { name: "NFPA 13", desc: "معيار تركيب أنظمة الرشاشات" },
            { name: "NFPA 14", desc: "معيار أنظمة خراطيم الحريق" },
            { name: "NFPA 20", desc: "معيار مضخات الحريق" },
            { name: "متطلبات الدفاع المدني السعودي", desc: "اشتراطات السلامة الوطنية" }
          ]
        },
        electrical: {
          title: "معايير الكهرباء",
          standards: [
            { name: "IEC 60364", desc: "معايير التركيبات الكهربائية" },
            { name: "IEC 60898", desc: "معيار القواطع الكهربائية (MCB)" },
            { name: "IEC 60947", desc: "معيار معدات التوزيع (MCCB)" },
            { name: "كود البناء السعودي (SBC 401)", desc: "متطلبات الكهرباء للمباني في المملكة" }
          ]
        }
      },
      methods: {
        title: "طرق الحساب المستخدمة",
        items: [
          {
            title: "معادلة هازن-ويليامز",
            desc: "تستخدم لحساب فقدان الضغط في أنابيب المياه، خاصة في أنظمة مكافحة الحريق. الصيغة معتمدة من NFPA.",
            formula: "P = 4.52 × Q^1.85 / (C^1.85 × d^4.87)"
          },
          {
            title: "طريقة السرعة المتساوية",
            desc: "تستخدم في تصميم مجاري الهواء لضمان سرعة موحدة وتوزيع متوازن.",
            formula: "A = Q / V"
          },
          {
            title: "طريقة وحدات التركيبات",
            desc: "تحويل متطلبات المياه لكل تركيب صحي إلى قيم موحدة لحساب الأحمال.",
            formula: "Hunter's Curve"
          }
        ]
      },
      assumptions: {
        title: "الافتراضات العامة",
        items: [
          "درجة حرارة الهواء القياسية: 20°C (68°F)",
          "الضغط الجوي القياسي: 101.325 kPa",
          "كثافة الهواء: 1.2 kg/m³",
          "درجة حرارة المياه: 15-25°C",
          "معامل C للأنابيب الجديدة: 120 (حديد أسود)",
          "عوامل الأمان المطبقة حسب الكود"
        ]
      },
      disclaimer: {
        title: "إخلاء المسؤولية",
        text: "جميع الحسابات المقدمة في هذا الموقع هي تقديرات أولية للأغراض التعليمية والمرجعية فقط. يجب على المهندس المسؤول التحقق من جميع الحسابات وفقاً لـ:",
        items: [
          "كود البناء السعودي (SBC) ومتطلباته",
          "متطلبات الدفاع المدني السعودي",
          "مواصفات المشروع المحددة",
          "المعايير الدولية المعمول بها (NFPA, ASHRAE, etc.)",
          "الظروف المحلية والبيئية للموقع"
        ],
        warning: "لا يتحمل الموقع أي مسؤولية عن أي أخطاء أو أضرار ناتجة عن استخدام هذه الحسابات. استشر مهندساً مرخصاً دائماً."
      }
    },
    en: {
      title: "Standards & References",
      subtitle: "Engineering foundations and standards used in calculators",
      sections: {
        hvac: {
          title: "HVAC Standards",
          standards: [
            { name: "ASHRAE Handbook - Fundamentals", desc: "Primary reference for HVAC calculations" },
            { name: "ASHRAE Standard 62.1", desc: "Indoor air quality and ventilation standards" },
            { name: "SMACNA HVAC Duct Construction", desc: "Duct fabrication and installation standards" },
            { name: "Saudi Building Code (SBC 601)", desc: "HVAC requirements for buildings in the Kingdom" }
          ]
        },
        plumbing: {
          title: "Plumbing Standards",
          standards: [
            { name: "International Plumbing Code (IPC)", desc: "International plumbing code" },
            { name: "Uniform Plumbing Code (UPC)", desc: "Unified plumbing code" },
            { name: "ASPE Data Books", desc: "American Society of Plumbing Engineers references" },
            { name: "Saudi Building Code (SBC 501)", desc: "Plumbing requirements for buildings in the Kingdom" }
          ]
        },
        firefighting: {
          title: "Fire Protection Standards",
          standards: [
            { name: "NFPA 13", desc: "Standard for Sprinkler System Installation" },
            { name: "NFPA 14", desc: "Standard for Standpipe and Hose Systems" },
            { name: "NFPA 20", desc: "Standard for Fire Pumps" },
            { name: "Saudi Civil Defense Requirements", desc: "National safety requirements" }
          ]
        },
        electrical: {
          title: "Electrical Standards",
          standards: [
            { name: "IEC 60364", desc: "Electrical installations standards" },
            { name: "IEC 60898", desc: "Circuit breakers standard (MCB)" },
            { name: "IEC 60947", desc: "Distribution equipment standard (MCCB)" },
            { name: "Saudi Building Code (SBC 401)", desc: "Electrical requirements for buildings in the Kingdom" }
          ]
        }
      },
      methods: {
        title: "Calculation Methods Used",
        items: [
          {
            title: "Hazen-Williams Equation",
            desc: "Used to calculate pressure loss in water pipes, especially in fire protection systems. Formula approved by NFPA.",
            formula: "P = 4.52 × Q^1.85 / (C^1.85 × d^4.87)"
          },
          {
            title: "Equal Velocity Method",
            desc: "Used in duct design to ensure uniform velocity and balanced distribution.",
            formula: "A = Q / V"
          },
          {
            title: "Fixture Unit Method",
            desc: "Converting water requirements for each fixture into unified values for load calculations.",
            formula: "Hunter's Curve"
          }
        ]
      },
      assumptions: {
        title: "General Assumptions",
        items: [
          "Standard air temperature: 20°C (68°F)",
          "Standard atmospheric pressure: 101.325 kPa",
          "Air density: 1.2 kg/m³",
          "Water temperature: 15-25°C (60-77°F)",
          "C factor for new pipes: 120 (black steel)",
          "Safety factors applied per code requirements"
        ]
      },
      disclaimer: {
        title: "Disclaimer",
        text: "All calculations provided on this website are preliminary estimates for educational and reference purposes only. The responsible engineer must verify all calculations according to:",
        items: [
          "Saudi Building Code (SBC) and its requirements",
          "Saudi Civil Defense requirements",
          "Specific project specifications",
          "Applicable international standards (NFPA, ASHRAE, etc.)",
          "Local and environmental site conditions"
        ],
        warning: "This website assumes no responsibility for any errors or damages resulting from the use of these calculations. Always consult a licensed engineer."
      }
    }
  };

  const c = content[language] || content.en;

  const breadcrumbItems = [
    { label: t('nav.standards') }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                {c.title}
              </h1>
              <p className="text-lg text-white/80">
                {c.subtitle}
              </p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Standards by Trade */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(c.sections).map(([key, section], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-emerald-600" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {section.standards.map((std, i) => (
                        <li key={i}>
                          <h4 className="font-medium text-slate-900">{std.name}</h4>
                          <p className="text-sm text-slate-500 mt-1">{std.desc}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Calculation Methods */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Scale className="w-6 h-6 text-indigo-600" />
            {c.methods.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {c.methods.items.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-slate-900 mb-2">{method.title}</h3>
                    <p className="text-slate-600 text-sm mb-4">{method.desc}</p>
                    <code className="block bg-slate-100 p-3 rounded-lg text-sm font-mono text-indigo-600">
                      {method.formula}
                    </code>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Assumptions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Info className="w-6 h-6 text-blue-600" />
            {c.assumptions.title}
          </h2>
          <Card>
            <CardContent className="p-6">
              <ul className="grid sm:grid-cols-2 gap-3">
                {c.assumptions.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Design Checks for KSA */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  {language === 'ar' ? 'معايير التصميم للمشاريع السعودية' : 'Design Standards for KSA Projects'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* HVAC Design Checks */}
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                    <Wind className="w-5 h-5 text-blue-600" />
                    {language === 'ar' ? 'التكييف والتهوية (HVAC)' : 'HVAC Systems'}
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-semibold text-slate-700">
                          {language === 'ar' ? 'سرعة الهواء في المجاري:' : 'Duct Air Velocity:'}
                        </span>
                        <p className="text-slate-600">{language === 'ar' ? 'رئيسي: 5-8 م/ث، فرعي: 3-5 م/ث' : 'Main: 5-8 m/s, Branch: 3-5 m/s'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">
                          {language === 'ar' ? 'فقدان الاحتكاك:' : 'Friction Loss:'}
                        </span>
                        <p className="text-slate-600">{language === 'ar' ? '0.5-1.5 باسكال/م' : '0.5-1.5 Pa/m'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">
                          {language === 'ar' ? 'سرعة المياه المبردة:' : 'Chilled Water Velocity:'}
                        </span>
                        <p className="text-slate-600">{language === 'ar' ? '1.5-3.0 م/ث' : '1.5-3.0 m/s'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">
                          {language === 'ar' ? 'فرق درجة الحرارة:' : 'Temperature Difference:'}
                        </span>
                        <p className="text-slate-600">{language === 'ar' ? '5-7 درجة مئوية' : '5-7°C (9-13°F)'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plumbing Design Checks */}
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-teal-600" />
                    {language === 'ar' ? 'السباكة والصرف الصحي' : 'Plumbing & Drainage'}
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-semibold text-slate-700">
                          {language === 'ar' ? 'سرعة مياه الإمداد:' : 'Water Supply Velocity:'}
                        </span>
                        <p className="text-slate-600">{language === 'ar' ? '1.0-2.5 م/ث' : '1.0-2.5 m/s'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">
                          {language === 'ar' ? 'ضغط التشغيل:' : 'Operating Pressure:'}
                        </span>
                        <p className="text-slate-600">{language === 'ar' ? '2-4 بار (20-40 متر)' : '2-4 bar (29-58 psi)'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">
                          {language === 'ar' ? 'سعة التخزين:' : 'Storage Capacity:'}
                        </span>
                        <p className="text-slate-600">{language === 'ar' ? 'سكني: يوم واحد، تجاري: يومان' : 'Residential: 1 day, Commercial: 2 days'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">
                          {language === 'ar' ? 'انحدار أنابيب الصرف:' : 'Drainage Pipe Slope:'}
                        </span>
                        <p className="text-slate-600">{language === 'ar' ? '1-2% كحد أدنى' : '1-2% minimum'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fire Protection Design Checks */}
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-600" />
                    {language === 'ar' ? 'أنظمة مكافحة الحريق' : 'Fire Protection Systems'}
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-semibold text-slate-700">
                          {language === 'ar' ? 'سرعة المياه:' : 'Water Velocity:'}
                        </span>
                        <p className="text-slate-600">{language === 'ar' ? 'حد أقصى 6 م/ث' : 'Max 6 m/s (20 ft/s)'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">
                          {language === 'ar' ? 'ضغط الرشاشات:' : 'Sprinkler Pressure:'}
                        </span>
                        <p className="text-slate-600">{language === 'ar' ? '0.5-1.0 بار (7-15 psi)' : '0.5-1.0 bar (7-15 psi)'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">
                          {language === 'ar' ? 'معدل تدفق صمام الحريق:' : 'Fire Hose Flow Rate:'}
                        </span>
                        <p className="text-slate-600">{language === 'ar' ? '250 لتر/دقيقة/صمام' : '250 L/min per valve'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">
                          {language === 'ar' ? 'معامل هازن ويليامز:' : 'Hazen-Williams C:'}
                        </span>
                        <p className="text-slate-600">{language === 'ar' ? 'جديد: 120، قديم: 100' : 'New: 120, Old: 100'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Electrical Design Checks */}
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-amber-600" />
                    {language === 'ar' ? 'الأنظمة الكهربائية' : 'Electrical Systems'}
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-semibold text-slate-700">
                          {language === 'ar' ? 'انخفاض الجهد:' : 'Voltage Drop:'}
                        </span>
                        <p className="text-slate-600">{language === 'ar' ? 'إنارة: 3%، قوى: 5%' : 'Lighting: 3%, Power: 5%'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">
                          {language === 'ar' ? 'درجة حرارة الكابل:' : 'Cable Temperature:'}
                        </span>
                        <p className="text-slate-600">{language === 'ar' ? 'PVC: 70°C، XLPE: 90°C' : 'PVC: 70°C, XLPE: 90°C'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">
                          {language === 'ar' ? 'السعة القطعية:' : 'Breaking Capacity:'}
                        </span>
                        <p className="text-slate-600">{language === 'ar' ? 'سكني: 6kA، تجاري: 10-25kA' : 'Residential: 6kA, Commercial: 10-25kA'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">
                          {language === 'ar' ? 'معامل التخفيض:' : 'Derating Factor:'}
                        </span>
                        <p className="text-slate-600">{language === 'ar' ? 'حسب التجميع ودرجة الحرارة' : 'Per grouping and temperature'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Safety Factors */}
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    {language === 'ar' ? 'معاملات الأمان والاحتياطيات' : 'Safety Factors & Margins'}
                  </h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2 text-sm">
                    <p className="text-slate-700">
                      <span className="font-semibold">{language === 'ar' ? '• معامل الأمان للمضخات:' : '• Pump Safety Factor:'}</span>
                      {' '}{language === 'ar' ? '10-15% زيادة في السعة' : '10-15% capacity margin'}
                    </p>
                    <p className="text-slate-700">
                      <span className="font-semibold">{language === 'ar' ? '• معامل التزامن:' : '• Diversity Factor:'}</span>
                      {' '}{language === 'ar' ? '0.6-0.8 للأنظمة السكنية' : '0.6-0.8 for residential systems'}
                    </p>
                    <p className="text-slate-700">
                      <span className="font-semibold">{language === 'ar' ? '• احتياطي مكافحة الحريق:' : '• Fire Reserve:'}</span>
                      {' '}{language === 'ar' ? 'حسب NFPA و SBC' : 'Per NFPA & SBC requirements'}
                    </p>
                    <p className="text-slate-700">
                      <span className="font-semibold">{language === 'ar' ? '• فحص الأداء الدوري:' : '• Performance Testing:'}</span>
                      {' '}{language === 'ar' ? 'سنوياً للأنظمة الحرجة' : 'Annually for critical systems'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Disclaimer */}
        <section>
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader className="border-b border-amber-200">
              <CardTitle className="flex items-center gap-3 text-amber-900">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                {c.disclaimer.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-amber-800 mb-4">{c.disclaimer.text}</p>
              <ul className="space-y-2 mb-6">
                {c.disclaimer.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-amber-700">
                    <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-amber-100 border border-amber-300 rounded-lg p-4">
                <p className="text-amber-900 font-medium">{c.disclaimer.warning}</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}