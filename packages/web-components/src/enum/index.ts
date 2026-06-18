import * as models from "@open-dpe-logement/models";
import { define } from "../shared/components.js";

const MAP: Record<string, Record<string, string>> = {};

MAP["scenario"] = {
	[models.common.ScenarioEnum.conventionnel]: "Scénario conventionnel",
	[models.common.ScenarioEnum.depensier]: "Scénario dépensier",
};

MAP["usage"] = {
	[models.common.UsageEnum.chauffage]: "Chauffage",
	[models.common.UsageEnum.ecs]: "Eau chaude sanitaire",
	[models.common.UsageEnum.refroidissement]: "Refroidissement",
	[models.common.UsageEnum.eclairage]: "Éclairage",
	[models.common.UsageEnum.auxiliaire]: "Auxiliaire",
};

MAP["type-batiment"] = {
	[models.batiment.TypeBatimentEnum.maison]: "Maison individuelle",
	[models.batiment.TypeBatimentEnum.immeuble]: "Immeuble collectif",
};

MAP["zone-climatique"] = {
	[models.batiment.ZoneClimatiqueEnum.H1a]: "H1a",
	[models.batiment.ZoneClimatiqueEnum.H1b]: "H1b",
	[models.batiment.ZoneClimatiqueEnum.H1c]: "H1c",
	[models.batiment.ZoneClimatiqueEnum.H2a]: "H2a",
	[models.batiment.ZoneClimatiqueEnum.H2b]: "H2b",
	[models.batiment.ZoneClimatiqueEnum.H2c]: "H2c",
	[models.batiment.ZoneClimatiqueEnum.H2d]: "H2d",
	[models.batiment.ZoneClimatiqueEnum.H3]: "H3",
};

MAP["energie"] = {
	[models.common.EnergieEnum.electricite]: "Électricité",
	[models.common.EnergieEnum.electricite_renouvelable]:
		"Électricité d'origine renouvelable",
	[models.common.EnergieEnum.gaz_naturel]: "Gaz naturel",
	[models.common.EnergieEnum.gpl]: "GPL",
	[models.common.EnergieEnum.fioul]: "Fioul",
	[models.common.EnergieEnum.charbon]: "Charbon",
	[models.common.EnergieEnum.bois_buche]: "Bois - Bûche",
	[models.common.EnergieEnum.bois_plaquette]: "Bois - Plaquette",
	[models.common.EnergieEnum.bois_granule]: "Bois - Granule",
	[models.common.EnergieEnum.reseau_chaleur]: "Réseau de chaleur",
	[models.common.EnergieEnum.reseau_froid]: "Réseau de froid",
};

MAP["orientation"] = {
	[models.common.OrientationEnum.nord]: "Nord",
	[models.common.OrientationEnum.nord_est]: "Nord-Est",
	[models.common.OrientationEnum.est]: "Est",
	[models.common.OrientationEnum.sud_est]: "Sud-Est",
	[models.common.OrientationEnum.sud]: "Sud",
	[models.common.OrientationEnum.sud_ouest]: "Sud-Ouest",
	[models.common.OrientationEnum.ouest]: "Ouest",
	[models.common.OrientationEnum.nord_ouest]: "Nord-Ouest",
};

MAP["orientation-cardinale"] = {
	[models.common.OrientationCardinaleEnum.nord]: "Nord",
	[models.common.OrientationCardinaleEnum.sud]: "Sud",
	[models.common.OrientationCardinaleEnum.est]: "Est",
	[models.common.OrientationCardinaleEnum.ouest]: "Ouest",
};

MAP["etiquette"] = {
	[models.common.EtiquetteEnum.A]: "A",
	[models.common.EtiquetteEnum.B]: "B",
	[models.common.EtiquetteEnum.C]: "C",
	[models.common.EtiquetteEnum.D]: "D",
	[models.common.EtiquetteEnum.E]: "E",
	[models.common.EtiquetteEnum.F]: "F",
	[models.common.EtiquetteEnum.G]: "G",
};

MAP["mois"] = {
	[models.common.MoisEnum["01"]]: "Janvier",
	[models.common.MoisEnum["02"]]: "Février",
	[models.common.MoisEnum["03"]]: "Mars",
	[models.common.MoisEnum["04"]]: "Avril",
	[models.common.MoisEnum["05"]]: "Mai",
	[models.common.MoisEnum["06"]]: "Juin",
	[models.common.MoisEnum["07"]]: "Juillet",
	[models.common.MoisEnum["08"]]: "Août",
	[models.common.MoisEnum["09"]]: "Septembre",
	[models.common.MoisEnum["10"]]: "Octobre",
	[models.common.MoisEnum["11"]]: "Novembre",
	[models.common.MoisEnum["12"]]: "Décembre",
};

MAP["type-diagnostic"] = {
	[models.diagnostic.TypeDiagnosticEnum.batiment]: "Bâtiment",
	[models.diagnostic.TypeDiagnosticEnum.logement]: "Logement",
};

MAP["confort-ete"] = {
	"1": "Bon",
	"2": "Moyen",
	"3": "Insuffisant",
};

// --- Chauffage ---

