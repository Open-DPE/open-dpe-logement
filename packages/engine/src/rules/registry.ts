import { defineRegistry } from "#/core/registry.js";
import * as batiment from "./batiment/registry";
import * as chauffage from "./chauffage/registry";
import * as climat from "./climat/registry";
import * as diagnostic from "./diagnostic/registry";
import * as eclairage from "./eclairage/registry";
import * as ecs from "./ecs/registry";
import * as enveloppe from "./enveloppe/registry";
import * as production from "./production/registry";
import * as refroidissement from "./refroidissement/registry";
import * as ventilation from "./ventilation/registry";

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

export const REGISTRY = defineRegistry({
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
});
