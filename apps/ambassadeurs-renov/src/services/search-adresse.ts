export type Adresse = {
	type: "Feature";
	geometry: {
		type: string;
		coordinates: number[];
	};
	properties: {
		type: "housenumber";
		id: string;
		banId: string;
		score: number;
		label: string;
		name: string;
		postcode: string;
		citycode: string;
		city: string;
		district: string;
		street: string;
		housenumber: string;
		depcode: string;
		x: number;
		y: number;
	};
};

/**
 * @see https://data.geopf.fr/geocodage/openapi
 */
export async function searchAdresse(q: string): Promise<{
	type: "FeatureCollection";
	features: Array<Adresse>;
}> {
	const params = new URLSearchParams({
		q,
		limit: "5",
		autocomplete: "1",
	});
	const url = `https://data.geopf.fr/geocodage/search/?${params.toString()}`;
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
