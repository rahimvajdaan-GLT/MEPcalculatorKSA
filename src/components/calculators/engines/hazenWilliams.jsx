// Hazen-Williams Friction Loss Calculator
// Standard formula for fire protection hydraulic calculations

export const hazenWilliamsConfig = {
  ar: {
    title: "حاسبة فقدان الاحتكاك (هازن-ويليامز)",
    description: "حساب فقدان الضغط في أنابيب مكافحة الحريق باستخدام معادلة هازن-ويليامز",
    introContent: `
تعد معادلة هازن-ويليامز من أهم المعادلات المستخدمة في تصميم أنظمة مكافحة الحريق. تستخدم هذه المعادلة لحساب فقدان الضغط الناتج عن الاحتكاك في الأنابيب، وهي مطلوبة حسب معايير NFPA.

## ما هي معادلة هازن-ويليامز؟

معادلة هازن-ويليامز هي صيغة تجريبية تستخدم لحساب فقدان الضغط في الأنابيب الناقلة للمياه. تتميز بدقتها العالية للتدفقات المائية وسهولة استخدامها مقارنة بمعادلة دارسي-فايسباخ.

الصيغة الأساسية:
P = 4.52 × Q^1.85 / (C^1.85 × d^4.87)

حيث:
- P = فقدان الضغط (psi/ft)
- Q = التدفق (GPM)
- C = معامل هازن-ويليامز
- d = القطر الداخلي (بوصة)

## أهمية هذه الحاسبة

تستخدم هذه الحاسبة في:

1. **تصميم شبكات الرشاشات**: حساب الضغط المطلوب لكل رشاش
2. **تحديد حجم المضخة**: حساب الضغط الكلي المطلوب
3. **التحقق من التصميم**: التأكد من كفاية الضغط في جميع النقاط
4. **المطابقة للمعايير**: NFPA 13, 14, 20

## معاملات C الشائعة

| نوع الأنبوب | معامل C |
|-------------|---------|
| حديد أسود (جديد) | 120 |
| حديد أسود (قديم) | 100 |
| حديد مجلفن | 120 |
| نحاس | 150 |
| CPVC | 150 |
| بلاستيك (PVC) | 150 |

## متى تستخدم هذه الحاسبة؟

- تصميم أنظمة الرشاشات الأوتوماتيكية
- حساب خطوط إمداد صمامات الحريق
- تصميم أنظمة الإطفاء بالرغوة
- مراجعة الحسابات الهيدروليكية

## المدخلات المطلوبة

### التدفق (GPM أو م³/ساعة)
كمية المياه المتدفقة في الأنبوب

### قطر الأنبوب
القطر الداخلي للأنبوب

### طول الأنبوب
الطول الكلي بما في ذلك الطول المكافئ للملحقات

### معامل C
يعتمد على نوع وعمر الأنبوب

## الأخطاء الشائعة

1. **استخدام معامل C خاطئ**: يختلف حسب نوع الأنبوب وعمره
2. **تجاهل الملحقات**: الكوع والـ T والصمامات تضيف طول مكافئ
3. **استخدام القطر الخارجي**: يجب استخدام القطر الداخلي
4. **تجاهل فقدان الارتفاع**: الفرق في الارتفاع يؤثر على الضغط

## المعايير المرجعية

- NFPA 13: Standard for Installation of Sprinkler Systems
- NFPA 14: Standard for Standpipe and Hose Systems
- NFPA 20: Standard for Fire Pumps
- متطلبات الدفاع المدني السعودي
    `,
    inputs: {
      flowRate: { label: "معدل التدفق", unit: { metric: "لتر/دقيقة", imperial: "GPM" } },
      pipeDiameter: { label: "قطر الأنبوب الداخلي", unit: { metric: "مم", imperial: "بوصة" } },
      pipeLength: { label: "طول الأنبوب", unit: { metric: "متر", imperial: "قدم" } },
      cFactor: { label: "معامل C (هازن-ويليامز)", unit: "" }
    },
    outputs: {
      frictionLossPer100: { label: "فقدان الاحتكاك لكل 100", unit: { metric: "بار/100م", imperial: "psi/100ft" } },
      totalFrictionLoss: { label: "فقدان الاحتكاك الكلي", unit: { metric: "بار", imperial: "psi" } },
      velocity: { label: "سرعة المياه", unit: { metric: "م/ث", imperial: "قدم/ث" } },
      headLoss: { label: "فقدان الضغط (رأس)", unit: { metric: "متر", imperial: "قدم" } }
    },
    faq: [
      { question: "ما هو معامل C المناسب للأنابيب الجديدة؟", answer: "للحديد الأسود والمجلفن الجديد: 120، للنحاس والبلاستيك: 150" },
      { question: "لماذا ينخفض معامل C مع الوقت؟", answer: "بسبب الصدأ والترسبات الداخلية التي تزيد خشونة السطح" },
      { question: "كيف أحسب الطول المكافئ للملحقات؟", answer: "يوجد جداول قياسية في NFPA 13، مثلاً كوع 90° = 6 أقدام مكافئة" },
      { question: "ما الحد الأقصى للسرعة في أنابيب الإطفاء؟", answer: "عادة 6 م/ث (20 قدم/ث) لتجنب التآكل والضوضاء" },
      { question: "هل تشمل المعادلة الفقدان في الارتفاع؟", answer: "لا، يجب إضافة فقدان الارتفاع بشكل منفصل (0.433 psi/ft أو 0.1 bar/m)" },
      { question: "ما الفرق بين هازن-ويليامز ودارسي-فايسباخ؟", answer: "هازن-ويليامز أبسط وأكثر شيوعاً في أنظمة الإطفاء، دارسي أكثر دقة علمياً" },
      { question: "هل يمكن استخدام المعادلة للسوائل غير المياه؟", answer: "لا، المعادلة مصممة للمياه فقط بدرجة حرارة 15-25°C" },
      { question: "ما تأثير درجة الحرارة على الحساب؟", answer: "المعادلة صالحة للمياه بدرجة 15-25°C، درجات أخرى تحتاج تعديل" }
    ],
    assumptions: [
      "المياه بدرجة حرارة 15-25°C",
      "تدفق ثابت ومستقر (Steady State)",
      "الأنبوب ممتلئ بالكامل",
      "لا يوجد هواء محبوس في النظام",
      "معامل C ثابت على طول الأنبوب"
    ],
    workedExample: {
      description: "حساب فقدان الاحتكاك في أنبوب حديد أسود قطر 4 بوصة وطول 50 متر بتدفق 500 GPM",
      inputs: { flowRate: "500 GPM", pipeDiameter: "4 بوصة", pipeLength: "50 متر", cFactor: "120" },
      outputs: { 
        frictionLossPer100: "0.18 psi/ft", 
        totalFrictionLoss: "2.9 psi",
        velocity: "4.0 م/ث",
        headLoss: "2.0 متر"
      }
    }
  },
  en: {
    title: "Hazen-Williams Friction Loss Calculator",
    description: "Calculate pressure loss in fire protection pipes using the Hazen-Williams formula",
    introContent: `
The Hazen-Williams equation is one of the most important formulas used in fire protection system design. This equation is used to calculate friction pressure loss in pipes and is required per NFPA standards.

## What is the Hazen-Williams Equation?

The Hazen-Williams equation is an empirical formula used to calculate pressure loss in water-carrying pipes. It is known for its high accuracy for water flows and ease of use compared to the Darcy-Weisbach equation.

Basic Formula:
P = 4.52 × Q^1.85 / (C^1.85 × d^4.87)

Where:
- P = Pressure loss (psi/ft)
- Q = Flow rate (GPM)
- C = Hazen-Williams coefficient
- d = Internal diameter (inches)

## Importance of This Calculator

This calculator is used for:

1. **Sprinkler Network Design**: Calculate required pressure for each sprinkler
2. **Pump Sizing**: Calculate total required pressure
3. **Design Verification**: Ensure adequate pressure at all points
4. **Standards Compliance**: NFPA 13, 14, 20

## Common C Factors

| Pipe Type | C Factor |
|-----------|----------|
| Black Steel (new) | 120 |
| Black Steel (aged) | 100 |
| Galvanized Steel | 120 |
| Copper | 150 |
| CPVC | 150 |
| Plastic (PVC) | 150 |

## When to Use This Calculator?

- Automatic sprinkler system design
- Fire hose valve supply line calculations
- Foam suppression system design
- Hydraulic calculation reviews

## Required Inputs

### Flow Rate (GPM or L/min)
The volume of water flowing through the pipe

### Pipe Diameter
The internal diameter of the pipe

### Pipe Length
Total length including equivalent length of fittings

### C Factor
Depends on pipe type and age

## Common Mistakes

1. **Using Wrong C Factor**: Varies by pipe type and age
2. **Ignoring Fittings**: Elbows, Tees, and valves add equivalent length
3. **Using External Diameter**: Must use internal diameter
4. **Ignoring Elevation Loss**: Elevation difference affects pressure

## Reference Standards

- NFPA 13: Standard for Installation of Sprinkler Systems
- NFPA 14: Standard for Standpipe and Hose Systems
- NFPA 20: Standard for Fire Pumps
- Saudi Civil Defense Requirements
    `,
    inputs: {
      flowRate: { label: "Flow Rate", unit: { metric: "L/min", imperial: "GPM" } },
      pipeDiameter: { label: "Internal Pipe Diameter", unit: { metric: "mm", imperial: "in" } },
      pipeLength: { label: "Pipe Length", unit: { metric: "m", imperial: "ft" } },
      cFactor: { label: "C Factor (Hazen-Williams)", unit: "" }
    },
    outputs: {
      frictionLossPer100: { label: "Friction Loss per 100", unit: { metric: "bar/100m", imperial: "psi/100ft" } },
      totalFrictionLoss: { label: "Total Friction Loss", unit: { metric: "bar", imperial: "psi" } },
      velocity: { label: "Water Velocity", unit: { metric: "m/s", imperial: "ft/s" } },
      headLoss: { label: "Head Loss", unit: { metric: "m", imperial: "ft" } }
    },
    faq: [
      { question: "What C factor is appropriate for new pipes?", answer: "For new black and galvanized steel: 120, for copper and plastic: 150" },
      { question: "Why does C factor decrease over time?", answer: "Due to rust and internal deposits that increase surface roughness" },
      { question: "How do I calculate equivalent length of fittings?", answer: "Standard tables exist in NFPA 13, e.g., 90° elbow = 6 equivalent feet" },
      { question: "What is the maximum velocity in fire pipes?", answer: "Usually 6 m/s (20 ft/s) to avoid erosion and noise" },
      { question: "Does the equation include elevation loss?", answer: "No, elevation loss must be added separately (0.433 psi/ft or 0.1 bar/m)" },
      { question: "What is the difference between Hazen-Williams and Darcy-Weisbach?", answer: "Hazen-Williams is simpler and more common in fire systems, Darcy is more scientifically accurate" },
      { question: "Can the equation be used for non-water liquids?", answer: "No, the equation is designed for water only at 15-25°C" },
      { question: "What is the effect of temperature on calculations?", answer: "The equation is valid for water at 15-25°C, other temperatures require adjustment" }
    ],
    assumptions: [
      "Water at 15-25°C (60-77°F)",
      "Steady state flow",
      "Pipe is completely full",
      "No trapped air in the system",
      "C factor is constant throughout the pipe"
    ],
    workedExample: {
      description: "Calculate friction loss in a 4-inch black steel pipe, 150 ft long, with 500 GPM flow",
      inputs: { flowRate: "500 GPM", pipeDiameter: "4 in", pipeLength: "150 ft", cFactor: "120" },
      outputs: { 
        frictionLossPer100: "2.8 psi/100ft", 
        totalFrictionLoss: "4.2 psi",
        velocity: "12.7 ft/s",
        headLoss: "9.7 ft"
      }
    }
  }
};

