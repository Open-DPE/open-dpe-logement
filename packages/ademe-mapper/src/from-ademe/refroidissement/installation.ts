import { refroidissement } from "@open-dpe-logement/models";
import type { Climatisation } from "./types.js";

export function mapInstallation(
	props: Climatisation,
): refroidissement.installation.Installation {
	return {
		id: mapID(props),
		description: mapDescription(props),
		surface: mapSurface(props),
		generateurs: mapGenerateurs(props),
	};
}

export function mapID(
	props: Climatisation,
): refroidissement.installation.Installation["id"] {
	return props.donnee_entree.reference;
}

export function mapDescription(
	props: Climatisation,
): refroidissement.installation.Installation["description"] {
	return props.donnee_entree.description ?? "Non renseigné";
}

export function mapSurface(
	props: Climatisation,
): refroidissement.installation.Installation["surface"] {
	return props.donnee_entree.surface_clim;
}

export function mapGenerateurs(
	props: Climatisation,
): refroidissement.installation.Installation["generateurs"] {
	return [props.donnee_entree.reference];
}
