import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";
import * as installation from "./installation/registry.js";

export { installation };

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: rules.consommations,
		[RULES.caux]: rules.caux,
		[RULES.qvarep_conv]: rules.qvarep_conv,
		[RULES.qvasouf_conv]: rules.qvasouf_conv,
		[RULES.smea_conv]: rules.smea_conv,
		[RULES.hvent]: rules.hvent,
	},

	...installation.REGISTRY,
};
