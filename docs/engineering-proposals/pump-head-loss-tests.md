# Independent pump head-loss tests

Run `node --test tests/pump-head-loss.test.mjs`. The suite bundles the actual
engine with the installed esbuild and cleans up its temporary files.

## Scope and assumptions

This test-only patch characterizes the existing additive head-loss model.
User-supplied component losses are assumed to belong to one selected flow path;
elevation is supplied for an open system and is zero for a closed loop.
No official standards material was available or used to justify design values.
The existing 15% margin, 50 m warning, and pressure factors are implementation
behavior, not verified requirements or recommendations.

The current friction input means head loss per **100 metres of pipe**, including
in imperial mode: pipe length in feet becomes metres, and friction head in feet
becomes metres of head per 100 m. This follows the current bilingual labels and
engine. These tests do not establish that this is the best imperial UX; a user
expecting ft/100 ft would obtain different results. The default unit sets are
separate examples and are not assumed physically equivalent.

## Independent reference calculations

Expected results are fixed literals, independent of production helpers. Arithmetic
was separately checked with Python Decimal. Pipe head is length/100 times friction
head; total adds fittings, equipment, and elevation. Margin head is total × 1.15.
Pressure uses margin head × 0.098 bar/m, then × 14.504 for psi. Head displays round
to one decimal, bar to two decimals, and psi to one decimal, only at output.

| Case | Reference arithmetic | Displayed pipe / total / margin / pressure |
| --- | --- | --- |
| Metric default | 100/100 × 3 = 3 m; total = 3+5+8 = 16 m; margin = 18.4 m; pressure = 1.8032 bar | 3 / 16 / 18.4 / 1.80 |
| Fractional metric | 25/100 × 2 = 0.5 m; total = 0.5+1.25+2.5+4 = 8.25 m; margin = 9.4875 m; pressure = 0.929775 bar | 0.5 / 8.3 / 9.5 / 0.93 |
| Elevation alone | Total = 10 m; margin = 11.5 m; pressure = 1.127 bar | 0 / 10 / 11.5 / 1.13 |
| Imperial | 100 ft = 30.48 m; 10 ft = 3.048 m; pipe = 0.9290304 m; other head = 9 ft = 2.7432 m; total = 3.6722304 m; margin = 4.22306496 m | 3.0 ft / 12.0 ft / 13.9 ft / 6.0 psi |

Imperial unrounded display values are 3.048 ft pipe, 12.048 ft total,
13.8552 ft margin, and 6.00263074962432 psi. Pressure is based on unrounded
margin head, rather than the rounded total or displayed margin.

Additional tests cover omitted defaults, explicit zero values, individual
components, and zero pipe length or friction. Metric totals 49.99, 50, and
50.01 m all display 50 m; only the last warns. The margin does not trigger the
warning. Imperial 164.04 ft converts to 49.999392 m and 164.045 ft converts to
50.000916 m; both display 164.0 ft, but only the latter warns.

## Old versus new and limitations

All calculator outputs, formulas, limits, and UI text remain unchanged. The new
suite adds ten tests for one existing calculator. Invalid inputs (negative,
nonfinite, strings, and unknown units) and warning-language selection remain
outside its scope. The current engine selects warning language by unit mode;
this suite checks warning counts only. It does not validate engineering design
assumptions or claim regulatory certification. Any future engineering formula
change requires qualified human review and independently justified references.

Run alongside `node agent/calculation-regression.mjs` and `npm run build`.
