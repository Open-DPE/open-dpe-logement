import * as formulas from "../../src/rules/common/formulas.js";
import { runTests } from "./utils.js";

runTests("common.test.yaml", {
	consommations: formulas.calcule_consommations,
	fcep: formulas.calcule_fcep,
	feges: formulas.calcule_feges,
	kpcs: formulas.calcule_kpcs,
	cener: formulas.calcule_cener,
	celec: formulas.calcule_celec,
});
