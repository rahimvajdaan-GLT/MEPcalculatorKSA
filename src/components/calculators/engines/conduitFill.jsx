import {
  parseNumber, round, safeDivide,
  validateRequired, validateRange, validateInputs, KSA_DEFAULTS
} from './electricalUtils';

export const conduitFillConfig = {
  version: "2.0",
  ar: {
    title: "حاسبة تعبئة المواسير والتراكنج",
    description: "حساب نسبة تعبئة المواسير الكهربائية والتراكنج وفق IEC",
    inputs: {
      containmentType: { label: "نوع الحاوية", unit: "" },
      containmentSize: { label: "المقاس", unit: "" },
      fillLimit: { label: "الحد الأقصى للتعبئة", unit: { metric: "%", imperial: "%" } },
      cables: { label: "الكابلات", unit: "" }
    },
    outputs: {
      totalCableArea: { label: "مساحة الكابلات الإجمالية", unit: { metric: "mm²", imperial: "mm²" } },
      containmentArea: { label: "مساحة الحاوية", unit: { metric: "mm²", imperial: "mm²" } },
      fillPercent: { label: "نسبة التعبئة", unit: { metric: "%", imperial: "%" } },
      status: { label: "النتيجة", unit: "" }
    }
  },
  en: {
    title: "Conduit & Trunking Fill Calculator",
    description: "Calculate conduit and trunking fill percentage per IEC standards",
    inputs: {
      containmentType: { label: "Containment Type", unit: "" },
      containmentSize: { label: "Size", unit: "" },
      fillLimit: { label: "Fill Limit", unit: { metric: "%", imperial: "%" } },
      cables: { label: "Cables", unit: "" }
    },
    outputs: {
      totalCableArea: { label: "Total Cable Area", unit: { metric: "mm²", imperial: "mm²" } },
      containmentArea: { label: "Containment Area", unit: { metric: "mm²", imperial: "mm²" } },
      fillPercent: { label: "Fill Percentage", unit: { metric: "%", imperial: "%" } },
      status: { label: "Status", unit: "" }
    }
  }
};

// Standard conduit sizes (internal area in mm²)
export const CONDUIT_LIBRARY = {
  '16mm': { size: '16mm', area: 133, label: '16mm (133mm²)' },
  '20mm': { size: '20mm', area: 201, label: '20mm (201mm²)' },
  '25mm': { size: '25mm', area: 314, label: '25mm (314mm²)' },
  '32mm': { size: '32mm', area: 530, label: '32mm (530mm²)' },
  '40mm': { size: '40mm', area: 804, label: '40mm (804mm²)' },
  '50mm': { size: '50mm', area: 1257, label: '50mm (1257mm²)' },
  '63mm': { size: '63mm', area: 2043, label: '63mm (2043mm²)' },
  '75mm': { size: '75mm', area: 2865, label: '75mm (2865mm²)' },
  '90mm': { size: '90mm', area: 4155, label: '90mm (4155mm²)' },
  '110mm': { size: '110mm', area: 6221, label: '110mm (6221mm²)' }
};

// Standard trunking sizes (internal area in mm²)
export const TRUNKING_LIBRARY = {
  '50x50': { size: '50x50', area: 2500, label: '50×50mm (2500mm²)' },
  '75x75': { size: '75x75', area: 5625, label: '75×75mm (5625mm²)' },
  '100x50': { size: '100x50', area: 5000, label: '100×50mm (5000mm²)' },
  '100x100': { size: '100x100', area: 10000, label: '100×100mm (10000mm²)' },
  '150x75': { size: '150x75', area: 11250, label: '150×75mm (11250mm²)' },
  '150x150': { size: '150x150', area: 22500, label: '150×150mm (22500mm²)' },
  '200x100': { size: '200x100', area: 20000, label: '200×100mm (20000mm²)' },
  '300x150': { size: '300x150', area: 45000, label: '300×150mm (45000mm²)' }
};

export function calculateConduitFillResults(inputs, unitsMode = 'metric') {
  const warnings = [];
  const errors = [];

  // Parse inputs
  const containmentType = inputs.containmentType || 'conduit';
  const containmentSize = inputs.containmentSize || '';
  const fillLimit_percent = parseNumber(inputs.fillLimit, containmentType === 'conduit' ? KSA_DEFAULTS.conduitFillLimit : KSA_DEFAULTS.trunkingFillLimit);
  const cables = inputs.cables || [];

  // Get containment area
  const library = containmentType === 'conduit' ? CONDUIT_LIBRARY : TRUNKING_LIBRARY;
  const containment = library[containmentSize];

  // Validation
  if (!containment) {
    errors.push('Please select a containment size');
  }
  if (!Array.isArray(cables) || cables.length === 0) {
    errors.push('Please add at least one cable');
  }

  const validations = [
    validateRange(fillLimit_percent, 'Fill Limit', 1, 100)
  ];

  const validationErrors = validateInputs(validations);
  errors.push(...validationErrors);

  let outputs = {};

  if (errors.length === 0) {
    // Calculate total cable area
    let totalCableArea = 0;
    cables.forEach(cable => {
      const qty = parseNumber(cable.qty, 1);
      const diameter_mm = parseNumber(cable.diameter, 0);
      const area = Math.PI * Math.pow(diameter_mm / 2, 2);
      totalCableArea += qty * area;
    });

    const containmentArea = containment.area;
    const fillPercent = safeDivide(totalCableArea * 100, containmentArea, 0);
    const pass = fillPercent <= fillLimit_percent;

    outputs = {
      totalCableArea: round(totalCableArea, 1),
      containmentArea: containmentArea,
      fillPercent: round(fillPercent, 1),
      status: pass ? 'PASS' : 'FAIL'
    };

    // Find next size if fail
    if (!pass) {
      const libraryArray = Object.values(library).sort((a, b) => a.area - b.area);
      const nextSize = libraryArray.find(item => {
        const nextFill = safeDivide(totalCableArea * 100, item.area, 0);
        return nextFill <= fillLimit_percent;
      });
      
      if (nextSize) {
        warnings.push(`Consider next size: ${nextSize.label}`);
      } else {
        warnings.push('No suitable size found - consider multiple conduits/trunkings');
      }
    }

    if (fillPercent > 80) {
      warnings.push('High fill percentage - pulling cables may be difficult');
    }
  } else {
    outputs = {
      totalCableArea: 0,
      containmentArea: 0,
      fillPercent: 0,
      status: 'ERROR'
    };
  }

  return { outputs, warnings, errors };
}

export const conduitFillDefaults = {
  metric: {
    containmentType: 'conduit',
    containmentSize: '32mm',
    fillLimit: 40,
    cables: [
      { id: 1, name: '3C×16mm²', qty: 3, diameter: 12 }
    ]
  },
  imperial: {
    containmentType: 'conduit',
    containmentSize: '32mm',
    fillLimit: 40,
    cables: [
      { id: 1, name: '3C×16mm²', qty: 3, diameter: 12 }
    ]
  }
};

export const conduitFillRelated = ['cable-sizing'];