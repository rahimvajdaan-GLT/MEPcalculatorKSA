import React, { useEffect } from 'react';
import { useLanguage } from '../components/i18n/LanguageContext';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TermsPage() {
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
      title: "الشروط والأحكام",
      lastUpdated: "آخر تحديث: يناير 2025",
      sections: [
        {
          title: "قبول الشروط",
          text: "باستخدام موقع حاسبات MEP، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع."
        },
        {
          title: "طبيعة الخدمة",
          text: "يوفر موقع حاسبات MEP أدوات حسابية للمهندسين في مجالات التكييف والسباكة ومكافحة الحريق. جميع الحسابات المقدمة هي تقديرات أولية للأغراض المرجعية فقط."
        },
        {
          title: "إخلاء المسؤولية الهندسية",
          text: "تنبيه مهم:\n\n• جميع النتائج هي تقديرات أولية وليست تصاميم نهائية\n• يجب التحقق من جميع الحسابات بواسطة مهندس مرخص\n• لا يغني استخدام هذه الحاسبات عن الخبرة الهندسية\n• يجب مراجعة النتائج وفقاً لكود البناء السعودي ومتطلبات الدفاع المدني\n• المستخدم مسؤول بالكامل عن التحقق من صحة النتائج قبل تطبيقها"
        },
        {
          title: "حدود المسؤولية",
          text: "لا يتحمل موقع حاسبات MEP أي مسؤولية عن:\n\n• أي أخطاء في الحسابات أو النتائج\n• أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام الموقع\n• أي قرارات هندسية تستند إلى نتائج الحاسبات\n• أي خسائر مادية أو إصابات ناتجة عن استخدام النتائج"
        },
        {
          title: "المعايير والمراجع",
          text: "تستند الحاسبات إلى معايير دولية ومحلية معترف بها، بما في ذلك:\n\n• ASHRAE و SMACNA (التكييف)\n• IPC و UPC (السباكة)\n• NFPA (مكافحة الحريق)\n• كود البناء السعودي (SBC)\n\nومع ذلك، قد تكون هناك تحديثات في هذه المعايير لم تُدرج بعد في الحاسبات."
        },
        {
          title: "الملكية الفكرية",
          text: "جميع المحتويات على هذا الموقع، بما في ذلك النصوص والرسومات والحاسبات، محمية بموجب قوانين حقوق الملكية الفكرية. لا يجوز نسخ أو توزيع أي محتوى دون إذن كتابي مسبق."
        },
        {
          title: "استخدام الموقع",
          text: "يوافق المستخدم على:\n\n• استخدام الموقع للأغراض المشروعة فقط\n• عدم محاولة الوصول غير المصرح به إلى أنظمة الموقع\n• عدم إساءة استخدام الحاسبات أو تحميل الخادم بشكل مفرط\n• احترام حقوق الملكية الفكرية"
        },
        {
          title: "التعديلات",
          text: "يحتفظ موقع حاسبات MEP بالحق في:\n\n• تعديل هذه الشروط في أي وقت\n• تحديث أو إزالة أي حاسبة\n• تغيير أو إيقاف أي ميزة من الموقع\n\nسيتم إخطار المستخدمين بالتغييرات الجوهرية."
        },
        {
          title: "القانون المعمول به",
          text: "تخضع هذه الشروط لقوانين المملكة العربية السعودية وتفسر وفقاً لها."
        },
        {
          title: "اتصل بنا",
          text: "إذا كانت لديك أسئلة حول هذه الشروط، يرجى التواصل معنا."
        }
      ]
    },
    en: {
      title: "Terms & Conditions",
      lastUpdated: "Last Updated: January 2025",
      sections: [
        {
          title: "Acceptance of Terms",
          text: "By using MEP Calculators website, you agree to be bound by these terms and conditions. If you do not agree to any of these terms, please do not use the website."
        },
        {
          title: "Nature of Service",
          text: "MEP Calculators website provides calculation tools for engineers in HVAC, plumbing, and fire protection fields. All calculations provided are preliminary estimates for reference purposes only."
        },
        {
          title: "Engineering Disclaimer",
          text: "Important Notice:\n\n• All results are preliminary estimates, not final designs\n• All calculations must be verified by a licensed engineer\n• Use of these calculators does not replace engineering expertise\n• Results must be reviewed per Saudi Building Code and Civil Defense requirements\n• User is fully responsible for verifying results before application"
        },
        {
          title: "Limitation of Liability",
          text: "MEP Calculators website assumes no responsibility for:\n\n• Any errors in calculations or results\n• Any direct or indirect damages from website use\n• Any engineering decisions based on calculator results\n• Any material losses or injuries from using the results"
        },
        {
          title: "Standards and References",
          text: "Calculators are based on recognized international and local standards, including:\n\n• ASHRAE and SMACNA (HVAC)\n• IPC and UPC (Plumbing)\n• NFPA (Fire Protection)\n• Saudi Building Code (SBC)\n\nHowever, there may be updates to these standards not yet incorporated into the calculators."
        },
        {
          title: "Intellectual Property",
          text: "All content on this website, including text, graphics, and calculators, is protected under intellectual property laws. No content may be copied or distributed without prior written permission."
        },
        {
          title: "Website Use",
          text: "User agrees to:\n\n• Use the website for legitimate purposes only\n• Not attempt unauthorized access to website systems\n• Not abuse calculators or overload the server\n• Respect intellectual property rights"
        },
        {
          title: "Modifications",
          text: "MEP Calculators website reserves the right to:\n\n• Modify these terms at any time\n• Update or remove any calculator\n• Change or discontinue any website feature\n\nUsers will be notified of material changes."
        },
        {
          title: "Governing Law",
          text: "These terms are governed by and construed in accordance with the laws of the Kingdom of Saudi Arabia."
        },
        {
          title: "Contact Us",
          text: "If you have questions about these terms, please contact us."
        }
      ]
    }
  };

  const c = content[language] || content.en;

  const breadcrumbItems = [
    { label: t('nav.terms') }
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
              <FileText className="w-8 h-8 text-white" />
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