import { runTests } from "./utils.js";
import * as formulas from "../../src/rules/chauffage/systeme/formulas.js";

runTests("chauffage.systeme.test.yaml", {
	rg_combustion: formulas.calcule_rg_combustion,
});
