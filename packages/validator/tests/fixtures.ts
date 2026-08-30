/**
 * Fixtures locales et pragmatiques pour les tests de `@open-dpe-logement/validator`
 * (cf. `claude/convention-design-schemas.md` — décision : pas de package
 * `schemas-fixtures` séparé pour l'instant).
 *
 * Deux usages :
 * - Couche A (schema-plumbing.test.ts) : une fixture minimale valide par clé
 *   publique de `MAP`, pour vérifier que `validate()` route bien chaque clé
 *   vers le bon schéma Ajv.
 * - Couche B (rules.test.ts) : une « golden fixture » de diagnostic complet,
 *   cohérente de bout en bout (structure Ajv + règles de `checkRules`), et
 *   quelques variantes locales pour les cas que la golden fixture ne peut pas
 *   porter elle-même (cf. commentaires ci-dessous, notamment pour RC-003 et
 *   pour `generateur_mixte_id`).
 *
 * Tous les identifiants sont des constantes explicites (pas de génération
 * aléatoire) pour que les références croisées soient lisibles et que les
 * tests restent déterministes.
 */

import type { Key } from "../src/index.js";

// ---------------------------------------------------------------------------
// Identifiants
// ---------------------------------------------------------------------------

export const NIVEAU_1_ID = "00000000-0000-0000-0000-000000000001";
export const LOCAL_NON_CHAUFFE_1_ID = "00000000-0000-0000-0000-000000000002";
export const LNC_PAROI_1_ID = "00000000-0000-0000-0000-000000000003";
export const MUR_1_ID = "00000000-0000-0000-0000-000000000004";
export const PLANCHER_BAS_1_ID = "00000000-0000-0000-0000-000000000005";
export const BAIE_1_ID = "00000000-0000-0000-0000-000000000006";
export const PORTE_1_ID = "00000000-0000-0000-0000-000000000007";
export const PONT_THERMIQUE_1_ID = "00000000-0000-0000-0000-000000000008";
export const PONT_THERMIQUE_2_ID = "00000000-0000-0000-0000-000000000009";
export const EMETTEUR_1_ID = "00000000-0000-0000-0000-000000000010";
export const GENERATEUR_CHAUFFAGE_1_ID = "00000000-0000-0000-0000-000000000011";
export const GENERATEUR_CHAUFFAGE_2_ID = "00000000-0000-0000-0000-000000000012";
export const INSTALLATION_CHAUFFAGE_1_ID = "00000000-0000-0000-0000-000000000013";
export const SYSTEME_CHAUFFAGE_1_ID = "00000000-0000-0000-0000-000000000014";
export const GENERATEUR_ECS_1_ID = "00000000-0000-0000-0000-000000000015";
export const INSTALLATION_ECS_1_ID = "00000000-0000-0000-0000-000000000016";
export const SYSTEME_ECS_1_ID = "00000000-0000-0000-0000-000000000017";
export const VENTILATION_INSTALLATION_1_ID = "00000000-0000-0000-0000-000000000018";
export const APPARTEMENT_1_ID = "00000000-0000-0000-0000-000000000019";
export const LNC_BAIE_1_ID = "00000000-0000-0000-0000-000000000020";
export const MASQUE_1_ID = "00000000-0000-0000-0000-000000000021";
export const PLANCHER_HAUT_1_ID = "00000000-0000-0000-0000-000000000022";
export const PANNEAU_PHOTOVOLTAIQUE_1_ID = "00000000-0000-0000-0000-000000000023";
export const REFROIDISSEMENT_GENERATEUR_1_ID = "00000000-0000-0000-0000-000000000024";
export const REFROIDISSEMENT_INSTALLATION_1_ID = "00000000-0000-0000-0000-000000000025";

/** Identifiant syntaxiquement valide mais ne référençant jamais aucune entité des fixtures. */
export const UNKNOWN_ID = "ffffffff-ffff-ffff-ffff-ffffffffffff";

// ---------------------------------------------------------------------------
// Dates / années de référence
//
// `date_etablissement` fixe l'année plafond (RC-002 « borne haute »). Elle est
// volontairement choisie SOUS le plafond dur du schéma commun (`annee` a un
// `maximum: 2026`) pour laisser une marge où placer une valeur qui casse
// uniquement RC-002 sans jamais violer la contrainte Ajv `annee <= 2026`.
// ---------------------------------------------------------------------------

export const DATE_VISITE = "2024-06-01";
export const DATE_ETABLISSEMENT = "2024-06-15";
export const BATIMENT_ANNEE_CONSTRUCTION = 1980;

