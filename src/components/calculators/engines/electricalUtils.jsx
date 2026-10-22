// Shared Electrical Calculation Engine Utilities

/**
 * Safely parse a number with fallback to default
 */
export function parseNumber(value, defaultValue = 0) {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  const parsed = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Clamp a value between min and max, with fallback
 */
export function clamp(value, min, max, defaultValue = min) {
  const num = parseNumber(value, defaultValue);
  if (num < min) return min;
  if (num > max) return max;
  return num;
}

/**
 * Safe division that never returns NaN
 */
export function safeDivide(a, b, defaultValue = 0) {
  const numA = parseNumber(a, 0);
  const numB = parseNumber(b, 1);
  if (numB === 0) return defaultValue;
  const result = numA / numB;
  return isNaN(result) ? defaultValue : result;
}

/**
 * Round to specified decimals
 */
export function round(value, decimals = 2) {
  const num = parseNumber(value, 0);
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * Calculate current from power
 */
export function calculateCurrent(power_kW, voltage_V, pf, system = '3P') {
  const kW = parseNumber(power_kW, 0);
  const V = parseNumber(voltage_V, 400);
  const powerFactor = clamp(pf, 0.1, 1.0, 0.9);
  
  if (system === '3P') {
    return safeDivide(kW * 1000, Math.sqrt(3) * V * powerFactor, 0);
  } else {
    return safeDivide(kW * 1000, V * powerFactor, 0);
  }
}

/**
 * Calculate power from current
 */
export function calculatePower(current_A, voltage_V, pf, system = '3P') {
  const I = parseNumber(current_A, 0);
  const V = parseNumber(voltage_V, 400);
  const powerFactor = clamp(pf, 0.1, 1.0, 0.9);
  
  if (system === '3P') {
    return (Math.sqrt(3) * V * I * powerFactor) / 1000;
  } else {
    return (V * I * powerFactor) / 1000;
  }
}

/**
 * Conductor resistivity at 20°C (ohm.mm2/m)
 */
export const CONDUCTOR_RESISTIVITY = {
  Cu: 0.01724,  // Copper
  Al: 0.0283    // Aluminum
};

/**
 * Calculate voltage drop
 */
export function calculateVoltageDrop(current_A, length_m, csa_mm2, conductor, system = '3P', pf = 0.9) {
  const I = parseNumber(current_A, 0);
  const L = parseNumber(length_m, 0);
  const csa = parseNumber(csa_mm2, 1);
  const rho = CONDUCTOR_RESISTIVITY[conductor] || CONDUCTOR_RESISTIVITY.Cu;
  const powerFactor = clamp(pf, 0.1, 1.0, 0.9);
  
  // Resistance per conductor
  const R = safeDivide(rho * L, csa, 0);
  
  // For simplified calculation, assuming low X/R ratio (conservative for cables)
  // VD = I * R * (cosφ for AC circuits)
  let VD_V;
  if (system === '3P') {
    VD_V = Math.sqrt(3) * I * R * powerFactor;
  } else {
    VD_V = 2 * I * R * powerFactor; // 2 for return path
  }
  
  return VD_V;
}

/**
 * Standard cable sizes (mm2)
 */
export const STANDARD_CABLE_SIZES = [
  1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630, 800, 1000
];

/**
 * Find suitable cable sizes for voltage drop limit
 */
export function findSuitableCableSizes(current_A, length_m, voltage_V, maxVD_percent, conductor, system = '3P', pf = 0.9) {
  const results = [];
  
  for (const size of STANDARD_CABLE_SIZES) {
    const VD_V = calculateVoltageDrop(current_A, length_m, size, conductor, system, pf);
    const VD_percent = safeDivide(VD_V * 100, voltage_V, 0);
    
    results.push({
      size_mm2: size,
      VD_V: round(VD_V, 2),
      VD_percent: round(VD_percent, 2),
      pass: VD_percent <= parseNumber(maxVD_percent, 3)
    });
    
    // Return first 3 passing sizes
    if (results.filter(r => r.pass).length >= 3) {
      break;
    }
  }
  
  return results.filter(r => r.pass).slice(0, 3);
}

/**
 * Standard breaker ratings (A)
 */
export const STANDARD_BREAKER_RATINGS = [
  6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000
];

/**
 * Find next standard breaker rating
 */
export function findBreakerRating(requiredCurrent_A) {
  const required = parseNumber(requiredCurrent_A, 0);
  const rating = STANDARD_BREAKER_RATINGS.find(r => r >= required);
  return rating || STANDARD_BREAKER_RATINGS[STANDARD_BREAKER_RATINGS.length - 1];
}

/**
 * Standard transformer ratings (kVA)
 */
export const STANDARD_TRANSFORMER_RATINGS = [
  100, 160, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000
];

/**
 * Find next standard transformer rating
 */
export function findTransformerRating(required_kVA) {
  const required = parseNumber(required_kVA, 0);
  const rating = STANDARD_TRANSFORMER_RATINGS.find(r => r >= required);
  return rating || STANDARD_TRANSFORMER_RATINGS[STANDARD_TRANSFORMER_RATINGS.length - 1];
}

/**
 * Validation helpers
 */
export function validateRequired(value, fieldName) {
  const num = parseNumber(value, null);
  if (num === null || num === 0) {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
}

export function validateRange(value, fieldName, min, max) {
  const num = parseNumber(value, null);
  if (num === null) {
    return { valid: false, error: `${fieldName} is required` };
  }
  if (num < min || num > max) {
    return { valid: false, error: `${fieldName} must be between ${min} and ${max}` };
  }
  return { valid: true };
}

/**
 * Validate multiple fields and return errors
 */
export function validateInputs(validations) {
  const errors = [];
  validations.forEach(({ valid, error }) => {
    if (!valid) errors.push(error);
  });
  return errors;
}

/**
 * KSA typical defaults
 */
export const KSA_DEFAULTS = {
  voltage_3P: 400,
  voltage_1P: 230,
  pf: 0.9,
  maxVD_percent: 3,
  conductor: 'Cu',
  continuousLoadFactor: 1.25,
  deratingFactor: 1.0,
  diversityFactor: 0.8,
  futureAllowance_percent: 15,
  conduitFillLimit: 40,
  trunkingFillLimit: 45
};