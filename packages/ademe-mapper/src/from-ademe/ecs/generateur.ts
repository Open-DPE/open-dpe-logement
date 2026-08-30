import { ecs, common } from "@open-dpe-logement/models";
import type { Input, GenerateurEcs, InstallationEcs } from "./types.js";
import { findReference, resolveId } from "../common.js";
import { MappingError } from "../errors.js";

type Props = {
	input: Input;
	installation: InstallationEcs;
	generateur: GenerateurEcs;
};

export function mapGenerateur(props: Props): ecs.generateur.Generateur {
	const value: ecs.generateur.GenerateurBase = {
		id: mapID(props.generateur),
		description: mapDescription(props.generateur),
		type: mapType(props.generateur),
		energie: mapEnergie(props.generateur),
		bienergie: mapBienergie(props.generateur),
		annee_installation: mapAnneeInstallation(props),
		position: position.mapPosition(props),
		stockage: stockage.mapStockage(props),
		signaletique: signaletique.mapSignaletique(props.generateur),
	};

	if (ecs.generateur.isGenerateurCombustion(value)) {
		value.bienergie = null;
		value.position.reseau_chaleur_id = null;
		value.signaletique.cop = null;
		value.signaletique.label = null;
	}
	if (ecs.generateur.isChaudiereCombustion(value)) {
		value.position.position_chauffe_eau = null;
	}
	if (ecs.generateur.isPoeleBoisBouilleur(value)) {
		value.position.position_chauffe_eau = null;
		value.position.generateur_collectif = false;
		value.position.generateur_multi_batiment = false;
	}
	if (ecs.generateur.isChauffeEauGaz(value)) {
		value.position.generateur_mixte_id = null;
		value.position.generateur_collectif = false;
		value.position.generateur_multi_batiment = false;
	}

	if (ecs.generateur.isGenerateurElectrique(value)) {
		value.bienergie = null;
		value.position.reseau_chaleur_id = null;
		value.signaletique.cop = null;
		value.signaletique.mode_combustion = null;
		value.signaletique.presence_ventouse = null;
		value.signaletique.pveilleuse = null;
		value.signaletique.qp0 = null;
		value.signaletique.rpn = null;
	}
	if (ecs.generateur.isChaudiereElectrique(value)) {
		value.position.position_chauffe_eau = null;
		value.signaletique.label = null;
	}
	if (ecs.generateur.isChauffeEauElectrique(value)) {
		value.position.generateur_collectif = false;
		value.position.generateur_multi_batiment = false;
		value.position.generateur_mixte_id = null;
	}

	if (ecs.generateur.isGenerateurThermodynamique(value)) {
		value.position.position_chauffe_eau = null;
		value.position.reseau_chaleur_id = null;
		value.signaletique.label = null;
	}
	if (ecs.generateur.isChauffeEauThermodynamique(value)) {
		value.position.generateur_multi_batiment = false;
		value.position.generateur_mixte_id = null;
		value.signaletique.mode_combustion = null;
		value.signaletique.presence_ventouse = null;
		value.signaletique.pveilleuse = null;
		value.signaletique.qp0 = null;
		value.signaletique.rpn = null;
	}
	if (ecs.generateur.isPacDoubleService(value)) {
		value.signaletique.mode_combustion = null;
		value.signaletique.presence_ventouse = null;
		value.signaletique.pveilleuse = null;
		value.signaletique.qp0 = null;
		value.signaletique.rpn = null;
	}

	if (ecs.generateur.isReseauChaleur(value)) {
		value.position.generateur_multi_batiment = true;
		value.position.generateur_collectif = true;
		value.position.position_volume_chauffe = false;
		value.position.generateur_mixte_id = null;
		value.position.position_chauffe_eau = null;
		value.signaletique.pn = null;
		value.signaletique.cop = null;
		value.signaletique.label = null;
		value.signaletique.mode_combustion = null;
		value.signaletique.presence_ventouse = null;
		value.signaletique.pveilleuse = null;
		value.signaletique.qp0 = null;
		value.signaletique.rpn = null;
	}

	if (ecs.generateur.isGenerateurCollectifInconnu(value)) {
		value.position.generateur_multi_batiment = true;
		value.position.generateur_collectif = true;
		value.position.position_volume_chauffe = false;
		value.position.generateur_mixte_id = null;
		value.position.reseau_chaleur_id = null;
		value.position.position_chauffe_eau = null;
		value.signaletique.pn = null;
		value.signaletique.cop = null;
		value.signaletique.label = null;
		value.signaletique.mode_combustion = null;
		value.signaletique.presence_ventouse = null;
		value.signaletique.pveilleuse = null;
		value.signaletique.qp0 = null;
		value.signaletique.rpn = null;
	}

	if (false === ecs.generateur.isGenerateur(value))
		throw new MappingError("generateur", props.generateur);

	return value;
}

