import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

type Emetteur = models.chauffage.emetteur.Emetteur;

export function calcule(
	ctx: Context,
	item: Emetteur,
): models.chauffage.emetteur.EmetteurData {
	return {
		delta_pem: delta_pem(ctx, item),
		fcot: fcot(ctx, item),
		dtheta_dim: dtheta_dim(ctx, item),
	};
}

export function delta_pem(
	ctx: Context,
	item: Emetteur,
): ReturnType<typeof formulas.calcule_delta_pem> {
	return ctx.register(NAMESPACE, RULES.delta_pem, item, () =>
		formulas.calcule_delta_pem({
			type_emetteur: item.type,
		}),
	);
}

export function fcot(
	ctx: Context,
	item: Emetteur,
): ReturnType<typeof formulas.calcule_fcot> {
	return ctx.register(NAMESPACE, RULES.fcot, item, () =>
		formulas.calcule_fcot({
			type_emetteur: item.type,
		}),
	);
}

export function dtheta_dim(
	ctx: Context,
	item: Emetteur,
): ReturnType<typeof formulas.calcule_dtheta_dim> {
	return ctx.register(NAMESPACE, RULES.dtheta_dim, item, () =>
		formulas.calcule_dtheta_dim({
			temperature_distribution: temperature_distribution(item),
		}),
	);
}

export function temperature_distribution(
	item: Emetteur,
): ReturnType<typeof formulas.set_temperature_distribution> {
	return formulas.set_temperature_distribution({
		temperature_distribution: item.temperature_distribution,
	});
}

export function annee_installation(
	ctx: Context,
	item: Emetteur,
): ReturnType<typeof formulas.set_annee_installation> {
	return formulas.set_annee_installation({
		annee_installation: item.annee_installation,
		annee_construction_batiment: ctx.diagnostic.batiment.annee_construction,
	});
}
