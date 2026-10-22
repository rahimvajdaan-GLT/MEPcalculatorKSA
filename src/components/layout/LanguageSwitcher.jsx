import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ currentLanguage, targetPage }) {
  const navigate = useNavigate();
  
  const switchLanguage = () => {
    if (targetPage) {
      navigate(createPageUrl(targetPage));
    }
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={switchLanguage}
      className="gap-2"
    >
      <Globe className="w-4 h-4" />
      {currentLanguage === 'ar' ? 'English' : 'العربية'}
    </Button>
  );
}