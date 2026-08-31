import type * as models from "@open-dpe-logement/models";
import type { Adresse as AdresseBAN } from "../services/search-adresse";

export type Adresse = models.common.Adresse;

/**
 * Convertit une adresse géocodée (Base Adresse Nationale) en adresse de
 * diagnostic. Frontière entre le format du service de géocodage et le modèle
 * de données publiques.
 */
export function fromBAN(feature: AdresseBAN): Adresse {
	const { banId, name, postcode, citycode, city } = feature.properties;
	return {
		ban_id: banId ?? null,
		nom: name,
		code_postal: postcode,
		code_insee: citycode,
		commune: city,
	};
}

/**
 * Libellé affichable : `1 rue de l'Exemple, 84000 Avignon`.
 */
export function formatAdresse(adresse: Adresse): string {
	return `${adresse.nom}, ${adresse.code_postal} ${adresse.commune}`;
}