export function mapID(props: GenerateurEcs): ecs.generateur.Generateur["id"] {
	return resolveId(props.donnee_entree.reference);
}

export function mapDescription(
	props: GenerateurEcs,
): ecs.generateur.Generateur["description"] {
	return props.donnee_entree.description ?? "Non renseigné";
}

export function mapType(
	props: GenerateurEcs,
): ecs.generateur.Generateur["type"] {
	switch (props.donnee_entree.enum_type_generateur_ecs_id) {
		case "1":
		case "2":
		case "3":
			return ecs.generateur.TYPES_GENERATEUR.cet_air_ambiant;
		case "4":
		case "5":
		case "6":
			return ecs.generateur.TYPES_GENERATEUR.cet_air_exterieur;
		case "7":
		case "8":
		case "9":
			return ecs.generateur.TYPES_GENERATEUR.cet_air_extrait;
		case "10":
		case "11":
		case "12":
			return ecs.generateur.TYPES_GENERATEUR.pac_air_eau;
		case "13":
		case "14":
			return ecs.generateur.TYPES_GENERATEUR.poele_bouilleur;
		case "15":
		case "16":
		case "17":
		case "18":
		case "19":
		case "20":
		case "21":
		case "22":
		case "23":
		case "24":
		case "25":
		case "26":
		case "27":
		case "28":
		case "29":
		case "30":
		case "31":
		case "32":
		case "33":
		case "34":
		case "35":
		case "36":
		case "37":
		case "38":
		case "39":
		case "40":
		case "41":
		case "42":
		case "43":
		case "44":
		case "45":
		case "46":
		case "47":
		case "48":
		case "49":
		case "50":
		case "51":
		case "52":
		case "53":
		case "54":
		case "55":
		case "56":
		case "57":
			return ecs.generateur.TYPES_GENERATEUR.chaudiere;
		case "58":
		case "59":
		case "60":
		case "61":
		case "62":
		case "63":
		case "64":
		case "65":
		case "66":
		case "67":
		case "68":
		case "69":
		case "70":
		case "71":
			return ecs.generateur.TYPES_GENERATEUR.chauffe_eau;
		case "72":
		case "73":
			return ecs.generateur.TYPES_GENERATEUR.reseau_chaleur;
		case "74":
		case "75":
		case "76":
			return ecs.generateur.TYPES_GENERATEUR.chaudiere;
		case "77":
			return ecs.generateur.TYPES_GENERATEUR.pac_air_eau;
		case "78":
		case "79":
		case "80":
		case "81":
		case "82":
		case "83":
			throw new MappingError("type", props);
		case "84":
			return null;
		case "85":
		case "86":
		case "87":
		case "88":
		case "89":
		case "90":
		case "91":
		case "92":
		case "93":
		case "94":
		case "95":
		case "96":
		case "97":
		case "98":
		case "99":
		case "100":
		case "101":
		case "102":
		case "103":
		case "104":
			return ecs.generateur.TYPES_GENERATEUR.chaudiere;
		case "105":
		case "106":
		case "107":
		case "108":
		case "109":
		case "110":
		case "111":
		case "112":
		case "113":
		case "114":
			return ecs.generateur.TYPES_GENERATEUR.chauffe_eau;
		case "115":
		case "116":
			return ecs.generateur.TYPES_GENERATEUR.poele_bouilleur;
		case "117":
			return ecs.generateur.TYPES_GENERATEUR.chauffe_eau;
		case "118":
			return ecs.generateur.TYPES_GENERATEUR.chaudiere;
		case "119":
			return ecs.generateur.TYPES_GENERATEUR.reseau_chaleur;
		case "120":
		case "121":
		case "122":
		case "123":
		case "124":
		case "125":
		case "126":
		case "127":
		case "128":
		case "129":
		case "130":
		case "131":
		case "132":
		case "133":
			return ecs.generateur.TYPES_GENERATEUR.pac_air_eau;
		case "134":
			return ecs.generateur.TYPES_GENERATEUR.chaudiere;
	}
}

