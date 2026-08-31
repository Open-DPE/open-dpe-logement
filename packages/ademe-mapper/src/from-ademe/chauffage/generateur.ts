import { chauffage, common } from "@open-dpe-logement/models";
import type {
	Input,
	GenerateurChauffage,
	InstallationChauffage,
} from "./types.js";
import {
	isPACHybridePartiePAC,
	isPACHybridePartieChaudiere,
} from "./common.js";
import { findReference, resolveId } from "../common.js";
import { MappingError } from "../errors.js";

type Props = {
	input: Input;
	generateur: GenerateurChauffage;
	installation: InstallationChauffage;
};

export function supports(props: GenerateurChauffage): boolean {
	// Exclusion des générateurs de type PAC hybride partie chaudière (fusion)
	if (isPACHybridePartieChaudiere(props)) return false;

	switch (props.donnee_entree.enum_type_generateur_ch_id) {
		// Hors méthode 3CL-DPE 2021
		case "113":
		case "114":
		case "115":
		case "116":
		case "117":
		case "118":
			return false;
		// Énumérations obsolètes
		case "143":
		case "144":
			return false;
		default:
			return true;
	}
}

export function mapGenerateur(
	props: Props,
): chauffage.generateur.Generateur | null {
	if (false === supports(props.generateur)) return null;

	const value: chauffage.generateur.GenerateurBase = {
		id: mapID(props.generateur),
		description: mapDescription(props.generateur),
		type: mapType(props.generateur),
		energie: mapEnergie(props.generateur),
		bienergie: mapBienergie(props),
		annee_installation: mapAnneeInstallation(props),
		position: position.mapPosition(props),
		signaletique: signaletique.mapSignaletique(props),
	};

	if (chauffage.generateur.isGenerateurCombustion(value)) {
		value.bienergie = null;
		value.position.reseau_chaleur_id = null;
		value.signaletique.scop = null;
	}
	if (
		chauffage.generateur.isChaudiereCombustion(value) ||
		chauffage.generateur.isPoeleBoisBouilleur(value)
	) {
		value.signaletique.label = null;
	}
	if (
		chauffage.generateur.isPoeleOuInsert(value) ||
		chauffage.generateur.isRadiateurGaz(value)
	) {
		value.position.cascade = null;
		value.position.position_chaudiere = null;
		value.position.generateur_collectif = false;
		value.position.generateur_multi_batiment = false;
		value.position.position_volume_chauffe = true;
		value.position.generateur_mixte_id = null;
	}
	if (chauffage.generateur.isGenerateurAirChaudCombustion(value)) {
		value.signaletique.label = null;
		value.signaletique.tfonc30 = null;
		value.signaletique.tfonc100 = null;
	}

	if (chauffage.generateur.isGenerateurElectrique(value)) {
		value.bienergie = null;
		value.position.cascade = null;
		value.position.reseau_chaleur_id = null;
		value.signaletique.scop = null;
		value.signaletique.mode_combustion = null;
		value.signaletique.presence_ventouse = null;
		value.signaletique.presence_regulation = null;
		value.signaletique.pveilleuse = null;
		value.signaletique.rpn = null;
		value.signaletique.rpint = null;
		value.signaletique.qp0 = null;
		value.signaletique.tfonc30 = null;
		value.signaletique.tfonc100 = null;
	}
	if (chauffage.generateur.isChaudiereElectrique(value)) {
		value.signaletique.label = null;
	}
	if (chauffage.generateur.isEmetteurElectrique(value)) {
		value.position.position_chaudiere = null;
		value.position.generateur_mixte_id = null;
		value.position.generateur_collectif = false;
		value.position.generateur_multi_batiment = false;
		value.position.position_volume_chauffe = true;
	}
	if (chauffage.generateur.isGenerateurThermodynamique(value)) {
		value.position.reseau_chaleur_id = null;
		value.signaletique.label = null;
	}
	if (chauffage.generateur.isGenerateurThermodynamique(value)) {
		value.bienergie = null;
		value.position.cascade = null;
		value.position.position_chaudiere = null;
		value.signaletique.mode_combustion = null;
		value.signaletique.presence_ventouse = null;
		value.signaletique.presence_regulation = null;
		value.signaletique.pveilleuse = null;
		value.signaletique.rpn = null;
		value.signaletique.rpint = null;
		value.signaletique.qp0 = null;
		value.signaletique.tfonc30 = null;
		value.signaletique.tfonc100 = null;
	}

	if (chauffage.generateur.isReseauChaleur(value)) {
		value.bienergie = null;
		value.position.cascade = null;
		value.position.position_chaudiere = null;
		value.position.generateur_collectif = true;
		value.position.generateur_multi_batiment = true;
		value.position.position_volume_chauffe = false;
		value.position.generateur_mixte_id = null;
		value.signaletique.pn = null;
		value.signaletique.label = null;
		value.signaletique.scop = null;
		value.signaletique.mode_combustion = null;
		value.signaletique.presence_ventouse = null;
		value.signaletique.presence_regulation = null;
		value.signaletique.pveilleuse = null;
		value.signaletique.rpn = null;
		value.signaletique.rpint = null;
		value.signaletique.qp0 = null;
		value.signaletique.tfonc30 = null;
		value.signaletique.tfonc100 = null;
	}

	if (chauffage.generateur.isGenerateurCollectifInconnu(value)) {
		value.position.generateur_multi_batiment = true;
		value.position.generateur_collectif = true;
		value.position.position_volume_chauffe = false;
		value.position.generateur_mixte_id = null;
		value.position.reseau_chaleur_id = null;
		value.position.position_chaudiere = null;
		value.signaletique.pn = null;
		value.signaletique.label = null;
		value.signaletique.scop = null;
		value.signaletique.mode_combustion = null;
		value.signaletique.presence_ventouse = null;
		value.signaletique.presence_regulation = null;
		value.signaletique.pveilleuse = null;
		value.signaletique.rpn = null;
		value.signaletique.rpint = null;
		value.signaletique.qp0 = null;
		value.signaletique.tfonc30 = null;
		value.signaletique.tfonc100 = null;
	}
	if (false === chauffage.generateur.isGenerateur(value))
		throw new MappingError("generateur", props.generateur);

	return value;
}

