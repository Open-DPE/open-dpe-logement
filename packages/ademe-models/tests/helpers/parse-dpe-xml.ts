import { XMLParser } from "fast-xml-parser";

/**
 * Champs dont le contenu XML est numérique en apparence mais typé string
 * dans les XSD (ex. "1.1", "2.6") ou dans les types TS (ex. SIREN, téléphone).
 * fast-xml-parser convertirait sinon "1.1" en nombre 1.1, cassant le literal
 * type `VersionEnum` ("1" | "1.1" | "2" | ...).
 */
const STRING_ONLY_TAGS = new Set([
	"enum_version_id",
	"siren_proprietaire",
	"siren_formulaire",
	"numero_fiscal_local",
	"id_batiment_rnb",
	"rpls_log_id",
	"rpls_org_id",
	"immatriculation_copropriete",
	"invar_logement",
	"telephone",
	"version_logiciel",
	"version_moteur_calcul",
	"dpe_a_remplacer",
	"reference_interne_projet",
	"dpe_immeuble_associe",
]);

const COLLECTION_SUFFIX = "_collection";

/**
 * Normalise récursivement l'arbre issu de fast-xml-parser :
 * - force les tags de STRING_ONLY_TAGS à rester des chaînes
 * - aplatit `<x_collection><x>...</x><x>...</x></x_collection>` (que
 *   fast-xml-parser restitue par défaut comme `{ x_collection: { x: [...] } }`)
 *   en `{ x_collection: [...] }`, pour matcher `Array<...>` des types TS.
 *   Une collection vide (`<x_collection></x_collection>` -> "") devient `[]`.
 */
function normalize(node: unknown): unknown {
	if (Array.isArray(node)) {
		return node.map(normalize);
	}
	if (node === null || typeof node !== "object") {
		return node;
	}

	const result: Record<string, unknown> = {};
	for (const [key, rawValue] of Object.entries(node as Record<string, unknown>)) {
		if (STRING_ONLY_TAGS.has(key)) {
			result[key] = typeof rawValue === "number" ? String(rawValue) : rawValue;
			continue;
		}

		const value = normalize(rawValue);

		if (key.endsWith(COLLECTION_SUFFIX)) {
			const itemKey = key.slice(0, -COLLECTION_SUFFIX.length);
			if (value === "" || value == null) {
				result[key] = [];
			} else if (Array.isArray(value)) {
				result[key] = value;
			} else if (typeof value === "object" && itemKey in (value as Record<string, unknown>)) {
				const inner = (value as Record<string, unknown>)[itemKey];
				result[key] = Array.isArray(inner) ? inner : [inner];
			} else {
				result[key] = [];
			}
			continue;
		}

		result[key] = value;
	}
	return result;
}

const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: "",
	parseAttributeValue: false, // id / hashkey / version restent des chaînes
	parseTagValue: true, // surfaces, coefficients, enum_*_id (xs:int/xs:double) -> number
	trimValues: true,
	// Convention XSD constante du projet : <x_collection><x>...</x><x>...</x></x_collection>
	isArray: (tagName, jPath) => jPath.endsWith(`_collection.${tagName}`),
});

/**
 * Parse un DPE XML (conforme à DPEv2*.xsd) en objet JS brut, normalisé pour
 * correspondre à la forme des types TS (collections aplaties en tableaux).
 * Ne garantit pas la conformité complète au type `DPE` — c'est le rôle des
 * tests appelants (assertions runtime), pas de ce helper.
 *
 * Limite connue : ne gère pas explicitement `xsi:nil="true"` sur les
 * éléments nillable. À affiner si des fixtures réelles l'utilisent
 * (à date, non observé : les éditeurs omettent en général l'élément).
 */
export function parseDpeXml(xml: string): Record<string, unknown> {
	const parsed = parser.parse(xml) as { dpe: Record<string, unknown> };
	return normalize(parsed.dpe) as Record<string, unknown>;
}
