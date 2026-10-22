import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ruler, ArrowLeftRight, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function UnitToggle({ value, onChange }) {
  const { t, language } = useLanguage();
  const { updateUnitsMode } = useUserPreferences();

  const handleChange = (newValue) => {
    if (newValue !== value) {
      onChange(newValue);
      updateUnitsMode(newValue); // persist to user preferences
      toast.success(
        language === 'ar' 
          ? `تم التبديل إلى ${newValue === 'metric' ? 'النظام المتري' : 'النظام الإمبراطوري'}`
          : `Switched to ${newValue === 'metric' ? 'Metric' : 'Imperial'} units`
      );
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shadow-sm">
        <Button
          variant={value === 'metric' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleChange('metric')}
          className={`flex items-center gap-1.5 px-3 transition-all ${
            value === 'metric' 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Ruler className="w-3.5 h-3.5" />
          <span className="font-medium">{t('common.metric')}</span>
          {value === 'metric' && (
            <Badge variant="secondary" className="ml-1 bg-emerald-500 text-white text-[10px] px-1 py-0">
              {language === 'ar' ? 'نشط' : 'Active'}
            </Badge>
          )}
        </Button>
        
        <div className="px-1">
          <ArrowLeftRight className="w-3 h-3 text-slate-400" />
        </div>
        
        <Button
          variant={value === 'imperial' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleChange('imperial')}
          className={`flex items-center gap-1.5 px-3 transition-all ${
            value === 'imperial' 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Ruler className="w-3.5 h-3.5" />
          <span className="font-medium">{t('common.imperial')}</span>
          {value === 'imperial' && (
            <Badge variant="secondary" className="ml-1 bg-emerald-500 text-white text-[10px] px-1 py-0">
              {language === 'ar' ? 'نشط' : 'Active'}
            </Badge>
          )}
        </Button>
      </div>
      
      {/* Unit Examples Tooltip */}
      <div className="absolute top-full mt-2 left-0 right-0 z-10 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
        <div className="bg-slate-800 text-white text-xs rounded-lg p-2 shadow-lg">
          <p className="font-semibold mb-1">
            {value === 'metric' 
              ? (language === 'ar' ? 'الوحدات المترية:' : 'Metric units:') 
              : (language === 'ar' ? 'الوحدات الإمبراطورية:' : 'Imperial units:')}
          </p>
          <p className="text-slate-300">
            {value === 'metric'
              ? 'm, kg, L, °C, kPa'
              : 'ft, lb, gal, °F, psi'}
          </p>
        </div>
      </div>
    </div>
  );
}