export function mapEnergie(props: GenerateurEcs): ecs.generateur.EnergieEcsEnum {
	const Enum = common.ENERGIES;
	// Cas des générateurs hybrides
	switch (props.donnee_entree.enum_type_generateur_ecs_id) {
		case "120":
		case "121":
		case "122":
		case "123":
		case "124":
		case "125":
		case "126":
		case "127":
		case "128":
		case "129":
		case "130":
		case "131":
		case "132":
		case "133":
			return Enum.electricite;
	}
	// Autres cas
	switch (props.donnee_entree.enum_type_energie_id) {
		case "1":
		case "12":
			return Enum.electricite;
		case "2":
			return Enum.gaz_naturel;
		case "3":
			return Enum.fioul;
		case "4":
			return Enum.bois_buche;
		case "5":
			return Enum.bois_granule;
		case "6":
		case "7":
			return Enum.bois_plaquette;
		case "8":
		case "15":
			return Enum.reseau_chaleur;
		case "9":
		case "10":
		case "13":
			return Enum.gpl;
		case "11":
		case "14":
			return Enum.charbon;
	}
}

export function mapBienergie(
	props: GenerateurEcs,
): ecs.generateur.Generateur["bienergie"] {
	switch (props.donnee_entree.enum_type_generateur_ecs_id) {
		case "120":
		case "121":
			return common.ENERGIES.gaz_naturel;
		case "122":
		case "123":
			return common.ENERGIES.fioul;
		case "124":
		case "125":
			return common.ENERGIES.bois_granule;
		case "126":
		case "127":
			return common.ENERGIES.bois_buche;
		case "128":
		case "129":
		case "130":
		case "131":
			return common.ENERGIES.bois_plaquette;
		case "132":
		case "133":
			return common.ENERGIES.gpl;
		default:
			return null;
	}
}

export function mapAnneeInstallation(
	props: Props,
): ecs.generateur.Generateur["annee_installation"] {
	switch (props.generateur.donnee_entree.enum_type_generateur_ecs_id) {
		case "35":
			return 1969;
		case "36":
			return 1975;
		case "15":
		case "22":
		case "29":
		case "85":
			return 1977;
		case "63":
		case "110":
			return 1979;
		case "37":
		case "45":
		case "92":
		case "46":
		case "54":
		case "93":
		case "101":
			return 1980;
		case "58":
		case "64":
		case "105":
		case "111":
			return 1989;
		case "38":
		case "47":
		case "94":
			return 1990;
		case "16":
		case "23":
		case "30":
		case "86":
			return 1994;
		case "48":
		case "51":
		case "55":
		case "59":
		case "61":
		case "65":
		case "95":
		case "98":
		case "102":
		case "106":
		case "108":
		case "112":
			return 2000;
		case "17":
		case "24":
		case "31":
		case "87":
			return 2003;
		case "1":
		case "4":
		case "7":
		case "10":
			return 2009;
		case "13":
		case "115":
			return 2011;
		case "18":
		case "25":
		case "32":
		case "88":
			return 2012;
		case "2":
		case "5":
		case "8":
		case "11":
			return 2014;
		case "39":
		case "41":
		case "43":
		case "49":
		case "52":
		case "56":
		case "66":
		case "96":
		case "99":
		case "103":
		case "113":
			return 2015;
		case "19":
		case "26":
		case "89":
			return 2017;
		case "20":
		case "27":
		case "33":
		case "90":
			return 2019;
		default:
			return null;
	}
}

export namespace stockage {
	export function mapStockage(props: Props): ecs.generateur.Stockage {
		const volume = mapVolume(props.generateur);
		return volume === 0
			? { volume: 0, type: null, position_volume_chauffe: null }
			: {
					volume,
					type:
						mapType(props.generateur) ??
						ecs.generateur.TYPES_STOCKAGE.integre,
					position_volume_chauffe: mapPositionVolumeChauffe(props) ?? false,
				};
	}

	export function mapVolume(
		props: GenerateurEcs,
	): ecs.generateur.Stockage["volume"] {
		return props.donnee_entree.volume_stockage ?? null;
	}

	export function mapType(
		props: GenerateurEcs,
	): ecs.generateur.Stockage["type"] {
		switch (props.donnee_entree.enum_type_stockage_ecs_id) {
			case "1":
				return null;
			case "2":
				return ecs.generateur.TYPES_STOCKAGE.independant;
			case "3":
				return ecs.generateur.TYPES_STOCKAGE.integre;
			default:
				return ecs.generateur.TYPES_STOCKAGE.integre;
		}
	}

