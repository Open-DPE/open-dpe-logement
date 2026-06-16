import * as formulas from "../../src/rules/enveloppe/mur/formulas.js";
import { runTests } from "./utils.js";

runTests("enveloppe.mur.test.yaml", {
	u0: formulas.calcule_u0,
});
