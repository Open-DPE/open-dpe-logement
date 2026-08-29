import { XMLParser } from "fast-xml-parser";

/**
 * Champs dont le contenu XML est numérique en apparence mais typé string
 * dans les XSD/types TS (ex. SIREN, téléphone, numéro fiscal local...).
 * fast-xml-parser convertirait sinon leur valeur en number. Les énumérations
 * (`enum_xxxx`, ex. `enum_version_id` : "1" | "1.1" | "2" | ...) suivent la
 * même logique mais sont traitées séparément ci-dessous (`isEnumTag`),
 * conformément à la règle documentée dans le README.
 */
const STRING_ONLY_TAGS = new Set([
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
	// BAN / adresse_bien : codes à préserver tels quels (zéros significatifs,
	// ex. code postal "02100" -> deviendrait 2100 en number sans ce garde).
	// Même logique que SIREN/numero_fiscal_local ci-dessus. Trouvé via le
	// corpus réel de fixtures (ademe-models/tests/fixtures.test.ts).
	"code_postal_brut",
	"ban_postcode",
	"ban_citycode",
	"ban_housenumber",
	"ban_id",
	"compl_ref_batiment",
	"compl_ref_logement",
	"nom_commune_brut",
	// Identifiant parcellaire cadastral : peut prendre une forme "lettre +
	// chiffres" (ex. "E410") qui collisionne avec la détection de notation
	// scientifique de strnum (fast-xml-parser) -- "E410" est interprété comme
	// une notation "E<exposant>" à mantisse vide et devient NaN. Constaté via
	// le corpus réel (ademe-models/tests/fixtures.test.ts).
	"idpar",
	// XSD (DPE et Audit) : type="xs:string", champ générique dont le contenu
	// ressemble souvent à un nombre (fiche_technique_collection > ...
	// sous_fiche_technique > valeur). Trouvé via le corpus réel de fixtures
	// (ademe-models/tests/fixtures.test.ts) : sans ce garde, une valeur "1"
	// devient le number 1.
	"valeur",
	// Texte libre (souvent de mauvaise qualité de saisie -- un diagnostiqueur
	// y entre parfois un simple nombre : "1.75", "1", "2"...) mais jamais
	// numérique au sens du XSD (toujours type="xs:string"). Constaté sur le
	// corpus réel (baie_vitree/donnee_entree/description,
	// dpe_immeuble/logement_visite_collection/description).
	"description",
]);

/**
 * Champs dont le type XSD est une énumération fermée (`<xs:enumeration>`,
 * base `xs:int` ou `xs:string`) mais dont le nom ne suit pas la convention
 * `enum_*` — donc invisibles pour `isEnumTag` sans cette liste explicite.
 * Dérivée en comparant systématiquement chaque XSD (DPE v2 à v2.6, Audit
 * v2.0 à v2.5) aux listes de tags existantes, suite à la découverte que
 * `qualite_isol_enveloppe` (type `s_qualite`, base `xs:int`, valeurs
 * "1"/"2"/"3"/"4") échouait sur 100% du corpus réel de fixtures faute
 * d'être reconnu comme énumération.
 */
const NAMED_ENUM_TAGS = new Set([
	"ban_type",
	"qualite_isol",
	"qualite_isol_enveloppe",
	"qualite_isol_menuiserie",
	"qualite_isol_mur",
	"qualite_isol_plancher_bas",
	"qualite_isol_plancher_haut_comble_amenage",
	"qualite_isol_plancher_haut_comble_perdu",
	"qualite_isol_plancher_haut_toit_terrasse",
]);

const COLLECTION_SUFFIX = "_collection";

const REFERENCE_TAGS = new Set([
	"reference",
	"reference_1",
	"reference_2",
	"reference_lnc",
	"reference_paroi",
	"reference_generateur_mixte",
]);

/**
 * Dérivée systématiquement des XSD DPE (v2 à v2.6) et Audit (v2.0 à v2.5) :
 * tout élément `type="s_oui_non"`, quelle que soit sa position. Les deux
 * derniers (`consentement_proprietaire`, `paroi_ancienne`) manquaient à
 * cette liste (curée à la main jusqu'ici) et faisaient systématiquement
 * échouer la validation Zod sur le corpus réel de fixtures.
 */
