// Chilled Water Pipe Sizing Calculator
// Based on ASHRAE and industry standards

export const chilledWaterPipeConfig = {
  version: "1.1",
  ar: {
    title: "حاسبة أبعاد أنابيب المياه المبردة",
    description: "حساب قطر أنابيب المياه المبردة بناءً على الحمل الحراري ومعدل التدفق",
    introContent: `
تعد حاسبة أبعاد أنابيب المياه المبردة أداة أساسية لمهندسي التكييف. تساعد في تحديد القطر الأمثل لأنابيب المياه المبردة لضمان كفاءة نظام التبريد.

## ما هي المياه المبردة؟

المياه المبردة هي المياه المستخدمة كوسيط نقل للحرارة في أنظمة التكييف المركزي. تبرد المياه في وحدة التبريد (Chiller) ثم توزع عبر شبكة أنابيب إلى وحدات المناولة الهوائية (AHU) ووحدات المروحة الحلزونية (FCU).

## أهمية التصميم الصحيح

1. **كفاءة النظام**: الأقطار المناسبة تقلل فقدان الضغط واستهلاك الطاقة
2. **التكلفة**: التوازن بين تكلفة المواد وتكلفة التشغيل
3. **الصيانة**: السرعات المناسبة تقلل التآكل والضوضاء
4. **التحكم**: الأداء الهيدروليكي الجيد يحسن التحكم في درجة الحرارة

## المعادلات المستخدمة

### حساب معدل التدفق
Q (m³/h) = Load (kW) × 0.86 / ΔT

حيث ΔT هو فرق درجة الحرارة (عادة 5°C)

### حساب القطر
d = √(4 × Q / π × V)

## السرعات الموصى بها

| موقع الأنبوب | السرعة الموصى بها |
|-------------|------------------|
| خط رئيسي | 1.5 - 3.0 م/ث |
| فرع | 1.0 - 2.5 م/ث |
| اتصالات المعدات | 0.5 - 1.5 م/ث |
    `,
    inputs: {
      coolingLoad: { label: "الحمل الحراري", unit: { metric: "كيلوواط", imperial: "طن تبريد" } },
      deltaT: { label: "فرق درجة الحرارة", unit: { metric: "°س", imperial: "°ف" } },
      velocity: { label: "السرعة المطلوبة", unit: { metric: "م/ث", imperial: "قدم/ث" } }
    },
    outputs: {
      flowRate: { label: "معدل التدفق", unit: { metric: "م³/ساعة", imperial: "GPM" } },
      pipeDiameter: { label: "قطر الأنبوب", unit: { metric: "مم", imperial: "بوصة" } },
      actualVelocity: { label: "السرعة الفعلية", unit: { metric: "م/ث", imperial: "قدم/ث" } },
      frictionLoss: { label: "فقدان الاحتكاك", unit: { metric: "كيلوباسكال/م", imperial: "قدم/100 قدم" } }
    },
    faq: [
      { question: "ما هو فرق درجة الحرارة المعتاد؟", answer: "عادة 5°C (9°F) للأنظمة التقليدية، و6-7°C للأنظمة عالية الكفاءة." },
      { question: "ما الحد الأقصى للسرعة؟", answer: "3 م/ث للأنابيب الرئيسية لتجنب الضوضاء والتآكل." },
      { question: "ما نوع الأنابيب المستخدم؟", answer: "عادة حديد أسود جدول 40، أو نحاس للأقطار الصغيرة." },
      { question: "هل يجب عزل الأنابيب؟", answer: "نعم، لمنع التكاثف وفقدان الحرارة." }
    ],
    assumptions: [
      "كثافة المياه: 1000 كجم/م³",
      "حرارة نوعية: 4.186 كيلوجول/كجم·°س",
      "أنبوب حديد أسود جدول 40",
      "نظام مغلق"
    ]
  },
  en: {
    title: "Chilled Water Pipe Sizing Calculator",
    description: "Calculate chilled water pipe diameter based on cooling load and flow rate",
    introContent: `
The Chilled Water Pipe Sizing Calculator is an essential tool for HVAC engineers. It helps determine the optimal pipe diameter for chilled water to ensure cooling system efficiency.

## What is Chilled Water?

Chilled water is water used as a heat transfer medium in central air conditioning systems. Water is cooled in the chiller and distributed through a pipe network to Air Handling Units (AHUs) and Fan Coil Units (FCUs).

## Importance of Proper Design

1. **System Efficiency**: Proper diameters reduce pressure loss and energy consumption
2. **Cost**: Balance between material cost and operating cost
3. **Maintenance**: Proper velocities reduce erosion and noise
4. **Control**: Good hydraulic performance improves temperature control

## Formulas Used

### Flow Rate Calculation
Q (m³/h) = Load (kW) × 0.86 / ΔT

Where ΔT is temperature difference (typically 5°C)

### Diameter Calculation
d = √(4 × Q / π × V)

## Recommended Velocities

| Pipe Location | Recommended Velocity |
|--------------|---------------------|
| Main Line | 1.5 - 3.0 m/s |
| Branch | 1.0 - 2.5 m/s |
| Equipment Connections | 0.5 - 1.5 m/s |
    `,
    inputs: {
      coolingLoad: { label: "Cooling Load", unit: { metric: "kW", imperial: "Tons" } },
      deltaT: { label: "Temperature Difference", unit: { metric: "°C", imperial: "°F" } },
      velocity: { label: "Required Velocity", unit: { metric: "m/s", imperial: "ft/s" } }
    },
    outputs: {
      flowRate: { label: "Flow Rate", unit: { metric: "m³/h", imperial: "GPM" } },
      pipeDiameter: { label: "Pipe Diameter", unit: { metric: "mm", imperial: "in" } },
      actualVelocity: { label: "Actual Velocity", unit: { metric: "m/s", imperial: "ft/s" } },
      frictionLoss: { label: "Friction Loss", unit: { metric: "kPa/m", imperial: "ft/100ft" } }
    },
    faq: [
      { question: "What is the typical temperature difference?", answer: "Usually 5°C (9°F) for conventional systems, 6-7°C for high-efficiency systems." },
      { question: "What is the maximum velocity?", answer: "3 m/s for main pipes to avoid noise and erosion." },
      { question: "What type of pipe is used?", answer: "Usually black steel schedule 40, or copper for small diameters." },
      { question: "Should pipes be insulated?", answer: "Yes, to prevent condensation and heat loss." }
    ],
    assumptions: [
      "Water density: 1000 kg/m³",
      "Specific heat: 4.186 kJ/kg·°C",
      "Black steel pipe schedule 40",
      "Closed loop system"
    ]
  }
};

