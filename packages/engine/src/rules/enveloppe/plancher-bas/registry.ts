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
		[RULES.u0]: rules.u0,
		[RULES.uint]: rules.uint,
		[RULES.ue]: rules.ue,
	},
};
