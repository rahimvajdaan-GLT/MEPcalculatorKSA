import {
  parseNumber, clamp, round, safeDivide,
  calculateCurrent, calculateVoltageDrop, findSuitableCableSizes,
  STANDARD_CABLE_SIZES, validateRequired, validateRange, validateInputs, KSA_DEFAULTS
} from './electricalUtils';

export const voltageDropConfig = {
  version: "2.0",
  ar: {
    title: "حاسبة هبوط الجهد",
    description: "حساب هبوط الجهد في الكابلات الكهربائية وفق IEC للمشاريع السعودية",
    inputs: {
      system: { label: "النظام", unit: "" },
      voltage: { label: "الجهد", unit: { metric: "V", imperial: "V" } },
      loadMode: { label: "طريقة إدخال الحمل", unit: "" },
      current: { label: "التيار", unit: { metric: "A", imperial: "A" } },
      power: { label: "القدرة", unit: { metric: "kW", imperial: "kW" } },
      pf: { label: "معامل القدرة", unit: "" },
      length: { label: "الطول (اتجاه واحد)", unit: { metric: "m", imperial: "m" } },
      conductor: { label: "نوع الموصل", unit: "" },
      mode: { label: "الوضع", unit: "" },
      cableSize: { label: "مقاس الكابل", unit: { metric: "mm²", imperial: "mm²" } },
      maxVD: { label: "الحد الأقصى لهبوط الجهد", unit: { metric: "%", imperial: "%" } }
    },
    outputs: {
      designCurrent: { label: "تيار التصميم", unit: { metric: "A", imperial: "A" } },
      voltageDrop_V: { label: "هبوط الجهد", unit: { metric: "V", imperial: "V" } },
      voltageDrop_percent: { label: "هبوط الجهد", unit: { metric: "%", imperial: "%" } },
      status: { label: "النتيجة", unit: "" }
    }
  },
  en: {
    title: "Voltage Drop Calculator",
    description: "Calculate voltage drop in electrical cables per IEC for Saudi projects",
    inputs: {
      system: { label: "System", unit: "" },
      voltage: { label: "Voltage", unit: { metric: "V", imperial: "V" } },
      loadMode: { label: "Load Input Mode", unit: "" },
      current: { label: "Current", unit: { metric: "A", imperial: "A" } },
      power: { label: "Power", unit: { metric: "kW", imperial: "kW" } },
      pf: { label: "Power Factor", unit: "" },
      length: { label: "Length (one way)", unit: { metric: "m", imperial: "m" } },
      conductor: { label: "Conductor Type", unit: "" },
      mode: { label: "Mode", unit: "" },
      cableSize: { label: "Cable Size", unit: { metric: "mm²", imperial: "mm²" } },
      maxVD: { label: "Max Voltage Drop", unit: { metric: "%", imperial: "%" } }
    },
    outputs: {
      designCurrent: { label: "Design Current", unit: { metric: "A", imperial: "A" } },
      voltageDrop_V: { label: "Voltage Drop", unit: { metric: "V", imperial: "V" } },
      voltageDrop_percent: { label: "Voltage Drop", unit: { metric: "%", imperial: "%" } },
      status: { label: "Status", unit: "" }
    }
  }
};

