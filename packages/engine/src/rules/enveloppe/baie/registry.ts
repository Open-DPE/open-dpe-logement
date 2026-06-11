import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.aiu]: rules.aiu,
		[RULES.isolation_aiu]: rules.isolation_aiu,
		[RULES.sdep]: rules.sdep,
		[RULES.b]: rules.b,
		[RULES.dp]: rules.dp,
		[RULES.u]: rules.u,
		[RULES.deltar]: rules.deltar,
		[RULES.uw]: rules.uw,
		[RULES.uw1]: rules.uw1,
		[RULES.uw2]: rules.uw2,
		[RULES.ug]: rules.ug,
		[RULES.sse]: rules.sse,
		[RULES.sw]: rules.sw,
		[RULES.sw1]: rules.sw1,
		[RULES.sw2]: rules.sw2,
		[RULES.fe]: rules.fe,
		[RULES.fe1]: rules.fe1,
		[RULES.fe2]: rules.fe2,
		[RULES.omb]: rules.omb,
		[RULES.c1]: rules.c1,
	},
};
