import * as formulas from "../../src/rules/enveloppe/masque/formulas.js";
import { runTests } from "./utils.js";

runTests("enveloppe.masque.test.yaml", {
	fe1: formulas.calcule_fe1,
	fe2: formulas.calcule_fe2,
	omb: formulas.calcule_omb,
});
