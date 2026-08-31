import * as formulas from "../../src/rules/enveloppe/local-non-chauffe/baie/formulas.js";
import { runTests } from "./utils.js";

runTests("enveloppe.local-non-chauffe.baie.test.yaml", {
	aue: formulas.calcule_aue,
	aiu: formulas.calcule_aiu,
	sst: formulas.calcule_sst,
	t: formulas.calcule_t,
	isolation: formulas.set_isolation,
	type_vitrage: formulas.set_type_vitrage,
	materiau: formulas.set_materiau,
	presence_rupteur_pont_thermique: formulas.set_presence_rupteur_pont_thermique,
});
