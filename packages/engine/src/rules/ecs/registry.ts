import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

import * as generateur from "./generateur/registry.js";
import * as installation from "./installation/registry.js";
import * as systeme from "./systeme/registry.js";

export { generateur, installation, systeme };

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: rules.consommations,
		[RULES.cecs]: rules.cecs,
		[RULES.cecs_elec]: rules.cecs_elec,
		[RULES.caux]: rules.caux,
		[RULES.caux_gen]: rules.caux_gen,
		[RULES.caux_dist]: rules.caux_dist,
		[RULES.qgw]: rules.qgw,
		[RULES.qgen]: rules.qgen,
		[RULES.qdw_ind_vc]: rules.qdw_ind_vc,
		[RULES.qdw_col_vc]: rules.qdw_col_vc,
		[RULES.qdw_col_hvc]: rules.qdw_col_hvc,
		[RULES.becs]: rules.becs,
		[RULES.nadeq]: rules.nadeq,
		[RULES.nmax]: rules.nmax,
	},

	...generateur.REGISTRY,
	...installation.REGISTRY,
	...systeme.REGISTRY,
};
