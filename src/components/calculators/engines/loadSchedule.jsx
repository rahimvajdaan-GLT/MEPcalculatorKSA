// Load Schedule Summary Calculator

export const loadScheduleConfig = {
  version: "2.0",
  useCustomPage: true,
  customPageAR: 'AR_LoadSchedule_Calculator',
  customPageEN: 'EN_LoadSchedule_Calculator',
  ar: {
    title: "ملخص جدول الأحمال الكهربائية",
    description: "إعداد ملخص جدول الأحمال الكهربائية يدوياً مع حسابات تلقائية وإدارة اللوحات",
    inputs: {
      loads: { label: "الأحمال", unit: "" }
    },
    outputs: {
      totalConnected: { label: "إجمالي الحمل المركب", unit: { metric: "كيلوواط", imperial: "كيلوواط" } },
      totalDemand: { label: "إجمالي الحمل الفعلي", unit: { metric: "كيلوواط", imperial: "كيلوواط" } },
      current1ph: { label: "التيار المقدر (أحادي)", unit: { metric: "أمبير", imperial: "أمبير" } },
      current3ph: { label: "التيار المقدر (ثلاثي)", unit: { metric: "أمبير", imperial: "أمبير" } }
    },
    faq: [
      { question: "ما الفرق بين الحمل المركب والفعلي؟", answer: "الحمل المركب هو مجموع كل الأحمال، الفعلي بعد تطبيق معامل التزامن." },
      { question: "كيف أحسب معامل التزامن؟", answer: "يعتمد على نوع المبنى، عادة 0.6-0.8 للسكني، 0.7-0.9 للتجاري." }
    ],
    assumptions: [
      "جهد مقنن 230V أحادي، 400V ثلاثي",
      "معامل قدرة متوسط 0.85",
      "حمل متوازن للثلاثي"
    ]
  },
  en: {
    title: "Load Schedule Summary",
    description: "Prepare electrical load schedule summary manually with automatic calculations and panel management",
    inputs: {
      loads: { label: "Loads", unit: "" }
    },
    outputs: {
      totalConnected: { label: "Total Connected Load", unit: { metric: "kW", imperial: "kW" } },
      totalDemand: { label: "Total Demand Load", unit: { metric: "kW", imperial: "kW" } },
      current1ph: { label: "Estimated Current (1ph)", unit: { metric: "A", imperial: "A" } },
      current3ph: { label: "Estimated Current (3ph)", unit: { metric: "A", imperial: "A" } }
    },
    faq: [
      { question: "Difference between connected and demand load?", answer: "Connected is sum of all loads, demand after diversity factor applied." },
      { question: "How to calculate diversity?", answer: "Depends on building type, typically 0.6-0.8 for residential, 0.7-0.9 for commercial." }
    ],
    assumptions: [
      "Rated voltage 230V single-phase, 400V three-phase",
      "Average power factor 0.85",
      "Balanced load for three-phase"
    ]
  }
};

export function calculateLoadSchedule(inputs, unitsMode = 'metric') {
  const warnings = [];
  const errors = [];
  let { loads = [] } = inputs;

  // Ensure loads is an array
  if (!Array.isArray(loads)) {
    loads = [];
  }

  if (loads.length === 0) {
    errors.push(unitsMode === 'metric' ? 'لا توجد أحمال - أضف صف واحد على الأقل' : 'No loads - add at least one row');
    return { outputs: {}, warnings: [], errors };
  }

  // Process each load
  const results = [];
  let totalConnectedKW = 0;
  let totalConnectedKVA = 0;
  let totalDemandKW = 0;
  let totalDemandKVA = 0;

  loads.forEach((load, index) => {
    const qty = parseFloat(load.qty) || 0;
    const value = parseFloat(load.value) || 0;
    const pf = Math.max(0.1, Math.min(1.0, parseFloat(load.pf) || 0.9));
    const demandFactor = Math.max(0, Math.min(1.0, parseFloat(load.demandFactor) || 1.0));
    const voltage = parseFloat(load.voltage) || (load.phase === '1P' ? 230 : 400);
    
    let connectedKW = 0;
    let connectedKVA = 0;
    
    if (load.unit === 'kW') {
      connectedKW = value * qty;
      connectedKVA = connectedKW / pf;
    } else if (load.unit === 'kVA') {
      connectedKVA = value * qty;
      connectedKW = connectedKVA * pf;
    } else if (load.unit === 'A') {
      if (load.phase === '1P') {
        connectedKVA = (voltage * value * qty) / 1000;
      } else {
        connectedKVA = (Math.sqrt(3) * voltage * value * qty) / 1000;
      }
      connectedKW = connectedKVA * pf;
    }
    
    const demandKW = connectedKW * demandFactor;
    const demandKVA = connectedKVA * demandFactor;
    
    let current = 0;
    if (load.phase === '1P') {
      current = voltage > 0 ? (demandKVA * 1000) / voltage : 0;
    } else {
      current = voltage > 0 ? (demandKVA * 1000) / (Math.sqrt(3) * voltage) : 0;
    }
    
    totalConnectedKW += connectedKW;
    totalConnectedKVA += connectedKVA;
    totalDemandKW += demandKW;
    totalDemandKVA += demandKVA;
    
    results.push({
      ...load,
      connectedKW: Math.round(connectedKW * 100) / 100,
      connectedKVA: Math.round(connectedKVA * 100) / 100,
      demandKW: Math.round(demandKW * 100) / 100,
      demandKVA: Math.round(demandKVA * 100) / 100,
      current: Math.round(current * 10) / 10
    });
    
    // Row warnings
    if (value === 0) {
      warnings.push(`Row ${index + 1}: Value is zero`);
    }
    if (voltage === 0) {
      warnings.push(`Row ${index + 1}: Voltage is zero`);
    }
  });

  const current3P = totalConnectedKVA > 0 ? (totalDemandKVA * 1000) / (Math.sqrt(3) * 400) : 0;
  const current1P = totalConnectedKVA > 0 ? (totalDemandKVA * 1000) / 230 : 0;
  const diversityRatio = totalConnectedKW > 0 ? (totalDemandKW / totalConnectedKW) * 100 : 0;

  const outputs = {
    totalConnectedKW: Math.round(totalConnectedKW * 10) / 10,
    totalConnectedKVA: Math.round(totalConnectedKVA * 10) / 10,
    totalDemandKW: Math.round(totalDemandKW * 10) / 10,
    totalDemandKVA: Math.round(totalDemandKVA * 10) / 10,
    current3P: Math.round(current3P * 10) / 10,
    current1P: Math.round(current1P * 10) / 10,
    diversityRatio: Math.round(diversityRatio * 10) / 10,
    results
  };

  if (diversityRatio < 40) {
    warnings.push(unitsMode === 'metric' ? 'معامل تنوع منخفض جداً - تحقق من معاملات الطلب' : 'Very low diversity - verify demand factors');
  }

  return { outputs, warnings, errors };
}

export const loadScheduleDefaults = {
  metric: { 
    loads: [
      { id: 1, panel: 'MDB-01', panelType: 'MDB', name: 'Main Incomer', qty: 1, phase: '3P', voltage: 400, unit: 'kW', value: 100, pf: 0.9, demandFactor: 1.0 }
    ]
  },
  imperial: { 
    loads: [
      { id: 1, panel: 'MDB-01', panelType: 'MDB', name: 'Main Incomer', qty: 1, phase: '3P', voltage: 400, unit: 'kW', value: 100, pf: 0.9, demandFactor: 1.0 }
    ]
  }
};

export const loadScheduleRelated = ['transformer-sizing', 'breaker-sizing'];