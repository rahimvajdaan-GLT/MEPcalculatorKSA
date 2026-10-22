// Water Supply Sizing Calculator
// Based on fixture units and pipe sizing tables

export const waterSupplyConfig = {
  ar: {
    title: "حاسبة تصميم شبكة المياه",
    description: "حساب أبعاد أنابيب إمداد المياه بناءً على وحدات التركيبات الصحية",
    introContent: `
تعد حاسبة تصميم شبكة المياه من الأدوات الأساسية لمهندسي السباكة. تساعد في تحديد أقطار الأنابيب المناسبة لضمان وصول المياه بضغط وتدفق كافيين لجميع التركيبات الصحية.

## ما هي وحدات التركيبات الصحية (Fixture Units)؟

وحدات التركيبات هي طريقة معيارية لتحويل متطلبات المياه لكل تركيب صحي إلى قيمة موحدة. تستند هذه الوحدات إلى معايير IPC و UPC.

| التركيب الصحي | وحدات إمداد المياه الباردة | وحدات المياه الساخنة |
|--------------|---------------------------|---------------------|
| حوض غسيل خاص | 1.0 | 1.0 |
| حوض غسيل عام | 2.0 | 1.5 |
| مرحاض (صمام تدفق) | 10.0 | - |
| مرحاض (خزان) | 2.5 | - |
| بانيو | 4.0 | 3.0 |
| دش | 2.0 | 2.0 |
| غسالة ملابس | 4.0 | 3.0 |

## أهمية التصميم الصحيح

1. **ضمان الضغط الكافي**: توفير ضغط مناسب في جميع الطوابق
2. **تجنب الضوضاء**: السرعات المناسبة تقلل صوت المياه
3. **منع التآكل**: الأقطار الصحيحة تحمي الأنابيب
4. **كفاءة التكلفة**: توازن بين تكلفة المواد والأداء

## المعايير المرجعية

- International Plumbing Code (IPC)
- Uniform Plumbing Code (UPC)
- كود البناء السعودي (SBC) - قسم السباكة
- ASHRAE Handbook - HVAC Applications

## متطلبات الضغط

| التركيب | الحد الأدنى للضغط |
|---------|------------------|
| صنبور عادي | 8 psi (0.55 bar) |
| صمام تدفق المرحاض | 15 psi (1.0 bar) |
| دش نفاث | 45 psi (3.1 bar) |
    `,
    inputs: {
      fixtureUnits: { label: "وحدات التركيبات الصحية", unit: "" },
      pipeType: { label: "نوع الأنبوب", unit: "" },
      supplyPressure: { label: "ضغط الإمداد", unit: { metric: "بار", imperial: "psi" } },
      buildingHeight: { label: "ارتفاع المبنى", unit: { metric: "متر", imperial: "قدم" } }
    },
    outputs: {
      pipeDiameter: { label: "قطر الأنبوب المطلوب", unit: { metric: "مم", imperial: "بوصة" } },
      flowRate: { label: "معدل التدفق المتوقع", unit: { metric: "لتر/دقيقة", imperial: "GPM" } },
      velocity: { label: "سرعة المياه", unit: { metric: "م/ث", imperial: "قدم/ث" } },
      availablePressure: { label: "الضغط المتاح في أعلى نقطة", unit: { metric: "بار", imperial: "psi" } }
    },
    faq: [
      { question: "ما الحد الأقصى لسرعة المياه في الأنابيب؟", answer: "2.4 م/ث (8 قدم/ث) للأنابيب المعدنية، 1.5 م/ث (5 قدم/ث) للبلاستيكية" },
      { question: "كيف أحسب وحدات التركيبات لمبنى كامل؟", answer: "اجمع وحدات جميع التركيبات، مع مراعاة عوامل التزامن" },
      { question: "ما الفرق بين IPC و UPC؟", answer: "معايير مختلفة قليلاً، IPC أكثر شيوعاً دولياً" },
      { question: "متى أحتاج مضخة تقوية؟", answer: "عندما يكون ضغط الشبكة العامة غير كافٍ للوصول لأعلى الطوابق" },
      { question: "ما هو الفرق بين المياه الباردة والساخنة في الحسابات؟", answer: "وحدات التركيبات تختلف قليلاً، والمياه الساخنة تحتاج عزل حراري" }
    ],
    assumptions: [
      "ضغط الشبكة العامة مستقر",
      "أنابيب بحالة جيدة بدون تسربات",
      "عامل تزامن قياسي للتركيبات",
      "درجة حرارة المياه 15-25°C"
    ]
  },
  en: {
    title: "Water Supply Sizing Calculator",
    description: "Calculate water supply pipe dimensions based on fixture units",
    introContent: `
The Water Supply Sizing Calculator is a fundamental tool for plumbing engineers. It helps determine appropriate pipe diameters to ensure water reaches all fixtures with adequate pressure and flow.

## What are Fixture Units?

Fixture units are a standardized method to convert water requirements for each plumbing fixture into a unified value. These units are based on IPC and UPC standards.

| Fixture | Cold Water Supply FU | Hot Water FU |
|---------|---------------------|--------------|
| Private Lavatory | 1.0 | 1.0 |
| Public Lavatory | 2.0 | 1.5 |
| Water Closet (flush valve) | 10.0 | - |
| Water Closet (tank) | 2.5 | - |
| Bathtub | 4.0 | 3.0 |
| Shower | 2.0 | 2.0 |
| Clothes Washer | 4.0 | 3.0 |

## Importance of Proper Design

1. **Ensure Adequate Pressure**: Provide suitable pressure on all floors
2. **Avoid Noise**: Proper velocities reduce water noise
3. **Prevent Erosion**: Correct diameters protect pipes
4. **Cost Efficiency**: Balance material cost and performance

## Reference Standards

- International Plumbing Code (IPC)
- Uniform Plumbing Code (UPC)
- Saudi Building Code (SBC) - Plumbing Section
- ASHRAE Handbook - HVAC Applications

## Pressure Requirements

| Fixture | Minimum Pressure |
|---------|------------------|
| Standard Faucet | 8 psi (0.55 bar) |
| Flush Valve WC | 15 psi (1.0 bar) |
| Jet Shower | 45 psi (3.1 bar) |
    `,
    inputs: {
      fixtureUnits: { label: "Total Fixture Units", unit: "" },
      pipeType: { label: "Pipe Type", unit: "" },
      supplyPressure: { label: "Supply Pressure", unit: { metric: "bar", imperial: "psi" } },
      buildingHeight: { label: "Building Height", unit: { metric: "m", imperial: "ft" } }
    },
    outputs: {
      pipeDiameter: { label: "Required Pipe Diameter", unit: { metric: "mm", imperial: "in" } },
      flowRate: { label: "Expected Flow Rate", unit: { metric: "L/min", imperial: "GPM" } },
      velocity: { label: "Water Velocity", unit: { metric: "m/s", imperial: "ft/s" } },
      availablePressure: { label: "Available Pressure at Top", unit: { metric: "bar", imperial: "psi" } }
    },
    faq: [
      { question: "What is the maximum water velocity in pipes?", answer: "2.4 m/s (8 ft/s) for metal pipes, 1.5 m/s (5 ft/s) for plastic" },
      { question: "How do I calculate fixture units for an entire building?", answer: "Sum all fixture units, considering diversity factors" },
      { question: "What is the difference between IPC and UPC?", answer: "Slightly different standards, IPC is more common internationally" },
      { question: "When do I need a booster pump?", answer: "When main supply pressure is insufficient to reach upper floors" },
      { question: "What is the difference between cold and hot water in calculations?", answer: "Fixture units differ slightly, and hot water needs thermal insulation" }
    ],
    assumptions: [
      "Stable main supply pressure",
      "Pipes in good condition without leaks",
      "Standard diversity factor for fixtures",
      "Water temperature 15-25°C (60-77°F)"
    ]
  }
};

