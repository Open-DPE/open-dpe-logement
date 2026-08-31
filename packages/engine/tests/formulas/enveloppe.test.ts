import * as formulas from "../../src/rules/enveloppe/formulas.js";
import { runTests } from "./utils.js";

runTests("enveloppe.test.yaml", {
	gv: formulas.calcule_gv,
	ubat: formulas.calcule_ubat,
	dp: formulas.calcule_dp,
	dr: formulas.calcule_dr,
	pt: formulas.calcule_pt,
	sdep: formulas.calcule_sdep,
	inertie: formulas.calcule_inertie,
	hperm: formulas.calcule_hperm,
	qvinf: formulas.calcule_qvinf,
	n50: formulas.calcule_n50,
	q4pa: formulas.calcule_q4pa,
	q4paenv: formulas.calcule_q4paenv,
	q4paconv: formulas.calcule_q4paconv,
	isolation_murs_plafonds: formulas.calcule_isolation_murs_plafonds,
	presence_joints: formulas.calcule_presence_joints,
	isolation_planchers_hauts: formulas.calcule_isolation_planchers_hauts,
	presence_protection_solaire: formulas.calcule_presence_protection_solaire,
	logement_traversant: formulas.calcule_logement_traversant,
	sse: formulas.calcule_sse,
});
