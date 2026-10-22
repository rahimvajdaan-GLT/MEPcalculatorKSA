import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Share2, Mail, Link as LinkIcon, Facebook, Linkedin } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../i18n/LanguageContext';

export default function ShareButton({ title, results, slug }) {
  const { language } = useLanguage();
  
  const shareUrl = window.location.href;
  
  const formatResults = () => {
    if (!results || !results.outputs) return '';
    return Object.entries(results.outputs)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success(language === 'ar' ? 'تم نسخ الرابط' : 'Link copied');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${title}\n\n${formatResults()}\n\n${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 me-2" />
          {language === 'ar' ? 'مشاركة' : 'Share'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyLink}>
          <LinkIcon className="w-4 h-4 me-2" />
          {language === 'ar' ? 'نسخ الرابط' : 'Copy Link'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmail}>
          <Mail className="w-4 h-4 me-2" />
          {language === 'ar' ? 'مشاركة بالبريد' : 'Share via Email'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFacebook}>
          <Facebook className="w-4 h-4 me-2" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLinkedIn}>
          <Linkedin className="w-4 h-4 me-2" />
          LinkedIn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}