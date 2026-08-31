import * as z from "zod";
import { ConfortEte, Etiquette, TypeDiagnostic } from "./enums.js";
import { Consommations } from "../common/types.js";
import { Chauffage, ChauffageWithData } from "../chauffage/types.js";
import { Ecs, EcsWithData } from "../ecs/types.js";
import { Enveloppe, EnveloppeWithData } from "../enveloppe/types.js";
import { Production, ProductionWithData } from "../production/types.js";
import {
	Refroidissement,
	RefroidissementWithData,
} from "../refroidissement/types.js";
import { Ventilation, VentilationWithData } from "../ventilation/types.js";
import { Batiment, BatimentWithData } from "../batiment/types.js";

export const Diagnostic = z.object({
	date_visite: z.string(),
	date_etablissement: z.string(),
	type: TypeDiagnostic,
	batiment: Batiment,
	enveloppe: Enveloppe,
	chauffage: Chauffage,
	ecs: Ecs,
	ventilation: Ventilation,
	refroidissement: Refroidissement,
	production: Production,
});

export const DiagnosticData = z.object({
	cef: z.number(),
	cep: z.number(),
	eges: z.number(),
	consommations: Consommations,
	etiquette_energie: Etiquette,
	etiquette_climat: Etiquette,
	confort_ete: ConfortEte.nullable(),
});

export const DiagnosticWithData = Diagnostic.extend({
	data: DiagnosticData,
	batiment: BatimentWithData,
	enveloppe: EnveloppeWithData,
	chauffage: ChauffageWithData,
	ecs: EcsWithData,
	ventilation: VentilationWithData,
	refroidissement: RefroidissementWithData,
	production: ProductionWithData,
});

export type Diagnostic = z.infer<typeof Diagnostic>;
export type DiagnosticData = z.infer<typeof DiagnosticData>;
export type DiagnosticWithData = z.infer<typeof DiagnosticWithData>;
