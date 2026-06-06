import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as climat from "#rules/climat/registry.js";
import * as generateurChauffage from "#rules/chauffage/generateur/registry.js";
import * as ecs from "#rules/ecs/registry.js";
import * as production from "#rules/production/registry.js";
import * as installation from "#rules/ecs/installation/registry.js";
import * as systeme from "#rules/ecs/systeme/registry.js";
import * as formules from "./formulas.js";
import * as utils from "./utils.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	ctx.diagnostic.ecs.generateurs.forEach((g) => {
		ctx.register(ID, RULES.consommations, g, () => consommations(ctx, g));
		ctx.register(ID, RULES.cecs, g, () => cecs(ctx, g));
		ctx.register(ID, RULES.cecs_elec, g, () => cecs_elec(ctx, g));
		ctx.register(ID, RULES.caux_gen, g, () => caux_gen(ctx, g));
		ctx.register(ID, RULES.caux_gen_enr, g, () => caux_gen_enr(ctx, g));
		ctx.register(ID, RULES.rdim, g, () => rdim(ctx, g));
		ctx.register(ID, RULES.pn, g, () => pn(ctx, g));
		ctx.register(ID, RULES.pdim, g, () => pdim(ctx, g));
		ctx.register(ID, RULES.pecs, g, () => pecs(g));
		ctx.register(ID, RULES.paux, g, () => paux(ctx, g));
		ctx.register(ID, RULES.cop, g, () => cop(ctx, g));
		ctx.register(ID, RULES.rpn, g, () => rpn(ctx, g));
		ctx.register(ID, RULES.qp0, g, () => qp0(ctx, g));
		ctx.register(ID, RULES.pveilleuse, g, () => pveilleuse(ctx, g));
		ctx.register(ID, RULES.cr, g, () => cr(g));
		ctx.register(ID, RULES.qgw, g, () => qgw(ctx, g));
		ctx.register(ID, RULES.qgen, g, () => qgen(ctx, g));
	});
}

type Generateur = models.ecs.generateur.Generateur;

