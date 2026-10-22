import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';
import { convertUnits, formatConversionResult } from './ConversionEngine';
import { toast } from 'sonner';

export default function ConverterInlinePanel({ card, units, language }) {
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [fromUnitKey, setFromUnitKey] = useState(card.defaultFromUnitKey);
  const [toUnitKey, setToUnitKey] = useState(card.defaultToUnitKey);
  const [autoConvert, setAutoConvert] = useState(true);
  const [copied, setCopied] = useState(false);

  const dimensionUnits = units.filter(u => u.dimensionKey === card.dimensionKey);
  const fromUnit = dimensionUnits.find(u => u.key === fromUnitKey);
  const toUnit = dimensionUnits.find(u => u.key === toUnitKey);

  const title = language === 'ar' ? card.titleAr : card.titleEn;

  useEffect(() => {
    if (autoConvert && fromValue && fromUnit && toUnit) {
      handleConvert();
    }
  }, [fromValue, fromUnitKey, toUnitKey, autoConvert]);

  const handleConvert = () => {
    const value = parseFloat(fromValue);
    if (isNaN(value) || !fromUnit || !toUnit) {
      setToValue('');
      return;
    }

    const result = convertUnits(value, fromUnit, toUnit);
    if (result !== null) {
      const formatted = formatConversionResult(result, card.dimensionKey, toUnit.symbol);
      setToValue(formatted);
    }
  };

  const handleSwap = () => {
    setFromUnitKey(toUnitKey);
    setToUnitKey(fromUnitKey);
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

  return (
    <Card className="border-emerald-200 shadow-lg">
      <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="auto-convert" className="text-sm text-slate-600">
              {language === 'ar' ? 'تحويل تلقائي' : 'Auto-convert'}
            </Label>
            <Switch
              id="auto-convert"
              checked={autoConvert}
              onCheckedChange={setAutoConvert}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* From */}
          <div className="space-y-2">
            <Label>{language === 'ar' ? 'من' : 'From'}</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                placeholder={language === 'ar' ? 'أدخل القيمة' : 'Enter value'}
                className="flex-1"
              />
              <Select value={fromUnitKey} onValueChange={setFromUnitKey}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dimensionUnits.map(unit => (
                    <SelectItem key={unit.key} value={unit.key}>
                      {language === 'ar' ? unit.nameAr : unit.nameEn} ({unit.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            <Label>{language === 'ar' ? 'إلى' : 'To'}</Label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
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
              <Select value={toUnitKey} onValueChange={setToUnitKey}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dimensionUnits.map(unit => (
                    <SelectItem key={unit.key} value={unit.key}>
                      {language === 'ar' ? unit.nameAr : unit.nameEn} ({unit.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!autoConvert && (
            <Button onClick={handleConvert} className="w-full bg-emerald-600 hover:bg-emerald-700">
              {language === 'ar' ? 'تحويل' : 'Convert'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}