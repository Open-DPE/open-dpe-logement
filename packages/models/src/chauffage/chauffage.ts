import type { NonEmptyArray, UUID } from "#/common/common";
import { EntityNotFoundError } from "#/errors.js";
import { buildEnum, createGuard } from "#/utils";
import * as emetteur from "./emetteur.js";
import * as generateur from "./generateur.js";
import * as installation from "./installation.js";
import * as systeme from "./systeme.js";

export { generateur, installation, emetteur, systeme };

export const isChauffage = createGuard<Chauffage>("/chauffage");

/**
 * @see https://schemas.open-dpe.fr/chauffage
 */
export type Chauffage = {
	emetteurs: emetteur.Emetteur[];
	generateurs: NonEmptyArray<generateur.Generateur>;
	installations: NonEmptyArray<installation.Installation>;
};

export type ChauffageWithData<T extends Chauffage = Chauffage> = T & {
	data: ChauffageData;
};

export type ChauffageData = {
	bch: number;
	pch: number;
	as: number;
	ai: number;
	qgw_rec: number;
	qdw_rec: number;
	qgen_ecs_rec: number;
	effet_joule: boolean;
};

export const TAUX_CHARGE = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95] as const;
export type TauxCharge = (typeof TAUX_CHARGE)[number];
export const TauxChargeEnum = buildEnum(TAUX_CHARGE);
export type ParTauxCharge<T> = Record<TauxCharge, T>;

export function get_systemes(chauffage: Chauffage): systeme.Systeme[] {
	return chauffage.installations.flatMap((i) => i.systemes);
}

export function get_emetteur(
	chauffage: Chauffage,
	id: UUID,
): emetteur.Emetteur {
	const emetteur = chauffage.emetteurs.find((e) => e.id === id);
	if (!emetteur) throw new EntityNotFoundError("Emetteur", id);
	return emetteur;
}

export function get_generateur(
	chauffage: Chauffage,
	id: UUID,
): generateur.Generateur {
	const generateur = chauffage.generateurs.find((g) => g.id === id);
	if (!generateur) throw new EntityNotFoundError("Generateur", id);
	return generateur;
}