// ---------------------------------------------------------------------------
// Bâtiment
// ---------------------------------------------------------------------------

function buildAdresse(): unknown {
	return {
		ban_id: null,
		nom: "1 rue des Tests",
		code_postal: "75001",
		code_insee: "75101",
		commune: "Paris",
	};
}

export function buildBatiment(): unknown {
	return {
		rnb_id: null,
		type: "maison",
		annee_construction: BATIMENT_ANNEE_CONSTRUCTION,
		annee_renovation: null,
		altitude: 35,
		logements: 1,
		surface_habitable: 90,
		hauteur_sous_plafond: 2.5,
		materiaux_anciens: false,
		adresse: buildAdresse(),
		appartements_visites: [],
		logement: {
			description: "Logement de référence",
			surface_habitable: 90,
			hauteur_sous_plafond: 2.5,
		},
	};
}

export function buildBatimentAppartement(id: string): unknown {
	return {
		id,
		description: "Appartement visité",
		surface_habitable: 50,
		hauteur_sous_plafond: 2.5,
		position: "rdc",
		typologie: "T2",
	};
}

// ---------------------------------------------------------------------------
// Enveloppe
// ---------------------------------------------------------------------------

export function buildNiveau(id: string): unknown {
	return {
		id,
		description: "Rez-de-chaussée",
		surface: 90,
		inertie_paroi_verticale: null,
		inertie_plancher_bas: null,
		inertie_plancher_haut: null,
	};
}

export function buildLncParoi(id: string): unknown {
	return {
		id,
		description: "Paroi du local non chauffé",
		isolation: null,
		position: { mitoyennete: "exterieur", surface: 5 },
	};
}

export function buildLncBaie(id: string): unknown {
	return {
		id,
		description: "Baie du local non chauffé",
		type_vitrage: null,
		materiau_menuiserie: null,
		presence_rupteur_pont_thermique: null,
		// position$defs distinct de enveloppe/local-non-chauffe/paroi : exige aussi
		// inclinaison/orientation (même structure que enveloppe/baie), branche
		// « Autres cas » la plus simple ici.
		position: { mitoyennete: "exterieur", surface: 1, inclinaison: 45, orientation: "sud" },
	};
}

export function buildLocalNonChauffe(id: string, parois: unknown[]): unknown {
	return {
		id,
		description: "Garage",
		type: "garage",
		parois,
		baies: [],
	};
}

/**
 * Mur non isolé (branche « Paroi non isolée ou dont l'isolation n'est pas
 * connue » de `enveloppe/paroi#/$defs/isolation`) : c'est la branche la plus
 * simple, utilisée dans la golden fixture. `isolation.annee_installation` y
 * est forcément `null` (non applicable) — elle ne peut donc pas servir de
 * base aux tests RC-003, qui ont besoin d'un mur isolé (cf. `buildMurIsole`).
 */
export function buildMurNonIsole(id: string, anneeConstruction: number | null, anneeRenovation: number | null): unknown {
	return {
		id,
		description: "Mur extérieur",
		structures: [],
		type_doublage: null,
		presence_enduit_isolant: null,
		inertie: null,
		annee_construction: anneeConstruction,
		annee_renovation: anneeRenovation,
		u0: null,
		u: null,
		position: {
			surface: 40,
			mitoyennete: "exterieur",
			local_non_chauffe_id: null,
		},
		isolation: {
			etat: false,
			type: null,
			annee_installation: null,
			epaisseur: null,
			resistance_thermique: null,
		},
	};
}

/**
 * Mur isolé (branche « Paroi isolée » de `enveloppe/paroi#/$defs/isolation`) :
 * seule branche où `isolation.annee_installation` peut porter une vraie
 * valeur (ou `null` explicitement) — nécessaire pour exercer RC-003.
 * N'est PAS utilisé dans la golden fixture partagée (cf. plan : le mur de la
 * golden fixture est volontairement non isolé) ; utilisé uniquement par les
 * variantes locales de `rules.test.ts` dédiées à RC-003.
 */
export function buildMurIsole(
	id: string,
	anneeConstruction: number | null,
	anneeRenovation: number | null,
	anneeInstallation: number | null,
): unknown {
	return {
		id,
		description: "Mur extérieur isolé",
		structures: [],
		type_doublage: null,
		presence_enduit_isolant: null,
		inertie: null,
		annee_construction: anneeConstruction,
		annee_renovation: anneeRenovation,
		u0: null,
		u: null,
		position: {
			surface: 40,
			mitoyennete: "exterieur",
			local_non_chauffe_id: null,
		},
		isolation: {
			etat: true,
			type: "iti",
			annee_installation: anneeInstallation,
			epaisseur: null,
			resistance_thermique: null,
		},
	};
}

