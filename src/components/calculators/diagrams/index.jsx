// Voltage Drop Diagram
export const voltageDropDiagram = (language) => ({
  title: language === 'ar' ? 'كيف يعمل حساب هبوط الجهد' : 'How Voltage Drop Works',
  caption: language === 'ar' 
    ? 'يحسب هبوط الجهد على طول الكابل بناءً على التيار والمسافة والمقاومة' 
    : 'Calculates voltage drop along cable based on current, distance, and resistance',
  altText: language === 'ar' ? 'رسم توضيحي لهبوط الجهد في الكابل الكهربائي' : 'Voltage drop diagram in electrical cable',
  svgMarkup: `
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="80" width="60" height="40" rx="4" fill="#10b981" opacity="0.2" stroke="#10b981" stroke-width="2"/>
      <text x="50" y="105" text-anchor="middle" font-size="12" fill="#059669" font-weight="600">
        ${language === 'ar' ? 'مصدر' : 'Source'}
      </text>
      <line x1="80" y1="90" x2="280" y2="90" stroke="#64748b" stroke-width="4"/>
      <line x1="80" y1="110" x2="280" y2="110" stroke="#64748b" stroke-width="4"/>
      <text x="180" y="75" text-anchor="middle" font-size="14" fill="#ef4444" font-weight="600">
        ${language === 'ar' ? 'هبوط الجهد' : 'Voltage Drop'}
      </text>
      <path d="M120 85 L160 85" stroke="#ef4444" stroke-width="2" marker-end="url(#arrowred)"/>
      <path d="M240 85 L200 85" stroke="#ef4444" stroke-width="2" marker-end="url(#arrowred)"/>
      <rect x="280" y="80" width="60" height="40" rx="4" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" stroke-width="2"/>
      <text x="310" y="105" text-anchor="middle" font-size="12" fill="#2563eb" font-weight="600">
        ${language === 'ar' ? 'حمل' : 'Load'}
      </text>
      <text x="180" y="140" text-anchor="middle" font-size="11" fill="#64748b">
        ${language === 'ar' ? 'طول الكابل (م)' : 'Cable Length (m)'}
      </text>
      <defs>
        <marker id="arrowred" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#ef4444"/>
        </marker>
      </defs>
    </svg>
  `
});

// Cable Sizing Diagram
export const cableSizingDiagram = (language) => ({
  title: language === 'ar' ? 'كيف يعمل اختيار مقاس الكابل' : 'How Cable Sizing Works',
  caption: language === 'ar' 
    ? 'يختار مقاس الكابل المناسب بناءً على التيار وطريقة التركيب والعوامل البيئية' 
    : 'Selects appropriate cable size based on current, installation method, and environmental factors',
  altText: language === 'ar' ? 'رسم توضيحي لأحجام الكابلات المختلفة' : 'Cable sizing comparison diagram',
  svgMarkup: `
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="100" r="20" fill="#ef4444" opacity="0.2" stroke="#ef4444" stroke-width="2"/>
      <text x="80" y="105" text-anchor="middle" font-size="11" fill="#dc2626" font-weight="600">
        ${language === 'ar' ? 'صغير' : 'Small'}
      </text>
      <text x="80" y="135" text-anchor="middle" font-size="10" fill="#64748b">2.5 mm²</text>
      
      <path d="M110 100 L140 100" stroke="#10b981" stroke-width="2" marker-end="url(#arrowgreen)"/>
      
      <circle cx="180" cy="100" r="30" fill="#f59e0b" opacity="0.2" stroke="#f59e0b" stroke-width="2"/>
      <text x="180" y="105" text-anchor="middle" font-size="11" fill="#d97706" font-weight="600">
        ${language === 'ar' ? 'متوسط' : 'Medium'}
      </text>
      <text x="180" y="145" text-anchor="middle" font-size="10" fill="#64748b">16 mm²</text>
      
      <path d="M220 100 L260 100" stroke="#10b981" stroke-width="2" marker-end="url(#arrowgreen)"/>
      
      <circle cx="310" cy="100" r="40" fill="#10b981" opacity="0.2" stroke="#10b981" stroke-width="2"/>
      <text x="310" y="105" text-anchor="middle" font-size="11" fill="#059669" font-weight="600">
        ${language === 'ar' ? 'كبير' : 'Large'}
      </text>
      <text x="310" y="155" text-anchor="middle" font-size="10" fill="#64748b">95 mm²</text>
      
      <text x="200" y="30" text-anchor="middle" font-size="12" fill="#64748b" font-weight="500">
        ${language === 'ar' ? '← التيار المتزايد' : 'Increasing Current →'}
      </text>
      
      <defs>
        <marker id="arrowgreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#10b981"/>
        </marker>
      </defs>
    </svg>
  `
});

