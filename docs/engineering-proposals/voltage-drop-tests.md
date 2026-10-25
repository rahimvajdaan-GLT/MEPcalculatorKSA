# Independent voltage-drop regression tests

Run `node tests/voltage-drop.test.mjs` from the repository root. The suite
bundles the actual calculator engine using the already installed esbuild,
loads it from a temporary directory, and removes the bundle after testing.
No production files, dependencies, engineering formulas, or limits change.

## Reference calculations and assumptions

These tests check the existing simplified resistive model, not compliance with
IEC or any other standard. Assume steady balanced three-phase loading or a
single-phase circuit with a return conductor, one-way length in metres, area
in mm², current in amperes, and voltage in volts. Reactance and temperature
corrections are excluded. Resistivities 0.01724 (Cu) and 0.0283 (Al) Ω·mm²/m
are existing model inputs, not independently verified material specifications.

The following reference arithmetic was evaluated separately with Python Decimal
at 40-digit precision. Expected test values are fixed literals; tests do not
derive expectations by calling calculator helpers.

Use R = resistivity × length / area, ΔV = 2IRpf for single phase and
ΔV = √3 IRpf for balanced three phase. Percentage drop is 100ΔV / voltage.

| Case | Inputs: I, length, area, pf, voltage | Reference ΔV (V) | Reference drop (%) | Display ΔV / % |
| --- | --- | --- | --- | --- |
| Single-phase Cu | 10, 30, 2.5, 1, 230 | 4.1376 | 1.798956521739 | 4.14 / 1.80 |
| Three-phase Cu | 100, 50, 25, 0.9, 400 | 5.374900066048 | 1.343725016512 | 5.37 / 1.34 |
| Single-phase Al | 40, 75, 16, 0.8, 230 | 8.49 | 3.691304347826 | 8.49 / 3.69 |

For power input, 2.3 kW / 230 V gives 10 A at unity power factor.
For balanced three phase, 70,000 / (√3 × 400 × 0.9) gives
112.262552342427 A. With the three-phase Cu geometry above, drop is
6.034 V or 1.5085%, displayed as 6.03 V and 1.51%.

For automatic selection with the single-phase Cu case and a user-entered 3%
limit, the first three passing entries in the existing size list are
1.5, 2.5, and 4 mm². Their unrounded voltage drops are 6.896, 4.1376,
and 2.586 V. The first displays 3.00% but is below 3% before rounding.
This checks voltage drop selection only; it does not establish cable ampacity
or protection suitability.

## Boundary coverage and limitations

Tests cover equality at a user-entered limit, a small exceedance hidden by
display rounding, zero required inputs, the inclusive existing percentage
input bounds, and equivalence of unit modes (both configurations explicitly
label cable length in m and area in mm²). These are characterizations of
existing behavior, not endorsements of prescribed design limits.

This suite does not certify validation of all malformed inputs. In particular,
negative quantities, nonfinite numbers, unknown selector values, and power
factor clamping warrant a separate validation review. No new standards claims
or regulatory certification are made. Any future engineering formula change
requires qualified human review and additional independent references.

## Old versus new

All calculator outputs remain unchanged. Previously the shared regression
script checked basic current arithmetic and voltage-drop trends; the new
13-test suite adds independent numerical fixtures and calculator-level boundary
coverage. Run it separately alongside `node agent/calculation-regression.mjs`
and `npm run build`.
