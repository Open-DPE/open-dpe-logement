import * as models from "@open-dpe-logement/models";
import type * as generateur from "#rules/chauffage/generateur/formulas.js";

const TypeGenerateurEnum = models.chauffage.generateur.TypeGenerateurEnum;

type Generateur = {
	type_generateur: ReturnType<typeof generateur.set_type_generateur>;
	energie_generateur: ReturnType<typeof generateur.set_energie_generateur>;
};

export function is_chaudiere_gaz(props: Generateur): boolean {
	return (
		props.type_generateur === TypeGenerateurEnum.chaudiere &&
		models.common.isEnergieGaz(props.energie_generateur)
	);
}

export function is_chaudiere_bois(props: Generateur): boolean {
	return (
		props.type_generateur === TypeGenerateurEnum.chaudiere &&
		models.common.isEnergieBois(props.energie_generateur)
	);
}

export function is_chaudiere_fioul(props: Generateur): boolean {
	return (
		props.type_generateur === TypeGenerateurEnum.chaudiere &&
		props.energie_generateur === models.common.EnergieEnum.fioul
	);
}

export function is_chaudiere_charbon(props: Generateur): boolean {
	return (
		props.type_generateur === TypeGenerateurEnum.chaudiere &&
		props.energie_generateur === models.common.EnergieEnum.charbon
	);
}

export function is_poele_bouilleur(props: Generateur): boolean {
	return props.type_generateur === TypeGenerateurEnum.poele_bouilleur;
}

export function is_radiateur_gaz(props: Generateur): boolean {
	return props.type_generateur === TypeGenerateurEnum.radiateur_gaz;
}

export function is_generateur_air_chaud_combustion(props: Generateur): boolean {
	return props.type_generateur === TypeGenerateurEnum.generateur_air_chaud;
}

export function is_pac_hybride(props: Generateur): boolean {
	return (
		props.type_generateur === TypeGenerateurEnum.pac_air_eau ||
		props.type_generateur === TypeGenerateurEnum.pac_eau_eau ||
		props.type_generateur === TypeGenerateurEnum.pac_eau_glycolee_eau ||
		props.type_generateur === TypeGenerateurEnum.pac_geothermique
	);
}
