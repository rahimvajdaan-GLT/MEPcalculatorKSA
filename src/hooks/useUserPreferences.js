import { useState, useEffect } from 'react';

const PREFS_KEY = 'mep_user_preferences';

const defaultPreferences = {
  unitsMode: 'metric',         // 'metric' | 'imperial'
  pressureUnit: 'kPa',         // kPa | bar | psi | mH2O
  flowUnit: 'L/s',             // L/s | L/min | m3/h | GPM | CFM
  temperatureUnit: '°C',       // °C | °F | K
  lengthUnit: 'm',             // m | mm | ft | in
  powerUnit: 'kW',             // kW | kVA | HP | BTU/h | TR (tons of refrigeration)
  velocityUnit: 'm/s',         // m/s | ft/min | ft/s
  electricalVoltage: '400',    // 400 (3P KSA) | 230 (1P KSA) | 480 | 120
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem(PREFS_KEY);
      return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  });

  const updatePreference = (key, value) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateUnitsMode = (mode) => {
    // When switching between metric/imperial, cascade relevant units
    const cascadeMetric = {
      pressureUnit: 'kPa',
      flowUnit: 'L/s',
      temperatureUnit: '°C',
      lengthUnit: 'm',
      powerUnit: 'kW',
      velocityUnit: 'm/s',
    };
    const cascadeImperial = {
      pressureUnit: 'psi',
      flowUnit: 'GPM',
      temperatureUnit: '°F',
      lengthUnit: 'ft',
      powerUnit: 'BTU/h',
      velocityUnit: 'ft/min',
    };
    const cascade = mode === 'metric' ? cascadeMetric : cascadeImperial;
    setPreferences(prev => {
      const updated = { ...prev, unitsMode: mode, ...cascade };
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(defaultPreferences));
    } catch {}
  };

  return { preferences, updatePreference, updateUnitsMode, resetPreferences };
}