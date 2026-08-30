#!/usr/bin/env node
// @ts-check
/**
 * Évalue la couverture réelle de `mapFromDPE` sur le corpus de fixtures
 * ADEME (`@open-dpe-logement/ademe-fixtures`).
 *
 * Ce n'est PAS un test : une partie du corpus ne peut structurellement pas
 * être mappée (versions hors périmètre assumé — DPEv1/v2/v2.1 — ou
 * incohérences métier réelles côté données ADEME). Ce script mesure le
 * volume de chaque cas et isole les échecs qui relèvent réellement d'une
 * lacune du mapper, pour prioriser le travail à faire.
 *
 * `tests/fixtures.test.ts` (le vrai test) s'appuie sur `known-failures.json`
 * produit ici pour savoir quelles fixtures exclure.
 *
 * Prérequis : `npm run build` (ce script importe `../dist`, jamais `../src`).
 *
 * Usage :
 *   node scripts/coverage.mjs           affiche le rapport ; code de sortie
 *                                        1 si un échec n'est pas documenté
 *                                        dans known-failures.json, ou si une
 *                                        erreur inattendue survient au stade
 *                                        parse/modèle
 *   node scripts/coverage.mjs --update  réécrit ENTIÈREMENT known-failures.json
 *                                        à partir du résultat courant. Le
 *                                        fichier est groupé par erreur
 *                                        distincte, pas par fixture :
 *                                          - mappingError : une entrée par
 *                                            `key` (clé métier en cause)
 *                                          - schemaInvalid / unexpectedError :
 *                                            une entrée par message d'erreur
 *                                            distinct
 *                                        Chaque entrée porte `count` et
 *                                        `traces` (une occurrence par
 *                                        fixture concernée — `numero_dpe`,
 *                                        `version_dpe`, et pour schemaInvalid
 *                                        l'objet parent de la valeur fautive
 *                                        via `context`, voir `deriveErrorContext`).
 *                                        Le fichier est intégralement
 *                                        régénéré à chaque exécution —
 *                                        aucune valeur précédente n'est
 *                                        préservée, y compris un `message`
 *                                        réécrit à la main : c'est un
 *                                        instantané mécanique de l'état du
 *                                        mapper, pas une documentation
 *                                        cumulative.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { listDpeFixtures } from "@open-dpe-logement/ademe-fixtures";
import { parse } from "@open-dpe-logement/ademe-parser";
import { dpe } from "@open-dpe-logement/ademe-models";
import { validate } from "@open-dpe-logement/validator";
import { mapFromDPE } from "../dist/from-ademe/index.js";
import { MappingError, SupportError } from "../dist/from-ademe/errors.js";

/**
 * @typedef {import("@open-dpe-logement/ademe-fixtures").DpeFixtureEntry} DpeFixtureEntry
 * @typedef {import("@open-dpe-logement/validator").ValidationError} ValidationError
 */

/**
 * @typedef {object} BaseResult
 * @property {string} numero_dpe
 * @property {string} version_dpe
 */

/** @typedef {BaseResult & { bucket: "success" }} SuccessResult */
/** @typedef {BaseResult & { bucket: "unsupported", message: string }} UnsupportedResult */
/** @typedef {BaseResult & { bucket: "mappingError", key: string, value: unknown, message: string }} MappingErrorResult */
/** @typedef {BaseResult & { bucket: "schemaInvalid", errors: ValidationError[], diagnostic: unknown }} SchemaInvalidResult */
/** @typedef {BaseResult & { bucket: "unexpectedError", stage: "parse" | "map", message: string }} UnexpectedErrorResult */

/**
 * @typedef {SuccessResult | UnsupportedResult | MappingErrorResult | SchemaInvalidResult | UnexpectedErrorResult} Result
 * @typedef {MappingErrorResult | SchemaInvalidResult | UnexpectedErrorResult} FailureResult
 */

/**
 * @typedef {object} KnownFailureTrace
 * @property {string} numero_dpe
 * @property {string} version_dpe
 * @property {Record<string, unknown>} [context] schemaInvalid seulement :
 *   objet parent de la valeur fautive de CETTE occurrence, indexé par son
 *   JSON Pointer — voir `deriveErrorContext`. Toujours régénéré.
 */

