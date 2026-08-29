import { describe, expect, it } from "vitest";
import {
	isBooleanTag,
	isCollectionTag,
	isEnumTag,
	isReferenceTag,
	isStringOnlyTag,
	parse,
	round,
	toBooleanValue,
	toEnumValue,
	toReferenceValue,
	toStringValue,
} from "../src/parser.js";

/**
 * Deux niveaux de tests :
 *
 *   - Unitaires, directement sur les fonctions pures exportées par
 *     `parser.ts` (`isStringOnlyTag`/`isReferenceTag`/`isEnumTag`/
 *     `isBooleanTag`/`isCollectionTag`, `toStringValue`/`toReferenceValue`/
 *     `toEnumValue`/`toBooleanValue`, `round`) : rapides, sans XML, couvrent
 *     les cas limites (valeur vide, `0`, types inattendus).
 *   - Via `parse()` sur des fragments XML minimaux : vérifient le câblage
 *     réel (que `normalize()` appelle la bonne fonction pour la bonne clé,
 *     que `tagValueProcessor` empêche bien la coercion prématurée par
 *     fast-xml-parser). Ces fragments sont sans rapport avec un DPE réel ni
 *     un XSD précis : ils isolent le mécanisme de normalisation,
 *     indépendamment de la structure complète testée ailleurs sur les
 *     fixtures réelles (`ademe-models`/`ademe-client`). `normalize()`
 *     s'applique récursivement quelle que soit la profondeur : les tags
 *     d'intérêt sont donc placés à la racine de `<dpe>` par simplicité, sans
 *     respecter la position réelle du XSD.
 */

/** Parse un fragment `<dpe>...</dpe>` et retourne l'objet brut, sans le typage `DPE`. */
function parseRaw(xml: string): Record<string, unknown> {
	return parse(xml) as unknown as Record<string, unknown>;
}

describe("isStringOnlyTag / isReferenceTag / isEnumTag / isBooleanTag / isCollectionTag", () => {
	it("isStringOnlyTag : reconnaît un tag de STRING_ONLY_TAGS, rejette le reste", () => {
		expect(isStringOnlyTag("siren_proprietaire")).toBe(true);
		expect(isStringOnlyTag("surface_habitable_logement")).toBe(false);
	});

	// Régression : type XSD xs:string, contenu générique ressemblant souvent
	// à un nombre (fiche_technique_collection.*.sous_fiche_technique_collection.*.valeur)
	// — 15194 occurrences en échec sur le corpus réel avant cet ajout, à elle
	// seule la plus grosse source d'échec constatée.
	it("isStringOnlyTag : reconnaît l'ajout dérivé du XSD (valeur, type xs:string générique)", () => {
		expect(isStringOnlyTag("valeur")).toBe(true);
	});

	it("isReferenceTag : reconnaît un tag de REFERENCE_TAGS, rejette le reste", () => {
		expect(isReferenceTag("reference")).toBe(true);
		expect(isReferenceTag("reference_paroi")).toBe(true);
		expect(isReferenceTag("siren_proprietaire")).toBe(false);
	});

	it("isEnumTag : reconnaît un préfixe enum_, rejette le reste", () => {
		expect(isEnumTag("enum_version_id")).toBe(true);
		expect(isEnumTag("enumerable")).toBe(false); // préfixe, pas une simple inclusion
		expect(isEnumTag("version_id")).toBe(false);
	});

	// Régression : XSD `s_qualite` (base xs:int, énumération fermée "1"-"4"),
	// sans préfixe enum_ — échouait sur 100% du corpus réel avant l'ajout de
	// NAMED_ENUM_TAGS (valeur "4" restait un number au lieu d'un string).
	it("isEnumTag : reconnaît aussi les énumérations XSD fermées sans préfixe enum_ (NAMED_ENUM_TAGS)", () => {
		expect(isEnumTag("qualite_isol_enveloppe")).toBe(true);
		expect(isEnumTag("qualite_isol_mur")).toBe(true);
		expect(isEnumTag("ban_type")).toBe(true);
	});

	it("isBooleanTag : reconnaît un tag de BOOLEAN_TAGS, rejette le reste", () => {
		expect(isBooleanTag("presence_joint")).toBe(true);
		expect(isBooleanTag("siren_proprietaire")).toBe(false);
	});

	// Régression : type XSD `s_oui_non` (comme les autres BOOLEAN_TAGS),
	// manquait à la liste curée à la main — échouait systématiquement sur le
	// corpus réel (ex. paroi_ancienne dans mur_collection.*.donnee_entree).
	it("isBooleanTag : reconnaît les ajouts dérivés systématiquement des XSD (s_oui_non)", () => {
		expect(isBooleanTag("paroi_ancienne")).toBe(true);
		expect(isBooleanTag("consentement_proprietaire")).toBe(true);
	});

	it("isCollectionTag : reconnaît un suffixe _collection, rejette le reste", () => {
		expect(isCollectionTag("mur_collection")).toBe(true);
		expect(isCollectionTag("mur")).toBe(false);
	});
});