MAP["chauffage.installation.type"] = {
	[models.chauffage.installation.TypeInstallationEnum.central]:
		"Chauffage central",
	[models.chauffage.installation.TypeInstallationEnum.divise]:
		"Chauffage divisé",
};

MAP["chauffage.systeme.type"] = {
	[models.chauffage.systeme.TypeSystemeEnum.central]: "Chauffage central",
	[models.chauffage.systeme.TypeSystemeEnum.divise]: "Chauffage divisé",
};

MAP["chauffage.type-generateur"] = {
	[models.chauffage.generateur.TypeGenerateurEnum.chaudiere]: "Chaudière",
	[models.chauffage.generateur.TypeGenerateurEnum.convecteur_bi_jonction]:
		"Convecteur bi-jonction",
	[models.chauffage.generateur.TypeGenerateurEnum.convecteur_electrique]:
		"Convecteur électrique",
	[models.chauffage.generateur.TypeGenerateurEnum.panneau_rayonnant_electrique]:
		"Panneau rayonnant électrique",
	[models.chauffage.generateur.TypeGenerateurEnum.plafond_rayonnant_electrique]:
		"Plafond rayonnant électrique",
	[models.chauffage.generateur.TypeGenerateurEnum
		.plancher_rayonnant_electrique]: "Plancher rayonnant électrique",
	[models.chauffage.generateur.TypeGenerateurEnum.radiateur_electrique]:
		"Radiateur électrique",
	[models.chauffage.generateur.TypeGenerateurEnum
		.radiateur_electrique_accumulation]: "Radiateur électrique à accumulation",
	[models.chauffage.generateur.TypeGenerateurEnum.generateur_air_chaud]:
		"Générateur d'air chaud",
	[models.chauffage.generateur.TypeGenerateurEnum.pac_air_air]:
		"Pompe à chaleur air / air",
	[models.chauffage.generateur.TypeGenerateurEnum.pac_air_eau]:
		"Pompe à chaleur air / eau",
	[models.chauffage.generateur.TypeGenerateurEnum.pac_eau_eau]:
		"Pompe à chaleur eau / eau",
	[models.chauffage.generateur.TypeGenerateurEnum.pac_eau_glycolee_eau]:
		"Pompe à chaleur eau glycolée / eau",
	[models.chauffage.generateur.TypeGenerateurEnum.pac_geothermique]:
		"Pompe à chaleur géothermique",
	[models.chauffage.generateur.TypeGenerateurEnum.cuisiniere]: "Cuisinière",
	[models.chauffage.generateur.TypeGenerateurEnum.foyer_ferme]: "Foyer fermé",
	[models.chauffage.generateur.TypeGenerateurEnum.insert]: "Insert",
	[models.chauffage.generateur.TypeGenerateurEnum.poele]: "Poêle",
	[models.chauffage.generateur.TypeGenerateurEnum.poele_bouilleur]:
		"Poêle boulleur",
	[models.chauffage.generateur.TypeGenerateurEnum.radiateur_gaz]:
		"Radiateur gaz",
	[models.chauffage.generateur.TypeGenerateurEnum.reseau_chaleur]:
		"Réseau de chaleur",
};

MAP["chauffage.mode-combustion"] = {
	[models.chauffage.generateur.ModeCombustionEnum.standard]: "Standard",
	[models.chauffage.generateur.ModeCombustionEnum.basse_temperature]:
		"Basse température",
	[models.chauffage.generateur.ModeCombustionEnum.condensation]: "Condensation",
};

MAP["chauffage.position-chaudiere"] = {
	[models.chauffage.generateur.PositionChaudiereEnum.chaudiere_murale]:
		"Chaudière murale",
	[models.chauffage.generateur.PositionChaudiereEnum.chaudiere_sol]:
		"Chaudière au sol",
};

MAP["chauffage.label-generateur"] = {
	[models.chauffage.generateur.LabelEnum.flamme_verte]: "Flamme verte",
	[models.chauffage.generateur.LabelEnum.nf_performance]: "NF Performance",
};

MAP["chauffage.type-distribution"] = {
	[models.chauffage.systeme.TypeDistributionEnum.hydraulique]:
		"Distribution hydraulique",
	[models.chauffage.systeme.TypeDistributionEnum.aeraulique]:
		"Distribution aeraulique",
};

MAP["chauffage.temperature-distribution"] = {
	[models.chauffage.systeme.TemperatureDistributionEnum.basse]:
		"Basse température",
	[models.chauffage.systeme.TemperatureDistributionEnum.moyenne]:
		"Moyenne température",
	[models.chauffage.systeme.TemperatureDistributionEnum.haute]:
		"Haute température",
};

MAP["chauffage.type-emetteur"] = {
	[models.chauffage.emetteur.TypeEmetteurEnum.plancher_chauffant]:
		"Plancher chauffant",
	[models.chauffage.emetteur.TypeEmetteurEnum.plafond_chauffant]:
		"Plafond chauffant",
	[models.chauffage.emetteur.TypeEmetteurEnum.radiateur_monotube]:
		"Radiateur monotube",
	[models.chauffage.emetteur.TypeEmetteurEnum.radiateur_bitube]:
		"Radiateur bitube",
	[models.chauffage.emetteur.TypeEmetteurEnum.radiateur]: "Radiateur",
	[models.chauffage.emetteur.TypeEmetteurEnum.autres]: "Autres",
};

