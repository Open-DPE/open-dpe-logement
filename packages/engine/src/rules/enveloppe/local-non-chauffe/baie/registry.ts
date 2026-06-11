import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.aue]: rules.aue,
		[RULES.aiu]: rules.aiu,
		[RULES.sst]: rules.sst,
		[RULES.t]: rules.t,
	},
};
