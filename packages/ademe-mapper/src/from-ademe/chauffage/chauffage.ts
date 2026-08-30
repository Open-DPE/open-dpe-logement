import { chauffage } from "@open-dpe-logement/models";
import type { Input } from "./types.js";
import { toNonEmptyArray } from "../common.js";
import * as emetteur from "./emetteur.js";
import * as generateur from "./generateur.js";
import * as installation from "./installation.js";

export { emetteur, generateur, installation };

export function mapChauffage(props: Input): chauffage.Chauffage {
	const emetteurs = [];
	const installations = [];
	const generateurs = [];

	for (const inst of props.logement.installation_chauffage_collection) {
		installations.push(
			installation.mapInstallation({ input: props, installation: inst }),
		);

		for (const emet of inst.emetteur_chauffage_collection) {
			const value = emetteur.mapEmetteur({
				input: props,
				installation: inst,
				emetteur: emet,
			});

			if (value) emetteurs.push(value);
		}

		for (const gen of inst.generateur_chauffage_collection) {
			const value = generateur.mapGenerateur({
				input: props,
				installation: inst,
				generateur: gen,
			});

			if (value) generateurs.push(value);
		}
	}

	return {
		emetteurs: emetteurs,
		installations: toNonEmptyArray(installations),
		generateurs: toNonEmptyArray(generateurs),
	};
}
