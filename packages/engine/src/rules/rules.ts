import * as batiment from "./batiment/rules";
import * as chauffage from "./chauffage/rules";
import * as climat from "./climat/rules";
import * as diagnostic from "./diagnostic/rules";
import * as eclairage from "./eclairage/rules";
import * as ecs from "./ecs/rules";
import * as enveloppe from "./enveloppe/rules";
import * as production from "./production/rules";
import * as refroidissement from "./refroidissement/rules";
import * as ventilation from "./ventilation/rules";

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
