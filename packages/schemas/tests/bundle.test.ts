import { readFileSync, globSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "vitest";
import { load as loadYaml } from "js-yaml";
import { registerSchema } from "@hyperjump/json-schema/draft-2020-12";
import { bundle } from "@hyperjump/json-schema/bundle";

/**
 * Reproduit le comportement de ../scripts/generate.mjs (enregistrement +
 * injection dynamique), pour vérifier que chaque schéma public se bundle
 * sans erreur — c'est-à-dire qu'il est structurellement valide et qu'aucune
 * de ses $ref (directes ou transitives) n'est manquante.
 */

type Schema = {
	$id?: string;
	$schema?: string;
	$defs?: Record<string, unknown>;
	[key: string]: unknown;
};

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const SOURCE = join(ROOT, "schemas");
const DRAFT = "https://json-schema.org/draft/2020-12/schema";

function isPrivate(file: string): boolean {
	return basename(file).startsWith("_");
}

function parseSchema(file: string): Schema {
	const content = readFileSync(file, { encoding: "utf-8" });
	const parsed = loadYaml(content);
	if (typeof parsed !== "object" || parsed === null) {
		throw new Error(`Schéma invalide : ${file}`);
	}
	return parsed as Schema;
}

// Même injection dynamique que scripts/generate.mjs : un $ref vers
// `common#/$defs/annee` doit résoudre un schéma qui porte la même valeur
// que celle publiée dans le catalogue (voir le bug de régression déjà
// rencontré sur ce mécanisme précis).
function injectDynamicConstraints(schema: Schema): void {
	if (schema.$id === "https://schemas.open-dpe.fr/common") {
		const annee = schema.$defs?.["annee"];
		if (annee && typeof annee === "object") {
			(annee as Record<string, unknown>).maximum = new Date().getFullYear();
		}
	}
}

const files = globSync(`${SOURCE}/**/*.yaml`);
const schemas = files.map((file) => {
	const parsed = parseSchema(file);
	injectDynamicConstraints(parsed);
	return { file, parsed };
});

// Enregistrement de tous les schémas (publics et privés) pour que la
// résolution des $ref croisés fonctionne, comme dans scripts/generate.mjs.
for (const { parsed } of schemas) {
	if (parsed.$id && parsed.$schema === DRAFT) {
		registerSchema(parsed as Parameters<typeof registerSchema>[0]);
	}
}

const publicSchemas = schemas.filter(
	({ file, parsed }) => !isPrivate(file) && parsed.$id,
);

describe("bundle des schémas publics", () => {
	it.each(publicSchemas.map(({ parsed }) => [parsed.$id as string]))(
		"%s se bundle sans erreur ($ref résolues)",
		async ($id) => {
			await bundle($id);
		},
	);
});
