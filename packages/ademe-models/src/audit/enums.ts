// @generated
// Source : enums.audit.json
// Ne pas modifier manuellement — relancer scripts/generate-enums.mjs

import * as z from "zod";

/**
 * "0.1": "version de développement"
 * "1.0": "version initiale audit"
 * "1.1": "version de l'audit mise à jour pour correspondre avec le dpe 2.3"
 * "2.0": "version de l'audit contenant les controles de cohérence spécifiques pour l'audit"
 * "2.1": "version de l'audit pour la fusion de l'audit réglementaire et volontaire"
 * "2.2": "version de l'audit pour l'intégration des caractéristiques travaux et des fourchettes de couts"
 * "2.3": "version de l'audit pour l'intégration du nom de l'organisme de qualification"
 * "2.4": "version de l'audit compatible dpe 2.5, contrôle des travaux autre et intégration de l'audit copro"
 * "2.5": "version de l'audit compatible dpe 2.6 - pef électricité à 1,9"
 */
export const VERSION_AUDIT = [
	"0.1",
	"1.0",
	"1.1",
	"2.0",
	"2.1",
	"2.2",
	"2.3",
	"2.4",
	"2.5",
] as const;

export const VersionAuditEnum = z.enum(VERSION_AUDIT);
export type VersionAuditEnum = z.infer<typeof VersionAuditEnum>;

/**
 * "1": "version du 1er juillet 2021"
 * "2": "version avec modèle complet sans contrôle de cohérence"
 * "1.1": "version corrective du 1er novembre"
 * "2.1": "version de fin de validation incluant les contrôles de cohérences"
 * "2.2": "version de préparation de compatibilité audit/dpe"
 * "2.3": "version corrective de janvier 2023"
 * "2.4": "version correspondant à l'arrêté des seuils pour les petites surfaces"
 * "2.5": "version correspondant à l'obligation de saisie du numéro fiscal de local"
 * "2.6": "version correspondant au changement du facteur de conversion en ep de l'électricité"
 */
export const VERSION_DPE = [
	"1",
	"2",
	"1.1",
	"2.1",
	"2.2",
	"2.3",
	"2.4",
	"2.5",
	"2.6",
] as const;

export const VersionDpeEnum = z.enum(VERSION_DPE);
export type VersionDpeEnum = z.infer<typeof VersionDpeEnum>;

/**
 * "1": "murs"
 * "2": "planchers bas"
 * "3": "toiture/plafond"
 * "4": "portes et fenêtres"
 * "5": "système de chauffage"
 * "6": "système d'ecs"
 * "7": "sytème de refroidissement"
 * "8": "système de ventilation"
 * "9": "energie renouvelable"
 * "10": "autre"
 */
export const LOT_TRAVAUX_AUDIT = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
] as const;

export const LotTravauxAuditEnum = z.enum(LOT_TRAVAUX_AUDIT);
export type LotTravauxAuditEnum = z.infer<typeof LotTravauxAuditEnum>;

/**
 * "1": "audit réglementaire logement"
 * "2": "audit volontaire logement"
 * "3": "audit copro"
 */
export const MODELE_AUDIT = ["1", "2", "3"] as const;

export const ModeleAuditEnum = z.enum(MODELE_AUDIT);
export type ModeleAuditEnum = z.infer<typeof ModeleAuditEnum>;

/**
 * "1": "abscence de dérogation"
 * "2": "dérogation pour un ensemble raisons architecturales, patrimoniales et/ou techniques"
 * "3": "non applicable - audit copro"
 */
export const DEROGATION_TECHNIQUE = ["1", "2", "3"] as const;

export const DerogationTechniqueEnum = z.enum(DEROGATION_TECHNIQUE);
export type DerogationTechniqueEnum = z.infer<typeof DerogationTechniqueEnum>;

/**
 * "1": "abscence de dérogation"
 * "2": "coûts de travaux excessifs"
 * "3": "coûts de travaux probablement excessifs"
 * "4": "non applicable - audit copro"
 */
export const DEROGATION_ECONOMIQUE = ["1", "2", "3", "4"] as const;

export const DerogationEconomiqueEnum = z.enum(DEROGATION_ECONOMIQUE);
export type DerogationEconomiqueEnum = z.infer<typeof DerogationEconomiqueEnum>;

/**
 * "1": "ventilation non fonctionnelle"
 * "2": "ventilation fonctionnelle"
 * "3": "cas de dérogation"
 */
export const ETAT_VENTILATION = ["1", "2", "3"] as const;

export const EtatVentilationEnum = z.enum(ETAT_VENTILATION);
export type EtatVentilationEnum = z.infer<typeof EtatVentilationEnum>;

