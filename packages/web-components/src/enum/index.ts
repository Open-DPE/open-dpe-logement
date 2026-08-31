import * as models from "@open-dpe-logement/models";
import { define } from "../shared/components.js";

const MAP: Record<string, Record<string, string>> = {};

MAP["scenario"] = {
	[models.common.Scenario.enum.conventionnel]: "Scénario conventionnel",
	[models.common.Scenario.enum.depensier]: "Scénario dépensier",
};

MAP["usage"] = {
	[models.common.Usage.enum.chauffage]: "Chauffage",
	[models.common.Usage.enum.ecs]: "Eau chaude sanitaire",
	[models.common.Usage.enum.refroidissement]: "Refroidissement",
	[models.common.Usage.enum.eclairage]: "Éclairage",
	[models.common.Usage.enum.auxiliaire]: "Auxiliaire",
};

MAP["type-batiment"] = {
	[models.batiment.TypeBatiment.enum.maison]: "Maison individuelle",
	[models.batiment.TypeBatiment.enum.immeuble]: "Immeuble collectif",
};

MAP["zone-climatique"] = {
	[models.batiment.ZoneClimatique.enum.H1a]: "H1a",
	[models.batiment.ZoneClimatique.enum.H1b]: "H1b",
	[models.batiment.ZoneClimatique.enum.H1c]: "H1c",
	[models.batiment.ZoneClimatique.enum.H2a]: "H2a",
	[models.batiment.ZoneClimatique.enum.H2b]: "H2b",
	[models.batiment.ZoneClimatique.enum.H2c]: "H2c",
	[models.batiment.ZoneClimatique.enum.H2d]: "H2d",
	[models.batiment.ZoneClimatique.enum.H3]: "H3",
};

MAP["energie"] = {
	[models.common.Energie.enum.electricite]: "Électricité",
	[models.common.Energie.enum.electricite_renouvelable]:
		"Électricité d'origine renouvelable",
	[models.common.Energie.enum.gaz_naturel]: "Gaz naturel",
	[models.common.Energie.enum.gpl]: "GPL",
	[models.common.Energie.enum.fioul]: "Fioul",
	[models.common.Energie.enum.charbon]: "Charbon",
	[models.common.Energie.enum.bois_buche]: "Bois - Bûche",
	[models.common.Energie.enum.bois_plaquette]: "Bois - Plaquette",
	[models.common.Energie.enum.bois_granule]: "Bois - Granule",
	[models.common.Energie.enum.reseau_chaleur]: "Réseau de chaleur",
	[models.common.Energie.enum.reseau_froid]: "Réseau de froid",
};

MAP["orientation"] = {
	[models.common.Orientation.enum.nord]: "Nord",
	[models.common.Orientation.enum.nord_est]: "Nord-Est",
	[models.common.Orientation.enum.est]: "Est",
	[models.common.Orientation.enum.sud_est]: "Sud-Est",
	[models.common.Orientation.enum.sud]: "Sud",
	[models.common.Orientation.enum.sud_ouest]: "Sud-Ouest",
	[models.common.Orientation.enum.ouest]: "Ouest",
	[models.common.Orientation.enum.nord_ouest]: "Nord-Ouest",
};

MAP["orientation-cardinale"] = {
	[models.common.OrientationCardinale.enum.nord]: "Nord",
	[models.common.OrientationCardinale.enum.sud]: "Sud",
	[models.common.OrientationCardinale.enum.est]: "Est",
	[models.common.OrientationCardinale.enum.ouest]: "Ouest",
};

MAP["etiquette"] = {
	[models.diagnostic.Etiquette.enum.A]: "A",
	[models.diagnostic.Etiquette.enum.B]: "B",
	[models.diagnostic.Etiquette.enum.C]: "C",
	[models.diagnostic.Etiquette.enum.D]: "D",
	[models.diagnostic.Etiquette.enum.E]: "E",
	[models.diagnostic.Etiquette.enum.F]: "F",
	[models.diagnostic.Etiquette.enum.G]: "G",
};

MAP["mois"] = {
	[models.common.Mois.enum.Janvier]: "Janvier",
	[models.common.Mois.enum.Février]: "Février",
	[models.common.Mois.enum.Mars]: "Mars",
	[models.common.Mois.enum.Avril]: "Avril",
	[models.common.Mois.enum.Mai]: "Mai",
	[models.common.Mois.enum.Juin]: "Juin",
	[models.common.Mois.enum.Juillet]: "Juillet",
	[models.common.Mois.enum.Août]: "Août",
	[models.common.Mois.enum.Septembre]: "Septembre",
	[models.common.Mois.enum.Octobre]: "Octobre",
	[models.common.Mois.enum.Novembre]: "Novembre",
	[models.common.Mois.enum.Décembre]: "Décembre",
};

MAP["type-diagnostic"] = {
	[models.diagnostic.TypeDiagnostic.enum.batiment]: "Bâtiment",
	[models.diagnostic.TypeDiagnostic.enum.logement]: "Logement",
};

MAP["confort-ete"] = {
	[models.diagnostic.ConfortEte.enum.bon]: "Bon",
	[models.diagnostic.ConfortEte.enum.moyen]: "Moyen",
	[models.diagnostic.ConfortEte.enum.insuffisant]: "Insuffisant",
};

// --- Chauffage ---