export function mapID(props: GenerateurChauffage): string {
	return resolveId(props.donnee_entree.reference);
}

export function mapDescription(props: GenerateurChauffage): string {
	return props.donnee_entree.description || "Non renseigné";
}

export function mapType(
	props: GenerateurChauffage,
): chauffage.generateur.TypeGenerateur | null {
	const Enum = chauffage.generateur.TypeGenerateur.enum;
	switch (props.donnee_entree.enum_type_generateur_ch_id) {
		case "1":
		case "2":
		case "3":
			return Enum.pac_air_air;
		case "55":
		case "56":
		case "57":
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
		case "72":
		case "73":
		case "74":
		case "75":
		case "76":
		case "77":
		case "78":
		case "79":
		case "80":
		case "81":
		case "82":
		case "83":
		case "84":
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
		case "106":
		case "109":
		case "110":
		case "111":
		case "119":
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
		case "134":
		case "135":
		case "136":
		case "137":
		case "138":
		case "139":
		case "171":
			return Enum.chaudiere;

		case "105":
			return Enum.convecteur_bi_jonction;

		case "98":
		case "99":
		case "100":
			return Enum.convecteur_electrique;

		case "20":
		case "24":
		case "28":
		case "32":
		case "36":
		case "40":
			return Enum.cuisiniere;

		case "21":
		case "25":
		case "29":
		case "33":
		case "37":
		case "41":
			return Enum.foyer_ferme;

		case "50":
		case "51":
		case "52":
			return Enum.generateur_air_chaud;

		case "23":
		case "27":
		case "31":
		case "35":
		case "39":
		case "43":
			return Enum.insert;

		case "4":
		case "5":
		case "6":
		case "7":
		case "112":
		case "145":
		case "146":
		case "147":
			return Enum.pac_air_eau;

		case "8":
		case "9":
		case "10":
		case "11":
		case "162":
		case "163":
		case "164":
			return Enum.pac_eau_eau;

		case "12":
		case "13":
		case "14":
		case "15":
		case "165":
		case "166":
		case "167":
			return Enum.pac_eau_glycolee_eau;

		case "16":
		case "17":
		case "18":
		case "19":
		case "168":
		case "169":
		case "170":
			return Enum.pac_geothermique;

		case "102":
			return Enum.panneau_rayonnant_electrique;

		case "103":
			return Enum.plancher_rayonnant_electrique;

		case "22":
		case "26":
		case "30":
		case "34":
		case "38":
		case "42":
		case "44":
		case "45":
		case "46":
		case "47":
			return Enum.poele;

		case "48":
		case "49":
		case "140":
		case "141":
			return Enum.poele_bouilleur;

		case "101":
		case "104":
			return Enum.radiateur_electrique;

		case "53":
		case "54":
			return Enum.radiateur_gaz;

		case "107":
		case "108":
		case "142":
			return Enum.reseau_chaleur;

		default:
			throw new MappingError("chauffage.generateur.type", props);
	}
}