MAP["chauffage.type-emission"] = {
	[models.chauffage.systeme.TypeEmissionEnum.radiateur]: "Radiateur",
	[models.chauffage.systeme.TypeEmissionEnum.air_souffle]: "Air soufflé",
	[models.chauffage.systeme.TypeEmissionEnum.plancher_chauffant]:
		"Plancher chauffant",
	[models.chauffage.systeme.TypeEmissionEnum.plafond_chauffant]:
		"Plafond chauffant",
};

MAP["chauffage.type-programmation"] = {
	[models.chauffage.installation.TypeProgrammationEnum.absent]:
		"Absence de programmation",
	[models.chauffage.installation.TypeProgrammationEnum
		.central_sans_minimum_temperature]:
		"Programmation centrale sans minimum de température",
	[models.chauffage.installation.TypeProgrammationEnum
		.central_avec_minimum_temperature]:
		"Programmation centrale avec minimum de température",
	[models.chauffage.installation.TypeProgrammationEnum
		.central_collectif_sans_detection_presence]:
		"Programmation centrale collective",
	[models.chauffage.installation.TypeProgrammationEnum
		.central_collectif_avec_detection_presence]:
		"Programmation centrale collective avec détection de présence",
	[models.chauffage.installation.TypeProgrammationEnum
		.terminal_avec_minimum_temperature]:
		"Programmation par pièce avec minimum de température",
	[models.chauffage.installation.TypeProgrammationEnum
		.terminal_avec_minimum_temperature_detection_presence]:
		"Programmation par pièce avec minimum de température et détection de présence",
};

MAP["chauffage.usage-solaire"] = {
	[models.chauffage.installation.UsageSolaireEnum.chauffage]: "Chauffage",
	[models.chauffage.installation.UsageSolaireEnum.chauffage_ecs]:
		"Chauffage + ECS",
};

// --- ECS ---

MAP["ecs:type-generateur"] = {
	[models.ecs.generateur.TypeGenerateurEnum.chauffe_eau]: "Chauffe eau",
	[models.ecs.generateur.TypeGenerateurEnum.chaudiere]: "Chaudière",
	[models.ecs.generateur.TypeGenerateurEnum.cet_air_ambiant]:
		"Chauffe eau thermodynamique sur air ambiant",
	[models.ecs.generateur.TypeGenerateurEnum.cet_air_exterieur]:
		"Chauffe eau thermodynamique sur air extérieur",
	[models.ecs.generateur.TypeGenerateurEnum.cet_air_extrait]:
		"Chauffe eau thermodynamique sur air extrait",
	[models.ecs.generateur.TypeGenerateurEnum.pac_double_service]:
		"Pompe à chaleur double service",
	[models.ecs.generateur.TypeGenerateurEnum.poele_bouilleur]: "Poêle bouilleur",
	[models.ecs.generateur.TypeGenerateurEnum.reseau_chaleur]:
		"Réseau de chaleur",
};

MAP["ecs:mode-combustion"] = {
	[models.ecs.generateur.ModeCombustionEnum.standard]: "Standard",
	[models.ecs.generateur.ModeCombustionEnum.basse_temperature]:
		"Basse température",
	[models.ecs.generateur.ModeCombustionEnum.condensation]: "Condensation",
};

MAP["ecs:position-chauffe-eau"] = {
	[models.ecs.generateur.PositionChauffeEauEnum.chauffe_eau_vertical]:
		"Chauffe eau vertical",
	[models.ecs.generateur.PositionChauffeEauEnum.chauffe_eau_horizontal]:
		"Chauffe eau horizontal",
};

MAP["ecs:label-generateur"] = {
	[models.ecs.generateur.LabelEnum.ne_performance_a]: "NE Performance - A",
	[models.ecs.generateur.LabelEnum.ne_performance_b]: "NE Performance - B",
	[models.ecs.generateur.LabelEnum.ne_performance_c]: "NE Performance - C",
};

MAP["ecs:bouclage-reseau"] = {
	[models.ecs.systeme.BouclageEnum.non_boucle]: "Réseau non bouclé",
	[models.ecs.systeme.BouclageEnum.boucle]: "Réseau bouclé",
	[models.ecs.systeme.BouclageEnum.trace]: "Réseau tracé",
};

MAP["ecs:type-stockage"] = {
	[models.ecs.generateur.TypeStockageEnum.integre]:
		"Stockage intégré à la production",
	[models.ecs.generateur.TypeStockageEnum.independant]:
		"Stockage indépendant de la production",
};

MAP["ecs:usage-solaire"] = {
	[models.ecs.installation.UsageSolaireEnum.ecs]: "ECS seule",
	[models.ecs.installation.UsageSolaireEnum.chauffage_ecs]: "Chauffage + ECS",
};

// --- Refroidissement ---

