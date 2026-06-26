import { describe, expect, it } from "vitest";
import type {
	batiment,
	enveloppe,
	chauffage,
	ecs,
	ventilation,
	refroidissement,
	production,
	diagnostic,
} from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID, UUID2, ADRESSE, p } from "../helpers.js";

// ─── Batiment ────────────────────────────────────────────────────────────────

const BATIMENT: batiment.Maison = {
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

const ENVELOPPE: enveloppe.Enveloppe = {
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
};

// ─── Chauffage ───────────────────────────────────────────────────────────────

const CH_GENERATEUR: chauffage.generateur.PAC = {
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

const CH_EMETTEUR: chauffage.emetteur.Emetteur = {
	id: UUID2,
	description: "Radiateur",
	type: "radiateur",
	temperature_distribution: null,
	presence_robinet_thermostatique: true,
	annee_installation: null,
};

const CH_SYSTEME: chauffage.systeme.SystemeDivise = {
	id: UUID2,
	description: "Système divise",
	type: "divise",
	generateur_id: UUID,
	reseau: null,
};

const CH_INSTALLATION: chauffage.installation.Installation = {
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

const CHAUFFAGE: chauffage.Chauffage = {
	emetteurs: [CH_EMETTEUR],
	generateurs: [CH_GENERATEUR],
	installations: [CH_INSTALLATION],
};

// ─── ECS ─────────────────────────────────────────────────────────────────────

const ECS_GENERATEUR: ecs.generateur.ChauffeEauElectrique = {
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

const ECS_SYSTEME: ecs.systeme.Systeme = {
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

const ECS_INSTALLATION: ecs.installation.Installation = {
	id: UUID2,
	description: "Installation ECS",
	surface: p(80),
	installation_collective: false,
	systemes: [ECS_SYSTEME],
	solaire_thermique: null,
};

const ECS: ecs.Ecs = {
	generateurs: [ECS_GENERATEUR],
	installations: [ECS_INSTALLATION],
};

// ─── Ventilation / Refroidissement / Production ──────────────────────────────

const VENTILATION: ventilation.Ventilation = {
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

const REFROIDISSEMENT: refroidissement.Refroidissement = {
	generateurs: [],
	installations: [],
};

const PRODUCTION: production.Production = { panneaux_photovoltaiques: [] };

// ─── Guard ───────────────────────────────────────────────────────────────────

describe("isDiagnostic — guard", () => {
	it("accepte un Diagnostic valide", () => {
		const fixture: diagnostic.Diagnostic = {
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
		expect(validator.diagnostic.isDiagnostic(fixture)).toBe(true);
	});
});
