import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.ppv]: rules.ppv,
		[RULES.kpv]: rules.kpv,
	},
};
