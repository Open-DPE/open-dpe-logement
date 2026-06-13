import * as batiment from "./batiment/rules.js";
import * as chauffage from "./chauffage/rules.js";
import * as climat from "./climat/rules.js";
import * as diagnostic from "./diagnostic/rules.js";
import * as eclairage from "./eclairage/rules.js";
import * as ecs from "./ecs/rules.js";
import * as enveloppe from "./enveloppe/rules.js";
import * as production from "./production/rules.js";
import * as refroidissement from "./refroidissement/rules.js";
import * as ventilation from "./ventilation/rules.js";

export {
	batiment,
	chauffage,
	climat,
	diagnostic,
	eclairage,
	ecs,
	enveloppe,
	production,
	refroidissement,
	ventilation,
};

export const REGISTRY = {
	...batiment.REGISTRY,
	...chauffage.REGISTRY,
	...climat.REGISTRY,
	...diagnostic.REGISTRY,
	...eclairage.REGISTRY,
	...ecs.REGISTRY,
	...enveloppe.REGISTRY,
	...production.REGISTRY,
	...refroidissement.REGISTRY,
	...ventilation.REGISTRY,
};
