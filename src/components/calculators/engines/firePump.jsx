// Fire Pump Sizing Calculator
// Based on NFPA 20 requirements

export const firePumpConfig = {
  version: "1.1",
  ar: {
    title: "حاسبة حجم مضخة الحريق",
    description: "حساب سعة وضغط مضخة الحريق وفقاً لمعايير NFPA 20",
    introContent: `
تعد حاسبة حجم مضخة الحريق من الأدوات الحيوية لمهندسي السلامة. تساعد في تحديد المواصفات المناسبة لمضخة الحريق لضمان توفير الضغط والتدفق الكافيين لنظام مكافحة الحريق.

## ما هي مضخة الحريق؟

مضخة الحريق هي مضخة مخصصة لزيادة ضغط المياه في أنظمة مكافحة الحريق عندما يكون ضغط المصدر غير كافٍ. تعمل تلقائياً عند انخفاض الضغط في النظام.

## أنواع مضخات الحريق

1. **مضخات كهربائية**: الأكثر شيوعاً، تتطلب مصدر طاقة موثوق
2. **مضخات ديزل**: للحالات التي تتطلب استقلالية عن الشبكة الكهربائية
3. **مضخات جوكي**: مضخات صغيرة للحفاظ على الضغط

## متطلبات NFPA 20

- يجب أن توفر المضخة 150% من التدفق المقنن عند 65% من الضغط المقنن
- يجب ألا يتجاوز الضغط عند عدم التدفق 140% من الضغط المقنن
- يجب توفير مصدر مياه موثوق

## الحمولات النموذجية

| نوع النظام | التدفق النموذجي |
|-----------|----------------|
| رشاشات خفيفة | 500-750 GPM |
| رشاشات عادية | 750-1000 GPM |
| رشاشات كثيفة | 1000-1500 GPM |
| صمامات حريق | 250 GPM/صمام |

## حساب الضغط المطلوب

الضغط = ضغط الرشاش + فقدان الأنابيب + فقدان الارتفاع + هامش أمان
    `,
    inputs: {
      flowRate: { label: "معدل التدفق المطلوب", unit: { metric: "لتر/دقيقة", imperial: "GPM" } },
      totalHead: { label: "الضغط الكلي المطلوب", unit: { metric: "بار", imperial: "psi" } },
      suction: { label: "ضغط الشفط المتاح", unit: { metric: "بار", imperial: "psi" } },
      elevation: { label: "فرق الارتفاع", unit: { metric: "متر", imperial: "قدم" } }
    },
    outputs: {
      pumpHead: { label: "رأس المضخة المطلوب", unit: { metric: "متر", imperial: "قدم" } },
      pumpPower: { label: "قدرة المضخة التقريبية", unit: { metric: "كيلوواط", imperial: "حصان" } },
      recommendedSize: { label: "الحجم الموصى به", unit: { metric: "لتر/دقيقة", imperial: "GPM" } },
      npshRequired: { label: "NPSH المطلوب", unit: { metric: "متر", imperial: "قدم" } }
    },
    faq: [
      { question: "ما هو NPSH؟", answer: "Net Positive Suction Head - الضغط المطلوب عند مدخل المضخة لتجنب التكهف." },
      { question: "لماذا نحتاج مضخة جوكي؟", answer: "للحفاظ على ضغط النظام وتعويض التسربات الصغيرة دون تشغيل المضخة الرئيسية." },
      { question: "ما الفرق بين المضخة الكهربائية والديزل؟", answer: "الديزل مستقلة عن الشبكة وتستخدم كاحتياطي، الكهربائية أكثر اعتمادية للتشغيل اليومي." },
      { question: "كم مرة يجب اختبار المضخة؟", answer: "أسبوعياً بدون تدفق، وسنوياً اختبار أداء كامل حسب NFPA 25." }
    ],
    assumptions: [
      "كفاءة المضخة: 75-85%",
      "درجة حرارة المياه: 15-25°C",
      "مصدر مياه موثوق",
      "مطابقة لمتطلبات NFPA 20"
    ]
  },
  en: {
    title: "Fire Pump Sizing Calculator",
    description: "Calculate fire pump capacity and pressure per NFPA 20 requirements",
    introContent: `
The Fire Pump Sizing Calculator is a vital tool for fire safety engineers. It helps determine appropriate fire pump specifications to ensure adequate pressure and flow for fire suppression systems.

## What is a Fire Pump?

A fire pump is a dedicated pump to increase water pressure in fire suppression systems when source pressure is insufficient. It operates automatically when system pressure drops.

## Types of Fire Pumps

1. **Electric Pumps**: Most common, require reliable power source
2. **Diesel Pumps**: For situations requiring independence from electrical grid
3. **Jockey Pumps**: Small pumps to maintain pressure

## NFPA 20 Requirements

- Pump must provide 150% of rated flow at 65% of rated pressure
- Pressure at no flow must not exceed 140% of rated pressure
- Reliable water supply must be provided

## Typical Demands

| System Type | Typical Flow |
|------------|--------------|
| Light Hazard Sprinklers | 500-750 GPM |
| Ordinary Hazard Sprinklers | 750-1000 GPM |
| Extra Hazard Sprinklers | 1000-1500 GPM |
| Fire Hose Valves | 250 GPM/valve |

## Pressure Calculation

Pressure = Sprinkler Pressure + Pipe Loss + Elevation Loss + Safety Margin
    `,
    inputs: {
      flowRate: { label: "Required Flow Rate", unit: { metric: "L/min", imperial: "GPM" } },
      totalHead: { label: "Total Required Pressure", unit: { metric: "bar", imperial: "psi" } },
      suction: { label: "Available Suction Pressure", unit: { metric: "bar", imperial: "psi" } },
      elevation: { label: "Elevation Difference", unit: { metric: "m", imperial: "ft" } }
    },
    outputs: {
      pumpHead: { label: "Required Pump Head", unit: { metric: "m", imperial: "ft" } },
      pumpPower: { label: "Approximate Pump Power", unit: { metric: "kW", imperial: "HP" } },
      recommendedSize: { label: "Recommended Size", unit: { metric: "L/min", imperial: "GPM" } },
      npshRequired: { label: "NPSH Required", unit: { metric: "m", imperial: "ft" } }
    },
    faq: [
      { question: "What is NPSH?", answer: "Net Positive Suction Head - pressure required at pump inlet to avoid cavitation." },
      { question: "Why do we need a jockey pump?", answer: "To maintain system pressure and compensate for small leaks without running the main pump." },
      { question: "What's the difference between electric and diesel pumps?", answer: "Diesel is grid-independent and used as backup, electric is more reliable for daily operation." },
      { question: "How often should the pump be tested?", answer: "Weekly churn test, annual full performance test per NFPA 25." }
    ],
    assumptions: [
      "Pump efficiency: 75-85%",
      "Water temperature: 15-25°C (60-77°F)",
      "Reliable water source",
      "Compliant with NFPA 20 requirements"
    ]
  }
};

