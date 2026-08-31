import * as formulas from "../../src/rules/ecs/installation/formulas.js";
import { runTests } from "./utils.js";

runTests("ecs.installation.test.yaml", {
	becs: formulas.calcule_becs,
	caux_dist: formulas.calcule_caux_dist,
	rdim: formulas.calcule_rdim,
	fecs: formulas.calcule_fecs,
	qdw: formulas.calcule_qdw,
	qdw_ind_vc: formulas.calcule_qdw_ind_vc,
	qdw_col_vc: formulas.calcule_qdw_col_vc,
	qdw_col_hvc: formulas.calcule_qdw_col_hvc,
	anciennete_installation_solaire:
		formulas.set_anciennete_installation_solaire,
});