MAP["refroidissement:type-generateur"] = {
	[models.refroidissement.generateur.TypeGenerateurEnum.pac_air_air]:
		"PAC air/air",
	[models.refroidissement.generateur.TypeGenerateurEnum.pac_air_eau]:
		"PAC air/eau",
	[models.refroidissement.generateur.TypeGenerateurEnum.pac_eau_eau]:
		"PAC eau/eau",
	[models.refroidissement.generateur.TypeGenerateurEnum.pac_eau_glycolee_eau]:
		"PAC eau glycolée/eau",
	[models.refroidissement.generateur.TypeGenerateurEnum.pac_geothermique]:
		"PAC géothermique",
	[models.refroidissement.generateur.TypeGenerateurEnum
		.autre_systeme_thermodynamique]: "Autres systèmes thermodynamique",
	[models.refroidissement.generateur.TypeGenerateurEnum.reseau_froid]:
		"Réseau de froid",
	[models.refroidissement.generateur.TypeGenerateurEnum.autre]:
		"Autres systèmes",
};

// --- Ventilation ---

MAP["ventilation:type"] = {
	[models.ventilation.installation.TypeVentilationEnum
		.ventilation_ouverture_fenetres]: "Ventilation par ouverture des fenêtres",
	[models.ventilation.installation.TypeVentilationEnum
		.ventilation_entrees_air_hautes_basses]:
		"Ventilation par entrées d'air hautes et basses",
	[models.ventilation.installation.TypeVentilationEnum
		.vmc_simple_flux_autoreglable]: "VMC Simple flux autoréglable",
	[models.ventilation.installation.TypeVentilationEnum
		.vmc_simple_flux_hygroreglable_a]: "VMC Simple flux hygroréglable - Type A",
	[models.ventilation.installation.TypeVentilationEnum
		.vmc_simple_flux_hygroreglable_gaz]: "VMC Simple flux hygroréglable Gaz",
	[models.ventilation.installation.TypeVentilationEnum
		.vmc_simple_flux_hygroreglable_b]: "VMC Simple flux hygroréglable - Type B",
	[models.ventilation.installation.TypeVentilationEnum
		.vmc_basse_pression_autoreglable]: "VMC Basse pression autoréglable",
	[models.ventilation.installation.TypeVentilationEnum
		.vmc_basse_pression_hygroreglable_a]:
		"VMC Basse préssion hygroréglable - Type A",
	[models.ventilation.installation.TypeVentilationEnum
		.vmc_basse_pression_hygroreglable_b]:
		"VMC Basse pression hygroréglable - Type B",
	[models.ventilation.installation.TypeVentilationEnum.vmc_double_flux]:
		"VMC Double flux",
	[models.ventilation.installation.TypeVentilationEnum
		.ventilation_naturelle_conduit]: "Ventilation naturelle par conduit",
	[models.ventilation.installation.TypeVentilationEnum.ventilation_hybride]:
		"Ventilation hybride",
	[models.ventilation.installation.TypeVentilationEnum
		.ventilation_hybride_entrees_air_hygroreglables]:
		"Ventilation hybride avec entrées d'air hygroréglables",
	[models.ventilation.installation.TypeVentilationEnum
		.ventilation_mecanique_conduit]:
		"Ventilation mécanique sur conduit existant",
	[models.ventilation.installation.TypeVentilationEnum
		.ventilation_naturelle_conduit_entrees_air_hygroreglables]:
		"Ventilation naturelle par conduit avec entrées d'air hygroéglables",
	[models.ventilation.installation.TypeVentilationEnum.puit_climatique]:
		"Puit climatique",
	[models.ventilation.installation.TypeVentilationEnum
		.ventilation_mecanique_insufflation]:
		"Ventilation mécanique par insufflation",
};

// --- Bâtiment ---

MAP["batiment:position-appartement"] = {
	[models.batiment.appartement.PositionEnum.rdc]:
		"Appartement en rez-de-chaussée",
	[models.batiment.appartement.PositionEnum.etage_intermediaire]:
		"Appartement en étage intermédiaire",
	[models.batiment.appartement.PositionEnum.dernier_etage]:
		"Appartement au dernier étage",
};

MAP["batiment:typologie-appartement"] = {
	[models.batiment.appartement.TypologieEnum.T1]: "T1",
	[models.batiment.appartement.TypologieEnum.T2]: "T2",
	[models.batiment.appartement.TypologieEnum.T3]: "T3",
	[models.batiment.appartement.TypologieEnum.T4]: "T4",
	[models.batiment.appartement.TypologieEnum.T5]: "T5",
	[models.batiment.appartement.TypologieEnum.T6]: "T6",
	[models.batiment.appartement.TypologieEnum.T7]: "T7 et plus",
};

// --- Production ---

MAP["production:usage-electricite"] = {
	[models.production.UsageElectriciteEnum.chauffage]: "Chauffage",
	[models.production.UsageElectriciteEnum.refroidissement]: "Refroidissement",
	[models.production.UsageElectriciteEnum.ecs]: "Eau chaude sanitaire",
	[models.production.UsageElectriciteEnum.eclairage]: "Eclairage",
	[models.production.UsageElectriciteEnum.auxiliaires_ventilation]:
		"Auxiliaires de ventilation",
	[models.production.UsageElectriciteEnum.auxiliaires_distribution]:
		"Auxiliaires de distribution",
	[models.production.UsageElectriciteEnum.autres]: "Autres",
};

// --- Enveloppe ---

