// @ts-check
// scripts/generate-data.mjs
//
// Compile les jeux de données YAML (source de vérité, éditée à la main)
// vers leur équivalent JSON consommé par l'application via `import`.
import { readFileSync, writeFileSync, globSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load as loadYaml } from "js-yaml";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const DATA = join(ROOT, "data");

for (const file of globSync(`${DATA}/*.yaml`)) {
	const name = basename(file, ".yaml");
	const content = readFileSync(file, { encoding: "utf-8" });
	const parsed = loadYaml(content);

	writeFileSync(join(DATA, `${name}.json`), JSON.stringify(parsed, null, 2), {
		encoding: "utf-8",
	});

	console.log(`✓ ${name}`);
}
