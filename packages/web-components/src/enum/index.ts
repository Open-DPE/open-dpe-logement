import * as models from "@open-dpe-logement/models";
import { define } from "../shared/components.js";

const MAP: Record<string, Record<string, string>> = {};

MAP["scenario"] = {
	[models.common.SCENARIOS.conventionnel]: "Scénario conventionnel",
	[models.common.SCENARIOS.depensier]: "Scénario dépensier",
};

MAP["usage"] = {
	[models.common.USAGES.chauffage]: "Chauffage",
	[models.common.USAGES.ecs]: "Eau chaude sanitaire",
	[models.common.USAGES.refroidissement]: "Refroidissement",
	[models.common.USAGES.eclairage]: "Éclairage",
	[models.common.USAGES.auxiliaire]: "Auxiliaire",
};

MAP["type-batiment"] = {
	[models.batiment.TYPES_BATIMENT.maison]: "Maison individuelle",
	[models.batiment.TYPES_BATIMENT.immeuble]: "Immeuble collectif",
};

MAP["zone-climatique"] = {
	[models.batiment.ZONES_CLIMATIQUES.H1a]: "H1a",
	[models.batiment.ZONES_CLIMATIQUES.H1b]: "H1b",
	[models.batiment.ZONES_CLIMATIQUES.H1c]: "H1c",
	[models.batiment.ZONES_CLIMATIQUES.H2a]: "H2a",
	[models.batiment.ZONES_CLIMATIQUES.H2b]: "H2b",
	[models.batiment.ZONES_CLIMATIQUES.H2c]: "H2c",
	[models.batiment.ZONES_CLIMATIQUES.H2d]: "H2d",
	[models.batiment.ZONES_CLIMATIQUES.H3]: "H3",
};

MAP["energie"] = {
	[models.common.ENERGIES.electricite]: "Électricité",
	[models.common.ENERGIES.electricite_renouvelable]:
		"Électricité d'origine renouvelable",
	[models.common.ENERGIES.gaz_naturel]: "Gaz naturel",
	[models.common.ENERGIES.gpl]: "GPL",
	[models.common.ENERGIES.fioul]: "Fioul",
	[models.common.ENERGIES.charbon]: "Charbon",
	[models.common.ENERGIES.bois_buche]: "Bois - Bûche",
	[models.common.ENERGIES.bois_plaquette]: "Bois - Plaquette",
	[models.common.ENERGIES.bois_granule]: "Bois - Granule",
	[models.common.ENERGIES.reseau_chaleur]: "Réseau de chaleur",
	[models.common.ENERGIES.reseau_froid]: "Réseau de froid",
};

MAP["orientation"] = {
	[models.common.ORIENTATIONS.nord]: "Nord",
	[models.common.ORIENTATIONS.nord_est]: "Nord-Est",
	[models.common.ORIENTATIONS.est]: "Est",
	[models.common.ORIENTATIONS.sud_est]: "Sud-Est",
	[models.common.ORIENTATIONS.sud]: "Sud",
	[models.common.ORIENTATIONS.sud_ouest]: "Sud-Ouest",
	[models.common.ORIENTATIONS.ouest]: "Ouest",
	[models.common.ORIENTATIONS.nord_ouest]: "Nord-Ouest",
};

MAP["orientation-cardinale"] = {
	[models.common.ORIENTATIONS_CARDINALES.nord]: "Nord",
	[models.common.ORIENTATIONS_CARDINALES.sud]: "Sud",
	[models.common.ORIENTATIONS_CARDINALES.est]: "Est",
	[models.common.ORIENTATIONS_CARDINALES.ouest]: "Ouest",
};

MAP["etiquette"] = {
	[models.diagnostic.ETIQUETTES.A]: "A",
	[models.diagnostic.ETIQUETTES.B]: "B",
	[models.diagnostic.ETIQUETTES.C]: "C",
	[models.diagnostic.ETIQUETTES.D]: "D",
	[models.diagnostic.ETIQUETTES.E]: "E",
	[models.diagnostic.ETIQUETTES.F]: "F",
	[models.diagnostic.ETIQUETTES.G]: "G",
};

MAP["mois"] = {
	[models.common.MOIS.Janvier]: "Janvier",
	[models.common.MOIS.Février]: "Février",
	[models.common.MOIS.Mars]: "Mars",
	[models.common.MOIS.Avril]: "Avril",
	[models.common.MOIS.Mai]: "Mai",
	[models.common.MOIS.Juin]: "Juin",
	[models.common.MOIS.Juillet]: "Juillet",
	[models.common.MOIS.Août]: "Août",
	[models.common.MOIS.Septembre]: "Septembre",
	[models.common.MOIS.Octobre]: "Octobre",
	[models.common.MOIS.Novembre]: "Novembre",
	[models.common.MOIS.Décembre]: "Décembre",
};

MAP["type-diagnostic"] = {
	[models.diagnostic.TYPES_DIAGNOSTIC.batiment]: "Bâtiment",
	[models.diagnostic.TYPES_DIAGNOSTIC.logement]: "Logement",
};

MAP["confort-ete"] = {
	[models.diagnostic.CONFORTS_ETE.bon]: "Bon",
	[models.diagnostic.CONFORTS_ETE.moyen]: "Moyen",
	[models.diagnostic.CONFORTS_ETE.insuffisant]: "Insuffisant",
};

// --- Chauffage ---

MAP["chauffage.installation.type"] = {
	[models.chauffage.TYPES_CHAUFFAGE.central]: "Chauffage central",
	[models.chauffage.TYPES_CHAUFFAGE.divise]: "Chauffage divisé",
};