MAP["enveloppe:inertie"] = {
	[models.enveloppe.common.InertieEnum.legere]: "Légère",
	[models.enveloppe.common.InertieEnum.moyenne]: "Moyenne",
	[models.enveloppe.common.InertieEnum.lourde]: "Lourde",
	[models.enveloppe.common.InertieEnum.tres_lourde]: "Très lourde",
};

MAP["enveloppe:exposition"] = {
	[models.enveloppe.ExpositionEnum.simple]: "Exposition simple",
	[models.enveloppe.ExpositionEnum.multiple]: "Exposition multiple",
};

MAP["enveloppe:orientation-paroi"] = {
	...MAP["orientation-cardinale"],
	[models.enveloppe.common.OrientationHorizontale]: "Paroi horizontale",
};

MAP["enveloppe:paroi:mitoyennete"] = {
	[models.enveloppe.common.MitoyenneteEnum.exterieur]: "Extérieur",
	[models.enveloppe.common.MitoyenneteEnum.enterre]: "Enterré",
	[models.enveloppe.common.MitoyenneteEnum.vide_sanitaire]: "Vide sanitaire",
	[models.enveloppe.common.MitoyenneteEnum.terre_plein]: "Terre plein",
	[models.enveloppe.common.MitoyenneteEnum.sous_sol_non_chauffe]:
		"Sous-sol non chauffé",
	[models.enveloppe.common.MitoyenneteEnum.local_non_chauffe]:
		"Local non chauffé",
	[models.enveloppe.common.MitoyenneteEnum.local_non_residentiel]:
		"Local non résidentiel",
	[models.enveloppe.common.MitoyenneteEnum.local_residentiel]:
		"Local résidentiel",
	[models.enveloppe.common.MitoyenneteEnum.local_non_accessible]:
		"Local non accessible",
};

MAP["enveloppe:paroi:inertie"] = {
	[models.enveloppe.common.InertieParoiEnum.legere]: "Inertie légère",
	[models.enveloppe.common.InertieParoiEnum.lourde]: "Inertie lourde",
};

MAP["enveloppe:paroi:type-isolation"] = {
	[models.enveloppe.common.TypeIsolationEnum.iti]: "ITI",
	[models.enveloppe.common.TypeIsolationEnum.ite]: "ITE",
	[models.enveloppe.common.TypeIsolationEnum.itr]: "ITR",
	[models.enveloppe.common.TypeIsolationEnum.iti_ite]: "ITI + ITE",
	[models.enveloppe.common.TypeIsolationEnum.itr_iti]: "ITR + ITI",
	[models.enveloppe.common.TypeIsolationEnum.itr_ite]: "ITR + ITE",
	[models.enveloppe.common.TypeIsolationEnum.itr_iti_ite]: "ITR + ITI + ITE",
};

MAP["enveloppe:paroi:type-pose"] = {
	[models.enveloppe.common.TypePoseEnum.nu_exterieur]: "Nu extérieur",
	[models.enveloppe.common.TypePoseEnum.nu_interieur]: "Nu intérieur",
	[models.enveloppe.common.TypePoseEnum.tunnel]: "Tunnel",
};

MAP["enveloppe:mur:type"] = {
	[models.enveloppe.mur.MateriauMurEnum.pierre_moellons]: "Pierre ou moellons",
	[models.enveloppe.mur.MateriauMurEnum.pierre_moellons_avec_remplissage]:
		"Pierre ou moellons avec remplissage",
	[models.enveloppe.mur.MateriauMurEnum.pise_ou_beton_terre]:
		"Pise ou béton terre",
	[models.enveloppe.mur.MateriauMurEnum.pan_bois_sans_remplissage]:
		"Pan bois sans remplissage",
	[models.enveloppe.mur.MateriauMurEnum.pan_bois_avec_remplissage]:
		"Pan bois avec remplissage",
	[models.enveloppe.mur.MateriauMurEnum.bois_rondin]: "Bois rondin",
	[models.enveloppe.mur.MateriauMurEnum.brique_pleine_simple]:
		"Brique pleine simple",
	[models.enveloppe.mur.MateriauMurEnum.brique_pleine_double_avec_lame_air]:
		"Brique pleine double avec lame d'air",
	[models.enveloppe.mur.MateriauMurEnum.brique_creuse]: "Brique creuse",
	[models.enveloppe.mur.MateriauMurEnum.bloc_beton_plein]: "Bloc béton plein",
	[models.enveloppe.mur.MateriauMurEnum.bloc_beton_creux]: "Bloc béton creux",
	[models.enveloppe.mur.MateriauMurEnum.beton_banche]: "Béton banché",
	[models.enveloppe.mur.MateriauMurEnum.beton_machefer]: "Béton machefer",
	[models.enveloppe.mur.MateriauMurEnum.brique_terre_cuite_alveolaire]:
		"Brique terre cuite alvéolaire",
	[models.enveloppe.mur.MateriauMurEnum
		.sandwich_beton_isolant_beton_sans_isolation_rapportee]:
		"Mur sandwich béton isolant et béton sans isolation rapportée",
	[models.enveloppe.mur.MateriauMurEnum.cloison_platre]: "Cloison de plâtre",
	[models.enveloppe.mur.MateriauMurEnum.ossature_bois_sans_remplissage]:
		"Ossature bois sans remplissage",
	[models.enveloppe.mur.MateriauMurEnum
		.ossature_bois_avec_remplissage_tout_venant]:
		"Ossature bois avec remplissage tout venant",
	[models.enveloppe.mur.MateriauMurEnum.ossature_bois_avec_remplissage_isolant]:
		"Ossature bois avec remplissage isolant",
};

