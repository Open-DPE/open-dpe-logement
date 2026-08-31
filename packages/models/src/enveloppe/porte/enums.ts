import * as z from "zod";

export const MateriauPorte = z.enum({
	pvc: "pvc",
	bois: "bois",
	metal: "metal",
});

export type MateriauPorte = z.infer<typeof MateriauPorte>;

export const TypeVitrage = z.enum({
	simple_vitrage: "simple_vitrage",
	double_vitrage: "double_vitrage",
	triple_vitrage: "triple_vitrage",
});

export type TypeVitrage = z.infer<typeof TypeVitrage>;
