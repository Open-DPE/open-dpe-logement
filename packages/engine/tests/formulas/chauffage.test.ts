import * as formulas from "../../src/rules/chauffage/formulas.js";
import { runTests } from "./utils.js";

runTests("chauffage.test.yaml", {
	consommations: formulas.calcule_consommations,
	cch: formulas.calcule_cch,
	cch_elec: formulas.calcule_cch_elec,
	caux: formulas.calcule_caux,
	caux_gen: formulas.calcule_caux_gen,
	caux_dist: formulas.calcule_caux_dist,
	bch: formulas.calcule_bch,
	bch_hp: formulas.calcule_bch_hp,
	bv: formulas.calcule_bv,
	pch: formulas.calcule_pch,
	f: formulas.calcule_f,
	as: formulas.calcule_as,
	ai: formulas.calcule_ai,
	qgw_rec: formulas.calcule_qgw_rec,
	qdw_rec: formulas.calcule_qdw_rec,
	qgen_rec: formulas.calcule_qgen_rec,
	qgen_ecs_rec: formulas.calcule_qgen_ecs_rec,
	effet_joule: formulas.calcule_effet_joule,
	nref: formulas.calcule_nref,
	dh: formulas.calcule_dh,
});
