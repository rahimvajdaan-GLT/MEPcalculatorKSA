// Drainage Sizing Calculator
// Based on IPC/UPC standards

export const drainageSizingConfig = {
  ar: {
    title: "حاسبة تصميم شبكة الصرف",
    description: "حساب أبعاد أنابيب الصرف الصحي بناءً على وحدات تصريف التركيبات",
    introContent: `
تساعد هذه الحاسبة في تحديد أقطار أنابيب الصرف الصحي المناسبة بناءً على عدد ونوع التركيبات الصحية.

## وحدات تصريف التركيبات (DFU)

| التركيب الصحي | وحدات التصريف |
|--------------|---------------|
| حوض غسيل | 1 |
| مرحاض | 4 |
| بانيو/دش | 2 |
| غسالة أطباق | 2 |
| غسالة ملابس | 3 |
| مطبخ مع غسالة | 3 |

## قواعد التصميم

1. **الميل الأدنى**: 1% للأنابيب 3 بوصة فأكثر، 2% للأصغر
2. **السرعة الذاتية**: 0.6-3.0 م/ث
3. **التهوية**: ضرورية لمنع سحب المياه من السيفون

## أقطار الأنابيب القياسية

| الحد الأقصى DFU | قطر الأنبوب |
|-----------------|------------|
| 3 | 50 مم (2") |
| 6 | 65 مم (2.5") |
| 20 | 75 مم (3") |
| 160 | 100 مم (4") |
| 360 | 125 مم (5") |
| 620 | 150 مم (6") |
    `,
    inputs: {
      drainageUnits: { label: "وحدات تصريف التركيبات (DFU)", unit: "" },
      pipeType: { label: "نوع الأنبوب", unit: "" },
      slope: { label: "ميل الأنبوب", unit: { metric: "%", imperial: "%" } }
    },
    outputs: {
      pipeDiameter: { label: "قطر الأنبوب المطلوب", unit: { metric: "مم", imperial: "بوصة" } },
      maxDfu: { label: "الحد الأقصى للوحدات", unit: "" },
      velocity: { label: "السرعة التقريبية", unit: { metric: "م/ث", imperial: "قدم/ث" } },
      flowCapacity: { label: "سعة التدفق", unit: { metric: "لتر/ث", imperial: "GPM" } }
    },
    faq: [
      { question: "ما الفرق بين DFU و WSFU؟", answer: "DFU لأنابيب الصرف، WSFU لأنابيب الإمداد." },
      { question: "لماذا نحتاج ميل في الأنابيب؟", answer: "لضمان التدفق بالجاذبية ومنع الترسبات." },
      { question: "ما أهمية التهوية؟", answer: "تمنع سحب المياه من السيفون وتضمن تدفق سليم." },
      { question: "هل يمكن استخدام PVC للصرف؟", answer: "نعم، شائع الاستخدام وسهل التركيب." }
    ],
    assumptions: [
      "أنبوب ممتلئ جزئياً (50-75%)",
      "ميل موحد على طول الأنبوب",
      "نظام تهوية مناسب",
      "لا يوجد انسدادات"
    ]
  },
  en: {
    title: "Drainage Sizing Calculator",
    description: "Calculate drainage pipe dimensions based on drainage fixture units",
    introContent: `
This calculator helps determine appropriate drainage pipe diameters based on the number and type of plumbing fixtures.

## Drainage Fixture Units (DFU)

| Fixture | DFU |
|---------|-----|
| Lavatory | 1 |
| Water Closet | 4 |
| Bathtub/Shower | 2 |
| Dishwasher | 2 |
| Clothes Washer | 3 |
| Kitchen with Disposal | 3 |

## Design Rules

1. **Minimum Slope**: 1% for 3" and larger pipes, 2% for smaller
2. **Self-cleaning Velocity**: 0.6-3.0 m/s
3. **Venting**: Essential to prevent trap siphoning

## Standard Pipe Diameters

| Max DFU | Pipe Diameter |
|---------|---------------|
| 3 | 50 mm (2") |
| 6 | 65 mm (2.5") |
| 20 | 75 mm (3") |
| 160 | 100 mm (4") |
| 360 | 125 mm (5") |
| 620 | 150 mm (6") |
    `,
    inputs: {
      drainageUnits: { label: "Drainage Fixture Units (DFU)", unit: "" },
      pipeType: { label: "Pipe Type", unit: "" },
      slope: { label: "Pipe Slope", unit: { metric: "%", imperial: "%" } }
    },
    outputs: {
      pipeDiameter: { label: "Required Pipe Diameter", unit: { metric: "mm", imperial: "in" } },
      maxDfu: { label: "Maximum DFU Allowed", unit: "" },
      velocity: { label: "Approximate Velocity", unit: { metric: "m/s", imperial: "ft/s" } },
      flowCapacity: { label: "Flow Capacity", unit: { metric: "L/s", imperial: "GPM" } }
    },
    faq: [
      { question: "What's the difference between DFU and WSFU?", answer: "DFU is for drainage pipes, WSFU is for supply pipes." },
      { question: "Why do pipes need slope?", answer: "To ensure gravity flow and prevent deposits." },
      { question: "Why is venting important?", answer: "Prevents trap siphoning and ensures proper flow." },
      { question: "Can PVC be used for drainage?", answer: "Yes, commonly used and easy to install." }
    ],
    assumptions: [
      "Pipe partially full (50-75%)",
      "Uniform slope along pipe",
      "Proper venting system",
      "No blockages"
    ]
  }
};

