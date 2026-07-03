import batiment from "../schemas/batiment.json" with { type: "json" };
import batimentAppartement from "../schemas/batiment.appartement.json" with { type: "json" };
import chauffage from "../schemas/chauffage.json" with { type: "json" };
import chauffageEmetteur from "../schemas/chauffage.emetteur.json" with { type: "json" };
import chauffageGenerateur from "../schemas/chauffage.generateur.json" with { type: "json" };
import chauffageGenerateurBase from "../schemas/chauffage.generateur-base.json" with { type: "json" };
import chauffageGenerateurCombustion from "../schemas/chauffage.generateur-combustion.json" with { type: "json" };
import chauffageGenerateurElectrique from "../schemas/chauffage.generateur-electrique.json" with { type: "json" };
import chauffageGenerateurInconnu from "../schemas/chauffage.generateur-inconnu.json" with { type: "json" };
import chauffageGenerateurThermodynamique from "../schemas/chauffage.generateur-thermodynamique.json" with { type: "json" };
import chauffageInstallation from "../schemas/chauffage.installation.json" with { type: "json" };
import chauffageReseauChaleur from "../schemas/chauffage.reseau-chaleur.json" with { type: "json" };
import chauffageSysteme from "../schemas/chauffage.systeme.json" with { type: "json" };
import common from "../schemas/common.json" with { type: "json" };
import diagnostic from "../schemas/diagnostic.json" with { type: "json" };
import ecs from "../schemas/ecs.json" with { type: "json" };
import ecsGenerateur from "../schemas/ecs.generateur.json" with { type: "json" };
import ecsGenerateurBase from "../schemas/ecs.generateur-base.json" with { type: "json" };
import ecsGenerateurCombustion from "../schemas/ecs.generateur-combustion.json" with { type: "json" };
import ecsGenerateurElectrique from "../schemas/ecs.generateur-electrique.json" with { type: "json" };
import ecsGenerateurInconnu from "../schemas/ecs.generateur-inconnu.json" with { type: "json" };
import ecsGenerateurThermodynamique from "../schemas/ecs.generateur-thermodynamique.json" with { type: "json" };
import ecsInstallation from "../schemas/ecs.installation.json" with { type: "json" };
import ecsReseauChaleur from "../schemas/ecs.reseau-chaleur.json" with { type: "json" };
import ecsSysteme from "../schemas/ecs.systeme.json" with { type: "json" };
import enveloppe from "../schemas/enveloppe.json" with { type: "json" };
import enveloppeBaie from "../schemas/enveloppe.baie.json" with { type: "json" };
import enveloppeLocalNonChauffe from "../schemas/enveloppe.local-non-chauffe.json" with { type: "json" };
import enveloppeLocalNonChauffeBaie from "../schemas/enveloppe.local-non-chauffe.baie.json" with { type: "json" };
import enveloppeLocalNonChauffeParoi from "../schemas/enveloppe.local-non-chauffe.paroi.json" with { type: "json" };
import enveloppeMasque from "../schemas/enveloppe.masque.json" with { type: "json" };
import enveloppeMur from "../schemas/enveloppe.mur.json" with { type: "json" };
import enveloppeNiveau from "../schemas/enveloppe.niveau.json" with { type: "json" };
import enveloppeParoi from "../schemas/enveloppe.paroi.json" with { type: "json" };
import enveloppePlancherBas from "../schemas/enveloppe.plancher-bas.json" with { type: "json" };
import enveloppePlancherHaut from "../schemas/enveloppe.plancher-haut.json" with { type: "json" };
import enveloppePontThermique from "../schemas/enveloppe.pont-thermique.json" with { type: "json" };
import enveloppePorte from "../schemas/enveloppe.porte.json" with { type: "json" };
import production from "../schemas/production.json" with { type: "json" };
import productionPanneauPhotovoltaique from "../schemas/production.panneau-photovoltaique.json" with { type: "json" };
import refroidissement from "../schemas/refroidissement.json" with { type: "json" };
import refroidissementGenerateur from "../schemas/refroidissement.generateur.json" with { type: "json" };
import refroidissementInstallation from "../schemas/refroidissement.installation.json" with { type: "json" };
import ventilation from "../schemas/ventilation.json" with { type: "json" };
import ventilationInstallation from "../schemas/ventilation.installation.json" with { type: "json" };

export type Schema = {
	$id: string;
	$schema: string;
	[x: string]: unknown;
};

/**
 * Tous les schémas (publics et privés) de /schemas, sous forme lean ($ref non
 * résolus). Les schémas privés (ex. generateur-base) sont enregistrés pour la
 * résolution des $ref mais n'ont pas de validateXXX/isXXX exporté.
 */
