import * as formulas from "../../src/rules/diagnostic/formulas.js";
import { runTests } from "./utils.js";

runTests("diagnostic.test.yaml", {
	consommations: formulas.calcule_consommations,
	cef: formulas.calcule_cef,
	cep: formulas.calcule_cep,
	eges: formulas.calcule_eges,
	etiquette_energie: formulas.calcule_etiquette_energie,
	etiquette_climat: formulas.calcule_etiquette_climat,
	confort_ete: formulas.calcule_confort_ete,
});
