import * as formulas from "../../src/rules/ventilation/formulas.js";
import { runTests } from "./utils.js";

runTests("ventilation.test.yaml", {
	consommations: formulas.calcule_consommations,
	caux: formulas.calcule_caux,
	hvent: formulas.calcule_hvent,
	qvarep_conv: formulas.calcule_qvarep_conv,
	qvasouf_conv: formulas.calcule_qvasouf_conv,
	smea_conv: formulas.calcule_smea_conv,
});
