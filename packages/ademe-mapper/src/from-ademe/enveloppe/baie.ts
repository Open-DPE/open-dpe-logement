import { common, enveloppe } from "@open-dpe-logement/models";
import {
	mapPosition as mapParoiPosition,
	mapParoiId,
} from "./paroi/position.js";
import { mapMasque } from "./masque.js";
import { MappingError } from "../errors.js";
import type { Input, BaieVitree, BaieVitreeDoubleFenetre } from "./types.js";
import { resolveId } from "../common.js";

type Props = BaieVitreeProps | DoubleFenetreProps;

type BaieVitreeProps = {
	key: "baie_vitree";
	input: Input;
	baie_vitree: BaieVitree;
};

type DoubleFenetreProps = {
	key: "double_fenetre";
	input: Input;
	baie_vitree: BaieVitree;
	double_fenetre: BaieVitreeDoubleFenetre;
};

function extract(props: Props): BaieVitree | BaieVitreeDoubleFenetre {
	return props.key === "double_fenetre"
		? props.double_fenetre
		: props.baie_vitree;
}

export function mapBaie(props: Props): enveloppe.baie.Baie {
	const value: enveloppe.baie.BaieBase = {
		id: mapId(props),
		description: mapDescription(props),
		type: mapType(props),
		presence_protection_solaire: mapPresenceProtectionSolaire(props),
		type_fermeture: mapTypeFermeture(props),
		annee_installation: null,
		ug: mapUg(props),
		uw: mapUw(props),
		ujn: mapUjn(props),
		sw: mapSw(props),
		position: mapPosition(props),
		vitrage: mapVitrage(props),
		survitrage: mapSurvitrage(props),
		menuiserie: null,
	};

	if (enveloppe.baie.isBaieFenetreOuPorteFenetre(value))
		value.menuiserie = mapMenuiserie(props);

	if (!enveloppe.baie.isBaie(value))
		throw new MappingError("baie", props.baie_vitree);

	return value;
}

export function mapPosition(props: Props): enveloppe.baie.Position {
	const value: enveloppe.baie.PositionBase = {
		...mapParoiPosition({ paroi: props.baie_vitree, input: props.input }),
		baie_id: mapBaieId(props),
		paroi_id: mapParoiId({ paroi: props.baie_vitree, input: props.input }),
		type_pose: mapTypePose(props),
		inclinaison: mapInclinaison(props),
		orientation: mapOrientation(props),
		masques: mapMasques(props),
	};

	// `models` n'exporte pas de garde composite pour `Position` (croisement
	// mitoyennete x orientation) — recomposition manuelle des deux axes.
	const mitoyenneteValide =
		enveloppe.baie.isPositionMitoyenneteLocalNonChauffe(value) ||
		enveloppe.baie.isPositionMitoyenneteAutres(value);
	const orientationValide =
		enveloppe.baie.isPositionVerticale(value) ||
		enveloppe.baie.isPositionHorizontale(value);

	if (!mitoyenneteValide || !orientationValide)
		throw new MappingError("position", props.baie_vitree);

	return value as enveloppe.baie.Position;
}

export function mapMenuiserie(props: Props): enveloppe.baie.Menuiserie {
	return {
		materiau: mapMateriau(props),
		largeur_dormant: mapLargeurDormant(props),
		presence_soubassement: mapPresenceSoubassement(props),
		presence_joint: mapPresenceJoint(props),
		presence_retour_isolation: mapPresenceRetourIsolation(props),
		presence_rupteur_pont_thermique: mapPresenceRupteurPontThermique(props),
	};
}

export function mapVitrage(props: Props): enveloppe.baie.Vitrage {
	const value: enveloppe.baie.VitrageBase = {
		type: mapTypeVitrage(props),
		nature_lame: null,
		epaisseur_lame: null,
	};

	if (enveloppe.baie.isVitrageComplexe(value)) {
		value.nature_lame = mapNatureLame(props);
		value.epaisseur_lame = mapEpaisseurLame(props);
	}

	if (!enveloppe.baie.isVitrage(value))
		throw new MappingError("vitrage", props);

	return value;
}