MAP["chauffage.systeme.type"] = {
	[models.chauffage.TYPES_CHAUFFAGE.central]: "Chauffage central",
	[models.chauffage.TYPES_CHAUFFAGE.divise]: "Chauffage divisé",
};

MAP["chauffage.type-generateur"] = {
	[models.chauffage.generateur.TYPES_GENERATEUR.chaudiere]: "Chaudière",
	[models.chauffage.generateur.TYPES_GENERATEUR.convecteur_bi_jonction]:
		"Convecteur bi-jonction",
	[models.chauffage.generateur.TYPES_GENERATEUR.convecteur_electrique]:
		"Convecteur électrique",
	[models.chauffage.generateur.TYPES_GENERATEUR.panneau_rayonnant_electrique]:
		"Panneau rayonnant électrique",
	[models.chauffage.generateur.TYPES_GENERATEUR.plafond_rayonnant_electrique]:
		"Plafond rayonnant électrique",
	[models.chauffage.generateur.TYPES_GENERATEUR
		.plancher_rayonnant_electrique]: "Plancher rayonnant électrique",
	[models.chauffage.generateur.TYPES_GENERATEUR.radiateur_electrique]:
		"Radiateur électrique",
	[models.chauffage.generateur.TYPES_GENERATEUR
		.radiateur_electrique_accumulation]: "Radiateur électrique à accumulation",
	[models.chauffage.generateur.TYPES_GENERATEUR.generateur_air_chaud]:
		"Générateur d'air chaud",
	[models.chauffage.generateur.TYPES_GENERATEUR.pac_air_air]:
		"Pompe à chaleur air / air",
	[models.chauffage.generateur.TYPES_GENERATEUR.pac_air_eau]:
		"Pompe à chaleur air / eau",
	[models.chauffage.generateur.TYPES_GENERATEUR.pac_eau_eau]:
		"Pompe à chaleur eau / eau",
	[models.chauffage.generateur.TYPES_GENERATEUR.pac_eau_glycolee_eau]:
		"Pompe à chaleur eau glycolée / eau",
	[models.chauffage.generateur.TYPES_GENERATEUR.pac_geothermique]:
		"Pompe à chaleur géothermique",
	[models.chauffage.generateur.TYPES_GENERATEUR.cuisiniere]: "Cuisinière",
	[models.chauffage.generateur.TYPES_GENERATEUR.foyer_ferme]: "Foyer fermé",
	[models.chauffage.generateur.TYPES_GENERATEUR.insert]: "Insert",
	[models.chauffage.generateur.TYPES_GENERATEUR.poele]: "Poêle",
	[models.chauffage.generateur.TYPES_GENERATEUR.poele_bouilleur]:
		"Poêle boulleur",
	[models.chauffage.generateur.TYPES_GENERATEUR.radiateur_gaz]:
		"Radiateur gaz",
	[models.chauffage.generateur.TYPES_GENERATEUR.reseau_chaleur]:
		"Réseau de chaleur",
};

MAP["chauffage.mode-combustion"] = {
	[models.chauffage.generateur.MODES_COMBUSTION.standard]: "Standard",
	[models.chauffage.generateur.MODES_COMBUSTION.basse_temperature]:
		"Basse température",
	[models.chauffage.generateur.MODES_COMBUSTION.condensation]: "Condensation",
};

MAP["chauffage.position-chaudiere"] = {
	[models.chauffage.generateur.POSITIONS_CHAUDIERE.chaudiere_murale]:
		"Chaudière murale",
	[models.chauffage.generateur.POSITIONS_CHAUDIERE.chaudiere_sol]:
		"Chaudière au sol",
};

MAP["chauffage.label-generateur"] = {
	[models.chauffage.generateur.LABELS.flamme_verte]: "Flamme verte",
	[models.chauffage.generateur.LABELS.nf_performance]: "NF Performance",
};

MAP["chauffage.type-distribution"] = {
	[models.chauffage.systeme.TYPES_DISTRIBUTION.hydraulique]:
		"Distribution hydraulique",
	[models.chauffage.systeme.TYPES_DISTRIBUTION.aeraulique]:
		"Distribution aeraulique",
};

MAP["chauffage.temperature-distribution"] = {
	[models.chauffage.emetteur.TEMPERATURES_DISTRIBUTION.basse]:
		"Basse température",
	[models.chauffage.emetteur.TEMPERATURES_DISTRIBUTION.moyenne]:
		"Moyenne température",
	[models.chauffage.emetteur.TEMPERATURES_DISTRIBUTION.haute]:
		"Haute température",
};

MAP["chauffage.type-emetteur"] = {
	[models.chauffage.emetteur.TYPES_EMETTEUR.plancher_chauffant]:
		"Plancher chauffant",
	[models.chauffage.emetteur.TYPES_EMETTEUR.plafond_chauffant]:
		"Plafond chauffant",
	[models.chauffage.emetteur.TYPES_EMETTEUR.radiateur_monotube]:
		"Radiateur monotube",
	[models.chauffage.emetteur.TYPES_EMETTEUR.radiateur_bitube]:
		"Radiateur bitube",
	[models.chauffage.emetteur.TYPES_EMETTEUR.radiateur]: "Radiateur",
	[models.chauffage.emetteur.TYPES_EMETTEUR.autres]: "Autres",
};