MAP["enveloppe:mur:type-doublage"] = {
	[models.enveloppe.mur.TypeDoublageEnum.sans_doublage]: "Sans doublage",
	[models.enveloppe.mur.TypeDoublageEnum.indetermine]:
		"Doublage rapporté de nature indéterminé",
	[models.enveloppe.mur.TypeDoublageEnum.lame_air_inferieur_15mm]:
		"Doublage rapporté avec lame d'air inférieure à 15mm",
	[models.enveloppe.mur.TypeDoublageEnum.lame_air_superieur_15mm]:
		"Doublage rapporté avec lame d'air supérieure à 15mm",
	[models.enveloppe.mur.TypeDoublageEnum.materiaux_connu]:
		"Doublage rapporté avec un matériau de doublage connu (plâtre, brique, bois)",
};

MAP["enveloppe:plancher-bas:type"] = {
	[models.enveloppe.plancherBas.TypePlancherBasEnum
		.plancher_avec_ou_sans_remplissage]: "Plancher avec ou sans remplissage",
	[models.enveloppe.plancherBas.TypePlancherBasEnum
		.plancher_entre_solives_metalliques]: "Plancher entre solives metalliques",
	[models.enveloppe.plancherBas.TypePlancherBasEnum
		.plancher_entre_solives_bois]: "Plancher entre solives bois",
	[models.enveloppe.plancherBas.TypePlancherBasEnum
		.plancher_bois_sur_solives_metalliques]:
		"Plancher bois sur solives metalliques",
	[models.enveloppe.plancherBas.TypePlancherBasEnum.bardeaux_et_remplissage]:
		"Plancher et remplissage",
	[models.enveloppe.plancherBas.TypePlancherBasEnum
		.voutains_sur_solives_metalliques]: "Plancher sur solives metalliques",
	[models.enveloppe.plancherBas.TypePlancherBasEnum
		.voutains_briques_ou_moellons]: "Plancher briques ou moellons",
	[models.enveloppe.plancherBas.TypePlancherBasEnum.dalle_beton]:
		"Plancher beton",
	[models.enveloppe.plancherBas.TypePlancherBasEnum
		.plancher_bois_sur_solives_bois]: "Plancher bois sur solives bois",
	[models.enveloppe.plancherBas.TypePlancherBasEnum
		.plancher_lourd_type_entrevous_terre_cuite_ou_poutrelles_beton]:
		"Plancher lourd type entrevous terre cuite ou poutrelles beton",
	[models.enveloppe.plancherBas.TypePlancherBasEnum.plancher_entrevous_isolant]:
		"Plancher entrevous isolant",
};

MAP["enveloppe:plancher-haut:configuration"] = {
	[models.enveloppe.plancherHaut.ConfigurationEnum.plancher]: "Plancher",
	[models.enveloppe.plancherHaut.ConfigurationEnum.rampants]: "Rampants",
	[models.enveloppe.plancherHaut.ConfigurationEnum.terrasse]: "Terrasse",
};

MAP["enveloppe:plancher-haut:type"] = {
	[models.enveloppe.plancherHaut.TypePlancherHautEnum
		.plafond_avec_ou_sans_remplissage]: "Plafond avec ou sans remplissage",
	[models.enveloppe.plancherHaut.TypePlancherHautEnum
		.plafond_entre_solives_metalliques]: "Plafond entre solives metalliques",
	[models.enveloppe.plancherHaut.TypePlancherHautEnum
		.plafond_entre_solives_bois]: "Plafond entre solives bois",
	[models.enveloppe.plancherHaut.TypePlancherHautEnum
		.plafond_bois_sur_solives_metalliques]:
		"Plafond bois sur solives metalliques",
	[models.enveloppe.plancherHaut.TypePlancherHautEnum
		.plafond_bois_sous_solives_metalliques]:
		"Plafond bois sous solives metalliques",
	[models.enveloppe.plancherHaut.TypePlancherHautEnum.bardeaux_et_remplissage]:
		"Bardeaux et remplissage",
	[models.enveloppe.plancherHaut.TypePlancherHautEnum
		.plafond_bois_sur_solives_bois]: "Plafond bois sur solives bois",
	[models.enveloppe.plancherHaut.TypePlancherHautEnum
		.plafond_bois_sous_solives_bois]: "Plafond bois sous solives bois",
	[models.enveloppe.plancherHaut.TypePlancherHautEnum.dalle_beton]:
		"Dalle beton",
	[models.enveloppe.plancherHaut.TypePlancherHautEnum.plafond_lourd]:
		"Plafond lourd",
	[models.enveloppe.plancherHaut.TypePlancherHautEnum
		.combles_amenages_sous_rampant]: "Combles amenages sous rampant",
	[models.enveloppe.plancherHaut.TypePlancherHautEnum.toiture_chaume]:
		"Toiture chaume",
	[models.enveloppe.plancherHaut.TypePlancherHautEnum.plafond_patre]:
		"Plafond patre",
	[models.enveloppe.plancherHaut.TypePlancherHautEnum.bac_acier]: "Bac acier",
};

