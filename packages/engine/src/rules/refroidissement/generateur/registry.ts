import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: rules.consommations,
		[RULES.cfr]: rules.cfr,
		[RULES.cfr_enr]: rules.cfr_enr,
		[RULES.cfr_elec]: rules.cfr_elec,
		[RULES.caux]: rules.caux,
		[RULES.rdim]: rules.rdim,
		[RULES.eer]: rules.eer,
	},
};
