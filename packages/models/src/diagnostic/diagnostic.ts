import { buildEnum } from "../utils.js";
import type { Consommations } from "../common/common.js";
import type { Chauffage, ChauffageWithData } from "../chauffage/chauffage.js";
import type { Ecs, EcsWithData } from "../ecs/ecs.js";
import type { Enveloppe, EnveloppeWithData } from "../enveloppe/enveloppe.js";
import type {
	Production,
	ProductionWithData,
} from "../production/production.js";
import type {
	Refroidissement,
	RefroidissementWithData,
} from "../refroidissement/refroidissement.js";
import type {
	Ventilation,
	VentilationWithData,
} from "../ventilation/ventilation.js";
import type { Batiment, BatimentWithData } from "../batiment/batiment.js";

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
	batiment: BatimentWithData;
	enveloppe: EnveloppeWithData;
	chauffage: ChauffageWithData;
	ecs: EcsWithData;
	ventilation: VentilationWithData;
	refroidissement: RefroidissementWithData;
	production: ProductionWithData;
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
