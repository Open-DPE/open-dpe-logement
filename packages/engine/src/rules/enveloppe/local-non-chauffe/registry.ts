import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";
import * as baie from "./baie/registry.js";
import * as paroi from "./paroi/registry.js";

export { baie, paroi };

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.b]: rules.b,
		[RULES.uvue]: rules.uvue,
		[RULES.aiu]: rules.aiu,
		[RULES.aue]: rules.aue,
		[RULES.isolation_aiu]: rules.isolation_aiu,
		[RULES.isolation_aue]: rules.isolation_aue,
		[RULES.sse]: rules.sse,
		[RULES.orientations]: rules.orientations,
		[RULES.t]: rules.t,
	},

	...baie.REGISTRY,
	...paroi.REGISTRY,
};
