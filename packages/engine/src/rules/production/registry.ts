import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";
import * as panneauPhotovoltaïque from "./panneau-photovoltaique/registry.js";

export { panneauPhotovoltaïque };

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.ppv]: rules.ppv,
		[RULES.celec_total]: rules.celec_total,
		[RULES.celec]: rules.celec,
		[RULES.celec_ac_total]: rules.celec_ac_total,
		[RULES.celec_ac]: rules.celec_ac,
		[RULES.tapl]: rules.tapl,
	},
	...panneauPhotovoltaïque.REGISTRY,
};
