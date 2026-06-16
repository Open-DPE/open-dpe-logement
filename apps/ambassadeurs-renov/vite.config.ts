import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],

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
