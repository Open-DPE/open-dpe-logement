import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: rules.consommations,
		[RULES.cecs]: rules.cecs,
		[RULES.cecs_elec]: rules.cecs_elec,
		[RULES.caux_gen]: rules.caux_gen,
		[RULES.caux_gen_enr]: rules.caux_gen_enr,
		[RULES.rdim]: rules.rdim,
		[RULES.pn]: rules.pn,
		[RULES.pdim]: rules.pdim,
		[RULES.pecs]: rules.pecs,
		[RULES.paux]: rules.paux,
		[RULES.cop]: rules.cop,
		[RULES.combustion]: rules.combustion,
		[RULES.cr]: rules.cr,
		[RULES.qgw]: rules.qgw,
		[RULES.qgen]: rules.qgen,
	},
};
