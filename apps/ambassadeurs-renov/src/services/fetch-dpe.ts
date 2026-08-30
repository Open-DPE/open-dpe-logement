import type { dpe } from "@open-dpe-logement/ademe-models";
import { NotSupportedError, APIError } from "@open-dpe-logement/ademe-client";

type ErrorBody = {
	code?: string;
	type?: "DPE" | "Audit";
	numero?: string;
	version?: string;
};

/**
 * Récupère un DPE via le proxy serverless `/api/dpe` (voir `apps/ambassadeurs-renov/api/dpe.ts`).
 *
 * Ne parle jamais directement à `@open-dpe-logement/ademe-client` depuis le
 * navigateur : `fetchDPE` exige `client_id`/`client_secret`, qui ne doivent
 * jamais transiter dans le bundle client. Cette fonction reconstitue les
 * mêmes classes d'erreur (`NotSupportedError`, `APIError`) que l'appel direct
 * aurait levées, pour que le code appelant les distingue de la même façon.
 */
export async function fetchDpe(numero: string): Promise<dpe.DPELogementExistant | null> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 8000);
	let response: Response;

	try {
		response = await fetch(`/api/dpe?numero=${encodeURIComponent(numero)}`, {
			signal: controller.signal,
		});
	} catch (err) {
		if (err instanceof Error && err.name === "AbortError") {
			throw new APIError(408, "timeout", "La récupération du DPE a expiré.");
		}
		throw new APIError(500, "network_error", err instanceof Error ? err.message : String(err));
	} finally {
		clearTimeout(timeout);
	}

	if (response.status === 404) return null;
	if (response.status === 200) return response.json();

	const body: ErrorBody | undefined = await response.json().catch(() => undefined);

	if (response.status === 422 && body?.code === "not_supported") {
		throw new NotSupportedError(body.type ?? "DPE", body.numero ?? numero, body.version ?? "?");
	}

	throw new APIError(
		response.status,
		body?.code ?? "unknown_error",
		"Erreur lors de la récupération du DPE.",
	);
}
