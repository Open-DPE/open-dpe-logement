import * as formulas from "../../src/rules/enveloppe/local-non-chauffe/formulas.js";
import { runTests } from "./utils.js";

runTests("enveloppe.local-non-chauffe.test.yaml", {
	blnc: formulas.calcule_blnc,
	bver: formulas.calcule_bver,
	uvue: formulas.calcule_uvue,
	aue: formulas.calcule_aue,
	isolation_aue: formulas.calcule_isolation_aue,
	aiu: formulas.calcule_aiu,
	isolation_aiu: formulas.calcule_isolation_aiu,
	sse: formulas.calcule_sse,
	t: formulas.calcule_t,
	orientations: formulas.calcule_orientations,
});
