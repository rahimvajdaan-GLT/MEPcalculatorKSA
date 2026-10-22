import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';
import { convertKWtoA, convertAtoKW, convertKVAtoA, convertAtoKVA, convertKWtoKVA, convertKVAtoKW } from './ConversionEngine';
import { toast } from 'sonner';

export default function ElectricalMiniCalculator({ card, language }) {
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [voltage, setVoltage] = useState('400');
  const [pf, setPF] = useState('0.9');
  const [system, setSystem] = useState('3P');
  const [autoConvert, setAutoConvert] = useState(true);
  const [copied, setCopied] = useState(false);

  const title = language === 'ar' ? card.titleAr : card.titleEn;

  // Determine conversion type from slug
  const conversionType = card.slug; // e.g., "kw-to-a", "kva-to-a", "kw-to-kva"

  const needsPF = conversionType.includes('kw');
  const needsVoltage = conversionType !== 'kw-to-kva' && conversionType !== 'kva-to-kw';

  useEffect(() => {
    if (autoConvert && fromValue) {
      handleConvert();
    }
  }, [fromValue, voltage, pf, system, autoConvert]);

  const handleConvert = () => {
    const value = parseFloat(fromValue);
    const v = parseFloat(voltage);
    const powerFactor = parseFloat(pf);

    if (isNaN(value)) {
      setToValue('');
      return;
    }

    let result;

    switch (conversionType) {
      case 'kw-to-a':
        if (isNaN(v) || isNaN(powerFactor)) return;
        result = convertKWtoA(value, v, powerFactor, system);
        break;
      case 'a-to-kw':
        if (isNaN(v) || isNaN(powerFactor)) return;
        result = convertAtoKW(value, v, powerFactor, system);
        break;
      case 'kva-to-a':
        if (isNaN(v)) return;
        result = convertKVAtoA(value, v, system);
        break;
      case 'a-to-kva':
        if (isNaN(v)) return;
        result = convertAtoKVA(value, v, system);
        break;
      case 'kw-to-kva':
        if (isNaN(powerFactor)) return;
        result = convertKWtoKVA(value, powerFactor);
        break;
      case 'kva-to-kw':
        if (isNaN(powerFactor)) return;
        result = convertKVAtoKW(value, powerFactor);
        break;
      default:
        return;
    }

    setToValue(result.toFixed(2));
  };

  const handleSwap = () => {
    // Swap conversion direction
    const newSlug = conversionType.split('-').reverse().join('-');
    // This would need to trigger a change in the parent, for now just swap values
    setFromValue(toValue);
    setToValue('');
  };

  const handleCopy = () => {
    if (toValue) {
      navigator.clipboard.writeText(toValue);
      setCopied(true);
      toast.success(language === 'ar' ? 'تم النسخ' : 'Copied');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getFromLabel = () => {
    if (conversionType.includes('kw-to')) return 'kW';
    if (conversionType.includes('kva-to')) return 'kVA';
    if (conversionType.includes('a-to-kw')) return 'A';
    if (conversionType.includes('a-to-kva')) return 'A';
    return '';
  };

  const getToLabel = () => {
    if (conversionType.includes('to-a')) return 'A';
    if (conversionType.includes('to-kw')) return 'kW';
    if (conversionType.includes('to-kva')) return 'kVA';
    return '';
  };

  return (
    <Card className="border-amber-200 shadow-lg">
      <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="auto-calc" className="text-sm text-slate-600">
              {language === 'ar' ? 'حساب تلقائي' : 'Auto-calculate'}
            </Label>
            <Switch
              id="auto-calc"
              checked={autoConvert}
              onCheckedChange={setAutoConvert}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'النظام' : 'System'}</Label>
              <Select value={system} onValueChange={setSystem}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1P">{language === 'ar' ? 'أحادي الطور' : '1-Phase'}</SelectItem>
                  <SelectItem value="3P">{language === 'ar' ? 'ثلاثي الطور' : '3-Phase'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {needsVoltage && (
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'الجهد (V)' : 'Voltage (V)'}</Label>
                <Input
                  type="number"
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                  placeholder="400"
                />
              </div>
            )}
            {needsPF && (
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'معامل القدرة' : 'Power Factor'}</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={pf}
                  onChange={(e) => setPF(e.target.value)}
                  placeholder="0.9"
                />
              </div>
            )}
          </div>

          {/* From */}
          <div className="space-y-2">
            <Label>{language === 'ar' ? 'من' : 'From'} ({getFromLabel()})</Label>
            <Input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              placeholder={language === 'ar' ? `أدخل القيمة ${getFromLabel()}` : `Enter ${getFromLabel()} value`}
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwap}
              className="rounded-full"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </Button>
          </div>

          {/* To */}
          <div className="space-y-2">
            <Label>{language === 'ar' ? 'إلى' : 'To'} ({getToLabel()})</Label>
            <div className="relative">
              <Input
                type="text"
                value={toValue}
                readOnly
                placeholder={language === 'ar' ? 'النتيجة' : 'Result'}
                className="pr-10"
              />
              {toValue && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {!autoConvert && (
            <Button onClick={handleConvert} className="w-full bg-amber-600 hover:bg-amber-700">
              {language === 'ar' ? 'حساب' : 'Calculate'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}