export function buildPlancherBas(id: string, localNonChauffeId: string): unknown {
	return {
		id,
		description: "Plancher bas",
		type: null,
		inertie: null,
		annee_construction: BATIMENT_ANNEE_CONSTRUCTION,
		annee_renovation: null,
		u0: null,
		u: null,
		position: {
			surface: 60,
			mitoyennete: "local_non_chauffe",
			local_non_chauffe_id: localNonChauffeId,
			surface_ue: null,
			perimetre_ue: null,
		},
		isolation: {
			etat: false,
			type: null,
			annee_installation: null,
			epaisseur: null,
			resistance_thermique: null,
		},
	};
}

export function buildPlancherHaut(id: string): unknown {
	return {
		id,
		description: "Plancher haut",
		configuration: "plancher",
		type: null,
		inertie: null,
		annee_construction: null,
		annee_renovation: null,
		u0: null,
		u: null,
		position: {
			surface: 60,
			mitoyennete: "exterieur",
			local_non_chauffe_id: null,
		},
		isolation: {
			etat: false,
			type: null,
			annee_installation: null,
			epaisseur: null,
			resistance_thermique: null,
		},
	};
}

export function buildBaie(id: string, paroiId: string | null): unknown {
	return {
		id,
		description: "Fenêtre",
		type: "fenetre_battante",
		presence_protection_solaire: false,
		type_fermeture: "sans_fermeture",
		annee_installation: 2000,
		ug: null,
		uw: null,
		ujn: null,
		sw: null,
		position: {
			paroi_id: paroiId,
			baie_id: null,
			type_pose: null,
			inclinaison: 90,
			orientation: "sud",
			masques: [],
			surface: 2,
			mitoyennete: "exterieur",
			local_non_chauffe_id: null,
		},
		menuiserie: {
			materiau: null,
			largeur_dormant: null,
			presence_soubassement: false,
			presence_joint: null,
			presence_retour_isolation: null,
			presence_rupteur_pont_thermique: null,
		},
		vitrage: { type: "double_vitrage", nature_lame: null, epaisseur_lame: null },
		survitrage: null,
	};
}

export function buildPorte(id: string, paroiId: string | null): unknown {
	return {
		id,
		description: "Porte d'entrée",
		isolation: null,
		materiau: null,
		annee_installation: null,
		u: null,
		position: {
			paroi_id: paroiId,
			presence_sas: false,
			type_pose: "nu_exterieur",
			surface: 2,
			mitoyennete: "exterieur",
			local_non_chauffe_id: null,
		},
		menuiserie: { largeur_dormant: null, presence_joint: null, presence_retour_isolation: null },
		// Porte sans vitrage : `vitrage` porte le polymorphisme via
		// surface (const 0) / type (non_applicable), ce n'est jamais `null`
		// tel quel — cf. schemas/enveloppe/porte.yaml $defs.vitrage.
		vitrage: { surface: 0, type: null },
	};
}

export function buildPontThermiquePlancherBasMur(id: string, murId: string, plancherId: string): unknown {
	return {
		id,
		description: "Pont thermique plancher bas / mur",
		longueur: 10,
		kpt: null,
		liaison: {
			type: "plancher_bas_mur",
			pont_thermique_partiel: false,
			mur_id: murId,
			plancher_id: plancherId,
			ouverture_id: null,
		},
	};
}

export function buildPontThermiquePorteMur(id: string, murId: string, ouvertureId: string): unknown {
	return {
		id,
		description: "Pont thermique porte / mur",
		longueur: 5,
		kpt: null,
		liaison: {
			type: "porte_mur",
			pont_thermique_partiel: false,
			mur_id: murId,
			plancher_id: null,
			ouverture_id: ouvertureId,
		},
	};
}

export function buildMasque(id: string): unknown {
	return {
		id,
		description: "Masque proche",
		type: "paroi_laterale_sans_obstacle_au_sud",
		hauteur: null,
		profondeur: null,
		secteur: null,
	};
}

