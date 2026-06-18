import { validate } from "@open-dpe-logement/schemas/enveloppe/niveau";
import type { UUID } from "../common/common.js";
import type { Inertie, InertieParoi } from "./common.js";

export function isNiveau(data: unknown): data is Niveau {
	return validate(data).isValid;
}

/**
 * @see https://schemas.open-dpe.fr/enveloppe/niveau
 */
export type Niveau = {
	id: UUID;
	description: string;
	surface: number;
	inertie_paroi_verticale: InertieParoi | null;
	inertie_plancher_bas: InertieParoi | null;
	inertie_plancher_haut: InertieParoi | null;
};

export type NiveauWithData<T extends Niveau = Niveau> = T & {
	data: NiveauData;
};

export type NiveauData = {
	inertie: Inertie;
};
