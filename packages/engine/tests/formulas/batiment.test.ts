import * as formulas from "../../src/rules/batiment/formulas.js";
import { runTests } from "./utils.js";

runTests("batiment.test.yaml", {
	ratio_proratisation: formulas.calcule_ratio_proratisation,
	sh: formulas.calcule_sh,
	hsp: formulas.calcule_hsp,
});