// Duct Sizing Diagram
export const ductSizingDiagram = (language) => ({
  title: language === 'ar' ? 'كيف يعمل حساب مقاس الدكت' : 'How Duct Sizing Works',
  caption: language === 'ar' 
    ? 'يحسب أبعاد الدكت المطلوبة بناءً على معدل تدفق الهواء والسرعة المسموحة' 
    : 'Calculates required duct dimensions based on airflow rate and allowed velocity',
  altText: language === 'ar' ? 'رسم توضيحي لحساب مقاس الدكت' : 'Duct sizing calculation diagram',
  svgMarkup: `
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="100" r="30" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" stroke-width="2"/>
      <path d="M40 100 L50 90 L60 100 L50 110 Z" fill="#3b82f6"/>
      <text x="50" y="150" text-anchor="middle" font-size="10" fill="#64748b">
        ${language === 'ar' ? 'مروحة' : 'Fan'}
      </text>
      
      <rect x="80" y="70" width="200" height="60" rx="4" fill="#64748b" opacity="0.1" stroke="#64748b" stroke-width="2"/>
      
      <path d="M100 100 L140 100" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowblue)"/>
      <path d="M160 100 L200 100" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowblue)"/>
      <path d="M220 100 L260 100" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowblue)"/>
      
      <text x="180" y="155" text-anchor="middle" font-size="11" fill="#64748b">
        ${language === 'ar' ? 'العرض × الارتفاع' : 'Width × Height'}
      </text>
      
      <text x="180" y="50" text-anchor="middle" font-size="11" fill="#3b82f6" font-weight="600">
        ${language === 'ar' ? 'السرعة (م/ث)' : 'Velocity (m/s)'}
      </text>
      
      <rect x="280" y="80" width="40" height="40" rx="4" fill="#10b981" opacity="0.2" stroke="#10b981" stroke-width="2"/>
      <text x="300" y="150" text-anchor="middle" font-size="10" fill="#64748b">
        ${language === 'ar' ? 'مخرج' : 'Outlet'}
      </text>
      
      <defs>
        <marker id="arrowblue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6"/>
        </marker>
      </defs>
    </svg>
  `
});

// Pump Head Loss Diagram
export const pumpHeadDiagram = (language) => ({
  title: language === 'ar' ? 'كيف يعمل حساب هيد المضخة' : 'How Pump Head Loss Works',
  caption: language === 'ar' 
    ? 'يحسب الضغط المطلوب للتغلب على فاقد الاحتكاك وارتفاع النظام' 
    : 'Calculates required pressure to overcome friction loss and system elevation',
  altText: language === 'ar' ? 'رسم توضيحي لحساب هيد المضخة' : 'Pump head loss calculation diagram',
  svgMarkup: `
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="140" width="60" height="40" rx="4" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" stroke-width="2"/>
      <text x="70" y="165" text-anchor="middle" font-size="11" fill="#2563eb" font-weight="600">
        ${language === 'ar' ? 'مضخة' : 'Pump'}
      </text>
      
      <path d="M100 160 L150 160 L150 80 L280 80" stroke="#64748b" stroke-width="3" fill="none"/>
      
      <path d="M180 150 Q200 130, 220 150" stroke="#ef4444" stroke-width="2" fill="none"/>
      <text x="200" y="125" text-anchor="middle" font-size="10" fill="#ef4444">
        ${language === 'ar' ? 'فاقد احتكاك' : 'Friction'}
      </text>
      
      <path d="M145 160 L145 85" stroke="#10b981" stroke-width="2" stroke-dasharray="4,4"/>
      <text x="135" y="120" text-anchor="end" font-size="10" fill="#10b981" transform="rotate(-90 125 120)">
        ${language === 'ar' ? 'ارتفاع' : 'Elevation'}
      </text>
      
      <circle cx="300" cy="80" r="20" fill="#f59e0b" opacity="0.2" stroke="#f59e0b" stroke-width="2"/>
      <text x="300" y="65" text-anchor="middle" font-size="10" fill="#64748b">
        ${language === 'ar' ? 'نقطة النهاية' : 'End Point'}
      </text>
      
      <defs>
        <marker id="arrowgray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#64748b"/>
        </marker>
      </defs>
    </svg>
  `
});

