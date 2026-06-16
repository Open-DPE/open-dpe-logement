import * as formulas from "../../src/rules/refroidissement/installation/formulas.js";
import { runTests } from "./utils.js";

runTests("refroidissement.installation.test.yaml", {
	rdim: formulas.calcule_rdim,
});
