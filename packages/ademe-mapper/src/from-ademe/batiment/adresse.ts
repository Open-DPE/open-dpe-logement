import { common } from "@open-dpe-logement/models";
import type { Adresse } from "./types.js";

export function mapAdresse(props: Adresse): common.Adresse {
	return {
		ban_id: mapBANId(props),
		nom: mapNom(props),
		code_postal: mapCodePostal(props),
		code_insee: mapCodeInsee(props),
		commune: mapCommune(props),
	};
}

export function mapBANId(props: Adresse): common.Adresse["ban_id"] {
	return props.ban_id ?? null;
}

export function mapNom(props: Adresse): common.Adresse["nom"] {
	return props.ban_label ?? props.adresse_brut;
}

export function mapCodePostal(props: Adresse): common.Adresse["code_postal"] {
	return props.ban_postcode ?? props.code_postal_brut;
}

export function mapCodeInsee(props: Adresse): common.Adresse["code_insee"] {
	if (!props.ban_citycode) return mapCodePostal(props);
	const matches = props.ban_citycode.match(/\d[A-Z0-9]\d{3}/);
	return matches ? matches[0] : mapCodePostal(props);
}

export function mapCommune(props: Adresse): common.Adresse["commune"] {
	return props.ban_city ?? props.nom_commune_brut;
}
