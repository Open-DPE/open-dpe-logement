import schemas from "./data/schemas";
import batiment from "./data/batiment";
import batimentAppartement from "./data/batiment.appartement";
import chauffage from "./data/chauffage";
import chauffageEmetteur from "./data/chauffage.emetteur";
import chauffageGenerateur from "./data/chauffage.generateur";
import chauffageGenerateurCombustion from "./data/chauffage.generateur-combustion";
import chauffageGenerateurElectrique from "./data/chauffage.generateur-electrique";
import chauffageGenerateurInconnu from "./data/chauffage.generateur-inconnu";
import chauffageGenerateurThermodynamique from "./data/chauffage.generateur-thermodynamique";
import chauffageReseauChaleur from "./data/chauffage.reseau-chaleur";
import chauffageInstallation from "./data/chauffage.installation";
import chauffageSysteme from "./data/chauffage.systeme";
import diagnostic from "./data/diagnostic";
import ecs from "./data/ecs";
import ecsGenerateur from "./data/ecs.generateur";
import ecsGenerateurCombustion from "./data/ecs.generateur-combustion";
import ecsGenerateurElectrique from "./data/ecs.generateur-electrique";
import ecsGenerateurInconnu from "./data/ecs.generateur-inconnu";
import ecsGenerateurThermodynamique from "./data/ecs.generateur-thermodynamique";
import ecsReseauChaleur from "./data/ecs.reseau-chaleur";
import ecsInstallation from "./data/ecs.installation";
import ecsSysteme from "./data/ecs.systeme";
import enveloppe from "./data/enveloppe";
import enveloppeBaie from "./data/enveloppe.baie";
import enveloppeMasque from "./data/enveloppe.masque";
import enveloppeLocalNonChauffe from "./data/enveloppe.local-non-chauffe";
import enveloppeLocalNonChauffeBaie from "./data/enveloppe.local-non-chauffe.baie";
import enveloppeLocalNonChauffeParoi from "./data/enveloppe.local-non-chauffe.paroi";
import enveloppeMur from "./data/enveloppe.mur";
import enveloppeNiveau from "./data/enveloppe.niveau";
import enveloppePlancherBas from "./data/enveloppe.plancher-bas";
import enveloppePlancherHaut from "./data/enveloppe.plancher-haut";
import enveloppePontThermique from "./data/enveloppe.pont-thermique";
import enveloppePorte from "./data/enveloppe.porte";
import production from "./data/production";
import productionPanneauPhotovoltaique from "./data/production.panneau-photovoltaique";
import refroidissement from "./data/refroidissement";
import refroidissementGenerateur from "./data/refroidissement.generateur";
import refroidissementInstallation from "./data/refroidissement.installation";
import ventilation from "./data/ventilation";
import ventilationInstallation from "./data/ventilation.installation";

export type Schema = {
	$schema: string;
	$id: string;
	[x: string]: unknown;
};

export const SCHEMA_KEYS = [
	"/schemas",
	"/batiment",
	"/batiment/appartement",
	"/chauffage",
	"/chauffage/emetteur",
	"/chauffage/generateur",
	"/chauffage/generateur-combustion",
	"/chauffage/generateur-electrique",
	"/chauffage/generateur-inconnu",
	"/chauffage/generateur-thermodynamique",
	"/chauffage/reseau-chaleur",
	"/chauffage/installation",
	"/chauffage/systeme",
	"/diagnostic",
	"/ecs",
	"/ecs/generateur",
	"/ecs/generateur-combustion",
	"/ecs/generateur-electrique",
	"/ecs/generateur-inconnu",
	"/ecs/generateur-thermodynamique",
	"/ecs/reseau-chaleur",
	"/ecs/installation",
	"/ecs/systeme",
	"/enveloppe",
	"/enveloppe/baie",
	"/enveloppe/masque",
	"/enveloppe/local-non-chauffe",
	"/enveloppe/local-non-chauffe/baie",
	"/enveloppe/local-non-chauffe/paroi",
	"/enveloppe/mur",
	"/enveloppe/niveau",
	"/enveloppe/plancher-bas",
	"/enveloppe/plancher-haut",
	"/enveloppe/pont-thermique",
	"/enveloppe/porte",
	"/production",
	"/production/panneau-photovoltaique",
	"/refroidissement",
	"/refroidissement/generateur",
	"/refroidissement/installation",
	"/ventilation",
	"/ventilation/installation",
] as const;

export type SchemaKey = (typeof SCHEMA_KEYS)[number];

export const SCHEMAS: { [key in SchemaKey]: Schema } = {
	["/schemas"]: schemas,
	["/batiment"]: batiment,
	["/batiment/appartement"]: batimentAppartement,
	["/chauffage"]: chauffage,
	["/chauffage/emetteur"]: chauffageEmetteur,
	["/chauffage/generateur"]: chauffageGenerateur,
	["/chauffage/generateur-combustion"]: chauffageGenerateurCombustion,
	["/chauffage/generateur-electrique"]: chauffageGenerateurElectrique,
	["/chauffage/generateur-inconnu"]: chauffageGenerateurInconnu,
	["/chauffage/generateur-thermodynamique"]: chauffageGenerateurThermodynamique,
	["/chauffage/reseau-chaleur"]: chauffageReseauChaleur,
	["/chauffage/installation"]: chauffageInstallation,
	["/chauffage/systeme"]: chauffageSysteme,
	["/diagnostic"]: diagnostic,
	["/ecs"]: ecs,
	["/ecs/generateur"]: ecsGenerateur,
	["/ecs/generateur-combustion"]: ecsGenerateurCombustion,
	["/ecs/generateur-electrique"]: ecsGenerateurElectrique,
	["/ecs/generateur-inconnu"]: ecsGenerateurInconnu,
	["/ecs/generateur-thermodynamique"]: ecsGenerateurThermodynamique,
	["/ecs/reseau-chaleur"]: ecsReseauChaleur,
	["/ecs/installation"]: ecsInstallation,
	["/ecs/systeme"]: ecsSysteme,
	["/enveloppe"]: enveloppe,
	["/enveloppe/baie"]: enveloppeBaie,
	["/enveloppe/masque"]: enveloppeMasque,
	["/enveloppe/local-non-chauffe"]: enveloppeLocalNonChauffe,
	["/enveloppe/local-non-chauffe/baie"]: enveloppeLocalNonChauffeBaie,
	["/enveloppe/local-non-chauffe/paroi"]: enveloppeLocalNonChauffeParoi,
	["/enveloppe/mur"]: enveloppeMur,
	["/enveloppe/niveau"]: enveloppeNiveau,
	["/enveloppe/plancher-bas"]: enveloppePlancherBas,
	["/enveloppe/plancher-haut"]: enveloppePlancherHaut,
	["/enveloppe/pont-thermique"]: enveloppePontThermique,
	["/enveloppe/porte"]: enveloppePorte,
	["/production"]: production,
	["/production/panneau-photovoltaique"]: productionPanneauPhotovoltaique,
	["/refroidissement"]: refroidissement,
	["/refroidissement/generateur"]: refroidissementGenerateur,
	["/refroidissement/installation"]: refroidissementInstallation,
	["/ventilation"]: ventilation,
	["/ventilation/installation"]: ventilationInstallation,
};