export function calculateFirePump(inputs, unitsMode = 'metric') {
  let { flowRate, totalHead, suction = 0, elevation = 0 } = inputs;
  const warnings = [];

  // Convert to metric
  if (unitsMode === 'imperial') {
    flowRate = flowRate * 3.785; // GPM to L/min
    totalHead = totalHead * 0.0689; // psi to bar
    suction = suction * 0.0689;
    elevation = elevation * 0.3048; // ft to m
  }

  // Convert pressure to head (1 bar = 10.2 m of water)
  const totalHeadM = totalHead * 10.2;
  const suctionHeadM = suction * 10.2;
  const elevationLossM = elevation;

  // Calculate required pump head
  const pumpHead = totalHeadM + elevationLossM - suctionHeadM;

  // Calculate pump power: P = (Q × H × ρ × g) / (3600 × η)
  // Q in L/min, H in m, ρ = 1000 kg/m³, g = 9.81 m/s², η = 0.75
  const flowM3h = flowRate * 60 / 1000;
  const efficiency = 0.75;
  const pumpPowerKW = (flowM3h * pumpHead * 1000 * 9.81) / (3600 * 1000 * efficiency);

  // Recommended pump size (next standard size up)
  const standardSizes = [500, 750, 1000, 1250, 1500, 2000, 2500, 3000, 3500, 4000, 5000];
  const flowGPM = flowRate / 3.785;
  const recommendedSizeGPM = standardSizes.find(size => size >= flowGPM * 1.1) || flowGPM * 1.1;
  const recommendedSize = recommendedSizeGPM * 3.785;

  // NPSH (simplified estimate)
  const npshRequired = 3 + (flowRate / 2000); // meters

  // Warnings
  if (pumpHead > 120) {
    warnings.push(unitsMode === 'metric'
      ? 'رأس المضخة مرتفع جداً - قد تحتاج مضخات متعددة'
      : 'Pump head very high - may need multiple pumps');
  }
  if (suction < 0.5 && unitsMode === 'metric') {
    warnings.push('ضغط الشفط منخفض - تأكد من NPSH المتاح');
  }

  const outputs = {
    pumpHead: unitsMode === 'metric'
      ? Math.round(pumpHead * 10) / 10
      : Math.round(pumpHead / 0.3048 * 10) / 10,
    pumpPower: unitsMode === 'metric'
      ? Math.round(pumpPowerKW * 10) / 10
      : Math.round(pumpPowerKW * 1.341 * 10) / 10,
    recommendedSize: unitsMode === 'metric'
      ? Math.round(recommendedSize)
      : Math.round(recommendedSizeGPM),
    npshRequired: unitsMode === 'metric'
      ? Math.round(npshRequired * 10) / 10
      : Math.round(npshRequired / 0.3048 * 10) / 10
  };

  return { outputs, warnings };
}

export const firePumpDefaults = {
  metric: { flowRate: 1900, totalHead: 7, suction: 2, elevation: 30 },
  imperial: { flowRate: 500, totalHead: 100, suction: 30, elevation: 100 }
};

export const firePumpRelated = ['hazen-williams-friction-loss'];