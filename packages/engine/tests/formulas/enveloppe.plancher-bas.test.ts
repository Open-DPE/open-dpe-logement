import * as formulas from "../../src/rules/enveloppe/plancher-bas/formulas.js";
import { runTests } from "./utils.js";

runTests("enveloppe.plancher-bas.test.yaml", {
	dp: formulas.calcule_dp,
	isolation_aiu: formulas.calcule_isolation_aiu,
	u: formulas.calcule_u,
	uint: formulas.calcule_uint,
	ue: formulas.calcule_ue,
	ue_applicable: formulas.calcule_ue_applicable,
	u0: formulas.calcule_u0,
	isolation: formulas.set_isolation,
});
