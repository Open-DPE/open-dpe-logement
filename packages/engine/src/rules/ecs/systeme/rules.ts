import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as climat from "#rules/climat/registry.js";
import * as generateurRules from "#rules/ecs/generateur/index.js";
import * as installationRegistry from "#rules/ecs/installation/registry.js";
import * as formules from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	ctx.diagnostic.ecs.installations.forEach((i) => {
		i.systemes.forEach((s) => {
			ctx.register(ID, RULES.cecs, s, () => cecs(ctx, i, s));
			ctx.register(ID, RULES.caux_dist, s, () => caux_dist(ctx, s));
			ctx.register(ID, RULES.qcirb, s, () => qcirb(ctx, i, s));
			ctx.register(ID, RULES.qtrac, s, () => qtrac(ctx, i, s));
			ctx.register(ID, RULES.rdim, s, () => rdim(i));
			ctx.register(ID, RULES.iecs, s, () => iecs(ctx, s));
			ctx.register(ID, RULES.rd, s, () => rd(ctx, i, s));
			ctx.register(ID, RULES.rg, s, () => rg(ctx, i, s));
			ctx.register(ID, RULES.rs, s, () => rs(ctx, i, s));
			ctx.register(ID, RULES.rgs, s, () => rgs(ctx, i, s));
		});
	});
}

type Installation = models.ecs.installation.Installation;
type Systeme = models.ecs.systeme.Systeme;

