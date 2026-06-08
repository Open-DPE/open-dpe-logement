import { buildEnum, createGuard } from "#/utils.js";
import type { Consommations } from "#/common/common";
import type { Chauffage } from "#/chauffage/chauffage.js";
import type { Ecs } from "#/ecs/ecs.js";
import type { Enveloppe } from "#/enveloppe/enveloppe.js";
import type { Production } from "#/production/production.js";
import type { Refroidissement } from "#/refroidissement/refroidissement.js";
import type { Ventilation } from "#/ventilation/ventilation.js";
import type { Batiment } from "#/batiment/batiment.js";

export const isDiagnostic = createGuard<Diagnostic>("/diagnostic");

/**
 * @see https://schemas.open-dpe.fr/diagnostic
 */
export type Diagnostic = {
	date_visite: string;
	date_etablissement: string;
	type: TypeDiagnostic;
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
	etiquette_energie: Etiquette;
	etiquette_climat: Etiquette;
	confort_ete: ConfortEte | null;
};

export const TYPES_DIAGNOSTIC = ["batiment", "logement"] as const;
export type TypeDiagnostic = (typeof TYPES_DIAGNOSTIC)[number];
export const TypeDiagnosticEnum = buildEnum(TYPES_DIAGNOSTIC);

export const ETIQUETTES = ["A", "B", "C", "D", "E", "F", "G"] as const;
export type Etiquette = (typeof ETIQUETTES)[number];
export const EtiquetteEnum = buildEnum(ETIQUETTES);

export type ConfortEte = 1 | 2 | 3;
