// Duct Sizing Calculator Engine
// Based on ASHRAE and SMACNA standards

export const ductSizingConfig = {
  version: "1.2",
  ar: {
    title: "حاسبة أبعاد مجاري الهواء",
    description: "حساب أبعاد مجاري الهواء المستطيلة والدائرية بناءً على معدل تدفق الهواء والسرعة المطلوبة",
    introContent: `
تعد حاسبة أبعاد مجاري الهواء من أهم الأدوات الهندسية المستخدمة في تصميم أنظمة التكييف والتهوية. تساعد هذه الحاسبة المهندسين في تحديد الأبعاد المثلى لمجاري الهواء لضمان توزيع الهواء بشكل فعال وموفر للطاقة.

## ما هي حاسبة أبعاد مجاري الهواء؟

حاسبة أبعاد مجاري الهواء هي أداة هندسية تستخدم لحساب المقطع العرضي المطلوب لمجاري الهواء بناءً على كمية الهواء المراد نقلها والسرعة المناسبة. تعتمد الحاسبة على المعادلات الأساسية لميكانيكا الموائع وتأخذ في الاعتبار معايير التصميم المعتمدة مثل ASHRAE و SMACNA.

## أهمية التصميم الصحيح لمجاري الهواء

التصميم الصحيح لمجاري الهواء له أهمية كبيرة في:

1. **كفاءة الطاقة**: مجاري الهواء ذات الأبعاد الصحيحة تقلل من فقدان الضغط وتحسن كفاءة النظام
2. **الراحة الصوتية**: السرعات المناسبة تقلل من الضوضاء الناتجة عن تدفق الهواء
3. **جودة الهواء**: التوزيع المتساوي للهواء يحسن جودة الهواء الداخلي
4. **التكلفة**: الأبعاد المثلى توازن بين تكلفة المواد وتكلفة التشغيل

## متى تستخدم هذه الحاسبة؟

تستخدم هذه الحاسبة في:
- تصميم أنظمة التكييف المركزي للمباني التجارية والسكنية
- حساب أبعاد مجاري التهوية للمطابخ والحمامات
- تصميم أنظمة العادم للمصانع والورش
- مراجعة التصاميم الموجودة وتحسينها

## المدخلات المطلوبة

### معدل تدفق الهواء (CFM أو م³/ساعة)
كمية الهواء المراد نقلها عبر المجرى، وتحسب عادة بناءً على الحمل الحراري أو معدلات التهوية المطلوبة.

### السرعة المطلوبة
سرعة الهواء داخل المجرى، وتختلف حسب الموقع:
- المجاري الرئيسية: 5-8 م/ث
- الفروع: 3-5 م/ث
- بالقرب من المخارج: 2-3 م/ث

### نسبة العرض إلى الارتفاع (للمجاري المستطيلة)
تؤثر على فقدان الضغط وسهولة التركيب، يفضل ألا تتجاوز 4:1

## الأخطاء الشائعة

1. **تجاهل فقدان الضغط**: يجب احتساب الفقدان في الضغط عند تصميم النظام
2. **السرعات العالية**: تسبب ضوضاء مزعجة واستهلاك طاقة زائد
3. **نسب عرض/ارتفاع كبيرة**: تزيد من فقدان الضغط
4. **عدم مراعاة التمدد الحراري**: خاصة في المجاري المعدنية

## المعايير المرجعية

- ASHRAE Fundamentals Handbook
- SMACNA HVAC Duct Construction Standards
- كود البناء السعودي (SBC)
    `,
    inputs: {
      airflow: { label: "معدل تدفق الهواء", unit: { metric: "م³/ساعة", imperial: "CFM" } },
      velocity: { label: "السرعة المطلوبة", unit: { metric: "م/ث", imperial: "FPM" } },
      aspectRatio: { label: "نسبة العرض إلى الارتفاع", unit: "" }
    },
    outputs: {
      circularDiameter: { label: "قطر المجرى الدائري", unit: { metric: "مم", imperial: "بوصة" } },
      rectangularWidth: { label: "عرض المجرى المستطيل", unit: { metric: "مم", imperial: "بوصة" } },
      rectangularHeight: { label: "ارتفاع المجرى المستطيل", unit: { metric: "مم", imperial: "بوصة" } },
      crossSectionArea: { label: "مساحة المقطع", unit: { metric: "م²", imperial: "قدم²" } },
      actualVelocity: { label: "السرعة الفعلية", unit: { metric: "م/ث", imperial: "FPM" } },
      frictionLoss: { label: "فقدان الاحتكاك", unit: { metric: "باسكال/م", imperial: "بوصة ماء/100 قدم" } }
    },
    faq: [
      { question: "ما هي السرعة المناسبة لمجاري الهواء؟", answer: "تعتمد على الموقع: 5-8 م/ث للمجاري الرئيسية، 3-5 م/ث للفروع، 2-3 م/ث بالقرب من المخارج." },
      { question: "لماذا يفضل المجرى الدائري على المستطيل؟", answer: "المجرى الدائري له فقدان ضغط أقل لنفس المساحة، لكن المستطيل أسهل في التركيب." },
      { question: "ما هي نسبة العرض إلى الارتفاع المثالية؟", answer: "يفضل ألا تتجاوز 4:1 لتقليل فقدان الضغط، والأمثل هو 1:1 إلى 2:1." },
      { question: "كيف أحسب معدل تدفق الهواء المطلوب؟", answer: "يعتمد على الحمل الحراري (CFM = BTU/h ÷ 1.08 ÷ ΔT) أو معدلات التهوية المطلوبة." },
      { question: "ما تأثير السرعة العالية؟", answer: "تسبب ضوضاء مزعجة، زيادة استهلاك الطاقة، وفقدان ضغط أعلى." },
      { question: "هل يمكن استخدام هذه الحاسبة لمجاري العادم؟", answer: "نعم، نفس المبادئ تنطبق على مجاري الإمداد والعادم." },
      { question: "ما الفرق بين CFM و CMH؟", answer: "CFM = قدم مكعب/دقيقة (إمبراطوري)، CMH = متر مكعب/ساعة (متري). 1 CFM ≈ 1.7 CMH." },
      { question: "كيف أختار مادة المجرى؟", answer: "يعتمد على التطبيق: صاج مجلفن للتكييف العام، ستانلس ستيل للمطابخ، فايبرجلاس للعزل الصوتي." }
    ],
    assumptions: [
      "الهواء في درجة حرارة قياسية (20°C)",
      "ضغط جوي قياسي (101.325 kPa)",
      "مجرى مستقيم بدون ملحقات",
      "سطح داخلي أملس (صاج مجلفن)",
      "تدفق هواء ثابت ومستقر"
    ],
    workedExample: {
      description: "حساب أبعاد مجرى لتوزيع 2000 م³/ساعة بسرعة 5 م/ث",
      inputs: { airflow: "2000 م³/ساعة", velocity: "5 م/ث", aspectRatio: "2:1" },
      outputs: { 
        circularDiameter: "380 مم", 
        rectangularWidth: "450 مم",
        rectangularHeight: "225 مم",
        actualVelocity: "5.5 م/ث"
      }
    }
  },
  en: {
    title: "Duct Sizing Calculator",
    description: "Calculate rectangular and circular duct dimensions based on airflow rate and desired velocity",
    introContent: `
The Duct Sizing Calculator is one of the most important engineering tools used in designing HVAC systems. This calculator helps engineers determine optimal duct dimensions to ensure effective and energy-efficient air distribution.

## What is the Duct Sizing Calculator?

The Duct Sizing Calculator is an engineering tool used to calculate the required cross-sectional area for air ducts based on the amount of air to be transported and the appropriate velocity. The calculator relies on basic fluid mechanics equations and takes into account established design standards such as ASHRAE and SMACNA.

## Importance of Proper Duct Design

Proper duct design is crucial for:

1. **Energy Efficiency**: Correctly sized ducts reduce pressure loss and improve system efficiency
2. **Acoustic Comfort**: Appropriate velocities reduce noise from airflow
3. **Air Quality**: Even air distribution improves indoor air quality
4. **Cost**: Optimal dimensions balance material cost and operating cost

## When to Use This Calculator?

This calculator is used for:
- Designing central air conditioning systems for commercial and residential buildings
- Calculating ventilation duct dimensions for kitchens and bathrooms
- Designing exhaust systems for factories and workshops
- Reviewing and improving existing designs

## Required Inputs

### Airflow Rate (CFM or m³/h)
The amount of air to be transported through the duct, usually calculated based on thermal load or required ventilation rates.

### Required Velocity
Air velocity inside the duct, varies by location:
- Main ducts: 5-8 m/s (1000-1600 FPM)
- Branches: 3-5 m/s (600-1000 FPM)
- Near outlets: 2-3 m/s (400-600 FPM)

### Aspect Ratio (for rectangular ducts)
Affects pressure loss and ease of installation, preferably not exceeding 4:1

## Common Mistakes

1. **Ignoring Pressure Loss**: Pressure loss must be accounted for in system design
2. **High Velocities**: Cause annoying noise and excessive energy consumption
3. **Large Aspect Ratios**: Increase pressure loss
4. **Ignoring Thermal Expansion**: Especially in metal ducts

## Reference Standards

- ASHRAE Fundamentals Handbook
- SMACNA HVAC Duct Construction Standards
- Saudi Building Code (SBC)
    `,
    inputs: {
      airflow: { label: "Airflow Rate", unit: { metric: "m³/h", imperial: "CFM" } },
      velocity: { label: "Required Velocity", unit: { metric: "m/s", imperial: "FPM" } },
      aspectRatio: { label: "Aspect Ratio (W:H)", unit: "" }
    },
    outputs: {
      circularDiameter: { label: "Circular Duct Diameter", unit: { metric: "mm", imperial: "in" } },
      rectangularWidth: { label: "Rectangular Width", unit: { metric: "mm", imperial: "in" } },
      rectangularHeight: { label: "Rectangular Height", unit: { metric: "mm", imperial: "in" } },
      crossSectionArea: { label: "Cross Section Area", unit: { metric: "m²", imperial: "ft²" } },
      actualVelocity: { label: "Actual Velocity", unit: { metric: "m/s", imperial: "FPM" } },
      frictionLoss: { label: "Friction Loss", unit: { metric: "Pa/m", imperial: "in.wg/100ft" } }
    },
    faq: [
      { question: "What is the appropriate velocity for air ducts?", answer: "Depends on location: 5-8 m/s for main ducts, 3-5 m/s for branches, 2-3 m/s near outlets." },
      { question: "Why is circular duct preferred over rectangular?", answer: "Circular duct has lower pressure loss for the same area, but rectangular is easier to install." },
      { question: "What is the ideal aspect ratio?", answer: "Preferably not exceeding 4:1 to reduce pressure loss, optimal is 1:1 to 2:1." },
      { question: "How do I calculate the required airflow rate?", answer: "Depends on thermal load (CFM = BTU/h ÷ 1.08 ÷ ΔT) or required ventilation rates." },
      { question: "What is the effect of high velocity?", answer: "Causes annoying noise, increased energy consumption, and higher pressure loss." },
      { question: "Can this calculator be used for exhaust ducts?", answer: "Yes, the same principles apply to supply and exhaust ducts." },
      { question: "What is the difference between CFM and CMH?", answer: "CFM = cubic feet/minute (imperial), CMH = cubic meters/hour (metric). 1 CFM ≈ 1.7 CMH." },
      { question: "How do I choose the duct material?", answer: "Depends on application: galvanized steel for general HVAC, stainless steel for kitchens, fiberglass for sound insulation." }
    ],
    assumptions: [
      "Air at standard temperature (20°C / 68°F)",
      "Standard atmospheric pressure (101.325 kPa)",
      "Straight duct without fittings",
      "Smooth internal surface (galvanized steel)",
      "Steady state airflow"
    ],
    workedExample: {
      description: "Calculate duct dimensions for distributing 1200 CFM at 1000 FPM",
      inputs: { airflow: "1200 CFM", velocity: "1000 FPM", aspectRatio: "2:1" },
      outputs: { 
        circularDiameter: "15 in", 
        rectangularWidth: "18 in",
        rectangularHeight: "9 in",
        actualVelocity: "1067 FPM"
      }
    }
  }
};

