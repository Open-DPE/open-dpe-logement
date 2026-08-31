import {
	createServer,
	defineConfig,
	loadEnv,
	type Connect,
	type Plugin,
} from "vite";
import path from "path";
import fs from "fs";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

/** Alias partagés entre la config principale et le chargeur `api/*.ts` de preview. */
const alias = {
	"@": path.resolve(import.meta.dirname, "./src"),
	"@svg": path.resolve(import.meta.dirname, "./src/assets/svg"),
	"@icon": path.resolve(import.meta.dirname, "./src/assets/icons"),
	"@component": path.resolve(import.meta.dirname, "./src/components"),
	"@store": path.resolve(import.meta.dirname, "./src/stores"),
};

type ApiHandler = (
	req: { query: Record<string, string | string[] | undefined> },
	res: {
		status(code: number): unknown;
		json(body: unknown): void;
	},
) => void | Promise<void>;

/**
 * Middleware `/api/*` : mappe l'URL sur un module `api/<route>.ts`, le charge
 * via `load` (pipeline SSR de Vite, seul capable de transpiler du TS à la
 * volée) et l'invoque avec un couple req/res minimal conforme à la signature
 * Node attendue par les handlers Vercel.
 */
function apiMiddleware(
	apiDir: string,
	load: (route: string) => Promise<Record<string, unknown>>,
	onError: (error: Error) => void,
): Connect.NextHandleFunction {
	return async (req, res, next) => {
		const url = new URL(req.url ?? "/", "http://localhost");

		if (!url.pathname.startsWith("/api/")) return next();

		const route = path.join(apiDir, `${url.pathname.slice("/api/".length)}.ts`);

		// Interdit toute sortie de `api/` par un chemin traversant (`/api/../…`).
		if (!route.startsWith(apiDir + path.sep) || !fs.existsSync(route)) {
			return next();
		}

		const query: Record<string, string | string[] | undefined> = {};
		for (const key of url.searchParams.keys()) {
			const values = url.searchParams.getAll(key);
			query[key] = values.length > 1 ? values : values[0];
		}

		const response = {
			status(code: number) {
				res.statusCode = code;
				return response;
			},
			json(body: unknown) {
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify(body));
			},
		};

		try {
			const module = await load(route);
			await (module.default as ApiHandler)({ query }, response);
		} catch (error) {
			onError(error as Error);
			if (!res.writableEnded) {
				response.status(500).json({ code: "unexpected_error" });
			}
		}
	};
}

/**
 * Exécute les fonctions serverless de `api/` pendant `vite dev` ET `vite preview`.
 *
 * En production, Vercel expose `api/dpe.ts` sur `/api/dpe`. Ni le serveur de dev
 * ni celui de preview ne connaissent ce routage :
 *
 * - en dev, Vite résout `/api/dpe` vers le module `api/dpe.ts` (résolution
 *   d'extension) et renvoie son code transpilé avec un statut 200 ;
 * - en preview, `dist/` ne contient pas `api/` (Vercel compile ces fonctions de
 *   son côté) : la requête tombe dans le fallback SPA et reçoit `index.html`
 *   en 200 `text/html`.
 *
 * Dans les deux cas le client croit recevoir un DPE et échoue au parsing JSON.
 * Ce plugin rétablit la parité dev/preview/prod. `configureServer` n'étant
 * jamais appelé par `vite preview` (qui n'invoque que `configurePreviewServer`),
 * les deux hooks sont nécessaires.
 */
function serverlessApi(): Plugin {
	const apiDir = path.resolve(import.meta.dirname, "api");

	return {
		name: "serverless-api",
		apply: "serve",

		configureServer(server) {
			server.middlewares.use(
				apiMiddleware(
					apiDir,
					(route) => server.ssrLoadModule(route),
					(error) => {
						server.ssrFixStacktrace(error);
						console.error(error);
					},
				),
			);
		},

		async configurePreviewServer(server) {
			// `vite preview` sert des fichiers statiques : aucun pipeline SSR n'est
			// disponible pour charger `api/*.ts`. On instancie donc un serveur Vite
			// en middlewareMode, utilisé uniquement comme transpileur/chargeur.
			// `configFile: false` évite de ré-exécuter cette config (récursion).
			const loader = await createServer({
				configFile: false,
				root: import.meta.dirname,
				appType: "custom",
				logLevel: "warn",
				resolve: { alias },
				// Aucun code client n'est servi par ce serveur : le scan de
				// dépendances et le pre-bundling seraient du travail pur perte.
				optimizeDeps: { noDiscovery: true, include: [] },
				server: { middlewareMode: true, hmr: false, watch: null },
			});

			server.httpServer?.on("close", () => void loader.close());

			server.middlewares.use(
				apiMiddleware(
					apiDir,
					(route) => loader.ssrLoadModule(route),
					(error) => {
						loader.ssrFixStacktrace(error);
						console.error(error);
					},
				),
			);
		},
	};
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	// Les handlers `api/*.ts` lisent leurs identifiants dans `process.env`
	// (contrat Vercel). Vite n'expose que les variables préfixées `VITE_` :
	// on recopie donc explicitement celles du `.env` local dont ils ont besoin.
	const env = loadEnv(mode, import.meta.dirname, "");
	for (const key of ["ADEME_API_CLIENT_ID", "ADEME_API_CLIENT_SECRET"]) {
		if (!process.env[key] && env[key]) process.env[key] = env[key];
	}

	return {
		plugins: [
			serverlessApi(),
			visualizer(),
			react(),
			tailwindcss(),
			VitePWA({
				registerType: "autoUpdate",
				includeAssets: ["favicon.ico", "icons/apple-touch-icon-180x180.png"],
				manifest: {
					name: "Ambassadeur Rénov'",
					short_name: "AmbassadeurRenov'",
					description:
						"Mieux comprendre la performance énergétique des logements",
					start_url: "/",
					scope: "/",
					display: "standalone",
					orientation: "portrait",
					background_color: "#ffffff",
					theme_color: "#2C3EC4",
					lang: "fr",
					icons: [
						{
							src: "/icons/icon-192x192.png",
							sizes: "192x192",
							type: "image/png",
							purpose: "any",
						},
						{
							src: "/icons/icon-192x192.png",
							sizes: "192x192",
							type: "image/png",
							purpose: "maskable",
						},
						{
							src: "/icons/icon-256x256.png",
							sizes: "256x256",
							type: "image/png",
							purpose: "any",
						},
						{
							src: "/icons/icon-384x384.png",
							sizes: "384x384",
							type: "image/png",
							purpose: "any",
						},
						{
							src: "/icons/icon-512x512.png",
							sizes: "512x512",
							type: "image/png",
							purpose: "any",
						},
						{
							src: "/icons/icon-512x512.png",
							sizes: "512x512",
							type: "image/png",
							purpose: "maskable",
						},
					],
				},

				workbox: {
					maximumFileSizeToCacheInBytes: 4000000,
					navigateFallback: "/index.html",
					navigateFallbackDenylist: [/^\/api\//],
				},

				devOptions: {
					enabled: true,
				},
			}),
		],

		resolve: { alias },
	};
});
