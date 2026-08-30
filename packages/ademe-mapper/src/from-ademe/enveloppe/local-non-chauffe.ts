import { enveloppe } from "@open-dpe-logement/models";
import * as baie from "./local-non-chauffe/baie.js";
import { createId, resolveId } from "../common.js";
import type { Input, Paroi, Ets } from "./types.js";
import { mapMitoyennete } from "./paroi/position.js";
import { MappingError } from "../errors.js";

export function mapLocalNonChauffe(
	props: LocalNonChauffeProps,
): enveloppe.localNonChauffe.LocalNonChauffe | null {
	switch (props.id) {
		case "ets":
			return fromEts.mapLocalNonChauffe(props);
		case "paroi":
			return fromParoi.mapLocalNonChauffe(props);
		default: {
			const _exhaustive: never = props;
			return _exhaustive;
		}
	}
}

export type LocalNonChauffeProps =
	| LocalNonChauffeFromEts
	| LocalNonChauffeFromParoi;

export interface LocalNonChauffeFromEts {
	id: "ets";
	input: Input;
	ets: Ets;
}

export interface LocalNonChauffeFromParoi {
	id: "paroi";
	paroi: Paroi;
}

export namespace fromEts {
	export function mapLocalNonChauffe(
		props: LocalNonChauffeFromEts,
	): enveloppe.localNonChauffe.EspaceTamponSolarise | null {
		const { ets } = props;

		const value: enveloppe.localNonChauffe.LocalNonChauffeBase = {
			id: resolveId(ets.donnee_entree.reference),
			description: ets.donnee_entree.description ?? "Non renseigné",
			type: enveloppe.localNonChauffe.TYPES_LNC.espace_tampon_solarise,
			parois: [],
			baies: ets.baie_ets_collection.map((baieEts) =>
				baie.mapBaie({ baie: baieEts, ets }),
			),
		};

		if (!enveloppe.localNonChauffe.isEspaceTamponSolarise(value))
			throw new MappingError("local_non_chauffe", props);

		return value;
	}
}

export namespace fromParoi {
	export function mapLocalNonChauffe(
		props: LocalNonChauffeFromParoi,
	): enveloppe.localNonChauffe.LocalNonChauffeAutre | null {
		const { paroi } = props;
		const mitoyennete = mapMitoyennete(paroi);
		const surface_paroi = surfaceParoi(paroi);
		const surface_aue = surfaceAue(paroi);
		const surface_aiu = surfaceAiu(paroi);

		if (
			mitoyennete !== enveloppe.common.MITOYENNETES.local_non_chauffe ||
			!surface_aue ||
			!surface_aiu
		)
			return null;

		const type = mapType(paroi);
		const isolation = mapIsolation(paroi);

		if (!type) throw new MappingError("local_non_chauffe.type", paroi);

		const value: enveloppe.localNonChauffe.LocalNonChauffeBase = {
			id: resolveId(paroi.donnee_entree.reference),
			description: "Local non chauffé reconstitué",
			type,
			baies: [],
			parois: [],
		};

		value.parois.push({
			id: createId(),
			description: "Paroi reconstituée",
			isolation,
			position: {
				mitoyennete: enveloppe.common.MITOYENNETES.exterieur,
				surface: surface_aue,
			},
		});

		if (surface_paroi < surface_aiu) {
			value.parois.push({
				id: createId(),
				description: "Paroi reconstituée",
				isolation,
				position: {
					mitoyennete: enveloppe.common.MITOYENNETES.local_residentiel,
					surface: surface_aiu - surface_paroi,
				},
			});
		}

		if (!enveloppe.localNonChauffe.isLocalNonChauffeAutre(value))
			throw new MappingError("local_non_chauffe", paroi);

		return value;
	}

	export function mapType(
		props: Paroi,
	): enveloppe.localNonChauffe.LocalNonChauffe["type"] | null {
		const TypeLncEnum = enveloppe.localNonChauffe.TYPES_LNC;

		switch (props.donnee_entree.enum_type_adjacence_id) {
			case "8":
				return TypeLncEnum.garage;
			case "9":
				return TypeLncEnum.cellier;
			case "11":
				return TypeLncEnum.comble_fortement_ventile;
			case "12":
				return TypeLncEnum.comble_faiblement_ventile;
			case "13":
				return TypeLncEnum.comble_tres_faiblement_ventile;
			case "14":
				return TypeLncEnum.circulation_sans_ouverture_exterieure;
			case "15":
				return TypeLncEnum.circulation_avec_ouverture_exterieure;
			case "16":
				return TypeLncEnum.circulation_avec_bouche_ou_gaine_desenfumage_ouverte;
			case "17":
				return TypeLncEnum.hall_entree_avec_fermeture_automatique;
			case "18":
				return TypeLncEnum.hall_entree_sans_fermeture_automatique;
			case "19":
				return TypeLncEnum.garage_collectif;
			case "21":
				return TypeLncEnum.autres;
			default:
				return null;
		}
	}

	export function mapIsolation(
		props: Paroi,
	): enveloppe.localNonChauffe.paroi.Paroi["isolation"] | null {
		switch (props.donnee_entree.enum_cfg_isolation_lnc_id) {
			case "2":
			case "4":
				return false;
			case "3":
			case "5":
				return true;
			default:
				return null;
		}
	}

	function surfaceAue(props: Paroi): number {
		return props.donnee_entree.surface_aue ?? 0;
	}

	function surfaceAiu(props: Paroi): number {
		return props.donnee_entree.surface_aiu ?? 0;
	}

	function surfaceParoi(props: Paroi): number {
		if ("surface_totale_baie" in props.donnee_entree)
			return props.donnee_entree.surface_totale_baie;

		if ("surface_porte" in props.donnee_entree)
			return props.donnee_entree.surface_porte;

		return props.donnee_entree.surface_paroi_opaque;
	}
}
