import * as formulas from "../../src/rules/enveloppe/baie/formulas.js";
import { runTests } from "./utils.js";

runTests("enveloppe.baie.test.yaml", {
	dp: formulas.calcule_dp,
	isolation_aiu: formulas.calcule_isolation_aiu,
	u: formulas.calcule_u,
	deltar: formulas.calcule_deltar,
	uw: formulas.calcule_uw,
	uw0: formulas.calcule_uw0,
	ug: formulas.calcule_ug,
	sse: formulas.calcule_sse,
	sw: formulas.calcule_sw,
	sw0: formulas.calcule_sw0,
	fe: formulas.calcule_fe,
	fe1: formulas.calcule_fe1,
	fe2: formulas.calcule_fe2,
	omb: formulas.calcule_omb,
	type_vitrage: formulas.set_type_vitrage,
	type_survitrage: formulas.set_type_survitrage,
	materiau: formulas.set_materiau,
	nature_lame_air: formulas.set_nature_lame_air,
	epaisseur_lame_air: formulas.set_epaisseur_lame_air,
	presence_rupteur_pont_thermique: formulas.set_presence_rupteur_pont_thermique,
	isolation: formulas.set_isolation,
});
