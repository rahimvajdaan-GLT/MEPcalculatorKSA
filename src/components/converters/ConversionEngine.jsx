// General unit conversion engine

export function convertUnits(value, fromUnit, toUnit) {
  if (!fromUnit || !toUnit || fromUnit.dimensionKey !== toUnit.dimensionKey) {
    return null;
  }

  // Convert to base unit
  const baseValue = (value * fromUnit.factorToBase) + fromUnit.offsetToBase;

  // Convert from base to target unit
  const result = (baseValue - toUnit.offsetToBase) / toUnit.factorToBase;

  return result;
}

export function formatConversionResult(value, dimensionKey, unitSymbol) {
  if (value === null || value === undefined || isNaN(value)) {
    return '-';
  }

  // Smart rounding based on dimension and unit
  let decimals = 2;

  if (dimensionKey === 'pressure') {
    if (unitSymbol === 'bar') decimals = 3;
    else if (unitSymbol === 'kPa') decimals = 1;
    else if (unitSymbol === 'psi' || unitSymbol === 'PSI') decimals = 2;
  } else if (dimensionKey === 'flow') {
    decimals = 2;
  } else if (dimensionKey === 'temperature') {
    decimals = 1;
  } else if (dimensionKey === 'length' || dimensionKey === 'area' || dimensionKey === 'volume') {
    decimals = 3;
  } else if (dimensionKey === 'power' || dimensionKey === 'energy') {
    decimals = 2;
  }

  return value.toFixed(decimals);
}

// Balanced AC RMS load magnitudes; voltage is line-to-line for 3P.
// Zero load is valid; negative loads (export/generation) are outside this model.
// Invalid or nonrepresentable results return null, never a plausible number.
const validMagnitude = n => Number.isFinite(n) && n >= 0;
const validVoltage = n => Number.isFinite(n) && n > 0;
const validPF = n => Number.isFinite(n) && n > 0 && n <= 1;
const validSystem = s => s === '1P' || s === '3P';
const safeResult = n => Number.isFinite(n) ? n : null;
export function convertKWtoA(kW, voltage, pf, system) {
  if (!(validMagnitude(kW) && validVoltage(voltage) && validPF(pf) && validSystem(system))) return null;
  return safeResult((kW * 1000) / ((system === '3P' ? Math.sqrt(3) : 1) * voltage * pf));
}

export function convertAtoKW(current, voltage, pf, system) {
  if (!(validMagnitude(current) && validVoltage(voltage) && validPF(pf) && validSystem(system))) return null;
  return safeResult(((system === '3P' ? Math.sqrt(3) : 1) * voltage * current * pf) / 1000);
}

export function convertKVAtoA(kVA, voltage, system) {
  if (!(validMagnitude(kVA) && validVoltage(voltage) && validSystem(system))) return null;
  return safeResult((kVA * 1000) / ((system === '3P' ? Math.sqrt(3) : 1) * voltage));
}

export function convertAtoKVA(current, voltage, system) {
  if (!(validMagnitude(current) && validVoltage(voltage) && validSystem(system))) return null;
  return safeResult(((system === '3P' ? Math.sqrt(3) : 1) * voltage * current) / 1000);
}

export function convertKWtoKVA(kW, pf) {
  if (!(validMagnitude(kW) && validPF(pf))) return null;
  return safeResult(kW / pf);
}

export function convertKVAtoKW(kVA, pf) {
  if (!(validMagnitude(kVA) && validPF(pf))) return null;
  return safeResult(kVA * pf);
}
