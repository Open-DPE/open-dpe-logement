import * as formulas from "../../src/rules/chauffage/generateur/formulas.js";
import { runTests } from "./utils.js";

runTests("chauffage.generateur.test.yaml", {
	consommations: formulas.calcule_consommations,
	cch: formulas.calcule_cch,
	cch_elec: formulas.calcule_cch_elec,
	caux_gen: formulas.calcule_caux_gen,
	caux_gen_enr: formulas.calcule_caux_gen_enr,
	rdim: formulas.calcule_rdim,
	pn: formulas.calcule_pn,
	pdim: formulas.calcule_pdim,
	pch: formulas.calcule_pch,
	paux: formulas.calcule_paux,
	combustion: formulas.calcule_combustion,
	scop: formulas.calcule_scop,
	tfonc30: formulas.calcule_tfonc30,
	tfonc100: formulas.calcule_tfonc100,
	qgen_rec: formulas.calcule_qgen_rec,
	qgen: formulas.calcule_qgen,
	qpx_chaudiere_combustion: formulas.calcule_qpx_chaudiere_combustion,
	qpx_autres: formulas.calcule_qpx_autres,
	type_generateur: formulas.set_type_generateur,
	energie_generateur: formulas.set_energie_generateur,
	mode_combustion: formulas.set_mode_combustion,
	presence_ventouse: formulas.set_presence_ventouse,
	presence_regulation: formulas.set_presence_regulation,
	annee_installation: formulas.set_annee_installation,
});