	export function mapPositionVolumeChauffe(
		props: Props,
	): ecs.generateur.Stockage["position_volume_chauffe"] {
		const type = mapType(props.generateur);

		switch (type) {
			case ecs.generateur.TYPES_STOCKAGE.integre:
				return position.mapPositionVolumeChauffe(props);
			default:
				return (
					props.generateur.donnee_entree.position_volume_chauffe_stockage ??
					null
				);
		}
	}
}

export namespace position {
	export function mapPosition(props: Props): ecs.generateur.Position {
		return {
			generateur_collectif: mapGenerateurCollectif(props),
			generateur_multi_batiment: mapGenerateurMultiBatiment(props.generateur),
			position_volume_chauffe: mapPositionVolumeChauffe(props),
			position_chauffe_eau: mapPositionChauffeEau(props.generateur),
			reseau_chaleur_id: mapReseauChaleurID(props.generateur),
			generateur_mixte_id: mapGenerateurMixteID(props),
		};
	}

	export function mapReseauChaleurID(
		props: GenerateurEcs,
	): ecs.generateur.Position["reseau_chaleur_id"] {
		return props.donnee_entree.identifiant_reseau_chaleur ?? null;
	}

	/**
	 * Miroir de `chauffage/generateur.ts::mapGenerateurMixteID` — voir sa
	 * documentation : deux conventions ADEME coexistent (clé de pairage
	 * partagée, ou référence croisée directe vers la `reference` propre de
	 * l'homologue), essayées dans cet ordre avant de lever `MappingError`.
	 */
	export function mapGenerateurMixteID(
		props: Props,
	): ecs.generateur.Position["generateur_mixte_id"] {
		const ref = props.generateur.donnee_entree.reference_generateur_mixte;
		if (!ref) return null;

		const generateurs =
			props.input.logement.installation_chauffage_collection.flatMap(
				(inst) => inst.generateur_chauffage_collection,
			);

		const mixteReferences = generateurs
			.map((gen) => gen.donnee_entree.reference_generateur_mixte)
			.filter((reference) => reference !== null && reference !== undefined);
		const matchedMixteRef = findReference(ref, mixteReferences);
		if (matchedMixteRef) {
			const match = generateurs.find(
				(gen) =>
					gen.donnee_entree.reference_generateur_mixte === matchedMixteRef,
			);
			if (match) return resolveId(match.donnee_entree.reference);
		}

		const ownReferences = generateurs.map((gen) => gen.donnee_entree.reference);
		const matchedOwnRef = findReference(ref, ownReferences);
		if (matchedOwnRef) {
			const match = generateurs.find(
				(gen) => gen.donnee_entree.reference === matchedOwnRef,
			);
			if (match) return resolveId(match.donnee_entree.reference);
		}

		throw new MappingError("generateur_mixte_id", props.generateur);
	}

	export function mapGenerateurMultiBatiment(
		props: GenerateurEcs,
	): ecs.generateur.Position["generateur_multi_batiment"] {
		switch (props.donnee_entree.enum_type_generateur_ecs_id) {
			case "74":
			case "75":
			case "76":
			case "77":
			case "134":
				return true;
			default:
				return false;
		}
	}

	export function mapGenerateurCollectif(
		props: Props,
	): ecs.generateur.Position["generateur_collectif"] {
		if (mapGenerateurMultiBatiment(props.generateur)) return true;

		switch (props.installation.donnee_entree.enum_type_installation_id) {
			case "2":
			case "3":
			case "4":
				return true;
			default:
				return false;
		}
	}

	export function mapPositionVolumeChauffe(
		props: Props,
	): ecs.generateur.Position["position_volume_chauffe"] {
		return props.generateur.donnee_entree.position_volume_chauffe ?? false;
	}

	export function mapPositionChauffeEau(
		props: GenerateurEcs,
	): ecs.generateur.Position["position_chauffe_eau"] {
		switch (props.donnee_entree.enum_type_generateur_ecs_id) {
			case "68":
				return ecs.generateur.POSITIONS_CHAUFFE_EAU.chauffe_eau_horizontal;
			case "69":
			case "70":
			case "71":
			case "117":
				return ecs.generateur.POSITIONS_CHAUFFE_EAU.chauffe_eau_vertical;
			default:
				return null;
		}
	}
}

export namespace signaletique {
	export function mapSignaletique(
		props: GenerateurEcs,
	): ecs.generateur.Signaletique {
		return {
			pn: mapPn(props),
			label: mapLabel(props),
			mode_combustion: mapModeCombustion(props),
			presence_ventouse: mapPresenceVentouse(props),
			pveilleuse: mapPveilleuse(props),
			qp0: mapQP0(props),
			rpn: mapRpn(props),
			cop: mapCOP(props),
		};
	}

