import * as z from "zod";

/**
 * Type de chauffage (central/divisé) — partagé par `chauffage/installation`
 * (`installation.type`) et `chauffage/systeme` (`systeme.type`), toutes deux
 * `x-enum: chauffage:type` dans le schéma.
 */
export const TypeChauffage = z.enum({
	central: "central",
	divise: "divise",
});

export type TypeChauffage = z.infer<typeof TypeChauffage>;
