import * as formulas from "../../src/rules/chauffage/emission/formulas.js";
import { runTests } from "./utils.js";

runTests("chauffage.emission.test.yaml", {
	cch: formulas.calcule_cch,
	cch1: formulas.calcule_cch1,
	cch2: formulas.calcule_cch2,
	int: formulas.calcule_int,
	i0: formulas.calcule_i0,
	ich: formulas.calcule_ich,
	ich1: formulas.calcule_ich1,
	ich2: formulas.calcule_ich2,
	re: formulas.calcule_re,
	rr: formulas.calcule_rr,
	type_emission: formulas.calcule_type_emission,
});
