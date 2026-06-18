import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		conditions: ["development", "import", "module", "default"],
	},
	test: {
		environment: "jsdom",
		include: ["tests/**/*.{test,spec}.ts"],
		typecheck: {
			tsconfig: "./tsconfig.test.json",
		},
	},
});
