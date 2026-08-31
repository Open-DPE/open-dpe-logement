import * as formulas from "../../src/rules/enveloppe/niveau/formulas.js";
import { runTests } from "./utils.js";

runTests("enveloppe.niveau.test.yaml", {
	inertie: formulas.calcule_inertie,
	set_inertie: formulas.set_inertie,
});
