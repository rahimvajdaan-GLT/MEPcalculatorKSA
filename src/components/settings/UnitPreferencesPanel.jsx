import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, RotateCcw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const unitOptions = {
  pressureUnit: {
    label: { ar: 'وحدة الضغط', en: 'Pressure Unit' },
    options: [
      { value: 'kPa', label: 'kPa (Kilopascal)' },
      { value: 'bar', label: 'bar' },
      { value: 'psi', label: 'psi (Pound/in²)' },
      { value: 'mH2O', label: 'mH₂O (Meter water column)' },
      { value: 'Pa', label: 'Pa (Pascal)' },
    ]
  },
  flowUnit: {
    label: { ar: 'وحدة التدفق', en: 'Flow Rate Unit' },
    options: [
      { value: 'L/s', label: 'L/s (Litre/second)' },
      { value: 'L/min', label: 'L/min (Litre/minute)' },
      { value: 'm3/h', label: 'm³/h (Cubic metre/hour)' },
      { value: 'GPM', label: 'GPM (US Gallon/minute)' },
      { value: 'CFM', label: 'CFM (Cubic feet/minute)' },
    ]
  },
  temperatureUnit: {
    label: { ar: 'وحدة الحرارة', en: 'Temperature Unit' },
    options: [
      { value: '°C', label: '°C (Celsius)' },
      { value: '°F', label: '°F (Fahrenheit)' },
      { value: 'K', label: 'K (Kelvin)' },
    ]
  },
  lengthUnit: {
    label: { ar: 'وحدة الطول', en: 'Length Unit' },
    options: [
      { value: 'm', label: 'm (Metre)' },
      { value: 'mm', label: 'mm (Millimetre)' },
      { value: 'cm', label: 'cm (Centimetre)' },
      { value: 'ft', label: 'ft (Feet)' },
      { value: 'in', label: 'in (Inch)' },
    ]
  },
  powerUnit: {
    label: { ar: 'وحدة القدرة', en: 'Power / Cooling Unit' },
    options: [
      { value: 'kW', label: 'kW (Kilowatt)' },
      { value: 'kVA', label: 'kVA (Kilovolt-Ampere)' },
      { value: 'HP', label: 'HP (Horsepower)' },
      { value: 'BTU/h', label: 'BTU/h (British Thermal Unit/hour)' },
      { value: 'TR', label: 'TR (Ton of Refrigeration)' },
      { value: 'MW', label: 'MW (Megawatt)' },
    ]
  },
  velocityUnit: {
    label: { ar: 'وحدة السرعة', en: 'Air / Fluid Velocity Unit' },
    options: [
      { value: 'm/s', label: 'm/s (Metre/second)' },
      { value: 'ft/min', label: 'ft/min (FPM)' },
      { value: 'ft/s', label: 'ft/s (Feet/second)' },
      { value: 'km/h', label: 'km/h (Kilometre/hour)' },
    ]
  },
  electricalVoltage: {
    label: { ar: 'الجهد الافتراضي', en: 'Default Voltage' },
    options: [
      { value: '400', label: '400 V — 3-Phase KSA Standard' },
      { value: '230', label: '230 V — 1-Phase KSA Standard' },
      { value: '415', label: '415 V — 3-Phase (Gulf/UK)' },
      { value: '480', label: '480 V — 3-Phase (US/Canada)' },
      { value: '120', label: '120 V — 1-Phase (US/Canada)' },
      { value: '690', label: '690 V — 3-Phase (Industrial)' },
    ]
  },
};

export default function UnitPreferencesPanel({ onClose }) {
  const { language } = useLanguage();
  const { preferences, updatePreference, updateUnitsMode, resetPreferences } = useUserPreferences();

  const handleUnitsModeChange = (mode) => {
    updateUnitsMode(mode);
    toast.success(
      language === 'ar'
        ? `تم التبديل إلى النظام ${mode === 'metric' ? 'المتري' : 'الإمبراطوري'} وحفظ التفضيلات`
        : `Switched to ${mode === 'metric' ? 'Metric' : 'Imperial'} — preferences saved`
    );
  };

  const handleChange = (key, value) => {
    updatePreference(key, value);
    toast.success(language === 'ar' ? 'تم حفظ التفضيل' : 'Preference saved');
  };

  const handleReset = () => {
    resetPreferences();
    toast.success(language === 'ar' ? 'تم إعادة ضبط التفضيلات' : 'Preferences reset to defaults');
  };

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5 text-emerald-600" />
            {language === 'ar' ? 'تفضيلات الوحدات' : 'Unit Preferences'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-500 hover:text-red-500">
            <RotateCcw className="w-4 h-4 me-1" />
            {language === 'ar' ? 'إعادة ضبط' : 'Reset'}
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'ar'
            ? 'تُطبَّق هذه التفضيلات تلقائياً على جميع الحاسبات'
            : 'These preferences are applied automatically across all calculators'}
        </p>
      </CardHeader>

      <CardContent className="pt-4 space-y-5">
        {/* System Toggle */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            {language === 'ar' ? 'نظام الوحدات' : 'Units System'}
          </label>
          <div className="flex gap-2">
            {['metric', 'imperial'].map(mode => (
              <button
                key={mode}
                onClick={() => handleUnitsModeChange(mode)}
                className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  preferences.unitsMode === mode
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {preferences.unitsMode === mode && <CheckCircle className="w-3.5 h-3.5 inline me-1" />}
                {mode === 'metric'
                  ? (language === 'ar' ? 'المتري (SI)' : 'Metric (SI)')
                  : (language === 'ar' ? 'الإمبراطوري' : 'Imperial (US/UK)')}
              </button>
            ))}
          </div>
        </div>

        {/* Individual unit selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(unitOptions).map(([key, config]) => (
            <div key={key}>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wide">
                {config.label[language] || config.label.en}
              </label>
              <Select value={preferences[key]} onValueChange={(v) => handleChange(key, v)}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {config.options.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <p className="text-xs text-blue-700">
            {language === 'ar'
              ? 'ملاحظة: تُخزَّن التفضيلات محلياً في متصفحك وتُطبَّق في كل مرة تستخدم فيها الحاسبات.'
              : 'Note: Preferences are stored locally in your browser and applied every time you use the calculators.'}
          </p>
        </div>

        {onClose && (
          <Button onClick={onClose} className="w-full bg-emerald-600 hover:bg-emerald-700">
            {language === 'ar' ? 'حفظ وإغلاق' : 'Save & Close'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}