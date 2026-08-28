/**
 * Versions DPE obsolètes. Non couvertes.
 * Occurrences  ~600k enregistrements dans l'open data ADEME, cf. groupe `version`
 */
export const UNSUPPORTED_DPE_VERSIONS = new Set(["1", "1.1"]);

/**
 * Versions Audit obsolètes. Non couvertes.
 * cf. `enums.audit.json`, groupe `version_audit` : la version initiale y est
 * codée "1.0" (et non "1", contrairement au DPE).
 */
export const UNSUPPORTED_AUDIT_VERSIONS = new Set(["0.1", "1.0", "1.1"]);

export function supportsDPEVersion(version: string): boolean {
	return !UNSUPPORTED_DPE_VERSIONS.has(version);
}

export function supportsAuditVersion(version: string): boolean {
	return !UNSUPPORTED_AUDIT_VERSIONS.has(version);
}

export class NotSupportedError extends Error {
	constructor(
		readonly type: "DPE" | "Audit",
		readonly numero: string,
		readonly version: string,
	) {
		super(
			`${type} ${numero} version ${version} non supporté (versions 1.x obsolètes)`,
		);
	}
}

/**
 * Lit `administratif.enum_version_id` (DPE) ou `administratif.enum_version_audit_id`
 * (Audit) sur l'objet brut retourné par `@open-dpe-logement/ademe-parser`'s `parse()`.
 *
 * N'existe que pour nourrir les gardes de version ci-dessus : propre à la
 * politique de `ademe-client` (quelles versions il accepte de retourner),
 * pas au mécanisme générique de parsing XML → objet JS.
 */
export function extractEnumVersionId(parsed: unknown): string | null {
	if (typeof parsed !== "object" || parsed === null) return null;
	const administratif = (parsed as Record<string, unknown>)["administratif"];
	if (typeof administratif !== "object" || administratif === null) return null;
	const version = (administratif as Record<string, unknown>)["enum_version_id"]
		?? (administratif as Record<string, unknown>)["enum_version_audit_id"];
	return typeof version === "string" ? version : null;
}
