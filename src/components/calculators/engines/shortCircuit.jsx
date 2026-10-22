import {
  parseNumber, clamp, round, safeDivide,
  validateRequired, validateRange, validateInputs, KSA_DEFAULTS
} from './electricalUtils';

export const shortCircuitConfig = {
  version: "2.0",
  ar: {
    title: "حاسبة مستوى القصر (مبسطة)",
    description: "حساب تيار القصر المتوقع عند أطراف المحول للمشاريع السعودية",
    inputs: {
      transformer_kVA: { label: "قدرة المحول", unit: { metric: "kVA", imperial: "kVA" } },
      voltage_V: { label: "الجهد", unit: { metric: "V", imperial: "V" } },
      impedance_percent: { label: "معاوقة المحول", unit: { metric: "%", imperial: "%" } },
      includeDownstream: { label: "تضمين نقطة لاحقة", unit: "" },
      cableLength_m: { label: "طول الكابل", unit: { metric: "m", imperial: "m" } },
      cableImpedance_mOhm: { label: "معاوقة الكابل", unit: { metric: "mΩ/m", imperial: "mΩ/m" } }
    },
    outputs: {
      nominalCurrent_A: { label: "التيار الاسمي", unit: { metric: "A", imperial: "A" } },
      faultCurrent_transformer_kA: { label: "تيار القصر عند المحول", unit: { metric: "kA", imperial: "kA" } },
      faultCurrent_downstream_kA: { label: "تيار القصر (نقطة لاحقة)", unit: { metric: "kA", imperial: "kA" } }
    }
  },
  en: {
    title: "Short Circuit Level Calculator (Basic)",
    description: "Calculate prospective short circuit current at transformer terminals for Saudi projects",
    inputs: {
      transformer_kVA: { label: "Transformer Rating", unit: { metric: "kVA", imperial: "kVA" } },
      voltage_V: { label: "Voltage", unit: { metric: "V", imperial: "V" } },
      impedance_percent: { label: "Transformer Impedance", unit: { metric: "%", imperial: "%" } },
      includeDownstream: { label: "Include Downstream Point", unit: "" },
      cableLength_m: { label: "Cable Length", unit: { metric: "m", imperial: "m" } },
      cableImpedance_mOhm: { label: "Cable Impedance", unit: { metric: "mΩ/m", imperial: "mΩ/m" } }
    },
    outputs: {
      nominalCurrent_A: { label: "Nominal Current", unit: { metric: "A", imperial: "A" } },
      faultCurrent_transformer_kA: { label: "Fault Current at Transformer", unit: { metric: "kA", imperial: "kA" } },
      faultCurrent_downstream_kA: { label: "Fault Current (Downstream)", unit: { metric: "kA", imperial: "kA" } }
    }
  }
};

export function calculateShortCircuitResults(inputs, unitsMode = 'metric') {
  const warnings = [];
  const errors = [];

  // Parse inputs
  const transformer_kVA = parseNumber(inputs.transformer_kVA, 0);
  const voltage_V = parseNumber(inputs.voltage_V, KSA_DEFAULTS.voltage_3P);
  const impedance_percent = parseNumber(inputs.impedance_percent, 0);
  const includeDownstream = inputs.includeDownstream || false;
  const cableLength_m = parseNumber(inputs.cableLength_m, 0);
  const cableImpedance_mOhm = parseNumber(inputs.cableImpedance_mOhm, 0);

  // Validation
  const validations = [
    validateRequired(transformer_kVA, 'Transformer kVA'),
    validateRequired(voltage_V, 'Voltage'),
    validateRange(impedance_percent, 'Impedance %', 1, 20)
  ];

  if (includeDownstream) {
    validations.push(
      validateRequired(cableLength_m, 'Cable Length'),
      validateRequired(cableImpedance_mOhm, 'Cable Impedance')
    );
  }

  const validationErrors = validateInputs(validations);
  errors.push(...validationErrors);

  let outputs = {};

  if (errors.length === 0) {
    // Nominal current
    const nominalCurrent_A = safeDivide(transformer_kVA * 1000, Math.sqrt(3) * voltage_V, 0);

    // Fault current at transformer terminals
    const faultCurrent_transformer_A = nominalCurrent_A * (100 / impedance_percent);
    const faultCurrent_transformer_kA = faultCurrent_transformer_A / 1000;

    outputs = {
      nominalCurrent_A: round(nominalCurrent_A, 1),
      faultCurrent_transformer_kA: round(faultCurrent_transformer_kA, 2)
    };

    // Downstream calculation (simplified)
    if (includeDownstream && cableLength_m > 0) {
      // Calculate transformer impedance in mOhms
      const transformer_Z_mOhm = safeDivide((voltage_V * voltage_V * impedance_percent), (transformer_kVA * 10), 0);
      
      // Total cable impedance
      const cable_Z_mOhm = cableImpedance_mOhm * cableLength_m;
      
      // Total impedance
      const total_Z_mOhm = transformer_Z_mOhm + cable_Z_mOhm;
      
      // Fault current downstream (approximation)
      const faultCurrent_downstream_A = safeDivide((voltage_V / Math.sqrt(3)) * 1000, total_Z_mOhm, 0);
      const faultCurrent_downstream_kA = faultCurrent_downstream_A / 1000;
      
      outputs.faultCurrent_downstream_kA = round(faultCurrent_downstream_kA, 2);
      
      warnings.push('Downstream fault level is approximate - full study recommended');
    }

    // Warnings
    warnings.push('This is a basic calculation - detailed fault level study required for final design');
    warnings.push('Verify all protective device breaking capacities against calculated fault levels');
    
    if (faultCurrent_transformer_kA > 50) {
      warnings.push('High fault current - verify switchgear and cable ratings');
    }
  } else {
    outputs = {
      nominalCurrent_A: 0,
      faultCurrent_transformer_kA: 0,
      faultCurrent_downstream_kA: 0
    };
  }

  return { outputs, warnings, errors };
}

export const shortCircuitDefaults = {
  metric: {
    transformer_kVA: 1000,
    voltage_V: 400,
    impedance_percent: 6,
    includeDownstream: false,
    cableLength_m: 0,
    cableImpedance_mOhm: 0
  },
  imperial: {
    transformer_kVA: 1000,
    voltage_V: 400,
    impedance_percent: 6,
    includeDownstream: false,
    cableLength_m: 0,
    cableImpedance_mOhm: 0
  }
};

export const shortCircuitRelated = ['breaker-sizing', 'transformer-sizing'];