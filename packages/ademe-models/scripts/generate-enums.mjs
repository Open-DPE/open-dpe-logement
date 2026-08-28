// @ts-check
/**
 * Génère src/dpe/enums.ts et src/audit/enums.ts depuis data/enums.dpe.json
 * et data/enums.audit.json respectivement.
 *
 * Usage : node scripts/generate-enums.mjs
 *
 * Format généré, pour un groupe d'enum donné (ex. "version") :
 *
 *   /**
 *    * "1": "description"
 *    * "2": "autre description"
 *    *\/
 *   export const VERSION = ["1", "2", ...] as const
 *   export const VersionEnum = z.enum(VERSION)
 *   export type VersionEnum = z.infer<typeof VersionEnum>
 *
 * Toutes les valeurs d'enum sont des strings (contrainte de `z.enum`), même
 * quand la donnée XML source est un entier (xs:int côté XSD). C'est un choix
 * délibéré de simplicité et d'uniformité (voir README) : un seul type par
 * enum, quel que soit son groupe — plutôt qu'un type `number` pour les
 * groupes à clés entières et `string` pour les groupes à clés décimales
 * (ex. version : "1.1", "2.6"). La conversion valeur XML (number) -> string
 * attendue par ces schémas est à la charge de l'étape de parsing (hors
 * périmètre de ce générateur).
 *
 * Ordre des valeurs dans le tableau généré : dérivé de `Object.entries()`
 * sur l'objet JSON parsé, PAS de l'ordre textuel du fichier JSON source.
 * Pour les clés canoniques entières (ex. "1", "2", "10"), le moteur JS les
 * réordonne toujours par ordre numérique croissant, avant les clés non
 * entières (ex. "1.1") qui, elles, conservent l'ordre d'insertion — c'est
 * un comportement de la spec ECMAScript (ordre d'énumération des clés de
 * propriété), pas un bug de ce script. Exemple observé sur le groupe
 * "version" : source JSON = ["1", "1.1", "2", "2.1", ...], tableau généré =
 * ["1", "2", "1.1", "2.1", ...].
 *
 * Deux domaines ADEME sont générés côte à côte (DPE et Audit énergétique) :
 * leurs groupes d'enum respectifs (`data/enums.dpe.json` et
 * `data/enums.audit.json`) n'ont aucun recouvrement de nom — vérifié lors de
 * l'analyse XSD (voir doc projet) — donc aucun risque de collision entre les
 * deux fichiers `enums.ts` générés, chacun dans son propre module.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");

/** @type {Array<{ name: string, input: string, output: string }>} */
const DOMAINS = [
	{
		name: "dpe",
		input: join(ROOT, "data", "enums.dpe.json"),
		output: join(ROOT, "src", "dpe", "enums.ts"),
	},
	{
		name: "audit",
		input: join(ROOT, "data", "enums.audit.json"),
		output: join(ROOT, "src", "audit", "enums.ts"),
	},
];

// ─── Helpers ────────────────────────────────────────────────────────────────

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
 * Échappe une valeur string pour insertion dans un commentaire JSDoc
 * (`/** ... *\/`) : neutralise toute séquence `*\/` qui fermerait le bloc
 * prématurément, et aplatit les retours à la ligne éventuels pour garder
 * une entrée par ligne de commentaire.
 *
 * @param {string} str
 * @returns {string}
 */
function escapeJsDocComment(str) {
	return str.replace(/\*\//g, "*\\/").replace(/\r?\n/g, " ");
}

/**
 * Génère le bloc TypeScript pour un enum donné.
 *
 * @param {string} domainName        Nom du domaine (pour le message d'erreur)
 * @param {string} enumName          Nom de l'enum (snake_case, clé du JSON)
 * @param {Record<string, string>} entries  Paires id → libellé
 * @returns {string}
 */
function generateEnumBlock(domainName, enumName, entries) {
	const keys = Object.keys(entries);

	if (keys.length === 0) {
		throw new Error(
			`Groupe d'enum "${enumName}" vide dans enums.${domainName}.json — au moins une valeur est requise (z.enum exige un tuple non vide).`,
		);
	}

	const constName = toScreamingSnakeCase(enumName);
	const pascalName = toPascalCase(enumName);
	const typeName = `${pascalName}Enum`;

	const comment = [
		`/**`,
		...keys.map((k) => ` * "${k}": "${escapeJsDocComment(entries[k])}"`),
		` */`,
	].join("\n");

	const body = keys.map((k) => `  "${escapeString(k)}",`).join("\n");

	return [
		comment,
		`export const ${constName} = [`,
		body,
		`] as const`,
		``,
		`export const ${typeName} = z.enum(${constName})`,
		`export type ${typeName} = z.infer<typeof ${typeName}>`,
	].join("\n");
}

/**
 * Génère un fichier enums.ts pour un domaine donné.
 *
 * @param {{ name: string, input: string, output: string }} domain
 * @returns {number} Nombre de groupes d'enum générés
 */
function generateDomain(domain) {
	const raw = readFileSync(domain.input, "utf-8");

	/** @type {Record<string, Record<string, string>>} */
	const enums = JSON.parse(raw);

	const blocks = Object.entries(enums).map(([name, entries]) =>
		generateEnumBlock(domain.name, name, entries),
	);

	const inputBasename = domain.input.split(/[\\/]/).pop();

	const header = [
		`// @generated`,
		`// Source : ${inputBasename}`,
		`// Ne pas modifier manuellement — relancer scripts/generate-enums.mjs`,
		``,
		`import * as z from "zod"`,
		``,
	].join("\n");

	const output = header + blocks.join("\n\n") + "\n";

	mkdirSync(dirname(domain.output), { recursive: true });
	writeFileSync(domain.output, output, "utf-8");

	const enumCount = Object.keys(enums).length;
	console.log(`✔ ${enumCount} enums générés → ${domain.output}`);
	return enumCount;
}

// ─── Main ────────────────────────────────────────────────────────────────────

for (const domain of DOMAINS) {
	generateDomain(domain);
}