/**
 * "1": "abscence de dérogation"
 * "2": "impossibilité technique/architecturale/patrimoniale de vérifier la ventilation (ex : mesure de débit impossible)"
 * "3": "ventilation naturelle efficace"
 * "4": "impossibilité technique/architecturale/patrimoniale d'atteindre les débits réglementaires (ex : impossibilité d'installer une vmc)"
 */
export const DEROGATION_VENTILATION = ["1", "2", "3", "4"] as const;

export const DerogationVentilationEnum = z.enum(DEROGATION_VENTILATION);
export type DerogationVentilationEnum = z.infer<
	typeof DerogationVentilationEnum
>;

/**
 * "1": "initial"
 * "2": "neuf ou rénové"
 */
export const ETAT_COMPOSANT = ["1", "2"] as const;

export const EtatComposantEnum = z.enum(ETAT_COMPOSANT);
export type EtatComposantEnum = z.infer<typeof EtatComposantEnum>;

/**
 * "0": "état initial"
 * "1": "scénario multi étapes "principal""
 * "2": "scénario en une étape "principal""
 * "3": "scénario complémentaire 1"
 * "4": "scénario complémentaire 2"
 * "5": "scénario complémentaire 3"
 * "6": "scénario complémentaire 4 - audit copro"
 * "7": "scénario audit copro "principal""
 */
export const SCENARIO = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;

export const ScenarioEnum = z.enum(SCENARIO);
export type ScenarioEnum = z.infer<typeof ScenarioEnum>;

/**
 * "0": "état initial"
 * "1": "étape première"
 * "2": "étape finale"
 * "3": "étape intermédiaire 1"
 * "4": "étape intermédiaire 2"
 * "5": "étape intermédiaire 3"
 */
export const ETAPE = ["0", "1", "2", "3", "4", "5"] as const;

export const EtapeEnum = z.enum(ETAPE);
export type EtapeEnum = z.infer<typeof EtapeEnum>;

/**
 * "0": "murs"
 * "1": "planchers"
 * "2": "toitures"
 * "3": "menuiseries"
 */
export const CATEGORIE_DESCRIPTIF_ENVELOPPE = ["0", "1", "2", "3"] as const;

export const CategorieDescriptifEnveloppeEnum = z.enum(
	CATEGORIE_DESCRIPTIF_ENVELOPPE,
);
export type CategorieDescriptifEnveloppeEnum = z.infer<
	typeof CategorieDescriptifEnveloppeEnum
>;

/**
 * "0": "chauffage"
 * "1": "eau chaude sanitaire"
 * "2": "climatisation"
 * "3": "ventilation"
 * "4": "dispositifs de pilotage"
 */
export const CATEGORIE_DESCRIPTIF_SYS = ["0", "1", "2", "3", "4"] as const;

export const CategorieDescriptifSysEnum = z.enum(CATEGORIE_DESCRIPTIF_SYS);
export type CategorieDescriptifSysEnum = z.infer<
	typeof CategorieDescriptifSysEnum
>;

/**
 * "0": "isolation des murs"
 * "1": "isolation de la toiture"
 * "2": "isolation des planchers bas"
 * "3": "remplacement du système de chauffage"
 * "4": "remplacement du système de production d’eau chaude sanitaire"
 * "5": "installation d’un système de ventilation"
 * "6": "remplacement du système de ventilation"
 * "7": "remplacement des menuiseries extérieures"
 * "8": "installation d’un système de refroidissement"
 * "9": "remplacement du système de refroidissement"
 * "10": "installation d’un système de production photovoltaïque"
 * "11": "autre"
 */
export const TRAVAUX_RESUME = [
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"11",
] as const;

export const TravauxResumeEnum = z.enum(TRAVAUX_RESUME);
export type TravauxResumeEnum = z.infer<typeof TravauxResumeEnum>;

/**
 * "0": "aucun"
 * "1": "point de vigilance"
 * "2": "matériaux bio-sources"
 */
export const PICTO_TRAVAUX = ["0", "1", "2"] as const;

export const PictoTravauxEnum = z.enum(PICTO_TRAVAUX);
export type PictoTravauxEnum = z.infer<typeof PictoTravauxEnum>;

/**
 * "0": "pathologie"
 * "1": "architecturale"
 * "2": "patrimoniale"
 * "3": "technique"
 */
export const TYPE_OBSERVATION = ["0", "1", "2", "3"] as const;

export const TypeObservationEnum = z.enum(TYPE_OBSERVATION);
export type TypeObservationEnum = z.infer<typeof TypeObservationEnum>;

