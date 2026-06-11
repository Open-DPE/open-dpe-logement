import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

import * as generateur from "./generateur/registry.js";
import * as installation from "./installation/registry.js";

export { generateur, installation };

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: rules.consommations,
		[RULES.cfr]: rules.cfr,
		[RULES.cfr_elec]: rules.cfr_elec,
		[RULES.caux]: rules.caux,
		[RULES.bfr]: rules.bfr,
		[RULES.fut]: rules.fut,
		[RULES.rbth]: rules.rbth,
		[RULES.as]: rules.as,
		[RULES.ai]: rules.ai,
		[RULES.e]: rules.e,
		[RULES.textmoy]: rules.textmoy,
		[RULES.nref]: rules.nref,
		[RULES.tint]: rules.tint,
		[RULES.t]: rules.t,
		[RULES.cin]: rules.cin,
	},

	...generateur.REGISTRY,
	...installation.REGISTRY,
};
