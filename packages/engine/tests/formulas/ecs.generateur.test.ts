import * as formulas from "../../src/rules/ecs/generateur/formulas.js";
import { runTests } from "./utils.js";

runTests("ecs.generateur.test.yaml", {
	consommations: formulas.calcule_consommations,
	cecs: formulas.calcule_cecs,
	cecs_elec: formulas.calcule_cecs_elec,
	caux_gen: formulas.calcule_caux_gen,
	caux_gen_enr: formulas.calcule_caux_gen_enr,
	rdim: formulas.calcule_rdim,
	pn: formulas.calcule_pn,
	pdim: formulas.calcule_pdim,
	pecs: formulas.calcule_pecs,
	paux: formulas.calcule_paux,
	cop: formulas.calcule_cop,
	combustion: formulas.calcule_combustion,
	cr: formulas.calcule_cr,
	qgw: formulas.calcule_qgw,
	qgen: formulas.calcule_qgen,
	type_generateur: formulas.set_type_generateur,
	energie_generateur: formulas.set_energie_generateur,
	mode_combustion: formulas.set_mode_combustion,
	presence_ventouse: formulas.set_presence_ventouse,
	annee_installation: formulas.set_annee_installation,
	volume_stockage: formulas.set_volume_stockage,
});
