// @ts-check
/**
 * Génère src/dpe.enums.ts depuis enums.dpe.json
 *
 * Usage : node scripts/generate-enums-dpe.mjs
 *
 * Règles de conversion des clés :
 *   - Toutes les clés sont des integers  → clés number en TypeScript
 *   - Au moins une clé non-entière       → clés string en TypeScript
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const INPUT = join(ROOT, "data", "enums.dpe.json");
const OUTPUT = join(ROOT, "src", "dpe", "enums.ts");

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Détermine si toutes les clés d'un enum sont des entiers stricts.
 * "1", "2", "10" → true
 * "1.1", "A"     → false
 *
 * @param {string[]} keys
 * @returns {boolean}
 */
function allKeysAreIntegers(keys) {
	return keys.every((k) => /^-?\d+$/.test(k));
}

/**
 * Convertit un nom snake_case en PascalCase.
 * "periode_construction" → "PeriodeConstruction"
 *
 * @param {string} snakeCase
 * @returns {string}
 */
function toPascalCase(snakeCase) {
	return snakeCase
		.split("_")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");
}

/**
 * Convertit un nom snake_case en SCREAMING_SNAKE_CASE.
 * "periode_construction" → "PERIODE_CONSTRUCTION"
 *
 * @param {string} snakeCase
 * @returns {string}
 */
function toScreamingSnakeCase(snakeCase) {
	return snakeCase.toUpperCase();
}

/**
 * Échappe une valeur string pour insertion dans un template littéral TypeScript.
 *
 * @param {string} str
 * @returns {string}
 */
function escapeString(str) {
	return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * Génère le bloc TypeScript pour un enum donné.
 *
 * @param {string} enumName          Nom de l'enum (snake_case, clé du JSON)
 * @param {Record<string, string>} entries  Paires id → libellé
 * @returns {string}
 */
function generateEnumBlock(enumName, entries) {
	const keys = Object.keys(entries);
	const useIntegerKeys = allKeysAreIntegers(keys);
	const constName = toScreamingSnakeCase(enumName);
	const pascalName = toPascalCase(enumName);

	// Corps de l'objet as const
	const body = keys
		.map((k) => {
			const tsKey = useIntegerKeys ? k : `"${k}"`;
			const tsValue = `"${escapeString(entries[k])}"`;
			return `  ${tsKey}: ${tsValue},`;
		})
		.join("\n");

	// Type de l'identifiant
	const enumType = useIntegerKeys
		? `keyof typeof ${constName}` // number literals : 1 | 2 | 3 …
		: `keyof typeof ${constName}`; // string literals : "A" | "B" …

	return [
		`export const ${constName} = {`,
		body,
		`} as const`,
		``,
		`export type ${pascalName}Enum = ${enumType}`,
	].join("\n");
}

// ─── Main ────────────────────────────────────────────────────────────────────

const raw = readFileSync(INPUT, "utf-8");

/** @type {Record<string, Record<string, string>>} */
const enums = JSON.parse(raw);

const blocks = Object.entries(enums).map(([name, entries]) =>
	generateEnumBlock(name, entries),
);

const header = [
	`// @generated`,
	`// Source : enums.dpe.json`,
	`// Ne pas modifier manuellement — relancer scripts/generate-enums-dpe.mjs`,
	``,
].join("\n");

const output = header + blocks.join("\n\n") + "\n";

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, output, "utf-8");

const enumCount = Object.keys(enums).length;
console.log(`✔ ${enumCount} enums générés → ${OUTPUT}`);