export function calculateChilledWaterPipe(inputs, unitsMode = 'metric', language = 'en') {
  let { coolingLoad, deltaT = 5, velocity = 2 } = inputs;
  const warnings = [];

  // Convert to metric
  if (unitsMode === 'imperial') {
    coolingLoad = coolingLoad * 3.517; // Tons to kW
    deltaT = deltaT / 1.8; // °F to °C
    velocity = velocity * 0.3048; // ft/s to m/s
  }

  // Calculate flow rate: Q = Load * 0.86 / ΔT (m³/h)
  const flowRate = (coolingLoad * 0.86) / deltaT;
  const flowRateM3s = flowRate / 3600;

  // Calculate required area and diameter
  const areaRequired = flowRateM3s / velocity;
  const diameterM = Math.sqrt((4 * areaRequired) / Math.PI);
  const diameterMm = diameterM * 1000;

  // Standard pipe sizes
  const standardSizes = [15, 20, 25, 32, 40, 50, 65, 80, 100, 125, 150, 200, 250, 300, 350, 400];
  let selectedDiameter = standardSizes.find(size => size >= diameterMm) || diameterMm;

  // Calculate actual velocity
  const actualArea = Math.PI * Math.pow(selectedDiameter / 1000 / 2, 2);
  const actualVelocity = flowRateM3s / actualArea;

  // Friction loss (simplified)
  const frictionLoss = 0.1 * Math.pow(actualVelocity, 2) / (selectedDiameter / 1000);

  // Warnings
  if (actualVelocity > 3) {
    warnings.push(language === 'ar'
      ? 'السرعة عالية (> 3 م/ث) - قد تسبب ضوضاء وتآكل'
      : 'Velocity high (> 3 m/s) - may cause noise and erosion');
  }

  const outputs = {
    flowRate: unitsMode === 'metric'
      ? Math.round(flowRate * 10) / 10
      : Math.round(flowRate * 4.403 * 10) / 10,
    pipeDiameter: unitsMode === 'metric'
      ? selectedDiameter
      : Math.round(selectedDiameter / 25.4 * 10) / 10,
    actualVelocity: unitsMode === 'metric'
      ? Math.round(actualVelocity * 100) / 100
      : Math.round(actualVelocity / 0.3048 * 10) / 10,
    frictionLoss: unitsMode === 'metric'
      ? Math.round(frictionLoss * 100) / 100
      : Math.round(frictionLoss * 3.281 * 10) / 10
  };

  return { outputs, warnings };
}

export const chilledWaterPipeDefaults = {
  metric: { coolingLoad: 100, deltaT: 5, velocity: 2 },
  imperial: { coolingLoad: 30, deltaT: 9, velocity: 6 }
};

export const chilledWaterPipeRelated = ['pump-head-loss', 'duct-sizing'];