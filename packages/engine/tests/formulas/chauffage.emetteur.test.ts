import * as formulas from "../../src/rules/chauffage/emetteur/formulas.js";
import { runTests } from "./utils.js";

runTests("chauffage.emetteur.test.yaml", {
	delta_pem: formulas.calcule_delta_pem,
	fcot: formulas.calcule_fcot,
	dtheta_dim: formulas.calcule_dtheta_dim,
	temperature_distribution: formulas.set_temperature_distribution,
	annee_installation: formulas.set_annee_installation,
});
