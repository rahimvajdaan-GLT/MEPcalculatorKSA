// Calculator Engines Index
// Centralized export of all calculator configurations and functions

import { ductSizingConfig, calculateDuctSizing, ductSizingDefaults, ductSizingRelated } from './ductSizing';
import { hazenWilliamsConfig, calculateHazenWilliams, hazenWilliamsDefaults, hazenWilliamsRelated } from './hazenWilliams';
import { waterSupplyConfig, calculateWaterSupply, waterSupplyDefaults, waterSupplyRelated } from './waterSupply';
import { chilledWaterPipeConfig, calculateChilledWaterPipe, chilledWaterPipeDefaults, chilledWaterPipeRelated } from './chilledWaterPipe';
import { firePumpConfig, calculateFirePump, firePumpDefaults, firePumpRelated } from './firePump';
import { tankSizingConfig, calculateTankSizing, tankSizingDefaults, tankSizingRelated } from './tankSizing';
import { fanEspConfig, calculateFanEsp, fanEspDefaults, fanEspRelated } from './fanEsp';
import { pumpHeadLossConfig, calculatePumpHeadLoss, pumpHeadLossDefaults, pumpHeadLossRelated } from './pumpHeadLoss';
import { drainageSizingConfig, calculateDrainageSizing, drainageSizingDefaults, drainageSizingRelated } from './drainageSizing';
import { waterHeaterConfig, calculateWaterHeater, waterHeaterDefaults, waterHeaterRelated } from './waterHeater';
import { voltageDropConfig, calculateVoltageDropResults, voltageDropDefaults, voltageDropRelated } from './voltageDrop';
import { cableSizingConfig, calculateCableSizingResults, cableSizingDefaults, cableSizingRelated } from './cableSizing';
import { breakerSizingConfig, calculateBreakerSizingResults, breakerSizingDefaults, breakerSizingRelated } from './breakerSizing';
import { conduitFillConfig, calculateConduitFillResults, conduitFillDefaults, conduitFillRelated } from './conduitFill';
import { shortCircuitConfig, calculateShortCircuitResults, shortCircuitDefaults, shortCircuitRelated } from './shortCircuit';
import { transformerSizingConfig, calculateTransformerSizingResults, transformerSizingDefaults, transformerSizingRelated } from './transformerSizing';
import { loadScheduleConfig, calculateLoadSchedule, loadScheduleDefaults, loadScheduleRelated } from './loadSchedule';

// Calculator registry
export const calculatorRegistry = {
  'duct-sizing': {
    config: ductSizingConfig,
    calculate: calculateDuctSizing,
    defaults: ductSizingDefaults,
    related: ductSizingRelated,
    trade: 'hvac'
  },
  'hazen-williams-friction-loss': {
    config: hazenWilliamsConfig,
    calculate: calculateHazenWilliams,
    defaults: hazenWilliamsDefaults,
    related: hazenWilliamsRelated,
    trade: 'firefighting'
  },
  'water-supply-sizing': {
    config: waterSupplyConfig,
    calculate: calculateWaterSupply,
    defaults: waterSupplyDefaults,
    related: waterSupplyRelated,
    trade: 'plumbing'
  },
  // Placeholder configs for other calculators
  'chilled-water-pipe-sizing': {
    config: chilledWaterPipeConfig,
    calculate: calculateChilledWaterPipe,
    defaults: chilledWaterPipeDefaults,
    related: chilledWaterPipeRelated,
    trade: 'hvac'
  },
  'pump-head-loss': {
    config: pumpHeadLossConfig,
    calculate: calculatePumpHeadLoss,
    defaults: pumpHeadLossDefaults,
    related: pumpHeadLossRelated,
    trade: 'hvac'
  },
  'fan-esp': {
    config: fanEspConfig,
    calculate: calculateFanEsp,
    defaults: fanEspDefaults,
    related: fanEspRelated,
    trade: 'hvac'
  },
  'drainage-sizing': {
    config: drainageSizingConfig,
    calculate: calculateDrainageSizing,
    defaults: drainageSizingDefaults,
    related: drainageSizingRelated,
    trade: 'plumbing'
  },
  'tank-sizing-refill-time': {
    config: tankSizingConfig,
    calculate: calculateTankSizing,
    defaults: tankSizingDefaults,
    related: tankSizingRelated,
    trade: 'plumbing'
  },
  'water-heater-sizing': {
    config: waterHeaterConfig,
    calculate: calculateWaterHeater,
    defaults: waterHeaterDefaults,
    related: waterHeaterRelated,
    trade: 'plumbing'
  },
  'fire-pump-sizing': {
    config: firePumpConfig,
    calculate: calculateFirePump,
    defaults: firePumpDefaults,
    related: firePumpRelated,
    trade: 'firefighting'
  },
  'voltage-drop': {
    config: voltageDropConfig,
    calculate: calculateVoltageDropResults,
    defaults: voltageDropDefaults,
    related: voltageDropRelated,
    trade: 'electrical'
  },
  'cable-sizing': {
    config: cableSizingConfig,
    calculate: calculateCableSizingResults,
    defaults: cableSizingDefaults,
    related: cableSizingRelated,
    trade: 'electrical'
  },
  'breaker-sizing': {
    config: breakerSizingConfig,
    calculate: calculateBreakerSizingResults,
    defaults: breakerSizingDefaults,
    related: breakerSizingRelated,
    trade: 'electrical'
  },
  'conduit-trunking-fill': {
    config: conduitFillConfig,
    calculate: calculateConduitFillResults,
    defaults: conduitFillDefaults,
    related: conduitFillRelated,
    trade: 'electrical'
  },
  'short-circuit-level': {
    config: shortCircuitConfig,
    calculate: calculateShortCircuitResults,
    defaults: shortCircuitDefaults,
    related: shortCircuitRelated,
    trade: 'electrical'
  },
  'transformer-sizing': {
    config: transformerSizingConfig,
    calculate: calculateTransformerSizingResults,
    defaults: transformerSizingDefaults,
    related: transformerSizingRelated,
    trade: 'electrical'
  },
  'load-schedule-summary': {
    config: loadScheduleConfig,
    calculate: calculateLoadSchedule,
    defaults: loadScheduleDefaults,
    related: loadScheduleRelated,
    trade: 'electrical'
  }
};

export function getCalculator(slug) {
  return calculatorRegistry[slug] || null;
}

export function getCalculatorConfig(slug, language) {
  const calculator = calculatorRegistry[slug];
  if (!calculator || !calculator.config) return null;
  const config = calculator.config[language] || calculator.config.en;
  return { ...config, version: calculator.config.version || '1.0' };
}

export function getCalculatorVersion(slug) {
  const calculator = calculatorRegistry[slug];
  return calculator?.config?.version || '1.0';
}

export function calculateResults(slug, inputs, unitsMode, language = 'en') {
  const calculator = calculatorRegistry[slug];
  if (!calculator || !calculator.calculate) {
    return { outputs: {}, warnings: ['Calculator not yet implemented'] };
  }
  return calculator.calculate(inputs, unitsMode, language);
}

export function getDefaults(slug, unitsMode) {
  const calculator = calculatorRegistry[slug];
  if (!calculator) return {};
  return calculator.defaults[unitsMode] || calculator.defaults.metric || {};
}

export function getRelatedCalculators(slug) {
  const calculator = calculatorRegistry[slug];
  return calculator?.related || [];
}

export function getTrade(slug) {
  const calculator = calculatorRegistry[slug];
  return calculator?.trade || 'hvac';
}