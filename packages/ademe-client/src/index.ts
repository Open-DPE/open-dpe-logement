import { dpe } from "@open-dpe-logement/ademe-models";

export async function fetchDPE(
	id: string,
	config: {
		client_id: string;
		client_secret: string;
	},
): Promise<dpe.DPE | null> {
	const response = await fetch(
		`https://prd-x-ademe-externe-api.de-c1.eu1.cloudhub.io/api/v1/pub/dpe/${id}/xml`,
		{
			headers: {
				client_id: config.client_id,
				client_secret: config.client_secret,
			},
		},
	);
	if (response.status === 404) return null;

	if (!response.ok) {
		throw new Error(
			`ADEME API error: ${response.status} ${response.statusText}`,
		);
	}

	const data: dpe.DPE = await response.json();
	return data;
}