const BOOLEAN_TAGS = new Set([
	"appartement_non_visite",
	"aspect_traversant",
	"batiment_materiaux_anciens",
	"brasseur_air",
	"calcul_ue",
	"consentement_proprietaire",
	"double_fenetre",
	"enduit_isolant_paroi_ancienne",
	"inertie_lourde",
	"inertie_paroi_verticale_lourd",
	"inertie_plancher_bas_lourd",
	"inertie_plancher_haut_lourd",
	"isolation_toiture",
	"paroi_ancienne",
	"paroi_lourde",
	"personne_morale",
	"plusieurs_facade_exposee",
	"position_volume_chauffe",
	"position_volume_chauffe_stockage",
	"presence_joint",
	"presence_production_pv",
	"presence_protection_solaire_hors_fermeture",
	"presence_regulation_combustion",
	"presence_retour_isolation",
	"presence_ventouse",
	"protection_solaire_exterieure",
	"reseau_distribution_isole",
	"ventilation_post_2012",
	"vitrage_vir",
]);

export function isStringOnlyTag(tagName: string): boolean {
	return STRING_ONLY_TAGS.has(tagName);
}

export function isCollectionTag(tagName: string): boolean {
	return tagName.endsWith(COLLECTION_SUFFIX);
}

export function isReferenceTag(tagName: string): boolean {
	return REFERENCE_TAGS.has(tagName);
}

export function isBooleanTag(tagName: string): boolean {
	return BOOLEAN_TAGS.has(tagName);
}

/** Préfixe `enum_*`, ou un des champs de `NAMED_ENUM_TAGS` (énumération XSD fermée sans ce préfixe). */
export function isEnumTag(tagName: string): boolean {
	return tagName.startsWith("enum_") || NAMED_ENUM_TAGS.has(tagName);
}

/**
 * Arrondit une valeur numérique à deux chiffres après la virgule (règle
 * "Nombres" du README). Un entier n'est pas affecté (5 -> 5). N'est
 * appliqué qu'aux `number` qui arrivent jusqu'ici : les tags déjà forcés en
 * string plus haut (STRING_ONLY_TAGS, REFERENCE_TAGS, `enum_*`) ne passent
 * jamais par cette fonction.
 */
export function round(n: number): number {
	return Number(n.toFixed(2));
}

/**
 * Absence de contenu XML significatif — à ne pas confondre avec une valeur
 * "fausse" au sens JS : `0` est une valeur significative (ex.
 * `enum_consentement_formulaire_id: "0"` = "absence de consentement", une
 * vraie valeur d'énumération, pas une absence de donnée). Un simple `!value`
 * traiterait `0` comme vide et le remplacerait à tort par `null` : c'est le
 * bug que ce garde-fou évite.
 */
function isEmpty(value: unknown): value is null | undefined | "" {
	return value === undefined || value === null || value === "";
}

/** STRING_ONLY_TAGS : conserve la valeur en chaîne quel que soit son type XML détecté. */
export function toStringValue(value: unknown): string | null {
	if (isEmpty(value)) return null;
	return typeof value === "number"
		? String(value)
		: typeof value === "string"
			? value
			: null;
}

/**
 * REFERENCE_TAGS : identifiant de référencement interne, normalisé en
 * minuscules et en espacement (espaces de bord retirés, espaces internes
 * multiples réduits à un seul).
 *
 * Le XML ADEME contient des références au double espacement irrégulier
 * (ex. `"mur  1"` sur un pont thermique référençant un mur nommé `"mur 1"`
 * par ailleurs, observé sur le corpus réel) — une même référence
 * conceptuelle, corrompue par une saisie ou un export ADEME imparfait, pas
 * deux entités distinctes. Sans cette normalisation, aucune comparaison
 * stricte en aval (mapper, moteur...) ne peut faire le lien.
 */
export function toReferenceValue(value: unknown): string | null {
	if (isEmpty(value)) return null;
	return (typeof value !== "string" ? String(value) : value)
		.toLowerCase()
		.trim()
		.replace(/\s+/g, " ");
}