MAP["chauffage.installation.type"] = {
	[models.chauffage.TypeChauffage.enum.central]: "Chauffage central",
	[models.chauffage.TypeChauffage.enum.divise]: "Chauffage divisé",
};

MAP["chauffage.systeme.type"] = {
	[models.chauffage.TypeChauffage.enum.central]: "Chauffage central",
	[models.chauffage.TypeChauffage.enum.divise]: "Chauffage divisé",
};

MAP["chauffage.type-generateur"] = {
	[models.chauffage.generateur.TypeGenerateur.enum.chaudiere]: "Chaudière",
	[models.chauffage.generateur.TypeGenerateur.enum.convecteur_bi_jonction]:
		"Convecteur bi-jonction",
	[models.chauffage.generateur.TypeGenerateur.enum.convecteur_electrique]:
		"Convecteur électrique",
	[models.chauffage.generateur.TypeGenerateur.enum
		.panneau_rayonnant_electrique]: "Panneau rayonnant électrique",
	[models.chauffage.generateur.TypeGenerateur.enum
		.plafond_rayonnant_electrique]: "Plafond rayonnant électrique",
	[models.chauffage.generateur.TypeGenerateur.enum
		.plancher_rayonnant_electrique]: "Plancher rayonnant électrique",
	[models.chauffage.generateur.TypeGenerateur.enum.radiateur_electrique]:
		"Radiateur électrique",
	[models.chauffage.generateur.TypeGenerateur.enum
		.radiateur_electrique_accumulation]: "Radiateur électrique à accumulation",
	[models.chauffage.generateur.TypeGenerateur.enum.generateur_air_chaud]:
		"Générateur d'air chaud",
	[models.chauffage.generateur.TypeGenerateur.enum.pac_air_air]:
		"Pompe à chaleur air / air",
	[models.chauffage.generateur.TypeGenerateur.enum.pac_air_eau]:
		"Pompe à chaleur air / eau",
	[models.chauffage.generateur.TypeGenerateur.enum.pac_eau_eau]:
		"Pompe à chaleur eau / eau",
	[models.chauffage.generateur.TypeGenerateur.enum.pac_eau_glycolee_eau]:
		"Pompe à chaleur eau glycolée / eau",
	[models.chauffage.generateur.TypeGenerateur.enum.pac_geothermique]:
		"Pompe à chaleur géothermique",
	[models.chauffage.generateur.TypeGenerateur.enum.cuisiniere]: "Cuisinière",
	[models.chauffage.generateur.TypeGenerateur.enum.foyer_ferme]: "Foyer fermé",
	[models.chauffage.generateur.TypeGenerateur.enum.insert]: "Insert",
	[models.chauffage.generateur.TypeGenerateur.enum.poele]: "Poêle",
	[models.chauffage.generateur.TypeGenerateur.enum.poele_bouilleur]:
		"Poêle boulleur",
	[models.chauffage.generateur.TypeGenerateur.enum.radiateur_gaz]:
		"Radiateur gaz",
	[models.chauffage.generateur.TypeGenerateur.enum.reseau_chaleur]:
		"Réseau de chaleur",
};

MAP["chauffage.mode-combustion"] = {
	[models.chauffage.generateur.ModeCombustion.enum.standard]: "Standard",
	[models.chauffage.generateur.ModeCombustion.enum.basse_temperature]:
		"Basse température",
	[models.chauffage.generateur.ModeCombustion.enum.condensation]:
		"Condensation",
};

MAP["chauffage.position-chaudiere"] = {
	[models.chauffage.generateur.PositionChaudiere.enum.chaudiere_murale]:
		"Chaudière murale",
	[models.chauffage.generateur.PositionChaudiere.enum.chaudiere_sol]:
		"Chaudière au sol",
};

MAP["chauffage.label-generateur"] = {
	[models.chauffage.generateur.LabelGenerateur.enum.flamme_verte]:
		"Flamme verte",
	[models.chauffage.generateur.LabelGenerateur.enum.nf_performance]:
		"NF Performance",
};

MAP["chauffage.type-distribution"] = {
	[models.chauffage.systeme.TypeDistribution.enum.hydraulique]:
		"Distribution hydraulique",
	[models.chauffage.systeme.TypeDistribution.enum.aeraulique]:
		"Distribution aeraulique",
};

MAP["chauffage.temperature-distribution"] = {
	[models.chauffage.emetteur.TemperatureDistribution.enum.basse]:
		"Basse température",
	[models.chauffage.emetteur.TemperatureDistribution.enum.moyenne]:
		"Moyenne température",
	[models.chauffage.emetteur.TemperatureDistribution.enum.haute]:
		"Haute température",
};

