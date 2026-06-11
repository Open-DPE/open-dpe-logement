import { NAMESPACE, RULES } from "./constants.js";
import * as rules from "./rules.js";

import * as baie from "./baie/registry.js";
import * as localNonChauffe from "./local-non-chauffe/registry.js";
import * as mur from "./mur/registry.js";
import * as niveau from "./niveau/registry.js";
import * as plancherBas from "./plancher-bas/registry.js";
import * as plancherHaut from "./plancher-haut/registry.js";
import * as pontThermique from "./pont-thermique/registry.js";
import * as porte from "./porte/registry.js";

export {
	baie,
	localNonChauffe,
	mur,
	niveau,
	plancherBas,
	plancherHaut,
	pontThermique,
	porte,
};

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.gv]: rules.gv,
		[RULES.ubat]: rules.ubat,
		[RULES.dp]: rules.dp,
		[RULES.dp_murs]: rules.dp_murs,
		[RULES.dp_planchers_bas]: rules.dp_planchers_bas,
		[RULES.dp_planchers_hauts]: rules.dp_planchers_hauts,
		[RULES.dp_baies]: rules.dp_baies,
		[RULES.dp_portes]: rules.dp_portes,
		[RULES.pt]: rules.pt,
		[RULES.dr]: rules.dr,
		[RULES.sdep]: rules.sdep,
		[RULES.sdep_murs]: rules.sdep_murs,
		[RULES.sdep_planchers_bas]: rules.sdep_planchers_bas,
		[RULES.sdep_planchers_hauts]: rules.sdep_planchers_hauts,
		[RULES.sdep_baies]: rules.sdep_baies,
		[RULES.sdep_portes]: rules.sdep_portes,
		[RULES.inertie]: rules.inertie,
		[RULES.hperm]: rules.hperm,
		[RULES.qvinf]: rules.qvinf,
		[RULES.n50]: rules.n50,
		[RULES.q4pa]: rules.q4pa,
		[RULES.q4paenv]: rules.q4paenv,
		[RULES.q4paconv]: rules.q4paconv,
		[RULES.isolation_murs_plafonds]: rules.isolation_murs_plafonds,
		[RULES.presence_joints]: rules.presence_joints,
		[RULES.parois_anciennes]: rules.parois_anciennes,
		[RULES.isolation_planchers_hauts]: rules.isolation_planchers_hauts,
		[RULES.presence_protection_solaire]: rules.presence_protection_solaire,
		[RULES.logement_traversant]: rules.logement_traversant,
		[RULES.sse]: rules.sse,
	},

	...baie.REGISTRY,
	...localNonChauffe.REGISTRY,
	...mur.REGISTRY,
	...niveau.REGISTRY,
	...plancherBas.REGISTRY,
	...plancherHaut.REGISTRY,
	...pontThermique.REGISTRY,
	...porte.REGISTRY,
};
