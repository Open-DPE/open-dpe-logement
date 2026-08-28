import * as types from "./types.js";

export function isAuditv20(value: types.Audit): value is types.v20.Audit {
	return value.administratif.enum_version_audit_id === "2.0";
}

export function isAuditv21(value: types.Audit): value is types.v21.Audit {
	return value.administratif.enum_version_audit_id === "2.1";
}

export function isAuditv22(value: types.Audit): value is types.v22.Audit {
	return value.administratif.enum_version_audit_id === "2.2";
}

export function isAuditv23(value: types.Audit): value is types.v23.Audit {
	return value.administratif.enum_version_audit_id === "2.3";
}

export function isAuditv24(value: types.Audit): value is types.v24.Audit {
	return value.administratif.enum_version_audit_id === "2.4";
}

export function isAuditv25(value: types.Audit): value is types.v25.Audit {
	return value.administratif.enum_version_audit_id === "2.5";
}