/**
 * @typedef {object} MappingErrorEntry
 * @property {"mappingError"} error
 * @property {string} message dérivé mécaniquement de `key` (voir
 *   `formatMappingErrorMessage`). Toujours régénéré.
 * @property {string} key clé métier en cause (ex. `mur_id`) — une entrée par
 *   clé, quel que soit le nombre d'occurrences.
 * @property {number} count nombre d'occurrences (= `traces.length`).
 * @property {KnownFailureTrace[]} traces
 */

/**
 * @typedef {object} SchemaInvalidOrUnexpectedEntry
 * @property {"schemaInvalid" | "unexpectedError"} error
 * @property {string} message texte d'erreur distinct (JSON Schema, ou
 *   message d'erreur inattendue) — une entrée par message, quel que soit le
 *   nombre d'occurrences. Toujours régénéré.
 * @property {number} count nombre d'occurrences (= `traces.length`).
 * @property {KnownFailureTrace[]} traces
 */

/**
 * @typedef {MappingErrorEntry | SchemaInvalidOrUnexpectedEntry} KnownFailureEntry
 */

/**
 * @typedef {object} ResultsByBucket
 * @property {SuccessResult[]} success
 * @property {UnsupportedResult[]} unsupported
 * @property {MappingErrorResult[]} mappingError
 * @property {SchemaInvalidResult[]} schemaInvalid
 * @property {UnexpectedErrorResult[]} unexpectedError
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const KNOWN_FAILURES_FILE = join(__dirname, "..", "known-failures.json");
const UPDATE = process.argv.includes("--update");

/** @returns {KnownFailureEntry[]} */
function loadKnownFailures() {
	try {
		return /** @type {KnownFailureEntry[]} */ (
			JSON.parse(readFileSync(KNOWN_FAILURES_FILE, "utf-8"))
		);
	} catch {
		return [];
	}
}

/**
 * Formate une erreur inattendue (hors `SupportError`/`MappingError`) sans
 * présumer de sa forme — le stade parse/modèle peut lever `unknown`.
 *
 * @param {unknown} error
 * @returns {string}
 */
function formatUnexpectedError(error) {
	if (error instanceof Error) return error.stack ?? error.message;
	return String(error);
}

/**
 * Première ligne d'un texte éventuellement multi-lignes (ex. une stack) —
 * pour garder `message` lisible dans `known-failures.json`, la stack
 * complète reste disponible via le rapport console (§ "erreur inattendue").
 *
 * @param {string} text
 * @returns {string}
 */
function firstLine(text) {
	return text.split("\n")[0] ?? text;
}

// Mesuré sur le corpus complet : les objets d'entité (profondeur >= 2, ex.
// `/enveloppe/murs/0`, `/chauffage/installations/0/systemes/0`) sont 90 % des
// contextes et minuscules (p90 ~636 caractères, jamais un problème). Les
// pointeurs peu profonds (racine ou collection de 1er niveau, ex.
// `/chauffage/installations`) sont rares (10 %) mais peuvent peser jusqu'à
// ~45 Ko — c'est le seul cas qui justifie une borne.
const MAX_SHALLOW_CONTEXT_LENGTH = 500;

/**
 * Résout un JSON Pointer (RFC 6901, tel que produit par ajv dans
 * `instancePath`/`field`) dans un objet.
 *
 * @param {unknown} root
 * @param {string} pointer
 * @returns {unknown}
 */
function getAtPointer(root, pointer) {
	if (!pointer) return root;
	const parts = pointer
		.split("/")
		.filter((part) => part !== "")
		.map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"));
	/** @type {unknown} */
	let current = root;
	for (const part of parts) {
		if (current === null || typeof current !== "object") return undefined;
		current = /** @type {Record<string, unknown>} */ (current)[part];
	}
	return current;
}

/**
 * JSON Pointer du parent d'un pointeur donné. Le parent de la racine (`""`)
 * est la racine elle-même — il n'y a rien au-dessus.
 *
 * @param {string} pointer
 * @returns {string}
 */
