import React, { useEffect } from 'react';
import { useLanguage } from '../components/i18n/LanguageContext';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  const { language, t } = useLanguage();
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
      title: "سياسة الخصوصية",
      lastUpdated: "آخر تحديث: يناير 2025",
      sections: [
        {
          title: "المقدمة",
          text: "نحن في موقع حاسبات MEP نلتزم بحماية خصوصيتك. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك عند استخدام موقعنا."
        },
        {
          title: "المعلومات التي نجمعها",
          text: "نجمع معلومات محدودة تشمل:\n• بيانات الاستخدام (الصفحات المزارة، وقت الزيارة)\n• معلومات الجهاز (نوع المتصفح، نظام التشغيل)\n• عنوان IP بشكل مجهول\n\nلا نجمع أي معلومات شخصية حساسة مثل الأسماء أو عناوين البريد الإلكتروني ما لم تقدمها طوعاً."
        },
        {
          title: "كيف نستخدم المعلومات",
          text: "نستخدم المعلومات المجمعة لـ:\n• تحسين تجربة المستخدم\n• تحليل أداء الموقع\n• تطوير الحاسبات والميزات\n• ضمان أمان الموقع"
        },
        {
          title: "ملفات تعريف الارتباط (Cookies)",
          text: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك. يمكنك تعطيلها من إعدادات المتصفح، لكن بعض ميزات الموقع قد لا تعمل بشكل صحيح."
        },
        {
          title: "مشاركة المعلومات",
          text: "لا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة، باستثناء:\n• عند الضرورة القانونية\n• مع مزودي خدمات التحليلات (مثل Google Analytics) بشكل مجهول"
        },
        {
          title: "أمن المعلومات",
          text: "نتخذ إجراءات أمنية معقولة لحماية معلوماتك، بما في ذلك استخدام بروتوكول HTTPS وتشفير البيانات."
        },
        {
          title: "التغييرات على السياسة",
          text: "قد نحدث هذه السياسة من وقت لآخر. سننشر أي تغييرات على هذه الصفحة مع تحديث تاريخ 'آخر تحديث'."
        },
        {
          title: "اتصل بنا",
          text: "إذا كانت لديك أسئلة حول سياسة الخصوصية، يرجى التواصل معنا."
        }
      ]
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: January 2025",
      sections: [
        {
          title: "Introduction",
          text: "At MEP Calculators, we are committed to protecting your privacy. This policy explains how we collect, use, and protect your information when using our website."
        },
        {
          title: "Information We Collect",
          text: "We collect limited information including:\n• Usage data (pages visited, visit duration)\n• Device information (browser type, operating system)\n• Anonymized IP address\n\nWe do not collect sensitive personal information such as names or email addresses unless voluntarily provided."
        },
        {
          title: "How We Use Information",
          text: "We use collected information to:\n• Improve user experience\n• Analyze website performance\n• Develop calculators and features\n• Ensure website security"
        },
        {
          title: "Cookies",
          text: "We use cookies to enhance your experience. You can disable them in browser settings, but some website features may not work properly."
        },
        {
          title: "Information Sharing",
          text: "We do not sell or share your personal information with third parties, except:\n• When legally required\n• With analytics providers (such as Google Analytics) in anonymized form"
        },
        {
          title: "Information Security",
          text: "We take reasonable security measures to protect your information, including using HTTPS protocol and data encryption."
        },
        {
          title: "Policy Changes",
          text: "We may update this policy from time to time. We will post any changes on this page with an updated 'Last Updated' date."
        },
        {
          title: "Contact Us",
          text: "If you have questions about the privacy policy, please contact us."
        }
      ]
    }
  };

  const c = content[language] || content.en;

  const breadcrumbItems = [
    { label: t('nav.privacy') }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">{c.title}</h1>
              <p className="text-slate-300">{c.lastUpdated}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="p-8 space-y-8">
            {c.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <h2 className="text-xl font-semibold text-slate-900 mb-3">{section.title}</h2>
                <div className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {section.text}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}