describe("toStringValue", () => {
	it("convertit un number en string", () => {
		expect(toStringValue(123456789)).toBe("123456789");
	});

	it("conserve une string telle quelle", () => {
		expect(toStringValue("abc")).toBe("abc");
	});

	it("préserve 0 en \"0\" plutôt qu'en null (0 est une valeur, pas une absence)", () => {
		expect(toStringValue(0)).toBe("0");
	});

	it("retourne null pour undefined, null et une chaîne vide", () => {
		expect(toStringValue(undefined)).toBeNull();
		expect(toStringValue(null)).toBeNull();
		expect(toStringValue("")).toBeNull();
	});
});

describe("toReferenceValue", () => {
	it("met en minuscule une référence string", () => {
		expect(toReferenceValue("ABC-123")).toBe("abc-123");
	});

	it("force en string (et minuscule) une référence numérique", () => {
		expect(toReferenceValue(123)).toBe("123");
	});

	it("préserve 0 en \"0\" plutôt qu'en null", () => {
		expect(toReferenceValue(0)).toBe("0");
	});

	it("retourne null pour undefined, null et une chaîne vide", () => {
		expect(toReferenceValue(undefined)).toBeNull();
		expect(toReferenceValue(null)).toBeNull();
		expect(toReferenceValue("")).toBeNull();
	});

	it("réduit les espaces internes multiples à un seul (double espacement irrégulier ADEME constaté sur le corpus réel)", () => {
		expect(toReferenceValue("mur  1")).toBe("mur 1");
		expect(toReferenceValue("pont   thermique  1")).toBe("pont thermique 1");
	});

	it("retire les espaces de bord", () => {
		expect(toReferenceValue("  mur 1  ")).toBe("mur 1");
	});
});

describe("toEnumValue", () => {
	it("convertit un number en string", () => {
		expect(toEnumValue(2)).toBe("2");
	});

	it("conserve une string telle quelle", () => {
		expect(toEnumValue("2.6")).toBe("2.6");
	});

	// Régression : `enum_consentement_formulaire_id` a une valeur réelle
	// "0" ("absence de consentement", groupe `consentement_formulaire` de
	// enums.dpe.json) — un `!value` naïf la confondrait avec une absence de
	// donnée et la remplacerait à tort par `null`.
	it("préserve 0 en \"0\" plutôt qu'en null (valeur d'énumération réelle : consentement_formulaire)", () => {
		expect(toEnumValue(0)).toBe("0");
	});

	it("retourne null pour undefined, null et une chaîne vide", () => {
		expect(toEnumValue(undefined)).toBeNull();
		expect(toEnumValue(null)).toBeNull();
		expect(toEnumValue("")).toBeNull();
	});
});

describe("toBooleanValue", () => {
	it("mappe 1 et \"1\" à true", () => {
		expect(toBooleanValue(1)).toBe(true);
		expect(toBooleanValue("1")).toBe(true);
	});

	it("mappe 0 et \"0\" à false", () => {
		expect(toBooleanValue(0)).toBe(false);
		expect(toBooleanValue("0")).toBe(false);
	});

	it("retourne null pour toute valeur hors {0,1} — s_oui_non nillable/inattendu", () => {
		expect(toBooleanValue(undefined)).toBeNull();
		expect(toBooleanValue(null)).toBeNull();
		expect(toBooleanValue("")).toBeNull();
		expect(toBooleanValue("oui")).toBeNull();
		expect(toBooleanValue(2)).toBeNull();
	});
});

