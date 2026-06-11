import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: rules.consommations,
		[RULES.cch]: rules.cch,
		[RULES.cch_elec]: rules.cch_elec,
		[RULES.cch_enr]: rules.cch_enr,
		[RULES.caux_dist]: rules.caux_dist,
		[RULES.caux_dist_enr]: rules.caux_dist_enr,
		[RULES.rdim]: rules.rdim,
		[RULES.pch]: rules.pch,
		[RULES.int]: rules.int,
		[RULES.ich]: rules.ich,
		[RULES.rd]: rules.rd,
		[RULES.re]: rules.re,
		[RULES.rg]: rules.rg,
		[RULES.rr]: rules.rr,
		[RULES.pcircem]: rules.pcircem,
	},
};
