export class APIError extends Error {
	readonly type: string;
	readonly title: string;
	readonly status: number;
	readonly detail: string | null;
	readonly instance: string | null;

	constructor(props: {
		type: string;
		title: string;
		status: number;
		detail?: string | null;
		instance?: string | null;
	}) {
		super(props.title);
		this.type = props.type;
		this.title = props.title;
		this.status = props.status;
		this.detail = props.detail ?? null;
		this.instance = props.instance ?? null;
	}
}

export type Options = {
	client_id: string;
	client_secret: string;
	timeoutMs?: number;
};

export async function call<T>(
	url: string,
	options: Options,
	handler: (response: Response) => Promise<T>,
): Promise<T> {
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
			throw new APIError({
				type: "timeout",
				title: `Request timed out after ${timeoutMs}ms`,
				status: 408,
			});
		}
		throw new APIError({
			type: "network_error",
			title: "Network error calling external API",
			status: 500,
			detail: err instanceof Error ? err.message : String(err),
		});
	} finally {
		clearTimeout(timeout);
	}

	if (response.status !== 200) {
		const body = await response.text();
		let message: { errorDetails?: { reason?: string; message?: string } };
		try {
			message = JSON.parse(body);
		} catch {
			throw new APIError({
				type: "malformed_error_response",
				title: "Unable to parse error response",
				status: response.status,
				detail: body || null,
			});
		}

		throw new APIError({
			type: "api_error",
			title: message.errorDetails?.reason ?? "Unknown error",
			status: response.status,
			detail: message.errorDetails?.message ?? null,
		});
	}

	try {
		const result = await handler(response);
		return result;
	} catch (err) {
		if (err instanceof APIError) throw err;
		throw new APIError({
			type: "handler_error",
			title: "Error processing response",
			status: 500,
			detail: err instanceof Error ? err.message : String(err),
		});
	}
}
