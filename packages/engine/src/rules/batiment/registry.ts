import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.sh]: rules.sh,
		[RULES.hsp]: rules.hsp,
		[RULES.ratio_proratisation]: rules.ratio_proratisation,
	},
};
