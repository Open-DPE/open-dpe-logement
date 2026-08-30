import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { listDpeFixtures, type DpeFixtureEntry } from "@open-dpe-logement/ademe-fixtures";
import { parse } from "@open-dpe-logement/ademe-parser";
import { dpe } from "@open-dpe-logement/ademe-models";
import { validate } from "@open-dpe-logement/validator";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mapFromDPE } from "../src/from-ademe/index.js";
import { resetIdGenerator, setIdGenerator } from "../src/from-ademe/common.js";

/**
 * Périmètre : uniquement `mapFromDPE` (le DPE). `mapFromAudit` n'a pour
 * l'instant aucune fixture disponible (`@open-dpe-logement/ademe-fixtures`
 * ne fournit que des DPE) — à traiter séparément le jour où ce corpus
 * existe.
 *
 * Ce test s'appuie sur `known-failures.json`, produit et tenu à jour par
 * `scripts/coverage.mjs` : les fixtures qui échouent pour une raison déjà
 * documentée (incohérence métier ADEME réelle, pas un bug du mapper) sont
 * exclues d'ici — elles restent suivies par le script de couverture, pas
 * par ce test. Toute fixture en échec non documentée doit faire échouer
 * `npm run coverage` avant ce test, jamais être découverte ici en silence.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));

interface KnownFailureTrace {
	numero_dpe: string;
	version_dpe: string;
	context?: Record<string, unknown>;
}

interface KnownFailureEntry {
	error: "mappingError" | "schemaInvalid" | "unexpectedError";
	message: string;
	key?: string;
	count: number;
	traces: KnownFailureTrace[];
}

function loadKnownFailures(): KnownFailureEntry[] {
	try {
		const raw = readFileSync(join(__dirname, "..", "known-failures.json"), "utf-8");
		return JSON.parse(raw) as KnownFailureEntry[];
	} catch {
		return [];
	}
}

/**
 * known-failures.json est groupé par erreur distincte (voir
 * `scripts/coverage.mjs`), pas par fixture : une même fixture peut
 * apparaître dans plusieurs entrées (plusieurs erreurs schemaInvalid
 * distinctes). On aplatit ici tous les `numero_dpe` documentés, toutes
 * entrées confondues, pour savoir quelles fixtures exclure du test.
 */
function flattenKnownFailureNumeros(entries: KnownFailureEntry[]): Set<string> {
	const numeros = new Set<string>();
	for (const entry of entries) {
		for (const trace of entry.traces) {
			numeros.add(trace.numero_dpe);
		}
	}
	return numeros;
}

/**
 * Versions couvertes par le mapper (cf. `from-ademe/types.ts` et le tableau
 * de support du README). DPEv1/v2/v2.1 sont hors périmètre assumé.
 */
const SUPPORTED_VERSIONS = ["2.2", "2.3", "2.4", "2.5", "2.6"];

const knownFailureNumeros = flattenKnownFailureNumeros(loadKnownFailures());

const allFixtures = listDpeFixtures();
const supportedFixtures = allFixtures.filter((fixture) =>
	SUPPORTED_VERSIONS.includes(fixture.version_dpe),
);
const unsupportedFixtures = allFixtures.filter(
	(fixture) => !SUPPORTED_VERSIONS.includes(fixture.version_dpe),
);
const testableFixtures = supportedFixtures.filter(
	(fixture) => !knownFailureNumeros.has(fixture.numero_dpe),
);

function loadInput(path: string) {
	const xml = readFileSync(path, "utf-8");
	return dpe.DPELogementExistant.parse(parse(xml));
}

describe("mapFromDPE() — corpus de fixtures DPE réelles (versions supportées)", () => {
	it("couvre au moins une fixture (corpus non vide, hors known-failures.json)", () => {
		expect(testableFixtures.length).toBeGreaterThan(0);
	});

	it.each(testableFixtures)(
		"$numero_dpe (v$version_dpe) : mappe sans erreur et produit un diagnostic valide",
		({ path }: DpeFixtureEntry) => {
			const input = loadInput(path);
			const diagnostic = mapFromDPE(input);

			const result = validate("/diagnostic", diagnostic);
			expect(
				result.valid,
				result.valid ? undefined : JSON.stringify(result.errors, null, 2),
			).toBe(true);
		},
	);
});

/**
 * DPEv1/v2/v2.1 : le rejet doit être propre (`SupportError`), jamais un
 * crash quelconque plus loin dans le mapping.
 */
describe("mapFromDPE() — versions non supportées", () => {
	it.each(unsupportedFixtures)(
		"$numero_dpe (v$version_dpe) : rejette proprement (SupportError)",
		({ path }: DpeFixtureEntry) => {
			const input = loadInput(path);

			expect(() => mapFromDPE(input)).toThrowError(
				expect.objectContaining({ name: "SupportError" }),
			);
		},
	);
});

/**
 * Complément à la boucle exhaustive ci-dessus : un `deepEqual` par version
 * supportée pour attraper une valeur syntaxiquement valide mais
 * sémantiquement fausse (ex. un enum ADEME mappé vers la mauvaise valeur),
 * qu'un simple "ne lève pas + schéma valide" ne peut pas voir.
 *
 * Le snapshot initial DOIT être relu à la main, en le confrontant au XML
 * source de la fixture, avant d'être commité — c'est cette relecture qui
 * vaut garantie "on sait valide", pas la seule présence du test. Toute
 * divergence ultérieure doit être justifiée, jamais ré-approuvée sans
 * lecture.
 *
 * `createId()` est rendu déterministe le temps du test (`setIdGenerator`) :
 * sans ça, les champs `id` générés (masques, niveaux, appartements visités,
 * locaux non chauffés reconstitués...) changeraient à chaque exécution et
 * feraient diverger le snapshot sans qu'aucune régression n'existe.
 */
describe("mapFromDPE() — objet de référence par version (snapshot)", () => {
	beforeEach(() => {
		let counter = 0;
		setIdGenerator(() => `test-id-${++counter}`);
	});

	afterEach(() => {
		resetIdGenerator();
	});

	it.each(SUPPORTED_VERSIONS)("version %s", (version) => {
		const fixture = testableFixtures.find((f) => f.version_dpe === version);
		expect(fixture, `aucune fixture exploitable pour la version ${version}`).toBeDefined();
		if (!fixture) return;

		const input = loadInput(fixture.path);
		const diagnostic = mapFromDPE(input);

		expect(diagnostic).toMatchSnapshot();
	});
});
