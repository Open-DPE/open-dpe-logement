import * as formulas from "../../src/rules/ecs/formulas.js";
import { runTests } from "./utils.js";

runTests("ecs.test.yaml", {
	consommations: formulas.calcule_consommations,
	cecs: formulas.calcule_cecs,
	cecs_elec: formulas.calcule_cecs_elec,
	caux: formulas.calcule_caux,
	caux_gen: formulas.calcule_caux_gen,
	caux_dist: formulas.calcule_caux_dist,
	qgw: formulas.calcule_qgw,
	qgen: formulas.calcule_qgen,
	qdw_ind_vc: formulas.calcule_qdw_ind_vc,
	qdw_col_vc: formulas.calcule_qdw_col_vc,
	qdw_col_hvc: formulas.calcule_qdw_col_hvc,
	becs: formulas.calcule_becs,
	nadeq: formulas.calcule_nadeq,
	nmax: formulas.calcule_nmax,
});
