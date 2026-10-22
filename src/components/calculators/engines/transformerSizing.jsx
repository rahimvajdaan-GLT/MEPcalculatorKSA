import {
  parseNumber, clamp, round, safeDivide,
  findTransformerRating, STANDARD_TRANSFORMER_RATINGS,
  validateRequired, validateRange, validateInputs, KSA_DEFAULTS
} from './electricalUtils';

export const transformerSizingConfig = {
  version: "2.0",
  ar: {
    title: "حاسبة اختيار المحول",
    description: "اختيار قدرة المحول الكهربائي المناسبة للمشاريع السعودية",
    inputs: {
      totalLoad: { label: "الحمل الإجمالي", unit: "" },
      loadUnit: { label: "وحدة الحمل", unit: "" },
      pf: { label: "معامل القدرة", unit: "" },
      diversityFactor: { label: "معامل التنوع", unit: "" },
      futureAllowance: { label: "هامش التوسع المستقبلي", unit: { metric: "%", imperial: "%" } }
    },
    outputs: {
      demand_kVA: { label: "الحمل الفعلي", unit: { metric: "kVA", imperial: "kVA" } },
      required_kVA: { label: "القدرة المطلوبة", unit: { metric: "kVA", imperial: "kVA" } },
      selected_kVA: { label: "قدرة المحول المختار", unit: { metric: "kVA", imperial: "kVA" } },
      utilization: { label: "نسبة الاستخدام", unit: { metric: "%", imperial: "%" } }
    }
  },
  en: {
    title: "Transformer Sizing Calculator",
    description: "Select appropriate transformer rating for Saudi projects",
    inputs: {
      totalLoad: { label: "Total Load", unit: "" },
      loadUnit: { label: "Load Unit", unit: "" },
      pf: { label: "Power Factor", unit: "" },
      diversityFactor: { label: "Diversity Factor", unit: "" },
      futureAllowance: { label: "Future Allowance", unit: { metric: "%", imperial: "%" } }
    },
    outputs: {
      demand_kVA: { label: "Demand Load", unit: { metric: "kVA", imperial: "kVA" } },
      required_kVA: { label: "Required Rating", unit: { metric: "kVA", imperial: "kVA" } },
      selected_kVA: { label: "Selected Transformer", unit: { metric: "kVA", imperial: "kVA" } },
      utilization: { label: "Utilization", unit: { metric: "%", imperial: "%" } }
    }
  }
};

export function calculateTransformerSizingResults(inputs, unitsMode = 'metric') {
  const warnings = [];
  const errors = [];

  // Parse inputs
  const totalLoad = parseNumber(inputs.totalLoad, 0);
  const loadUnit = inputs.loadUnit || 'kW';
  const pf = clamp(inputs.pf, 0.1, 1.0, KSA_DEFAULTS.pf);
  const diversityFactor = clamp(inputs.diversityFactor, 0.1, 1.0, KSA_DEFAULTS.diversityFactor);
  const futureAllowance_percent = clamp(inputs.futureAllowance, 0, 100, KSA_DEFAULTS.futureAllowance_percent);

  // Validation
  const validations = [
    validateRequired(totalLoad, 'Total Load'),
    validateRange(pf, 'Power Factor', 0.1, 1.0),
    validateRange(diversityFactor, 'Diversity Factor', 0.1, 1.0),
    validateRange(futureAllowance_percent, 'Future Allowance', 0, 100)
  ];

  const validationErrors = validateInputs(validations);
  errors.push(...validationErrors);

  let outputs = {};

  if (errors.length === 0) {
    // Convert to kVA
    let base_kVA;
    if (loadUnit === 'kW') {
      base_kVA = safeDivide(totalLoad, pf, 0);
    } else {
      base_kVA = totalLoad;
    }

    // Apply diversity
    const demand_kVA = base_kVA * diversityFactor;

    // Apply future allowance
    const required_kVA = demand_kVA * (1 + futureAllowance_percent / 100);

    // Find next standard transformer size
    const selected_kVA = findTransformerRating(required_kVA);

    // Calculate utilization
    const utilization_percent = safeDivide(demand_kVA * 100, selected_kVA, 0);

    outputs = {
      demand_kVA: round(demand_kVA, 1),
      required_kVA: round(required_kVA, 1),
      selected_kVA: selected_kVA,
      utilization: round(utilization_percent, 1)
    };

    // Warnings
    if (utilization_percent > 80) {
      warnings.push('High utilization - verify transformer can handle peak loads');
    }
    if (utilization_percent < 30) {
      warnings.push('Low utilization - consider smaller transformer for better efficiency');
    }
    if (diversityFactor < 0.5) {
      warnings.push('Very low diversity factor - verify this is appropriate for the installation');
    }
    if (futureAllowance_percent > 50) {
      warnings.push('Large future allowance - consider phased installation');
    }
  } else {
    outputs = {
      demand_kVA: 0,
      required_kVA: 0,
      selected_kVA: 0,
      utilization: 0
    };
  }

  return { outputs, warnings, errors };
}

export const transformerSizingDefaults = {
  metric: {
    totalLoad: 500,
    loadUnit: 'kW',
    pf: 0.9,
    diversityFactor: 0.8,
    futureAllowance: 15
  },
  imperial: {
    totalLoad: 500,
    loadUnit: 'kW',
    pf: 0.9,
    diversityFactor: 0.8,
    futureAllowance: 15
  }
};

export const transformerSizingRelated = ['short-circuit-level', 'load-schedule-summary'];