/**
 * `type_emission` est une valeur calculée par le moteur (cf.
 * `engine/rules/chauffage/emission`), pas un enum exposé par
 * `@open-dpe-logement/models` : les clés sont reprises telles quelles du
 * dictionnaire de doctrine (`chauffage:type-emission`).
 */
MAP["chauffage.type-emission"] = {
	radiateur: "Radiateur",
	air_souffle: "Air soufflé",
	plancher_chauffant: "Plancher chauffant",
	plafond_chauffant: "Plafond chauffant",
};

MAP["chauffage.type-programmation"] = {
	[models.chauffage.installation.TYPES_PROGRAMMATION.absent]:
		"Absence de programmation",
	[models.chauffage.installation.TYPES_PROGRAMMATION
		.central_sans_minimum_temperature]:
		"Programmation centrale sans minimum de température",
	[models.chauffage.installation.TYPES_PROGRAMMATION
		.central_avec_minimum_temperature]:
		"Programmation centrale avec minimum de température",
	[models.chauffage.installation.TYPES_PROGRAMMATION
		.central_collectif_sans_detection_presence]:
		"Programmation centrale collective",
	[models.chauffage.installation.TYPES_PROGRAMMATION
		.central_collectif_avec_detection_presence]:
		"Programmation centrale collective avec détection de présence",
	[models.chauffage.installation.TYPES_PROGRAMMATION
		.terminal_avec_minimum_temperature]:
		"Programmation par pièce avec minimum de température",
	[models.chauffage.installation.TYPES_PROGRAMMATION
		.terminal_avec_minimum_temperature_detection_presence]:
		"Programmation par pièce avec minimum de température et détection de présence",
};

MAP["chauffage.usage-solaire"] = {
	[models.chauffage.installation.USAGES_SOLAIRE.chauffage]: "Chauffage",
	[models.chauffage.installation.USAGES_SOLAIRE.chauffage_ecs]:
		"Chauffage + ECS",
};

// --- ECS ---

MAP["ecs:type-generateur"] = {
	[models.ecs.generateur.TYPES_GENERATEUR.chauffe_eau]: "Chauffe eau",
	[models.ecs.generateur.TYPES_GENERATEUR.chaudiere]: "Chaudière",
	[models.ecs.generateur.TYPES_GENERATEUR.cet_air_ambiant]:
		"Chauffe eau thermodynamique sur air ambiant",
	[models.ecs.generateur.TYPES_GENERATEUR.cet_air_exterieur]:
		"Chauffe eau thermodynamique sur air extérieur",
	[models.ecs.generateur.TYPES_GENERATEUR.cet_air_extrait]:
		"Chauffe eau thermodynamique sur air extrait",
	[models.ecs.generateur.TYPES_GENERATEUR.pac_air_eau]:
		"Pompe à chaleur air / eau",
	[models.ecs.generateur.TYPES_GENERATEUR.pac_eau_eau]:
		"Pompe à chaleur eau / eau",
	[models.ecs.generateur.TYPES_GENERATEUR.pac_eau_glycolee_eau]:
		"Pompe à chaleur eau glycolée / eau",
	[models.ecs.generateur.TYPES_GENERATEUR.pac_geothermique]:
		"Pompe à chaleur géothermique",
	[models.ecs.generateur.TYPES_GENERATEUR.poele_bouilleur]: "Poêle bouilleur",
	[models.ecs.generateur.TYPES_GENERATEUR.reseau_chaleur]:
		"Réseau de chaleur",
};

MAP["ecs:mode-combustion"] = {
	[models.ecs.generateur.MODES_COMBUSTION.standard]: "Standard",
	[models.ecs.generateur.MODES_COMBUSTION.basse_temperature]:
		"Basse température",
	[models.ecs.generateur.MODES_COMBUSTION.condensation]: "Condensation",
};

MAP["ecs:position-chauffe-eau"] = {
	[models.ecs.generateur.POSITIONS_CHAUFFE_EAU.chauffe_eau_vertical]:
		"Chauffe eau vertical",
	[models.ecs.generateur.POSITIONS_CHAUFFE_EAU.chauffe_eau_horizontal]:
		"Chauffe eau horizontal",
};

MAP["ecs:label-generateur"] = {
	[models.ecs.generateur.LABELS.ne_performance_a]: "NE Performance - A",
	[models.ecs.generateur.LABELS.ne_performance_b]: "NE Performance - B",
	[models.ecs.generateur.LABELS.ne_performance_c]: "NE Performance - C",
};

MAP["ecs:bouclage-reseau"] = {
	[models.ecs.systeme.BOUCLAGES.non_boucle]: "Réseau non bouclé",
	[models.ecs.systeme.BOUCLAGES.boucle]: "Réseau bouclé",
	[models.ecs.systeme.BOUCLAGES.trace]: "Réseau tracé",
};

MAP["ecs:type-stockage"] = {
	[models.ecs.generateur.TYPES_STOCKAGE.integre]:
		"Stockage intégré à la production",
	[models.ecs.generateur.TYPES_STOCKAGE.independant]:
		"Stockage indépendant de la production",
};

MAP["ecs:usage-solaire"] = {
	[models.ecs.installation.USAGES_SOLAIRE.ecs]: "ECS seule",
	[models.ecs.installation.USAGES_SOLAIRE.chauffage_ecs]: "Chauffage + ECS",
};

// --- Refroidissement ---