// Fixture units to flow rate conversion (based on Hunter's curve)
function fixtureUnitsToGPM(fu) {
  if (fu <= 0) return 0;
  // Simplified Hunter's curve approximation
  if (fu <= 10) return fu * 2.5;
  if (fu <= 50) return 25 + (fu - 10) * 1.5;
  if (fu <= 100) return 85 + (fu - 50) * 1.0;
  if (fu <= 200) return 135 + (fu - 100) * 0.7;
  return 205 + (fu - 200) * 0.5;
}

// Pipe sizing based on flow and velocity
function getPipeDiameter(flowGPM, maxVelocityFps = 8) {
  // Q = A × V, A = π × d² / 4
  // d = √(4Q / πV)
  // Convert GPM to ft³/s: 1 GPM = 0.002228 ft³/s
  const flowCfs = flowGPM * 0.002228;
  const areaRequired = flowCfs / maxVelocityFps;
  const diameterFt = Math.sqrt((4 * areaRequired) / Math.PI);
  const diameterIn = diameterFt * 12;
  
  // Round up to standard pipe size
  const standardSizes = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12];
  for (const size of standardSizes) {
    if (size >= diameterIn) return size;
  }
  return diameterIn;
}

export function calculateWaterSupply(inputs, unitsMode = 'metric', language = 'en') {
  let { fixtureUnits, supplyPressure, buildingHeight, pipeType = 'copper' } = inputs;
  const warnings = [];

  // Convert inputs
  if (unitsMode === 'metric') {
    supplyPressure = supplyPressure * 14.504; // bar to psi
    buildingHeight = buildingHeight * 3.281; // m to ft
  }

  // Calculate flow rate
  const flowGPM = fixtureUnitsToGPM(fixtureUnits);

  // Max velocity based on pipe type
  const maxVelocity = pipeType === 'plastic' ? 5 : 8; // ft/s

  // Calculate pipe diameter
  const pipeDiameterIn = getPipeDiameter(flowGPM, maxVelocity);

  // Calculate actual velocity
  const pipeAreaFt2 = Math.PI * Math.pow(pipeDiameterIn / 12 / 2, 2);
  const actualVelocityFps = (flowGPM * 0.002228) / pipeAreaFt2;

  // Pressure loss due to elevation (0.433 psi per foot of elevation)
  const elevationLossPsi = buildingHeight * 0.433;
  const availablePressurePsi = supplyPressure - elevationLossPsi;

  // Warnings
  if (actualVelocityFps > maxVelocity) {
    warnings.push(language === 'ar'
      ? 'السرعة تتجاوز الحد المسموح'
      : 'Velocity exceeds recommended limit');
  }
  if (availablePressurePsi < 15) {
    warnings.push(language === 'ar'
      ? 'الضغط المتاح منخفض - قد تحتاج مضخة تقوية'
      : 'Available pressure is low - may need booster pump');
  }

  const outputs = {
    pipeDiameter: unitsMode === 'metric'
      ? Math.round(pipeDiameterIn * 25.4)
      : pipeDiameterIn,
    flowRate: unitsMode === 'metric'
      ? Math.round(flowGPM * 3.785)
      : Math.round(flowGPM * 10) / 10,
    velocity: unitsMode === 'metric'
      ? Math.round(actualVelocityFps * 0.3048 * 10) / 10
      : Math.round(actualVelocityFps * 10) / 10,
    availablePressure: unitsMode === 'metric'
      ? Math.round(availablePressurePsi * 0.0689 * 10) / 10
      : Math.round(availablePressurePsi * 10) / 10
  };

  return { outputs, warnings };
}

export const waterSupplyDefaults = {
  metric: { fixtureUnits: 50, supplyPressure: 4, buildingHeight: 15, pipeType: 'copper' },
  imperial: { fixtureUnits: 50, supplyPressure: 60, buildingHeight: 50, pipeType: 'copper' }
};

export const waterSupplyRelated = ['drainage-sizing', 'tank-sizing-refill-time', 'water-heater-sizing'];