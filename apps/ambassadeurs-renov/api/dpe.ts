import {
	fetchDPE,
	NotSupportedError,
	APIError,
} from "@open-dpe-logement/ademe-client";

/**
 * Endpoint serverless (Vercel) — proxy la récupération d'un DPE auprès de
 * l'observatoire DPE-Audit (ADEME).
 *
 * `client_id`/`client_secret` ne doivent JAMAIS être exposés au navigateur :
 * cette route s'exécute côté serveur, lit les identifiants depuis les
 * variables d'environnement du projet Vercel (jamais préfixées `VITE_`,
 * sans quoi elles seraient inlinées dans le bundle client) et ne renvoie
 * au client que la donnée DPE elle-même.
 *
 * @see https://vercel.com/docs/functions — signature Node par défaut (req/res)
 */

type VercelRequest = {
	query: Record<string, string | string[] | undefined>;
};

type VercelResponse = {
	status(code: number): VercelResponse;
	json(body: unknown): void;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const raw = req.query.numero;
	const numero = Array.isArray(raw) ? raw[0] : raw;

	if (!numero) {
		res.status(400).json({ code: "missing_numero" });
		return;
	}

	const client_id = process.env.ADEME_API_CLIENT_ID;
	const client_secret = process.env.ADEME_API_CLIENT_SECRET;

	if (!client_id || !client_secret) {
		console.error(
			"ADEME_API_CLIENT_ID / ADEME_API_CLIENT_SECRET manquant(s) côté serveur.",
		);
		res.status(500).json({ code: "server_misconfigured" });
		return;
	}

	try {
		const dpe = await fetchDPE(numero, { client_id, client_secret });

		if (!dpe) {
			res.status(404).json({ code: "not_found" });
			return;
		}

		res.status(200).json(dpe);
	} catch (error) {
		if (error instanceof NotSupportedError) {
			res.status(422).json({
				code: "not_supported",
				type: error.type,
				numero: error.numero,
				version: error.version,
			});
			return;
		}

		if (error instanceof APIError) {
			console.error(
				"Erreur API ADEME",
				error.code,
				error.reason,
				error.message,
			);
			res.status(502).json({ code: "upstream_error" });
			return;
		}

		console.error(error);
		res.status(500).json({ code: "unexpected_error" });
	}
}