// Unit conversions
const conversions = {
  gpmToLpm: (gpm) => gpm * 3.785,
  lpmToGpm: (lpm) => lpm / 3.785,
  inToMm: (inches) => inches * 25.4,
  mmToIn: (mm) => mm / 25.4,
  ftToM: (ft) => ft * 0.3048,
  mToFt: (m) => m / 0.3048,
  psiToBar: (psi) => psi * 0.0689476,
  barToPsi: (bar) => bar / 0.0689476,
  fpsToMs: (fps) => fps * 0.3048,
  msToFps: (ms) => ms / 0.3048
};

// Main calculation function
export function calculateHazenWilliams(inputs, unitsMode = 'metric', language = 'en') {
  let { flowRate, pipeDiameter, pipeLength, cFactor = 120 } = inputs;
  const warnings = [];

  // Convert to imperial for Hazen-Williams calculation (original formula is in imperial)
  let flowGPM, diameterIn, lengthFt;
  
  if (unitsMode === 'metric') {
    flowGPM = conversions.lpmToGpm(flowRate);
    diameterIn = conversions.mmToIn(pipeDiameter);
    lengthFt = conversions.mToFt(pipeLength);
  } else {
    flowGPM = flowRate;
    diameterIn = pipeDiameter;
    lengthFt = pipeLength;
  }

  // Hazen-Williams formula: P = 4.52 × Q^1.85 / (C^1.85 × d^4.87)
  // P in psi/ft, Q in GPM, d in inches
  const frictionLossPerFt = (4.52 * Math.pow(flowGPM, 1.85)) / (Math.pow(cFactor, 1.85) * Math.pow(diameterIn, 4.87));
  const frictionLossPer100ft = frictionLossPerFt * 100;
  const totalFrictionLossPsi = frictionLossPerFt * lengthFt;

  // Velocity calculation: V = 0.4085 × Q / d² (ft/s)
  const velocityFps = (0.4085 * flowGPM) / Math.pow(diameterIn, 2);

  // Head loss (convert psi to feet: 1 psi = 2.31 ft of water)
  const headLossFt = totalFrictionLossPsi * 2.31;

  // Velocity warnings
  if (velocityFps > 20) {
    warnings.push(language === 'ar'
      ? 'السرعة عالية جداً (> 6 م/ث) - قد تسبب تآكل وضوضاء'
      : 'Velocity too high (> 20 ft/s) - may cause erosion and noise');
  }

  // High friction loss warning
  if (frictionLossPer100ft > 5) {
    warnings.push(language === 'ar'
      ? 'فقدان الاحتكاك مرتفع - قد يحتاج زيادة قطر الأنبوب'
      : 'High friction loss - may need larger pipe diameter');
  }

  // Convert outputs based on unit mode
  const outputs = {
    frictionLossPer100: unitsMode === 'metric'
      ? Math.round(conversions.psiToBar(frictionLossPer100ft) * 1000) / 1000
      : Math.round(frictionLossPer100ft * 100) / 100,
    totalFrictionLoss: unitsMode === 'metric'
      ? Math.round(conversions.psiToBar(totalFrictionLossPsi) * 100) / 100
      : Math.round(totalFrictionLossPsi * 100) / 100,
    velocity: unitsMode === 'metric'
      ? Math.round(conversions.fpsToMs(velocityFps) * 10) / 10
      : Math.round(velocityFps * 10) / 10,
    headLoss: unitsMode === 'metric'
      ? Math.round(conversions.ftToM(headLossFt) * 10) / 10
      : Math.round(headLossFt * 10) / 10
  };

  return { outputs, warnings };
}

export const hazenWilliamsDefaults = {
  metric: { flowRate: 1900, pipeDiameter: 100, pipeLength: 50, cFactor: 120 },
  imperial: { flowRate: 500, pipeDiameter: 4, pipeLength: 150, cFactor: 120 }
};

export const hazenWilliamsRelated = ['fire-pump-sizing'];