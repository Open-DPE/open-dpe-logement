import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import type * as climat from "#rules/climat/formulas.js";
import { createParMois } from "#rules/helpers.js";
import { ValeurForfaitaireError } from "#rules/errors.js";

/**
 * @returns Production du panneau photovoltaïque en kWh/mois
 */
export function calcule_ppv(props: {
	spv: ReturnType<typeof set_spv>;
	kpv: ReturnType<typeof calcule_kpv>;
	epv: ReturnType<typeof climat.calcule_epv>;
}): models.common.ParMois<number> {
	const { spv, kpv } = props;
	return createParMois((mois) => kpv * spv * 0.17 * props.epv[mois] * 0.86);
}

/**
 * @param props.orientation_pv - Orientation du panneau photovoltaïque
 * @param props.inclinaison_pv - Inclinaison du panneau photovoltaïque en degrés
 * @see abaques.production.kpv
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de pondération prenant en compte l'altération par rapport à l'orientation optimale du panneau photovoltaïque
 */
export function calcule_kpv(props: {
	orientation_pv: models.common.Orientation;
	inclinaison_pv: number;
}): number {
	const abaque = abaques.production.kpv;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.kpv;
}

/**
 * @param props.surface - Surface du panneau photovoltaïque en m²
 * @param props.modules - Nombre de modules photovoltaïques
 * @returns Surface du panneau photovoltaïque en m²
 */
export function set_spv(props: {
	surface: number | null;
	modules: number;
}): number {
	const { surface, modules } = props;
	return surface ? surface * modules : 1.6 * modules;
}
