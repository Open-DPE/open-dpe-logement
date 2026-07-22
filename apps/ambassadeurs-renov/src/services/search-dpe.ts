export type DPE = {
	numero_dpe: string;
	date_etablissement_dpe: string;
	type_batiment: string;
	adresse_complete_brut: string;
	adresse_ban?: string;
};

/**
 * @see https://data.ademe.fr/datasets/dpe03existant/api-doc
 */
export async function searchDPE(adresse: string): Promise<{
	total: number;
	results: Array<DPE>;
}> {
	const params = new URLSearchParams({
		q: adresse,
		select:
			"numero_dpe,date_etablissement_dpe,type_batiment,adresse_ban,adresse_complete_brut",
	});
	const url = `https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines/?${params.toString()}`;
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 5000);
	let response;

	try {
		response = await fetch(url, { signal: controller.signal });
	} finally {
		clearTimeout(timeout);
	}

	if (!response.ok) {
		throw new Error(`Error fetching data: ${response.statusText}`);
	}

	return response.json();
}
