import * as types from "./types.js";

export function isDPELogementExistantv2(
	value: types.DPELogementExistant,
): value is types.v2.DPELogementExistant {
	return (
		value.administratif.enum_version_id === "2" ||
		value.administratif.enum_version_id === "2.1"
	);
}

export function isDPELogementExistantv22(
	value: types.DPELogementExistant,
): value is types.v22.DPELogementExistant {
	return value.administratif.enum_version_id === "2.2";
}

export function isDPELogementExistantv23(
	value: types.DPELogementExistant,
): value is types.v23.DPELogementExistant {
	return value.administratif.enum_version_id === "2.3";
}

export function isDPELogementExistantv24(
	value: types.DPELogementExistant,
): value is types.v24.DPELogementExistant {
	return value.administratif.enum_version_id === "2.4";
}

export function isDPELogementExistantv25(
	value: types.DPELogementExistant,
): value is types.v25.DPELogementExistant {
	return value.administratif.enum_version_id === "2.5";
}

export function isDPELogementExistantv26(
	value: types.DPELogementExistant,
): value is types.v26.DPELogementExistant {
	return value.administratif.enum_version_id === "2.6";
}
