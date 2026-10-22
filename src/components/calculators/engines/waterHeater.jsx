// Water Heater Sizing Calculator
// Based on ASHRAE and industry standards

export const waterHeaterConfig = {
  ar: {
    title: "حاسبة حجم سخان المياه",
    description: "حساب سعة سخان المياه المطلوبة بناءً على الاستهلاك",
    introContent: `
تساعد هذه الحاسبة في تحديد حجم سخان المياه المناسب للمباني السكنية والتجارية.

## أنواع سخانات المياه

1. **سخان تخزين**: يخزن المياه الساخنة في خزان معزول
2. **سخان فوري**: يسخن المياه عند الطلب
3. **سخان حراري شمسي**: يستخدم الطاقة الشمسية
4. **مضخة حرارية**: كفاءة عالية

## معايير التصميم

| نوع المبنى | الاستهلاك اليومي |
|-----------|-----------------|
| شقة (2 غرفة) | 150-200 لتر |
| شقة (3 غرفة) | 200-300 لتر |
| فيلا | 300-500 لتر |
| فندق (لكل غرفة) | 100-150 لتر |
| مطعم (لكل مقعد) | 15-25 لتر |

## درجات الحرارة

- درجة التخزين: 60°C (لمنع البكتيريا)
- درجة التوزيع: 55°C
- درجة الاستخدام: 40-45°C

## معادلة الحساب

الطاقة = الحجم × ΔT × 1.16 / وقت الاسترداد
    `,
    inputs: {
      occupants: { label: "عدد المستخدمين", unit: "" },
      usagePerPerson: { label: "الاستهلاك لكل شخص", unit: { metric: "لتر/يوم", imperial: "جالون/يوم" } },
      inletTemp: { label: "درجة حرارة المياه الباردة", unit: { metric: "°س", imperial: "°ف" } },
      outletTemp: { label: "درجة حرارة المياه الساخنة", unit: { metric: "°س", imperial: "°ف" } },
      recoveryTime: { label: "وقت الاسترداد المطلوب", unit: { metric: "ساعة", imperial: "ساعة" } }
    },
    outputs: {
      tankVolume: { label: "حجم الخزان المطلوب", unit: { metric: "لتر", imperial: "جالون" } },
      heatingPower: { label: "قدرة التسخين", unit: { metric: "كيلوواط", imperial: "BTU/h" } },
      firstHourRating: { label: "تصنيف الساعة الأولى", unit: { metric: "لتر", imperial: "جالون" } },
      dailyEnergy: { label: "استهلاك الطاقة اليومي", unit: { metric: "كيلوواط ساعة", imperial: "kWh" } }
    },
    faq: [
      { question: "ما الفرق بين سخان التخزين والفوري؟", answer: "التخزين يحتاج مساحة ويحافظ على مخزون ساخن، الفوري موفر للمساحة لكن يحتاج قدرة أعلى." },
      { question: "ما هو تصنيف الساعة الأولى؟", answer: "كمية المياه الساخنة التي يمكن توفيرها في أول ساعة استخدام." },
      { question: "لماذا نخزن المياه عند 60°C؟", answer: "لمنع نمو بكتيريا الليجيونيلا الخطيرة." },
      { question: "كيف أختار بين الكهربائي والغاز؟", answer: "الغاز أسرع في التسخين، الكهربائي أسهل في التركيب والصيانة." }
    ],
    assumptions: [
      "استخدام موزع على اليوم",
      "كفاءة السخان 90%",
      "عزل جيد للخزان",
      "لا يوجد تسربات حرارية كبيرة"
    ]
  },
  en: {
    title: "Water Heater Sizing Calculator",
    description: "Calculate required water heater capacity based on consumption",
    introContent: `
This calculator helps determine the appropriate water heater size for residential and commercial buildings.

## Types of Water Heaters

1. **Storage Heater**: Stores hot water in insulated tank
2. **Tankless/Instant**: Heats water on demand
3. **Solar Thermal**: Uses solar energy
4. **Heat Pump**: High efficiency

## Design Standards

| Building Type | Daily Consumption |
|--------------|-------------------|
| Apartment (2BR) | 150-200 L |
| Apartment (3BR) | 200-300 L |
| Villa | 300-500 L |
| Hotel (per room) | 100-150 L |
| Restaurant (per seat) | 15-25 L |

## Temperatures

- Storage temperature: 60°C (to prevent bacteria)
- Distribution temperature: 55°C
- Use temperature: 40-45°C

## Calculation Formula

Energy = Volume × ΔT × 1.16 / Recovery Time
    `,
    inputs: {
      occupants: { label: "Number of Occupants", unit: "" },
      usagePerPerson: { label: "Usage per Person", unit: { metric: "L/day", imperial: "gal/day" } },
      inletTemp: { label: "Cold Water Temperature", unit: { metric: "°C", imperial: "°F" } },
      outletTemp: { label: "Hot Water Temperature", unit: { metric: "°C", imperial: "°F" } },
      recoveryTime: { label: "Required Recovery Time", unit: { metric: "hours", imperial: "hours" } }
    },
    outputs: {
      tankVolume: { label: "Required Tank Volume", unit: { metric: "liters", imperial: "gallons" } },
      heatingPower: { label: "Heating Power", unit: { metric: "kW", imperial: "BTU/h" } },
      firstHourRating: { label: "First Hour Rating", unit: { metric: "liters", imperial: "gallons" } },
      dailyEnergy: { label: "Daily Energy Consumption", unit: { metric: "kWh", imperial: "kWh" } }
    },
    faq: [
      { question: "What's the difference between storage and tankless?", answer: "Storage needs space and maintains hot supply, tankless is space-saving but needs higher power." },
      { question: "What is First Hour Rating?", answer: "Amount of hot water available in first hour of use." },
      { question: "Why store water at 60°C?", answer: "To prevent dangerous Legionella bacteria growth." },
      { question: "How to choose between electric and gas?", answer: "Gas heats faster, electric is easier to install and maintain." }
    ],
    assumptions: [
      "Usage distributed throughout day",
      "Heater efficiency 90%",
      "Well-insulated tank",
      "No significant heat losses"
    ]
  }
};

