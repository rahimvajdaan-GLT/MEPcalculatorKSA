import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function ResultCard({ 
  label, 
  value, 
  unit, 
  icon: Icon,
  trend,
  highlight = false,
  size = 'default'
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <Card className={`
      ${highlight ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50' : 'border-slate-200'}
      ${size === 'large' ? 'p-6' : ''}
    `}>
      <CardContent className={size === 'large' ? 'p-0' : 'p-4'}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-500 mb-1">{label}</p>
            <div className="flex items-baseline gap-2">
              <span className={`font-bold ${size === 'large' ? 'text-3xl' : 'text-2xl'} ${highlight ? 'text-emerald-600' : 'text-slate-900'}`}>
                {typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value}
              </span>
              {unit && (
                <span className="text-sm text-slate-500">{unit}</span>
              )}
            </div>
          </div>
          {(Icon || TrendIcon) && (
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center
              ${highlight ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}
            `}>
              {TrendIcon && <TrendIcon className="w-5 h-5" />}
              {Icon && !TrendIcon && <Icon className="w-5 h-5" />}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}