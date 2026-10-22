// Fan External Static Pressure Calculator
// Based on ASHRAE and SMACNA standards

export const fanEspConfig = {
  ar: {
    title: "حاسبة الضغط الساكن للمروحة",
    description: "حساب الضغط الساكن الخارجي المطلوب للمروحة",
    introContent: `
تساعد هذه الحاسبة في تحديد الضغط الساكن الخارجي (ESP) المطلوب لاختيار مروحة مناسبة لنظام التكييف أو التهوية.

## ما هو الضغط الساكن الخارجي؟

الضغط الساكن الخارجي هو مقاومة تدفق الهواء في النظام خارج وحدة مناولة الهواء. يشمل:
- فقدان الضغط في المجاري
- فقدان الملحقات (كوع، T، محول)
- فقدان المخارج والمداخل
- فقدان الفلاتر والملفات

## مكونات الضغط الكلي

1. **فقدان المجاري المستقيمة**: يعتمد على الطول والسرعة والمادة
2. **فقدان الملحقات**: يحسب بمعامل الفقدان × الضغط الديناميكي
3. **فقدان المعدات**: فلاتر، ملفات تبريد/تسخين، مخمدات
4. **فقدان المخارج**: المنافذ والشبكات

## السرعات والضغوط النموذجية

| الموقع | السرعة | الفقدان |
|--------|--------|---------|
| مجرى رئيسي | 6-8 م/ث | 1-2 Pa/m |
| فرع | 4-6 م/ث | 0.5-1 Pa/m |
| فلتر نظيف | - | 50-100 Pa |
| ملف تبريد | - | 100-200 Pa |
    `,
    inputs: {
      ductLength: { label: "طول المجرى الرئيسي", unit: { metric: "متر", imperial: "قدم" } },
      frictionRate: { label: "معدل الاحتكاك", unit: { metric: "باسكال/م", imperial: "بوصة ماء/100 قدم" } },
      fittingsLoss: { label: "فقدان الملحقات", unit: { metric: "باسكال", imperial: "بوصة ماء" } },
      filterLoss: { label: "فقدان الفلتر", unit: { metric: "باسكال", imperial: "بوصة ماء" } },
      coilLoss: { label: "فقدان الملف", unit: { metric: "باسكال", imperial: "بوصة ماء" } },
      diffuserLoss: { label: "فقدان المخارج", unit: { metric: "باسكال", imperial: "بوصة ماء" } }
    },
    outputs: {
      ductLoss: { label: "فقدان المجاري", unit: { metric: "باسكال", imperial: "بوصة ماء" } },
      totalEsp: { label: "الضغط الساكن الكلي", unit: { metric: "باسكال", imperial: "بوصة ماء" } },
      safetyFactor: { label: "مع هامش أمان 10%", unit: { metric: "باسكال", imperial: "بوصة ماء" } },
      totalEspInWg: { label: "الضغط الكلي", unit: { metric: "بوصة ماء", imperial: "بوصة ماء" } }
    },
    faq: [
      { question: "ما هو هامش الأمان الموصى به؟", answer: "10-15% للأنظمة الجديدة، 20% للأنظمة القديمة." },
      { question: "كيف أحسب فقدان الملحقات؟", answer: "استخدم جداول معاملات الفقدان من ASHRAE أو SMACNA." },
      { question: "متى يكون الضغط عالياً جداً؟", answer: "أكثر من 750 Pa (3 in.wg) للأنظمة الصغيرة/المتوسطة." },
      { question: "هل يشمل ESP فقدان الوحدة الداخلية؟", answer: "لا، ESP هو الفقدان خارج الوحدة فقط." }
    ],
    assumptions: [
      "هواء بدرجة حرارة قياسية",
      "مجاري بحالة جيدة",
      "فلاتر نظيفة",
      "لا يوجد تسربات"
    ]
  },
  en: {
    title: "Fan External Static Pressure Calculator",
    description: "Calculate required fan external static pressure",
    introContent: `
This calculator helps determine the External Static Pressure (ESP) required for selecting an appropriate fan for HVAC systems.

## What is External Static Pressure?

External static pressure is the resistance to airflow in the system outside the air handling unit. It includes:
- Duct pressure loss
- Fittings loss (elbows, Tees, transitions)
- Outlets and inlets loss
- Filter and coil losses

## Total Pressure Components

1. **Straight Duct Loss**: Depends on length, velocity, and material
2. **Fittings Loss**: Calculated as loss coefficient × dynamic pressure
3. **Equipment Loss**: Filters, cooling/heating coils, dampers
4. **Outlet Loss**: Diffusers and grilles

## Typical Velocities and Pressures

| Location | Velocity | Loss |
|----------|----------|------|
| Main Duct | 6-8 m/s | 1-2 Pa/m |
| Branch | 4-6 m/s | 0.5-1 Pa/m |
| Clean Filter | - | 50-100 Pa |
| Cooling Coil | - | 100-200 Pa |
    `,
    inputs: {
      ductLength: { label: "Main Duct Length", unit: { metric: "m", imperial: "ft" } },
      frictionRate: { label: "Friction Rate", unit: { metric: "Pa/m", imperial: "in.wg/100ft" } },
      fittingsLoss: { label: "Fittings Loss", unit: { metric: "Pa", imperial: "in.wg" } },
      filterLoss: { label: "Filter Loss", unit: { metric: "Pa", imperial: "in.wg" } },
      coilLoss: { label: "Coil Loss", unit: { metric: "Pa", imperial: "in.wg" } },
      diffuserLoss: { label: "Diffuser Loss", unit: { metric: "Pa", imperial: "in.wg" } }
    },
    outputs: {
      ductLoss: { label: "Duct Loss", unit: { metric: "Pa", imperial: "in.wg" } },
      totalEsp: { label: "Total Static Pressure", unit: { metric: "Pa", imperial: "in.wg" } },
      safetyFactor: { label: "With 10% Safety Factor", unit: { metric: "Pa", imperial: "in.wg" } },
      totalEspInWg: { label: "Total Pressure", unit: { metric: "in.wg", imperial: "in.wg" } }
    },
    faq: [
      { question: "What is the recommended safety factor?", answer: "10-15% for new systems, 20% for older systems." },
      { question: "How do I calculate fittings loss?", answer: "Use loss coefficient tables from ASHRAE or SMACNA." },
      { question: "When is pressure too high?", answer: "More than 750 Pa (3 in.wg) for small/medium systems." },
      { question: "Does ESP include internal unit loss?", answer: "No, ESP is only the loss outside the unit." }
    ],
    assumptions: [
      "Air at standard temperature",
      "Ducts in good condition",
      "Clean filters",
      "No leakage"
    ]
  }
};

