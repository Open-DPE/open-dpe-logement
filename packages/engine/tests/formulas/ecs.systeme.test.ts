import * as formulas from "../../src/rules/ecs/systeme/formulas.js";
import { runTests } from "./utils.js";

runTests("ecs.systeme.test.yaml", {
	cecs: formulas.calcule_cecs,
	caux_dist: formulas.calcule_caux_dist,
	rd: formulas.calcule_rd,
	rendements_systeme_thermodynamique:
		formulas.calcule_rendements_systeme_thermodynamique,
	rendements_systeme_electrique: formulas.calcule_rendements_systeme_electrique,
});
