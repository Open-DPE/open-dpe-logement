import * as formulas from "../../src/rules/enveloppe/paroi/formulas.js";
import { runTests } from "./utils.js";

runTests("enveloppe.paroi.test.yaml", {
	aiu: formulas.calcule_aiu,
	sdep: formulas.calcule_sdep,
	b_lnc: formulas.calcule_b_lnc,
	b_ets: formulas.calcule_b_ets,
	b_autres: formulas.calcule_b_autres,
	annee_installation: formulas.set_annee_installation,
	annee_construction: formulas.set_annee_construction,
});