const _SCHEMAS: Schema[] = [
	batiment,
	batimentAppartement,
	chauffage,
	chauffageEmetteur,
	chauffageGenerateur,
	chauffageGenerateurBase,
	chauffageGenerateurCombustion,
	chauffageGenerateurElectrique,
	chauffageGenerateurInconnu,
	chauffageGenerateurThermodynamique,
	chauffageInstallation,
	chauffageReseauChaleur,
	chauffageSysteme,
	common,
	diagnostic,
	ecs,
	ecsGenerateur,
	ecsGenerateurBase,
	ecsGenerateurCombustion,
	ecsGenerateurElectrique,
	ecsGenerateurInconnu,
	ecsGenerateurThermodynamique,
	ecsInstallation,
	ecsReseauChaleur,
	ecsSysteme,
	enveloppe,
	enveloppeBaie,
	enveloppeLocalNonChauffe,
	enveloppeLocalNonChauffeBaie,
	enveloppeLocalNonChauffeParoi,
	enveloppeMasque,
	enveloppeMur,
	enveloppeNiveau,
	enveloppeParoi,
	enveloppePlancherBas,
	enveloppePlancherHaut,
	enveloppePontThermique,
	enveloppePorte,
	production,
	productionPanneauPhotovoltaique,
	refroidissement,
	refroidissementGenerateur,
	refroidissementInstallation,
	ventilation,
	ventilationInstallation,
];

export const SCHEMAS = new Map<string, Schema>(
	_SCHEMAS.map((schema) => [schema.$id, schema]),
);

export const MAP = {
	"/batiment": "https://schemas.open-dpe.fr/batiment",
	"/batiment/appartement": "https://schemas.open-dpe.fr/batiment/appartement",
	"/chauffage": "https://schemas.open-dpe.fr/chauffage",
	"/chauffage/emetteur": "https://schemas.open-dpe.fr/chauffage/emetteur",
	"/chauffage/generateur": "https://schemas.open-dpe.fr/chauffage/generateur",
	"/chauffage/installation":
		"https://schemas.open-dpe.fr/chauffage/installation",
	"/chauffage/systeme": "https://schemas.open-dpe.fr/chauffage/systeme",
	"/diagnostic": "https://schemas.open-dpe.fr/diagnostic",
	"/ecs": "https://schemas.open-dpe.fr/ecs",
	"/ecs/generateur": "https://schemas.open-dpe.fr/ecs/generateur",
	"/ecs/installation": "https://schemas.open-dpe.fr/ecs/installation",
	"/ecs/systeme": "https://schemas.open-dpe.fr/ecs/systeme",
	"/enveloppe": "https://schemas.open-dpe.fr/enveloppe",
	"/enveloppe/baie": "https://schemas.open-dpe.fr/enveloppe/baie",
	"/enveloppe/local-non-chauffe":
		"https://schemas.open-dpe.fr/enveloppe/local-non-chauffe",
	"/enveloppe/local-non-chauffe/baie":
		"https://schemas.open-dpe.fr/enveloppe/local-non-chauffe/baie",
	"/enveloppe/local-non-chauffe/paroi":
		"https://schemas.open-dpe.fr/enveloppe/local-non-chauffe/paroi",
	"/enveloppe/masque": "https://schemas.open-dpe.fr/enveloppe/masque",
	"/enveloppe/mur": "https://schemas.open-dpe.fr/enveloppe/mur",
	"/enveloppe/niveau": "https://schemas.open-dpe.fr/enveloppe/niveau",
	"/enveloppe/plancher-bas":
		"https://schemas.open-dpe.fr/enveloppe/plancher-bas",
	"/enveloppe/plancher-haut":
		"https://schemas.open-dpe.fr/enveloppe/plancher-haut",
	"/enveloppe/pont-thermique":
		"https://schemas.open-dpe.fr/enveloppe/pont-thermique",
	"/enveloppe/porte": "https://schemas.open-dpe.fr/enveloppe/porte",
	"/production": "https://schemas.open-dpe.fr/production",
	"/production/panneau-photovoltaique":
		"https://schemas.open-dpe.fr/production/panneau-photovoltaique",
	"/refroidissement": "https://schemas.open-dpe.fr/refroidissement",
	"/refroidissement/generateur":
		"https://schemas.open-dpe.fr/refroidissement/generateur",
	"/refroidissement/installation":
		"https://schemas.open-dpe.fr/refroidissement/installation",
	"/ventilation": "https://schemas.open-dpe.fr/ventilation",
	"/ventilation/installation":
		"https://schemas.open-dpe.fr/ventilation/installation",
} as const;

export type Key = keyof typeof MAP;
