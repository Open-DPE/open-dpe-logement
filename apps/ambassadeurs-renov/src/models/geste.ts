import * as models from "@open-dpe-logement/models";
import { v4 as uuid } from "uuid";
import _geste from "../../data/gestes.json";

export type Geste = {
	id: string;
	titre: string;
	description: string;
};

export const gestes = _geste as Geste[];

export function withGeste(
	data: models.diagnostic.Diagnostic,
	geste: Geste,
): models.diagnostic.Diagnostic {
	switch (geste.id) {
		case "isolation-murs":
			return withIsolationMurs(data);
		case "isolation-planchers-bas":
			return withIsolationPlanchersBas(data);
		case "isolation-planchers-hauts":
			return withIsolationPlanchersHauts(data);
		case "isolation-baies":
			return withIsolationBaies(data);
		case "isolation-portes":
			return withIsolationPortes(data);
		case "protection-solaire":
			return withProtectionSolaire(data);
		case "chauffage":
			return withChauffage(data);
		case "ecs":
			return withEcs(data);
		case "refroidissement":
			return withRefroidissement(data);
		case "ventilation":
			return withVentilation(data);
		case "production":
			return withProduction(data);
		default:
			return data;
	}
}

export function withIsolationMurs(
	data: models.diagnostic.Diagnostic,
): models.diagnostic.Diagnostic {
	return {
		...data,
		enveloppe: {
			...data.enveloppe,
			murs: data.enveloppe.murs.map((paroi) => ({
				...paroi,
				isolation: {
					etat: true,
					type: "ite",
					epaisseur: 250,
					resistance_thermique: 5.5,
					annee_installation: null,
				},
			})),
		},
	};
}

export function withIsolationPlanchersBas(
	data: models.diagnostic.Diagnostic,
): models.diagnostic.Diagnostic {
	return {
		...data,
		enveloppe: {
			...data.enveloppe,
			planchers_bas: data.enveloppe.planchers_bas.map((paroi) => ({
				...paroi,
				isolation: {
					etat: true,
					type: "ite",
					epaisseur: 200,
					resistance_thermique: 4.5,
					annee_installation: null,
				},
			})),
		},
	};
}

export function withIsolationPlanchersHauts(
	data: models.diagnostic.Diagnostic,
): models.diagnostic.Diagnostic {
	return {
		...data,
		enveloppe: {
			...data.enveloppe,
			planchers_hauts: data.enveloppe.planchers_hauts.map((paroi) => ({
				...paroi,
				isolation: {
					etat: true,
					type: "ite",
					epaisseur: 300,
					resistance_thermique: 7.5,
					annee_installation: null,
				},
			})),
		},
	};
}

export function withIsolationMenuiseries(
	data: models.diagnostic.Diagnostic,
): models.diagnostic.Diagnostic {
	return withIsolationBaies(withIsolationPortes(data));
}

export function withIsolationBaies(
	data: models.diagnostic.Diagnostic,
): models.diagnostic.Diagnostic {
	return {
		...data,
		enveloppe: {
			...data.enveloppe,
			baies: data.enveloppe.baies.map((baie) => ({
				...baie,
				type: "fenetre_battante",
				uw: 1.2,
				sw: null,
				survitrage: null,
				vitrage: {
					type: "double_vitrage_fe",
					nature_lame: "argon",
					epaisseur_lame: 12,
				},
				menuiserie: {
					materiau: "pvc",
					largeur_dormant: 60,
					presence_soubassement: false,
					presence_joint: true,
					presence_retour_isolation: true,
					presence_rupteur_pont_thermique: true,
				},
			})),
		},
	};
}

export function withIsolationPortes(
	data: models.diagnostic.Diagnostic,
): models.diagnostic.Diagnostic {
	return {
		...data,
		enveloppe: {
			...data.enveloppe,
			portes: data.enveloppe.portes.map((porte) => ({
				...porte,
				isolation: true,
				materiau: "pvc",
				u: 1.2,
				menuiserie: {
					largeur_dormant: 60,
					presence_joint: true,
					presence_retour_isolation: true,
				},
			})),
		},
	};
}

