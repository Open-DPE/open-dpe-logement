import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";
import { parse } from "../../src/dpe/parser.js";

export type FixtureCritere =
	| "maison_individuelle"
	| "appartement_individuel"
	| "immeuble_collectif"
	| "multi_generateurs"
	| "champs_optionnels_absents";

export type FixtureManifestEntry = {
	/** Nom du fichier XML attendu dans le dossier de fixtures (numero_dpe.xml) */
	file: string;
	/** Numéro DPE source, pour traçabilité vers l'open data ADEME */
	numero_dpe: string;
	/** Valeur attendue de l'attribut `version` sur la racine <dpe> */
	version_dpe: string;
	critere: FixtureCritere;
};

/**
 * Suite de tests structurels pour une version de DPE.
 *
 * Ne valide pas l'exhaustivité des ~290 champs du schéma : vérifie que le XML
 * réel, une fois parsé, respecte les invariants structurels attendus par les
 * types TS (collections toujours en tableau même à 1 élément, union
 * discriminante logement/logement_neuf/tertiaire/dpe_immeuble, présence
 * réelle des champs optionnels absents). C'est un détecteur de dérive
 * XSD <-> types, pas un validateur de schéma complet.
 */
export function runDpeVersionSuite(
	versionLabel: string,
	fixturesDir: string,
	manifest: FixtureManifestEntry[],
) {
	describe(`dpe ${versionLabel}`, () => {
		for (const entry of manifest) {
			const path = join(fixturesDir, entry.file);

			if (!existsSync(path)) {
				it.skip(`${entry.critere} (${entry.numero_dpe}) — fixture manquante : ${entry.file}`, () => {});
				continue;
			}

			it(`${entry.critere} (${entry.numero_dpe})`, () => {
				const xml = readFileSync(path, "utf-8");
				const dpe = parse(xml);

				// Tous nos échantillons relèvent du périmètre "logement" du README
				// (maison individuelle / appartement / immeuble collectif) : `logement`
				// est donc toujours renseigné. `logement_neuf`/`tertiaire` relèvent de
				// méthodes distinctes (RT2012/RE2020, ERP), absentes de notre échantillon.
				// `dpe_immeuble` N'EST PAS mutuellement exclusif avec `logement` en
				// pratique : sur un DPE "immeuble collectif" réel, les deux coexistent
				// (dpe_immeuble porte les données agrégées au bâtiment). Corrigé après
				// échec du test sur un fixture réel (2294E1723383Q) — l'hypothèse
				// d'union strictement discriminante issue de la lecture du XSD seul
				// était fausse.
				expect(dpe.logement).not.toBeNull();
				expect(dpe.logement).not.toBeUndefined();
				expect(dpe.logement_neuf == null).toBe(true);
				expect(dpe.tertiaire == null).toBe(true);

				const logement = dpe.logement as Record<string, unknown>;
				const administratif = dpe.administratif as Record<string, unknown>;
				const caracteristiqueGenerale =
					logement.caracteristique_generale as Record<string, unknown>;
				const enveloppe = logement.enveloppe as Record<string, unknown>;

				// La version DPE réelle est administratif.enum_version_id.
				// L'attribut racine <dpe version="..."> observé sur les exports de
				// l'observatoire DPE-Audit porte un numéro de format d'export
				// (ex. "0.1.0"), sans rapport avec enums.VersionEnum.
				expect(typeof administratif.enum_version_id).toBe("string");
				expect(administratif.enum_version_id).toBe(entry.version_dpe);

				// Collections : jamais collapsées en objet unique, même à 1 élément.
				expect(Array.isArray(enveloppe.mur_collection)).toBe(true);
				expect(Array.isArray(logement.installation_chauffage_collection)).toBe(
					true,
				);
				expect(Array.isArray(logement.installation_ecs_collection)).toBe(true);

				expect(
					typeof caracteristiqueGenerale.enum_methode_application_dpe_log_id,
				).toBe("number");

				switch (entry.critere) {
					case "champs_optionnels_absents": {
						expect(caracteristiqueGenerale.nombre_appartement == null).toBe(
							true,
						);
						break;
					}
					case "immeuble_collectif": {
						expect(typeof caracteristiqueGenerale.nombre_appartement).toBe(
							"number",
						);
						expect(
							caracteristiqueGenerale.nombre_appartement as number,
						).toBeGreaterThan(1);
						break;
					}
					case "multi_generateurs": {
						const installations =
							logement.installation_chauffage_collection as Array<
								Record<string, unknown>
							>;
						const hasMultipleGenerateurs = installations.some(
							(installation) => {
								const generateurs =
									installation.generateur_chauffage_collection;
								return Array.isArray(generateurs) && generateurs.length >= 2;
							},
						);
						expect(hasMultipleGenerateurs).toBe(true);
						break;
					}
					default:
						break;
				}
			});
		}
	});
}