/**
 * "0": "isolation murs en ite"
 * "1": "isolation murs en iti"
 * "2": "isolation sous rampants (combles aménagés)"
 * "3": "isolation des combles non aménagés"
 * "4": "isolation toiture terrasse"
 * "5": "isolation planchers bas"
 * "6": "installation menuiseries double vitrage"
 * "7": "installation menuiseries triple vitrage"
 * "8": "installation vmc simple flux"
 * "9": "installation vmc double flux"
 * "10": "installation pac géothermique"
 * "11": "installation pac eau/eau"
 * "12": "installation pac air/eau"
 * "13": "installation pac air/air (climatiseur inclu)"
 * "14": "installation chaudière à gaz"
 * "15": "installation chaudière à biomasse"
 * "16": "installation poêle/insert à bois/granulés"
 * "17": "installation radiateur électrique"
 * "18": "installation radiateur hydraulique"
 * "19": "installation plancher/plafond chauffant hydraulique"
 * "20": "installation chauffe-eau thermodynamique"
 * "21": "installation ballon d'ecs à effet joule"
 * "22": "installation panneaux solaire thermique"
 * "23": "installation panneaux solaire photovoltaïque"
 * "24": "autre"
 */
export const TYPE_TRAVAUX = [
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"11",
	"12",
	"13",
	"14",
	"15",
	"16",
	"17",
	"18",
	"19",
	"20",
	"21",
	"22",
	"23",
	"24",
] as const;

export const TypeTravauxEnum = z.enum(TYPE_TRAVAUX);
export type TypeTravauxEnum = z.infer<typeof TypeTravauxEnum>;

/**
 * "0": "nombre de niveaux"
 * "1": "nombre de pièces"
 * "2": "description des pièces"
 * "3": "mitoyenneté"
 * "4": "autre"
 * "5": "nombre de logements"
 * "6": "descriptions des logements"
 * "7": "intégration du bien dans son environnement"
 * "8": "aptitude au confort d'été"
 */
export const RUBRIQUE_DESCRIPTION = [
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
] as const;

export const RubriqueDescriptionEnum = z.enum(RUBRIQUE_DESCRIPTION);
export type RubriqueDescriptionEnum = z.infer<typeof RubriqueDescriptionEnum>;

/**
 * "1": "plans de la maison, de l’appartement ou de l’immeuble"
 * "2": "plan de situation ou plan de masse du bâtiment"
 * "3": "diagnostic surface habitable"
 * "4": "avis de taxe d’habitation"
 * "5": "relevé de propriété"
 * "6": "règlement de copropriété"
 * "7": "descriptifs des équipements collectifs fournis par le propriétaire des installations collectives ou le syndic de copropriété"
 * "8": "descriptifs des équipements individuels des logements non visités par le diagnostiqueur, fournis par le gestionnaire professionnel unique du bâtiment dans le cas d’un propriétaire unique certifiant que tous les lots font l’objet d’une gestion homogène"
 * "9": "contrat de maintenance ou d’entretien des équipements"
 * "10": "notices techniques des équipements, y compris celles mise à disposition publiquement par les fabricants"
 * "11": "permis de construire du bâtiment et, le cas échéant, de ses extensions"
 * "12": "étude thermique réglementaire"
 * "13": "rapport de mesure de la perméabilité à l’air"
 * "14": "rapport mentionnant la composition des parois, obtenue par sondage"
 * "15": "factures de travaux ou bordereaux de livraison décrivant les travaux réalisés, mentionnant l’adresse du bien"
 * "16": "photographies des travaux d’isolation, permettant d’identifier le bien et la paroi concernée"
 * "17": "justificatifs d’obtention d’un crédit d’impôt ou d’une prime de transition énergétique (cite, maprimerénov’)."
 * "18": "déclaration préalable des travaux de rénovation, dans le cas où cette procédure était nécessaire (par exemple pour une isolation thermique par l’extérieur)"
 * "19": "cahier des charges ou programme de travaux"
 * "20": "url/api"
 * "21": "avis et/ou accord de l'architecte des bâtiments de france (abf)"
 * "22": "décision du préfet de région (label architecture contemporaine remarquable - drac)"
 * "23": "autorisation d'urbanisme"
 * "24": "évaluation de la valeur vénale du bien par un professionnel dans le domaine de l'immobilier"
 */
export const TYPE_JUSTIFICATIF_AUDIT = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"11",
	"12",
	"13",
	"14",
	"15",
	"16",
	"17",
	"18",
	"19",
	"20",
	"21",
	"22",
	"23",
	"24",
] as const;

export const TypeJustificatifAuditEnum = z.enum(TYPE_JUSTIFICATIF_AUDIT);
export type TypeJustificatifAuditEnum = z.infer<
	typeof TypeJustificatifAuditEnum
>;
