import * as models from "@open-dpe-logement/models";
import type * as generateur from "../../generateur/formulas.js";

const TypeGenerateur = models.chauffage.generateur.TypeGenerateur;

type Generateur = {
	type_generateur: ReturnType<typeof generateur.set_type_generateur>;
	energie_generateur: ReturnType<typeof generateur.set_energie_generateur>;
	bienergie_generateur: models.chauffage.generateur.Bienergie | null;
};

export function is_chaudiere_gaz(props: Generateur): boolean {
	return (
		props.type_generateur === TypeGenerateur.enum.chaudiere &&
		models.common.isGaz(props.energie_generateur)
	);
}

export function is_chaudiere_bois(props: Generateur): boolean {
	return (
		props.type_generateur === TypeGenerateur.enum.chaudiere &&
		models.common.isBois(props.energie_generateur)
	);
}

export function is_chaudiere_fioul(props: Generateur): boolean {
	return (
		props.type_generateur === TypeGenerateur.enum.chaudiere &&
		props.energie_generateur === models.common.Energie.enum.fioul
	);
}

export function is_chaudiere_charbon(props: Generateur): boolean {
	return (
		props.type_generateur === TypeGenerateur.enum.chaudiere &&
		props.energie_generateur === models.common.Energie.enum.charbon
	);
}

export function is_poele_bouilleur(props: Generateur): boolean {
	return props.type_generateur === TypeGenerateur.enum.poele_bouilleur;
}

export function is_radiateur_gaz(props: Generateur): boolean {
	return props.type_generateur === TypeGenerateur.enum.radiateur_gaz;
}

export function is_generateur_air_chaud_combustion(props: Generateur): boolean {
	return props.type_generateur === TypeGenerateur.enum.generateur_air_chaud;
}

export function is_pac_hybride(props: Generateur): boolean {
	return (
		(props.type_generateur === TypeGenerateur.enum.pac_air_eau ||
			props.type_generateur === TypeGenerateur.enum.pac_eau_eau ||
			props.type_generateur === TypeGenerateur.enum.pac_eau_glycolee_eau ||
			props.type_generateur === TypeGenerateur.enum.pac_geothermique) &&
		null !== props.bienergie_generateur
	);
}