MAP["refroidissement:type-generateur"] = {
	[models.refroidissement.generateur.TYPES_GENERATEUR.pac_air_air]:
		"PAC air/air",
	[models.refroidissement.generateur.TYPES_GENERATEUR.pac_air_eau]:
		"PAC air/eau",
	[models.refroidissement.generateur.TYPES_GENERATEUR.pac_eau_eau]:
		"PAC eau/eau",
	[models.refroidissement.generateur.TYPES_GENERATEUR.pac_eau_glycolee_eau]:
		"PAC eau glycolée/eau",
	[models.refroidissement.generateur.TYPES_GENERATEUR.pac_geothermique]:
		"PAC géothermique",
	[models.refroidissement.generateur.TYPES_GENERATEUR
		.autre_systeme_thermodynamique]: "Autres systèmes thermodynamique",
	[models.refroidissement.generateur.TYPES_GENERATEUR.reseau_froid]:
		"Réseau de froid",
	[models.refroidissement.generateur.TYPES_GENERATEUR.autre]:
		"Autres systèmes",
};

// --- Ventilation ---

MAP["ventilation:type"] = {
	[models.ventilation.installation.TYPES_VENTILATION
		.ventilation_ouverture_fenetres]: "Ventilation par ouverture des fenêtres",
	[models.ventilation.installation.TYPES_VENTILATION
		.ventilation_entrees_air_hautes_basses]:
		"Ventilation par entrées d'air hautes et basses",
	[models.ventilation.installation.TYPES_VENTILATION
		.vmc_simple_flux_autoreglable]: "VMC Simple flux autoréglable",
	[models.ventilation.installation.TYPES_VENTILATION
		.vmc_simple_flux_hygroreglable_a]: "VMC Simple flux hygroréglable - Type A",
	[models.ventilation.installation.TYPES_VENTILATION
		.vmc_simple_flux_hygroreglable_gaz]: "VMC Simple flux hygroréglable Gaz",
	[models.ventilation.installation.TYPES_VENTILATION
		.vmc_simple_flux_hygroreglable_b]: "VMC Simple flux hygroréglable - Type B",
	[models.ventilation.installation.TYPES_VENTILATION
		.vmc_basse_pression_autoreglable]: "VMC Basse pression autoréglable",
	[models.ventilation.installation.TYPES_VENTILATION
		.vmc_basse_pression_hygroreglable_a]:
		"VMC Basse préssion hygroréglable - Type A",
	[models.ventilation.installation.TYPES_VENTILATION
		.vmc_basse_pression_hygroreglable_b]:
		"VMC Basse pression hygroréglable - Type B",
	[models.ventilation.installation.TYPES_VENTILATION.vmc_double_flux]:
		"VMC Double flux",
	[models.ventilation.installation.TYPES_VENTILATION
		.ventilation_naturelle_conduit]: "Ventilation naturelle par conduit",
	[models.ventilation.installation.TYPES_VENTILATION.ventilation_hybride]:
		"Ventilation hybride",
	[models.ventilation.installation.TYPES_VENTILATION
		.ventilation_hybride_entrees_air_hygroreglables]:
		"Ventilation hybride avec entrées d'air hygroréglables",
	[models.ventilation.installation.TYPES_VENTILATION
		.ventilation_mecanique_conduit]:
		"Ventilation mécanique sur conduit existant",
	[models.ventilation.installation.TYPES_VENTILATION
		.ventilation_naturelle_conduit_entrees_air_hygroreglables]:
		"Ventilation naturelle par conduit avec entrées d'air hygroéglables",
	[models.ventilation.installation.TYPES_VENTILATION.puit_climatique]:
		"Puit climatique",
	[models.ventilation.installation.TYPES_VENTILATION
		.ventilation_mecanique_insufflation]:
		"Ventilation mécanique par insufflation",
};

// --- Bâtiment ---

MAP["batiment:position-appartement"] = {
	[models.batiment.appartement.POSITIONS.rdc]:
		"Appartement en rez-de-chaussée",
	[models.batiment.appartement.POSITIONS.etage_intermediaire]:
		"Appartement en étage intermédiaire",
	[models.batiment.appartement.POSITIONS.dernier_etage]:
		"Appartement au dernier étage",
};

MAP["batiment:typologie-appartement"] = {
	[models.batiment.appartement.TYPOLOGIES.T1]: "T1",
	[models.batiment.appartement.TYPOLOGIES.T2]: "T2",
	[models.batiment.appartement.TYPOLOGIES.T3]: "T3",
	[models.batiment.appartement.TYPOLOGIES.T4]: "T4",
	[models.batiment.appartement.TYPOLOGIES.T5]: "T5",
	[models.batiment.appartement.TYPOLOGIES.T6]: "T6",
	[models.batiment.appartement.TYPOLOGIES.T7]: "T7 et plus",
};

// --- Production ---

MAP["production:usage-electricite"] = {
	[models.production.USAGES_ELECTRICITE.chauffage]: "Chauffage",
	[models.production.USAGES_ELECTRICITE.refroidissement]: "Refroidissement",
	[models.production.USAGES_ELECTRICITE.ecs]: "Eau chaude sanitaire",
	[models.production.USAGES_ELECTRICITE.eclairage]: "Eclairage",
	[models.production.USAGES_ELECTRICITE.auxiliaires_ventilation]:
		"Auxiliaires de ventilation",
	[models.production.USAGES_ELECTRICITE.auxiliaires_distribution]:
		"Auxiliaires de distribution",
	[models.production.USAGES_ELECTRICITE.autres]: "Autres",
};

// --- Enveloppe ---

