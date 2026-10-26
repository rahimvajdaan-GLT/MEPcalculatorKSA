# Independent fan ESP tests

Run `node --test tests/fan-esp.test.mjs` from the repository root. The suite
bundles the actual engine with the installed esbuild and removes its temporary
bundle after testing. No dependencies or production files change.

## Scope and assumptions

These tests characterize the existing pressure-sum model, not compliance with
ASHRAE, SMACNA, or Saudi requirements. No standards source was used or verified.
The existing 10% margin, 750 Pa warning threshold, and approximate conversions
are tested as implementation behavior, not endorsed design requirements.

Assume user-supplied losses describe components on one selected airflow path,
with no duplicate internal equipment losses. Duct loss is length times friction
rate. Total pressure adds duct, fittings, filter, coil, and diffuser losses;
the displayed margin is 1.1 times that total. The model does not determine a
critical path, equipment boundary, air density, or actual component losses.

## Independent reference calculations

Expected outputs are fixed literals and never use production calculation
helpers. The following arithmetic was separately checked with Python Decimal.
Metric pressure displays round to integer Pa; imperial and alternative in.wg
displays round to two decimal places. Calculations retain precision until display.

| Case | Independent arithmetic | Expected displayed duct / total / margin / total in.wg |
| --- | --- | --- |
| Metric defaults | 30 × 1 = 30 Pa; 30 + 50 + 75 + 150 + 25 = 330 Pa; 330 × 1.1 = 363 Pa; 330 / 249 = 1.325301… | 30 / 330 / 363 / 1.33 |
| Imperial defaults | 100 × 0.3048 = 30.48 m; 0.1 × 8.17 = 0.817 Pa/m; duct = 24.90216 Pa; other losses = 1.2 × 249 = 298.8 Pa; total = 323.70216 Pa; margin = 356.072376 Pa | 0.10 / 1.30 / 1.43 / 1.30 |
| Fractional metric | 12.5 × 0.8 = 10 Pa; 10 + 12.25 + 20.25 + 30.25 + 5.25 = 78 Pa; margin = 85.8 Pa; 78 / 249 = 0.313253… | 10 / 78 / 86 / 0.31 |

Imperial pressure outputs divide Pa by the existing factor 249. Imperial duct
loss is 0.100008674699… in.wg and total is 1.300008674699… in.wg. The
existing rounded friction conversion (8.17) is not exactly 249 / 30.48;
the tests preserve that approximation rather than changing the conversion.
The two default sets are separate examples, not physically identical inputs.

Additional coverage checks explicit zeros, each component independently
(249 Pa or 1 in.wg), defaults, and warning boundaries. Totals of 749.99, 750,
and 750.01 Pa all display 750 Pa, but only the last emits a warning. The
10% margin does not affect that decision. In imperial mode 3.01 in.wg
converts to 749.49 Pa and 3.02 converts to 751.98 Pa, straddling the threshold.

## Old versus new and limitations

Calculator results, formulas, limits, and text remain unchanged. Previously
the shared regression script covered electrical helpers only; these nine tests
add fan ESP numerical, conversion, and boundary coverage.

Negative, nonfinite, string, or unknown-unit inputs and bilingual warning
selection remain outside this suite. The engine currently selects warning
language using unit mode; these tests do not endorse that behavior. Input
validation and language handling merit a separate change. This suite makes no
regulatory certification claim. Future engineering formula changes require
qualified human review and independently justified reference calculations.

Run alongside `node agent/calculation-regression.mjs` and `npm run build`.