export function buildEnveloppe(): unknown {
	return {
		exposition: "simple",
		q4pa_conv: null,
		presence_brasseurs_air: false,
		niveaux: [buildNiveau(NIVEAU_1_ID)],
		locaux_non_chauffes: [buildLocalNonChauffe(LOCAL_NON_CHAUFFE_1_ID, [buildLncParoi(LNC_PAROI_1_ID)])],
		murs: [buildMurNonIsole(MUR_1_ID, BATIMENT_ANNEE_CONSTRUCTION, null)],
		planchers_bas: [buildPlancherBas(PLANCHER_BAS_1_ID, LOCAL_NON_CHAUFFE_1_ID)],
		planchers_hauts: [],
		baies: [buildBaie(BAIE_1_ID, MUR_1_ID)],
		portes: [buildPorte(PORTE_1_ID, MUR_1_ID)],
		ponts_thermiques: [
			buildPontThermiquePlancherBasMur(PONT_THERMIQUE_1_ID, MUR_1_ID, PLANCHER_BAS_1_ID),
			buildPontThermiquePorteMur(PONT_THERMIQUE_2_ID, MUR_1_ID, PORTE_1_ID),
		],
	};
}

// ---------------------------------------------------------------------------
// Chauffage
// ---------------------------------------------------------------------------

export function buildEmetteur(id: string): unknown {
	return {
		id,
		description: "Radiateur salon",
		type: "radiateur",
		temperature_distribution: null,
		presence_robinet_thermostatique: false,
		annee_installation: null,
	};
}

/** Branche `chauffage/generateur-inconnu` : la plus simple des 5 branches de `/chauffage/generateur`. */
export function buildGenerateurChauffageInconnu(id: string): unknown {
	return {
		id,
		description: "Générateur collectif inconnu",
		type: null,
		energie: null,
		bienergie: null,
		annee_installation: null,
		position: {
			position_chaudiere: null,
			cascade: null,
			generateur_collectif: true,
			generateur_multi_batiment: false,
			position_volume_chauffe: false,
			generateur_mixte_id: null,
			reseau_chaleur_id: null,
		},
		signaletique: {
			pn: null,
			label: null,
			scop: null,
			mode_combustion: null,
			presence_regulation: null,
			presence_ventouse: null,
			pveilleuse: null,
			qp0: null,
			rpn: null,
			rpint: null,
			tfonc30: null,
			tfonc100: null,
		},
	};
}

/**
 * Branche `chauffage/generateur-thermodynamique` (« Pompe à chaleur
 * classique »). Utilisé UNIQUEMENT par la variante locale du test RC-004
 * `generateur_mixte_id` : c'est la seule famille de générateurs de chauffage
 * dont AUCUNE branche concrète ne force `position.generateur_mixte_id` à
 * `non_applicable` — cf. note détaillée dans `rules.test.ts`. La golden
 * fixture partagée continue d'utiliser `generateur-inconnu` (plus simple),
 * qui verrouille ce champ à `null`.
 */
export function buildGenerateurChauffagePacClassique(id: string, generateurMixteId: string | null): unknown {
	return {
		id,
		description: "PAC air/eau",
		type: "pac_air_eau",
		energie: "electricite",
		bienergie: null,
		annee_installation: null,
		position: {
			position_chaudiere: null,
			cascade: null,
			generateur_collectif: false,
			generateur_multi_batiment: false,
			position_volume_chauffe: true,
			generateur_mixte_id: generateurMixteId,
			reseau_chaleur_id: null,
		},
		signaletique: {
			pn: null,
			label: null,
			scop: null,
			mode_combustion: null,
			presence_ventouse: null,
			presence_regulation: null,
			pveilleuse: null,
			qp0: null,
			rpn: null,
			rpint: null,
			tfonc30: null,
			tfonc100: null,
		},
	};
}

export function buildSystemeChauffage(id: string, generateurId: string, emetteurId: string): unknown {
	return {
		id,
		description: "Système central",
		type: "central",
		generateur_id: generateurId,
		reseau: {
			type_distribution: "hydraulique",
			temperature_distribution: "moyenne",
			presence_fluide_frigorigene: false,
			presence_circulateur_externe: false,
			niveaux_desservis: 1,
			isolation: null,
			emetteurs: [emetteurId],
		},
	};
}

export function buildInstallationChauffage(id: string, systemes: unknown[]): unknown {
	return {
		id,
		description: "Installation de chauffage",
		surface: 90,
		type: "central",
		installation_collective: false,
		comptage_individuel: null,
		regulation_terminale: false,
		programmation: "absent",
		solaire_thermique: null,
		systemes,
	};
}