MAP["enveloppe:inertie"] = {
	[models.enveloppe.common.INERTIES.legere]: "Légère",
	[models.enveloppe.common.INERTIES.moyenne]: "Moyenne",
	[models.enveloppe.common.INERTIES.lourde]: "Lourde",
	[models.enveloppe.common.INERTIES.tres_lourde]: "Très lourde",
};

MAP["enveloppe:exposition"] = {
	[models.enveloppe.EXPOSITIONS.simple]: "Exposition simple",
	[models.enveloppe.EXPOSITIONS.multiple]: "Exposition multiple",
};

MAP["enveloppe:orientation-paroi"] = {
	...MAP["orientation-cardinale"],
	horizontale: "Paroi horizontale",
};

MAP["enveloppe:paroi:mitoyennete"] = {
	[models.enveloppe.common.MITOYENNETES.exterieur]: "Extérieur",
	[models.enveloppe.common.MITOYENNETES.enterre]: "Enterré",
	[models.enveloppe.common.MITOYENNETES.vide_sanitaire]: "Vide sanitaire",
	[models.enveloppe.common.MITOYENNETES.terre_plein]: "Terre plein",
	[models.enveloppe.common.MITOYENNETES.sous_sol_non_chauffe]:
		"Sous-sol non chauffé",
	[models.enveloppe.common.MITOYENNETES.local_non_chauffe]:
		"Local non chauffé",
	[models.enveloppe.common.MITOYENNETES.local_non_residentiel]:
		"Local non résidentiel",
	[models.enveloppe.common.MITOYENNETES.local_residentiel]:
		"Local résidentiel",
	[models.enveloppe.common.MITOYENNETES.local_non_accessible]:
		"Local non accessible",
};

MAP["enveloppe:paroi:inertie"] = {
	[models.enveloppe.common.INERTIES_PAROI.legere]: "Inertie légère",
	[models.enveloppe.common.INERTIES_PAROI.lourde]: "Inertie lourde",
};

MAP["enveloppe:paroi:type-isolation"] = {
	[models.enveloppe.common.TYPES_ISOLATION.iti]: "ITI",
	[models.enveloppe.common.TYPES_ISOLATION.ite]: "ITE",
	[models.enveloppe.common.TYPES_ISOLATION.itr]: "ITR",
	[models.enveloppe.common.TYPES_ISOLATION.iti_ite]: "ITI + ITE",
	[models.enveloppe.common.TYPES_ISOLATION.itr_iti]: "ITR + ITI",
	[models.enveloppe.common.TYPES_ISOLATION.itr_ite]: "ITR + ITE",
	[models.enveloppe.common.TYPES_ISOLATION.itr_iti_ite]: "ITR + ITI + ITE",
};

MAP["enveloppe:paroi:type-pose"] = {
	[models.enveloppe.common.TYPES_POSE.nu_exterieur]: "Nu extérieur",
	[models.enveloppe.common.TYPES_POSE.nu_interieur]: "Nu intérieur",
	[models.enveloppe.common.TYPES_POSE.tunnel]: "Tunnel",
};

MAP["enveloppe:mur:type"] = {
	[models.enveloppe.mur.MATERIAUX_MUR.pierre_moellons]: "Pierre ou moellons",
	[models.enveloppe.mur.MATERIAUX_MUR.pierre_moellons_avec_remplissage]:
		"Pierre ou moellons avec remplissage",
	[models.enveloppe.mur.MATERIAUX_MUR.pise_ou_beton_terre]:
		"Pise ou béton terre",
	[models.enveloppe.mur.MATERIAUX_MUR.pan_bois_sans_remplissage]:
		"Pan bois sans remplissage",
	[models.enveloppe.mur.MATERIAUX_MUR.pan_bois_avec_remplissage]:
		"Pan bois avec remplissage",
	[models.enveloppe.mur.MATERIAUX_MUR.bois_rondin]: "Bois rondin",
	[models.enveloppe.mur.MATERIAUX_MUR.brique_pleine_simple]:
		"Brique pleine simple",
	[models.enveloppe.mur.MATERIAUX_MUR.brique_pleine_double_avec_lame_air]:
		"Brique pleine double avec lame d'air",
	[models.enveloppe.mur.MATERIAUX_MUR.brique_creuse]: "Brique creuse",
	[models.enveloppe.mur.MATERIAUX_MUR.bloc_beton_plein]: "Bloc béton plein",
	[models.enveloppe.mur.MATERIAUX_MUR.bloc_beton_creux]: "Bloc béton creux",
	[models.enveloppe.mur.MATERIAUX_MUR.beton_banche]: "Béton banché",
	[models.enveloppe.mur.MATERIAUX_MUR.beton_machefer]: "Béton machefer",
	[models.enveloppe.mur.MATERIAUX_MUR.brique_terre_cuite_alveolaire]:
		"Brique terre cuite alvéolaire",
	[models.enveloppe.mur.MATERIAUX_MUR
		.sandwich_beton_isolant_beton_sans_isolation_rapportee]:
		"Mur sandwich béton isolant et béton sans isolation rapportée",
	[models.enveloppe.mur.MATERIAUX_MUR.cloison_platre]: "Cloison de plâtre",
	[models.enveloppe.mur.MATERIAUX_MUR.ossature_bois_sans_remplissage]:
		"Ossature bois sans remplissage",
	[models.enveloppe.mur.MATERIAUX_MUR
		.ossature_bois_avec_remplissage_tout_venant]:
		"Ossature bois avec remplissage tout venant",
	[models.enveloppe.mur.MATERIAUX_MUR.ossature_bois_avec_remplissage_isolant]:
		"Ossature bois avec remplissage isolant",
	[models.enveloppe.mur.MATERIAUX_MUR.beton_cellulaire]: "Béton cellulaire",
};

