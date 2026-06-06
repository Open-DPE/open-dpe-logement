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
import enveloppeLocalNonChauffe from "./data/enveloppe.local-non-chauffe";
import enveloppeMasque from "./data/enveloppe.masque";
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

export const SCHEMA_KEYS = {
	schemas: "https://schemas.open-dpe.fr/schemas",
	batiment: "https://schemas.open-dpe.fr/batiment",
	"batiment/appartement": "https://schemas.open-dpe.fr/batiment/appartement",
	chauffage: "https://schemas.open-dpe.fr/chauffage",
	"chauffage/emetteur": "https://schemas.open-dpe.fr/chauffage/emetteur",
	"chauffage/generateur": "https://schemas.open-dpe.fr/chauffage/generateur",
	"chauffage/generateur-combustion":
		"https://schemas.open-dpe.fr/chauffage/generateur-combustion",
	"chauffage/generateur-electrique":
		"https://schemas.open-dpe.fr/chauffage/generateur-electrique",
	"chauffage/generateur-inconnu":
		"https://schemas.open-dpe.fr/chauffage/generateur-inconnu",
	"chauffage/generateur-thermodynamique":
		"https://schemas.open-dpe.fr/chauffage/generateur-thermodynamique",
	"chauffage/reseau-chaleur":
		"https://schemas.open-dpe.fr/chauffage/reseau-chaleur",
	"chauffage/installation":
		"https://schemas.open-dpe.fr/chauffage/installation",
	"chauffage/systeme": "https://schemas.open-dpe.fr/chauffage/systeme",
	diagnostic: "https://schemas.open-dpe.fr/diagnostic",
	ecs: "https://schemas.open-dpe.fr/ecs",
	"ecs/generateur": "https://schemas.open-dpe.fr/ecs/generateur",
	"ecs/generateur-combustion":
		"https://schemas.open-dpe.fr/ecs/generateur-combustion",
	"ecs/generateur-electrique":
		"https://schemas.open-dpe.fr/ecs/generateur-electrique",
	"ecs/generateur-inconnu":
		"https://schemas.open-dpe.fr/ecs/generateur-inconnu",
	"ecs/generateur-thermodynamique":
		"https://schemas.open-dpe.fr/ecs/generateur-thermodynamique",
	"ecs/reseau-chaleur": "https://schemas.open-dpe.fr/ecs/reseau-chaleur",
	"ecs/installation": "https://schemas.open-dpe.fr/ecs/installation",
	"ecs/systeme": "https://schemas.open-dpe.fr/ecs/systeme",
	enveloppe: "https://schemas.open-dpe.fr/enveloppe",
	"enveloppe/baie": "https://schemas.open-dpe.fr/enveloppe/baie",
	"enveloppe/local-non-chauffe":
		"https://schemas.open-dpe.fr/enveloppe/local-non-chauffe",
	"enveloppe/masque": "https://schemas.open-dpe.fr/enveloppe/masque",
	"enveloppe/mur": "https://schemas.open-dpe.fr/enveloppe/mur",
	"enveloppe/niveau": "https://schemas.open-dpe.fr/enveloppe/niveau",
	"enveloppe/plancher-bas":
		"https://schemas.open-dpe.fr/enveloppe/plancher-bas",
	"enveloppe/plancher-haut":
		"https://schemas.open-dpe.fr/enveloppe/plancher-haut",
	"enveloppe/pont-thermique":
		"https://schemas.open-dpe.fr/enveloppe/pont-thermique",
	"enveloppe/porte": "https://schemas.open-dpe.fr/enveloppe/porte",
	production: "https://schemas.open-dpe.fr/production",
	"production/panneau-photovoltaique":
		"https://schemas.open-dpe.fr/production/panneau-photovoltaique",
	refroidissement: "https://schemas.open-dpe.fr/refroidissement",
	"refroidissement/generateur":
		"https://schemas.open-dpe.fr/refroidissement/generateur",
	"refroidissement/installation":
		"https://schemas.open-dpe.fr/refroidissement/installation",
	ventilation: "https://schemas.open-dpe.fr/ventilation",
	"ventilation/installation":
		"https://schemas.open-dpe.fr/ventilation/installation",
} as const;

