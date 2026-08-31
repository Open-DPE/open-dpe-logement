import * as formulas from "../../src/rules/production/formulas.js";
import { runTests } from "./utils.js";

runTests("production.test.yaml", {
	ppv: formulas.calcule_ppv,
	tapl: formulas.calcule_tapl,
	celec_ac_total: formulas.calcule_celec_ac_total,
	celec_ac: formulas.calcule_celec_ac,
	celec_total: formulas.calcule_celec_total,
	celec: formulas.calcule_celec,
	celec_autres: formulas.calcule_celec_autres,
});