MAP["enveloppe:mur:type-doublage"] = {
	[models.enveloppe.mur.TYPES_DOUBLAGE.sans_doublage]: "Sans doublage",
	[models.enveloppe.mur.TYPES_DOUBLAGE.indetermine]:
		"Doublage rapporté de nature indéterminé",
	[models.enveloppe.mur.TYPES_DOUBLAGE.lame_air_inferieur_15mm]:
		"Doublage rapporté avec lame d'air inférieure à 15mm",
	[models.enveloppe.mur.TYPES_DOUBLAGE.lame_air_superieur_15mm]:
		"Doublage rapporté avec lame d'air supérieure à 15mm",
	[models.enveloppe.mur.TYPES_DOUBLAGE.materiaux_connu]:
		"Doublage rapporté avec un matériau de doublage connu (plâtre, brique, bois)",
};

MAP["enveloppe:plancher-bas:type"] = {
	[models.enveloppe.plancherBas.TYPES_PLANCHER_BAS
		.plancher_avec_ou_sans_remplissage]: "Plancher avec ou sans remplissage",
	[models.enveloppe.plancherBas.TYPES_PLANCHER_BAS
		.plancher_entre_solives_metalliques]: "Plancher entre solives metalliques",
	[models.enveloppe.plancherBas.TYPES_PLANCHER_BAS
		.plancher_entre_solives_bois]: "Plancher entre solives bois",
	[models.enveloppe.plancherBas.TYPES_PLANCHER_BAS
		.plancher_bois_sur_solives_metalliques]:
		"Plancher bois sur solives metalliques",
	[models.enveloppe.plancherBas.TYPES_PLANCHER_BAS.bardeaux_et_remplissage]:
		"Plancher et remplissage",
	[models.enveloppe.plancherBas.TYPES_PLANCHER_BAS
		.voutains_sur_solives_metalliques]: "Plancher sur solives metalliques",
	[models.enveloppe.plancherBas.TYPES_PLANCHER_BAS
		.voutains_briques_ou_moellons]: "Plancher briques ou moellons",
	[models.enveloppe.plancherBas.TYPES_PLANCHER_BAS.dalle_beton]:
		"Plancher beton",
	[models.enveloppe.plancherBas.TYPES_PLANCHER_BAS
		.plancher_bois_sur_solives_bois]: "Plancher bois sur solives bois",
	[models.enveloppe.plancherBas.TYPES_PLANCHER_BAS
		.plancher_lourd_type_entrevous_terre_cuite_ou_poutrelles_beton]:
		"Plancher lourd type entrevous terre cuite ou poutrelles beton",
	[models.enveloppe.plancherBas.TYPES_PLANCHER_BAS.plancher_entrevous_isolant]:
		"Plancher entrevous isolant",
};

MAP["enveloppe:plancher-haut:configuration"] = {
	[models.enveloppe.plancherHaut.CONFIGURATIONS.plancher]: "Plancher",
	[models.enveloppe.plancherHaut.CONFIGURATIONS.rampants]: "Rampants",
	[models.enveloppe.plancherHaut.CONFIGURATIONS.terrasse]: "Terrasse",
};

MAP["enveloppe:plancher-haut:type"] = {
	[models.enveloppe.plancherHaut.TYPES_PLANCHER_HAUT
		.plafond_avec_ou_sans_remplissage]: "Plafond avec ou sans remplissage",
	[models.enveloppe.plancherHaut.TYPES_PLANCHER_HAUT
		.plafond_entre_solives_metalliques]: "Plafond entre solives metalliques",
	[models.enveloppe.plancherHaut.TYPES_PLANCHER_HAUT
		.plafond_entre_solives_bois]: "Plafond entre solives bois",
	[models.enveloppe.plancherHaut.TYPES_PLANCHER_HAUT
		.plafond_bois_sur_solives_metalliques]:
		"Plafond bois sur solives metalliques",
	[models.enveloppe.plancherHaut.TYPES_PLANCHER_HAUT
		.plafond_bois_sous_solives_metalliques]:
		"Plafond bois sous solives metalliques",
	[models.enveloppe.plancherHaut.TYPES_PLANCHER_HAUT.bardeaux_et_remplissage]:
		"Bardeaux et remplissage",
	[models.enveloppe.plancherHaut.TYPES_PLANCHER_HAUT
		.plafond_bois_sur_solives_bois]: "Plafond bois sur solives bois",
	[models.enveloppe.plancherHaut.TYPES_PLANCHER_HAUT
		.plafond_bois_sous_solives_bois]: "Plafond bois sous solives bois",
	[models.enveloppe.plancherHaut.TYPES_PLANCHER_HAUT.dalle_beton]:
		"Dalle beton",
	[models.enveloppe.plancherHaut.TYPES_PLANCHER_HAUT.plafond_lourd]:
		"Plafond lourd",
	[models.enveloppe.plancherHaut.TYPES_PLANCHER_HAUT
		.combles_amenages_sous_rampant]: "Combles amenages sous rampant",
	[models.enveloppe.plancherHaut.TYPES_PLANCHER_HAUT.toiture_chaume]:
		"Toiture chaume",
	[models.enveloppe.plancherHaut.TYPES_PLANCHER_HAUT.plafond_patre]:
		"Plafond patre",
	[models.enveloppe.plancherHaut.TYPES_PLANCHER_HAUT.bac_acier]: "Bac acier",
};