export function mapSurvitrage(props: Props): enveloppe.baie.Survitrage | null {
	return hasSurvitrage(props)
		? {
				type: mapTypeSurvitrage(props),
				epaisseur_lame: mapEpaisseurSurvitrage(props),
			}
		: null;
}

export function mapId(props: Props): enveloppe.baie.Baie["id"] {
	return props.key === "double_fenetre"
		? resolveId(`double_fenetre:${props.baie_vitree.donnee_entree.reference}`)
		: resolveId(props.baie_vitree.donnee_entree.reference);
}

export function mapBaieId(props: Props): enveloppe.baie.Position["baie_id"] {
	if (props.key === "double_fenetre") {
		return resolveId(props.baie_vitree.donnee_entree.reference);
	} else if ("baie_vitree_double_fenetre" in props.baie_vitree.donnee_entree) {
		return props.baie_vitree.donnee_entree.baie_vitree_double_fenetre
			? resolveId(`double_fenetre:${props.baie_vitree.donnee_entree.reference}`)
			: null;
	} else if ("baie_vitree_double_fenetre" in props.baie_vitree) {
		return props.baie_vitree.baie_vitree_double_fenetre
			? resolveId(`double_fenetre:${props.baie_vitree.donnee_entree.reference}`)
			: null;
	} else {
		return null;
	}
}

export function mapDescription(
	props: Props,
): enveloppe.baie.Baie["description"] {
	const scope = extract(props);
	return "description" in scope.donnee_entree && scope.donnee_entree.description
		? scope.donnee_entree.description
		: "Non renseigné";
}

export function mapType(props: Props): enveloppe.baie.Baie["type"] {
	const scope = extract(props);
	const TypeBaieEnum = enveloppe.baie.TYPES_BAIE;
	switch (scope.donnee_entree.enum_type_baie_id) {
		case "1":
			return TypeBaieEnum.brique_verre_pleine;
		case "2":
			return TypeBaieEnum.brique_verre_creuse;
		case "3":
			return TypeBaieEnum.polycarbonate;
		case "4":
			return TypeBaieEnum.fenetre_battante;
		case "5":
			return TypeBaieEnum.fenetre_coulissante;
		case "6":
			return TypeBaieEnum.porte_fenetre_coulissante;
		case "7":
		case "8":
			return TypeBaieEnum.porte_fenetre_battante;
	}
}

export function mapPresenceProtectionSolaire(
	props: Props,
): enveloppe.baie.Baie["presence_protection_solaire"] {
	if (
		"presence_protection_solaire_hors_fermeture" in
			props.baie_vitree.donnee_entree &&
		null !=
			props.baie_vitree.donnee_entree.presence_protection_solaire_hors_fermeture
	) {
		return props.baie_vitree.donnee_entree
			.presence_protection_solaire_hors_fermeture;
	}
	return (
		props.input.logement.sortie.confort_ete?.protection_solaire_exterieure ??
		false
	);
}

export function mapTypeFermeture(
	props: Props,
): enveloppe.baie.Baie["type_fermeture"] {
	const TypeFermetureEnum = enveloppe.baie.TYPES_FERMETURE;
	switch (props.baie_vitree.donnee_entree.enum_type_fermeture_id) {
		case "1":
			return TypeFermetureEnum.sans_fermeture;
		case "2":
			return TypeFermetureEnum.volet_battant_avec_ajours_fixes;
		case "3":
			return TypeFermetureEnum.fermeture_sans_ajours;
		case "4":
			return TypeFermetureEnum.volets_roulants_pvc_bois_epaisseur_lte_12mm;
		case "5":
			return TypeFermetureEnum.volet_battant_pvc_bois_epaisseur_lte_22mm;
		case "6":
			return TypeFermetureEnum.volets_roulants_pvc_bois_epaisseur_gt_12mm;
		case "7":
			return TypeFermetureEnum.volet_battant_pvc_bois_epaisseur_gt_22mm;
		case "8":
			return TypeFermetureEnum.fermeture_isolee_sans_ajours;
	}
}

