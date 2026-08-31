import * as z from "zod";
import {
	id,
	description,
	surface,
	non_applicable,
	annee_installation,
} from "../../common/types.js";
import { TypeChauffage } from "../enums.js";
import { TypeProgrammation, UsageSolaire } from "./enums.js";
import { Systeme, SystemeWithData } from "../systeme/types.js";

/**
 * @see https://schemas.open-dpe.fr/chauffage/installation#/$defs/solaire
 * `fch` porte un `maximum: 1` en plus de son `oneOf[nombre, const null]`.
 */
export const SolaireThermique = z.object({
	usage: UsageSolaire,
	annee_installation,
	fch: z.number().max(1).nullable(),
});

export type SolaireThermique = z.infer<typeof SolaireThermique>;

export const InstallationData = z.object({
	bch: z.number(),
	rdim: z.number(),
	pch: z.number(),
	fch: z.number(),
});

export type InstallationData = z.infer<typeof InstallationData>;

/**
 * @see https://schemas.open-dpe.fr/chauffage/installation
 *
 * `systemes` reste `z.array(Systeme).min(1)` — volontairement IDENTIQUE sur
 * les 3 branches ci-dessous, plutôt que restreint par branche (ex.
 * `z.array(SystemeDivise)` pour la branche `divise`, ou un `.refine()` propre
 * à chaque branche centrale). Les deux règles métier réelles — « une
 * installation centrale contient au moins un système central » et « une
 * installation divisée ne contient que des systèmes divisés » — sont donc
 * appliquées après-coup par le `.superRefine()` sur `Installation` plus bas,
 * et NON par le système de types.
 *
 * Pourquoi : si `systemes` avait un type différent par branche, le type
 * `Installation` serait discriminé simultanément sur `type` ET sur
 * `systemes`, ce qui casse toute fonction générique qui lit/transforme
 * `item.systemes` sans avoir d'abord discriminé sur `item.type` — exactement
 * le cas de `packages/engine/src/rules/chauffage/installation/service.ts`
 * (`item.systemes.map(...)`) et de `apps/ambassadeurs-renov/src/models/geste.ts`,
 * qui opèrent sur `Installation` en générique. Garder `systemes` uniforme au
 * niveau des types tout en renforçant la contrainte au niveau runtime
 * (`safeParse`) donne le meilleur des deux : la donnée est toujours validée,
 * et le code consommateur générique continue de type-checker.
 */
export const InstallationBase = z.object({
	id,
	description,
	surface,
	type: TypeChauffage,
	installation_collective: z.boolean(),
	comptage_individuel: z.boolean().nullable(),
	regulation_terminale: z.boolean().nullable(),
	programmation: TypeProgrammation,
	solaire_thermique: SolaireThermique.nullable(),
	systemes: z.array(Systeme).min(1),
});

export const InstallationChauffageCentralCollectif = InstallationBase.extend({
	type: TypeChauffage.extract(["central"]),
	installation_collective: z.literal(true),
	comptage_individuel: z.boolean(),
	regulation_terminale: z.boolean(),
	programmation: TypeProgrammation.extract([
		"absent",
		"central_collectif_sans_detection_presence",
		"central_collectif_avec_detection_presence",
	]),
});

export const InstallationChauffageCentralIndividuel = InstallationBase.extend({
	type: TypeChauffage.extract(["central"]),
	installation_collective: z.literal(false),
	comptage_individuel: non_applicable,
	regulation_terminale: z.boolean(),
	programmation: TypeProgrammation.extract([
		"absent",
		"central_sans_minimum_temperature",
		"central_avec_minimum_temperature",
		"terminal_avec_minimum_temperature",
		"terminal_avec_minimum_temperature_detection_presence",
	]),
});

export const InstallationChauffageDivise = InstallationBase.extend({
	type: TypeChauffage.extract(["divise"]),
	installation_collective: z.literal(false),
	comptage_individuel: non_applicable,
	regulation_terminale: non_applicable,
	programmation: TypeProgrammation.extract([
		"absent",
		"central_sans_minimum_temperature",
		"central_avec_minimum_temperature",
		"terminal_avec_minimum_temperature",
		"terminal_avec_minimum_temperature_detection_presence",
	]),
});

const InstallationUnion = z.union([
	InstallationChauffageCentralCollectif,
	InstallationChauffageCentralIndividuel,
	InstallationChauffageDivise,
]);

/**
 * Contrainte `contains` du schéma (« une installation centrale a au moins un
 * système central ») + son pendant symétrique (« une installation divisée ne
 * contient que des systèmes divisés ») — appliquées ici en `.superRefine()`
 * plutôt qu'en restriction de type par branche, voir le commentaire sur
 * `InstallationBase.systemes` ci-dessus pour la raison.
 */
export const Installation = InstallationUnion.superRefine(
	(installation, ctx) => {
		if (installation.type === TypeChauffage.enum.central) {
			if (
				!installation.systemes.some(
					(s) => s.type === TypeChauffage.enum.central,
				)
			) {
				ctx.addIssue({
					code: "custom",
					message:
						"Une installation centrale doit avoir au moins un système central",
					path: ["systemes"],
				});
			}
		} else {
			if (
				!installation.systemes.every(
					(s) => s.type === TypeChauffage.enum.divise,
				)
			) {
				ctx.addIssue({
					code: "custom",
					message:
						"Une installation divisée ne peut contenir que des systèmes divisés",
					path: ["systemes"],
				});
			}
		}
	},
);

export const InstallationWithData = z.intersection(
	Installation,
	z.object({
		data: InstallationData,
		systemes: z.array(SystemeWithData).min(1),
	}),
);

export type Installation = z.infer<typeof Installation>;
export type InstallationBase = z.infer<typeof InstallationBase>;
export type InstallationChauffageCentralCollectif = z.infer<
	typeof InstallationChauffageCentralCollectif
>;
export type InstallationChauffageCentralIndividuel = z.infer<
	typeof InstallationChauffageCentralIndividuel
>;
export type InstallationChauffageDivise = z.infer<
	typeof InstallationChauffageDivise
>;
export type InstallationWithData = z.infer<typeof InstallationWithData>;