MAP["enveloppe:pont-thermique:type"] = {
	[models.enveloppe.pontThermique.TYPES_LIAISON.plancher_bas_mur]:
		"Plancher bas / Mur",
	[models.enveloppe.pontThermique.TYPES_LIAISON.plancher_haut_mur]:
		"Plancher haut / Mur",
	[models.enveloppe.pontThermique.TYPES_LIAISON.refend_mur]: "Refend / Mur",
	[models.enveloppe.pontThermique.TYPES_LIAISON.plancher_intermediaire_mur]:
		"Plancher intermédiaire / Mur",
	[models.enveloppe.pontThermique.TYPES_LIAISON.baie_mur]: "Baie / Mur",
	[models.enveloppe.pontThermique.TYPES_LIAISON.porte_mur]: "Porte / Mur",
};

MAP["enveloppe:baie:type"] = {
	[models.enveloppe.baie.TYPES_BAIE.brique_verre_pleine]:
		"Brique de verre pleine",
	[models.enveloppe.baie.TYPES_BAIE.brique_verre_creuse]:
		"Brique de verre creuse",
	[models.enveloppe.baie.TYPES_BAIE.polycarbonate]: "Polycarbonate",
	[models.enveloppe.baie.TYPES_BAIE.fenetre_battante]: "Fenêtre battante",
	[models.enveloppe.baie.TYPES_BAIE.fenetre_coulissante]:
		"Fenêtre coulissante",
	[models.enveloppe.baie.TYPES_BAIE.porte_fenetre_coulissante]:
		"Porte fenêtre coulissante",
	[models.enveloppe.baie.TYPES_BAIE.porte_fenetre_battante]:
		"Porte fenêtre battante",
};

MAP["enveloppe:baie:materiau"] = {
	[models.enveloppe.baie.MATERIAUX.pvc]: "PVC",
	[models.enveloppe.baie.MATERIAUX.bois]: "Bois",
	[models.enveloppe.baie.MATERIAUX.bois_metal]: "Bois-métal",
	[models.enveloppe.baie.MATERIAUX.metal]: "Métal",
};

MAP["enveloppe:baie:type-vitrage"] = {
	[models.enveloppe.baie.TYPES_VITRAGE.brique_verre]: "Brique de verre",
	[models.enveloppe.baie.TYPES_VITRAGE.polycarbonate]: "Polycarbonate",
	[models.enveloppe.baie.TYPES_VITRAGE.simple_vitrage]: "Simple vitrage",
	[models.enveloppe.baie.TYPES_VITRAGE.double_vitrage]: "Double vitrage",
	[models.enveloppe.baie.TYPES_VITRAGE.double_vitrage_fe]:
		"Double vitrage à faite emissivité",
	[models.enveloppe.baie.TYPES_VITRAGE.triple_vitrage]: "Triple vitrage",
	[models.enveloppe.baie.TYPES_VITRAGE.triple_vitrage_fe]:
		"Triple vitrage à faible emissivité",
};

MAP["enveloppe:baie:nature-lame-air"] = {
	[models.enveloppe.baie.NATURES_LAME.air]: "Air",
	[models.enveloppe.baie.NATURES_LAME.argon]: "Argon",
	[models.enveloppe.baie.NATURES_LAME.krypton]: "Krypton",
};

MAP["enveloppe:baie:type-survitrage"] = {
	[models.enveloppe.baie.TYPES_SURVITRAGE.survitrage_simple]:
		"Survitrage simple",
	[models.enveloppe.baie.TYPES_SURVITRAGE.survitrage_fe]:
		"Survitrage à faible emissivité",
};

MAP["enveloppe:baie:type-fermeture"] = {
	[models.enveloppe.baie.TYPES_FERMETURE.sans_fermeture]: "Sans fermeture",
	[models.enveloppe.baie.TYPES_FERMETURE.jalousie_accordeon]:
		"Jalousie et accordéon",
	[models.enveloppe.baie.TYPES_FERMETURE.fermeture_lames_orientables]:
		"Fermeture à lames orientables",
	[models.enveloppe.baie.TYPES_FERMETURE.venitiens_exterieurs_metal]:
		"Venitiens extérieurs en métal",
	[models.enveloppe.baie.TYPES_FERMETURE.volet_battant_avec_ajours_fixes]:
		"Volet battant avec ajours fixes",
	[models.enveloppe.baie.TYPES_FERMETURE.persiennes_avec_ajours_fixes]:
		"Persiennes avec ajours fixes",
	[models.enveloppe.baie.TYPES_FERMETURE.fermeture_sans_ajours]:
		"Femeture sans ajours",
	[models.enveloppe.baie.TYPES_FERMETURE.volets_roulants_aluminium]:
		"Volets roulants en aluminium",
	[models.enveloppe.baie.TYPES_FERMETURE
		.volets_roulants_pvc_bois_epaisseur_lte_12mm]:
		"Volets roulants PVC ou bois - Epaisseur intérieure ou égale à 12mm",
	[models.enveloppe.baie.TYPES_FERMETURE
		.volets_roulants_pvc_bois_epaisseur_gt_12mm]:
		"Volets roulants PVC ou bois - Epaisseur supérieure à 12mm",
	[models.enveloppe.baie.TYPES_FERMETURE
		.persienne_coulissante_epaisseur_lte_22mm]:
		"Persienne coulissante - Epaisseur intérieure ou égale à 22mm",
	[models.enveloppe.baie.TYPES_FERMETURE
		.persienne_coulissante_epaisseur_gt_22mm]:
		"Persienne coulissante - Epaisseur supérieure à 22mm",
	[models.enveloppe.baie.TYPES_FERMETURE
		.volet_battant_pvc_bois_epaisseur_lte_22mm]:
		"Volet battant PVC ou bois - Epaisseur intérieure ou égale à 22mm",
	[models.enveloppe.baie.TYPES_FERMETURE
		.volet_battant_pvc_bois_epaisseur_gt_22mm]:
		"Volet battant PVC ou bois - Epaisseur supérieure à 22mm",
	[models.enveloppe.baie.TYPES_FERMETURE.fermeture_isolee_sans_ajours]:
		"Femeture isolée sans ajours",
};