describe("round", () => {
	it("arrondit à deux décimales", () => {
		expect(round(75.456)).toBe(75.46);
	});

	it("laisse un nombre à 2 décimales ou moins inchangé", () => {
		expect(round(75.5)).toBe(75.5);
		expect(round(75)).toBe(75);
	});

	it("arrondit 0 à 0 (et pas à null/undefined)", () => {
		expect(round(0)).toBe(0);
	});
});

describe("parser normalize() — STRING_ONLY_TAGS", () => {
	it("préserve une valeur décimale (enum_version_id) en string plutôt que number", () => {
		const dpe = parseRaw("<dpe><enum_version_id>2.6</enum_version_id></dpe>");

		expect(typeof dpe["enum_version_id"]).toBe("string");
		expect(dpe["enum_version_id"]).toBe("2.6");
	});

	it("préserve une valeur entière (siren_proprietaire) en string plutôt que number", () => {
		const dpe = parseRaw(
			"<dpe><siren_proprietaire>123456789</siren_proprietaire></dpe>",
		);

		expect(typeof dpe["siren_proprietaire"]).toBe("string");
		expect(dpe["siren_proprietaire"]).toBe("123456789");
	});

	it("laisse un tag numérique hors STRING_ONLY_TAGS être converti en number (contre-exemple)", () => {
		const dpe = parseRaw(
			"<dpe><surface_habitable_logement>75.5</surface_habitable_logement></dpe>",
		);

		expect(typeof dpe["surface_habitable_logement"]).toBe("number");
		expect(dpe["surface_habitable_logement"]).toBe(75.5);
	});
});

describe("parser normalize() — REFERENCE_TAGS", () => {
	it("met en minuscule et retire les espaces superflus", () => {
		const dpe = parseRaw("<dpe><reference>  ABC-123  </reference></dpe>");

		expect(dpe["reference"]).toBe("abc-123");
	});

	it("force en string une référence dont le contenu est purement numérique", () => {
		// Sans protection, fast-xml-parser convertirait "123" en number 123
		// (aucun tag REFERENCE_TAGS n'est dans STRING_ONLY_TAGS).
		const dpe = parseRaw("<dpe><reference>123</reference></dpe>");

		expect(typeof dpe["reference"]).toBe("string");
		expect(dpe["reference"]).toBe("123");
	});
});

describe("parser normalize() — enum_* (bout en bout)", () => {
	it("préserve la valeur \"0\" d'une énumération réelle (consentement_formulaire)", () => {
		const dpe = parseRaw(
			"<dpe><enum_consentement_formulaire_id>0</enum_consentement_formulaire_id></dpe>",
		);

		expect(dpe["enum_consentement_formulaire_id"]).toBe("0");
	});
});

describe("parser normalize() — BOOLEAN_TAGS (bout en bout)", () => {
	it("mappe 1/0 à true/false quelle que soit la coercion fast-xml-parser en amont", () => {
		const dpe = parseRaw(
			"<dpe><presence_joint>1</presence_joint><brasseur_air>0</brasseur_air></dpe>",
		);

		expect(dpe["presence_joint"]).toBe(true);
		expect(dpe["brasseur_air"]).toBe(false);
	});

	it("un tag booléen vide devient null (pas géré par toBooleanValue : court-circuité en amont)", () => {
		const dpe = parseRaw("<dpe><presence_joint></presence_joint></dpe>");

		expect(dpe["presence_joint"]).toBeNull();
	});
});

describe("parser normalize() — arrondi à 2 décimales", () => {
	it("arrondit un nombre à plus de 2 décimales", () => {
		const dpe = parseRaw(
			"<dpe><surface_habitable_logement>75.456</surface_habitable_logement></dpe>",
		);

		expect(dpe["surface_habitable_logement"]).toBe(75.46);
	});
});

