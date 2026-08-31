import * as formulas from "../../src/rules/refroidissement/formulas.js";
import { runTests } from "./utils.js";

runTests("refroidissement.test.yaml", {
	consommations: formulas.calcule_consommations,
	tint: formulas.calcule_tint,
	cin: formulas.calcule_cin,
	t: formulas.calcule_t,
	cfr: formulas.calcule_cfr,
	cfr_elec: formulas.calcule_cfr_elec,
	caux: formulas.calcule_caux,
	bfr: formulas.calcule_bfr,
	fut: formulas.calcule_fut,
	rbth: formulas.calcule_rbth,
	as: formulas.calcule_as,
	ai: formulas.calcule_ai,
	e: formulas.calcule_e,
	textmoy: formulas.calcule_textmoy,
	nref: formulas.calcule_nref,
});
