import batiment from "../data/batiment.json" with { type: "json" };
import batimentAppartement from "../data/batiment.appartement.json" with { type: "json" };
import chauffage from "../data/chauffage.json" with { type: "json" };
import chauffageEmetteur from "../data/chauffage.emetteur.json" with { type: "json" };
import chauffageGenerateur from "../data/chauffage.generateur.json" with { type: "json" };
import chauffageGenerateurBase from "../data/chauffage.generateur-base.json" with { type: "json" };
import chauffageGenerateurCombustion from "../data/chauffage.generateur-combustion.json" with { type: "json" };
import chauffageGenerateurElectrique from "../data/chauffage.generateur-electrique.json" with { type: "json" };
import chauffageGenerateurInconnu from "../data/chauffage.generateur-inconnu.json" with { type: "json" };
import chauffageGenerateurThermodynamique from "../data/chauffage.generateur-thermodynamique.json" with { type: "json" };
import chauffageInstallation from "../data/chauffage.installation.json" with { type: "json" };
import chauffageReseauChaleur from "../data/chauffage.reseau-chaleur.json" with { type: "json" };
import chauffageSysteme from "../data/chauffage.systeme.json" with { type: "json" };
import common from "../data/common.json" with { type: "json" };
import diagnostic from "../data/diagnostic.json" with { type: "json" };
import ecs from "../data/ecs.json" with { type: "json" };
import ecsGenerateur from "../data/ecs.generateur.json" with { type: "json" };
import ecsGenerateurBase from "../data/ecs.generateur-base.json" with { type: "json" };
import ecsGenerateurCombustion from "../data/ecs.generateur-combustion.json" with { type: "json" };
import ecsGenerateurElectrique from "../data/ecs.generateur-electrique.json" with { type: "json" };
import ecsGenerateurInconnu from "../data/ecs.generateur-inconnu.json" with { type: "json" };
import ecsGenerateurThermodynamique from "../data/ecs.generateur-thermodynamique.json" with { type: "json" };
import ecsInstallation from "../data/ecs.installation.json" with { type: "json" };
import ecsReseauChaleur from "../data/ecs.reseau-chaleur.json" with { type: "json" };
import ecsSysteme from "../data/ecs.systeme.json" with { type: "json" };
import enveloppe from "../data/enveloppe.json" with { type: "json" };
import enveloppeBaie from "../data/enveloppe.baie.json" with { type: "json" };
import enveloppeLocalNonChauffe from "../data/enveloppe.local-non-chauffe.json" with { type: "json" };
import enveloppeLocalNonChauffeBaie from "../data/enveloppe.local-non-chauffe.baie.json" with { type: "json" };
import enveloppeLocalNonChauffeParoi from "../data/enveloppe.local-non-chauffe.paroi.json" with { type: "json" };
import enveloppeMasque from "../data/enveloppe.masque.json" with { type: "json" };
import enveloppeMur from "../data/enveloppe.mur.json" with { type: "json" };
import enveloppeNiveau from "../data/enveloppe.niveau.json" with { type: "json" };
import enveloppeParoi from "../data/enveloppe.paroi.json" with { type: "json" };
import enveloppePlancherBas from "../data/enveloppe.plancher-bas.json" with { type: "json" };
import enveloppePlancherHaut from "../data/enveloppe.plancher-haut.json" with { type: "json" };
import enveloppePontThermique from "../data/enveloppe.pont-thermique.json" with { type: "json" };
import enveloppePorte from "../data/enveloppe.porte.json" with { type: "json" };
import production from "../data/production.json" with { type: "json" };
import productionPanneauPhotovoltaique from "../data/production.panneau-photovoltaique.json" with { type: "json" };
import refroidissement from "../data/refroidissement.json" with { type: "json" };
import refroidissementGenerateur from "../data/refroidissement.generateur.json" with { type: "json" };
import refroidissementInstallation from "../data/refroidissement.installation.json" with { type: "json" };
import ventilation from "../data/ventilation.json" with { type: "json" };
import ventilationInstallation from "../data/ventilation.installation.json" with { type: "json" };

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
const ALL_SCHEMAS: Schema[] = [
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

export const schemas = new Map<string, Schema>(
	ALL_SCHEMAS.map((schema) => [schema.$id, schema]),
);

export const ID = {
	batiment: "https://schemas.open-dpe.fr/batiment",
	batimentAppartement: "https://schemas.open-dpe.fr/batiment/appartement",
	chauffage: "https://schemas.open-dpe.fr/chauffage",
	chauffageEmetteur: "https://schemas.open-dpe.fr/chauffage/emetteur",
	chauffageGenerateur: "https://schemas.open-dpe.fr/chauffage/generateur",
	chauffageInstallation: "https://schemas.open-dpe.fr/chauffage/installation",
	chauffageSysteme: "https://schemas.open-dpe.fr/chauffage/systeme",
	diagnostic: "https://schemas.open-dpe.fr/diagnostic",
	ecs: "https://schemas.open-dpe.fr/ecs",
	ecsGenerateur: "https://schemas.open-dpe.fr/ecs/generateur",
	ecsInstallation: "https://schemas.open-dpe.fr/ecs/installation",
	ecsSysteme: "https://schemas.open-dpe.fr/ecs/systeme",
	enveloppe: "https://schemas.open-dpe.fr/enveloppe",
	enveloppeBaie: "https://schemas.open-dpe.fr/enveloppe/baie",
	enveloppeLocalNonChauffe: "https://schemas.open-dpe.fr/enveloppe/local-non-chauffe",
	enveloppeLocalNonChauffeBaie: "https://schemas.open-dpe.fr/enveloppe/local-non-chauffe/baie",
	enveloppeLocalNonChauffeParoi: "https://schemas.open-dpe.fr/enveloppe/local-non-chauffe/paroi",
	enveloppeMasque: "https://schemas.open-dpe.fr/enveloppe/masque",
	enveloppeMur: "https://schemas.open-dpe.fr/enveloppe/mur",
	enveloppeNiveau: "https://schemas.open-dpe.fr/enveloppe/niveau",
	enveloppePlancherBas: "https://schemas.open-dpe.fr/enveloppe/plancher-bas",
	enveloppePlancherHaut: "https://schemas.open-dpe.fr/enveloppe/plancher-haut",
	enveloppePontThermique: "https://schemas.open-dpe.fr/enveloppe/pont-thermique",
	enveloppePorte: "https://schemas.open-dpe.fr/enveloppe/porte",
	production: "https://schemas.open-dpe.fr/production",
	productionPanneauPhotovoltaique:
		"https://schemas.open-dpe.fr/production/panneau-photovoltaique",
	refroidissement: "https://schemas.open-dpe.fr/refroidissement",
	refroidissementGenerateur:
		"https://schemas.open-dpe.fr/refroidissement/generateur",
	refroidissementInstallation:
		"https://schemas.open-dpe.fr/refroidissement/installation",
	ventilation: "https://schemas.open-dpe.fr/ventilation",
	ventilationInstallation:
		"https://schemas.open-dpe.fr/ventilation/installation",
} as const;