export function cecs(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formules.calcule_cecs> {
	return formules.calcule_cecs({
		becs: ctx.resolve(
			installationRegistry.ID,
			installationRegistry.RULES.becs,
			installation,
		),
		fecs: ctx.resolve(
			installationRegistry.ID,
			installationRegistry.RULES.fecs,
			installation,
		),
		rdim: ctx.resolve(ID, RULES.rdim, systeme),
		iecs: ctx.resolve(ID, RULES.iecs, systeme),
	});
}

export function caux_dist(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formules.calcule_caux_dist> {
	return formules.calcule_caux_dist({
		qtrac: ctx.resolve(ID, RULES.qtrac, item),
		qcirb: ctx.resolve(ID, RULES.qcirb, item),
	});
}

export function qcirb(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formules.calcule_qcirb> {
	return formules.calcule_qcirb({
		nj: ctx.resolve(climat.ID, climat.RULES.nj),
		sh: installation.surface,
		installation_collective: installation.installation_collective,
		bouclage: bouclage_reseau(systeme),
		niveaux_desservis: systeme.reseau.niveaux_desservis,
		qdw: ctx.resolve(
			installationRegistry.ID,
			installationRegistry.RULES.qdw,
			installation,
		),
	});
}

export function qtrac(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formules.calcule_qtrac> {
	return formules.calcule_qtrac({
		becs: ctx.resolve(
			installationRegistry.ID,
			installationRegistry.RULES.becs,
			installation,
		),
		installation_collective: installation.installation_collective,
		bouclage: bouclage_reseau(systeme),
	});
}

export function rdim(
	installation: Installation,
): ReturnType<typeof formules.calcule_rdim> {
	return formules.calcule_rdim({
		n_systemes: installation.systemes.length,
	});
}

export function iecs(
	ctx: Context,
	systeme: Systeme,
): ReturnType<typeof formules.calcule_iecs> {
	return formules.calcule_iecs({
		rd: ctx.resolve(ID, RULES.rd, systeme),
		rg: ctx.resolve(ID, RULES.rg, systeme),
		rs: ctx.resolve(ID, RULES.rs, systeme),
		rgs: ctx.resolve(ID, RULES.rgs, systeme),
	});
}

export function rd(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formules.calcule_rd> {
	const generateur = models.ecs.get_generateur(
		ctx.diagnostic.ecs,
		systeme.generateur_id,
	);
	return formules.calcule_rd({
		installation_collective: installation.installation_collective,
		bouclage_reseau: bouclage_reseau(systeme),
		alimentation_contigue: systeme.reseau.alimentation_contigue,
		production_volume_habitable: generateur.position.position_volume_chauffe,
	});
}

export function rg(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formules.calcule_rendements>["rg"] {
	return rendements(ctx, installation, systeme).rg;
}

export function rs(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formules.calcule_rendements>["rs"] {
	return rendements(ctx, installation, systeme).rs;
}

export function rgs(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formules.calcule_rendements>["rgs"] {
	return rendements(ctx, installation, systeme).rgs;
}

export function rendements(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formules.calcule_rendements> {
	return ctx.once(ID, "rendements", systeme, () => {
		const generateur = models.ecs.get_generateur(
			ctx.diagnostic.ecs,
			systeme.generateur_id,
		);
		const rules = generateurRules.rules;
		const type_generateur = rules.type_generateur(generateur);
		const energie_generateur = rules.energie_generateur(generateur);
		const bienergie = generateur.bienergie;
		const volume_stockage = rules.volume_stockage(generateur);
		const type_systeme = formules.calcule_type_systeme({
			type_generateur,
			energie_generateur,
			bienergie,
			volume_stockage,
			generateur_multi_batiment: generateur.position.generateur_multi_batiment,
		});

		const props = {
			type_systeme,
			position_chauffe_eau: generateur.position.position_chauffe_eau,
			label_generateur: generateur.signaletique.label,
			isolation_reseau: isolation_reseau(systeme),
			rd: ctx.resolve(ID, RULES.rd, systeme),
			becs: ctx.resolve(
				installationRegistry.ID,
				installationRegistry.RULES.becs,
				installation,
			),
			qgw: ctx.resolve(
				generateurRules.ID,
				generateurRules.RULES.qgw,
				generateur,
			),
			cop: ctx.resolve(
				generateurRules.ID,
				generateurRules.RULES.cop,
				generateur,
			),
			qp0: ctx.resolve(
				generateurRules.ID,
				generateurRules.RULES.qp0,
				generateur,
			),
			pveilleuse: ctx.resolve(
				generateurRules.ID,
				generateurRules.RULES.pveilleuse,
				generateur,
			),
			rpn: ctx.resolve(
				generateurRules.ID,
				generateurRules.RULES.rpn,
				generateur,
			),
		};

		switch (type_systeme) {
			case formules.TYPES_SYSTEME.chaudiere_mixte:
			case formules.TYPES_SYSTEME.pac_hybride:
				return formules.calcule_rendements({
					type_systeme,
					becs: props.becs,
					qgw: props.qgw,
					qp0: props.qp0 ?? 0,
					rpn: props.rpn ?? 0,
					pveilleuse: props.pveilleuse ?? 0,
				});
			case formules.TYPES_SYSTEME.accumulateur_gaz:
				return formules.calcule_rendements({
					type_systeme,
					becs: props.becs,
					qgw: props.qgw,
					qp0: props.qp0 ?? 0,
					rpn: props.rpn ?? 0,
					pveilleuse: props.pveilleuse ?? 0,
				});
			case formules.TYPES_SYSTEME.chauffe_eau_gaz:
				return formules.calcule_rendements({
					type_systeme,
					becs: props.becs,
					qp0: props.qp0 ?? 0,
					rpn: props.rpn ?? 0,
					pveilleuse: props.pveilleuse ?? 0,
				});
			case formules.TYPES_SYSTEME.chauffe_eau_thermodynamique:
			case formules.TYPES_SYSTEME.pac_double_service:
				return formules.calcule_rendements({
					type_systeme,
					cop: props.cop ?? 0,
				});
			case formules.TYPES_SYSTEME.chaudiere_electrique:
			case formules.TYPES_SYSTEME.chauffe_eau_electrique:
				return formules.calcule_rendements({
					type_systeme,
					becs: props.becs,
					rd: props.rd,
					qgw: props.qgw,
					position_chauffe_eau: props.position_chauffe_eau,
					label_generateur: props.label_generateur,
				});
			case formules.TYPES_SYSTEME.reseau_chaleur:
				return formules.calcule_rendements({
					type_systeme,
					isolation_reseau: props.isolation_reseau,
				});
		}
	});
}

export function bouclage_reseau(
	systeme: Systeme,
): ReturnType<typeof formules.set_bouclage_reseau> {
	return formules.set_bouclage_reseau({
		bouclage_reseau: systeme.reseau.bouclage ?? null,
	});
}

export function isolation_reseau(
	systeme: Systeme,
): ReturnType<typeof formules.set_isolation_reseau> {
	return formules.set_isolation_reseau({
		isolation_reseau: systeme.reseau.isolation ?? null,
	});
}
