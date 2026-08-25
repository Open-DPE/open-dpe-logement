import * as types from "./types.js";

export function isDPEv2<T extends types.DPE>(
	value: T,
): value is T & types.v2.DPE {
	return (
		value.administratif.enum_version_id === "2" ||
		value.administratif.enum_version_id === "2.1"
	);
}

export function isDPEv22<T extends types.DPE>(
	value: T,
): value is T & types.v22.DPE {
	return value.administratif.enum_version_id === "2.2";
}

export function isDPEv23<T extends types.DPE>(
	value: T,
): value is T & types.v23.DPE {
	return value.administratif.enum_version_id === "2.3";
}

export function isDPEv24<T extends types.DPE>(
	value: T,
): value is T & types.v24.DPE {
	return value.administratif.enum_version_id === "2.4";
}

export function isDPEv25<T extends types.DPE>(
	value: T,
): value is T & types.v25.DPE {
	return value.administratif.enum_version_id === "2.5";
}

export function isDPEv26<T extends types.DPE>(
	value: T,
): value is T & types.v26.DPE {
	return value.administratif.enum_version_id === "2.6";
}

export function isDPELogement<T extends types.DPE>(
	value: T,
): value is T & types.DPELogement {
	return value.logement !== undefined && value.logement !== null;
}

export function isDPELogementNeuf<T extends types.DPE>(
	value: T,
): value is T & types.DPELogementNeuf {
	return value.logement_neuf !== undefined && value.logement_neuf !== null;
}

export function isDPETertiaire<T extends types.DPE>(
	value: T,
): value is T & types.DPETertiaire {
	return value.tertiaire !== undefined && value.tertiaire !== null;
}
