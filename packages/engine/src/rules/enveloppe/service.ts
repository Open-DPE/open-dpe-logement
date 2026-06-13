import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as constants from "#rules/constants.js";
import { NAMESPACE, RULES } from "./constants.js";
import * as baie from "./baie/service.js";
import * as localNonChauffe from "./local-non-chauffe/service.js";
import * as mur from "./mur/service.js";
import * as niveau from "./niveau/service.js";
import * as plancherBas from "./plancher-bas/service.js";
import * as plancherHaut from "./plancher-haut/service.js";
import * as porte from "./porte/service.js";
import * as pontThermique from "./pont-thermique/service.js";

export {
	baie,
	localNonChauffe,
	mur,
	niveau,
	plancherBas,
	plancherHaut,
	pontThermique,
	porte,
};

export function calcule(ctx: Context): models.enveloppe.EnveloppeWithData {
	const niveaux = ctx.diagnostic.enveloppe.niveaux.map((item) =>
		niveau.calcule(ctx, item),
	);

	return {
		...ctx.diagnostic.enveloppe,

		baies: ctx.diagnostic.enveloppe.baies.map((item) =>
			baie.calcule(ctx, item),
		),
		locaux_non_chauffes: ctx.diagnostic.enveloppe.locaux_non_chauffes.map(
			(item) => localNonChauffe.calcule(ctx, item),
		),

		murs: ctx.diagnostic.enveloppe.murs.map((item) => mur.calcule(ctx, item)),

		niveaux: models.common.toNonEmptyArray(niveaux),

		planchers_bas: ctx.diagnostic.enveloppe.planchers_bas.map((item) =>
			plancherBas.calcule(ctx, item),
		),

		planchers_hauts: ctx.diagnostic.enveloppe.planchers_hauts.map((item) =>
			plancherHaut.calcule(ctx, item),
		),

		portes: ctx.diagnostic.enveloppe.portes.map((item) =>
			porte.calcule(ctx, item),
		),

		ponts_thermiques: ctx.diagnostic.enveloppe.ponts_thermiques.map((item) =>
			pontThermique.calcule(ctx, item),
		),

		data: {
			gv: ctx.resolve(NAMESPACE, RULES.gv),
			ubat: ctx.resolve(NAMESPACE, RULES.ubat),
			dp: ctx.resolve(NAMESPACE, RULES.dp),
			dp_murs: ctx.resolve(NAMESPACE, RULES.dp_murs),
			dp_planchers_bas: ctx.resolve(NAMESPACE, RULES.dp_planchers_bas),
			dp_planchers_hauts: ctx.resolve(NAMESPACE, RULES.dp_planchers_hauts),
			dp_baies: ctx.resolve(NAMESPACE, RULES.dp_baies),
			dp_portes: ctx.resolve(NAMESPACE, RULES.dp_portes),
			pt: ctx.resolve(NAMESPACE, RULES.pt),
			dr: ctx.resolve(NAMESPACE, RULES.dr),
			sdep: ctx.resolve(NAMESPACE, RULES.sdep),
			sdep_murs: ctx.resolve(NAMESPACE, RULES.sdep_murs),
			sdep_planchers_bas: ctx.resolve(NAMESPACE, RULES.sdep_planchers_bas),
			sdep_planchers_hauts: ctx.resolve(NAMESPACE, RULES.sdep_planchers_hauts),
			sdep_baies: ctx.resolve(NAMESPACE, RULES.sdep_baies),
			sdep_portes: ctx.resolve(NAMESPACE, RULES.sdep_portes),
			inertie: ctx.resolve(NAMESPACE, RULES.inertie),
			hperm: ctx.resolve(NAMESPACE, RULES.hperm),
			hvent: ctx.resolve(
				constants.ventilation.NAMESPACE,
				constants.ventilation.RULES.hvent,
			),
			presence_joints: ctx.resolve(NAMESPACE, RULES.presence_joints),
			parois_anciennes: ctx.resolve(NAMESPACE, RULES.parois_anciennes),
			isolation_planchers_hauts: ctx.resolve(
				NAMESPACE,
				RULES.isolation_planchers_hauts,
			),
			presence_protection_solaire: ctx.resolve(
				NAMESPACE,
				RULES.presence_protection_solaire,
			),
			logement_traversant: ctx.resolve(NAMESPACE, RULES.logement_traversant),
			sse: models.common.reduceParMois(ctx.resolve(NAMESPACE, RULES.sse)),
		},
	};
}