MAP["chauffage.type-emetteur"] = {
	[models.chauffage.emetteur.TypeEmetteur.enum.plancher_chauffant]:
		"Plancher chauffant",
	[models.chauffage.emetteur.TypeEmetteur.enum.plafond_chauffant]:
		"Plafond chauffant",
	[models.chauffage.emetteur.TypeEmetteur.enum.radiateur_monotube]:
		"Radiateur monotube",
	[models.chauffage.emetteur.TypeEmetteur.enum.radiateur_bitube]:
		"Radiateur bitube",
	[models.chauffage.emetteur.TypeEmetteur.enum.radiateur]: "Radiateur",
	[models.chauffage.emetteur.TypeEmetteur.enum.autres]: "Autres",
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
	[models.chauffage.installation.TypeProgrammation.enum.absent]:
		"Absence de programmation",
	[models.chauffage.installation.TypeProgrammation.enum
		.central_sans_minimum_temperature]:
		"Programmation centrale sans minimum de température",
	[models.chauffage.installation.TypeProgrammation.enum
		.central_avec_minimum_temperature]:
		"Programmation centrale avec minimum de température",
	[models.chauffage.installation.TypeProgrammation.enum
		.central_collectif_sans_detection_presence]:
		"Programmation centrale collective",
	[models.chauffage.installation.TypeProgrammation.enum
		.central_collectif_avec_detection_presence]:
		"Programmation centrale collective avec détection de présence",
	[models.chauffage.installation.TypeProgrammation.enum
		.terminal_avec_minimum_temperature]:
		"Programmation par pièce avec minimum de température",
	[models.chauffage.installation.TypeProgrammation.enum
		.terminal_avec_minimum_temperature_detection_presence]:
		"Programmation par pièce avec minimum de température et détection de présence",
};

MAP["chauffage.usage-solaire"] = {
	[models.chauffage.installation.UsageSolaire.enum.chauffage]: "Chauffage",
	[models.chauffage.installation.UsageSolaire.enum.chauffage_ecs]:
		"Chauffage + ECS",
};

// --- ECS ---

MAP["ecs:type-generateur"] = {
	[models.ecs.generateur.TypeGenerateur.enum.chauffe_eau]: "Chauffe eau",
	[models.ecs.generateur.TypeGenerateur.enum.chaudiere]: "Chaudière",
	[models.ecs.generateur.TypeGenerateur.enum.cet_air_ambiant]:
		"Chauffe eau thermodynamique sur air ambiant",
	[models.ecs.generateur.TypeGenerateur.enum.cet_air_exterieur]:
		"Chauffe eau thermodynamique sur air extérieur",
	[models.ecs.generateur.TypeGenerateur.enum.cet_air_extrait]:
		"Chauffe eau thermodynamique sur air extrait",
	[models.ecs.generateur.TypeGenerateur.enum.pac_air_eau]:
		"Pompe à chaleur air / eau",
	[models.ecs.generateur.TypeGenerateur.enum.pac_eau_eau]:
		"Pompe à chaleur eau / eau",
	[models.ecs.generateur.TypeGenerateur.enum.pac_eau_glycolee_eau]:
		"Pompe à chaleur eau glycolée / eau",
	[models.ecs.generateur.TypeGenerateur.enum.pac_geothermique]:
		"Pompe à chaleur géothermique",
	[models.ecs.generateur.TypeGenerateur.enum.poele_bouilleur]:
		"Poêle bouilleur",
	[models.ecs.generateur.TypeGenerateur.enum.reseau_chaleur]:
		"Réseau de chaleur",
};

MAP["ecs:mode-combustion"] = {
	[models.ecs.generateur.ModeCombustion.enum.standard]: "Standard",
	[models.ecs.generateur.ModeCombustion.enum.basse_temperature]:
		"Basse température",
	[models.ecs.generateur.ModeCombustion.enum.condensation]: "Condensation",
};

MAP["ecs:position-chauffe-eau"] = {
	[models.ecs.generateur.PositionChauffeEau.enum.chauffe_eau_vertical]:
		"Chauffe eau vertical",
	[models.ecs.generateur.PositionChauffeEau.enum.chauffe_eau_horizontal]:
		"Chauffe eau horizontal",
};

MAP["ecs:label-generateur"] = {
	[models.ecs.generateur.LabelGenerateur.enum.ne_performance_a]:
		"NE Performance - A",
	[models.ecs.generateur.LabelGenerateur.enum.ne_performance_b]:
		"NE Performance - B",
	[models.ecs.generateur.LabelGenerateur.enum.ne_performance_c]:
		"NE Performance - C",
};

MAP["ecs:bouclage-reseau"] = {
	[models.ecs.systeme.BouclageReseau.enum.non_boucle]: "Réseau non bouclé",
	[models.ecs.systeme.BouclageReseau.enum.boucle]: "Réseau bouclé",
	[models.ecs.systeme.BouclageReseau.enum.trace]: "Réseau tracé",
};

MAP["ecs:type-stockage"] = {
	[models.ecs.generateur.TypeStockage.enum.integre]:
		"Stockage intégré à la production",
	[models.ecs.generateur.TypeStockage.enum.independant]:
		"Stockage indépendant de la production",
};

MAP["ecs:usage-solaire"] = {
	[models.ecs.installation.UsageSolaire.enum.ecs]: "ECS seule",
	[models.ecs.installation.UsageSolaire.enum.chauffage_ecs]: "Chauffage + ECS",
};

// --- Refroidissement ---

