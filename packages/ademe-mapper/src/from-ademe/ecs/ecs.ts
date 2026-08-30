import { ecs } from "@open-dpe-logement/models";
import type { Input } from "./types.js";
import { toNonEmptyArray } from "../common.js";
import * as generateur from "./generateur.js";
import * as installation from "./installation.js";

export { generateur, installation };

export function mapEcs(props: Input): ecs.Ecs {
	const installations = [];
	const generateurs = [];

	for (const inst of props.logement.installation_ecs_collection) {
		installations.push(
			installation.mapInstallation({ input: props, installation: inst }),
		);

		for (const gen of inst.generateur_ecs_collection) {
			generateurs.push(
				generateur.mapGenerateur({
					input: props,
					installation: inst,
					generateur: gen,
				}),
			);
		}
	}

	return {
		installations: toNonEmptyArray(installations),
		generateurs: toNonEmptyArray(generateurs),
	};
}
