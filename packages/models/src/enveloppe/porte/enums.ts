import * as z from "zod";

export const MATERIAUX = {
	pvc: "pvc",
	bois: "bois",
	metal: "metal",
} as const;
export const MateriauEnum = z.enum(MATERIAUX);
export type MateriauEnum = z.infer<typeof MateriauEnum>;

export const TYPES_VITRAGE = {
	simple_vitrage: "simple_vitrage",
	double_vitrage: "double_vitrage",
	triple_vitrage: "triple_vitrage",
} as const;
export const TypeVitrageEnum = z.enum(TYPES_VITRAGE);
export type TypeVitrageEnum = z.infer<typeof TypeVitrageEnum>;