export function calculateFanEsp(inputs, unitsMode = 'metric') {
  let { ductLength = 30, frictionRate = 1, fittingsLoss = 50, filterLoss = 75, coilLoss = 150, diffuserLoss = 25 } = inputs;
  const warnings = [];

  // Convert to metric if imperial
  if (unitsMode === 'imperial') {
    ductLength = ductLength * 0.3048;
    frictionRate = frictionRate * 8.17; // in.wg/100ft to Pa/m
    fittingsLoss = fittingsLoss * 249;
    filterLoss = filterLoss * 249;
    coilLoss = coilLoss * 249;
    diffuserLoss = diffuserLoss * 249;
  }

  // Calculate duct loss
  const ductLoss = ductLength * frictionRate;

  // Calculate total ESP
  const totalEsp = ductLoss + fittingsLoss + filterLoss + coilLoss + diffuserLoss;

  // Add safety factor
  const safetyFactor = totalEsp * 1.1;

  // Convert to inches of water
  const totalEspInWg = totalEsp / 249;

  // Warnings
  if (totalEsp > 750) {
    warnings.push(unitsMode === 'metric'
      ? 'الضغط مرتفع - تحقق من تصميم المجاري'
      : 'High pressure - verify duct design');
  }

  const outputs = {
    ductLoss: unitsMode === 'metric'
      ? Math.round(ductLoss)
      : Math.round(ductLoss / 249 * 100) / 100,
    totalEsp: unitsMode === 'metric'
      ? Math.round(totalEsp)
      : Math.round(totalEsp / 249 * 100) / 100,
    safetyFactor: unitsMode === 'metric'
      ? Math.round(safetyFactor)
      : Math.round(safetyFactor / 249 * 100) / 100,
    totalEspInWg: Math.round(totalEspInWg * 100) / 100
  };

  return { outputs, warnings };
}

export const fanEspDefaults = {
  metric: { ductLength: 30, frictionRate: 1, fittingsLoss: 50, filterLoss: 75, coilLoss: 150, diffuserLoss: 25 },
  imperial: { ductLength: 100, frictionRate: 0.1, fittingsLoss: 0.2, filterLoss: 0.3, coilLoss: 0.6, diffuserLoss: 0.1 }
};

export const fanEspRelated = ['duct-sizing', 'pump-head-loss'];