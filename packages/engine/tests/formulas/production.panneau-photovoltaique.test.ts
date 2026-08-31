import * as formulas from "../../src/rules/production/panneau-photovoltaique/formulas.js";
import { runTests } from "./utils.js";

runTests("production.panneau-photovoltaique.test.yaml", {
	ppv: formulas.calcule_ppv,
	kpv: formulas.calcule_kpv,
	spv: formulas.set_spv,
});
