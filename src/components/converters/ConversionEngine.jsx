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
// Reject overflow/underflow in intermediate arithmetic as well as final output.
// Conservative IEEE-754 policy: extreme inputs may be rejected even if a
// rearranged expression could produce a representable result.
const safeResult = (n, load) => Number.isFinite(n) && (load === 0 || n > 0) ? n : null;
const phaseFactor = system => system === '3P' ? Math.sqrt(3) : 1;
function powerToCurrent(load, voltage, pf, system) {
  if (load === 0) return 0;
  const numerator = load * 1000;
  const phaseVoltage = phaseFactor(system) * voltage;
  const denominator = phaseVoltage * pf;
  if (![numerator, phaseVoltage, denominator].every(n => Number.isFinite(n) && n > 0)) return null;
  return safeResult(numerator / denominator, load);
}
function currentToPower(load, voltage, pf, system) {
  if (load === 0) return 0;
  const phaseVoltage = phaseFactor(system) * voltage;
  const apparent = phaseVoltage * load;
  const active = apparent * pf;
  if (![phaseVoltage, apparent, active].every(n => Number.isFinite(n) && n > 0)) return null;
  return safeResult(active / 1000, load);
}
export function convertKWtoA(kW, voltage, pf, system) {
  if (!(validMagnitude(kW) && validVoltage(voltage) && validPF(pf) && validSystem(system))) return null;
  return powerToCurrent(kW, voltage, pf, system);
}

export function convertAtoKW(current, voltage, pf, system) {
  if (!(validMagnitude(current) && validVoltage(voltage) && validPF(pf) && validSystem(system))) return null;
  return currentToPower(current, voltage, pf, system);
}

export function convertKVAtoA(kVA, voltage, system) {
  if (!(validMagnitude(kVA) && validVoltage(voltage) && validSystem(system))) return null;
  return powerToCurrent(kVA, voltage, 1, system);
}

export function convertAtoKVA(current, voltage, system) {
  if (!(validMagnitude(current) && validVoltage(voltage) && validSystem(system))) return null;
  return currentToPower(current, voltage, 1, system);
}

export function convertKWtoKVA(kW, pf) {
  if (!(validMagnitude(kW) && validPF(pf))) return null;
  return safeResult(kW / pf, kW);
}

export function convertKVAtoKW(kVA, pf) {
  if (!(validMagnitude(kVA) && validPF(pf))) return null;
  return safeResult(kVA * pf, kVA);
}
