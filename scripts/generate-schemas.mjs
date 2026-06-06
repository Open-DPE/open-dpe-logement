// @ts-check
// scripts/generate-schemas.mjs
import { readFileSync, writeFileSync, mkdirSync, globSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load as loadYaml } from "js-yaml";
import { registerSchema } from "@hyperjump/json-schema/draft-2020-12";
import { bundle } from "@hyperjump/json-schema/bundle";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const SCHEMAS_DIR = join(ROOT, "schemas");
const TARGET = join(ROOT, "packages", "schemas", "src", "data");

mkdirSync(TARGET, { recursive: true });

const schemaFiles = globSync(`${SCHEMAS_DIR}/**/*.yaml`);

const VALID_SCHEMA = "https://json-schema.org/draft/2020-12/schema";

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
	if (parsed.$id && parsed.$schema === VALID_SCHEMA)
		registerSchema(/** @type {any} */ (parsed));
}

// Compilation des schémas publics
for (const file of schemaFiles) {
	const content = readFileSync(file, { encoding: "utf-8" });
	const parsed = asSchema(loadYaml(content));
	const $id = parsed.$id;

	if (!$id || isPrivate(file)) continue;

	const bundled = await bundle($id);
	const name = toFilename($id);
	const stringidied = [
		"// ⚠️  Fichier auto-généré — ne pas modifier manuellement.",
		"",
		`const schema = ${JSON.stringify(JSON.stringify(bundled))} as const;`,
		"",
		"export default schema;",
		"",
	].join("\n");

	writeFileSync(`${TARGET}/${name}.ts`, stringidied, {
		encoding: "utf-8",
	});
	console.log(`✓ ${name}`);
}
