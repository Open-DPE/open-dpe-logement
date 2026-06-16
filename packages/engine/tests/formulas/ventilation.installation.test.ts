import * as formulas from "../../src/rules/ventilation/installation/formulas.js";
import { runTests } from "./utils.js";

runTests("ventilation.installation.test.yaml", {
	rdim: formulas.calcule_rdim,
	rut: formulas.calcule_rut,
	hvent: formulas.calcule_hvent,
	caux: formulas.calcule_caux,
	debits: formulas.calcule_debits,
	pvent_moy: formulas.calcule_pvent_moy,
	type_ventilation: formulas.set_type_ventilation,
	annee_installation: formulas.set_annee_installation,
	presence_echangeur_thermique: formulas.set_presence_echangeur_thermique,
});
