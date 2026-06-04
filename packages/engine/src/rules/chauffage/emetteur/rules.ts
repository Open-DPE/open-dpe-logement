import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(context: Context): void {
	context.diagnostic.chauffage.emetteurs.forEach((e) => {
		context.register(ID, RULES.delta_pem, e, () => delta_pem(e));
		context.register(ID, RULES.fcot, e, () => fcot(e));
		context.register(ID, RULES.dtheta_dim, e, () => dtheta_dim(e));
	});
}

type Emetteur = models.chauffage.emetteur.Emetteur;

export function delta_pem(
	emetteur: Emetteur,
): ReturnType<typeof formulas.calcule_delta_pem> {
	return formulas.calcule_delta_pem({
		type_emetteur: emetteur.type,
	});
}

export function fcot(
	emetteur: Emetteur,
): ReturnType<typeof formulas.calcule_fcot> {
	return formulas.calcule_fcot({
		type_emetteur: emetteur.type,
	});
}

export function dtheta_dim(
	emetteur: Emetteur,
): ReturnType<typeof formulas.calcule_dtheta_dim> {
	return formulas.calcule_dtheta_dim({
		temperature_distribution: temperature_distribution(emetteur),
	});
}

export function temperature_distribution(
	emetteur: Emetteur,
): ReturnType<typeof formulas.set_temperature_distribution> {
	return formulas.set_temperature_distribution({
		temperature_distribution: emetteur.temperature_distribution,
	});
}

export function annee_installation(
	ctx: Context,
	emetteur: Emetteur,
): ReturnType<typeof formulas.set_annee_installation> {
	return formulas.set_annee_installation({
		annee_installation: emetteur.annee_installation,
		annee_construction_batiment: ctx.diagnostic.batiment.annee_construction,
	});
}
