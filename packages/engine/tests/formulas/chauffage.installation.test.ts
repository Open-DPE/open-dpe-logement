import * as formulas from "../../src/rules/chauffage/installation/formulas.js";
import { runTests } from "./utils.js";

runTests("chauffage.installation.test.yaml", {
	caux_dist: formulas.calcule_caux_dist,
	bch: formulas.calcule_bch,
	rdim: formulas.calcule_rdim,
	pch: formulas.calcule_pch,
	fch: formulas.calcule_fch,
	effet_joule: formulas.calcule_effet_joule,
});
