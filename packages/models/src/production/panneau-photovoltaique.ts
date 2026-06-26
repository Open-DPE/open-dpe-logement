import type { Orientation, UUID } from "../common/common.js";

/**
 * @see https://schemas.open-dpe.fr/production/panneau-photovoltaique
 */
export type PanneauPhotovoltaique = {
	id: UUID;
	description: string;
	orientation: Orientation;
	inclinaison: number;
	modules: number;
	surface: number | null;
	installation_collective: boolean;
};

export type PanneauPhotovoltaiqueWithData<
	T extends PanneauPhotovoltaique = PanneauPhotovoltaique,
> = T & {
	data: PanneauPhotovoltaiqueData;
};

export type PanneauPhotovoltaiqueData = {
	kpv: number;
	ppv: number;
};