function getParentPointer(pointer) {
	if (!pointer) return "";
	const lastSlash = pointer.lastIndexOf("/");
	return lastSlash <= 0 ? "" : pointer.slice(0, lastSlash);
}

/**
 * Profondeur d'un JSON Pointer (nombre de segments). La racine (`""`) est à
 * la profondeur 0.
 *
 * @param {string} pointer
 * @returns {number}
 */
function pointerDepth(pointer) {
	return pointer === "" ? 0 : pointer.split("/").filter((part) => part !== "").length;
}

/**
 * Valeur de contexte, bornée en taille uniquement pour les pointeurs peu
 * profonds (racine ou collection de 1er niveau, `depth < 2`) — ce sont les
 * seuls cas qui peuvent désigner tout ou partie du document. Les objets
 * d'entité (`depth >= 2`, ex. `/enveloppe/murs/0`) ne sont jamais tronqués :
 * c'est précisément le contexte utile pour comprendre un échec de
 * polymorphisme, et il reste petit en pratique.
 *
 * @param {unknown} value
 * @param {number} depth
 * @returns {unknown}
 */
function bounded(value, depth) {
	if (depth >= 2) return value;
	const json = JSON.stringify(value) ?? "undefined";
	if (json.length <= MAX_SHALLOW_CONTEXT_LENGTH) return value;
	return `${json.slice(0, MAX_SHALLOW_CONTEXT_LENGTH)}… (tronqué, ${json.length} caractères)`;
}

/**
 * Texte d'erreur JSON Schema pour UNE erreur ajv donnée (pas un agrégat par
 * fixture) — c'est cette chaîne qui sert de clé de regroupement des
 * `schemaInvalid` dans `known-failures.json` : deux fixtures qui produisent
 * exactement la même erreur (même champ, même message ajv) partagent la
 * même entrée, avec une trace chacune.
 *
 * @param {ValidationError} error
 * @returns {string}
 */
function formatSchemaError(error) {
	return `${error.field || "(racine)"} : ${error.message}`;
}

/**
 * @param {string} key
 * @returns {string}
 */
function formatMappingErrorMessage(key) {
	return `Incohérence métier (MappingError) : clé \`${key}\``;
}

/**
 * @param {UnexpectedErrorResult} entry
 * @returns {string}
 */
function formatUnexpectedErrorMessage(entry) {
	return `Erreur inattendue (${entry.stage}) : ${firstLine(entry.message)}`;
}

/**
 * Objet *parent* de la valeur fautive d'UNE erreur `schemaInvalid` donnée,
 * plutôt que la valeur elle-même : une erreur de polymorphisme (discriminant
 * `oneOf`/`const`/`enum`) ne se comprend qu'avec les champs voisins du
 * discriminant, pas avec la seule valeur qui a échoué (ex. `annee_installation`
 * seule ne dit rien sur pourquoi — il faut voir `etat` à côté, dans le même
 * objet `isolation`). Indexé par le JSON Pointer du parent.
 *
 * @param {unknown} diagnostic
 * @param {ValidationError} error
 * @returns {Record<string, unknown>}
 */
function deriveErrorContext(diagnostic, error) {
	const parentPointer = getParentPointer(error.field);
	const key = parentPointer || "(racine)";
	return { [key]: bounded(getAtPointer(diagnostic, parentPointer), pointerDepth(parentPointer)) };
}

/**
 * @param {DpeFixtureEntry} fixture
 * @returns {Result}
 */
