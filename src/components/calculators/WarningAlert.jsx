import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';

const variants = {
  warning: {
    icon: AlertTriangle,
    className: 'border-amber-300 bg-amber-50 text-amber-800',
    iconClass: 'text-amber-600'
  },
  error: {
    icon: AlertCircle,
    className: 'border-red-300 bg-red-50 text-red-800',
    iconClass: 'text-red-600'
  },
  success: {
    icon: CheckCircle,
    className: 'border-green-300 bg-green-50 text-green-800',
    iconClass: 'text-green-600'
  },
  info: {
    icon: Info,
    className: 'border-blue-300 bg-blue-50 text-blue-800',
    iconClass: 'text-blue-600'
  }
};

export default function WarningAlert({ 
  type = 'warning', 
  title, 
  message,
  messages = []
}) {
  const { t } = useLanguage();
  const variant = variants[type];
  const Icon = variant.icon;
  
  const allMessages = message ? [message] : messages;
  if (allMessages.length === 0) return null;

  return (
    <Alert className={variant.className}>
      <Icon className={`w-5 h-5 ${variant.iconClass}`} />
      {title && <AlertTitle className="font-semibold">{title}</AlertTitle>}
      <AlertDescription>
        {allMessages.length === 1 ? (
          <p>{allMessages[0]}</p>
        ) : (
          <ul className="list-disc list-inside space-y-1 mt-1">
            {allMessages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  );
}