export function calculateVoltageDropResults(inputs, unitsMode = 'metric') {
  const warnings = [];
  const errors = [];

  // Parse inputs
  const system = inputs.system || '3P';
  const voltage_V = parseNumber(inputs.voltage, system === '3P' ? KSA_DEFAULTS.voltage_3P : KSA_DEFAULTS.voltage_1P);
  const loadMode = inputs.loadMode || 'A';
  const current_input = parseNumber(inputs.current, 0);
  const power_kW = parseNumber(inputs.power, 0);
  const pf = clamp(inputs.pf, 0.1, 1.0, KSA_DEFAULTS.pf);
  const length_m = parseNumber(inputs.length, 0);
  const conductor = inputs.conductor || KSA_DEFAULTS.conductor;
  const mode = inputs.mode || 'check';
  const cableSize_mm2 = parseNumber(inputs.cableSize, 0);
  const maxVD_percent = parseNumber(inputs.maxVD, KSA_DEFAULTS.maxVD_percent);

  // Validation
  const validations = [
    validateRequired(voltage_V, 'Voltage'),
    validateRange(pf, 'Power Factor', 0.1, 1.0),
    validateRequired(length_m, 'Length'),
    validateRange(maxVD_percent, 'Max VD %', 0.1, 10)
  ];

  if (loadMode === 'A') {
    validations.push(validateRequired(current_input, 'Current'));
  } else {
    validations.push(validateRequired(power_kW, 'Power'));
  }

  if (mode === 'check') {
    validations.push(validateRequired(cableSize_mm2, 'Cable Size'));
  }

  const validationErrors = validateInputs(validations);
  errors.push(...validationErrors);

  // Calculate design current
  let designCurrent_A;
  if (loadMode === 'A') {
    designCurrent_A = current_input;
  } else {
    designCurrent_A = calculateCurrent(power_kW, voltage_V, pf, system);
  }

  // Check mode
  let outputs = {};
  let recommendations = [];

  if (errors.length === 0) {
    if (mode === 'check') {
      // Check selected cable size
      const VD_V = calculateVoltageDrop(designCurrent_A, length_m, cableSize_mm2, conductor, system, pf);
      const VD_percent = safeDivide(VD_V * 100, voltage_V, 0);
      const pass = VD_percent <= maxVD_percent;

      outputs = {
        designCurrent: round(designCurrent_A, 1),
        voltageDrop_V: round(VD_V, 2),
        voltageDrop_percent: round(VD_percent, 2),
        status: pass ? 'PASS' : 'FAIL',
        cableSize: cableSize_mm2
      };

      if (!pass) {
        warnings.push(`Voltage drop ${VD_percent.toFixed(2)}% exceeds limit ${maxVD_percent}%`);
      }
    } else {
      // Auto recommend
      const suitableSizes = findSuitableCableSizes(designCurrent_A, length_m, voltage_V, maxVD_percent, conductor, system, pf);
      
      if (suitableSizes.length === 0) {
        errors.push('No suitable cable size found within voltage drop limit');
        outputs = {
          designCurrent: round(designCurrent_A, 1),
          voltageDrop_V: 0,
          voltageDrop_percent: 0,
          status: 'ERROR'
        };
      } else {
        const recommended = suitableSizes[0];
        outputs = {
          designCurrent: round(designCurrent_A, 1),
          voltageDrop_V: recommended.VD_V,
          voltageDrop_percent: recommended.VD_percent,
          status: 'OK',
          recommendedSize: recommended.size_mm2
        };
        recommendations = suitableSizes;
      }
    }
  } else {
    outputs = {
      designCurrent: 0,
      voltageDrop_V: 0,
      voltageDrop_percent: 0,
      status: 'ERROR'
    };
  }

  // Additional warnings
  if (pf < 0.7) {
    warnings.push('Low power factor detected - consider power factor correction');
  }
  if (length_m > 500) {
    warnings.push('Long cable run - verify calculation assumptions');
  }

  return { outputs, warnings, errors, recommendations };
}

export const voltageDropDefaults = {
  metric: {
    system: '3P',
    voltage: 400,
    loadMode: 'A',
    current: 100,
    power: 70,
    pf: 0.9,
    length: 50,
    conductor: 'Cu',
    mode: 'check',
    cableSize: 25,
    maxVD: 3
  },
  imperial: {
    system: '3P',
    voltage: 400,
    loadMode: 'A',
    current: 100,
    power: 70,
    pf: 0.9,
    length: 50,
    conductor: 'Cu',
    mode: 'check',
    cableSize: 25,
    maxVD: 3
  }
};

export const voltageDropRelated = ['cable-sizing', 'breaker-sizing'];