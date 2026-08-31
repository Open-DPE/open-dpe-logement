import { enveloppe } from "@open-dpe-logement/models";
import { mapAnneeEtablissement } from "../../common.js";
import type { Input, ParoiOpaque } from "../types.js";
import { MappingError } from "../../errors.js";

const TypeIsolation = enveloppe.common.TypeIsolation;

export type IsolationProps = {
	paroi: ParoiOpaque;
	input: Input;
};

export function mapIsolation(
	props: IsolationProps,
): enveloppe.common.Isolation {
	const value: enveloppe.common.IsolationBase = {
		etat: mapEtat(props.paroi),
		type: mapType(props.paroi),
		epaisseur: null,
		resistance_thermique: null,
		annee_installation: null,
	};

	if (
		enveloppe.common.isSansIsolation(value) ||
		enveloppe.common.isIsolationInconnue(value)
	) {
		value.type = null;
	}
	if (enveloppe.common.isIsolationConnue(value)) {
		value.epaisseur = mapEpaisseur(props.paroi);
		value.resistance_thermique = mapResistanceThermique(props.paroi);
		value.annee_installation = mapAnneeInstallation(props);
	}
	if (!enveloppe.common.isIsolation(value))
		throw new MappingError("isolation", props.paroi);

	return value;
}

export function mapEtat(
	props: IsolationProps["paroi"],
): enveloppe.common.Isolation["etat"] {
	switch (props.donnee_entree.enum_type_isolation_id) {
		case "1":
			return null;
		case "2":
			return false;
		case "3":
		case "4":
		case "5":
		case "6":
		case "7":
		case "8":
		case "9":
			return true;
	}
}

export function mapType(
	props: IsolationProps["paroi"],
): enveloppe.common.Isolation["type"] {
	switch (props.donnee_entree.enum_type_isolation_id) {
		case "1":
		case "2":
		case "9":
			return null;
		case "3":
			return TypeIsolation.enum.iti;
		case "4":
			return TypeIsolation.enum.ite;
		case "5":
			return TypeIsolation.enum.itr;
		case "6":
			return TypeIsolation.enum.iti_ite;
		case "7":
			return TypeIsolation.enum.itr_iti;
		case "8":
			return TypeIsolation.enum.itr_ite;
	}
}

export function mapEpaisseur(
	props: IsolationProps["paroi"],
): enveloppe.common.Isolation["epaisseur"] {
	return props.donnee_entree.epaisseur_isolation
		? props.donnee_entree.epaisseur_isolation * 10
		: null;
}

export function mapResistanceThermique(
	props: IsolationProps["paroi"],
): enveloppe.common.Isolation["resistance_thermique"] {
	return props.donnee_entree.resistance_isolation || null;
}

export function mapAnneeInstallation(
	props: IsolationProps,
): enveloppe.common.Isolation["annee_installation"] {
	const { input, paroi } = props;

	switch (paroi.donnee_entree.enum_periode_isolation_id) {
		case "1":
			return 1947;
		case "2":
			return 1974;
		case "3":
			return 1977;
		case "4":
			return 1982;
		case "5":
			return 1988;
		case "6":
			return 2000;
		case "7":
			return 2005;
		case "8":
			return 2012;
		case "9":
			return 2021;
		case "10":
			return mapAnneeEtablissement(input);
		default:
			return null;
	}
}