export function calculateDrainageSizing(inputs, unitsMode = 'metric') {
  let { drainageUnits, slope = 1 } = inputs;
  const warnings = [];

  // DFU to pipe size table
  const pipeSizeTable = [
    { maxDfu: 3, diameterMm: 50, diameterIn: 2 },
    { maxDfu: 6, diameterMm: 65, diameterIn: 2.5 },
    { maxDfu: 20, diameterMm: 75, diameterIn: 3 },
    { maxDfu: 160, diameterMm: 100, diameterIn: 4 },
    { maxDfu: 360, diameterMm: 125, diameterIn: 5 },
    { maxDfu: 620, diameterMm: 150, diameterIn: 6 },
    { maxDfu: 1400, diameterMm: 200, diameterIn: 8 }
  ];

  // Find appropriate pipe size
  const selectedPipe = pipeSizeTable.find(p => p.maxDfu >= drainageUnits) || pipeSizeTable[pipeSizeTable.length - 1];

  // Calculate approximate velocity (Manning's equation simplified)
  // V = (1/n) × R^(2/3) × S^(1/2)
  const n = 0.01; // PVC roughness
  const diameterM = selectedPipe.diameterMm / 1000;
  const hydraulicRadius = diameterM / 4; // for full pipe
  const slopeDecimal = slope / 100;
  const velocity = (1 / n) * Math.pow(hydraulicRadius, 2/3) * Math.pow(slopeDecimal, 0.5);

  // Flow capacity
  const area = Math.PI * Math.pow(diameterM / 2, 2);
  const flowCapacity = area * velocity * 0.5 * 1000; // 50% full, L/s

  // Warnings
  if (drainageUnits > selectedPipe.maxDfu) {
    warnings.push(unitsMode === 'metric'
      ? 'عدد الوحدات يتجاوز سعة الأنبوب'
      : 'DFU exceeds pipe capacity');
  }
  if (velocity < 0.6) {
    warnings.push(unitsMode === 'metric'
      ? 'السرعة منخفضة - زد الميل'
      : 'Low velocity - increase slope');
  }

  const outputs = {
    pipeDiameter: unitsMode === 'metric'
      ? selectedPipe.diameterMm
      : selectedPipe.diameterIn,
    maxDfu: selectedPipe.maxDfu,
    velocity: unitsMode === 'metric'
      ? Math.round(velocity * 100) / 100
      : Math.round(velocity / 0.3048 * 10) / 10,
    flowCapacity: unitsMode === 'metric'
      ? Math.round(flowCapacity * 10) / 10
      : Math.round(flowCapacity * 15.85 * 10) / 10
  };

  return { outputs, warnings };
}

export const drainageSizingDefaults = {
  metric: { drainageUnits: 20, slope: 1 },
  imperial: { drainageUnits: 20, slope: 1 }
};

export const drainageSizingRelated = ['water-supply-sizing', 'tank-sizing-refill-time'];