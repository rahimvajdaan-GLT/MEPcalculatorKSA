# Independent short-circuit terminal tests

Run `node --test tests/short-circuit.test.mjs`. The suite bundles the actual
engine with the installed esbuild into a temporary directory and cleans it up.
No production code, formulas, dependencies, or limits change.

## Assumptions and reference calculations

These tests cover only the existing balanced three-phase transformer-terminal
model: line-to-line RMS voltage, transformer apparent power in kVA, and
user-supplied percentage impedance on the transformer rating base. The model
assumes negligible upstream impedance and omits motor contribution, voltage
factors, asymmetry, and impedance tolerances. It does not establish equipment
breaking capacity or replace a fault study.

Independently evaluate nominal current as S × 1000 / (sqrt(3) × V) A and
terminal fault current as nominal current / (z / 100) / 1000 kA. Reference
arithmetic was checked separately with Python Decimal at 40-digit precision;
tests use fixed literals and no production arithmetic helpers.

| S (kVA) | V (V) | z (%) | Unrounded current (A) | Unrounded fault (kA) | Display A / kA |
| --- | --- | --- | --- | --- | --- |
| 1000 | 400 | 6 | 1443.375672974 | 24.056261216 | 1443.4 / 24.06 |
| 500 | 400 | 4 | 721.687836487 | 18.042195912 | 721.7 / 18.04 |
| 2000 | 415 | 8 | 2782.410935854 | 34.780136698 | 2782.4 / 34.78 |
| 1000 | 400 | 1 | 1443.375672974 | 144.337567297 | 1443.4 / 144.34 |
| 1000 | 400 | 20 | 1443.375672974 | 7.216878365 | 1443.4 / 7.22 |

The existing 1–20% accepted range and high-current warning are implementation
behavior, not verified standard requirements. Additional cases check numeric
form strings, published defaults, identical units in both display modes,
rejection just outside the impedance range, zero required values, and inactive
downstream inputs.

## Old versus new and review limits

All calculator results remain unchanged, including the five reference cases
above. Previously there was no dedicated short-circuit test suite; this patch
adds eight tests for the terminal calculation and selected input boundaries.

Active downstream calculation is outside this suite. Its transformer impedance
conversion merits a separate engineering review before relying on downstream
results. Negative/nonfinite input handling, malformed numeric strings, and
Arabic warning localization also remain unverified. Passing these tests does
not establish comprehensive validation or correctness of the entire calculator.

No Saudi Building Code, IEC, NFPA, ASHRAE, or SMACNA requirements were sourced
or verified here. This patch makes no regulatory certification claim. Any
future engineering formula change requires qualified human review and primary
sources for standard-dependent claims.

Run alongside `node agent/calculation-regression.mjs` and `npm run build`.
