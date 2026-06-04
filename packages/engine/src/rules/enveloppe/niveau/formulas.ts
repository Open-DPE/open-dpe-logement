import * as models from "@open-dpe-logement/models";

/**
 * @returns État d'inertie du niveau
 */
export function calcule_inertie(props: {
	inertie_paroi_verticale: ReturnType<typeof set_inertie>;
	inertie_plancher_haut: ReturnType<typeof set_inertie>;
	inertie_plancher_bas: ReturnType<typeof set_inertie>;
}): models.enveloppe.common.Inertie {
	const values = Object.values(props);
	const count = values.filter(
		(value) => value === models.enveloppe.common.InertieParoiEnum.lourde,
	).length;
	if (count === 3) return models.enveloppe.common.InertieEnum.tres_lourde;
	if (count === 2) return models.enveloppe.common.InertieEnum.lourde;
	if (count === 1) return models.enveloppe.common.InertieEnum.moyenne;
	return models.enveloppe.common.InertieEnum.legere;
}

/**
 * @param props.inertie - État d'inertie saisi
 * @returns État d'inertie retenu
 */
export function set_inertie(props: {
	inertie: models.enveloppe.common.InertieParoi | null;
}): models.enveloppe.common.InertieParoi {
	return props.inertie ?? models.enveloppe.common.InertieParoiEnum.legere;
}
