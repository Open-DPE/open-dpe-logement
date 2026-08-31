import * as formulas from "../../src/rules/chauffage/systeme/dimensionnement/formulas.js";
import { runTests } from "./utils.js";

runTests("chauffage.systeme.dimensionnement.test.yaml", {
	rdim: formulas.calcule_rdim,
	role: formulas.calcule_role,
	configuration: formulas.calcule_configuration,
});
