import { load as loadYaml } from "js-yaml";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export type TESTS = Record<
	string,
	{
		run: string;
		cases: Array<{
			title: string;
			with: Record<string, unknown>;
			expect?: unknown;
			expectError?: boolean;
		}>;
	}
>;

export function loadTests(path: string): TESTS {
	const fullPath = resolve(import.meta.dirname, path);
	if (!existsSync(fullPath))
		throw new Error(`Fichier introuvable : ${fullPath}`);

	const raw = loadYaml(readFileSync(fullPath, "utf8"));
	return raw as any;
}