MAP["refroidissement:type-generateur"] = {
	[models.refroidissement.generateur.TypeGenerateur.enum.pac_air_air]:
		"PAC air/air",
	[models.refroidissement.generateur.TypeGenerateur.enum.pac_air_eau]:
		"PAC air/eau",
	[models.refroidissement.generateur.TypeGenerateur.enum.pac_eau_eau]:
		"PAC eau/eau",
	[models.refroidissement.generateur.TypeGenerateur.enum.pac_eau_glycolee_eau]:
		"PAC eau glycolée/eau",
	[models.refroidissement.generateur.TypeGenerateur.enum.pac_geothermique]:
		"PAC géothermique",
	[models.refroidissement.generateur.TypeGenerateur.enum
		.autre_systeme_thermodynamique]: "Autres systèmes thermodynamique",
	[models.refroidissement.generateur.TypeGenerateur.enum.reseau_froid]:
		"Réseau de froid",
	[models.refroidissement.generateur.TypeGenerateur.enum.autre]:
		"Autres systèmes",
};

// --- Ventilation ---

MAP["ventilation:type"] = {
	[models.ventilation.installation.TypeVentilation.enum
		.ventilation_ouverture_fenetres]: "Ventilation par ouverture des fenêtres",
	[models.ventilation.installation.TypeVentilation.enum
		.ventilation_entrees_air_hautes_basses]:
		"Ventilation par entrées d'air hautes et basses",
	[models.ventilation.installation.TypeVentilation.enum
		.vmc_simple_flux_autoreglable]: "VMC Simple flux autoréglable",
	[models.ventilation.installation.TypeVentilation.enum
		.vmc_simple_flux_hygroreglable_a]: "VMC Simple flux hygroréglable - Type A",
	[models.ventilation.installation.TypeVentilation.enum
		.vmc_simple_flux_hygroreglable_gaz]: "VMC Simple flux hygroréglable Gaz",
	[models.ventilation.installation.TypeVentilation.enum
		.vmc_simple_flux_hygroreglable_b]: "VMC Simple flux hygroréglable - Type B",
	[models.ventilation.installation.TypeVentilation.enum
		.vmc_basse_pression_autoreglable]: "VMC Basse pression autoréglable",
	[models.ventilation.installation.TypeVentilation.enum
		.vmc_basse_pression_hygroreglable_a]:
		"VMC Basse préssion hygroréglable - Type A",
	[models.ventilation.installation.TypeVentilation.enum
		.vmc_basse_pression_hygroreglable_b]:
		"VMC Basse pression hygroréglable - Type B",
	[models.ventilation.installation.TypeVentilation.enum.vmc_double_flux]:
		"VMC Double flux",
	[models.ventilation.installation.TypeVentilation.enum
		.ventilation_naturelle_conduit]: "Ventilation naturelle par conduit",
	[models.ventilation.installation.TypeVentilation.enum.ventilation_hybride]:
		"Ventilation hybride",
	[models.ventilation.installation.TypeVentilation.enum
		.ventilation_hybride_entrees_air_hygroreglables]:
		"Ventilation hybride avec entrées d'air hygroréglables",
	[models.ventilation.installation.TypeVentilation.enum
		.ventilation_mecanique_conduit]:
		"Ventilation mécanique sur conduit existant",
	[models.ventilation.installation.TypeVentilation.enum
		.ventilation_naturelle_conduit_entrees_air_hygroreglables]:
		"Ventilation naturelle par conduit avec entrées d'air hygroéglables",
	[models.ventilation.installation.TypeVentilation.enum.puit_climatique]:
		"Puit climatique",
	[models.ventilation.installation.TypeVentilation.enum
		.ventilation_mecanique_insufflation]:
		"Ventilation mécanique par insufflation",
};

// --- Bâtiment ---

MAP["batiment:position-appartement"] = {
	[models.batiment.appartement.PositionAppartement.enum.rdc]:
		"Appartement en rez-de-chaussée",
	[models.batiment.appartement.PositionAppartement.enum.etage_intermediaire]:
		"Appartement en étage intermédiaire",
	[models.batiment.appartement.PositionAppartement.enum.dernier_etage]:
		"Appartement au dernier étage",
};

MAP["batiment:typologie-appartement"] = {
	[models.batiment.appartement.TypologieAppartement.enum.T1]: "T1",
	[models.batiment.appartement.TypologieAppartement.enum.T2]: "T2",
	[models.batiment.appartement.TypologieAppartement.enum.T3]: "T3",
	[models.batiment.appartement.TypologieAppartement.enum.T4]: "T4",
	[models.batiment.appartement.TypologieAppartement.enum.T5]: "T5",
	[models.batiment.appartement.TypologieAppartement.enum.T6]: "T6",
	[models.batiment.appartement.TypologieAppartement.enum.T7]: "T7 et plus",
};

// --- Production ---

MAP["production:usage-electricite"] = {
	[models.production.UsageElectricite.enum.chauffage]: "Chauffage",
	[models.production.UsageElectricite.enum.refroidissement]: "Refroidissement",
	[models.production.UsageElectricite.enum.ecs]: "Eau chaude sanitaire",
	[models.production.UsageElectricite.enum.eclairage]: "Eclairage",
	[models.production.UsageElectricite.enum.auxiliaires_ventilation]:
		"Auxiliaires de ventilation",
	[models.production.UsageElectricite.enum.auxiliaires_distribution]:
		"Auxiliaires de distribution",
	[models.production.UsageElectricite.enum.autres]: "Autres",
};

// --- Enveloppe ---

