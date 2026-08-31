import * as z from "zod";
import { Energie, Mois, Usage } from "./enums.js";

export const id = z.uuid();

export const date = z.date();

export const nombre = z.number();

export const nombre_positif = nombre.gt(0);

export const annee = z.number().int();

export const annee_construction = z.number().int().nullable().default(null);

export const annee_renovation = z.number().int().nullable().default(null);

export const annee_installation = z.number().int().nullable().default(null);

export const description = z.string();

export const surface = nombre_positif;

export const hauteur = nombre_positif;

export const inclinaison = z.number().int().min(0).max(90);

export const non_applicable = z.null().default(null);

export const Adresse = z.object({
	ban_id: z.string().nullable(),
	nom: z.string(),
	code_postal: z.string().regex(/^\d{5}$/),
	code_insee: z.string().regex(/^\d[A-Z0-9]\d{3}$/),
	commune: z.string(),
});

export type Adresse = z.infer<typeof Adresse>;

export type ParMois<T> = {
	[K in Mois]: T;
};

export type ParUsage<T> = {
	[K in Usage]?: T;
};

export type ParEnergie<T> = {
	[K in Energie]?: T;
};

export function ParMois<T extends z.ZodType>(valeur: T) {
	return z.record(Mois, valeur);
}

export function ParUsage<T extends z.ZodType>(valeur: T) {
	return z.partialRecord(Usage, valeur);
}

export function ParEnergie<T extends z.ZodType>(valeur: T) {
	return z.partialRecord(Energie, valeur);
}

export const Consommation = z.object({
	cef: nombre,
	cep: nombre,
	eges: nombre,
});

export const ConsommationParEnergie = ParEnergie(Consommation);
export const ConsommationParUsage = ParUsage(Consommation);
export const Consommations = ParUsage(ConsommationParEnergie);

export type Consommation = z.infer<typeof Consommation>;
export type ConsommationParEnergie = z.infer<typeof ConsommationParEnergie>;
export type ConsommationParUsage = z.infer<typeof ConsommationParUsage>;
export type Consommations = z.infer<typeof Consommations>;
