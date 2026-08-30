import { audit, dpe } from "@open-dpe-logement/ademe-models";
import { parse } from "@open-dpe-logement/ademe-parser";
import { call } from "./api.js";
import {
	extractEnumVersionId,
	supportsDPEVersion,
	supportsAuditVersion,
	NotSupportedError,
} from "./guards.js";

export { NotSupportedError };
export { APIError } from "./api.js";

type Config = {
	client_id: string;
	client_secret: string;
};

/**
 * @see https://eu1.anypoint.mulesoft.com/exchange/portals/ademe/5dbd7b95-bc7d-47ed-be4a-d40b49eb8e47/x-ademe-externe-api/minor/1.0/console/method/%236056/
 */
export async function fetchDPE(
	id: string,
	config: Config,
): Promise<dpe.DPELogementExistant | null> {
	const url = `https://prd-x-ademe-externe-api.de-c1.eu1.cloudhub.io/api/v1/pub/dpe/${encodeURIComponent(id)}/xml`;
	const xml = await call(url, config);
	if (null === xml) return null;
	const parsed = parse(xml);

	const version = extractEnumVersionId(parsed);
	if (version !== null && !supportsDPEVersion(version))
		throw new NotSupportedError("DPE", id, version);

	return dpe.DPELogementExistant.parse(parsed);
}

export async function fetchAudit(
	id: string,
	config: Config,
): Promise<audit.Audit | null> {
	const url = `https://prd-x-ademe-externe-api.de-c1.eu1.cloudhub.io/api/v1/pub/audit/${encodeURIComponent(id)}/xml`;
	const xml = await call(url, config);
	if (null === xml) return null;
	const parsed = parse(xml);

	const version = extractEnumVersionId(parsed);
	if (version !== null && !supportsAuditVersion(version))
		throw new NotSupportedError("Audit", id, version);

	return audit.Audit.parse(parsed);
}
