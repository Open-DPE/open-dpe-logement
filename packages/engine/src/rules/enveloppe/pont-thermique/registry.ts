import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.pt]: rules.pt,
		[RULES.kpt]: rules.kpt,
	},
};
