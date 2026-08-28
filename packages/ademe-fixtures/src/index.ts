import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Racine des fixtures DPE : XML réels issus de l'observatoire DPE-Audit
 * (ADEME), en pool plat (`<numero_dpe>.xml`, aucun sous-dossier par version
 * XSD). Voir `data/dpe/README.md` pour la provenance et la convention du
 * manifeste.
 *
 * Aucune fixture Audit pour l'instant (`data/audit` pourra être ajouté sans
 * renommage le jour où ces fixtures existeront).
 */
export const dpeFixturesDir = join(packageRoot, "data", "dpe");

const dpeManifestFile = join(dpeFixturesDir, "manifest.json");

type DpeManifestFileEntry = {
	numero_dpe: string;
	version_dpe: string;
	file: string;
};

/**
 * Une fixture DPE indexée dans le manifeste : numéro DPE source, version XSD
 * détectée depuis le contenu du XML (`<enum_version_id>`, voir
 * `scripts/generate-manifest.mjs`), et chemin absolu du fichier sur disque.
 */
export interface DpeFixtureEntry {
	numero_dpe: string;
	version_dpe: string;
	path: string;
}

/**
 * Liste les fixtures DPE disponibles, éventuellement filtrées par version
 * XSD (ex. "2.6" — voir le groupe `version` de
 * `packages/ademe-models/data/enums.dpe.json` pour les valeurs possibles).
 *
 * Lit `data/dpe/manifest.json`. Ce fichier est généré, jamais écrit à la
 * main : après tout ajout/suppression de XML dans `data/dpe/`, régénérer
 * avec `npm run generate-manifest --workspace=@open-dpe-logement/ademe-fixtures`.
 */
export function listDpeFixtures(options?: { version?: string }): DpeFixtureEntry[] {
	let raw: string;
	try {
		raw = readFileSync(dpeManifestFile, "utf-8");
	} catch (cause) {
		throw new Error(
			`Manifeste introuvable (${dpeManifestFile}). Générer avec : npm run generate-manifest --workspace=@open-dpe-logement/ademe-fixtures`,
			{ cause },
		);
	}

	const entries = JSON.parse(raw) as DpeManifestFileEntry[];

	return entries
		.filter((entry) => options?.version === undefined || entry.version_dpe === options.version)
		.map((entry) => ({
			numero_dpe: entry.numero_dpe,
			version_dpe: entry.version_dpe,
			path: join(dpeFixturesDir, entry.file),
		}));
}
