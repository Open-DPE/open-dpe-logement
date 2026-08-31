import * as formulas from "../../src/rules/enveloppe/plancher-haut/formulas.js";
import { runTests } from "./utils.js";

runTests("enveloppe.plancher-haut.test.yaml", {
	dp: formulas.calcule_dp,
	isolation_aiu: formulas.calcule_isolation_aiu,
	u: formulas.calcule_u,
	u0: formulas.calcule_u0,
	isolation: formulas.set_isolation,
});
