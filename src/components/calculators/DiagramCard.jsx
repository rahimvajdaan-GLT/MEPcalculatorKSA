import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DiagramCard({ title, svgMarkup, altText, caption }) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Lazy load diagram when it comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('diagram-card');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);
  
  return (
    <motion.div
      id="diagram-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Info className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {caption && (
            <p className="text-sm text-slate-600 mb-4">
              {caption}
            </p>
          )}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            {isVisible ? (
              <div 
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
                role="img"
                aria-label={altText}
                className="w-full"
              />
            ) : (
              <div className="w-full h-48 bg-slate-100 animate-pulse rounded" />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}