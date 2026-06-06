import { SCHEMA_KEYS } from "@open-dpe-logement/schemas";
import { createGuard } from "#/utils.js";
import type { Consommations, UUID } from "#/common/common";
import type { Chauffage } from "#/chauffage/chauffage.js";
import type { Ecs } from "#/ecs/ecs.js";
import type { Enveloppe } from "#/enveloppe/enveloppe.js";
import type { Production } from "#/production/production.js";
import type { Refroidissement } from "#/refroidissement/refroidissement.js";
import type { Ventilation } from "#/ventilation/ventilation.js";
import type { Batiment } from "#/batiment/batiment.js";

export const isDiagnostic = createGuard<Diagnostic>(SCHEMA_KEYS["diagnostic"]);

/**
 * @see https://schemas.open-dpe.fr/diagnostic
 */
export type Diagnostic = {
	date_visite: Date;
	date_etablissement: Date;
	batiment: Batiment;
	enveloppe: Enveloppe;
	chauffage: Chauffage;
	ecs: Ecs;
	ventilation: Ventilation;
	refroidissement: Refroidissement;
	production: Production;
};

export type DiagnosticWithData<T extends Diagnostic = Diagnostic> = T & {
	data: DiagnosticData;
};

export type DiagnosticData = {
	cef: number;
	cep: number;
	eges: number;
	consommations: Consommations;
};
