import * as formulas from "../../src/rules/climat/formulas.js";
import { runTests } from "./utils.js";

runTests("climat.test.yaml", {
	zone_climatique: formulas.calcule_zone_climatique,
	tbase: formulas.calcule_tbase,
	nj: formulas.calcule_nj,
	sollicitations: formulas.calcule_sollicitations,
	c1: formulas.calcule_c1,
	epv: formulas.calcule_epv,
});
