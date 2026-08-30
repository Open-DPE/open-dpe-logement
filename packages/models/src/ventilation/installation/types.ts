import * as z from "zod";
import {
	id,
	description,
	surface,
	annee_installation,
	non_applicable,
	Consommations,
} from "../../common/index.js";
import {
	TYPES_VENTILATION,
	TypeVentilationEnum,
	TypeVentilationNaturelleEnum,
	TypeVentilationMecaniqueEnum,
} from "./enums.js";

export const InstallationBase = z.object({
	id,
	description,
	surface,
	type: TypeVentilationEnum,
	annee_installation,
	installation_collective: z.boolean().nullable().default(null),
	presence_echangeur_thermique: z.boolean().nullable().default(null),
});

export const InstallationNaturelle = InstallationBase.extend({
	type: TypeVentilationNaturelleEnum,
	annee_installation: non_applicable,
	installation_collective: non_applicable,
	presence_echangeur_thermique: non_applicable,
});

export const InstallationVMCDoubleFlux = InstallationBase.extend({
	type: TypeVentilationEnum.extract([TYPES_VENTILATION.vmc_double_flux]),
	installation_collective: z.boolean(),
});

export const InstallationPuitClimatique = InstallationBase.extend({
	type: TypeVentilationEnum.extract([TYPES_VENTILATION.puit_climatique]),
	installation_collective: z.boolean(),
});

export const InstallationMecaniqueAutres = InstallationBase.extend({
	type: TypeVentilationMecaniqueEnum.exclude([
		TYPES_VENTILATION.vmc_double_flux,
		TYPES_VENTILATION.puit_climatique,
	]),
	presence_echangeur_thermique: non_applicable,
});

export const InstallationData = z.object({
	rdim: z.number().min(0),
	pvent_moy: z.number().min(0),
	hvent: z.number().min(0),
	qvarep_conv: z.number().min(0),
	qvasouf_conv: z.number().min(0),
	smea_conv: z.number().min(0),
	consommations: Consommations,
});

export const InstallationMecanique = z.union([
	InstallationVMCDoubleFlux,
	InstallationPuitClimatique,
	InstallationMecaniqueAutres,
]);

export const Installation = z.union([
	InstallationNaturelle,
	InstallationMecanique,
]);

export const InstallationWithData = z.intersection(
	Installation,
	z.object({
		data: InstallationData,
	}),
);

export type Installation = z.infer<typeof Installation>;

export type InstallationBase = z.infer<typeof InstallationBase>;

export type InstallationNaturelle = z.infer<typeof InstallationNaturelle>;

export type InstallationMecanique = z.infer<typeof InstallationMecanique>;

export type InstallationVMCDoubleFlux = z.infer<
	typeof InstallationVMCDoubleFlux
>;

export type InstallationPuitClimatique = z.infer<
	typeof InstallationPuitClimatique
>;

export type InstallationMecaniqueAutres = z.infer<
	typeof InstallationMecaniqueAutres
>;

export type InstallationWithData = z.infer<typeof InstallationWithData>;

export type InstallationData = z.infer<typeof InstallationData>;
