import React from 'react';
import { motion } from 'framer-motion';

export default function HeroIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-md mx-auto"
    >
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        {/* Calculator base */}
        <rect x="100" y="80" width="200" height="180" rx="12" fill="url(#grad1)" stroke="#10b981" strokeWidth="2"/>
        
        {/* Display screen */}
        <rect x="120" y="100" width="160" height="50" rx="6" fill="#1f2937"/>
        <text x="200" y="130" textAnchor="middle" fill="#10b981" fontSize="20" fontWeight="bold">MEP</text>
        
        {/* Calculator buttons */}
        <circle cx="140" cy="175" r="12" fill="#10b981" opacity="0.8"/>
        <circle cx="180" cy="175" r="12" fill="#10b981" opacity="0.8"/>
        <circle cx="220" cy="175" r="12" fill="#10b981" opacity="0.8"/>
        <circle cx="260" cy="175" r="12" fill="#10b981" opacity="0.8"/>
        
        <circle cx="140" cy="210" r="12" fill="#10b981" opacity="0.6"/>
        <circle cx="180" cy="210" r="12" fill="#10b981" opacity="0.6"/>
        <circle cx="220" cy="210" r="12" fill="#10b981" opacity="0.6"/>
        <circle cx="260" cy="210" r="12" fill="#10b981" opacity="0.6"/>
        
        {/* Floating icons */}
        <motion.g
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* HVAC icon */}
          <circle cx="60" cy="100" r="20" fill="#3b82f6" opacity="0.2"/>
          <path d="M55 100 Q60 90, 65 100 M60 95 L60 105" stroke="#3b82f6" strokeWidth="2"/>
        </motion.g>
        
        <motion.g
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          {/* Plumbing icon */}
          <circle cx="340" cy="120" r="20" fill="#14b8a6" opacity="0.2"/>
          <rect x="332" y="115" width="4" height="10" fill="#14b8a6"/>
          <rect x="344" y="115" width="4" height="10" fill="#14b8a6"/>
        </motion.g>
        
        <motion.g
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        >
          {/* Fire icon */}
          <circle cx="70" cy="220" r="20" fill="#ef4444" opacity="0.2"/>
          <path d="M70 210 Q75 215, 70 225 Q65 215, 70 210" fill="#ef4444"/>
        </motion.g>
        
        <motion.g
          animate={{ y: [0, -9, 0] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
        >
          {/* Electrical icon */}
          <circle cx="330" cy="230" r="20" fill="#f59e0b" opacity="0.2"/>
          <path d="M335 220 L325 235 L330 235 L325 245 L335 230 L330 230 Z" fill="#f59e0b"/>
        </motion.g>
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0fdf4" stopOpacity="1" />
            <stop offset="100%" stopColor="#dcfce7" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}