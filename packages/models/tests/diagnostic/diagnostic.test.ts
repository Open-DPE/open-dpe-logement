import { describe, expect, it } from "vitest";
import {
	isDiagnostic,
	type Diagnostic,
} from "../../src/diagnostic/diagnostic.js";
import type { Maison } from "../../src/batiment/batiment.js";
import type { Enveloppe } from "../../src/enveloppe/enveloppe.js";
import type { Chauffage } from "../../src/chauffage/chauffage.js";
import type { PAC } from "../../src/chauffage/generateur.js";
import type { SystemeDivise } from "../../src/chauffage/systeme.js";
import type { Installation as ChauffageInstallation } from "../../src/chauffage/installation.js";
import type { Emetteur } from "../../src/chauffage/emetteur.js";
import type { Ecs } from "../../src/ecs/ecs.js";
import type { ChauffeEauElectrique } from "../../src/ecs/generateur.js";
import type { Systeme as EcsSysteme } from "../../src/ecs/systeme.js";
import type { Installation as EcsInstallation } from "../../src/ecs/installation.js";
import type { Ventilation } from "../../src/ventilation/ventilation.js";
import type { Refroidissement } from "../../src/refroidissement/refroidissement.js";
import type { Production } from "../../src/production/production.js";
import { UUID, UUID2, ADRESSE, ISOLATION_SANS, p } from "../helpers.js";

// ─── Batiment ────────────────────────────────────────────────────────────────

const BATIMENT: Maison = {
	type: "maison",
	annee_construction: 1990,
	annee_renovation: null,
	altitude: 100,
	logements: 1,
	surface_habitable: p(80),
	hauteur_sous_plafond: p(2.5),
	materiaux_anciens: false,
	rnb_id: null,
	adresse: ADRESSE,
	appartements_visites: [],
	logement: null,
};

// ─── Enveloppe ───────────────────────────────────────────────────────────────

const ENVELOPPE: Enveloppe = {
	exposition: "simple",
	q4pa_conv: null,
	presence_brasseurs_air: false,
	niveaux: [
		{
			id: UUID,
			description: "RDC",
			surface: 80,
			inertie_paroi_verticale: null,
			inertie_plancher_bas: null,
			inertie_plancher_haut: null,
		},
	],
	locaux_non_chauffes: [],
	murs: [],
	planchers_hauts: [],
	planchers_bas: [],
	baies: [],
	portes: [],
	ponts_thermiques: [],
	masques: [],
};

// ─── Chauffage ───────────────────────────────────────────────────────────────

const CH_GENERATEUR: PAC = {
	id: UUID,
	description: "PAC air/eau",
	type: "pac_air_eau",
	energie: "electricite",
	bienergie: null,
	annee_installation: 2015,
	position: {
		cascade: null,
		position_chaudiere: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	signaletique: {
		pn: p(8),
		scop: p(3.5),
		label: null,
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

const CH_EMETTEUR: Emetteur = {
	id: UUID2,
	description: "Radiateur",
	type: "radiateur",
	temperature_distribution: null,
	presence_robinet_thermostatique: true,
	annee_installation: null,
};

const CH_SYSTEME: SystemeDivise = {
	id: UUID2,
	description: "Système divise",
	type: "divise",
	generateur_id: UUID,
	reseau: null,
};

const CH_INSTALLATION: ChauffageInstallation = {
	id: UUID2,
	description: "Installation",
	surface: p(80),
	type: "divise",
	installation_collective: false,
	comptage_individuel: null,
	regulation_terminale: null,
	programmation: "absent",
	solaire_thermique: null,
	systemes: [CH_SYSTEME],
};

const CHAUFFAGE: Chauffage = {
	emetteurs: [CH_EMETTEUR],
	generateurs: [CH_GENERATEUR],
	installations: [CH_INSTALLATION],
};

// ─── ECS ─────────────────────────────────────────────────────────────────────

const ECS_GENERATEUR: ChauffeEauElectrique = {
	id: UUID,
	description: "Chauffe-eau élec",
	type: "chauffe_eau",
	energie: "electricite",
	bienergie: null,
	annee_installation: 2010,
	position: {
		position_chauffe_eau: "chauffe_eau_vertical",
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	stockage: { volume: 200, type: "integre", position_volume_chauffe: false },
	signaletique: {
		pn: p(2.5),
		cop: null,
		label: null,
		mode_combustion: null,
		presence_ventouse: null,
		pveilleuse: null,
		qp0: null,
		rpn: null,
	},
};

const ECS_SYSTEME: EcsSysteme = {
	id: UUID2,
	description: "Système ECS",
	generateur_id: UUID,
	reseau: {
		alimentation_contigue: true,
		niveaux_desservis: 1,
		isolation: null,
		bouclage: null,
	},
};

const ECS_INSTALLATION: EcsInstallation = {
	id: UUID2,
	description: "Installation ECS",
	surface: p(80),
	installation_collective: false,
	systemes: [ECS_SYSTEME],
	solaire_thermique: null,
};

const ECS: Ecs = {
	generateurs: [ECS_GENERATEUR],
	installations: [ECS_INSTALLATION],
};

// ─── Ventilation / Refroidissement / Production ──────────────────────────────

const VENTILATION: Ventilation = {
	installations: [
		{
			id: UUID,
			description: "VMC SF",
			surface: 80,
			type: "vmc_simple_flux_autoreglable",
			annee_installation: 2010,
			installation_collective: false,
			presence_echangeur_thermique: null,
		},
	],
};

const REFROIDISSEMENT: Refroidissement = { generateurs: [], installations: [] };

const PRODUCTION: Production = { panneaux_photovoltaiques: [] };

// ─── Guard ───────────────────────────────────────────────────────────────────

describe("isDiagnostic — guard", () => {
	it("accepte un Diagnostic valide", () => {
		const diagnostic: Diagnostic = {
			date_visite: "2024-01-01",
			date_etablissement: "2024-01-15",
			type: "batiment",
			batiment: BATIMENT,
			enveloppe: ENVELOPPE,
			chauffage: CHAUFFAGE,
			ecs: ECS,
			ventilation: VENTILATION,
			refroidissement: REFROIDISSEMENT,
			production: PRODUCTION,
		};
		expect(isDiagnostic(diagnostic)).toBe(true);
	});
});
