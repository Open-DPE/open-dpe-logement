import * as models from "@open-dpe-logement/models";
import { v4 as uuid } from "uuid";
import _geste from "../data/geste/gestes.json";
import _postes from "../data/geste/postes.json";

export const gestes = _geste as Geste[];

export const postes: Poste[] = _postes;

export type Poste = {
	id: string;
	titre: string;
};

export type Geste =
	| IsolationParois
	| IsolationMenuiseries
	| ProtectionSolaire
	| ChauffeEauThermodynamique
	| VMCDoubleFlux
	| PanneauPhotovoltaique;

export function withGeste(
	diagnostic: models.diagnostic.Diagnostic,
	geste: Geste,
): models.diagnostic.Diagnostic {
	switch (geste.poste) {
		case "isolation-murs":
		case "isolation-planchers-bas":
		case "isolation-planchers-hauts":
			return withIsolationParois(diagnostic, geste);
		case "isolation-menuiseries":
			return withIsolationMenuiseries(diagnostic, geste);
		case "protection-solaire":
			return withProtectionSolaire(diagnostic, geste);
		case "ecs":
			return withChauffeEauThermodynamique(diagnostic, geste);
		case "ventilation":
			return withVMCDoubleFlux(diagnostic, geste);
		case "production":
			return withPanneauPhotovoltaique(diagnostic, geste);
	}
}

type CreateGeste<
	T extends {
		poste?: string;
		data: object;
	},
> = {
	id: string;
	poste: string;
	titre: string;
	description: string;
} & T;

export type IsolationParois = CreateGeste<{
	poste:
		| "isolation-murs"
		| "isolation-planchers-bas"
		| "isolation-planchers-hauts";
	data: models.enveloppe.common.IsolationConnue;
}>;

export function withIsolationParois(
	diagnostic: models.diagnostic.Diagnostic,
	geste: IsolationParois,
): models.diagnostic.Diagnostic {
	const data = structuredClone(diagnostic);
	switch (geste.poste) {
		case "isolation-murs":
			data.enveloppe.murs = data.enveloppe.murs.map((paroi) => ({
				...paroi,
				isolation: geste.data,
			}));
			return data;

		case "isolation-planchers-bas":
			data.enveloppe.planchers_bas = data.enveloppe.planchers_bas.map(
				(paroi) => ({
					...paroi,
					isolation: geste.data,
				}),
			);
			return data;

		case "isolation-planchers-hauts":
			data.enveloppe.planchers_hauts = data.enveloppe.planchers_hauts.map(
				(paroi) => ({
					...paroi,
					isolation: geste.data,
				}),
			);
			return data;
	}
}

export type IsolationMenuiseries = IsolationBaies | IsolationPortes;

export function withIsolationMenuiseries(
	diagnostic: models.diagnostic.Diagnostic,
	geste: IsolationMenuiseries,
): models.diagnostic.Diagnostic {
	switch (geste.id) {
		case "isolation-baies":
			return withIsolationBaies(diagnostic, geste);
		case "isolation-portes":
			return withIsolationPortes(diagnostic, geste);
	}
}

export type IsolationBaies = CreateGeste<{
	poste: "isolation-menuiseries";
	id: "isolation-baies";
	data: Pick<
		models.enveloppe.baie.BaieFenetreOuPorteFenetre,
		"type" | "uw" | "sw" | "menuiserie" | "vitrage" | "survitrage"
	>;
}>;

export function withIsolationBaies(
	diagnostic: models.diagnostic.Diagnostic,
	geste: IsolationBaies,
): models.diagnostic.Diagnostic {
	const data = structuredClone(diagnostic);
	data.enveloppe.baies = data.enveloppe.baies.map((baie) => ({
		...baie,
		...geste.data,
	}));
	return data;
}

export type IsolationPortes = CreateGeste<{
	poste: "isolation-menuiseries";
	id: "isolation-portes";
	data: Pick<
		models.enveloppe.porte.Porte,
		"isolation" | "materiau" | "u" | "menuiserie"
	>;
}>;

export function withIsolationPortes(
	diagnostic: models.diagnostic.Diagnostic,
	geste: IsolationPortes,
): models.diagnostic.Diagnostic {
	const data = structuredClone(diagnostic);
	data.enveloppe.portes = data.enveloppe.portes.map((porte) => ({
		...porte,
		...geste.data,
	}));
	return data;
}

export type ProtectionSolaire = CreateGeste<{
	poste: "protection-solaire";
	data: Pick<
		models.enveloppe.baie.Baie,
		"type_fermeture" | "presence_protection_solaire"
	>;
}>;

export function withProtectionSolaire(
	diagnostic: models.diagnostic.Diagnostic,
	geste: ProtectionSolaire,
): models.diagnostic.Diagnostic {
	const data = structuredClone(diagnostic);
	data.enveloppe.baies = data.enveloppe.baies.map((baie) => ({
		...baie,
		...geste.data,
	}));
	return data;
}

export type ChauffeEauThermodynamique = CreateGeste<{
	poste: "ecs";
	data: Pick<
		models.ecs.generateur.ChauffeEauThermodynamique,
		"type" | "energie" | "bienergie" | "signaletique" | "position" | "stockage"
	>;
}>;

export function withChauffeEauThermodynamique(
	diagnostic: models.diagnostic.Diagnostic,
	geste: ChauffeEauThermodynamique,
): models.diagnostic.Diagnostic {
	const data = structuredClone(diagnostic);
	const generateurs = diagnostic.ecs.generateurs.map((generateur) => ({
		...generateur,
		...geste.data,
	}));
	data.ecs.generateurs = models.common.toNonEmptyArray(generateurs);
	data.chauffage.generateurs.forEach((item, index) => {
		if (generateurs.some((g) => g.id === item.id)) {
			data.chauffage.generateurs[index].position.generateur_mixte_id = null;
		}
	});
	return data;
}

export type VMCDoubleFlux = CreateGeste<{
	poste: "ventilation";
	data: Pick<
		models.ventilation.installation.InstallationVMCDoubleFlux,
		"type" | "installation_collective" | "presence_echangeur_thermique"
	>;
}>;

export function withVMCDoubleFlux(
	diagnostic: models.diagnostic.Diagnostic,
	geste: VMCDoubleFlux,
): models.diagnostic.Diagnostic {
	const data = structuredClone(diagnostic);
	const installations = diagnostic.ventilation.installations.map(
		(installation) => ({
			...installation,
			...geste.data,
		}),
	);
	data.ventilation.installations = models.common.toNonEmptyArray(installations);
	return data;
}

export type PanneauPhotovoltaique = CreateGeste<{
	poste: "production";
	data: Pick<
		models.production.panneauPhotovoltaique.PanneauPhotovoltaique,
		| "description"
		| "orientation"
		| "inclinaison"
		| "modules"
		| "surface"
		| "installation_collective"
	>;
}>;

export function withPanneauPhotovoltaique(
	diagnostic: models.diagnostic.Diagnostic,
	geste: PanneauPhotovoltaique,
): models.diagnostic.Diagnostic {
	const data = structuredClone(diagnostic);
	data.production.panneaux_photovoltaiques = [
		{
			id: uuid(),
			...geste.data,
		},
	];
	return data;
}
