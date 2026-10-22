// Tank Sizing and Refill Time Calculator
// Based on plumbing codes and local requirements

export const tankSizingConfig = {
  version: "1.0",
  ar: {
    title: "حاسبة حجم الخزان ووقت التعبئة",
    description: "حساب سعة خزان المياه المطلوبة ووقت إعادة التعبئة",
    introContent: `
تساعد هذه الحاسبة في تحديد حجم خزان المياه المناسب للمباني السكنية والتجارية، بالإضافة إلى حساب الوقت اللازم لإعادة تعبئة الخزان.

## أهمية التصميم الصحيح للخزانات

1. **ضمان الإمداد**: توفير مياه كافية خلال فترات انقطاع الشبكة
2. **الضغط المناسب**: ارتفاع الخزان يؤثر على ضغط المياه
3. **متطلبات الإطفاء**: بعض المباني تتطلب احتياطي للإطفاء
4. **كفاءة المضخات**: حجم مناسب يحسن عمر المضخات

## معايير التصميم السعودية

حسب كود البناء السعودي ومتطلبات شركة المياه:
- سعة يوم واحد على الأقل للمباني السكنية
- سعة يومين للمباني التجارية
- خزان علوي + خزان أرضي في معظم الحالات

## حساب الاستهلاك اليومي

| نوع المبنى | الاستهلاك |
|-----------|----------|
| شقة سكنية | 200-300 لتر/شخص/يوم |
| فيلا | 300-500 لتر/شخص/يوم |
| مكتب | 50-80 لتر/شخص/يوم |
| فندق | 300-400 لتر/غرفة/يوم |
| مطعم | 70-100 لتر/مقعد/يوم |
    `,
    inputs: {
      dailyDemand: { label: "الاستهلاك اليومي", unit: { metric: "لتر", imperial: "جالون" } },
      storageDays: { label: "أيام التخزين", unit: "" },
      inletPipeSize: { label: "قطر أنبوب التغذية", unit: { metric: "مم", imperial: "بوصة" } },
      supplyPressure: { label: "ضغط الإمداد", unit: { metric: "بار", imperial: "psi" } }
    },
    outputs: {
      tankVolume: { label: "حجم الخزان المطلوب", unit: { metric: "لتر", imperial: "جالون" } },
      tankVolumeM3: { label: "حجم الخزان", unit: { metric: "م³", imperial: "قدم³" } },
      refillTime: { label: "وقت إعادة التعبئة", unit: { metric: "ساعة", imperial: "ساعة" } },
      inletFlowRate: { label: "معدل التدفق المتوقع", unit: { metric: "لتر/دقيقة", imperial: "GPM" } }
    },
    faq: [
      { question: "ما هي سعة التخزين الموصى بها؟", answer: "يوم واحد للسكني، يومين للتجاري، مع مراعاة متطلبات الإطفاء." },
      { question: "هل أحتاج خزان علوي وأرضي؟", answer: "نعم في معظم الحالات، الأرضي للتخزين والعلوي للضغط." },
      { question: "ما ارتفاع الخزان العلوي المناسب؟", answer: "3-5 متر فوق أعلى نقطة استخدام لضمان ضغط كافٍ." },
      { question: "كيف أحسب استهلاك المبنى؟", answer: "اجمع استهلاك جميع الوحدات حسب الجداول المرجعية." }
    ],
    assumptions: [
      "ضغط الشبكة مستقر",
      "أنبوب التغذية بحالة جيدة",
      "معامل احتكاك قياسي",
      "لا يوجد استخدام متزامن عند التعبئة"
    ]
  },
  en: {
    title: "Tank Sizing & Refill Time Calculator",
    description: "Calculate required water tank capacity and refill time",
    introContent: `
This calculator helps determine the appropriate water tank size for residential and commercial buildings, as well as calculating the time needed to refill the tank.

## Importance of Proper Tank Design

1. **Ensure Supply**: Provide adequate water during network outages
2. **Proper Pressure**: Tank height affects water pressure
3. **Fire Requirements**: Some buildings require fire reserve
4. **Pump Efficiency**: Proper sizing improves pump life

## Saudi Design Standards

Per Saudi Building Code and water company requirements:
- Minimum one-day capacity for residential buildings
- Two-day capacity for commercial buildings
- Overhead tank + ground tank in most cases

## Daily Consumption Calculation

| Building Type | Consumption |
|--------------|-------------|
| Residential Apartment | 200-300 L/person/day |
| Villa | 300-500 L/person/day |
| Office | 50-80 L/person/day |
| Hotel | 300-400 L/room/day |
| Restaurant | 70-100 L/seat/day |
    `,
    inputs: {
      dailyDemand: { label: "Daily Demand", unit: { metric: "liters", imperial: "gallons" } },
      storageDays: { label: "Storage Days", unit: "" },
      inletPipeSize: { label: "Inlet Pipe Diameter", unit: { metric: "mm", imperial: "in" } },
      supplyPressure: { label: "Supply Pressure", unit: { metric: "bar", imperial: "psi" } }
    },
    outputs: {
      tankVolume: { label: "Required Tank Volume", unit: { metric: "liters", imperial: "gallons" } },
      tankVolumeM3: { label: "Tank Volume", unit: { metric: "m³", imperial: "ft³" } },
      refillTime: { label: "Refill Time", unit: { metric: "hours", imperial: "hours" } },
      inletFlowRate: { label: "Expected Flow Rate", unit: { metric: "L/min", imperial: "GPM" } }
    },
    faq: [
      { question: "What is the recommended storage capacity?", answer: "One day for residential, two days for commercial, considering fire requirements." },
      { question: "Do I need both overhead and ground tanks?", answer: "Yes in most cases, ground for storage and overhead for pressure." },
      { question: "What is the appropriate overhead tank height?", answer: "3-5 meters above highest point of use to ensure adequate pressure." },
      { question: "How do I calculate building consumption?", answer: "Sum consumption of all units per reference tables." }
    ],
    assumptions: [
      "Stable network pressure",
      "Inlet pipe in good condition",
      "Standard friction factor",
      "No simultaneous use during filling"
    ]
  }
};

