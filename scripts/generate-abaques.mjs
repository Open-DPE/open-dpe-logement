// @ts-check
// scripts/generate-abaques.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { load as loadYaml } from 'js-yaml'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')

/**
 * @param {string} col
 * @returns {{ base: string, op: string } | null}
 */
function parseRangeHeader(col) {
  const ops = ['/eq', '/gte', '/gt', '/lte', '/lt']
  for (const op of ops) {
    if (col.endsWith(op)) return { base: col.slice(0, -op.length), op: op.slice(1) }
  }
  return null
}

/**
 * Parse une cellule CSV en valeur TypeScript.
 * Conserve les strings brutes (pas de split sur |).
 * @param {string} raw
 * @returns {number | string | null}
 */
function parseCell(raw) {
  if (raw === '' || raw === undefined) return null
  const num = parseFloat(raw.replace(',', '.'))
  if (!isNaN(num) && String(num) === raw.replace(',', '.')) return num
  return raw
}

/**
 * @param {string} raw
 * @returns {boolean | null}
 */
function parseBooleanCell(raw) {
  if (raw === '' || raw === undefined) return null
  return raw === '1'
}

/**
 * @param {string} raw
 * @returns {number | null}
 */
function parseRangeCell(raw) {
  if (raw === '' || raw === undefined) return null
  const num = parseFloat(raw.replace(',', '.'))
  return isNaN(num) ? null : num
}

/**
 * Lit le fichier .schema.yaml associé au CSV, retourne un Map nom→champ.
 * @param {string} csvPath
 * @returns {Record<string, { type: string, required: boolean }>}
 */
function readSchema(csvPath) {
  const schemaPath = csvPath.replace(/\.csv$/, '.schema.yaml')
  if (!existsSync(schemaPath)) return {}
  /** @type {any} */
  const schema = loadYaml(readFileSync(schemaPath, 'utf-8'))
  return Object.fromEntries((schema.fields ?? []).map((/** @type {any} */ f) => [f.name, f]))
}

/**
 * Parse un fichier CSV en tableau de lignes.
 * @param {string} csvContent
 * @param {string} csvPath
 * @param {string} relativeKey
 * @returns {Record<string, unknown>[]}
 */
function parseCsv(csvContent, csvPath, relativeKey) {
  const lines = csvContent.trim().split('\n').map((l) => l.trim())
  if (!lines[0]) return []
  const headers = lines[0].split(';')
  const rawRows = lines.slice(1).filter((l) => l.length > 0).map((l) => l.split(';'))

  const schemaFields = readSchema(csvPath)
  const rangeCols = new Set(headers.filter((h) => parseRangeHeader(h)))

  // Colonnes toujours traitées comme string (même si leur contenu est numérique)
  const STRING_COLS = new Set(['code_departement', 'mois'])

  // Colonnes booléennes : toutes les valeurs non-vides sont '0' ou '1'
  const booleanCols = new Set(
    headers.filter((h, i) => {
      if (rangeCols.has(h)) return false
      const nonEmpty = rawRows.map((r) => r[i] ?? '').filter((v) => v !== '')
      return nonEmpty.length > 0 && nonEmpty.every((v) => v === '0' || v === '1')
    })
  )

  // Avertir pour les colonnes non déclarées dans le schema
  for (const h of headers) {
    if (rangeCols.has(h)) continue
    if (!(h in schemaFields)) {
      console.warn(`[schema] ${relativeKey}: colonne "${h}" non déclarée dans le schema`)
    }
  }

  return rawRows.map((values) => {
    /** @type {Record<string, unknown>} */
    const row = {}

    for (let i = 0; i < headers.length; i++) {
      const h = headers[i]
      if (!h || rangeCols.has(h)) continue
      const raw = values[i] ?? ''
      if (STRING_COLS.has(h)) row[h] = raw === '' ? null : raw
      else row[h] = booleanCols.has(h) ? parseBooleanCell(raw) : parseCell(raw)
    }

    // Clés range plates (pas de fusion en RangeBounds)
    for (const h of headers) {
      if (!h || !rangeCols.has(h)) continue
      const idx = headers.indexOf(h)
      row[h] = parseRangeCell(values[idx] ?? '')
    }

    return row
  })
}

const CHUNK_SIZE = 200

/**
 * Génère un fichier TypeScript de données brutes depuis un CSV.
 * N'émet aucun type TypeScript.
 * @param {string} csvPath
 * @param {string} outPath
 * @param {string} relative
 */
function generateFromCsv(csvPath, outPath, relative) {
  const csvContent = readFileSync(csvPath, 'utf-8')
  const relativeKey = relative.replaceAll('\\', '/').replace(/\.csv$/, '')
  const rows = parseCsv(csvContent, csvPath, relativeKey)
  const sourcePath = csvPath.replaceAll('\\', '/')

  const chunks = []
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    chunks.push(rows.slice(i, i + CHUNK_SIZE))
  }

  const lines = [
    `// GÉNÉRÉ AUTOMATIQUEMENT — ne pas modifier manuellement`,
    `// Source : ${sourcePath.slice(sourcePath.indexOf('doctrine/'))}`,
    ``,
  ]

  if (chunks.length === 1) {
    lines.push(`export default ${JSON.stringify(chunks[0])}`, ``)
  } else {
    for (let i = 0; i < chunks.length; i++) {
      lines.push(`const chunk${i} = ${JSON.stringify(chunks[i])}`, ``)
    }
    const spread = chunks.map((_, i) => `...chunk${i}`).join(', ')
    lines.push(`export default [${spread}]`, ``)
  }

  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, lines.join('\n'), 'utf-8')
  console.log(`✓ ${outPath.replace(ROOT, '').replaceAll('\\', '/')}`)
}

/**
 * @param {string} dir
 * @returns {string[]}
 */
function findCsvFiles(dir) {
  /** @type {string[]} */
  const results = []
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    if (statSync(fullPath).isDirectory()) {
      results.push(...findCsvFiles(fullPath))
    } else if (entry.endsWith('.csv')) {
      results.push(fullPath)
    }
  }
  return results
}

const DOCTRINE_ABAQUES = join(ROOT, 'doctrine', 'abaques')
const ENGINE_DATA = join(ROOT, 'packages', 'abaques', 'src', 'data')

for (const csv of findCsvFiles(DOCTRINE_ABAQUES)) {
  const relative = csv.slice(DOCTRINE_ABAQUES.length + 1)
  const out = join(ENGINE_DATA, relative.replace(/\.csv$/, '.ts'))
  generateFromCsv(csv, out, relative)
}