export function withProtectionSolaire(
	data: models.diagnostic.Diagnostic,
): models.diagnostic.Diagnostic {
	return {
		...data,
		enveloppe: {
			...data.enveloppe,
			baies: data.enveloppe.baies.map((baie) => ({
				...baie,
				type_fermeture: "fermeture_isolee_sans_ajours",
				presence_protection_solaire: true,
			})),
		},
	};
}

export function withChauffage(
	data: models.diagnostic.Diagnostic,
): models.diagnostic.Diagnostic {
	const generateur: models.chauffage.generateur.Generateur = {
		id: uuid(),
		description: "Pompe à chaleur air/eau",
		type: "pac_air_eau",
		energie: "electricite",
		bienergie: null,
		annee_installation: null,
		position: {
			cascade: null,
			position_chaudiere: null,
			generateur_collectif: false,
			generateur_multi_batiment: false,
			position_volume_chauffe: true,
			generateur_mixte_id: null,
			reseau_chaleur_id: null,
		},
		signaletique: {
			scop: 3.5,
			pn: null,
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
	if (data.chauffage.emetteurs.length === 0) {
		generateur.type = "pac_air_air";
	}

	const installations = data.chauffage.installations.map((installation) => {
		return {
			...installation,
			systemes: installation.systemes.map((systeme) => ({
				...systeme,
				generateur_id: generateur.id,
			})),
		};
	});

	return {
		...data,
		chauffage: {
			...data.chauffage,
			generateurs: [generateur],
			installations: installations,
		},
	};
}

export function withEcs(
	data: models.diagnostic.Diagnostic,
): models.diagnostic.Diagnostic {
	const generateur: models.ecs.generateur.Generateur = {
		id: uuid(),
		description: "Chauffe-eau thermodynamique",
		type: "cet_air_exterieur",
		energie: "electricite",
		bienergie: null,
		annee_installation: null,
		stockage: {
			volume: 200,
			type: "integre",
			position_volume_chauffe: true,
		},
		position: {
			position_chauffe_eau: null,
			generateur_collectif: false,
			generateur_multi_batiment: false,
			position_volume_chauffe: true,
			generateur_mixte_id: null,
			reseau_chaleur_id: null,
		},
		signaletique: {
			cop: 6,
			pn: null,
			label: null,
			mode_combustion: null,
			presence_ventouse: null,
			pveilleuse: null,
			qp0: null,
			rpn: null,
		},
	};

	const installations: models.ecs.installation.Installation[] =
		data.ecs.installations.map((installation) => {
			return {
				...installation,
				systemes: installation.systemes.map((systeme) => ({
					...systeme,
					generateur_id: generateur.id,
					reseau: {
						...systeme.reseau,
						isolation: true,
					},
				})),
			};
		});

	return {
		...data,
		ecs: {
			generateurs: [generateur],
			installations: installations,
		},
	};
}

export function withRefroidissement(
	data: models.diagnostic.Diagnostic,
): models.diagnostic.Diagnostic {
	const generateur: models.refroidissement.generateur.Generateur = {
		id: uuid(),
		description: "Pompe à chaleur air/air",
		type: "pac_air_air",
		energie: "electricite",
		seer: 7.5,
		annee_installation: null,
		reseau_froid_id: null,
	};
	const installation: models.refroidissement.installation.Installation = {
		id: uuid(),
		description: "Installation de refroidissement",
		surface: data.batiment.surface_habitable,
		generateurs: [generateur.id],
	};
	return {
		...data,
		refroidissement: {
			generateurs: [generateur],
			installations: [installation],
		},
	};
}

export function withVentilation(
	data: models.diagnostic.Diagnostic,
): models.diagnostic.Diagnostic {
	return {
		...data,
		ventilation: {
			installations: [
				{
					id: uuid(),
					description: "VMC double flux",
					surface: data.batiment.surface_habitable,
					type: "vmc_double_flux",
					presence_echangeur_thermique: true,
					installation_collective: false,
					annee_installation: null,
				},
			],
		},
	};
}

export function withProduction(
	data: models.diagnostic.Diagnostic,
): models.diagnostic.Diagnostic {
	return {
		...data,
		production: {
			panneaux_photovoltaiques: [
				{
					id: uuid(),
					description: "Panneaux photovoltaïques",
					orientation: "sud_est",
					inclinaison: 30,
					modules: 1,
					surface: 5,
					installation_collective: false,
				},
			],
		},
	};
}