export function buildChauffage(): unknown {
	const systeme = buildSystemeChauffage(SYSTEME_CHAUFFAGE_1_ID, GENERATEUR_CHAUFFAGE_1_ID, EMETTEUR_1_ID);
	return {
		emetteurs: [buildEmetteur(EMETTEUR_1_ID)],
		generateurs: [buildGenerateurChauffageInconnu(GENERATEUR_CHAUFFAGE_1_ID)],
		installations: [buildInstallationChauffage(INSTALLATION_CHAUFFAGE_1_ID, [systeme])],
	};
}

// ---------------------------------------------------------------------------
// ECS
// ---------------------------------------------------------------------------

export function buildGenerateurEcsInconnu(id: string): unknown {
	return {
		id,
		description: "Générateur ECS collectif inconnu",
		type: null,
		energie: null,
		bienergie: null,
		annee_installation: null,
		position: {
			position_chauffe_eau: null,
			generateur_collectif: true,
			generateur_multi_batiment: false,
			position_volume_chauffe: false,
			generateur_mixte_id: null,
			reseau_chaleur_id: null,
		},
		stockage: { volume: 0, type: null, position_volume_chauffe: null },
		signaletique: {
			pn: null,
			cop: null,
			label: null,
			mode_combustion: null,
			presence_ventouse: null,
			pveilleuse: null,
			qp0: null,
			rpn: null,
		},
	};
}

export function buildSystemeEcs(id: string, generateurId: string): unknown {
	return {
		id,
		description: "Système ECS",
		generateur_id: generateurId,
		reseau: {
			alimentation_contigue: false,
			niveaux_desservis: 1,
			isolation: null,
			bouclage: null,
		},
	};
}

export function buildInstallationEcs(id: string, systemes: unknown[]): unknown {
	return {
		id,
		description: "Installation ECS",
		surface: 90,
		installation_collective: false,
		systemes,
		solaire_thermique: null,
	};
}

export function buildEcs(): unknown {
	const systeme = buildSystemeEcs(SYSTEME_ECS_1_ID, GENERATEUR_ECS_1_ID);
	return {
		generateurs: [buildGenerateurEcsInconnu(GENERATEUR_ECS_1_ID)],
		installations: [buildInstallationEcs(INSTALLATION_ECS_1_ID, [systeme])],
	};
}

// ---------------------------------------------------------------------------
// Ventilation / Refroidissement / Production
// ---------------------------------------------------------------------------

export function buildVentilationInstallation(id: string): unknown {
	return {
		id,
		description: "Ventilation naturelle",
		surface: 90,
		type: "ventilation_ouverture_fenetres",
		installation_collective: null,
		presence_echangeur_thermique: null,
		annee_installation: null,
	};
}

export function buildVentilation(): unknown {
	return { installations: [buildVentilationInstallation(VENTILATION_INSTALLATION_1_ID)] };
}

/** Branche « Aucune installation de refroidissement » du `anyOf` de `refroidissement.yaml`. */
export function buildRefroidissement(): unknown {
	return { generateurs: [], installations: [] };
}

/** Branche « Climatiseur » de `/refroidissement/generateur` : la plus simple. */
export function buildRefroidissementGenerateur(id: string): unknown {
	return {
		id,
		description: "Climatiseur",
		type: "autre",
		energie: "electricite",
		annee_installation: null,
		seer: null,
		reseau_froid_id: null,
	};
}

export function buildRefroidissementInstallation(id: string, generateurIds: string[]): unknown {
	return {
		id,
		description: "Installation de refroidissement",
		surface: 20,
		generateurs: generateurIds,
	};
}

export function buildPanneauPhotovoltaique(id: string): unknown {
	return {
		id,
		description: "Panneau photovoltaïque",
		orientation: "sud",
		inclinaison: 30,
		modules: 10,
		surface: 15,
		installation_collective: false,
	};
}

export function buildProduction(): unknown {
	return { panneaux_photovoltaiques: [] };
}

// ---------------------------------------------------------------------------
// Diagnostic complet — golden fixture (couche B)
// ---------------------------------------------------------------------------

/**
 * Diagnostic complet, valide de bout en bout (structure Ajv + `checkRules`)
 * — reconstruit intégralement à chaque appel (pas de partage de références
 * mutables entre tests : chaque test qui a besoin d'une variante appelle
 * cette fonction puis modifie directement l'objet retourné, ce qui joue le
 * même rôle qu'un clone profond sans dépendre d'un utilitaire générique).
 */