export type SchemaKey = (typeof SCHEMA_KEYS)[keyof typeof SCHEMA_KEYS];

export const SCHEMAS: { [K in SchemaKey]: string } = {
	[SCHEMA_KEYS.schemas]: schemas,
	[SCHEMA_KEYS.batiment]: batiment,
	[SCHEMA_KEYS["batiment/appartement"]]: batimentAppartement,
	[SCHEMA_KEYS.chauffage]: chauffage,
	[SCHEMA_KEYS["chauffage/emetteur"]]: chauffageEmetteur,
	[SCHEMA_KEYS["chauffage/generateur"]]: chauffageGenerateur,
	[SCHEMA_KEYS["chauffage/generateur-combustion"]]:
		chauffageGenerateurCombustion,
	[SCHEMA_KEYS["chauffage/generateur-electrique"]]:
		chauffageGenerateurElectrique,
	[SCHEMA_KEYS["chauffage/generateur-inconnu"]]: chauffageGenerateurInconnu,
	[SCHEMA_KEYS["chauffage/generateur-thermodynamique"]]:
		chauffageGenerateurThermodynamique,
	[SCHEMA_KEYS["chauffage/reseau-chaleur"]]: chauffageReseauChaleur,
	[SCHEMA_KEYS["chauffage/installation"]]: chauffageInstallation,
	[SCHEMA_KEYS["chauffage/systeme"]]: chauffageSysteme,
	[SCHEMA_KEYS.diagnostic]: diagnostic,
	[SCHEMA_KEYS.ecs]: ecs,
	[SCHEMA_KEYS["ecs/generateur"]]: ecsGenerateur,
	[SCHEMA_KEYS["ecs/generateur-combustion"]]: ecsGenerateurCombustion,
	[SCHEMA_KEYS["ecs/generateur-electrique"]]: ecsGenerateurElectrique,
	[SCHEMA_KEYS["ecs/generateur-inconnu"]]: ecsGenerateurInconnu,
	[SCHEMA_KEYS["ecs/generateur-thermodynamique"]]: ecsGenerateurThermodynamique,
	[SCHEMA_KEYS["ecs/reseau-chaleur"]]: ecsReseauChaleur,
	[SCHEMA_KEYS["ecs/installation"]]: ecsInstallation,
	[SCHEMA_KEYS["ecs/systeme"]]: ecsSysteme,
	[SCHEMA_KEYS.enveloppe]: enveloppe,
	[SCHEMA_KEYS["enveloppe/baie"]]: enveloppeBaie,
	[SCHEMA_KEYS["enveloppe/local-non-chauffe"]]: enveloppeLocalNonChauffe,
	[SCHEMA_KEYS["enveloppe/masque"]]: enveloppeMasque,
	[SCHEMA_KEYS["enveloppe/mur"]]: enveloppeMur,
	[SCHEMA_KEYS["enveloppe/niveau"]]: enveloppeNiveau,
	[SCHEMA_KEYS["enveloppe/plancher-bas"]]: enveloppePlancherBas,
	[SCHEMA_KEYS["enveloppe/plancher-haut"]]: enveloppePlancherHaut,
	[SCHEMA_KEYS["enveloppe/pont-thermique"]]: enveloppePontThermique,
	[SCHEMA_KEYS["enveloppe/porte"]]: enveloppePorte,
	[SCHEMA_KEYS.production]: production,
	[SCHEMA_KEYS["production/panneau-photovoltaique"]]:
		productionPanneauPhotovoltaique,
	[SCHEMA_KEYS.refroidissement]: refroidissement,
	[SCHEMA_KEYS["refroidissement/generateur"]]: refroidissementGenerateur,
	[SCHEMA_KEYS["refroidissement/installation"]]: refroidissementInstallation,
	[SCHEMA_KEYS.ventilation]: ventilation,
	[SCHEMA_KEYS["ventilation/installation"]]: ventilationInstallation,
};
