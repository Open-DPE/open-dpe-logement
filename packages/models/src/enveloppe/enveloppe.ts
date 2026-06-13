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
import type { UUID, NonEmptyArray } from "../common/common.js";
import { EntityNotFoundError } from "../errors.js";
import { buildEnum, createGuard } from "../utils.js";

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

export const isEnveloppe = createGuard<Enveloppe>("/enveloppe");

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
};

export type EnveloppeWithData<T extends Enveloppe = Enveloppe> = T & {
	data: EnveloppeData;
	niveaux: niveau.NiveauWithData[];
	locaux_non_chauffes: localNonChauffe.LocalNonChauffeWithData[];
	murs: mur.MurWithData[];
	planchers_hauts: plancherHaut.PlancherHautWithData[];
	planchers_bas: plancherBas.PlancherBasWithData[];
	baies: baie.BaieWithData[];
	portes: porte.PorteWithData[];
	ponts_thermiques: pontThermique.PontThermiqueWithData[];
};

export type EnveloppeData = {
	gv: number;
	ubat: number;
	dp: number;
	dp_murs: number;
	dp_planchers_bas: number;
	dp_planchers_hauts: number;
	dp_baies: number;
	dp_portes: number;
	pt: number;
	dr: number;
	sdep: number;
	sdep_murs: number;
	sdep_planchers_bas: number;
	sdep_planchers_hauts: number;
	sdep_baies: number;
	sdep_portes: number;
	inertie: common.Inertie;
	hperm: number;
	hvent: number;
	presence_joints: boolean;
	parois_anciennes: boolean;
	isolation_planchers_hauts: boolean;
	presence_protection_solaire: boolean;
	logement_traversant: boolean;
	sse: number;
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

export function getParoisLocalNonChauffe(
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

export function getBaiesLocalNonChauffe(
	enveloppe: Enveloppe,
	id: UUID,
): baie.Baie[] {
	return enveloppe.baies.filter((i) => {
		return i.position.local_non_chauffe_id === id;
	});
}

export function getPortesLocalNonChauffe(
	enveloppe: Enveloppe,
	id: UUID,
): porte.Porte[] {
	return enveloppe.portes.filter((i) => {
		return i.position.local_non_chauffe_id === id;
	});
}

export function getMursLocalNonChauffe(
	enveloppe: Enveloppe,
	id: UUID,
): mur.Mur[] {
	return enveloppe.murs.filter((i) => {
		return i.position.local_non_chauffe_id === id;
	});
}

export function getPlanchersHautsLocalNonChauffe(
	enveloppe: Enveloppe,
	id: UUID,
): plancherHaut.PlancherHaut[] {
	return enveloppe.planchers_hauts.filter((i) => {
		return i.position.local_non_chauffe_id === id;
	});
}

export function getPlanchersBasLocalNonChauffe(
	enveloppe: Enveloppe,
	id: UUID,
): plancherBas.PlancherBas[] {
	return enveloppe.planchers_bas.filter(
		(i) => i.position.local_non_chauffe_id === id,
	);
}

export function getLocalNonChauffe(
	enveloppe: Enveloppe,
	id: UUID,
): localNonChauffe.LocalNonChauffe {
	const e = enveloppe.locaux_non_chauffes.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Local non chauffé", id);
	return e;
}

export function getBaie(enveloppe: Enveloppe, id: UUID): baie.Baie {
	const e = enveloppe.baies.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Baie", id);
	return e;
}

export function getPorte(enveloppe: Enveloppe, id: UUID): porte.Porte {
	const e = enveloppe.portes.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Porte", id);
	return e;
}

export function getMur(enveloppe: Enveloppe, id: UUID): mur.Mur {
	const e = enveloppe.murs.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Mur", id);
	return e;
}

export function getPlancherHaut(
	enveloppe: Enveloppe,
	id: UUID,
): plancherHaut.PlancherHaut {
	const e = enveloppe.planchers_hauts.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Plancher haut", id);
	return e;
}

export function getPlancherBas(
	enveloppe: Enveloppe,
	id: UUID,
): plancherBas.PlancherBas {
	const e = enveloppe.planchers_bas.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Plancher bas", id);
	return e;
}