export function consommations(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formules.calcule_consommations> {
	return formules.calcule_consommations({
		consommations: ctx.diagnostic.ecs.installations.flatMap((i) =>
			i.systemes
				.filter((s) => s.generateur_id === generateur.id)
				.map((s) => ctx.resolve(systeme.ID, systeme.RULES.consommations, s)),
		),
		caux_gen: ctx.resolve(ID, RULES.caux_gen, generateur),
		caux_gen_enr: ctx.resolve(ID, RULES.caux_gen_enr, generateur),
	});
}

export function cecs(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formules.calcule_cecs> {
	return formules.calcule_cecs({
		cecs: ctx.diagnostic.ecs.installations.flatMap((i) =>
			i.systemes
				.filter((s) => s.generateur_id === generateur.id)
				.map((s) => ctx.resolve(systeme.ID, systeme.RULES.cecs, s)),
		),
	});
}

export function cecs_elec(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formules.calcule_cecs_elec> {
	return formules.calcule_cecs_elec({
		cecs_elec: ctx.diagnostic.ecs.installations.flatMap((i) =>
			i.systemes
				.filter((s) => s.generateur_id === generateur.id)
				.map((s) => ctx.resolve(systeme.ID, systeme.RULES.cecs_elec, s)),
		),
	});
}

export function caux_gen(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formules.calcule_caux_gen> {
	return formules.calcule_caux_gen({
		becs: ctx.resolve(ecs.ID, ecs.RULES.becs),
		pn: ctx.resolve(ID, RULES.pn, generateur),
		paux: ctx.resolve(ID, RULES.paux, generateur),
		rdim: ctx.resolve(ID, RULES.rdim, generateur),
	});
}

export function caux_gen_enr(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formules.calcule_caux_gen_enr> {
	return formules.calcule_caux_gen_enr({
		celec: ctx.resolve(production.ID, production.RULES.celec),
		celec_ac: ctx.resolve(production.ID, production.RULES.celec_ac),
		caux_gen: ctx.resolve(ID, RULES.caux_gen, generateur),
	});
}

export function rdim(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formules.calcule_rdim> {
	return formules.calcule_rdim({
		systemes: ctx.diagnostic.ecs.installations.flatMap((i) =>
			i.systemes
				.filter((s) => s.generateur_id === generateur.id)
				.map((s) => ({
					rdim: ctx.resolve(systeme.ID, systeme.RULES.rdim, s),
					rdim_installation: ctx.resolve(
						installation.ID,
						installation.RULES.rdim,
						i,
					),
				})),
		),
	});
}

export function pn(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formules.calcule_pn> {
	return formules.calcule_pn({
		pn_saisi: generateur.signaletique.pn,
		pdim: ctx.resolve(ID, RULES.pdim, generateur),
	});
}

export function pdim(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formules.calcule_pdim> {
	return formules.calcule_pdim({
		pecs: ctx.resolve(ID, RULES.pecs, generateur),
		pch: generateur.position.generateur_mixte_id
			? ctx.resolve(generateurChauffage.ID, generateurChauffage.RULES.pch, {
					id: generateur.position.generateur_mixte_id,
				})
			: null,
	});
}

export function pecs(
	generateur: Generateur,
): ReturnType<typeof formules.calcule_pecs> {
	return formules.calcule_pecs({
		pn_saisi: generateur.signaletique.pn,
		volume_stockage: volume_stockage(generateur),
	});
}

export function paux(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formules.calcule_paux> {
	return formules.calcule_paux({
		type_generateur: type_generateur(generateur),
		energie_generateur: energie_generateur(generateur),
		generateur_multi_batiment: generateur.position.generateur_multi_batiment,
		presence_ventouse: presence_ventouse(generateur),
		pn: ctx.resolve(ID, RULES.pn, generateur),
	});
}

export function cop(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formules.calcule_cop> | null {
	const props = {
		type_generateur: type_generateur(generateur),
	};

	return utils.is_generateur_thermodynamique(props)
		? formules.calcule_cop({
				...props,
				...{
					cop_saisi: generateur.signaletique.cop,
					annee_installation: annee_installation(ctx, generateur),
					zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
				},
			})
		: null;
}

export function rpn(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formules.calcule_combustion>["rpn"] | null {
	return combustion(ctx, generateur)?.rpn ?? null;
}

export function qp0(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formules.calcule_combustion>["qp0"] | null {
	return combustion(ctx, generateur)?.qp0 ?? null;
}

export function pveilleuse(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formules.calcule_combustion>["pveilleuse"] | null {
	return combustion(ctx, generateur)?.pveilleuse ?? null;
}

export function combustion(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formules.calcule_combustion> | null {
	return ctx.once(ID, "combustion", generateur, () => {
		const props = {
			type_generateur: type_generateur(generateur),
			energie_generateur: energie_generateur(generateur),
			bienergie_generateur: generateur.bienergie,
		};

		switch (true) {
			case utils.is_generateur_combustion(props):
			case utils.is_pac_hybride(props):
				return formules.calcule_combustion({
					...props,
					...{
						rpn_saisi: generateur.signaletique.rpn,
						qp0_saisi: generateur.signaletique.qp0,
						pveilleuse_saisi: generateur.signaletique.pveilleuse,
						mode_combustion: mode_combustion(generateur),
						volume_stockage: volume_stockage(generateur),
						annee_installation: annee_installation(ctx, generateur),
						presence_ventouse: presence_ventouse(generateur),
						pn: ctx.resolve(ID, RULES.pn, generateur),
					},
				});
			default:
				return null;
		}
	});
}

export function cr(
	generateur: Generateur,
): ReturnType<typeof formules.calcule_cr> {
	return formules.calcule_cr({
		type_generateur: type_generateur(generateur),
		energie_generateur: energie_generateur(generateur),
		position_chauffe_eau: generateur.position.position_chauffe_eau,
		label_generateur: generateur.signaletique.label,
		volume_stockage: volume_stockage(generateur),
	});
}

export function qgw(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formules.calcule_qgw> {
	return formules.calcule_qgw({
		energie_generateur: energie_generateur(generateur),
		volume_stockage: volume_stockage(generateur),
		cr: ctx.resolve(ID, RULES.cr, generateur),
	});
}

export function qgen(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formules.calcule_qgen> {
	return formules.calcule_qgen({
		generateur_mixte: generateur.position.generateur_mixte_id !== null,
		presence_ventouse: presence_ventouse(generateur),
		qp0: ctx.resolve(ID, RULES.qp0, generateur) ?? 0,
	});
}

export function type_generateur(
	generateur: Generateur,
): ReturnType<typeof formules.set_type_generateur> {
	return formules.set_type_generateur({ type_generateur: generateur.type });
}

export function energie_generateur(
	generateur: Generateur,
): ReturnType<typeof formules.set_energie_generateur> {
	return formules.set_energie_generateur({
		energie_generateur: generateur.energie,
	});
}

export function mode_combustion(
	generateur: Generateur,
): ReturnType<typeof formules.set_mode_combustion> {
	return formules.set_mode_combustion({
		mode_combustion: generateur.signaletique.mode_combustion,
	});
}

export function presence_ventouse(
	generateur: Generateur,
): ReturnType<typeof formules.set_presence_ventouse> {
	return formules.set_presence_ventouse({
		presence_ventouse: generateur.signaletique.presence_ventouse,
	});
}

export function annee_installation(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formules.set_annee_installation> {
	return formules.set_annee_installation({
		annee_installation: generateur.annee_installation,
		annee_construction_batiment: ctx.diagnostic.batiment.annee_construction,
	});
}

export function volume_stockage(
	generateur: Generateur,
): ReturnType<typeof formules.set_volume_stockage> {
	return formules.set_volume_stockage({
		volume_stockage: generateur.stockage?.volume ?? null,
	});
}

export function applique(ctx: Context, item: Generateur): models.ecs.generateur.GenerateurWithData {
	return {
		...item,
		data: {
			rdim: ctx.resolve(ID, RULES.rdim, item),
			pn: ctx.resolve(ID, RULES.pn, item),
			pdim: ctx.resolve(ID, RULES.pdim, item),
			pecs: ctx.resolve(ID, RULES.pecs, item),
			paux: ctx.resolve(ID, RULES.paux, item),
			cop: ctx.resolve(ID, RULES.cop, item),
			rpn: ctx.resolve(ID, RULES.rpn, item),
			qp0: ctx.resolve(ID, RULES.qp0, item),
			pveilleuse: ctx.resolve(ID, RULES.pveilleuse, item),
			cr: ctx.resolve(ID, RULES.cr, item),
			qgw: ctx.resolve(ID, RULES.qgw, item),
			qgen: ctx.resolve(ID, RULES.qgen, item),
			consommations: ctx.resolve(ID, RULES.consommations, item),
		},
	};
}
