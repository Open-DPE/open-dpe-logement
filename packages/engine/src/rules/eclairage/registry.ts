import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: rules.consommations,
		[RULES.cecl]: rules.cecl,
		[RULES.nhecl]: rules.nhecl,
	},
};