/** Tags `enum_*` : toujours une chaîne (convention documentée dans le README). */
export function toEnumValue(value: unknown): string | null {
	if (isEmpty(value)) return null;
	return typeof value === "number"
		? String(value)
		: typeof value === "string"
			? value
			: null;
}

/**
 * BOOLEAN_TAGS : mappe le `s_oui_non` XSD (`xs:int {0: non, 1: oui}`) vers
 * `[boolean, null]` — `null` couvre le cas `nillable="true"` / une valeur
 * inattendue (voir `claude/analyse-s-oui-non-xsd-ademe.md`).
 */
export function toBooleanValue(value: unknown): boolean | null {
	switch (value) {
		case "1":
		case 1:
			return true;
		case "0":
		case 0:
			return false;
		default:
			return null;
	}
}

/**
 * Normalise récursivement l'arbre issu de fast-xml-parser :
 * - force les tags de STRING_ONLY_TAGS à rester des chaînes
 * - arrondit les nombres à deux décimales (cf. `round`)
 * - aplatit `<x_collection><x>...</x><x>...</x></x_collection>` (que
 *   fast-xml-parser restitue par défaut comme `{ x_collection: { x: [...] } }`)
 *   en `{ x_collection: [...] }`, pour matcher `Array<...>` des types TS.
 *   Une collection vide (`<x_collection></x_collection>` -> "") devient `[]`.
 */
