export class APIError extends Error {
	constructor(
		readonly code: number,
		readonly reason: string,
		message: string,
	) {
		super(message);
	}
}

type ResponseError = {
	correlationId: string;
	success: false;
	timestamp: string;
	apiName: string;
	version: string;
	errorDetails: {
		code: number;
		reason: string;
		message: string;
	};
};

export type Options = {
	client_id: string;
	client_secret: string;
	timeoutMs?: number;
};

/** Nombre de caractères conservés du corps brut d'une réponse d'erreur non-JSON. */
const MALFORMED_BODY_PREVIEW_LENGTH = 500;

export async function call(
	url: string,
	options: Options,
): Promise<string | null> {
	const { timeoutMs = 5000 } = options;
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);

	let response;

	try {
		response = await fetch(url, {
			signal: controller.signal,
			headers: {
				client_id: options.client_id,
				client_secret: options.client_secret,
			},
		});
	} catch (err) {
		if (err instanceof Error && err.name === "AbortError") {
			throw new APIError(
				408,
				"timeout",
				`Request timed out after ${timeoutMs}ms`,
			);
		}
		throw new APIError(
			500,
			"network_error",
			err instanceof Error ? err.message : String(err),
		);
	} finally {
		clearTimeout(timeout);
	}

	if (response.status === 200) return await response.text();
	if (response.status === 404) return null;

	// Lu en texte d'abord (jamais .json() directement) : le corps n'est
	// consommable qu'une fois, et une réponse d'erreur peut ne pas être du
	// JSON valide (ex. passerelle HTTP renvoyant une page HTML sur un 502).
	const rawBody = await response.text();

	let body: ResponseError | undefined;
	try {
		body = JSON.parse(rawBody) as ResponseError;
	} catch {
		throw new APIError(
			response.status,
			"malformed_error_response",
			rawBody.length > MALFORMED_BODY_PREVIEW_LENGTH
				? `${rawBody.slice(0, MALFORMED_BODY_PREVIEW_LENGTH)}...`
				: rawBody,
		);
	}

	throw new APIError(
		body?.errorDetails?.code ?? response.status ?? 500,
		body?.errorDetails?.reason ?? "Unknown error",
		body?.errorDetails?.message ?? "Unknown error",
	);
}
