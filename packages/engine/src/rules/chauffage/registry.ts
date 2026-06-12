import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

import * as emetteur from "./emetteur/registry.js";
import * as generateur from "./generateur/registry.js";
import * as installation from "./installation/registry.js";
import * as systeme from "./systeme/registry.js";
import * as emission from "./emission/registry.js";

export { emetteur, generateur, installation, systeme };

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: rules.consommations,
		[RULES.cch]: rules.cch,
		[RULES.cch_elec]: rules.cch_elec,
		[RULES.caux_gen]: rules.caux_gen,
		[RULES.caux_dist]: rules.caux_dist,
		[RULES.bch]: rules.bch,
		[RULES.bch_hp]: rules.bch_hp,
		[RULES.bv]: rules.bv,
		[RULES.pch]: rules.pch,
		[RULES.f]: rules.f,
		[RULES.as]: rules.as,
		[RULES.ai]: rules.ai,
		[RULES.qgw_rec]: rules.qgw_rec,
		[RULES.qdw_rec]: rules.qdw_rec,
		[RULES.qgen_ecs_rec]: rules.qgen_ecs_rec,
		[RULES.effet_joule]: rules.effet_joule,
		[RULES.nref]: rules.nref,
		[RULES.dh]: rules.dh,
	},

	...emetteur.REGISTRY,
	...generateur.REGISTRY,
	...installation.REGISTRY,
	...systeme.REGISTRY,
	...emission.REGISTRY,
};
