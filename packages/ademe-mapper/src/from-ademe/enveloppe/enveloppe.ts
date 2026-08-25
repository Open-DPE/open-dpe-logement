import { enveloppe } from "@open-dpe-logement/models";
import type { Input } from "./types.js";
import * as baie from "./baie.js";
import * as localNonChauffe from "./local-non-chauffe.js";
import * as mur from "./mur.js";
import * as niveau from "./niveau.js";
import * as plancherBas from "./plancher-bas.js";
import * as plancherHaut from "./plancher-haut.js";
import * as porte from "./porte.js";
import * as pontThermique from "./pont-thermique.js";
import { mapBoolean } from "../common.js";

export {
	baie,
	localNonChauffe,
	mur,
	niveau,
	plancherBas,
	plancherHaut,
	porte,
	pontThermique,
};

export function mapEnveloppe(props: Input): enveloppe.Enveloppe {
	return {
		exposition: mapExposition(props),
		q4pa_conv: mapQ4paConv(props),
		presence_brasseurs_air: mapPresenceBrasseursAir(props),
		niveaux: mapNiveaux(props),
		locaux_non_chauffes: mapLocauxNonChauffes(props),
		murs: mapMurs(props),
		planchers_hauts: mapPlanchersHauts(props),
		planchers_bas: mapPlanchersBas(props),
		baies: mapBaies(props),
		portes: mapPortes(props),
		ponts_thermiques: mapPontsThermiques(props),
	};
}

export function mapExposition(props: Input): enveloppe.Enveloppe["exposition"] {
	for (const ventilation of props.logement.ventilation_collection) {
		if (ventilation.donnee_entree.plusieurs_facade_exposee === 1)
			return enveloppe.ExpositionEnum.multiple;
	}
	return enveloppe.ExpositionEnum.simple;
}

export function mapQ4paConv(props: Input): number | null {
	for (const item of props.logement.ventilation_collection) {
		if (
			item.donnee_entree.q4pa_conv_saisi &&
			item.donnee_entree.q4pa_conv_saisi > 0
		) {
			return item.donnee_entree.q4pa_conv_saisi;
		}
	}
	return null;
}

export function mapPresenceBrasseursAir(props: Input): boolean {
	return mapBoolean(props.logement.sortie.confort_ete.brasseur_air) ?? false;
}

export function mapNiveaux(props: Input): enveloppe.Enveloppe["niveaux"] {
	return [niveau.mapNiveau(props)];
}

export function mapLocauxNonChauffes(
	props: Input,
): enveloppe.Enveloppe["locaux_non_chauffes"] {
	const collection = [];

	const parois = [
		...props.logement.enveloppe.mur_collection,
		...props.logement.enveloppe.plancher_bas_collection,
		...props.logement.enveloppe.plancher_haut_collection,
		...props.logement.enveloppe.baie_vitree_collection,
		...props.logement.enveloppe.porte_collection,
	];
	for (const item of props.logement.enveloppe.ets_collection) {
		collection.push(
			localNonChauffe.mapLocalNonChauffe({
				id: "ets",
				input: props,
				ets: item,
			}),
		);
	}

	for (const item of parois) {
		collection.push(
			localNonChauffe.mapLocalNonChauffe({ id: "paroi", paroi: item }),
		);
	}

	return collection.filter((item) => item !== null);
}

export function mapMurs(props: Input): enveloppe.Enveloppe["murs"] {
	return props.logement.enveloppe.mur_collection.map((item) =>
		mur.mapMur({ paroi: item, input: props }),
	);
}

export function mapPlanchersBas(
	props: Input,
): enveloppe.Enveloppe["planchers_bas"] {
	return props.logement.enveloppe.plancher_bas_collection.map((item) =>
		plancherBas.mapPlancherBas({ paroi: item, input: props }),
	);
}

export function mapPlanchersHauts(
	props: Input,
): enveloppe.Enveloppe["planchers_hauts"] {
	return props.logement.enveloppe.plancher_haut_collection.map((item) =>
		plancherHaut.mapPlancherHaut({ paroi: item, input: props }),
	);
}

export function mapBaies(props: Input): enveloppe.Enveloppe["baies"] {
	const collection = [];

	for (const item of props.logement.enveloppe.baie_vitree_collection) {
		collection.push(
			baie.mapBaie({ key: "baie_vitree", baie_vitree: item, input: props }),
		);

		if (item.donnee_entree.baie_vitree_double_fenetre)
			collection.push(
				baie.mapBaie({
					key: "double_fenetre",
					baie_vitree: item,
					double_fenetre: item.donnee_entree.baie_vitree_double_fenetre,
					input: props,
				}),
			);
	}

	return collection.filter((item) => item !== null);
}

export function mapPortes(props: Input): enveloppe.Enveloppe["portes"] {
	return props.logement.enveloppe.porte_collection.map((item) =>
		porte.mapPorte({ paroi: item, input: props }),
	);
}

export function mapPontsThermiques(
	props: Input,
): enveloppe.Enveloppe["ponts_thermiques"] {
	return props.logement.enveloppe.pont_thermique_collection.map((item) =>
		pontThermique.mapPontThermique({ pontThermique: item, input: props }),
	);
}