MAP["enveloppe:inertie"] = {
	[models.enveloppe.common.Inertie.enum.legere]: "Légère",
	[models.enveloppe.common.Inertie.enum.moyenne]: "Moyenne",
	[models.enveloppe.common.Inertie.enum.lourde]: "Lourde",
	[models.enveloppe.common.Inertie.enum.tres_lourde]: "Très lourde",
};

MAP["enveloppe:exposition"] = {
	[models.enveloppe.Exposition.enum.simple]: "Exposition simple",
	[models.enveloppe.Exposition.enum.multiple]: "Exposition multiple",
};

MAP["enveloppe:orientation-paroi"] = {
	...MAP["orientation-cardinale"],
	horizontale: "Paroi horizontale",
};

MAP["enveloppe:paroi:mitoyennete"] = {
	[models.enveloppe.common.Mitoyennete.enum.exterieur]: "Extérieur",
	[models.enveloppe.common.Mitoyennete.enum.enterre]: "Enterré",
	[models.enveloppe.common.Mitoyennete.enum.vide_sanitaire]: "Vide sanitaire",
	[models.enveloppe.common.Mitoyennete.enum.terre_plein]: "Terre plein",
	[models.enveloppe.common.Mitoyennete.enum.sous_sol_non_chauffe]:
		"Sous-sol non chauffé",
	[models.enveloppe.common.Mitoyennete.enum.local_non_chauffe]:
		"Local non chauffé",
	[models.enveloppe.common.Mitoyennete.enum.local_non_residentiel]:
		"Local non résidentiel",
	[models.enveloppe.common.Mitoyennete.enum.local_residentiel]:
		"Local résidentiel",
	[models.enveloppe.common.Mitoyennete.enum.local_non_accessible]:
		"Local non accessible",
};

MAP["enveloppe:paroi:inertie"] = {
	[models.enveloppe.common.InertieParoi.enum.legere]: "Inertie légère",
	[models.enveloppe.common.InertieParoi.enum.lourde]: "Inertie lourde",
};

MAP["enveloppe:paroi:type-isolation"] = {
	[models.enveloppe.common.TypeIsolation.enum.iti]: "ITI",
	[models.enveloppe.common.TypeIsolation.enum.ite]: "ITE",
	[models.enveloppe.common.TypeIsolation.enum.itr]: "ITR",
	[models.enveloppe.common.TypeIsolation.enum.iti_ite]: "ITI + ITE",
	[models.enveloppe.common.TypeIsolation.enum.itr_iti]: "ITR + ITI",
	[models.enveloppe.common.TypeIsolation.enum.itr_ite]: "ITR + ITE",
	[models.enveloppe.common.TypeIsolation.enum.itr_iti_ite]: "ITR + ITI + ITE",
};

MAP["enveloppe:paroi:type-pose"] = {
	[models.enveloppe.common.TypePose.enum.nu_exterieur]: "Nu extérieur",
	[models.enveloppe.common.TypePose.enum.nu_interieur]: "Nu intérieur",
	[models.enveloppe.common.TypePose.enum.tunnel]: "Tunnel",
};

MAP["enveloppe:mur:type"] = {
	[models.enveloppe.mur.MateriauMur.enum.pierre_moellons]: "Pierre ou moellons",
	[models.enveloppe.mur.MateriauMur.enum.pierre_moellons_avec_remplissage]:
		"Pierre ou moellons avec remplissage",
	[models.enveloppe.mur.MateriauMur.enum.pise_ou_beton_terre]:
		"Pise ou béton terre",
	[models.enveloppe.mur.MateriauMur.enum.pan_bois_sans_remplissage]:
		"Pan bois sans remplissage",
	[models.enveloppe.mur.MateriauMur.enum.pan_bois_avec_remplissage]:
		"Pan bois avec remplissage",
	[models.enveloppe.mur.MateriauMur.enum.bois_rondin]: "Bois rondin",
	[models.enveloppe.mur.MateriauMur.enum.brique_pleine_simple]:
		"Brique pleine simple",
	[models.enveloppe.mur.MateriauMur.enum.brique_pleine_double_avec_lame_air]:
		"Brique pleine double avec lame d'air",
	[models.enveloppe.mur.MateriauMur.enum.brique_creuse]: "Brique creuse",
	[models.enveloppe.mur.MateriauMur.enum.bloc_beton_plein]: "Bloc béton plein",
	[models.enveloppe.mur.MateriauMur.enum.bloc_beton_creux]: "Bloc béton creux",
	[models.enveloppe.mur.MateriauMur.enum.beton_banche]: "Béton banché",
	[models.enveloppe.mur.MateriauMur.enum.beton_machefer]: "Béton machefer",
	[models.enveloppe.mur.MateriauMur.enum.brique_terre_cuite_alveolaire]:
		"Brique terre cuite alvéolaire",
	[models.enveloppe.mur.MateriauMur.enum
		.sandwich_beton_isolant_beton_sans_isolation_rapportee]:
		"Mur sandwich béton isolant et béton sans isolation rapportée",
	[models.enveloppe.mur.MateriauMur.enum.cloison_platre]: "Cloison de plâtre",
	[models.enveloppe.mur.MateriauMur.enum.ossature_bois_sans_remplissage]:
		"Ossature bois sans remplissage",
	[models.enveloppe.mur.MateriauMur.enum
		.ossature_bois_avec_remplissage_tout_venant]:
		"Ossature bois avec remplissage tout venant",
	[models.enveloppe.mur.MateriauMur.enum
		.ossature_bois_avec_remplissage_isolant]:
		"Ossature bois avec remplissage isolant",
	[models.enveloppe.mur.MateriauMur.enum.beton_cellulaire]: "Béton cellulaire",
};