export function calculateWaterHeater(inputs, unitsMode = 'metric') {
  let { occupants = 4, usagePerPerson = 50, inletTemp = 20, outletTemp = 60, recoveryTime = 1 } = inputs;
  const warnings = [];

  // Convert to metric
  if (unitsMode === 'imperial') {
    usagePerPerson = usagePerPerson * 3.785;
    inletTemp = (inletTemp - 32) * 5/9;
    outletTemp = (outletTemp - 32) * 5/9;
  }

  // Calculate daily consumption
  const dailyConsumption = occupants * usagePerPerson;

  // Tank volume (peak hour = 70% of daily consumption for residential)
  const peakHourConsumption = dailyConsumption * 0.35; // 35% peak hour factor
  const tankVolume = Math.ceil(peakHourConsumption / 10) * 10; // Round to 10L

  // Temperature rise
  const deltaT = outletTemp - inletTemp;

  // Heating power: Q = m × c × ΔT / t
  // Q in kW, m in L, c = 4.186 kJ/kg°C, ΔT in °C, t in hours
  const heatingPower = (tankVolume * 4.186 * deltaT) / (recoveryTime * 3600);

  // First hour rating (tank + recovery)
  const recoveredWater = heatingPower * recoveryTime * 3600 / (4.186 * deltaT);
  const firstHourRating = tankVolume + recoveredWater;

  // Daily energy consumption
  const dailyEnergy = (dailyConsumption * 4.186 * deltaT) / (3600 * 0.9); // 90% efficiency

  // Warnings
  if (outletTemp > 70) {
    warnings.push(unitsMode === 'metric'
      ? 'درجة الحرارة عالية جداً - خطر الحروق'
      : 'Temperature too high - burn risk');
  }
  if (tankVolume > 500) {
    warnings.push(unitsMode === 'metric'
      ? 'حجم كبير - فكر في سخانات متعددة'
      : 'Large volume - consider multiple heaters');
  }

  const outputs = {
    tankVolume: unitsMode === 'metric'
      ? Math.round(tankVolume)
      : Math.round(tankVolume / 3.785),
    heatingPower: unitsMode === 'metric'
      ? Math.round(heatingPower * 10) / 10
      : Math.round(heatingPower * 3412),
    firstHourRating: unitsMode === 'metric'
      ? Math.round(firstHourRating)
      : Math.round(firstHourRating / 3.785),
    dailyEnergy: Math.round(dailyEnergy * 10) / 10
  };

  return { outputs, warnings };
}

export const waterHeaterDefaults = {
  metric: { occupants: 4, usagePerPerson: 50, inletTemp: 20, outletTemp: 60, recoveryTime: 1 },
  imperial: { occupants: 4, usagePerPerson: 13, inletTemp: 68, outletTemp: 140, recoveryTime: 1 }
};

export const waterHeaterRelated = ['water-supply-sizing', 'tank-sizing-refill-time'];