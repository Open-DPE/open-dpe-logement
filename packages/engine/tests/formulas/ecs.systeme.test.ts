import * as formulas from "../../src/rules/ecs/systeme/formulas.js";
import { runTests } from "./utils.js";

runTests("ecs.systeme.test.yaml", {
	consommations: formulas.calcule_consommations,
	cecs: formulas.calcule_cecs,
	cecs_elec: formulas.calcule_cecs_elec,
	cecs_enr: formulas.calcule_cecs_enr,
	caux_dist: formulas.calcule_caux_dist,
	caux_dist_enr: formulas.calcule_caux_dist_enr,
	qcirb: formulas.calcule_qcirb,
	qtrac: formulas.calcule_qtrac,
	rdim: formulas.calcule_rdim,
	iecs: formulas.calcule_iecs,
	rd: formulas.calcule_rd,
	rendements_reseau_chaleur: formulas.calcule_rendements_reseau_chaleur,
	rendements_chaudiere_mixte: formulas.calcule_rendements_chaudiere_mixte,
	rendements_chauffe_eau_gaz: formulas.calcule_rendements_chauffe_eau_gaz,
	rendements_systeme_thermodynamique:
		formulas.calcule_rendements_systeme_thermodynamique,
	rendements_systeme_electrique: formulas.calcule_rendements_systeme_electrique,
	bouclage_reseau: formulas.set_bouclage_reseau,
	isolation_reseau: formulas.set_isolation_reseau,
});
