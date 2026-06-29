import { ASSET_URLS } from "./manifest.browser.js";

export async function loadAsset(key: string): Promise<unknown> {
	const url = ASSET_URLS[key];
	if (!url) {
		throw new Error(`[abaques] Asset inconnu : "${key}"`);
	}
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`[abaques] Échec du chargement de "${key}" : ${response.status}`);
	}
	return response.json();
}
