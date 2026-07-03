// @ts-check
// scripts/generate-schemas.mjs
import { readFileSync, writeFileSync, mkdirSync, globSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load as loadYaml, dump as dumpYaml } from "js-yaml";
import { registerSchema } from "@hyperjump/json-schema/draft-2020-12";
import { bundle } from "@hyperjump/json-schema/bundle";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const SOURCE = join(ROOT, "schemas");
const DRAFT = "https://json-schema.org/draft/2020-12/schema";
const OPENAPI_SCHEMAS = ["https://schemas.open-dpe.fr/diagnostic"];

const OPENAPI_TARGET = join(ROOT, "apps", "api", "schemas");
const VALIDATOR_TARGET = join(ROOT, "packages", "validator", "data");
mkdirSync(OPENAPI_TARGET, { recursive: true });
mkdirSync(VALIDATOR_TARGET, { recursive: true });

const schemaFiles = globSync(`${SOURCE}/**/*.yaml`);

/**
 * @param {string} file
 * @returns {boolean}
 */
function isPrivate(file) {
	return basename(file).startsWith("_");
}

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

// Enregistrement de tous les schémas valides (nécessaires pour la résolution des $ref lors du bundle)
for (const file of schemaFiles) {
	const content = readFileSync(file, { encoding: "utf-8" });
	const parsed = asSchema(loadYaml(content));
	injectDynamicConstraints(parsed);
	if (parsed.$id && parsed.$schema === DRAFT)
		registerSchema(/** @type {any} */ (parsed));
}

for (const file of schemaFiles) {
	const content = readFileSync(file, { encoding: "utf-8" });
	const parsed = asSchema(loadYaml(content));
	const $id = parsed.$id;

	if (!$id) continue;

	const name = toFilename($id);

	// Publication des schémas JSON
	writeFileSync(`${VALIDATOR_TARGET}/${name}.json`, JSON.stringify(parsed), {
		encoding: "utf-8",
	});

	// Compilation des schémas publics
	if (OPENAPI_SCHEMAS.includes($id)) {
		const bundled = await bundle($id);
		const yaml = dumpYaml(bundled);

		writeFileSync(`${OPENAPI_TARGET}/${name}.yaml`, yaml, {
			encoding: "utf-8",
		});
	}

	console.log(`✓ ${name}`);
}
