import { refroidissement } from "@open-dpe-logement/models";
import type { Climatisation } from "./types.js";

export function mapGenerateur(
	props: Climatisation,
): refroidissement.generateur.Generateur {
	const value: refroidissement.generateur.GenerateurBase = {
		id: mapID(props),
		description: mapDescription(props),
		type: mapType(props),
		energie: mapEnergie(props),
		annee_installation: mapAnneeInstallation(props),
		seer: mapSeer(props),
		reseau_froid_id: null,
	};

	if (!refroidissement.generateur.isGenerateur(value)) {
		throw new Error(
			`Le générateur ne peut être mappé pour : ${JSON.stringify(props)}`,
		);
	}

	return value;
}

export function mapID(
	props: Climatisation,
): refroidissement.generateur.Generateur["id"] {
	return props.donnee_entree.reference;
}

export function mapDescription(
	props: Climatisation,
): refroidissement.generateur.Generateur["description"] {
	return props.donnee_entree.description ?? "Non renseigné";
}

export function mapType(
	props: Climatisation,
): refroidissement.generateur.TypeGenerateur {
	switch (props.donnee_entree.enum_type_generateur_fr_id) {
		case 1:
		case 2:
		case 3:
			return refroidissement.generateur.TypeGenerateurEnum.pac_air_air;

		case 4:
		case 5:
		case 6:
		case 7:
			return refroidissement.generateur.TypeGenerateurEnum.pac_air_eau;

		case 8:
		case 9:
		case 10:
		case 11:
			return refroidissement.generateur.TypeGenerateurEnum.pac_eau_eau;

		case 12:
		case 13:
		case 14:
		case 15:
			return refroidissement.generateur.TypeGenerateurEnum.pac_eau_glycolee_eau;

		case 16:
		case 17:
		case 18:
		case 19:
			return refroidissement.generateur.TypeGenerateurEnum.pac_geothermique;

		case 20:
		case 21:
			return refroidissement.generateur.TypeGenerateurEnum
				.autre_systeme_thermodynamique;

		case 22:
			return refroidissement.generateur.TypeGenerateurEnum.autre;

		case 23:
			return refroidissement.generateur.TypeGenerateurEnum.reseau_froid;

		default:
			throw new Error(
				`Le type de générateur ne peut être mappé pour : ${JSON.stringify(props)}`,
			);
	}
}

export function mapEnergie(
	props: Climatisation,
): refroidissement.generateur.EnergieRefroidissement {
	switch (props.donnee_entree.enum_type_energie_id) {
		case 1:
		case 12:
			return refroidissement.generateur.EnergieRefroidissementEnum.electricite;
		case 2:
			return refroidissement.generateur.EnergieRefroidissementEnum.gaz_naturel;
		case 9:
		case 10:
		case 13:
			return refroidissement.generateur.EnergieRefroidissementEnum.gpl;
		case 15:
			return refroidissement.generateur.EnergieRefroidissementEnum.reseau_froid;
	}

	switch (props.donnee_entree.enum_type_generateur_fr_id) {
		case 21:
			return refroidissement.generateur.EnergieRefroidissementEnum.gaz_naturel;
		case 23:
			return refroidissement.generateur.EnergieRefroidissementEnum.reseau_froid;
		default:
			return refroidissement.generateur.EnergieRefroidissementEnum.electricite;
	}
}

export function mapAnneeInstallation(props: Climatisation): number | null {
	switch (props.donnee_entree.enum_periode_installation_fr_id) {
		case 1:
			return 2007;
		case 2:
			return 2014;
		case 3:
			return 2016;
		default:
			return null;
	}
}

export function mapSeer(climatisation: Climatisation): number | null {
	const eer_saisi = [6, 8].includes(
		climatisation.donnee_entree.enum_methode_saisie_carac_sys_id,
	)
		? climatisation.donnee_intermediaire.eer
		: null;

	return eer_saisi ? eer_saisi / 0.95 : null;
}
