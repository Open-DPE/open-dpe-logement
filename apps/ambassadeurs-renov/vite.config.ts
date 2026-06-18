import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.ico", "icons/apple-touch-icon-180x180.png"],
			manifest: {
				name: "Ambassadeur Rénov'",
				short_name: "AmbassadeurRenov'",
				description: "Mieux comprendre la performance énergétique des logements",
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

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@svg": path.resolve(__dirname, "./src/assets/svg"),
			"@icon": path.resolve(__dirname, "./src/assets/icons"),
			"@component": path.resolve(__dirname, "./src/components"),
			"@store": path.resolve(__dirname, "./src/stores"),
		},
	},
});
