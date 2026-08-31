import { common, enveloppe } from "@open-dpe-logement/models";
import type { Ets, BaieEts } from "../types.js";
import { MappingError } from "../../errors.js";
import { resolveId } from "../../common.js";

const TypeVitrage = enveloppe.baie.TypeVitrage;
const MateriauBaie = enveloppe.baie.MateriauBaie;

export function mapBaie(props: {
	baie: BaieEts;
	ets: Ets;
}): enveloppe.localNonChauffe.baie.Baie {
	const position: enveloppe.localNonChauffe.baie.PositionBase = {
		mitoyennete: enveloppe.common.Mitoyennete.enum.exterieur,
		surface: mapSurface(props.baie),
		inclinaison: mapInclinaison(props.baie),
		orientation: mapOrientation(props.baie),
	};

	if (!enveloppe.localNonChauffe.baie.isPosition(position))
		throw new MappingError("local_non_chauffe.baie.position", props);

	const value: enveloppe.localNonChauffe.baie.BaieBase = {
		id: mapId(props.baie),
		description: mapDescription(props.baie),
		type_vitrage: mapTypeVitrage(props.ets),
		presence_rupteur_pont_thermique: mapPresenceRupteurPontThermique(props.ets),
		materiau_menuiserie: mapMateriauMenuiserie(props.ets),
		position,
	};

	if (!enveloppe.localNonChauffe.baie.isBaie(value))
		throw new MappingError("local_non_chauffe.baie", props);

	return value;
}

export function mapId(
	props: BaieEts,
): enveloppe.localNonChauffe.baie.Baie["id"] {
	return resolveId(props.donnee_entree.reference);
}

export function mapDescription(
	props: BaieEts,
): enveloppe.localNonChauffe.baie.Baie["description"] {
	return props.donnee_entree.description ?? "Non renseigné";
}

export function mapTypeVitrage(
	props: Ets,
): enveloppe.localNonChauffe.baie.Baie["type_vitrage"] {
	switch (props.donnee_entree.tv_coef_transparence_ets_id) {
		case 1:
			return TypeVitrage.enum.polycarbonate;

		case 2:
		case 7:
		case 12:
		case 17:
			return TypeVitrage.enum.simple_vitrage;

		case 3:
		case 8:
		case 13:
		case 18:
			return TypeVitrage.enum.double_vitrage;

		case 4:
		case 9:
		case 14:
		case 19:
			return TypeVitrage.enum.double_vitrage_fe;

		case 5:
		case 10:
		case 15:
		case 20:
			return TypeVitrage.enum.triple_vitrage;

		case 6:
		case 11:
		case 16:
		case 21:
			return TypeVitrage.enum.triple_vitrage_fe;

		default:
			return null;
	}
}

export function mapPresenceRupteurPontThermique(
	props: Ets,
): enveloppe.localNonChauffe.baie.Baie["presence_rupteur_pont_thermique"] {
	switch (props.donnee_entree.tv_coef_transparence_ets_id) {
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
		case 8:
		case 9:
		case 10:
		case 11:
			return false;

		case 12:
		case 13:
		case 14:
		case 15:
		case 16:
			return true;

		default:
			return null;
	}
}

export function mapMateriauMenuiserie(
	props: Ets,
): enveloppe.localNonChauffe.baie.Baie["materiau_menuiserie"] {
	switch (props.donnee_entree.tv_coef_transparence_ets_id) {
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
			return MateriauBaie.enum.bois;

		case 7:
		case 8:
		case 9:
		case 10:
		case 11:
			return MateriauBaie.enum.pvc;

		case 12:
		case 13:
		case 14:
		case 15:
		case 16:
		case 17:
		case 18:
		case 19:
		case 20:
		case 21:
			return MateriauBaie.enum.metal;

		default:
			return null;
	}
}

export function mapSurface(
	props: BaieEts,
): enveloppe.localNonChauffe.baie.Position["surface"] {
	return props.donnee_entree.surface_totale_baie;
}

export function mapInclinaison(
	props: BaieEts,
): enveloppe.localNonChauffe.baie.Position["inclinaison"] {
	switch (props.donnee_entree.enum_inclinaison_vitrage_id) {
		case "1":
			return 15;
		case "2":
			return 50;
		case "3":
			return 90;
		case "4":
			return 0;
	}
}

export function mapOrientation(
	props: BaieEts,
): enveloppe.localNonChauffe.baie.Position["orientation"] {
	switch (props.donnee_entree.enum_orientation_id) {
		case "1":
			return common.OrientationCardinale.enum.sud;
		case "2":
			return common.OrientationCardinale.enum.nord;
		case "3":
			return common.OrientationCardinale.enum.est;
		case "4":
			return common.OrientationCardinale.enum.ouest;
		case "5":
			return enveloppe.common.OrientationHorizontale;
	}
}
