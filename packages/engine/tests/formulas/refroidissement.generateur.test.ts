import * as formulas from "../../src/rules/refroidissement/generateur/formulas.js";
import { runTests } from "./utils.js";

runTests("refroidissement.generateur.test.yaml", {
	consommations: formulas.calcule_consommations,
	cfr_enr: formulas.calcule_cfr_enr,
	set_annee_installation: formulas.set_annee_installation,
	caux: formulas.calcule_caux,
	cfr_elec: formulas.calcule_cfr_elec,
	rdim: formulas.calcule_rdim,
	eer: formulas.calcule_eer,
	cfr: formulas.calcule_cfr,
});