function normalize(node: unknown): unknown {
	if (Array.isArray(node)) {
		return node.map(normalize);
	}
	if (typeof node === "number") {
		return round(node);
	}
	if (node === null || typeof node !== "object") {
		return node;
	}

	const result: Record<string, unknown> = {};

	for (const [key, rawValue] of Object.entries(
		node as Record<string, unknown>,
	)) {
		// Les tags `*_collection` gèrent leur propre cas vide plus bas
		// (-> []) : ne pas les court-circuiter ici en `null`.
		if (rawValue === "" && !isCollectionTag(key)) {
			result[key] = null;
			continue;
		}
		if (isStringOnlyTag(key)) {
			result[key] = toStringValue(rawValue);
			continue;
		}
		if (isReferenceTag(key)) {
			result[key] = toReferenceValue(rawValue);
			continue;
		}
		if (isEnumTag(key)) {
			result[key] = toEnumValue(rawValue);
			continue;
		}
		if (isBooleanTag(key)) {
			result[key] = toBooleanValue(rawValue);
			continue;
		}

		const value = normalize(rawValue);

		if (isCollectionTag(key)) {
			const itemKey = key.slice(0, -COLLECTION_SUFFIX.length);
			if (value === "" || value == null) {
				result[key] = [];
			} else if (Array.isArray(value)) {
				result[key] = value;
			} else if (
				typeof value === "object" &&
				itemKey in (value as Record<string, unknown>)
			) {
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
	ignoreAttributes: true,
	ignoreDeclaration: true,
	attributeNamePrefix: "",
	trimValues: true,
	// STRING_ONLY_TAGS/REFERENCE_TAGS/enum_* : empêche fast-xml-parser de
	// convertir la valeur en number *avant* qu'on la voie dans normalize().
	// Sans ça, "2.0" (ex. enum_version_id) devient le number 2 puis, une
	// fois restauré en string, "2" — perte irréversible du zéro final
	// (idem pour une référence purement numérique). Retourner `undefined`
	// fait ressortir la chaîne brute (non parsée) ; retourner `val`
	// inchangé laisse le comportement par défaut (number/boolean
	// auto-détecté) pour tous les autres tags.
	tagValueProcessor: (tagName, val) => {
		if (isStringOnlyTag(tagName) || isReferenceTag(tagName) || isEnumTag(tagName) || isBooleanTag(tagName)) {
			return undefined;
		}
		// fast-xml-parser (strnum) refuse de convertir une chaîne décimale en
		// number si la conversion ne "round-trip" pas au bit près (ex.
		// "34.041834738949589" -> 34.04183473894959 -> "34.04183473894959" !=
		// original). Constaté uniquement sur les sorties calculées du moteur
		// 3CL (précision native IEEE-754 double, 16-17 chiffres significatifs)
		// -- jamais sur un identifiant (déjà couvert plus haut, et sans point
		// décimal). On force la conversion nous-mêmes dans ce cas précis.
		if (typeof val === "string" && /^-?\d+\.\d+$/.test(val)) {
			const n = Number(val);
			if (Number.isFinite(n)) return n;
		}
		return val;
	},
	// Convention XSD constante du projet : <x_collection><x>...</x><x>...</x></x_collection>
	isArray: (tagName, jPath) => jPath.endsWith(`_collection.${tagName}`),
});

/**
 * Champs personnels d'`administratif` exclus par doctrine d'anonymisation
 * (voir la section "Anonymisation" du README de `ademe-models`, doctrine
 * définie par ce package). Certains n'existent que dans une partie des
 * versions XSD (ex. `consentement_proprietaire` : DPEv2.3/2.4 uniquement,
 * `enum_consentement_formulaire_id` : DPEv2.5/2.6 uniquement) — la
 * suppression est sans effet, pas une erreur, quand le champ est déjà
 * absent. `diagnostiqueur`/`auditeur`/`information_formulaire_consentement`
 * sont des sous-arbres entiers (plusieurs champs personnels imbriqués),
 * supprimés en un bloc plutôt que champ par champ.
 *
 * `adresse_proprietaire` (adresse du propriétaire, pas son nom) suit la même
 * doctrine mais n'est pas un enfant direct d'`administratif` — imbriqué sous
 * `administratif.geolocalisation.adresses`, elle est supprimée séparément
 * dans `anonymize()` plutôt que via cette liste.
 *
 * Supprimé ici, au plus tôt dans le pipeline, pour qu'aucune donnée
 * personnelle ne transite au-delà de cette étape — pas seulement "non
 * modélisée" plus loin par le schéma Zod (qui aurait de toute façon
 * silencieusement ignoré ces clés, mais après qu'elles aient existé en
 * mémoire).
 */
const ANONYMIZED_ADMINISTRATIF_KEYS = [
	"nom_proprietaire",
	"siren_proprietaire",
	"nom_proprietaire_installation_commune",
	"diagnostiqueur",
	"auditeur",
	"consentement_proprietaire",
	"information_consentement_proprietaire",
	"information_formulaire_consentement",
	"enum_consentement_formulaire_id",
	"enum_commanditaire_id",
] as const;

function anonymize(node: unknown): unknown {
	if (typeof node !== "object" || node === null) return node;
	const administratif = (node as Record<string, unknown>)["administratif"];
	if (typeof administratif !== "object" || administratif === null) return node;
	const admin = administratif as Record<string, unknown>;
	for (const key of ANONYMIZED_ADMINISTRATIF_KEYS) {
		delete admin[key];
	}
	// administratif.geolocalisation.adresses.adresse_proprietaire : imbriqué,
	// pas un enfant direct d'`administratif` -- ne peut pas passer par
	// ANONYMIZED_ADMINISTRATIF_KEYS (qui ne supprime qu'au premier niveau).
	const geolocalisation = admin["geolocalisation"];
	if (typeof geolocalisation === "object" && geolocalisation !== null) {
		const adresses = (geolocalisation as Record<string, unknown>)["adresses"];
		if (typeof adresses === "object" && adresses !== null) {
			delete (adresses as Record<string, unknown>)["adresse_proprietaire"];
		}
	}
	return node;
}

/**
 * Parse une ressource XML DPE/Audit en objet JS brut, normalisé pour
 * correspondre à la forme des types TS (collections aplaties en tableaux).
 *
 * Le XML a toujours un unique élément racine (`<dpe>` ou `<audit>`) : on le
 * déplie pour que ses champs se retrouvent directement au premier niveau de
 * l'objet retourné, comme attendu par les types `DPE`/`Audit`. Les attributs
 * XML de la racine (`id`, `hashkey`, `version`) ne sont pas mappés dans les
 * types `ademe-models` et ne sont donc pas conservés (`ignoreAttributes`).
 *
 * Limite connue : ne gère pas explicitement `xsi:nil="true"` sur les
 * éléments nillable. À affiner si des fixtures réelles l'utilisent
 * (à date, non observé : les éditeurs omettent en général l'élément).
 */
export function parse(xml: string): unknown {
	const parsed = parser.parse(xml) as Record<string, unknown>;
	const [root] = Object.values(parsed);
	return anonymize(normalize(root));
}
