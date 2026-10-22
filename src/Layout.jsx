import React, { useEffect } from 'react';
import { LanguageProvider } from './components/i18n/LanguageContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DisclaimerBanner from './components/layout/DisclaimerBanner';

export default function Layout({ children, currentPageName }) {
  // Set initial language from URL or default to Arabic
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang') || 'ar';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Set meta tags for SEO
    document.title = lang === 'ar' 
      ? 'حاسبة MEP'
      : 'MEP Calculator';

    // Set per-page canonical URL (production domain + current path)
    const canonicalUrl = `https://mepcalculatorsksa.org${window.location.pathname}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Add Google Analytics
    if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-9CJ09RZMSS';
      document.head.appendChild(script);

      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-9CJ09RZMSS');
      };
    }
  }, [currentPageName]);

  // Determine trade from URL for disclaimer
  const params = new URLSearchParams(window.location.search);
  const trade = params.get('trade') || null;

  return (
    <LanguageProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap');
        
        :root {
          --font-sans: 'Inter', 'Tajawal', system-ui, sans-serif;
        }
        
        body {
          font-family: var(--font-sans);
        }
        
        [dir="rtl"] {
          font-family: 'Tajawal', 'Inter', system-ui, sans-serif;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <div className="min-h-screen flex flex-col bg-slate-50">
        <DisclaimerBanner trade={trade} />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}