import * as baie from "./baie.js";
import * as common from "./common.js";
import * as localNonChauffe from "./local-non-chauffe.js";
import * as masque from "./masque.js";
import * as mur from "./mur.js";
import * as niveau from "./niveau.js";
import * as plancherBas from "./plancher-bas.js";
import * as plancherHaut from "./plancher-haut.js";
import * as pontThermique from "./pont-thermique.js";
import * as porte from "./porte.js";
import type { UUID, NonEmptyArray } from "#/common/common.js";
import { EntityNotFoundError } from "#/errors.js";
import { buildEnum } from "#/utils.js";

export {
	baie,
	common,
	localNonChauffe,
	masque,
	mur,
	niveau,
	plancherBas,
	plancherHaut,
	pontThermique,
	porte,
};

/**
 * @see https://schemas.open-dpe.fr/enveloppe
 */
export type Enveloppe = {
	exposition: Exposition;
	q4pa_conv: number | null;
	presence_brasseurs_air: boolean;
	niveaux: NonEmptyArray<niveau.Niveau>;
	locaux_non_chauffes: localNonChauffe.LocalNonChauffe[];
	murs: mur.Mur[];
	planchers_hauts: plancherHaut.PlancherHaut[];
	planchers_bas: plancherBas.PlancherBas[];
	baies: baie.Baie[];
	portes: porte.Porte[];
	ponts_thermiques: pontThermique.PontThermique[];
	masques: masque.Masque[];
};

export type EnveloppeWithData<T extends Enveloppe = Enveloppe> = T & {
	data: EnveloppeData;
};

export type EnveloppeData = {
	inertie: common.Inertie;
	parois_anciennes_lourdes: boolean;
	deperditions: Deperditions;
	permeabilite: Permeabilite;
	confort_ete: ConfortEte;
};

export type Deperditions = {
	gv: number;
	ubat: number;
	pt: number;
	dp: {
		total: number;
		murs: number;
		planchers_hauts: number;
		planchers_bas: number;
		baies: number;
		portes: number;
	};
	dr: {
		total: number;
		hperm: number;
		hvent: number;
	};
};

export type Permeabilite = {
	q4pa_conv: number;
	presence_joints_menuiserie: boolean;
};

export type ConfortEte = {
	inertie_lourde: boolean;
	isolation_plancher_haut: boolean | null;
	presence_protection_solaire: boolean | null;
	logement_traversant: boolean | null;
	presence_brasseurs_air: boolean | null;
};

export type Paroi =
	| baie.Baie
	| mur.Mur
	| plancherHaut.PlancherHaut
	| plancherBas.PlancherBas
	| porte.Porte;

export const EXPOSITIONS = ["simple", "multiple"] as const;
export type Exposition = (typeof EXPOSITIONS)[number];
export const ExpositionEnum = buildEnum(EXPOSITIONS);

export function get_parois_local_non_chauffe(
	enveloppe: Enveloppe,
	id: UUID,
): Paroi[] {
	const parois: Paroi[] = [
		...enveloppe.murs,
		...enveloppe.planchers_hauts,
		...enveloppe.planchers_bas,
		...enveloppe.baies,
		...enveloppe.portes,
	];
	return parois.filter((i) => {
		return i.position.local_non_chauffe_id === id;
	});
}

export function get_baies_local_non_chauffe(
	enveloppe: Enveloppe,
	id: UUID,
): baie.Baie[] {
	return enveloppe.baies.filter((i) => {
		return i.position.local_non_chauffe_id === id;
	});
}

export function get_portes_local_non_chauffe(
	enveloppe: Enveloppe,
	id: UUID,
): porte.Porte[] {
	return enveloppe.portes.filter((i) => {
		return i.position.local_non_chauffe_id === id;
	});
}

export function get_murs_local_non_chauffe(
	enveloppe: Enveloppe,
	id: UUID,
): mur.Mur[] {
	return enveloppe.murs.filter((i) => {
		return i.position.local_non_chauffe_id === id;
	});
}

export function get_planchers_hauts_local_non_chauffe(
	enveloppe: Enveloppe,
	id: UUID,
): plancherHaut.PlancherHaut[] {
	return enveloppe.planchers_hauts.filter((i) => {
		return i.position.local_non_chauffe_id === id;
	});
}

export function get_planchers_bas_local_non_chauffe(
	enveloppe: Enveloppe,
	id: UUID,
): plancherBas.PlancherBas[] {
	return enveloppe.planchers_bas.filter(
		(i) => i.position.local_non_chauffe_id === id,
	);
}

export function get_local_non_chauffe(
	enveloppe: Enveloppe,
	id: UUID,
): localNonChauffe.LocalNonChauffe {
	const e = enveloppe.locaux_non_chauffes.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Local non chauffé", id);
	return e;
}

export function get_baie(enveloppe: Enveloppe, id: UUID): baie.Baie {
	const e = enveloppe.baies.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Baie", id);
	return e;
}

export function get_porte(enveloppe: Enveloppe, id: UUID): porte.Porte {
	const e = enveloppe.portes.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Porte", id);
	return e;
}

export function get_mur(enveloppe: Enveloppe, id: UUID): mur.Mur {
	const e = enveloppe.murs.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Mur", id);
	return e;
}

export function get_plancher_haut(
	enveloppe: Enveloppe,
	id: UUID,
): plancherHaut.PlancherHaut {
	const e = enveloppe.planchers_hauts.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Plancher haut", id);
	return e;
}

export function get_plancher_bas(
	enveloppe: Enveloppe,
	id: UUID,
): plancherBas.PlancherBas {
	const e = enveloppe.planchers_bas.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Plancher bas", id);
	return e;
}