MAP["enveloppe:mur:type-doublage"] = {
	[models.enveloppe.mur.TypeDoublage.enum.sans_doublage]: "Sans doublage",
	[models.enveloppe.mur.TypeDoublage.enum.indetermine]:
		"Doublage rapporté de nature indéterminé",
	[models.enveloppe.mur.TypeDoublage.enum.lame_air_inferieur_15mm]:
		"Doublage rapporté avec lame d'air inférieure à 15mm",
	[models.enveloppe.mur.TypeDoublage.enum.lame_air_superieur_15mm]:
		"Doublage rapporté avec lame d'air supérieure à 15mm",
	[models.enveloppe.mur.TypeDoublage.enum.materiaux_connu]:
		"Doublage rapporté avec un matériau de doublage connu (plâtre, brique, bois)",
};

MAP["enveloppe:plancher-bas:type"] = {
	[models.enveloppe.plancherBas.TypePlancherBas.enum
		.plancher_avec_ou_sans_remplissage]: "Plancher avec ou sans remplissage",
	[models.enveloppe.plancherBas.TypePlancherBas.enum
		.plancher_entre_solives_metalliques]: "Plancher entre solives metalliques",
	[models.enveloppe.plancherBas.TypePlancherBas.enum
		.plancher_entre_solives_bois]: "Plancher entre solives bois",
	[models.enveloppe.plancherBas.TypePlancherBas.enum
		.plancher_bois_sur_solives_metalliques]:
		"Plancher bois sur solives metalliques",
	[models.enveloppe.plancherBas.TypePlancherBas.enum.bardeaux_et_remplissage]:
		"Plancher et remplissage",
	[models.enveloppe.plancherBas.TypePlancherBas.enum
		.voutains_sur_solives_metalliques]: "Plancher sur solives metalliques",
	[models.enveloppe.plancherBas.TypePlancherBas.enum
		.voutains_briques_ou_moellons]: "Plancher briques ou moellons",
	[models.enveloppe.plancherBas.TypePlancherBas.enum.dalle_beton]:
		"Plancher beton",
	[models.enveloppe.plancherBas.TypePlancherBas.enum
		.plancher_bois_sur_solives_bois]: "Plancher bois sur solives bois",
	[models.enveloppe.plancherBas.TypePlancherBas.enum
		.plancher_lourd_type_entrevous_terre_cuite_ou_poutrelles_beton]:
		"Plancher lourd type entrevous terre cuite ou poutrelles beton",
	[models.enveloppe.plancherBas.TypePlancherBas.enum
		.plancher_entrevous_isolant]: "Plancher entrevous isolant",
};

MAP["enveloppe:plancher-haut:configuration"] = {
	[models.enveloppe.plancherHaut.ConfigurationPlancherHaut.enum.plancher]:
		"Plancher",
	[models.enveloppe.plancherHaut.ConfigurationPlancherHaut.enum.rampants]:
		"Rampants",
	[models.enveloppe.plancherHaut.ConfigurationPlancherHaut.enum.terrasse]:
		"Terrasse",
};

MAP["enveloppe:plancher-haut:type"] = {
	[models.enveloppe.plancherHaut.TypePlancherHaut.enum
		.plafond_avec_ou_sans_remplissage]: "Plafond avec ou sans remplissage",
	[models.enveloppe.plancherHaut.TypePlancherHaut.enum
		.plafond_entre_solives_metalliques]: "Plafond entre solives metalliques",
	[models.enveloppe.plancherHaut.TypePlancherHaut.enum
		.plafond_entre_solives_bois]: "Plafond entre solives bois",
	[models.enveloppe.plancherHaut.TypePlancherHaut.enum
		.plafond_bois_sur_solives_metalliques]:
		"Plafond bois sur solives metalliques",
	[models.enveloppe.plancherHaut.TypePlancherHaut.enum
		.plafond_bois_sous_solives_metalliques]:
		"Plafond bois sous solives metalliques",
	[models.enveloppe.plancherHaut.TypePlancherHaut.enum.bardeaux_et_remplissage]:
		"Bardeaux et remplissage",
	[models.enveloppe.plancherHaut.TypePlancherHaut.enum
		.plafond_bois_sur_solives_bois]: "Plafond bois sur solives bois",
	[models.enveloppe.plancherHaut.TypePlancherHaut.enum
		.plafond_bois_sous_solives_bois]: "Plafond bois sous solives bois",
	[models.enveloppe.plancherHaut.TypePlancherHaut.enum.dalle_beton]:
		"Dalle beton",
	[models.enveloppe.plancherHaut.TypePlancherHaut.enum.plafond_lourd]:
		"Plafond lourd",
	[models.enveloppe.plancherHaut.TypePlancherHaut.enum
		.combles_amenages_sous_rampant]: "Combles amenages sous rampant",
	[models.enveloppe.plancherHaut.TypePlancherHaut.enum.toiture_chaume]:
		"Toiture chaume",
	[models.enveloppe.plancherHaut.TypePlancherHaut.enum.plafond_patre]:
		"Plafond patre",
	[models.enveloppe.plancherHaut.TypePlancherHaut.enum.bac_acier]: "Bac acier",
};