export function buildGoldenDiagnostic(): Record<string, unknown> {
	return {
		date_visite: DATE_VISITE,
		date_etablissement: DATE_ETABLISSEMENT,
		type: "logement",
		batiment: buildBatiment(),
		enveloppe: buildEnveloppe(),
		chauffage: buildChauffage(),
		ecs: buildEcs(),
		ventilation: buildVentilation(),
		refroidissement: buildRefroidissement(),
		production: buildProduction(),
	};
}

// ---------------------------------------------------------------------------
// Couche A — une fixture valide par clé publique de `MAP`
//
// Construite par introspection de `MAP` : si une clé est ajoutée sans entrée
// correspondante ci-dessous, `schema-plumbing.test.ts` échoue bruyamment
// (cf. le test de couverture dédié) plutôt que d'ignorer silencieusement la
// nouvelle clé.
// ---------------------------------------------------------------------------

export const FIXTURES: Record<Key, unknown> = {
	"/batiment": buildBatiment(),
	"/batiment/appartement": buildBatimentAppartement(APPARTEMENT_1_ID),
	"/chauffage": buildChauffage(),
	"/chauffage/emetteur": buildEmetteur(EMETTEUR_1_ID),
	"/chauffage/generateur": buildGenerateurChauffageInconnu(GENERATEUR_CHAUFFAGE_1_ID),
	"/chauffage/installation": buildInstallationChauffage(INSTALLATION_CHAUFFAGE_1_ID, [
		buildSystemeChauffage(SYSTEME_CHAUFFAGE_1_ID, GENERATEUR_CHAUFFAGE_1_ID, EMETTEUR_1_ID),
	]),
	"/chauffage/systeme": buildSystemeChauffage(SYSTEME_CHAUFFAGE_1_ID, GENERATEUR_CHAUFFAGE_1_ID, EMETTEUR_1_ID),
	"/diagnostic": buildGoldenDiagnostic(),
	"/ecs": buildEcs(),
	"/ecs/generateur": buildGenerateurEcsInconnu(GENERATEUR_ECS_1_ID),
	"/ecs/installation": buildInstallationEcs(INSTALLATION_ECS_1_ID, [buildSystemeEcs(SYSTEME_ECS_1_ID, GENERATEUR_ECS_1_ID)]),
	"/ecs/systeme": buildSystemeEcs(SYSTEME_ECS_1_ID, GENERATEUR_ECS_1_ID),
	"/enveloppe": buildEnveloppe(),
	"/enveloppe/baie": buildBaie(BAIE_1_ID, MUR_1_ID),
	"/enveloppe/local-non-chauffe": buildLocalNonChauffe(LOCAL_NON_CHAUFFE_1_ID, [buildLncParoi(LNC_PAROI_1_ID)]),
	"/enveloppe/local-non-chauffe/baie": buildLncBaie(LNC_BAIE_1_ID),
	"/enveloppe/local-non-chauffe/paroi": buildLncParoi(LNC_PAROI_1_ID),
	"/enveloppe/masque": buildMasque(MASQUE_1_ID),
	"/enveloppe/mur": buildMurNonIsole(MUR_1_ID, BATIMENT_ANNEE_CONSTRUCTION, null),
	"/enveloppe/niveau": buildNiveau(NIVEAU_1_ID),
	"/enveloppe/plancher-bas": buildPlancherBas(PLANCHER_BAS_1_ID, LOCAL_NON_CHAUFFE_1_ID),
	"/enveloppe/plancher-haut": buildPlancherHaut(PLANCHER_HAUT_1_ID),
	"/enveloppe/pont-thermique": buildPontThermiquePlancherBasMur(PONT_THERMIQUE_1_ID, MUR_1_ID, PLANCHER_BAS_1_ID),
	"/enveloppe/porte": buildPorte(PORTE_1_ID, MUR_1_ID),
	"/production": buildProduction(),
	"/production/panneau-photovoltaique": buildPanneauPhotovoltaique(PANNEAU_PHOTOVOLTAIQUE_1_ID),
	"/refroidissement": buildRefroidissement(),
	"/refroidissement/generateur": buildRefroidissementGenerateur(REFROIDISSEMENT_GENERATEUR_1_ID),
	"/refroidissement/installation": buildRefroidissementInstallation(REFROIDISSEMENT_INSTALLATION_1_ID, [
		REFROIDISSEMENT_GENERATEUR_1_ID,
	]),
	"/ventilation": buildVentilation(),
	"/ventilation/installation": buildVentilationInstallation(VENTILATION_INSTALLATION_1_ID),
};
