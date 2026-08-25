import * as models from "@open-dpe-logement/models";
import type { Input } from "./types.js";

export interface Mapper {
	input(): Input;
	output(): models.diagnostic.Diagnostic;

	batiment(): models.batiment.Batiment;
	enveloppe(): models.enveloppe.Enveloppe;
	refroidissement(): models.refroidissement.Refroidissement;
	production(): models.production.Production;
	chauffage(): models.chauffage.Chauffage;
	ecs(): models.ecs.Ecs;
	ventilation(): models.ventilation.Ventilation;
}

export function createMapper(): Mapper {
	throw new Error("Not implemented");
}
