import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import DiagramCard from './DiagramCard';
import { 
  voltageDropDiagram, 
  cableSizingDiagram, 
  ductSizingDiagram,
  pumpHeadDiagram,
  breakerSizingDiagram,
  hazenWilliamsDiagram
} from './diagrams';

export default function HowItWorksCard({ calculatorSlug }) {
  const { language } = useLanguage();
  
  // Map calculator slugs to diagram functions
  const diagramMap = {
    'voltage-drop': voltageDropDiagram,
    'cable-sizing': cableSizingDiagram,
    'duct-sizing': ductSizingDiagram,
    'pump-head-loss': pumpHeadDiagram,
    'breaker-sizing': breakerSizingDiagram,
    'hazen-williams-friction-loss': hazenWilliamsDiagram
  };
  
  const diagramFunc = diagramMap[calculatorSlug];
  if (!diagramFunc) return null;
  
  const diagram = diagramFunc(language);
  
  return (
    <DiagramCard
      title={diagram.title}
      svgMarkup={diagram.svgMarkup}
      altText={diagram.altText}
      caption={diagram.caption}
    />
  );
}