import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as climat from "#rules/climat/registry.js";
import * as generateurEcsRules from "#rules/ecs/generateur/registry.js";
import * as chauffage from "#rules/chauffage/registry.js";
import * as emetteurRules from "#rules/chauffage/emetteur/index.js";
import * as installationRules from "#rules/chauffage/installation/registry.js";
import * as systemeRules from "#rules/chauffage/systeme/registry.js";
import * as formulas from "./formulas.js";
import * as utils from "./utils.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context) {
	ctx.diagnostic.chauffage.generateurs.forEach((item) => {
		ctx.register(ID, RULES.cch, item, () => cch(ctx, item));
		ctx.register(ID, RULES.cch_elec, item, () => cch_elec(ctx, item));
		ctx.register(ID, RULES.caux, item, () => caux(ctx, item));
		ctx.register(ID, RULES.rdim, item, () => rdim(ctx, item));
		ctx.register(ID, RULES.pn, item, () => pn(ctx, item));
		ctx.register(ID, RULES.pdim, item, () => pdim(ctx, item));
		ctx.register(ID, RULES.pch, item, () => pch(ctx, item));
		ctx.register(ID, RULES.paux, item, () => paux(ctx, item));
		ctx.register(ID, RULES.rpint, item, () => rpint(ctx, item));
		ctx.register(ID, RULES.rpn, item, () => rpn(ctx, item));
		ctx.register(ID, RULES.qp0, item, () => qp0(ctx, item));
		ctx.register(ID, RULES.pveilleuse, item, () => pveilleuse(ctx, item));
		ctx.register(ID, RULES.scop, item, () => scop(ctx, item));
		ctx.register(ID, RULES.tfonc30, item, () => tfonc30(ctx, item));
		ctx.register(ID, RULES.tfonc100, item, () => tfonc100(ctx, item));
		ctx.register(ID, RULES.qgen_rec, item, () => qgen_rec(ctx, item));
		ctx.register(ID, RULES.qgen, item, () => qgen(ctx, item));
	});
}

type Generateur = models.chauffage.generateur.Generateur;

