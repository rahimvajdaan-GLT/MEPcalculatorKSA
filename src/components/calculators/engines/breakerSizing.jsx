import {
  parseNumber, clamp, round,
  findBreakerRating, STANDARD_BREAKER_RATINGS,
  validateRequired, validateRange, validateInputs, KSA_DEFAULTS
} from './electricalUtils';

export const breakerSizingConfig = {
  version: "2.0",
  ar: {
    title: "حاسبة اختيار القاطع",
    description: "اختيار تصنيف القاطع الكهربائي المناسب للمشاريع السعودية",
    inputs: {
      designCurrent: { label: "تيار التصميم", unit: { metric: "A", imperial: "A" } },
      continuousFactor: { label: "معامل الحمل المستمر", unit: "" },
      marginPercent: { label: "هامش الأمان", unit: { metric: "%", imperial: "%" } },
      breakerType: { label: "نوع القاطع", unit: "" },
      minBreakingCapacity: { label: "الحد الأدنى لقدرة القطع", unit: { metric: "kA", imperial: "kA" } }
    },
    outputs: {
      requiredRating: { label: "التصنيف المطلوب", unit: { metric: "A", imperial: "A" } },
      selectedRating: { label: "التصنيف المختار", unit: { metric: "A", imperial: "A" } },
      utilizationPercent: { label: "نسبة الاستخدام", unit: { metric: "%", imperial: "%" } }
    }
  },
  en: {
    title: "Breaker Sizing Calculator",
    description: "Select appropriate circuit breaker rating for Saudi projects",
    inputs: {
      designCurrent: { label: "Design Current", unit: { metric: "A", imperial: "A" } },
      continuousFactor: { label: "Continuous Load Factor", unit: "" },
      marginPercent: { label: "Safety Margin", unit: { metric: "%", imperial: "%" } },
      breakerType: { label: "Breaker Type", unit: "" },
      minBreakingCapacity: { label: "Min Breaking Capacity", unit: { metric: "kA", imperial: "kA" } }
    },
    outputs: {
      requiredRating: { label: "Required Rating", unit: { metric: "A", imperial: "A" } },
      selectedRating: { label: "Selected Rating", unit: { metric: "A", imperial: "A" } },
      utilizationPercent: { label: "Utilization", unit: { metric: "%", imperial: "%" } }
    }
  }
};

export function calculateBreakerSizingResults(inputs, unitsMode = 'metric') {
  const warnings = [];
  const errors = [];

  // Parse inputs
  const designCurrent_A = parseNumber(inputs.designCurrent, 0);
  const continuousFactor = clamp(inputs.continuousFactor, 1.0, 2.0, KSA_DEFAULTS.continuousLoadFactor);
  const marginPercent = clamp(inputs.marginPercent, 0, 50, 10);
  const breakerType = inputs.breakerType || 'MCCB';
  const minBreakingCapacity_kA = parseNumber(inputs.minBreakingCapacity, 0);

  // Validation
  const validations = [
    validateRequired(designCurrent_A, 'Design Current'),
    validateRange(continuousFactor, 'Continuous Factor', 1.0, 2.0),
    validateRange(marginPercent, 'Margin %', 0, 50)
  ];

  const validationErrors = validateInputs(validations);
  errors.push(...validationErrors);

  let outputs = {};

  if (errors.length === 0) {
    // Calculate required rating
    const requiredRating = designCurrent_A * continuousFactor * (1 + marginPercent / 100);
    
    // Find next standard rating
    const selectedRating = findBreakerRating(requiredRating);
    
    // Calculate utilization
    const utilizationPercent = (designCurrent_A / selectedRating) * 100;

    outputs = {
      requiredRating: round(requiredRating, 1),
      selectedRating: selectedRating,
      utilizationPercent: round(utilizationPercent, 1)
    };

    // Warnings
    if (utilizationPercent > 80) {
      warnings.push('High utilization - consider next size up for future expansion');
    }
    if (utilizationPercent < 40) {
      warnings.push('Low utilization - oversized breaker may affect protection coordination');
    }
    if (minBreakingCapacity_kA > 0) {
      warnings.push(`Verify breaker breaking capacity ≥ ${minBreakingCapacity_kA} kA against fault level study`);
    }
    if (breakerType === 'MCB' && selectedRating > 125) {
      warnings.push('Consider MCCB for currents above 125A');
    }
  } else {
    outputs = {
      requiredRating: 0,
      selectedRating: 0,
      utilizationPercent: 0
    };
  }

  return { outputs, warnings, errors };
}

export const breakerSizingDefaults = {
  metric: {
    designCurrent: 100,
    continuousFactor: 1.25,
    marginPercent: 10,
    breakerType: 'MCCB',
    minBreakingCapacity: 0
  },
  imperial: {
    designCurrent: 100,
    continuousFactor: 1.25,
    marginPercent: 10,
    breakerType: 'MCCB',
    minBreakingCapacity: 0
  }
};

export const breakerSizingRelated = ['cable-sizing', 'voltage-drop', 'short-circuit-level'];