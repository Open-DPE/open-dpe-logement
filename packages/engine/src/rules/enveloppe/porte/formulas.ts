import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
export * from "#rules/enveloppe/paroi/formulas.js";
import { ValeurForfaitaireError } from "#utils/errors.js";

/**
 * @formule enveloppe.porte.isolation_aiu
 * @return État d'isolation de la porte donnant sur un local non chauffé
 */
export function calcule_isolation_aiu(): boolean {
	return false;
}

/**
 * @formule enveloppe.porte.u
 * @param props.u_saisi : Coefficient de transmission thermique saisi
 * @param props.taux_vitrage : Taux de vitrage de la porte
 * @param props.presence_sas : Indique la présence d'un sas derrière la porte
 * @see abaques.enveloppe.porte.uporte
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de transmission thermique de la porte en W/m².K
 */
export function calcule_u(props: {
	u_saisi: number | null;
	taux_vitrage: number;
	type_vitrage: ReturnType<typeof set_type_vitrage>;
	isolation: ReturnType<typeof set_isolation>;
	materiau: ReturnType<typeof set_materiau>;
	presence_sas: boolean;
}): number {
	if (props.u_saisi) return props.u_saisi;
	const abaque = abaques.enveloppe.porte.uporte;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.u;
}

/**
 * @param props.surface : Surface de la porte en m²
 * @param props.surface_vitrage : Surface de vitrage de la porte en m²
 * @returns Taux de vitrage de la porte
 */
export function set_taux_vitrage(props: {
	surface: number;
	surface_vitrage: number;
}): number {
	return props.surface > 0 ? props.surface_vitrage / props.surface : 0;
}

/**
 * @param props.isolation : État d'isolation de la porte saisi
 * @returns État d'isolation de la porte retenu
 */
export function set_isolation(props: { isolation: boolean | null }): boolean {
	return props.isolation ? true : false;
}

/**
 * @param props.materiau : Matériau de la porte saisi
 * @returns Matériau de la porte retenu
 */
export function set_materiau(props: {
	materiau: models.enveloppe.porte.Materiau | null;
}): models.enveloppe.porte.Materiau {
	return props.materiau ?? models.enveloppe.porte.MateriauEnum.pvc;
}

/**
 * @param props.type_vitrage : Type de vitrage de la porte saisi
 * @returns Type de vitrage de la porte retenu
 */
export function set_type_vitrage(props: {
	type_vitrage: models.enveloppe.porte.TypeVitrage | null;
}): models.enveloppe.porte.TypeVitrage {
	return (
		props.type_vitrage ?? models.enveloppe.porte.TypeVitrageEnum.simple_vitrage
	);
}
