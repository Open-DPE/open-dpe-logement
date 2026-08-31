import * as formulas from "../../src/rules/enveloppe/pont-thermique/formulas.js";
import { runTests } from "./utils.js";

runTests("enveloppe.pont-thermique.test.yaml", {
	pt: formulas.calcule_pt,
	kpt: formulas.calcule_kpt,
	isolation_mur: formulas.set_isolation_mur,
	isolation_plancher_haut: formulas.set_isolation_plancher_haut,
	isolation_plancher_bas: formulas.set_isolation_plancher_bas,
	type_isolation_mur: formulas.set_type_isolation_mur,
	type_isolation_plancher_haut: formulas.set_type_isolation_plancher_haut,
	type_isolation_plancher_bas: formulas.set_type_isolation_plancher_bas,
	largeur_dormant: formulas.set_largeur_dormant,
	presence_retour_isolation: formulas.set_presence_retour_isolation,
});
