// Pump Head Loss Calculator
// For chilled water and heating systems

export const pumpHeadLossConfig = {
  ar: {
    title: "حاسبة فقدان ضغط المضخة",
    description: "حساب الضغط الكلي المطلوب لمضخات المياه المبردة والتسخين",
    introContent: `
تساعد هذه الحاسبة في تحديد رأس الضغط المطلوب لمضخات أنظمة المياه المبردة ومياه التسخين.

## مكونات رأس المضخة

1. **فقدان الأنابيب المستقيمة**: الاحتكاك في الأنابيب
2. **فقدان الملحقات**: الكوع، T، الصمامات
3. **فقدان المعدات**: المبادلات الحرارية، ملفات التبريد
4. **رأس الارتفاع**: للأنظمة المفتوحة فقط

## الصيغة العامة

H_total = H_friction + H_fittings + H_equipment + H_elevation

## معدلات الفقدان النموذجية

| المكون | الفقدان النموذجي |
|--------|-----------------|
| أنابيب (ل كل 100م) | 2-4 م |
| ملف تبريد | 3-6 م |
| صمام موازنة | 1-3 م |
| مبادل حراري | 3-8 م |

## قواعد التصميم

- السرعة المثلى: 1.5-2.5 م/ث
- فقدان الأنابيب: 200-400 Pa/m
- هامش أمان: 10-20%
    `,
    inputs: {
      pipeLength: { label: "طول الأنابيب الكلي", unit: { metric: "متر", imperial: "قدم" } },
      frictionLoss: { label: "فقدان الاحتكاك لكل 100م", unit: { metric: "متر", imperial: "قدم" } },
      fittingsLoss: { label: "فقدان الملحقات والصمامات", unit: { metric: "متر", imperial: "قدم" } },
      equipmentLoss: { label: "فقدان المعدات (ملفات، مبادلات)", unit: { metric: "متر", imperial: "قدم" } },
      elevationHead: { label: "رأس الارتفاع (للأنظمة المفتوحة)", unit: { metric: "متر", imperial: "قدم" } }
    },
    outputs: {
      pipeFrictionHead: { label: "فقدان احتكاك الأنابيب", unit: { metric: "متر", imperial: "قدم" } },
      totalHead: { label: "رأس المضخة الكلي", unit: { metric: "متر", imperial: "قدم" } },
      withSafety: { label: "مع هامش أمان 15%", unit: { metric: "متر", imperial: "قدم" } },
      pressureBar: { label: "الضغط المكافئ", unit: { metric: "بار", imperial: "psi" } }
    },
    faq: [
      { question: "ما الفرق بين النظام المفتوح والمغلق؟", answer: "النظام المفتوح يحتاج رأس ارتفاع، المغلق لا يحتاج." },
      { question: "كيف أحسب فقدان الملحقات؟", answer: "استخدم جداول الطول المكافئ أو معاملات K." },
      { question: "ما هو هامش الأمان المناسب؟", answer: "10-15% للأنظمة الجديدة، 20% للقديمة." },
      { question: "هل يشمل الحساب ضغط التشغيل؟", answer: "لا، هذا فقط رأس المضخة المطلوب للتغلب على الفقدان." }
    ],
    assumptions: [
      "نظام مياه مغلق (ما لم يُحدد)",
      "أنابيب حديد أسود جديدة",
      "درجة حرارة مياه قياسية",
      "لا يوجد هواء محبوس"
    ]
  },
  en: {
    title: "Pump Head Loss Calculator",
    description: "Calculate total head required for chilled water and heating water pumps",
    introContent: `
This calculator helps determine the required pump head for chilled water and heating water systems.

## Pump Head Components

1. **Straight Pipe Loss**: Friction in pipes
2. **Fittings Loss**: Elbows, Tees, valves
3. **Equipment Loss**: Heat exchangers, cooling coils
4. **Elevation Head**: For open systems only

## General Formula

H_total = H_friction + H_fittings + H_equipment + H_elevation

## Typical Loss Rates

| Component | Typical Loss |
|-----------|-------------|
| Pipes (per 100m) | 2-4 m |
| Cooling Coil | 3-6 m |
| Balancing Valve | 1-3 m |
| Heat Exchanger | 3-8 m |

## Design Rules

- Optimal velocity: 1.5-2.5 m/s
- Pipe loss: 200-400 Pa/m
- Safety margin: 10-20%
    `,
    inputs: {
      pipeLength: { label: "Total Pipe Length", unit: { metric: "m", imperial: "ft" } },
      frictionLoss: { label: "Friction Loss per 100m", unit: { metric: "m", imperial: "ft" } },
      fittingsLoss: { label: "Fittings & Valves Loss", unit: { metric: "m", imperial: "ft" } },
      equipmentLoss: { label: "Equipment Loss (coils, exchangers)", unit: { metric: "m", imperial: "ft" } },
      elevationHead: { label: "Elevation Head (open systems)", unit: { metric: "m", imperial: "ft" } }
    },
    outputs: {
      pipeFrictionHead: { label: "Pipe Friction Head", unit: { metric: "m", imperial: "ft" } },
      totalHead: { label: "Total Pump Head", unit: { metric: "m", imperial: "ft" } },
      withSafety: { label: "With 15% Safety Margin", unit: { metric: "m", imperial: "ft" } },
      pressureBar: { label: "Equivalent Pressure", unit: { metric: "bar", imperial: "psi" } }
    },
    faq: [
      { question: "What's the difference between open and closed systems?", answer: "Open systems need elevation head, closed systems don't." },
      { question: "How do I calculate fittings loss?", answer: "Use equivalent length tables or K-factors." },
      { question: "What is the appropriate safety margin?", answer: "10-15% for new systems, 20% for older ones." },
      { question: "Does the calculation include operating pressure?", answer: "No, this is only the pump head needed to overcome losses." }
    ],
    assumptions: [
      "Closed water system (unless specified)",
      "New black steel pipes",
      "Standard water temperature",
      "No trapped air"
    ]
  }
};

