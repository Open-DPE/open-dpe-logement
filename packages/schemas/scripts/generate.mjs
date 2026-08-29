// @ts-check
// scripts/generate-schemas.mjs
import { readFileSync, writeFileSync, mkdirSync, globSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { load as loadYaml } from "js-yaml";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const SOURCE = join(ROOT, "schemas");
const TARGET = join(ROOT, "data");

mkdirSync(TARGET, { recursive: true });

const schemaFiles = globSync(`${SOURCE}/**/*.yaml`);

/**
 * @param {unknown} value
 * @returns {{ $id?: string; $schema?: string; [key: string]: unknown; $defs?: Record<string, unknown> }}
 */
function asSchema(value) {
	if (typeof value !== "object" || value === null)
		throw new Error("Schéma invalide");

	return /** @type {any} */ (value);
}

/**
 * @param {string} $id
 * @returns {string}
 */
function toFilename($id) {
	return $id.replace("https://schemas.open-dpe.fr/", "").replaceAll("/", ".");
}

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Injecte les contraintes dynamiques dans un schéma parsé.
 * @param {ReturnType<typeof asSchema>} schema
 */
function injectDynamicConstraints(schema) {
	if (schema.$id === "https://schemas.open-dpe.fr/common") {
		if (
			schema.$defs &&
			typeof schema.$defs === "object" &&
			schema.$defs["annee"] &&
			typeof schema.$defs["annee"] === "object"
		) {
			/** @type {any} */ (schema.$defs["annee"]).maximum = CURRENT_YEAR;
		}
	}
}

for (const file of schemaFiles) {
	const content = readFileSync(file, { encoding: "utf-8" });
	const parsed = asSchema(loadYaml(content));
	const $id = parsed.$id;

	if (!$id) continue;

	const name = toFilename($id);

	injectDynamicConstraints(parsed);
	// Publication des schémas JSON
	writeFileSync(`${TARGET}/${name}.json`, JSON.stringify(parsed), {
		encoding: "utf-8",
	});

	console.log(`✓ ${name}`);
}