MAP["enveloppe:pont-thermique:type"] = {
	[models.enveloppe.pontThermique.TypeLiaisonEnum.plancher_bas_mur]:
		"Plancher bas / Mur",
	[models.enveloppe.pontThermique.TypeLiaisonEnum.plancher_haut_mur]:
		"Plancher haut / Mur",
	[models.enveloppe.pontThermique.TypeLiaisonEnum.refend_mur]: "Refend / Mur",
	[models.enveloppe.pontThermique.TypeLiaisonEnum.plancher_intermediaire_mur]:
		"Plancher intermédiaire / Mur",
	[models.enveloppe.pontThermique.TypeLiaisonEnum.baie_mur]: "Baie / Mur",
	[models.enveloppe.pontThermique.TypeLiaisonEnum.porte_mur]: "Porte / Mur",
};

MAP["enveloppe:baie:type"] = {
	[models.enveloppe.baie.TypeBaieEnum.brique_verre_pleine]:
		"Brique de verre pleine",
	[models.enveloppe.baie.TypeBaieEnum.brique_verre_creuse]:
		"Brique de verre creuse",
	[models.enveloppe.baie.TypeBaieEnum.polycarbonate]: "Polycarbonate",
	[models.enveloppe.baie.TypeBaieEnum.fenetre_battante]: "Fenêtre battante",
	[models.enveloppe.baie.TypeBaieEnum.fenetre_coulissante]:
		"Fenêtre coulissante",
	[models.enveloppe.baie.TypeBaieEnum.porte_fenetre_coulissante]:
		"Porte fenêtre coulissante",
	[models.enveloppe.baie.TypeBaieEnum.porte_fenetre_battante]:
		"Porte fenêtre battante",
};

MAP["enveloppe:baie:materiau"] = {
	[models.enveloppe.baie.MateriauEnum.pvc]: "PVC",
	[models.enveloppe.baie.MateriauEnum.bois]: "Bois",
	[models.enveloppe.baie.MateriauEnum.bois_metal]: "Bois-métal",
	[models.enveloppe.baie.MateriauEnum.metal]: "Métal",
};

MAP["enveloppe:baie:type-vitrage"] = {
	[models.enveloppe.baie.TypeVitrageEnum.brique_verre]: "Brique de verre",
	[models.enveloppe.baie.TypeVitrageEnum.polycarbonate]: "Polycarbonate",
	[models.enveloppe.baie.TypeVitrageEnum.simple_vitrage]: "Simple vitrage",
	[models.enveloppe.baie.TypeVitrageEnum.double_vitrage]: "Double vitrage",
	[models.enveloppe.baie.TypeVitrageEnum.double_vitrage_fe]:
		"Double vitrage à faite emissivité",
	[models.enveloppe.baie.TypeVitrageEnum.triple_vitrage]: "Triple vitrage",
	[models.enveloppe.baie.TypeVitrageEnum.triple_vitrage_fe]:
		"Triple vitrage à faible emissivité",
};

MAP["enveloppe:baie:nature-lame-air"] = {
	[models.enveloppe.baie.NatureLameEnum.air]: "Air",
	[models.enveloppe.baie.NatureLameEnum.argon]: "Argon",
	[models.enveloppe.baie.NatureLameEnum.krypton]: "Krypton",
};

MAP["enveloppe:baie:type-survitrage"] = {
	[models.enveloppe.baie.TypeSurvitrageEnum.survitrage_simple]:
		"Survitrage simple",
	[models.enveloppe.baie.TypeSurvitrageEnum.survitrage_fe]:
		"Survitrage à faible emissivité",
};

MAP["enveloppe:baie:type-fermeture"] = {
	[models.enveloppe.baie.TypeFermetureEnum.sans_fermeture]: "Sans fermeture",
	[models.enveloppe.baie.TypeFermetureEnum.jalousie_accordeon]:
		"Jalousie et accordéon",
	[models.enveloppe.baie.TypeFermetureEnum.fermeture_lames_orientables]:
		"Fermeture à lames orientables",
	[models.enveloppe.baie.TypeFermetureEnum.venitiens_exterieurs_metal]:
		"Venitiens extérieurs en métal",
	[models.enveloppe.baie.TypeFermetureEnum.volet_battant_avec_ajours_fixes]:
		"Volet battant avec ajours fixes",
	[models.enveloppe.baie.TypeFermetureEnum.persiennes_avec_ajours_fixes]:
		"Persiennes avec ajours fixes",
	[models.enveloppe.baie.TypeFermetureEnum.fermeture_sans_ajours]:
		"Femeture sans ajours",
	[models.enveloppe.baie.TypeFermetureEnum.volets_roulants_aluminium]:
		"Volets roulants en aluminium",
	[models.enveloppe.baie.TypeFermetureEnum
		.volets_roulants_pvc_bois_epaisseur_lte_12mm]:
		"Volets roulants PVC ou bois - Epaisseur intérieure ou égale à 12mm",
	[models.enveloppe.baie.TypeFermetureEnum
		.volets_roulants_pvc_bois_epaisseur_gt_12mm]:
		"Volets roulants PVC ou bois - Epaisseur supérieure à 12mm",
	[models.enveloppe.baie.TypeFermetureEnum
		.persienne_coulissante_epaisseur_lte_22mm]:
		"Persienne coulissante - Epaisseur intérieure ou égale à 22mm",
	[models.enveloppe.baie.TypeFermetureEnum
		.persienne_coulissante_epaisseur_gt_22mm]:
		"Persienne coulissante - Epaisseur supérieure à 22mm",
	[models.enveloppe.baie.TypeFermetureEnum
		.volet_battant_pvc_bois_epaisseur_lte_22mm]:
		"Volet battant PVC ou bois - Epaisseur intérieure ou égale à 22mm",
	[models.enveloppe.baie.TypeFermetureEnum
		.volet_battant_pvc_bois_epaisseur_gt_22mm]:
		"Volet battant PVC ou bois - Epaisseur supérieure à 22mm",
	[models.enveloppe.baie.TypeFermetureEnum.fermeture_isolee_sans_ajours]:
		"Femeture isolée sans ajours",
};