function evaluate(fixture) {
	const { numero_dpe, version_dpe, path } = fixture;
	const xml = readFileSync(path, "utf-8");

	// Parse + validation Zod : garanti à 100 % par ademe-parser/ademe-models
	// sur ce même corpus (voir leurs tests respectifs). Un échec ici serait
	// une régression grave, hors périmètre de ce script.
	/** @type {dpe.DPELogementExistant} */
	let data;
	try {
		data = dpe.DPELogementExistant.parse(parse(xml));
	} catch (error) {
		return {
			numero_dpe,
			version_dpe,
			bucket: "unexpectedError",
			stage: "parse",
			message: formatUnexpectedError(error),
		};
	}

	/** @type {import("@open-dpe-logement/models").diagnostic.Diagnostic} */
	let diagnostic;
	try {
		diagnostic = mapFromDPE(data);
	} catch (error) {
		if (error instanceof SupportError) {
			return {
				numero_dpe,
				version_dpe,
				bucket: "unsupported",
				message: error.message,
			};
		}
		if (error instanceof MappingError) {
			return {
				numero_dpe,
				version_dpe,
				bucket: "mappingError",
				key: error.key,
				value: error.value,
				message: error.message,
			};
		}
		return {
			numero_dpe,
			version_dpe,
			bucket: "unexpectedError",
			stage: "map",
			message: formatUnexpectedError(error),
		};
	}

	const validation = validate("/diagnostic", diagnostic);
	if (!validation.valid) {
		return {
			numero_dpe,
			version_dpe,
			bucket: "schemaInvalid",
			errors: validation.errors,
			// Gardé le temps de dériver le `context` de chaque erreur (voir
			// `deriveErrorContext`) — jamais écrit tel quel dans
			// known-failures.json : ce n'est pas une donnée à committer,
			// elle est intégralement reproductible depuis la fixture.
			diagnostic,
		};
	}

	return { numero_dpe, version_dpe, bucket: "success" };
}

/**
 * @param {Result[]} results
 * @returns {ResultsByBucket}
 */
function report(results) {
	/** @type {ResultsByBucket} */
	const byBucket = {
		success: [],
		unsupported: [],
		mappingError: [],
		schemaInvalid: [],
		unexpectedError: [],
	};
	for (const result of results) {
		switch (result.bucket) {
			case "success":
				byBucket.success.push(result);
				break;
			case "unsupported":
				byBucket.unsupported.push(result);
				break;
			case "mappingError":
				byBucket.mappingError.push(result);
				break;
			case "schemaInvalid":
				byBucket.schemaInvalid.push(result);
				break;
			case "unexpectedError":
				byBucket.unexpectedError.push(result);
				break;
		}
	}

	const supported = results.length - byBucket.unsupported.length;
	const mappedOk = byBucket.success.length;

	console.log(`\nCorpus : ${results.length} fixtures`);
	console.log(
		`  - non supportées (SupportError, hors périmètre) : ${byBucket.unsupported.length}`,
	);
	console.log(
		`  - mappées et valides                             : ${mappedOk}`,
	);
	console.log(
		`  - incohérence métier (MappingError)              : ${byBucket.mappingError.length}`,
	);
	console.log(
		`  - sortie invalide vis-à-vis du schéma            : ${byBucket.schemaInvalid.length}`,
	);
	console.log(
		`  - erreur inattendue (parse/modèle — À ALERTER)   : ${byBucket.unexpectedError.length}`,
	);
	console.log(
		`\nCouverture sur le périmètre supporté : ${mappedOk}/${supported}` +
			` (${supported === 0 ? "n/a" : ((100 * mappedOk) / supported).toFixed(1) + "%"})\n`,
	);

	if (byBucket.mappingError.length > 0) {
		/** @type {Map<string, number>} */
		const byKey = new Map();
		for (const r of byBucket.mappingError) {
			byKey.set(r.key, (byKey.get(r.key) ?? 0) + 1);
		}
		console.log("Incohérences métier (MappingError) par clé :");
		const sortedByKey = [...byKey.entries()].sort((a, b) => b[1] - a[1]);
		for (const [key, count] of sortedByKey) {
			console.log(`  - ${key} : ${count}`);
		}
		console.log("");
	}

	return byBucket;
}

/**
 * Regroupe les `mappingError` par `key` : une entrée par clé métier, quel
 * que soit le nombre de fixtures concernées.
 *
 * @param {MappingErrorResult[]} entries
 * @returns {MappingErrorEntry[]}
 */
