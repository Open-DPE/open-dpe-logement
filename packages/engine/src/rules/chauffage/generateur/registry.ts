import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: rules.consommations,
		[RULES.cch]: rules.cch,
		[RULES.cch_elec]: rules.cch_elec,
		[RULES.caux_gen]: rules.caux_gen,
		[RULES.caux_gen_enr]: rules.caux_gen_enr,
		[RULES.rdim]: rules.rdim,
		[RULES.pn]: rules.pn,
		[RULES.pdim]: rules.pdim,
		[RULES.pch]: rules.pch,
		[RULES.paux]: rules.paux,
		[RULES.combustion]: rules.combustion,
		[RULES.scop]: rules.scop,
		[RULES.tfonc30]: rules.tfonc30,
		[RULES.tfonc100]: rules.tfonc100,
		[RULES.qgen_rec]: rules.qgen_rec,
		[RULES.qgen]: rules.qgen,
	},
};
