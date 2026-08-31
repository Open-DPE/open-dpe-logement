import * as formulas from "../../src/rules/enveloppe/local-non-chauffe/paroi/formulas.js";
import { runTests } from "./utils.js";

runTests("enveloppe.local-non-chauffe.paroi.test.yaml", {
	aue: formulas.calcule_aue,
	aiu: formulas.calcule_aiu,
	isolation: formulas.set_isolation,
});