MAP["enveloppe:porte:materiau"] = {
	[models.enveloppe.porte.MateriauEnum.pvc]: "PVC",
	[models.enveloppe.porte.MateriauEnum.bois]: "Bois",
	[models.enveloppe.porte.MateriauEnum.metal]: "Métal",
};

MAP["enveloppe:porte:type-vitrage"] = {
	[models.enveloppe.porte.TypeVitrageEnum.simple_vitrage]: "Simple vitrage",
	[models.enveloppe.porte.TypeVitrageEnum.double_vitrage]: "Double vitrage",
	[models.enveloppe.porte.TypeVitrageEnum.triple_vitrage]: "Triple vitrage",
};

MAP["enveloppe:masque:type"] = {
	[models.enveloppe.masque.TypeMasqueEnum.homogene]: "Masque lointain homogène",
	[models.enveloppe.masque.TypeMasqueEnum.non_homogene]:
		"Masque lointain non homogène",
	[models.enveloppe.masque.TypeMasqueEnum.fond_balcon]: "Fond de balcon",
	[models.enveloppe.masque.TypeMasqueEnum.fond_et_flanc_loggias]:
		"Fond et flanc de loggias",
	[models.enveloppe.masque.TypeMasqueEnum.balcon_ou_auvent]: "Balcon ou auvent",
	[models.enveloppe.masque.TypeMasqueEnum.paroi_laterale_sans_obstacle_au_sud]:
		"Paroi latérale sans obstacle au sud",
	[models.enveloppe.masque.TypeMasqueEnum.paroi_laterale_avec_obstacle_au_sud]:
		"Paroi latérale avec obstacle au sud",
};

MAP["enveloppe:masque:secteur"] = {
	[models.enveloppe.masque.SecteurEnum.lateral]: "Secteur latéral",
	[models.enveloppe.masque.SecteurEnum.lateral_sud]:
		"Secteur latéral vers le sud",
	[models.enveloppe.masque.SecteurEnum.central]: "Secteur central",
	[models.enveloppe.masque.SecteurEnum.central_sud]:
		"Secteur central vers le sud",
};

MAP["enveloppe:local-non-chauffe:type"] = {
	[models.enveloppe.localNonChauffe.TypeLncEnum.garage]: "Garage",
	[models.enveloppe.localNonChauffe.TypeLncEnum.cellier]: "Cellier",
	[models.enveloppe.localNonChauffe.TypeLncEnum.espace_tampon_solarise]:
		"Espace tampon solarisé",
	[models.enveloppe.localNonChauffe.TypeLncEnum.comble_fortement_ventile]:
		"Comble fortement solarisé",
	[models.enveloppe.localNonChauffe.TypeLncEnum.comble_faiblement_ventile]:
		"Comble faiblement solarisé",
	[models.enveloppe.localNonChauffe.TypeLncEnum.comble_tres_faiblement_ventile]:
		"Comble très faiblement ventilé",
	[models.enveloppe.localNonChauffe.TypeLncEnum
		.circulation_sans_ouverture_exterieure]:
		"Circulation sans ouverture extérieur",
	[models.enveloppe.localNonChauffe.TypeLncEnum
		.circulation_avec_ouverture_exterieure]:
		"Circulation avec ouverture extérieur",
	[models.enveloppe.localNonChauffe.TypeLncEnum
		.circulation_avec_bouche_ou_gaine_desenfumage_ouverte]:
		"Circulation avec bouche ou gaine de desenfumage ouverte",
	[models.enveloppe.localNonChauffe.TypeLncEnum
		.hall_entree_avec_fermeture_automatique]:
		"Hall d'entrée avec fermeture automatique",
	[models.enveloppe.localNonChauffe.TypeLncEnum
		.hall_entree_sans_fermeture_automatique]:
		"Hall d'entrée sans fermeture automatique",
	[models.enveloppe.localNonChauffe.TypeLncEnum.garage_collectif]:
		"Garage collectif",
	[models.enveloppe.localNonChauffe.TypeLncEnum.autres]: "Autres",
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
