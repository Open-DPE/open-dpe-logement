import * as formulas from "../../src/rules/enveloppe/mur/formulas.js";
import { runTests } from "./utils.js";

runTests("enveloppe.mur.test.yaml", {
	dp: formulas.calcule_dp,
	isolation_aiu: formulas.calcule_isolation_aiu,
	u: formulas.calcule_u,
	u0: formulas.calcule_u0,
	paroi_ancienne: formulas.calcule_paroi_ancienne,
	u0_enduit_isolant: formulas.calcule_u0_enduit_isolant,
	u0_doublage: formulas.calcule_u0_doublage,
	isolation: formulas.set_isolation,
});
