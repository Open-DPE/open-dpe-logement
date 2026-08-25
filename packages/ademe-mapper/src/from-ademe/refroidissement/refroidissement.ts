import { refroidissement } from "@open-dpe-logement/models";
import type { Input } from "./types.js";
import * as generateur from "./generateur.js";
import * as installation from "./installation.js";

export { generateur, installation };

export function mapRefroidissement(
	props: Input,
): refroidissement.Refroidissement {
	return {
		generateurs: props.logement.climatisation_collection.map((climatisation) =>
			generateur.mapGenerateur(climatisation),
		),
		installations: props.logement.climatisation_collection.map(
			(climatisation) => installation.mapInstallation(climatisation),
		),
	};
}
