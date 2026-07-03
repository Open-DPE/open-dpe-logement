import { call } from "./api";

/**
 * @see https://eu1.anypoint.mulesoft.com/exchange/portals/ademe/5dbd7b95-bc7d-47ed-be4a-d40b49eb8e47/x-ademe-externe-api/minor/1.0/console/method/%236056/
 */
export async function fetchDPE(
	id: string,
	config: {
		client_id: string;
		client_secret: string;
	},
): Promise<string> {
	const url = `https://prd-x-ademe-externe-api.de-c1.eu1.cloudhub.io/api/v1/pub/dpe/${encodeURIComponent(id)}/xml`;
	return call(url, config, async (response) => {
		return await response.text();
	});
}
