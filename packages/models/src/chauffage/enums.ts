import * as z from "zod";

/**
 * Type de chauffage (central/divisé) — partagé par `chauffage/installation`
 * (`installation.type`) et `chauffage/systeme` (`systeme.type`), toutes deux
 * `x-enum: chauffage:type` dans le schéma.
 */
export const TYPES_CHAUFFAGE = {
	central: "central",
	divise: "divise",
} as const;

export const TypeChauffageEnum = z.enum(TYPES_CHAUFFAGE);
export type TypeChauffageEnum = z.infer<typeof TypeChauffageEnum>;
