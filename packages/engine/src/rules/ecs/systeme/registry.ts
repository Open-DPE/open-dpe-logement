import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: rules.consommations,
		[RULES.cecs]: rules.cecs,
		[RULES.cecs_enr]: rules.cecs_enr,
		[RULES.cecs_elec]: rules.cecs_elec,
		[RULES.caux_dist]: rules.caux_dist,
		[RULES.caux_dist_enr]: rules.caux_dist_enr,
		[RULES.qcirb]: rules.qcirb,
		[RULES.qtrac]: rules.qtrac,
		[RULES.rdim]: rules.rdim,
		[RULES.iecs]: rules.iecs,
		[RULES.rd]: rules.rd,
		[RULES.rendements]: rules.rendements,
	},
};
