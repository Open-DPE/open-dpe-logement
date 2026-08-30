import { batiment } from "@open-dpe-logement/models";
import { mapAnneeEtablissement } from "../common.js";
import { type Input } from "./types.js";
import * as adresse from "./adresse.js";
import * as appartement from "./appartement.js";
import { MappingError } from "../errors.js";

export { adresse, appartement };

/**
 * @TODO: vérifier value.logement
 */
export function mapBatiment(props: Input): batiment.Batiment {
	const value: batiment.BatimentBase = {
		type: mapType(props),
		annee_construction: mapAnneeConstruction(props),
		annee_renovation: null,
		altitude: mapAltitude(props),
		logements: mapLogements(props),
		surface_habitable: mapSurfaceHabitable(props),
		hauteur_sous_plafond: mapHauteurSousPlafond(props),
		materiaux_anciens: mapMateriauxAnciens(props),
		rnb_id: mapRNBId(props),
		adresse: adresse.mapAdresse(
			props.administratif.geolocalisation.adresses.adresse_bien,
		),
		appartements_visites: [],
		logement: null,
	};

	if (logement.supports(props)) {
		value.logement = logement.mapLogement(props);
	}
	if (batiment.isMaison(value)) {
		value.logements = 1;
	}
	if (batiment.isImmeuble(value)) {
		value.appartements_visites = mapAppartementsVisites(props);
	}

	if (!batiment.isBatiment(value)) throw new MappingError("batiment", props);

	return value;
}

export function mapType(props: Input): batiment.Batiment["type"] {
	switch (
		props.logement.caracteristique_generale.enum_methode_application_dpe_log_id
	) {
		case "1":
		case "14":
		case "18":
			return batiment.TYPES_BATIMENT.maison;
		default:
			return batiment.TYPES_BATIMENT.immeuble;
	}
}

export function mapAnneeConstruction(
	props: Input,
): batiment.Batiment["annee_construction"] {
	if (props.logement.caracteristique_generale.annee_construction) {
		return props.logement.caracteristique_generale.annee_construction;
	}
	switch (
		props.logement.caracteristique_generale.enum_periode_construction_id
	) {
		case "1":
			return 1947;
		case "2":
			return 1974;
		case "3":
			return 1977;
		case "4":
			return 1982;
		case "5":
			return 1988;
		case "6":
			return 2000;
		case "7":
			return 2005;
		case "8":
			return 2012;
		case "9":
			return 2021;
		case "10":
			return 2022;
	}
}

export function mapAltitude(props: Input): batiment.Batiment["altitude"] {
	if (
		"altitude" in props.logement.meteo &&
		props.logement.meteo.altitude != null
	) {
		return props.logement.meteo.altitude;
	}
	switch (props.logement.meteo.enum_classe_altitude_id) {
		case "1":
			return 0;
		case "2":
			return 200;
		case "3":
			return 400;
	}
}

export function mapLogements(props: Input): batiment.Batiment["logements"] {
	const type = mapType(props);
	switch (type) {
		case batiment.TYPES_BATIMENT.maison:
			return 1;
		case batiment.TYPES_BATIMENT.immeuble: {
			const nombre_appartement = props.logement.caracteristique_generale.nombre_appartement;
			if (nombre_appartement && nombre_appartement >= 3) return nombre_appartement;
			return 3
		}
	}
}

export function mapSurfaceHabitable(
	props: Input,
): batiment.Batiment["surface_habitable"] {
	const value =
		props.logement.caracteristique_generale.surface_habitable_immeuble ||
		props.logement.caracteristique_generale.surface_habitable_logement;

	if (!value) throw new MappingError("batiment.surface_habitable", props);

	return value;
}

export function mapHauteurSousPlafond(
	props: Input,
): batiment.Batiment["hauteur_sous_plafond"] {
	return props.logement.caracteristique_generale.hsp;
}

export function mapMateriauxAnciens(
	props: Input,
): batiment.Batiment["materiaux_anciens"] {
	return props.logement.meteo.batiment_materiaux_anciens;
}

export function mapRNBId(props: Input): batiment.Batiment["rnb_id"] {
	return "id_batiment_rnb" in props.administratif.geolocalisation
		? (props.administratif.geolocalisation.id_batiment_rnb ?? null)
		: null;
}

export function mapAppartementsVisites(
	props: Input,
): batiment.Batiment["appartements_visites"] {
	const logementVisiteCollection =
		props.dpe_immeuble?.logement_visite_collection ?? [];

	const supports = logementVisiteCollection.every((logementVisite) =>
		appartement.supports({ input: props, logement_visite: logementVisite }),
	);
	return supports
		? logementVisiteCollection.map((logementVisite) =>
				appartement.mapAppartement({
					input: props,
					logement_visite: logementVisite,
				}),
			)
		: [];
}

export namespace logement {
	export function mapLogement(props: Input): batiment.Logement {
		return {
			description: "Logement principal",
			surface_habitable: mapSurfaceHabitable(props),
			hauteur_sous_plafond: mapHauteurSousPlafond(props),
		}
	}

	export function supports(props: Input): boolean {
		switch (
				props.logement.caracteristique_generale.enum_methode_application_dpe_log_id
			) {
				case "1":
				case "6":
				case "7":
				case "8":
				case "9":
				case "14":
				case "17":
				case "18":
				case "21":
				case "26":
				case "27":
				case "28":
				case "29":
				case "30":
					return false
				default:
					return true;
			}
	}

	export function mapSurfaceHabitable(props: Input): number {
		const value =
			props.logement.caracteristique_generale.surface_habitable_logement ||
			props.logement.caracteristique_generale.surface_habitable_immeuble;

		if (!value) throw new MappingError("logement.surface_habitable", props);
		return value;
	}

	export function mapHauteurSousPlafond(props: Input): number {
		return props.logement.caracteristique_generale.hsp;
	}
}
