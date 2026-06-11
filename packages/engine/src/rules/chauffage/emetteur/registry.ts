import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.delta_pem]: rules.delta_pem,
		[RULES.fcot]: rules.fcot,
		[RULES.dtheta_dim]: rules.dtheta_dim,
	},
};
