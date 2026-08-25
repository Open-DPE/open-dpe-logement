import { common, ventilation } from "@open-dpe-logement/models";
import * as installation from "./installation.js";
import type { Input } from "./types.js";

export function mapVentilation(props: Input): ventilation.Ventilation {
	const installations: ventilation.installation.Installation[] =
		props.logement.ventilation_collection.map((ventilation) =>
			installation.mapInstallation({ input: props, ventilation }),
		);
	return {
		installations: common.toNonEmptyArray(installations),
	};
}
