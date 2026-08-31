import { enveloppe } from "@open-dpe-logement/models";
import { createId } from "../common.js";
import type { Input } from "./types.js";
import { MappingError } from "../errors.js";

export function mapNiveau(props: Input): enveloppe.niveau.Niveau {
	return {
		id: createId(),
		description: "Niveau principal",
		surface: mapSurface(props),
		inertie_paroi_verticale: mapInertieParoiVerticale(props),
		inertie_plancher_bas: mapInertiePlancherBas(props),
		inertie_plancher_haut: mapInertiePlancherHaut(props),
	};
}

export function mapSurface(props: Input): enveloppe.niveau.Niveau["surface"] {
	const value =
		props.logement.caracteristique_generale.surface_habitable_immeuble ||
		props.logement.caracteristique_generale.surface_habitable_logement;

	if (!value) throw new MappingError("niveau.surface", props);

	return value;
}

export function mapInertieParoiVerticale(
	props: Input,
): enveloppe.niveau.Niveau["inertie_paroi_verticale"] {
	return props.logement.enveloppe.inertie.inertie_paroi_verticale_lourd
		? enveloppe.common.InertieParoi.enum.lourde
		: enveloppe.common.InertieParoi.enum.legere;
}

export function mapInertiePlancherHaut(
	props: Input,
): enveloppe.niveau.Niveau["inertie_plancher_haut"] {
	return props.logement.enveloppe.inertie.inertie_plancher_haut_lourd
		? enveloppe.common.InertieParoi.enum.lourde
		: enveloppe.common.InertieParoi.enum.legere;
}

export function mapInertiePlancherBas(
	props: Input,
): enveloppe.niveau.Niveau["inertie_plancher_bas"] {
	return props.logement.enveloppe.inertie.inertie_plancher_bas_lourd
		? enveloppe.common.InertieParoi.enum.lourde
		: enveloppe.common.InertieParoi.enum.legere;
}