describe("parser normalize() — collections *_collection", () => {
	it("aplatit une collection à plusieurs éléments en tableau", () => {
		const dpe = parseRaw(
			"<dpe><mur_collection><mur><reference>A</reference></mur><mur><reference>B</reference></mur></mur_collection></dpe>",
		);
		const murs = dpe["mur_collection"] as Array<Record<string, unknown>>;

		expect(Array.isArray(murs)).toBe(true);
		expect(murs).toHaveLength(2);
		// La normalisation (REFERENCE_TAGS) s'applique aussi à l'intérieur
		// d'une collection, pas seulement au premier niveau.
		expect(murs[0]?.["reference"]).toBe("a");
		expect(murs[1]?.["reference"]).toBe("b");
	});

	it("garde un tableau (et non un objet) pour une collection à un seul élément", () => {
		const dpe = parseRaw(
			"<dpe><mur_collection><mur><reference>A</reference></mur></mur_collection></dpe>",
		);
		const murs = dpe["mur_collection"] as Array<Record<string, unknown>>;

		expect(Array.isArray(murs)).toBe(true);
		expect(murs).toHaveLength(1);
	});

	it("transforme une collection vide en tableau vide", () => {
		const withEmptyTags = parseRaw("<dpe><mur_collection></mur_collection></dpe>");
		const withSelfClosingTag = parseRaw("<dpe><mur_collection/></dpe>");

		expect(withEmptyTags["mur_collection"]).toEqual([]);
		expect(withSelfClosingTag["mur_collection"]).toEqual([]);
	});
});

describe("parser — attributs XML", () => {
	it("ignore les attributs de la racine (id/hashkey/version) — non mappés dans ademe-models", () => {
		const dpe = parseRaw(
			'<dpe id="007" hashkey="h1" version="1.0"><foo>bar</foo></dpe>',
		);

		expect(dpe).toEqual({ foo: "bar" });
		expect(dpe["id"]).toBeUndefined();
		expect(dpe["hashkey"]).toBeUndefined();
		expect(dpe["version"]).toBeUndefined();
	});
});

describe("parse() — anonymisation (administratif)", () => {
	it("supprime les champs personnels connus, en conservant le reste de administratif", () => {
		const dpe = parseRaw(
			"<dpe><administratif>" +
				"<nom_proprietaire>Jean Dupont</nom_proprietaire>" +
				"<siren_proprietaire>123456789</siren_proprietaire>" +
				"<nom_proprietaire_installation_commune>Copro X</nom_proprietaire_installation_commune>" +
				"<consentement_proprietaire>1</consentement_proprietaire>" +
				"<information_consentement_proprietaire><nom>Jean</nom></information_consentement_proprietaire>" +
				"<information_formulaire_consentement><nom_formulaire>F</nom_formulaire></information_formulaire_consentement>" +
				"<diagnostiqueur><nom_diagnostiqueur>Martin</nom_diagnostiqueur><mail_diagnostiqueur>a@b.fr</mail_diagnostiqueur></diagnostiqueur>" +
				"<enum_version_id>2.6</enum_version_id>" +
				"</administratif></dpe>",
		);
		const administratif = dpe["administratif"] as Record<string, unknown>;

		expect(administratif["nom_proprietaire"]).toBeUndefined();
		expect(administratif["siren_proprietaire"]).toBeUndefined();
		expect(administratif["nom_proprietaire_installation_commune"]).toBeUndefined();
		expect(administratif["consentement_proprietaire"]).toBeUndefined();
		expect(administratif["information_consentement_proprietaire"]).toBeUndefined();
		expect(administratif["information_formulaire_consentement"]).toBeUndefined();
		expect(administratif["diagnostiqueur"]).toBeUndefined();
		// Le reste de administratif (non concerné par l'anonymisation) survit.
		expect(administratif["enum_version_id"]).toBe("2.6");
	});

	it("supprime auditeur (variante Audit du même sous-arbre)", () => {
		const audit = parseRaw(
			"<audit><administratif><auditeur><nom_auditeur>Martin</nom_auditeur></auditeur><enum_version_audit_id>2.5</enum_version_audit_id></administratif></audit>",
		);
		const administratif = audit["administratif"] as Record<string, unknown>;

		expect(administratif["auditeur"]).toBeUndefined();
		expect(administratif["enum_version_audit_id"]).toBe("2.5");
	});

	it("ne lève pas d'erreur si administratif ou les champs à anonymiser sont absents", () => {
		expect(() => parseRaw("<dpe><foo>bar</foo></dpe>")).not.toThrow();
		expect(() => parseRaw("<dpe><administratif><foo>bar</foo></administratif></dpe>")).not.toThrow();
	});
});

describe("parser - return root node", () => {
	it("<dpe> root node is returned", () => {
		const xml = "<dpe><foo>foo</foo></dpe>";
		const data = parseRaw(xml);
		expect(data).toEqual({ foo: "foo" });
	});

	it("<audit> root node is returned", () => {
		const xml = "<audit><foo>foo</foo></audit>";
		const data = parseRaw(xml);
		expect(data).toEqual({ foo: "foo" });
	});
});