export function calculatePumpHeadLoss(inputs, unitsMode = 'metric') {
  let { pipeLength = 100, frictionLoss = 3, fittingsLoss = 5, equipmentLoss = 8, elevationHead = 0 } = inputs;
  const warnings = [];

  // Convert to metric if imperial
  if (unitsMode === 'imperial') {
    pipeLength = pipeLength * 0.3048;
    frictionLoss = frictionLoss * 0.3048;
    fittingsLoss = fittingsLoss * 0.3048;
    equipmentLoss = equipmentLoss * 0.3048;
    elevationHead = elevationHead * 0.3048;
  }

  // Calculate pipe friction head
  const pipeFrictionHead = (pipeLength / 100) * frictionLoss;

  // Calculate total head
  const totalHead = pipeFrictionHead + fittingsLoss + equipmentLoss + elevationHead;

  // Add safety margin
  const withSafety = totalHead * 1.15;

  // Convert to pressure (1 m = 0.098 bar)
  const pressureBar = withSafety * 0.098;

  // Warnings
  if (totalHead > 50) {
    warnings.push(unitsMode === 'metric'
      ? 'رأس المضخة مرتفع - تحقق من تصميم الشبكة'
      : 'High pump head - verify system design');
  }

  const outputs = {
    pipeFrictionHead: unitsMode === 'metric'
      ? Math.round(pipeFrictionHead * 10) / 10
      : Math.round(pipeFrictionHead / 0.3048 * 10) / 10,
    totalHead: unitsMode === 'metric'
      ? Math.round(totalHead * 10) / 10
      : Math.round(totalHead / 0.3048 * 10) / 10,
    withSafety: unitsMode === 'metric'
      ? Math.round(withSafety * 10) / 10
      : Math.round(withSafety / 0.3048 * 10) / 10,
    pressureBar: unitsMode === 'metric'
      ? Math.round(pressureBar * 100) / 100
      : Math.round(pressureBar * 14.504 * 10) / 10
  };

  return { outputs, warnings };
}

export const pumpHeadLossDefaults = {
  metric: { pipeLength: 100, frictionLoss: 3, fittingsLoss: 5, equipmentLoss: 8, elevationHead: 0 },
  imperial: { pipeLength: 330, frictionLoss: 10, fittingsLoss: 16, equipmentLoss: 26, elevationHead: 0 }
};

export const pumpHeadLossRelated = ['chilled-water-pipe-sizing', 'fan-esp'];