MAP["enveloppe:pont-thermique:type"] = {
	[models.enveloppe.pontThermique.TypeLiaison.enum.plancher_bas_mur]:
		"Plancher bas / Mur",
	[models.enveloppe.pontThermique.TypeLiaison.enum.plancher_haut_mur]:
		"Plancher haut / Mur",
	[models.enveloppe.pontThermique.TypeLiaison.enum.refend_mur]: "Refend / Mur",
	[models.enveloppe.pontThermique.TypeLiaison.enum.plancher_intermediaire_mur]:
		"Plancher intermédiaire / Mur",
	[models.enveloppe.pontThermique.TypeLiaison.enum.baie_mur]: "Baie / Mur",
	[models.enveloppe.pontThermique.TypeLiaison.enum.porte_mur]: "Porte / Mur",
};

MAP["enveloppe:baie:type"] = {
	[models.enveloppe.baie.TypeBaie.enum.brique_verre_pleine]:
		"Brique de verre pleine",
	[models.enveloppe.baie.TypeBaie.enum.brique_verre_creuse]:
		"Brique de verre creuse",
	[models.enveloppe.baie.TypeBaie.enum.polycarbonate]: "Polycarbonate",
	[models.enveloppe.baie.TypeBaie.enum.fenetre_battante]: "Fenêtre battante",
	[models.enveloppe.baie.TypeBaie.enum.fenetre_coulissante]:
		"Fenêtre coulissante",
	[models.enveloppe.baie.TypeBaie.enum.porte_fenetre_coulissante]:
		"Porte fenêtre coulissante",
	[models.enveloppe.baie.TypeBaie.enum.porte_fenetre_battante]:
		"Porte fenêtre battante",
};

MAP["enveloppe:baie:materiau"] = {
	[models.enveloppe.baie.MateriauBaie.enum.pvc]: "PVC",
	[models.enveloppe.baie.MateriauBaie.enum.bois]: "Bois",
	[models.enveloppe.baie.MateriauBaie.enum.bois_metal]: "Bois-métal",
	[models.enveloppe.baie.MateriauBaie.enum.metal]: "Métal",
};

MAP["enveloppe:baie:type-vitrage"] = {
	[models.enveloppe.baie.TypeVitrage.enum.brique_verre]: "Brique de verre",
	[models.enveloppe.baie.TypeVitrage.enum.polycarbonate]: "Polycarbonate",
	[models.enveloppe.baie.TypeVitrage.enum.simple_vitrage]: "Simple vitrage",
	[models.enveloppe.baie.TypeVitrage.enum.double_vitrage]: "Double vitrage",
	[models.enveloppe.baie.TypeVitrage.enum.double_vitrage_fe]:
		"Double vitrage à faite emissivité",
	[models.enveloppe.baie.TypeVitrage.enum.triple_vitrage]: "Triple vitrage",
	[models.enveloppe.baie.TypeVitrage.enum.triple_vitrage_fe]:
		"Triple vitrage à faible emissivité",
};

MAP["enveloppe:baie:nature-lame-air"] = {
	[models.enveloppe.baie.NatureLameAir.enum.air]: "Air",
	[models.enveloppe.baie.NatureLameAir.enum.argon]: "Argon",
	[models.enveloppe.baie.NatureLameAir.enum.krypton]: "Krypton",
};

MAP["enveloppe:baie:type-survitrage"] = {
	[models.enveloppe.baie.TypeSurvitrage.enum.survitrage_simple]:
		"Survitrage simple",
	[models.enveloppe.baie.TypeSurvitrage.enum.survitrage_fe]:
		"Survitrage à faible emissivité",
};

MAP["enveloppe:baie:type-fermeture"] = {
	[models.enveloppe.baie.TypeFermeture.enum.sans_fermeture]: "Sans fermeture",
	[models.enveloppe.baie.TypeFermeture.enum.jalousie_accordeon]:
		"Jalousie et accordéon",
	[models.enveloppe.baie.TypeFermeture.enum.fermeture_lames_orientables]:
		"Fermeture à lames orientables",
	[models.enveloppe.baie.TypeFermeture.enum.venitiens_exterieurs_metal]:
		"Venitiens extérieurs en métal",
	[models.enveloppe.baie.TypeFermeture.enum.volet_battant_avec_ajours_fixes]:
		"Volet battant avec ajours fixes",
	[models.enveloppe.baie.TypeFermeture.enum.persiennes_avec_ajours_fixes]:
		"Persiennes avec ajours fixes",
	[models.enveloppe.baie.TypeFermeture.enum.fermeture_sans_ajours]:
		"Femeture sans ajours",
	[models.enveloppe.baie.TypeFermeture.enum.volets_roulants_aluminium]:
		"Volets roulants en aluminium",
	[models.enveloppe.baie.TypeFermeture.enum
		.volets_roulants_pvc_bois_epaisseur_lte_12mm]:
		"Volets roulants PVC ou bois - Epaisseur intérieure ou égale à 12mm",
	[models.enveloppe.baie.TypeFermeture.enum
		.volets_roulants_pvc_bois_epaisseur_gt_12mm]:
		"Volets roulants PVC ou bois - Epaisseur supérieure à 12mm",
	[models.enveloppe.baie.TypeFermeture.enum
		.persienne_coulissante_epaisseur_lte_22mm]:
		"Persienne coulissante - Epaisseur intérieure ou égale à 22mm",
	[models.enveloppe.baie.TypeFermeture.enum
		.persienne_coulissante_epaisseur_gt_22mm]:
		"Persienne coulissante - Epaisseur supérieure à 22mm",
	[models.enveloppe.baie.TypeFermeture.enum
		.volet_battant_pvc_bois_epaisseur_lte_22mm]:
		"Volet battant PVC ou bois - Epaisseur intérieure ou égale à 22mm",
	[models.enveloppe.baie.TypeFermeture.enum
		.volet_battant_pvc_bois_epaisseur_gt_22mm]:
		"Volet battant PVC ou bois - Epaisseur supérieure à 22mm",
	[models.enveloppe.baie.TypeFermeture.enum.fermeture_isolee_sans_ajours]:
		"Femeture isolée sans ajours",
};

