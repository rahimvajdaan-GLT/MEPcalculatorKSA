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

// Electrical conversions (mini calculators)
export function convertKWtoA(kW, voltage, pf, system) {
  if (system === '3P') {
    return (kW * 1000) / (Math.sqrt(3) * voltage * pf);
  } else {
    return (kW * 1000) / (voltage * pf);
  }
}

export function convertAtoKW(current, voltage, pf, system) {
  if (system === '3P') {
    return (Math.sqrt(3) * voltage * current * pf) / 1000;
  } else {
    return (voltage * current * pf) / 1000;
  }
}

export function convertKVAtoA(kVA, voltage, system) {
  if (system === '3P') {
    return (kVA * 1000) / (Math.sqrt(3) * voltage);
  } else {
    return (kVA * 1000) / voltage;
  }
}

export function convertAtoKVA(current, voltage, system) {
  if (system === '3P') {
    return (Math.sqrt(3) * voltage * current) / 1000;
  } else {
    return (voltage * current) / 1000;
  }
}

export function convertKWtoKVA(kW, pf) {
  return kW / pf;
}

export function convertKVAtoKW(kVA, pf) {
  return kVA * pf;
}