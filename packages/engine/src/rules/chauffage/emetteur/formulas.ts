import { chauffage } from "@open-dpe-logement/models";

/**
 * @formule chauffage.emetteur.delta_pem
 * @returns Perte de charge de l'émetteur en kPa
 */
export function calcule_delta_pem(props: {
	type_emetteur: chauffage.emetteur.TypeEmetteurEnum;
}): number {
	const { type_emetteur } = props;
	switch (type_emetteur) {
		case chauffage.emetteur.TYPES_EMETTEUR.plancher_chauffant:
		case chauffage.emetteur.TYPES_EMETTEUR.plafond_chauffant:
			return 15;
		case chauffage.emetteur.TYPES_EMETTEUR.radiateur_monotube:
			return 30;
		case chauffage.emetteur.TYPES_EMETTEUR.radiateur_bitube:
		case chauffage.emetteur.TYPES_EMETTEUR.radiateur:
			return 10;
		case chauffage.emetteur.TYPES_EMETTEUR.autres:
			return 35;
	}
}

/**
 * @formule chauffage.emetteur.fcot
 * @returns Facteur de correction
 */
export function calcule_fcot(props: {
	type_emetteur: chauffage.emetteur.TypeEmetteurEnum;
}): number {
	const { type_emetteur } = props;
	switch (type_emetteur) {
		case chauffage.emetteur.TYPES_EMETTEUR.plancher_chauffant:
			return 0.156;
		default:
			return 0.802;
	}
}

/**
 * @formule chauffage.emetteur.dtheta_dim
 * @returns Chute nominale de température de dimensionnement en °C
 */
export function calcule_dtheta_dim(props: {
	temperature_distribution: ReturnType<typeof set_temperature_distribution>;
}): number {
	const { temperature_distribution } = props;
	switch (temperature_distribution) {
		case chauffage.emetteur.TEMPERATURES_DISTRIBUTION.haute:
			return 15;
		default:
			return 7.5;
	}
}

/**
 * @param props.temperature_distribution : Température de distribution de l'émetteur de chauffage saisie
 * @returns Température de distribution de l'émetteur de chauffage retenue
 */
export function set_temperature_distribution(props: {
	temperature_distribution: chauffage.emetteur.TemperatureDistributionEnum | null;
}): chauffage.emetteur.TemperatureDistributionEnum {
	const { temperature_distribution } = props;
	return (
		temperature_distribution ??
		chauffage.emetteur.TEMPERATURES_DISTRIBUTION.haute
	);
}

/**
 * @param props.annee_installation : Année d'installation de l'émetteur de chauffage saisie
 * @param props.annee_construction_batiment : Année de construction du bâtiment
 * @returns Année d'installation de l'émetteur de chauffage retenue
 */
export function set_annee_installation(props: {
	annee_installation: number | null;
	annee_construction_batiment: number;
}): number {
	const { annee_installation, annee_construction_batiment } = props;
	return annee_installation ?? annee_construction_batiment;
}