export function mapUg(props: Props): enveloppe.baie.Baie["ug"] {
	return extract(props).donnee_entree.ug_saisi || null;
}

export function mapUw(props: Props): enveloppe.baie.Baie["uw"] {
	return extract(props).donnee_entree.uw_saisi || null;
}

export function mapUjn(props: Props): enveloppe.baie.Baie["ujn"] {
	const scope = extract(props);
	return "ujn_saisi" in scope.donnee_entree
		? scope.donnee_entree.ujn_saisi || null
		: null;
}

export function mapSw(props: Props): enveloppe.baie.Baie["sw"] {
	return extract(props).donnee_entree.sw_saisi || null;
}

export function mapTypePose(
	props: Props,
): enveloppe.baie.Position["type_pose"] | null {
	const TypePoseEnum = enveloppe.common.TYPES_POSE;
	switch (props.baie_vitree.donnee_entree.enum_type_pose_id) {
		case "1":
			return TypePoseEnum.nu_exterieur;
		case "2":
			return TypePoseEnum.nu_interieur;
		case "3":
			return TypePoseEnum.tunnel;
		default:
			return null;
	}
}

export function mapInclinaison(
	props: Props,
): enveloppe.baie.Position["inclinaison"] {
	switch (props.baie_vitree.donnee_entree.enum_inclinaison_vitrage_id) {
		case "1":
			return 15;
		case "2":
			return 50;
		case "3":
			return 90;
		case "4":
			return 0;
	}
}

export function mapOrientation(
	props: Props,
): enveloppe.baie.Position["orientation"] {
	switch (props.baie_vitree.donnee_entree.enum_orientation_id) {
		case "1":
			return common.ORIENTATIONS_CARDINALES.sud;
		case "2":
			return common.ORIENTATIONS_CARDINALES.nord;
		case "3":
			return common.ORIENTATIONS_CARDINALES.est;
		case "4":
			return common.ORIENTATIONS_CARDINALES.ouest;
		case "5":
			return enveloppe.common.OrientationHorizontale;
	}
}

export function mapMasques(props: Props): enveloppe.baie.Position["masques"] {
	const values: enveloppe.masque.Masque[] = [];
	const masqueProche = mapMasque({
		key: "masque_proche",
		baie: props.baie_vitree,
	});
	const masqueLointainHomogene = mapMasque({
		key: "masque_lointain_homogene",
		baie: props.baie_vitree,
	});

	if (masqueProche) values.push(masqueProche);
	if (masqueLointainHomogene) values.push(masqueLointainHomogene);

	for (const masque of props.baie_vitree.donnee_entree
		.masque_lointain_non_homogene_collection ?? []) {
		const masqueLointainNonHomogene = mapMasque({
			key: "masque_lointain_non_homogene",
			masque,
		});
		if (masqueLointainNonHomogene) values.push(masqueLointainNonHomogene);
	}

	return values;
}

export function mapMateriau(
	props: Props,
): enveloppe.baie.Menuiserie["materiau"] {
	const scope = extract(props);
	const MateriauEnum = enveloppe.baie.MATERIAUX;
	switch (scope.donnee_entree.enum_type_materiaux_menuiserie_id) {
		case "1":
		case "2":
			return null;
		case "3":
			return MateriauEnum.bois;
		case "4":
			return MateriauEnum.bois_metal;
		case "5":
			return MateriauEnum.pvc;
		case "6":
		case "7":
			return MateriauEnum.metal;
	}
}

