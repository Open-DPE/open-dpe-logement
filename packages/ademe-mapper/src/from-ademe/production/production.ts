import { production } from "@open-dpe-logement/models";
import * as panneauPhotovoltaique from "./panneau-photovoltaique.js";
import type { Input } from "./types.js";

export { panneauPhotovoltaique };

export function mapProduction(props: Input): production.Production {
	const panneaux_pv_collection =
		props.logement?.production_elec_enr?.panneaux_pv_collection ?? [];

	return {
		panneaux_photovoltaiques: panneaux_pv_collection.map((panneau_pv) =>
			panneauPhotovoltaique.mapPanneauPhotovoltaique(panneau_pv),
		),
	};
}