// Breaker Sizing Diagram
export const breakerSizingDiagram = (language) => ({
  title: language === 'ar' ? 'كيف يعمل اختيار القاطع' : 'How Breaker Sizing Works',
  caption: language === 'ar' 
    ? 'يختار تيار القاطع المناسب بناءً على تيار الحمل مع هامش أمان' 
    : 'Selects appropriate breaker rating based on load current with safety margin',
  altText: language === 'ar' ? 'رسم توضيحي لاختيار القاطع الكهربائي' : 'Circuit breaker sizing diagram',
  svgMarkup: `
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="80" width="80" height="60" rx="4" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" stroke-width="2"/>
      <text x="90" y="100" text-anchor="middle" font-size="10" fill="#2563eb" font-weight="600">
        ${language === 'ar' ? 'تيار الحمل' : 'Load Current'}
      </text>
      <text x="90" y="120" text-anchor="middle" font-size="16" fill="#2563eb" font-weight="700">32A</text>
      
      <path d="M140 110 L190 110" stroke="#10b981" stroke-width="3" marker-end="url(#arrowgreen2)"/>
      <text x="165" y="100" text-anchor="middle" font-size="9" fill="#10b981">×1.25</text>
      
      <rect x="200" y="70" width="100" height="80" rx="6" fill="#10b981" opacity="0.2" stroke="#10b981" stroke-width="2"/>
      <text x="250" y="90" text-anchor="middle" font-size="10" fill="#059669" font-weight="600">
        ${language === 'ar' ? 'تيار القاطع' : 'Breaker Rating'}
      </text>
      <text x="250" y="115" text-anchor="middle" font-size="20" fill="#059669" font-weight="700">40A</text>
      <text x="250" y="135" text-anchor="middle" font-size="9" fill="#64748b">
        ${language === 'ar' ? 'هامش أمان' : 'Safety Margin'}
      </text>
      
      <defs>
        <marker id="arrowgreen2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#10b981"/>
        </marker>
      </defs>
    </svg>
  `
});

// Hazen-Williams Diagram
export const hazenWilliamsDiagram = (language) => ({
  title: language === 'ar' ? 'كيف يعمل حساب فاقد الاحتكاك' : 'How Friction Loss Works',
  caption: language === 'ar' 
    ? 'يحسب فاقد الضغط في المواسير بناءً على معدل التدفق وقطر الماسورة' 
    : 'Calculates pressure loss in pipes based on flow rate and pipe diameter',
  altText: language === 'ar' ? 'رسم توضيحي لفاقد الاحتكاك في المواسير' : 'Pipe friction loss diagram',
  svgMarkup: `
    <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
      <line x1="50" y1="90" x2="350" y2="90" stroke="#64748b" stroke-width="8" stroke-linecap="round"/>
      <line x1="50" y1="110" x2="350" y2="110" stroke="#64748b" stroke-width="8" stroke-linecap="round"/>
      
      <path d="M80 100 L130 100" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrowblue2)"/>
      <path d="M160 100 L210 100" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrowblue2)"/>
      <path d="M240 100 L290 100" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrowblue2)"/>
      
      <path d="M100 65 Q150 55, 200 65 Q250 75, 300 65" stroke="#ef4444" stroke-width="2" fill="none" stroke-dasharray="4,2"/>
      <text x="200" y="45" text-anchor="middle" font-size="11" fill="#ef4444" font-weight="600">
        ${language === 'ar' ? 'فاقد الضغط' : 'Pressure Loss'}
      </text>
      
      <text x="70" y="150" text-anchor="middle" font-size="10" fill="#10b981" font-weight="600">
        P₁
      </text>
      <text x="330" y="150" text-anchor="middle" font-size="10" fill="#ef4444" font-weight="600">
        P₂
      </text>
      
      <defs>
        <marker id="arrowblue2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6"/>
        </marker>
      </defs>
    </svg>
  `
});