export function cch(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_cch> {
	return formulas.calcule_cch({
		cch: models.chauffage
			.get_systemes(ctx.diagnostic.chauffage)
			.filter((s) => s.generateur_id === generateur.id)
			.map((s) => ctx.resolve(systemeRules.ID, systemeRules.RULES.cch, s)),
	});
}

export function cch_elec(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_cch_elec> {
	return formulas.calcule_cch_elec({
		cch: cch(ctx, generateur),
		energie: energie_generateur(generateur),
	});
}

export function caux(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_caux> {
	return formulas.calcule_caux({
		bch: ctx.resolve(chauffage.ID, chauffage.RULES.bch),
		pn: ctx.resolve(ID, RULES.pn, generateur),
		paux: ctx.resolve(ID, RULES.paux, generateur),
		rdim: ctx.resolve(ID, RULES.rdim, generateur),
	});
}

export function rdim(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_rdim> {
	const systemes: Parameters<typeof formulas.calcule_rdim>[0]["systemes"] = [];

	ctx.diagnostic.chauffage.installations.forEach((installation) => {
		installation.systemes.forEach((systeme) => {
			if (systeme.generateur_id === generateur.id) {
				systemes.push({
					rdim: ctx.resolve(systemeRules.ID, systemeRules.RULES.rdim, systeme),
					rdim_installation: ctx.resolve(
						installationRules.ID,
						installationRules.RULES.rdim,
						installation,
					),
				});
			}
		});
	});
	return formulas.calcule_rdim({ systemes });
}

export function pn(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_pn> {
	return formulas.calcule_pn({
		pn_saisi: generateur.signaletique.pn,
		pdim: ctx.resolve(ID, RULES.pdim, generateur),
	});
}

export function pdim(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_pdim> {
	const generateur_mixte_id = generateur.position.generateur_mixte_id;
	return formulas.calcule_pdim({
		pch: ctx.resolve(ID, RULES.pch, generateur),
		pecs: generateur_mixte_id
			? ctx.resolve(generateurEcsRules.ID, generateurEcsRules.RULES.pdim, {
					id: generateur_mixte_id,
				})
			: null,
	});
}

export function pch(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_pch> {
	return formulas.calcule_pch({
		pn_saisi: generateur.signaletique.pn,
		pch_systemes: systemes(ctx, generateur).map((s) =>
			ctx.resolve(systemeRules.ID, systemeRules.RULES.pch, s),
		),
	});
}

export function paux(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_paux> {
	return formulas.calcule_paux({
		type_generateur: type_generateur(generateur),
		energie_generateur: energie_generateur(generateur),
		generateur_multi_batiment: generateur.position.generateur_multi_batiment,
		presence_ventouse: presence_ventouse(generateur),
		pn: ctx.resolve(ID, RULES.pn, generateur),
	});
}

export function rpn(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_combustion>["rpn"] | null {
	return combustion(ctx, generateur)?.rpn ?? null;
}

export function rpint(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_combustion>["rpint"] | null {
	return combustion(ctx, generateur)?.rpint ?? null;
}

export function qp0(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_combustion>["qp0"] | null {
	return combustion(ctx, generateur)?.qp0 ?? null;
}

export function pveilleuse(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_combustion>["pveilleuse"] | null {
	return combustion(ctx, generateur)?.pveilleuse ?? null;
}

export function combustion(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_combustion> | null {
	return ctx.once(ID, "combustion", generateur, () => {
		const props = {
			type_generateur: type_generateur(generateur),
			energie_generateur: energie_generateur(generateur),
			bienergie_generateur: generateur.bienergie,
			generateur_multi_batiment: generateur.position.generateur_multi_batiment,
		};

		switch (true) {
			case utils.is_chaudiere_combustion(props):
			case utils.is_poele_bouilleur(props):
			case utils.is_generateur_air_chaud_combustion(props):
			case utils.is_radiateur_gaz(props):
			case utils.is_pac_hybride(props):
				return formulas.calcule_combustion({
					...props,
					...{
						rpn_saisi: generateur.signaletique.rpn,
						rpint_saisi: generateur.signaletique.rpint,
						qp0_saisi: generateur.signaletique.qp0,
						pveilleuse_saisi: generateur.signaletique.pveilleuse,
						mode_combustion: mode_combustion(generateur),
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

export function scop(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_scop> | null {
	const props = {
		type_generateur: type_generateur(generateur),
		energie_generateur: energie_generateur(generateur),
		bienergie_generateur: generateur.bienergie,
		generateur_multi_batiment: generateur.position.generateur_multi_batiment,
	};

	if (false === utils.is_generateur_thermodynamique(props)) return null;

	return formulas.calcule_scop({
		...props,
		...{
			scop_saisi: generateur.signaletique.scop,
			zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
			annee_installation: annee_installation(ctx, generateur),
			types_emetteur: emetteurs(ctx, generateur).map(({ type }) => type),
		},
	});
}

export function tfonc30(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_tfonc30> | null {
	const props = {
		type_generateur: type_generateur(generateur),
		energie_generateur: energie_generateur(generateur),
		bienergie_generateur: generateur.bienergie,
		generateur_multi_batiment: generateur.position.generateur_multi_batiment,
	};

	if (false === utils.is_chaudiere_combustion(props)) return null;

	return formulas.calcule_tfonc30({
		...props,
		...{
			tfonc30_saisi: generateur.signaletique.tfonc30,
			mode_combustion: mode_combustion(generateur),
			annee_installation_generateur: annee_installation(ctx, generateur),
			emetteurs: emetteurs(ctx, generateur).map((e) => ({
				temperature_distribution:
					emetteurRules.rules.temperature_distribution(e),
				annee_installation: emetteurRules.rules.annee_installation(ctx, e),
			})),
		},
	});
}

export function tfonc100(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_tfonc100> | null {
	const props = {
		type_generateur: type_generateur(generateur),
		energie_generateur: energie_generateur(generateur),
		bienergie_generateur: generateur.bienergie,
		generateur_multi_batiment: generateur.position.generateur_multi_batiment,
	};

	if (false === utils.is_chaudiere_combustion(props)) return null;

	return formulas.calcule_tfonc100({
		...props,
		...{
			tfonc100_saisi: generateur.signaletique.tfonc100,
			annee_installation_generateur: annee_installation(ctx, generateur),
			emetteurs: emetteurs(ctx, generateur).map((e) => ({
				temperature_distribution:
					emetteurRules.rules.temperature_distribution(e),
				annee_installation: emetteurRules.rules.annee_installation(ctx, e),
			})),
		},
	});
}

export function qgen_rec(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_qgen_rec> {
	return formulas.calcule_qgen_rec({
		generateur_mixte: generateur.position.generateur_mixte_id !== null,
		qgen: ctx.resolve(ID, RULES.qgen, generateur),
		pn: ctx.resolve(ID, RULES.pn, generateur),
		bch_hp: ctx.resolve(chauffage.ID, chauffage.RULES.bch_hp),
		nref: ctx.resolve(chauffage.ID, chauffage.RULES.nref),
	});
}

export function qgen(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_qgen> {
	return formulas.calcule_qgen({
		presence_ventouse: presence_ventouse(generateur),
		qp0: ctx.resolve(ID, RULES.qp0, generateur),
	});
}

export function type_generateur(
	generateur: Generateur,
): ReturnType<typeof formulas.set_type_generateur> {
	return formulas.set_type_generateur({ type_generateur: generateur.type });
}

export function energie_generateur(
	generateur: Generateur,
): ReturnType<typeof formulas.set_energie_generateur> {
	return formulas.set_energie_generateur({
		energie_generateur: generateur.energie,
	});
}

export function mode_combustion(
	generateur: Generateur,
): ReturnType<typeof formulas.set_mode_combustion> {
	return formulas.set_mode_combustion({
		mode_combustion: generateur.signaletique.mode_combustion,
	});
}

export function presence_ventouse(
	generateur: Generateur,
): ReturnType<typeof formulas.set_presence_ventouse> {
	return formulas.set_presence_ventouse({
		presence_ventouse: generateur.signaletique.presence_ventouse,
	});
}

export function presence_regulation(
	generateur: Generateur,
): ReturnType<typeof formulas.set_presence_regulation> {
	return formulas.set_presence_regulation({
		presence_regulation: generateur.signaletique.presence_regulation,
	});
}

export function annee_installation(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.set_annee_installation> {
	return formulas.set_annee_installation({
		annee_installation: generateur.annee_installation,
		annee_construction_batiment: ctx.diagnostic.batiment.annee_construction,
	});
}

function emetteurs(
	ctx: Context,
	generateur: Generateur,
): models.chauffage.emetteur.Emetteur[] {
	const systemes = models.chauffage
		.get_systemes(ctx.diagnostic.chauffage)
		.filter((s) => s.generateur_id === generateur.id);

	return ctx.diagnostic.chauffage.emetteurs.filter((e) =>
		systemes.some((s) => s.reseau?.emetteurs.includes(e.id)),
	);
}

function systemes(
	ctx: Context,
	generateur: Generateur,
): models.chauffage.systeme.Systeme[] {
	return models.chauffage
		.get_systemes(ctx.diagnostic.chauffage)
		.filter((s) => s.generateur_id === generateur.id);
}
