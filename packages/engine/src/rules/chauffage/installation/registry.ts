import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.caux_dist]: rules.caux_dist,
		[RULES.bch]: rules.bch,
		[RULES.rdim]: rules.rdim,
		[RULES.pch]: rules.pch,
		[RULES.fch]: rules.fch,
	},
};