	export function mapPn(
		props: GenerateurEcs,
	): ecs.generateur.Signaletique["pn"] {
		switch (props.donnee_entree.enum_methode_saisie_carac_sys_id) {
			case "2":
			case "3":
			case "4":
			case "5":
				return props.donnee_intermediaire.pn
					? props.donnee_intermediaire.pn / 1000
					: null;
			default:
				return null;
		}
	}

	export function mapLabel(
		props: GenerateurEcs,
	): ecs.generateur.Signaletique["label"] {
		switch (props.donnee_entree.enum_type_generateur_ecs_id) {
			case "70":
				return ecs.generateur.LABELS.ne_performance_b;
			case "71":
				return ecs.generateur.LABELS.ne_performance_c;
			default:
				return null;
		}
	}

	export function mapModeCombustion(
		props: GenerateurEcs,
	): ecs.generateur.Signaletique["mode_combustion"] {
		switch (props.donnee_entree.enum_type_generateur_ecs_id) {
			case "15":
			case "16":
			case "17":
			case "18":
			case "19":
			case "20":
			case "21":
			case "22":
			case "23":
			case "24":
			case "25":
			case "26":
			case "27":
			case "28":
			case "29":
			case "30":
			case "31":
			case "32":
			case "33":
			case "34":
			case "35":
			case "36":
			case "37":
			case "38":
			case "39":
			case "40":
			case "45":
			case "46":
			case "47":
			case "48":
			case "49":
			case "50":
			case "58":
			case "59":
			case "60":
			case "63":
			case "64":
			case "65":
			case "66":
			case "67":
			case "85":
			case "86":
			case "87":
			case "88":
			case "89":
			case "90":
			case "91":
			case "92":
			case "93":
			case "94":
			case "95":
			case "96":
			case "97":
			case "105":
			case "106":
			case "107":
			case "110":
			case "111":
			case "112":
			case "113":
			case "114":
			case "115":
			case "116":
			case "124":
			case "125":
			case "126":
			case "127":
			case "128":
			case "129":
			case "130":
			case "131":
				return ecs.generateur.MODES_COMBUSTION.standard;
			case "41":
			case "42":
			case "51":
			case "52":
			case "53":
			case "98":
			case "99":
			case "100":
				return ecs.generateur.MODES_COMBUSTION.basse_temperature;
			case "43":
			case "44":
			case "54":
			case "55":
			case "56":
			case "57":
			case "61":
			case "62":
			case "101":
			case "102":
			case "103":
			case "104":
			case "108":
			case "109":
			case "120":
			case "121":
			case "122":
			case "123":
			case "132":
			case "133":
				return ecs.generateur.MODES_COMBUSTION.condensation;
			default:
				return null;
		}
	}

	export function mapPresenceVentouse(
		props: GenerateurEcs,
	): ecs.generateur.Signaletique["presence_ventouse"] {
		return props.donnee_entree.presence_ventouse ?? null;
	}

	export function mapQP0(
		props: GenerateurEcs,
	): ecs.generateur.Signaletique["qp0"] {
		switch (props.donnee_entree.enum_methode_saisie_carac_sys_id) {
			case "4":
			case "5":
				return props.donnee_intermediaire.qp0 ?? null;
			default:
				return null;
		}
	}

	/**
	 * @note Saisie à partir de la plaque signalétique ou d'une documentation technique non couverte par le modèle ADEME.
	 */
	export function mapPveilleuse(
		props: GenerateurEcs,
	): ecs.generateur.Signaletique["pveilleuse"] {
		return props.donnee_entree.enum_methode_saisie_carac_sys_id === "5"
			? props.donnee_intermediaire.pveilleuse || null
			: null;
	}

	export function mapRpn(
		props: GenerateurEcs,
	): ecs.generateur.Signaletique["rpn"] {
		switch (props.donnee_entree.enum_methode_saisie_carac_sys_id) {
			case "3":
			case "4":
			case "5":
				return props.donnee_intermediaire.rpn ?? null;
			default:
				return null;
		}
	}

	export function mapCOP(
		props: GenerateurEcs,
	): ecs.generateur.Signaletique["cop"] {
		return props.donnee_entree.enum_methode_saisie_carac_sys_id === "6"
			? (props.donnee_intermediaire.cop ?? null)
			: null;
	}
}
