import { ventilation } from "@open-dpe-logement/models";
import * as installation from "./installation.js";
import type { Input } from "./types.js";

export function mapVentilation(props: Input): ventilation.Ventilation {
	return {
		installations: props.logement.ventilation_collection.map((ventilation) =>
			installation.mapInstallation({ input: props, ventilation }),
		),
	};
}