MAP["enveloppe:porte:materiau"] = {
	[models.enveloppe.porte.MATERIAUX.pvc]: "PVC",
	[models.enveloppe.porte.MATERIAUX.bois]: "Bois",
	[models.enveloppe.porte.MATERIAUX.metal]: "Métal",
};

MAP["enveloppe:porte:type-vitrage"] = {
	[models.enveloppe.porte.TYPES_VITRAGE.simple_vitrage]: "Simple vitrage",
	[models.enveloppe.porte.TYPES_VITRAGE.double_vitrage]: "Double vitrage",
	[models.enveloppe.porte.TYPES_VITRAGE.triple_vitrage]: "Triple vitrage",
};

MAP["enveloppe:masque:type"] = {
	[models.enveloppe.masque.TYPES_MASQUE.homogene]: "Masque lointain homogène",
	[models.enveloppe.masque.TYPES_MASQUE.non_homogene]:
		"Masque lointain non homogène",
	[models.enveloppe.masque.TYPES_MASQUE.fond_balcon]: "Fond de balcon",
	[models.enveloppe.masque.TYPES_MASQUE.fond_et_flanc_loggias]:
		"Fond et flanc de loggias",
	[models.enveloppe.masque.TYPES_MASQUE.balcon_ou_auvent]: "Balcon ou auvent",
	[models.enveloppe.masque.TYPES_MASQUE.paroi_laterale_sans_obstacle_au_sud]:
		"Paroi latérale sans obstacle au sud",
	[models.enveloppe.masque.TYPES_MASQUE.paroi_laterale_avec_obstacle_au_sud]:
		"Paroi latérale avec obstacle au sud",
};

MAP["enveloppe:masque:secteur"] = {
	[models.enveloppe.masque.SECTEURS.lateral]: "Secteur latéral",
	[models.enveloppe.masque.SECTEURS.lateral_sud]:
		"Secteur latéral vers le sud",
	[models.enveloppe.masque.SECTEURS.central]: "Secteur central",
	[models.enveloppe.masque.SECTEURS.central_sud]:
		"Secteur central vers le sud",
};

MAP["enveloppe:local-non-chauffe:type"] = {
	[models.enveloppe.localNonChauffe.TYPES_LNC.garage]: "Garage",
	[models.enveloppe.localNonChauffe.TYPES_LNC.cellier]: "Cellier",
	[models.enveloppe.localNonChauffe.TYPES_LNC.espace_tampon_solarise]:
		"Espace tampon solarisé",
	[models.enveloppe.localNonChauffe.TYPES_LNC.comble_fortement_ventile]:
		"Comble fortement solarisé",
	[models.enveloppe.localNonChauffe.TYPES_LNC.comble_faiblement_ventile]:
		"Comble faiblement solarisé",
	[models.enveloppe.localNonChauffe.TYPES_LNC.comble_tres_faiblement_ventile]:
		"Comble très faiblement ventilé",
	[models.enveloppe.localNonChauffe.TYPES_LNC
		.circulation_sans_ouverture_exterieure]:
		"Circulation sans ouverture extérieur",
	[models.enveloppe.localNonChauffe.TYPES_LNC
		.circulation_avec_ouverture_exterieure]:
		"Circulation avec ouverture extérieur",
	[models.enveloppe.localNonChauffe.TYPES_LNC
		.circulation_avec_bouche_ou_gaine_desenfumage_ouverte]:
		"Circulation avec bouche ou gaine de desenfumage ouverte",
	[models.enveloppe.localNonChauffe.TYPES_LNC
		.hall_entree_avec_fermeture_automatique]:
		"Hall d'entrée avec fermeture automatique",
	[models.enveloppe.localNonChauffe.TYPES_LNC
		.hall_entree_sans_fermeture_automatique]:
		"Hall d'entrée sans fermeture automatique",
	[models.enveloppe.localNonChauffe.TYPES_LNC.garage_collectif]:
		"Garage collectif",
	[models.enveloppe.localNonChauffe.TYPES_LNC.autres]: "Autres",
};

export class Enum extends HTMLElement {
	static observedAttributes = ["name", "value"];

	connectedCallback() {
		this.render();
	}
	attributeChangedCallback() {
		this.render();
	}

	private render() {
		const name = this.getAttribute("name");
		const value = this.getAttribute("value");

		if (name === null || value === null) {
			return;
		}

		const keyMap = MAP[name];

		if (!keyMap) {
			console.warn(`Enum component: no mapping found for key "${name}"`);
			return;
		}
		if (value === "null" || value === "undefined" || value === "") {
			this.textContent = "-";
			return;
		}
		const valueMap = keyMap[value];
		if (!valueMap) {
			console.warn(
				`Enum component: no mapping found for value "${value}" in key "${name}"`,
			);
			return;
		}
		this.textContent = valueMap;
	}
}

define("enum", Enum);