function buildMappingErrorEntries(entries) {
	/** @type {Map<string, KnownFailureTrace[]>} */
	const tracesByKey = new Map();
	for (const entry of entries) {
		const traces = tracesByKey.get(entry.key) ?? [];
		traces.push({ numero_dpe: entry.numero_dpe, version_dpe: entry.version_dpe });
		tracesByKey.set(entry.key, traces);
	}
	return [...tracesByKey.entries()].map(([key, traces]) => ({
		error: /** @type {const} */ ("mappingError"),
		message: formatMappingErrorMessage(key),
		key,
		count: traces.length,
		traces: traces.sort((a, b) => a.numero_dpe.localeCompare(b.numero_dpe)),
	}));
}

/**
 * Regroupe les `schemaInvalid` par message d'erreur JSON Schema distinct
 * (voir `formatSchemaError`) : une entrée par message, quel que soit le
 * nombre de fixtures concernées. Une même fixture qui produit plusieurs
 * erreurs distinctes apparaît dans plusieurs entrées, une trace chacune —
 * si elle produit deux fois la même erreur (même champ, même message), elle
 * n'apparaît qu'une fois dans cette entrée.
 *
 * @param {SchemaInvalidResult[]} entries
 * @returns {SchemaInvalidOrUnexpectedEntry[]}
 */
function buildSchemaInvalidEntries(entries) {
	/** @type {Map<string, KnownFailureTrace[]>} */
	const tracesByMessage = new Map();
	for (const entry of entries) {
		/** @type {Set<string>} */
		const seenInFixture = new Set();
		for (const error of entry.errors) {
			const message = formatSchemaError(error);
			if (seenInFixture.has(message)) continue;
			seenInFixture.add(message);
			const traces = tracesByMessage.get(message) ?? [];
			traces.push({
				numero_dpe: entry.numero_dpe,
				version_dpe: entry.version_dpe,
				context: deriveErrorContext(entry.diagnostic, error),
			});
			tracesByMessage.set(message, traces);
		}
	}
	return [...tracesByMessage.entries()].map(([message, traces]) => ({
		error: /** @type {const} */ ("schemaInvalid"),
		message,
		count: traces.length,
		traces: traces.sort((a, b) => a.numero_dpe.localeCompare(b.numero_dpe)),
	}));
}

/**
 * Regroupe les `unexpectedError` par message distinct, sur le même principe
 * que `buildSchemaInvalidEntries` — sans `context` (pas de document mappé
 * disponible : l'échec survient avant ou pendant le mapping).
 *
 * @param {UnexpectedErrorResult[]} entries
 * @returns {SchemaInvalidOrUnexpectedEntry[]}
 */
function buildUnexpectedErrorEntries(entries) {
	/** @type {Map<string, KnownFailureTrace[]>} */
	const tracesByMessage = new Map();
	for (const entry of entries) {
		const message = formatUnexpectedErrorMessage(entry);
		const traces = tracesByMessage.get(message) ?? [];
		traces.push({ numero_dpe: entry.numero_dpe, version_dpe: entry.version_dpe });
		tracesByMessage.set(message, traces);
	}
	return [...tracesByMessage.entries()].map(([message, traces]) => ({
		error: /** @type {const} */ ("unexpectedError"),
		message,
		count: traces.length,
		traces: traces.sort((a, b) => a.numero_dpe.localeCompare(b.numero_dpe)),
	}));
}

const ERROR_ORDER = /** @type {const} */ ({
	mappingError: 0,
	schemaInvalid: 1,
	unexpectedError: 2,
});

/**
 * Tri déterministe : par type d'erreur, puis par nombre d'occurrences
 * décroissant (les cas les plus fréquents en premier, pour prioriser), puis
 * par clé/message croissant en cas d'égalité.
 *
 * @param {KnownFailureEntry[]} entries
 * @returns {KnownFailureEntry[]}
 */
function sortEntries(entries) {
	return [...entries].sort((a, b) => {
		if (ERROR_ORDER[a.error] !== ERROR_ORDER[b.error]) {
			return ERROR_ORDER[a.error] - ERROR_ORDER[b.error];
		}
		if (b.count !== a.count) return b.count - a.count;
		const aKey = a.error === "mappingError" ? a.key : a.message;
		const bKey = b.error === "mappingError" ? b.key : b.message;
		return aKey.localeCompare(bKey);
	});
}