// Unit conversion helpers
const conversions = {
  cfmToM3h: (cfm) => cfm * 1.699,
  m3hToCfm: (m3h) => m3h / 1.699,
  fpmToMs: (fpm) => fpm * 0.00508,
  msToFpm: (ms) => ms / 0.00508,
  mmToIn: (mm) => mm / 25.4,
  inToMm: (inches) => inches * 25.4,
  m2ToFt2: (m2) => m2 * 10.764,
  ft2ToM2: (ft2) => ft2 / 10.764,
  paMToInWg100ft: (paM) => paM * 0.1224,
  inWg100ftToPaM: (inWg) => inWg / 0.1224
};

// Main calculation function
export function calculateDuctSizing(inputs, unitsMode = 'metric', language = 'en') {
  let { airflow, velocity, aspectRatio = 2 } = inputs;
  const warnings = [];

  // Convert to metric for calculations
  if (unitsMode === 'imperial') {
    airflow = conversions.cfmToM3h(airflow);
    velocity = conversions.fpmToMs(velocity);
  }

  // Convert m³/h to m³/s
  const airflowM3s = airflow / 3600;

  // Calculate required cross-section area (m²)
  const areaRequired = airflowM3s / velocity;

  // Circular duct diameter
  const circularDiameter = Math.sqrt((4 * areaRequired) / Math.PI) * 1000; // mm

  // Round to standard size (25mm increments)
  const circularDiameterRounded = Math.ceil(circularDiameter / 25) * 25;

  // Rectangular duct dimensions
  // Area = W × H, where W = aspectRatio × H
  const heightMm = Math.sqrt(areaRequired * 1000000 / aspectRatio);
  const widthMm = heightMm * aspectRatio;

  // Round to standard sizes (25mm increments)
  const rectangularHeight = Math.ceil(heightMm / 25) * 25;
  const rectangularWidth = Math.ceil(widthMm / 25) * 25;

  // Actual area after rounding
  const actualCircularArea = Math.PI * Math.pow(circularDiameterRounded / 1000 / 2, 2);
  const actualRectArea = (rectangularWidth / 1000) * (rectangularHeight / 1000);

  // Actual velocities
  const actualCircularVelocity = airflowM3s / actualCircularArea;
  const actualRectVelocity = airflowM3s / actualRectArea;

  // Friction loss calculation (simplified Darcy-Weisbach)
  // Using f = 0.02 (typical for galvanized steel)
  const hydraulicDiameterRect = (2 * rectangularWidth * rectangularHeight) / (rectangularWidth + rectangularHeight) / 1000;
  const airDensity = 1.2; // kg/m³
  const frictionFactor = 0.02;
  const frictionLoss = (frictionFactor * airDensity * Math.pow(actualRectVelocity, 2)) / (2 * hydraulicDiameterRect);

  // Velocity warnings (based on language, not unitsMode)
  if (actualRectVelocity > 8) {
    warnings.push(language === 'ar' 
      ? 'السرعة عالية جداً (> 8 م/ث) - قد تسبب ضوضاء' 
      : 'Velocity too high (> 8 m/s) - may cause noise');
  }
  if (actualRectVelocity < 2) {
    warnings.push(language === 'ar'
      ? 'السرعة منخفضة جداً (< 2 م/ث) - قد تؤثر على التوزيع'
      : 'Velocity too low (< 2 m/s) - may affect distribution');
  }
  if (aspectRatio > 4) {
    warnings.push(language === 'ar'
      ? 'نسبة العرض/الارتفاع عالية (> 4:1) - زيادة فقدان الضغط'
      : 'Aspect ratio too high (> 4:1) - increased pressure loss');
  }

  // Convert outputs based on unit mode
  const outputs = {
    circularDiameter: unitsMode === 'imperial' 
      ? Math.round(conversions.mmToIn(circularDiameterRounded) * 10) / 10
      : circularDiameterRounded,
    rectangularWidth: unitsMode === 'imperial'
      ? Math.round(conversions.mmToIn(rectangularWidth) * 10) / 10
      : rectangularWidth,
    rectangularHeight: unitsMode === 'imperial'
      ? Math.round(conversions.mmToIn(rectangularHeight) * 10) / 10
      : rectangularHeight,
    crossSectionArea: unitsMode === 'imperial'
      ? Math.round(conversions.m2ToFt2(actualRectArea) * 1000) / 1000
      : Math.round(actualRectArea * 10000) / 10000,
    actualVelocity: unitsMode === 'imperial'
      ? Math.round(conversions.msToFpm(actualRectVelocity))
      : Math.round(actualRectVelocity * 10) / 10,
    frictionLoss: unitsMode === 'imperial'
      ? Math.round(conversions.paMToInWg100ft(frictionLoss) * 100) / 100
      : Math.round(frictionLoss * 10) / 10
  };

  return { outputs, warnings };
}

export const ductSizingDefaults = {
  metric: { airflow: 2000, velocity: 5, aspectRatio: 2 },
  imperial: { airflow: 1200, velocity: 1000, aspectRatio: 2 }
};

export const ductSizingRelated = ['chilled-water-pipe-sizing', 'fan-esp', 'pump-head-loss'];