export function mapLargeurDormant(
	props: Props,
): enveloppe.baie.Menuiserie["largeur_dormant"] {
	const scope = extract(props);
	return "largeur_dormant" in scope.donnee_entree &&
		scope.donnee_entree.largeur_dormant
		? scope.donnee_entree.largeur_dormant * 10
		: null;
}

export function mapPresenceSoubassement(
	props: Props,
): enveloppe.baie.Menuiserie["presence_soubassement"] {
	const scope = extract(props);
	switch (scope.donnee_entree.enum_type_baie_id) {
		case "8":
			return true;
		default:
			return false;
	}
}

export function mapPresenceJoint(
	props: Props,
): enveloppe.baie.Menuiserie["presence_joint"] {
	const scope = extract(props);
	return "presence_joint" in scope.donnee_entree
		? (scope.donnee_entree.presence_joint ?? null)
		: null;
}

export function mapPresenceRetourIsolation(
	props: Props,
): enveloppe.baie.Menuiserie["presence_retour_isolation"] {
	const scope = extract(props);
	return "presence_retour_isolation" in scope.donnee_entree
		? (scope.donnee_entree.presence_retour_isolation ?? null)
		: null;
}

export function mapPresenceRupteurPontThermique(
	props: Props,
): enveloppe.baie.Menuiserie["presence_rupteur_pont_thermique"] {
	const scope = extract(props);
	switch (scope.donnee_entree.enum_type_materiaux_menuiserie_id) {
		case "6":
			return true;
		case "7":
			return false;
		default:
			return null;
	}
}

export function mapTypeVitrage(props: Props): enveloppe.baie.Vitrage["type"] {
	const scope = extract(props);
	const TypeVitrageEnum = enveloppe.baie.TYPES_VITRAGE;
	switch (scope.donnee_entree.enum_type_vitrage_id) {
		case "1":
		case "4":
			return TypeVitrageEnum.simple_vitrage;
		case "2":
			return scope.donnee_entree.vitrage_vir
				? TypeVitrageEnum.double_vitrage_fe
				: TypeVitrageEnum.double_vitrage;
		case "3":
			return scope.donnee_entree.vitrage_vir
				? TypeVitrageEnum.triple_vitrage_fe
				: TypeVitrageEnum.triple_vitrage;
		case "5":
			return TypeVitrageEnum.brique_verre;
		case "6":
			return TypeVitrageEnum.polycarbonate;
	}
}

export function mapNatureLame(
	props: Props,
): enveloppe.baie.Vitrage["nature_lame"] {
	const scope = extract(props);
	const NatureLameEnum = enveloppe.baie.NATURES_LAME;
	switch (scope.donnee_entree.enum_type_gaz_lame_id) {
		case "1":
			return NatureLameEnum.air;
		case "2":
			return NatureLameEnum.argon;
		default:
			return null;
	}
}

export function mapEpaisseurLame(
	props: Props,
): enveloppe.baie.Vitrage["epaisseur_lame"] {
	const scope = extract(props);
	switch (scope.donnee_entree.enum_type_vitrage_id) {
		case "2":
		case "3":
			return scope.donnee_entree.epaisseur_lame || null;
		default:
			return null;
	}
}

export function hasSurvitrage(props: Props): boolean {
	switch (extract(props).donnee_entree.enum_type_vitrage_id) {
		case "4":
			return true;
		default:
			return false;
	}
}

export function mapTypeSurvitrage(
	props: Props,
): enveloppe.baie.Survitrage["type"] {
	if (!hasSurvitrage(props)) return null;
	return extract(props).donnee_entree.vitrage_vir
		? enveloppe.baie.TYPES_SURVITRAGE.survitrage_fe
		: enveloppe.baie.TYPES_SURVITRAGE.survitrage_simple;
}

export function mapEpaisseurSurvitrage(
	props: Props,
): enveloppe.baie.Survitrage["epaisseur_lame"] {
	if (!hasSurvitrage(props)) return null;
	return extract(props).donnee_entree.epaisseur_lame || null;
}