/**
 * @param {ResultsByBucket} byBucket
 * @returns {number} code de sortie du process
 */
function reconcileKnownFailures(byBucket) {
	const known = loadKnownFailures();
	// known-failures.json est groupé par erreur distincte, pas par fixture :
	// pour savoir si UNE fixture est documentée, on aplatit les `traces` de
	// toutes les entrées. `version_dpe` gardée pour l'affichage de `stale`
	// (identique pour toutes les occurrences d'un même numero_dpe).
	/** @type {Map<string, string>} */
	const knownTraceByNumero = new Map();
	for (const entry of known) {
		for (const trace of entry.traces) {
			if (!knownTraceByNumero.has(trace.numero_dpe)) {
				knownTraceByNumero.set(trace.numero_dpe, trace.version_dpe);
			}
		}
	}

	/** @type {FailureResult[]} */
	const currentFailures = [
		...byBucket.mappingError,
		...byBucket.schemaInvalid,
		...byBucket.unexpectedError,
	];
	const currentByNumero = new Map(
		currentFailures.map((entry) => [entry.numero_dpe, entry]),
	);

	const undocumented = currentFailures.filter(
		(entry) => !knownTraceByNumero.has(entry.numero_dpe),
	);
	const stale = [...knownTraceByNumero.entries()].filter(
		([numero_dpe]) => !currentByNumero.has(numero_dpe),
	);

	if (undocumented.length > 0) {
		console.error(
			`${undocumented.length} échec(s) non documenté(s) dans known-failures.json :`,
		);
		for (const entry of undocumented) {
			const keySuffix = entry.bucket === "mappingError" ? `: ${entry.key}` : "";
			console.error(
				`  - ${entry.numero_dpe} (v${entry.version_dpe}, ${entry.bucket}${keySuffix})`,
			);
		}
		console.error(
			UPDATE
				? "\n--update va régénérer le fichier et les inclure.\n"
				: "\nRelancer avec --update pour régénérer le fichier et les inclure.\n",
		);
	}

	if (stale.length > 0) {
		console.warn(
			`${stale.length} fixture(s) documentée(s) dans known-failures.json ne sont plus en échec :`,
		);
		for (const [numero_dpe, version_dpe] of stale) {
			console.warn(`  - ${numero_dpe} (v${version_dpe})`);
		}
		console.warn(
			UPDATE
				? "\n--update va régénérer le fichier et les retirer.\n"
				: "\nRelancer avec --update pour régénérer le fichier et les retirer.\n",
		);
	}

	if (byBucket.unexpectedError.length > 0) {
		console.error(
			`${byBucket.unexpectedError.length} erreur(s) inattendue(s) au stade parse/modèle — ` +
				"ce corpus est garanti à 100 % par ademe-parser/ademe-models, une régression ici est sérieuse.\n",
		);
	}

	if (UPDATE) {
		// known-failures.json est intégralement régénéré à chaque --update,
		// groupé par erreur distincte (pas par fixture) : `message` et
		// `context` sont recalculés à neuf à partir du résultat courant,
		// sans jamais réutiliser le contenu du fichier précédent — voir le
		// commentaire d'en-tête du script.
		const updated = sortEntries([
			...buildMappingErrorEntries(byBucket.mappingError),
			...buildSchemaInvalidEntries(byBucket.schemaInvalid),
			...buildUnexpectedErrorEntries(byBucket.unexpectedError),
		]);
		writeFileSync(
			KNOWN_FAILURES_FILE,
			JSON.stringify(updated, null, 2) + "\n",
			"utf-8",
		);
		const totalTraces = updated.reduce((sum, entry) => sum + entry.count, 0);
		console.log(
			`known-failures.json mis à jour (${updated.length} erreur(s) distincte(s), ${totalTraces} occurrence(s)).`,
		);
		return 0;
	}

	return byBucket.unexpectedError.length > 0 || undocumented.length > 0
		? 1
		: 0;
}

const fixtures = listDpeFixtures();
const results = fixtures.map(evaluate);
const byBucket = report(results);
process.exitCode = reconcileKnownFailures(byBucket);
