import * as formulas from "../../src/rules/enveloppe/porte/formulas.js";
import { runTests } from "./utils.js";

runTests("enveloppe.porte.test.yaml", {
	dp: formulas.calcule_dp,
	isolation_aiu: formulas.calcule_isolation_aiu,
	u: formulas.calcule_u,
	taux_vitrage: formulas.set_taux_vitrage,
	isolation: formulas.set_isolation,
	materiau: formulas.set_materiau,
	type_vitrage: formulas.set_type_vitrage,
});
