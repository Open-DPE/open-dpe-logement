// @ts-check
/**
 * Génère data/<type>/manifest.json à partir du contenu réel des fichiers XML.
 *
 * Le pool de fixtures est un dossier plat (data/<type>/*.xml, aucune
 * sous-arborescence par version XSD). La version de chaque fichier est
 * déterminée en lisant son contenu (champ <enum_version_id>), jamais depuis
 * son emplacement sur disque : la donnée est auto-suffisante, le manifeste
 * n'est qu'un index dérivé, régénérable à tout moment.
 *
 * Usage : node scripts/generate-manifest.mjs
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");

/**
 * Versions XSD DPE connues (groupe "version" de
 * packages/ademe-models/data/enums.dpe.json). A tenir synchronisé si de
 * nouvelles versions apparaissent côté ADEME.
 */
const KNOWN_VERSIONS = ["2", "2.1", "2.2", "2.3", "2.4", "2.5", "2.6"];

/**
 * @param {string} xml
 * @param {string} version
 */
function matchVersion(xml, version) {
  return xml.includes(`<enum_version_id>${version}</enum_version_id>`);
}

/**
 * @param {string} type ex. "dpe" ou "audit"
 */
function generateManifestFor(type) {
  const dir = join(DATA_DIR, type);
  let files;
  try {
    files = readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".xml"));
  } catch {
    console.log(`[${type}] dossier absent, ignoré.`);
    return;
  }

  if (files.length === 0) {
    console.log(`[${type}] aucun fichier XML, manifeste non généré.`);
    return;
  }

  /** @type {Array<{ numero_dpe: string, version_dpe: string, file: string }>} */
  const entries = [];
  const anomalies = [];

  for (const file of files) {
    const numeroDpe = file.replace(/\.xml$/i, "");
    const xml = readFileSync(join(dir, file), "utf-8");

    const matches = KNOWN_VERSIONS.filter((v) => matchVersion(xml, v));

    if (matches.length === 0) {
      anomalies.push(`${file} : aucune version reconnue (enum_version_id absent ou hors liste connue)`);
      continue;
    }
    if (matches.length > 1) {
      anomalies.push(`${file} : plusieurs versions matchées (${matches.join(", ")}) — vérifier matchVersion`);
      continue;
    }

    entries.push({ numero_dpe: numeroDpe, version_dpe: matches[0], file });
  }

  entries.sort((a, b) => a.numero_dpe.localeCompare(b.numero_dpe));

  const manifestFile = join(dir, "manifest.json");
  writeFileSync(manifestFile, JSON.stringify(entries, null, 2) + "\n", "utf-8");

  console.log(`[${type}] manifeste généré : ${manifestFile}`);
  console.log(`[${type}] ${entries.length} fichier(s) indexé(s) sur ${files.length} scanné(s).`);

  /** @type {Record<string, number>} */
  const byVersion = {};
  for (const e of entries) byVersion[e.version_dpe] = (byVersion[e.version_dpe] ?? 0) + 1;
  for (const v of KNOWN_VERSIONS) {
    if (byVersion[v]) console.log(`[${type}]   v${v} : ${byVersion[v]}`);
  }

  if (anomalies.length > 0) {
    console.warn(`\n[${type}] ${anomalies.length} anomalie(s) — fichier(s) exclu(s) du manifeste :`);
    for (const a of anomalies) console.warn(`  - ${a}`);
    process.exitCode = 1;
  }
}

for (const type of ["dpe", "audit"]) {
  generateManifestFor(type);
}