export function calculateTankSizing(inputs, unitsMode = 'metric') {
  let { dailyDemand, storageDays = 1, inletPipeSize = 25, supplyPressure = 2 } = inputs;
  const warnings = [];

  // Convert to metric
  if (unitsMode === 'imperial') {
    dailyDemand = dailyDemand * 3.785; // gallons to liters
    inletPipeSize = inletPipeSize * 25.4; // inches to mm
    supplyPressure = supplyPressure * 0.0689; // psi to bar
  }

  // Calculate tank volume
  const tankVolume = dailyDemand * storageDays;
  const tankVolumeM3 = tankVolume / 1000;

  // Calculate inlet flow rate based on pipe size and pressure
  // Simplified: Q = 0.65 × A × √(2gH)
  const pipeDiameterM = inletPipeSize / 1000;
  const pipeArea = Math.PI * Math.pow(pipeDiameterM / 2, 2);
  const headM = supplyPressure * 10.2; // bar to meters
  const flowRateM3s = 0.65 * pipeArea * Math.sqrt(2 * 9.81 * headM);
  const flowRateLpm = flowRateM3s * 60000;

  // Calculate refill time
  const refillTimeMinutes = tankVolume / flowRateLpm;
  const refillTimeHours = refillTimeMinutes / 60;

  // Warnings
  if (refillTimeHours > 8) {
    warnings.push(unitsMode === 'metric'
      ? 'وقت التعبئة طويل - قد تحتاج أنبوب أكبر'
      : 'Long refill time - may need larger pipe');
  }
  if (storageDays < 1) {
    warnings.push(unitsMode === 'metric'
      ? 'سعة التخزين أقل من يوم واحد'
      : 'Storage capacity less than one day');
  }

  const outputs = {
    tankVolume: unitsMode === 'metric'
      ? Math.round(tankVolume)
      : Math.round(tankVolume / 3.785),
    tankVolumeM3: unitsMode === 'metric'
      ? Math.round(tankVolumeM3 * 10) / 10
      : Math.round(tankVolumeM3 * 35.315 * 10) / 10,
    refillTime: Math.round(refillTimeHours * 10) / 10,
    inletFlowRate: unitsMode === 'metric'
      ? Math.round(flowRateLpm * 10) / 10
      : Math.round(flowRateLpm / 3.785 * 10) / 10
  };

  return { outputs, warnings };
}

export const tankSizingDefaults = {
  metric: { dailyDemand: 5000, storageDays: 1, inletPipeSize: 25, supplyPressure: 2 },
  imperial: { dailyDemand: 1300, storageDays: 1, inletPipeSize: 1, supplyPressure: 30 }
};

export const tankSizingRelated = ['water-supply-sizing', 'water-heater-sizing'];