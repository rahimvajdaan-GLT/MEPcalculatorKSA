import {
  parseNumber, clamp, round, safeDivide,
  calculateCurrent, findSuitableCableSizes,
  validateRequired, validateRange, validateInputs, KSA_DEFAULTS
} from './electricalUtils';

export const cableSizingConfig = {
  version: "2.0",
  ar: {
    title: "حاسبة اختيار مقاس الكابل",
    description: "اختيار مقاس الكابل بناءً على هبوط الجهد والسعة الحرارية للمشاريع السعودية",
    inputs: {
      system: { label: "النظام", unit: "" },
      voltage: { label: "الجهد", unit: { metric: "V", imperial: "V" } },
      loadType: { label: "نوع الحمل", unit: "" },
      loadValue: { label: "قيمة الحمل", unit: "" },
      pf: { label: "معامل القدرة", unit: "" },
      length: { label: "الطول", unit: { metric: "m", imperial: "m" } },
      conductor: { label: "نوع الموصل", unit: "" },
      maxVD: { label: "الحد الأقصى لهبوط الجهد", unit: { metric: "%", imperial: "%" } },
      deratingFactor: { label: "معامل التخفيض الإجمالي", unit: "" }
    },
    outputs: {
      designCurrent: { label: "تيار التصميم", unit: { metric: "A", imperial: "A" } },
      recommendedSize: { label: "المقاس الموصى به", unit: { metric: "mm²", imperial: "mm²" } },
      voltageDrop: { label: "هبوط الجهد المتوقع", unit: { metric: "%", imperial: "%" } }
    }
  },
  en: {
    title: "Cable Sizing Calculator",
    description: "Select cable size based on voltage drop and ampacity for Saudi projects",
    inputs: {
      system: { label: "System", unit: "" },
      voltage: { label: "Voltage", unit: { metric: "V", imperial: "V" } },
      loadType: { label: "Load Type", unit: "" },
      loadValue: { label: "Load Value", unit: "" },
      pf: { label: "Power Factor", unit: "" },
      length: { label: "Length", unit: { metric: "m", imperial: "m" } },
      conductor: { label: "Conductor", unit: "" },
      maxVD: { label: "Max Voltage Drop", unit: { metric: "%", imperial: "%" } },
      deratingFactor: { label: "Total Derating Factor", unit: "" }
    },
    outputs: {
      designCurrent: { label: "Design Current", unit: { metric: "A", imperial: "A" } },
      recommendedSize: { label: "Recommended Size", unit: { metric: "mm²", imperial: "mm²" } },
      voltageDrop: { label: "Expected Voltage Drop", unit: { metric: "%", imperial: "%" } }
    }
  }
};

export function calculateCableSizingResults(inputs, unitsMode = 'metric', language = 'en') {
  const warnings = [];
  const errors = [];

  // Parse inputs
  const system = inputs.system || '3P';
  const voltage_V = parseNumber(inputs.voltage, system === '3P' ? KSA_DEFAULTS.voltage_3P : KSA_DEFAULTS.voltage_1P);
  const loadType = inputs.loadType || inputs.unit || 'kW';
  const loadValue = parseNumber(inputs.loadValue, 0);
  const pf = parseNumber(inputs.pf, KSA_DEFAULTS.pf);
  const length_m = parseNumber(inputs.length, 0);
  const conductor = inputs.conductor || KSA_DEFAULTS.conductor;
  const maxVD_percent = parseNumber(inputs.maxVD, KSA_DEFAULTS.maxVD_percent);
  const deratingFactor = parseNumber(inputs.deratingFactor, KSA_DEFAULTS.deratingFactor);

  // Validation
  const validations = [
    validateRequired(voltage_V, 'Voltage'),
    validateRequired(loadValue, 'Load Value'),
    validateRange(pf, 'Power Factor', 0.1, 1.0),
    validateRequired(length_m, 'Length'),
    validateRange(maxVD_percent, 'Max VD %', 0.1, 10),
    validateRange(deratingFactor, 'Derating Factor', 0.1, 1.0)
  ];

  const validationErrors = validateInputs(validations);
  errors.push(...validationErrors);

  let outputs = {};
  let recommendations = [];

  if (errors.length === 0) {
    // Calculate design current
    let designCurrent_A;
    if (loadType === 'A') {
      designCurrent_A = loadValue;
    } else if (loadType === 'kVA') {
      const kVA = loadValue;
      if (system === '3P') {
        designCurrent_A = safeDivide(kVA * 1000, Math.sqrt(3) * voltage_V, 0);
      } else {
        designCurrent_A = safeDivide(kVA * 1000, voltage_V, 0);
      }
    } else {
      designCurrent_A = calculateCurrent(loadValue, voltage_V, pf, system);
    }

    // Apply derating factor for sizing
    const deratedCurrent = designCurrent_A / deratingFactor;

    // Find suitable sizes based on voltage drop
    const suitableSizes = findSuitableCableSizes(deratedCurrent, length_m, voltage_V, maxVD_percent, conductor, system, pf);

    if (suitableSizes.length === 0) {
      errors.push('No suitable cable size found - increase size or reduce length');
      outputs = {
        designCurrent: round(designCurrent_A, 1),
        recommendedSize: 0,
        voltageDrop: 0
      };
    } else {
      const recommended = suitableSizes[0];
      outputs = {
        designCurrent: round(designCurrent_A, 1),
        recommendedSize: recommended.size_mm2,
        voltageDrop: recommended.VD_percent,
        deratedCurrent: round(deratedCurrent, 1)
      };
      recommendations = suitableSizes.slice(0, 3);
    }

    // Warnings
    if (deratingFactor < 0.5) {
      warnings.push('Very low derating factor - verify installation conditions');
    }
    if (designCurrent_A > 630) {
      warnings.push('High current - consider parallel cables or busbar');
    }
  } else {
    outputs = {
      designCurrent: 0,
      recommendedSize: 0,
      voltageDrop: 0
    };
  }

  return { outputs, warnings, errors, recommendations };
}

export const cableSizingDefaults = {
  metric: {
    system: '3P',
    voltage: 400,
    loadType: 'kW',
    loadValue: 70,
    pf: 0.9,
    length: 50,
    conductor: 'Cu',
    maxVD: 3,
    deratingFactor: 0.8
  },
  imperial: {
    system: '3P',
    voltage: 400,
    loadType: 'kW',
    loadValue: 70,
    pf: 0.9,
    length: 50,
    conductor: 'Cu',
    maxVD: 3,
    deratingFactor: 0.8
  }
};

export const cableSizingRelated = ['voltage-drop', 'breaker-sizing', 'conduit-trunking-fill'];