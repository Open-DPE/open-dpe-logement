import type { Consommations, UUID } from "../common/common.js";
import type { Generateur } from "./generateur.js";
import { EntityNotFoundError } from "../errors.js";
import { buildEnum } from "../utils.js";

/**
 * @see https://schemas.open-dpe.fr/ecs/systeme
 */
export type Systeme = {
	id: UUID;
	description: string;
	generateur_id: UUID;
	reseau: Reseau;
};

export type SystemeWithData<T extends Systeme = Systeme> = T & {
	data: SystemeData;
};

export type SystemeData = {
	rdim: number;
	iecs: number;
	rd: number;
	rs: number;
	rg: number;
	rgs: number;
	qcirb: number;
	qtrac: number;
	consommations: Consommations;
};

export type Reseau = {
	alimentation_contigue: boolean;
	niveaux_desservis: number;
	isolation: boolean | null;
	bouclage: Bouclage | null;
};

export const BOUCLAGES = ["non_boucle", "boucle", "trace"] as const;
export type Bouclage = (typeof BOUCLAGES)[number];
export const BouclageEnum = buildEnum(BOUCLAGES);

export function get_generateur(collection: Generateur[], id: UUID): Generateur {
	const e = collection.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Generateur", id);
	return e;
}
