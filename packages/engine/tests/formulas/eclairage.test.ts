import * as formulas from "../../src/rules/eclairage/formulas.js";
import { runTests } from "./utils.js";

runTests("eclairage.test.yaml", {
	nhecl: formulas.calcule_nhecl,
	cecl: formulas.calcule_cecl,
});