MAP["enveloppe:porte:materiau"] = {
	[models.enveloppe.porte.MateriauPorte.enum.pvc]: "PVC",
	[models.enveloppe.porte.MateriauPorte.enum.bois]: "Bois",
	[models.enveloppe.porte.MateriauPorte.enum.metal]: "Métal",
};

MAP["enveloppe:porte:type-vitrage"] = {
	[models.enveloppe.porte.TypeVitrage.enum.simple_vitrage]: "Simple vitrage",
	[models.enveloppe.porte.TypeVitrage.enum.double_vitrage]: "Double vitrage",
	[models.enveloppe.porte.TypeVitrage.enum.triple_vitrage]: "Triple vitrage",
};

MAP["enveloppe:masque:type"] = {
	[models.enveloppe.masque.TypeMasque.enum.homogene]:
		"Masque lointain homogène",
	[models.enveloppe.masque.TypeMasque.enum.non_homogene]:
		"Masque lointain non homogène",
	[models.enveloppe.masque.TypeMasque.enum.fond_balcon]: "Fond de balcon",
	[models.enveloppe.masque.TypeMasque.enum.fond_et_flanc_loggias]:
		"Fond et flanc de loggias",
	[models.enveloppe.masque.TypeMasque.enum.balcon_ou_auvent]:
		"Balcon ou auvent",
	[models.enveloppe.masque.TypeMasque.enum.paroi_laterale_sans_obstacle_au_sud]:
		"Paroi latérale sans obstacle au sud",
	[models.enveloppe.masque.TypeMasque.enum.paroi_laterale_avec_obstacle_au_sud]:
		"Paroi latérale avec obstacle au sud",
};

MAP["enveloppe:masque:secteur"] = {
	[models.enveloppe.masque.SecteurMasque.enum.lateral]: "Secteur latéral",
	[models.enveloppe.masque.SecteurMasque.enum.lateral_sud]:
		"Secteur latéral vers le sud",
	[models.enveloppe.masque.SecteurMasque.enum.central]: "Secteur central",
	[models.enveloppe.masque.SecteurMasque.enum.central_sud]:
		"Secteur central vers le sud",
};

MAP["enveloppe:local-non-chauffe:type"] = {
	[models.enveloppe.localNonChauffe.TypeLocalNonChauffe.enum.garage]: "Garage",
	[models.enveloppe.localNonChauffe.TypeLocalNonChauffe.enum.cellier]:
		"Cellier",
	[models.enveloppe.localNonChauffe.TypeLocalNonChauffe.enum
		.espace_tampon_solarise]: "Espace tampon solarisé",
	[models.enveloppe.localNonChauffe.TypeLocalNonChauffe.enum
		.comble_fortement_ventile]: "Comble fortement solarisé",
	[models.enveloppe.localNonChauffe.TypeLocalNonChauffe.enum
		.comble_faiblement_ventile]: "Comble faiblement solarisé",
	[models.enveloppe.localNonChauffe.TypeLocalNonChauffe.enum
		.comble_tres_faiblement_ventile]: "Comble très faiblement ventilé",
	[models.enveloppe.localNonChauffe.TypeLocalNonChauffe.enum
		.circulation_sans_ouverture_exterieure]:
		"Circulation sans ouverture extérieur",
	[models.enveloppe.localNonChauffe.TypeLocalNonChauffe.enum
		.circulation_avec_ouverture_exterieure]:
		"Circulation avec ouverture extérieur",
	[models.enveloppe.localNonChauffe.TypeLocalNonChauffe.enum
		.circulation_avec_bouche_ou_gaine_desenfumage_ouverte]:
		"Circulation avec bouche ou gaine de desenfumage ouverte",
	[models.enveloppe.localNonChauffe.TypeLocalNonChauffe.enum
		.hall_entree_avec_fermeture_automatique]:
		"Hall d'entrée avec fermeture automatique",
	[models.enveloppe.localNonChauffe.TypeLocalNonChauffe.enum
		.hall_entree_sans_fermeture_automatique]:
		"Hall d'entrée sans fermeture automatique",
	[models.enveloppe.localNonChauffe.TypeLocalNonChauffe.enum.garage_collectif]:
		"Garage collectif",
	[models.enveloppe.localNonChauffe.TypeLocalNonChauffe.enum.autres]: "Autres",
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