export function mapEnergie(
	props: GenerateurChauffage,
): chauffage.generateur.EnergieChauffage | null {
	const Enum = common.Energie.enum;

	// Cas des générateurs hybrides
	switch (props.donnee_entree.enum_type_generateur_ch_id) {
		case "145":
		case "146":
		case "147":
		case "162":
		case "163":
		case "164":
		case "165":
		case "166":
		case "167":
		case "168":
		case "169":
		case "170":
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
	props: Props,
): chauffage.generateur.Bienergie | null {
	const chaudiere = matchPACHybridePartieChaudiere(props);

	if (!chaudiere) return null;

	switch (chaudiere.donnee_entree.enum_type_generateur_ch_id) {
		case "148":
		case "149":
			return common.Energie.enum.gaz_naturel;
		case "150":
		case "151":
			return common.Energie.enum.fioul;
		case "152":
		case "153":
			return common.Energie.enum.bois_granule;
		case "154":
		case "155":
		case "156":
			return common.Energie.enum.bois_buche;
		case "157":
		case "158":
		case "159":
			return common.Energie.enum.bois_plaquette;
		case "160":
		case "161":
			return common.Energie.enum.gpl;
		default:
			return null;
	}
}

export function mapAnneeInstallation(props: Props): number | null {
	switch (props.generateur.donnee_entree.enum_type_generateur_ch_id) {
		case "75":
			return 1969;
		case "76":
			return 1975;
		case "55":
		case "62":
		case "69":
		case "120":
			return 1977;
		case "77":
		case "85":
		case "127":
			return 1980;
		case "86":
		case "94":
		case "128":
		case "136":
			return 1985;
		case "20":
		case "21":
		case "22":
		case "23":
			return 1989;
		case "78":
		case "87":
		case "129":
			return 1990;
		case "56":
		case "63":
		case "70":
		case "121":
			return 1994;
		case "88":
		case "91":
		case "95":
		case "130":
		case "133":
		case "137":
			return 2000;
		case "57":
		case "64":
		case "71":
		case "122":
			return 2003;
		case "24":
		case "25":
		case "26":
		case "27":
			return 2004;
		case "50":
		case "53":
			return 2005;
		case "32":
		case "33":
		case "34":
		case "35":
			return 2006;
		case "1":
		case "4":
		case "8":
		case "12":
		case "16":
			return 2007;
		case "44":
		case "48":
		case "140":
			return 2011;
		case "58":
		case "65":
		case "72":
		case "123":
			return 2012;
		case "2":
		case "5":
		case "9":
		case "13":
		case "17":
		case "145":
		case "162":
		case "165":
		case "168":
			return 2014;
		case "79":
		case "81":
		case "83":
		case "89":
		case "92":
		case "96":
		case "131":
		case "134":
		case "138":
		case "148":
		case "150":
		case "160":
			return 2015;
		case "6":
		case "10":
		case "14":
		case "18":
		case "146":
		case "163":
		case "166":
		case "169":
			return 2016;
		case "36":
		case "37":
		case "38":
		case "39":
		case "59":
		case "66":
		case "124":
		case "154":
		case "157":
			return 2017;
		case "45":
		case "60":
		case "67":
		case "73":
		case "125":
		case "152":
		case "155":
		case "158":
			return 2019;
		default:
			return null;
	}
}

export namespace position {
	export function mapPosition(props: Props): chauffage.generateur.Position {
		return {
			cascade: mapCascade(props.generateur),
			position_chaudiere: mapPositionChaudiere(props.generateur),
			generateur_multi_batiment: mapGenerateurMultiBatiment(props.generateur),
			position_volume_chauffe: mapPositionVolumeChauffe(props.generateur),
			generateur_collectif: mapGenerateurCollectif(props),
			generateur_mixte_id: mapGenerateurMixteID(props),
			reseau_chaleur_id: mapReseauChaleurID(props.generateur),
		};
	}

	export function mapCascade(
		props: GenerateurChauffage,
	): chauffage.generateur.Cascade | null {
		switch (props.donnee_entree.priorite_generateur_cascade) {
			case null:
			case undefined:
				return null;
			case 0:
				return 0;
			case 1:
				return 1;
			case 2:
				return 2;
			default:
				return 2;
		}
	}

	/**
	 * @note Propriété non couverte dans le modèle ADEME.
	 */
	export function mapPositionChaudiere(
		props: GenerateurChauffage,
	): chauffage.generateur.PositionChaudiere {
		return props.donnee_intermediaire.pn && props.donnee_intermediaire.pn < 18
			? chauffage.generateur.PositionChaudiere.enum.chaudiere_murale
			: chauffage.generateur.PositionChaudiere.enum.chaudiere_sol;
	}

	export function mapGenerateurCollectif(props: Props): boolean {
		if (props.generateur.donnee_entree.enum_lien_generateur_emetteur_id !== "1")
			return false;

		switch (props.installation.donnee_entree.enum_type_installation_id) {
			case "2":
			case "3":
			case "4":
				return true;
			default:
				return false;
		}
	}

	export function mapGenerateurMultiBatiment(
		props: GenerateurChauffage,
	): boolean {
		switch (props.donnee_entree.enum_type_generateur_ch_id) {
			case "109":
			case "110":
			case "111":
			case "112":
			case "171":
				return true;
			default:
				return false;
		}
	}

	export function mapPositionVolumeChauffe(
		props: GenerateurChauffage,
	): boolean {
		return props.donnee_entree.position_volume_chauffe ?? false;
	}

	/**
	 * Deux conventions ADEME coexistent dans le corpus réel pour retrouver le
	 * générateur homologue (chauffage ↔ ECS) d'une chaudière mixte :
	 *
	 * 1. Clé de pairage partagée : les deux générateurs portent la même
	 *    valeur dans `reference_generateur_mixte`, distincte de leurs
	 *    `reference` propres respectives (constaté sur le corpus réel — voir
	 *    `claude/analyse-mapping-errors-ademe-mapper.md` §2.B).
	 * 2. Référence croisée directe : `reference_generateur_mixte` d'un côté
	 *    vaut littéralement la `reference` propre de l'autre côté (constaté
	 *    sur le résidu — voir `claude/rapport-correctifs-known-failures.md` §1).
	 *
	 * On essaie la convention 1 en premier (majoritaire), puis la convention
	 * 2 en repli, avant de considérer la donnée comme réellement incohérente.
	 */
	export function mapGenerateurMixteID(props: Props): string | null {
		const ref = props.generateur.donnee_entree.reference_generateur_mixte;
		if (!ref) return null;

		const generateurs =
			props.input.logement.installation_ecs_collection.flatMap(
				(inst) => inst.generateur_ecs_collection,
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

	export function mapReseauChaleurID(
		props: GenerateurChauffage,
	): string | null {
		return "identifiant_reseau_chaleur" in props.donnee_entree
			? props.donnee_entree.identifiant_reseau_chaleur || null
			: null;
	}
}

export namespace signaletique {
	export function mapSignaletique(
		props: Props,
	): chauffage.generateur.Signaletique {
		const chaudiere = matchPACHybridePartieChaudiere(props);
		return {
			pn: mapPn(props.generateur),
			label: mapLabel(props.generateur),
			scop:
				mapScop(props.generateur) || (chaudiere ? mapScop(chaudiere) : null),
			qp0: mapQP0(props.generateur) || (chaudiere ? mapQP0(chaudiere) : null),
			rpn: mapRpn(props.generateur) || (chaudiere ? mapRpn(chaudiere) : null),
			rpint:
				mapRpint(props.generateur) || (chaudiere ? mapRpint(chaudiere) : null),
			pveilleuse:
				mapPveilleuse(props.generateur) ||
				(chaudiere ? mapPveilleuse(chaudiere) : null),
			tfonc30:
				mapTfonc30(props.generateur) ||
				(chaudiere ? mapTfonc30(chaudiere) : null),
			tfonc100:
				mapTfonc100(props.generateur) ||
				(chaudiere ? mapTfonc100(chaudiere) : null),
			presence_regulation:
				mapPresenceRegulation(props.generateur) ??
				(chaudiere ? mapPresenceRegulation(chaudiere) : null),
			presence_ventouse:
				mapPresenceVentouse(props.generateur) ??
				(chaudiere ? mapPresenceVentouse(chaudiere) : null),
			mode_combustion:
				mapModeCombustion(props.generateur) ??
				(chaudiere ? mapModeCombustion(chaudiere) : null),
		};
	}

	export function mapModeCombustion(
		props: GenerateurChauffage,
	): chauffage.generateur.ModeCombustion | null {
		switch (props.donnee_entree.enum_type_generateur_ch_id) {
			case "50":
			case "51":
			case "55":
			case "56":
			case "57":
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
			case "72":
			case "73":
			case "74":
			case "75":
			case "76":
			case "77":
			case "78":
			case "79":
			case "80":
			case "85":
			case "86":
			case "87":
			case "88":
			case "89":
			case "90":
			case "109":
			case "110":
			case "111":
			case "112":
			case "113":
			case "114":
			case "115":
			case "116":
			case "119":
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
			case "140":
			case "141":
			case "152":
			case "153":
			case "154":
			case "155":
			case "156":
			case "157":
			case "158":
			case "159":
			case "171":
				return chauffage.generateur.ModeCombustion.enum.standard;
			case "81":
			case "82":
			case "91":
			case "92":
			case "93":
			case "133":
			case "134":
			case "135":
				return chauffage.generateur.ModeCombustion.enum.basse_temperature;
			case "52":
			case "83":
			case "84":
			case "94":
			case "95":
			case "96":
			case "97":
			case "136":
			case "137":
			case "138":
			case "139":
			case "148":
			case "149":
			case "150":
			case "151":
			case "160":
			case "161":
				return chauffage.generateur.ModeCombustion.enum.condensation;
			default:
				return null;
		}
	}

	export function mapPn(props: GenerateurChauffage): number | null {
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
		props: GenerateurChauffage,
	): chauffage.generateur.LabelGenerateur | null {
		switch (props.donnee_entree.enum_type_generateur_ch_id) {
			case "98":
			case "99":
			case "100":
				return chauffage.generateur.LabelGenerateur.enum.nf_performance;
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
			case "45":
			case "46":
				return chauffage.generateur.LabelGenerateur.enum.flamme_verte;
			default:
				return null;
		}
	}

	export function mapPresenceRegulation(
		props: GenerateurChauffage,
	): boolean | null {
		return props.donnee_entree.presence_regulation_combustion ?? null;
	}

	export function mapPresenceVentouse(
		props: GenerateurChauffage,
	): boolean | null {
		return props.donnee_entree.presence_ventouse ?? null;
	}

	export function mapRpint(props: GenerateurChauffage): number | null {
		switch (props.donnee_entree.enum_methode_saisie_carac_sys_id) {
			case "3":
			case "4":
			case "5":
				return props.donnee_intermediaire.rpint || null;
			default:
				return null;
		}
	}

	export function mapRpn(props: GenerateurChauffage): number | null {
		switch (props.donnee_entree.enum_methode_saisie_carac_sys_id) {
			case "3":
			case "4":
			case "5":
				return props.donnee_intermediaire.rpn || null;
			default:
				return null;
		}
	}

	export function mapQP0(props: GenerateurChauffage): number | null {
		switch (props.donnee_entree.enum_methode_saisie_carac_sys_id) {
			case "4":
			case "5":
				return props.donnee_intermediaire.qp0 || null;
			default:
				return null;
		}
	}

	export function mapScop(props: GenerateurChauffage): number | null {
		return props.donnee_entree.enum_methode_saisie_carac_sys_id === "6"
			? props.donnee_intermediaire.scop || null
			: null;
	}

	/**
	 * @note Saisie à partir de la plaque signalétique ou d'une documentation technique non couverte par le modèle ADEME.
	 */
	export function mapPveilleuse(props: GenerateurChauffage): number | null {
		return props.donnee_entree.enum_methode_saisie_carac_sys_id === "5"
			? props.donnee_intermediaire.pveilleuse || null
			: null;
	}

	export function mapTfonc30(props: GenerateurChauffage): number | null {
		return props.donnee_entree.enum_methode_saisie_carac_sys_id === "5"
			? props.donnee_intermediaire.temp_fonc_30 || null
			: null;
	}

	export function mapTfonc100(props: GenerateurChauffage): number | null {
		return props.donnee_entree.enum_methode_saisie_carac_sys_id === "5"
			? props.donnee_intermediaire.temp_fonc_100 || null
			: null;
	}
}

/**
 * Retourne un générateur associé parmi enum_type_generateur_ch_id ∈ [148;161]
 */
function matchPACHybridePartieChaudiere(
	props: Props,
): GenerateurChauffage | null {
	if (!isPACHybridePartiePAC(props.generateur)) return null;

	for (const item of props.installation.generateur_chauffage_collection) {
		if (
			isPACHybridePartieChaudiere(item) &&
			item.donnee_entree.enum_lien_generateur_emetteur_id !==
				props.generateur.donnee_entree.enum_lien_generateur_emetteur_id
		) {
			return item;
		}
	}
	return null;
}
