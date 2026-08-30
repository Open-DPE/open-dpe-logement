import { production } from "@open-dpe-logement/models";
import { createId } from "../common.js";
import type { PanneauxPv } from "./types.js";
import { MappingError } from "../errors.js";

export function mapPanneauPhotovoltaique(
	props: PanneauxPv,
): production.panneauPhotovoltaique.PanneauPhotovoltaique {
	return {
		id: createId(),
		description: "Non renseigné",
		orientation: mapOrientation(props),
		inclinaison: mapInclinaison(props),
		modules: mapModules(props),
		surface: mapSurface(props),
		installation_collective: mapInstallationCollective(props),
	};
}

export function mapOrientation(
	props: PanneauxPv,
): production.panneauPhotovoltaique.PanneauPhotovoltaique["orientation"] {
	switch (props.enum_orientation_pv_id) {
		case "1":
			return "est";
		case "2":
			return "sud_est";
		case "3":
			return "sud";
		case "4":
			return "sud_ouest";
		case "5":
			return "ouest";
	}
	switch (props.tv_coef_orientation_pv_id) {
		case 1:
		case 6:
		case 11:
		case 16:
			return "est";

		case 2:
		case 7:
		case 12:
		case 17:
			return "sud_est";

		case 3:
		case 8:
		case 13:
		case 18:
			return "sud";

		case 4:
		case 9:
		case 14:
		case 19:
			return "sud_ouest";

		case 5:
		case 10:
		case 15:
		case 20:
			return "ouest";
	}

	throw new MappingError(
		"production.panneau_photovoltaique.orientation",
		props,
	);
}

export function mapInclinaison(
	props: PanneauxPv,
): production.panneauPhotovoltaique.PanneauPhotovoltaique["inclinaison"] {
	switch (props.enum_inclinaison_pv_id) {
		case "1":
			return 10;
		case "2":
			return 30;
		case "3":
			return 60;
		case "4":
			return 80;
	}
	switch (props.tv_coef_orientation_pv_id) {
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
			return 10;

		case 6:
		case 7:
		case 8:
		case 9:
		case 10:
			return 30;

		case 11:
		case 12:
		case 13:
		case 14:
		case 15:
			return 60;

		case 16:
		case 17:
		case 18:
		case 19:
		case 20:
			return 80;
	}

	throw new MappingError(
		"production.panneau_photovoltaique.inclinaison",
		props,
	);
}

export function mapModules(
	props: PanneauxPv,
): production.panneauPhotovoltaique.PanneauPhotovoltaique["modules"] {
	return props.nombre_module || 1;
}

export function mapSurface(
	props: PanneauxPv,
): production.panneauPhotovoltaique.PanneauPhotovoltaique["surface"] {
	return props.surface_totale_capteurs || null;
}

export function mapInstallationCollective(
	props: PanneauxPv,
): production.panneauPhotovoltaique.PanneauPhotovoltaique["installation_collective"] {
	return !props.ratio_virtualisation || props.ratio_virtualisation > 0;
}
