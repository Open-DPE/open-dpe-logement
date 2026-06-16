import * as formulas from "../../src/rules/refroidissement/formulas.js";
import { runTests } from "./utils.js";

runTests("refroidissement.test.yaml", {
	tint: formulas.calcule_tint,
	cin: formulas.calcule_cin,
	t: formulas.calcule_t,
	cfr: formulas.calcule_cfr,
	cfr_elec: formulas.calcule_cfr_elec,
	caux: formulas.calcule_caux,
});
