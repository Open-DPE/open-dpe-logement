import * as z from "zod";
import { Generateur, GenerateurWithData } from "./generateur/types.js";
import { Installation, InstallationWithData } from "./installation/types.js";

export const RefroidissementVide = z.object({
	generateurs: z.array(Generateur).max(0),
	installations: z.array(Installation).max(0),
});

export const RefroidissementNonVide = z.object({
	generateurs: z.array(Generateur).min(1),
	installations: z.array(Installation).min(1),
});

export const Refroidissement = z.union([
	RefroidissementVide,
	RefroidissementNonVide,
]);

export const RefroidissementData = z.object({
	bfr: z.number().min(0),
	as: z.number().min(0),
	ai: z.number().min(0),
});

export const RefroidissementWithData = z.intersection(
	Refroidissement,
	z.object({
		data: RefroidissementData,
		generateurs: z.array(GenerateurWithData),
		installations: z.array(InstallationWithData),
	}),
);

export type Refroidissement = z.infer<typeof Refroidissement>;
export type RefroidissementWithData = z.infer<typeof RefroidissementWithData>;
export type RefroidissementData = z.infer<typeof RefroidissementData>;
export type RefroidissementVide = z.infer<typeof RefroidissementVide>;
export type RefroidissementNonVide = z.infer<typeof RefroidissementNonVide>;
