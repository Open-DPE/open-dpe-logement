/**
 * Couche B : règles de cohérence (`checkRules`, cf. `src/rules.ts`).
 *
 * Principe : une seule « golden fixture » de diagnostic complet, valide de
 * bout en bout (Ajv + `checkRules`), servant de base à une série de
 * mutations ciblées — une par relation/comparaison réellement implémentée
 * dans `checkRules` (et non par code RC-00X : certaines règles couvrent
 * plusieurs champs avec la même logique, cf. `checkReferences`).
 *
 * Chaque test de mutation :
 * 1. reconstruit un diagnostic valide (golden, ou une variante locale — cf.
 *    notes ci-dessous pour les cas que la golden fixture ne peut pas porter
 *    elle-même) ;
 * 2. casse UN SEUL point précis ;
 * 3. vérifie `valid: false` avec le NOMBRE EXACT d'erreurs attendues et,
 *    pour chacune, le `field` et une sous-chaîne significative du `message`.
 */

import { describe, expect, it } from "vitest";
import { validate } from "../src/index.js";
import type { CustomError } from "../src/types.js";
import {
	BATIMENT_ANNEE_CONSTRUCTION,
	GENERATEUR_CHAUFFAGE_1_ID,
	GENERATEUR_CHAUFFAGE_2_ID,
	GENERATEUR_ECS_1_ID,
	MUR_1_ID,
	UNKNOWN_ID,
	buildGenerateurChauffageInconnu,
	buildGenerateurChauffagePacClassique,
	buildGoldenDiagnostic,
	buildMurIsole,
} from "./fixtures.js";

/** Valide le diagnostic et retourne les erreurs, en échouant lisiblement si `valid` ne correspond pas. */
function checkInvalid(diagnostic: unknown): CustomError[] {
	const response = validate("/diagnostic", diagnostic);
	if (response.valid) {
		throw new Error("Le diagnostic était attendu invalide mais `validate()` a retourné valid: true");
	}
	return response.errors as CustomError[];
}

function checkValid(diagnostic: unknown): void {
	const response = validate("/diagnostic", diagnostic);
	if (!response.valid) {
		throw new Error(`Le diagnostic était attendu valide mais des erreurs ont été remontées : ${JSON.stringify(response.errors)}`);
	}
}

describe("checkRules() via validate(\"/diagnostic\", ...) — couche B", () => {
	it("la golden fixture est valide (structure Ajv + toutes les règles de cohérence)", () => {
		checkValid(buildGoldenDiagnostic());
	});

	describe("RC-002 — cohérence des années (portée globale au diagnostic)", () => {
		it("une année strictement inférieure à batiment.annee_construction est rejetée", () => {
			const diagnostic = buildGoldenDiagnostic();
			(diagnostic["chauffage"] as { emetteurs: { annee_installation: number | null }[] }).emetteurs[0]!.annee_installation =
				BATIMENT_ANNEE_CONSTRUCTION - 1;

			const errors = checkInvalid(diagnostic);

			expect(errors).toHaveLength(1);
			expect(errors[0]).toMatchObject({
				field: "/chauffage/emetteurs/0/annee_installation",
				type: "custom",
			});
			expect(errors[0]?.message).toContain("RC-002");
			expect(errors[0]?.message).toContain("année de construction du bâtiment");
		});

		it("une année strictement supérieure à l'année de date_etablissement est rejetée", () => {
			const diagnostic = buildGoldenDiagnostic();
			(diagnostic["chauffage"] as { emetteurs: { annee_installation: number | null }[] }).emetteurs[0]!.annee_installation = 2025;

			const errors = checkInvalid(diagnostic);

			expect(errors).toHaveLength(1);
			expect(errors[0]).toMatchObject({
				field: "/chauffage/emetteurs/0/annee_installation",
				type: "custom",
			});
			expect(errors[0]?.message).toContain("RC-002");
			expect(errors[0]?.message).toContain("année d'établissement du diagnostic");
		});
	});

	describe("RC-003 — cohérence des années d'isolation (portée locale au mur/plancher)", () => {
		/**
		 * La golden fixture utilise volontairement un mur NON isolé (cf. plan —
		 * `isolation.etat: false`), branche dans laquelle
		 * `isolation.annee_installation` est forcée à `non_applicable` par le
		 * schéma : elle ne peut donc pas servir de point de départ à une
		 * mutation RC-003. On construit ici une variante locale (mur isolé,
		 * même id `MUR_1_ID` pour que les références croisées — pont
		 * thermique, baie, porte — restent valides) dédiée à ces tests, comme
		 * explicitement prévu par le plan.
		 */
		function buildDiagnosticWithMur(mur: unknown): Record<string, unknown> {
			const diagnostic = buildGoldenDiagnostic();
			(diagnostic["enveloppe"] as { murs: unknown[] }).murs = [mur];
			return diagnostic;
		}

		it("isolation.annee_installation antérieure à annee_construction du même mur", () => {
			// annee_construction (1990) > batiment.annee_construction (1980) : une
			// valeur qui viole uniquement la borne du mur ne doit pas aussi
			// déclencher RC-002 (cf. test dédié au chevauchement ci-dessous).
			const diagnostic = buildDiagnosticWithMur(buildMurIsole(MUR_1_ID, 1990, null, 1985));

			const errors = checkInvalid(diagnostic);

			expect(errors).toHaveLength(1);
			expect(errors[0]).toMatchObject({
				field: "/enveloppe/murs/0/isolation/annee_installation",
				type: "custom",
			});
			expect(errors[0]?.message).toContain("RC-003");
			expect(errors[0]?.message).toContain("année de construction");
		});

		it("isolation.annee_installation antérieure à annee_renovation du même mur", () => {
			const diagnostic = buildDiagnosticWithMur(buildMurIsole(MUR_1_ID, BATIMENT_ANNEE_CONSTRUCTION, 1995, 1990));

			const errors = checkInvalid(diagnostic);

			expect(errors).toHaveLength(1);
			expect(errors[0]).toMatchObject({
				field: "/enveloppe/murs/0/isolation/annee_installation",
				type: "custom",
			});
			expect(errors[0]?.message).toContain("RC-003");
			expect(errors[0]?.message).toContain("année de rénovation");
		});

		it("chevauchement volontaire RC-002/RC-003 : une même valeur peut déclencher les deux règles", () => {
			// mur.annee_construction === batiment.annee_construction (1980) :
			// toute valeur antérieure viole SIMULTANÉMENT la borne globale
			// (RC-002) et la borne locale au mur (RC-003). Comportement
			// documenté et confirmé par l'utilisateur — pas un bug.
			const diagnostic = buildDiagnosticWithMur(buildMurIsole(MUR_1_ID, BATIMENT_ANNEE_CONSTRUCTION, null, 1975));

			const errors = checkInvalid(diagnostic);

			expect(errors).toHaveLength(2);
			expect(errors[0]).toMatchObject({ field: "/enveloppe/murs/0/isolation/annee_installation", type: "custom" });
			expect(errors[0]?.message).toContain("RC-002");
			expect(errors[0]?.message).toContain("année de construction du bâtiment");
			expect(errors[1]).toMatchObject({ field: "/enveloppe/murs/0/isolation/annee_installation", type: "custom" });
			expect(errors[1]?.message).toContain("RC-003");
			expect(errors[1]?.message).toContain("année de construction");
		});
	});

	it("une valeur null (non applicable / inconnue) n'est jamais signalée, même hors bornes", () => {
		const diagnostic = buildGoldenDiagnostic();
		(diagnostic["enveloppe"] as { baies: { annee_installation: number | null }[] }).baies[0]!.annee_installation = null;

		checkValid(diagnostic);
	});

	describe("RC-004 — cohérence des références internes", () => {
		it("local_non_chauffe_id (plancher bas) référençant un id inexistant", () => {
			const diagnostic = buildGoldenDiagnostic();
			(
				diagnostic["enveloppe"] as { planchers_bas: { position: { local_non_chauffe_id: string | null } }[] }
			).planchers_bas[0]!.position.local_non_chauffe_id = UNKNOWN_ID;

			const errors = checkInvalid(diagnostic);

			expect(errors).toHaveLength(1);
			expect(errors[0]).toMatchObject({ field: "/enveloppe/planchers_bas/0/position/local_non_chauffe_id", type: "custom" });
			expect(errors[0]?.message).toContain("RC-004");
			expect(errors[0]?.message).toContain("local_non_chauffe_id");
		});

		it("mur_id (pont thermique) référençant un id inexistant", () => {
			const diagnostic = buildGoldenDiagnostic();
			(
				diagnostic["enveloppe"] as { ponts_thermiques: { liaison: { mur_id: string } }[] }
			).ponts_thermiques[0]!.liaison.mur_id = UNKNOWN_ID;

			const errors = checkInvalid(diagnostic);

			expect(errors).toHaveLength(1);
			expect(errors[0]).toMatchObject({ field: "/enveloppe/ponts_thermiques/0/liaison/mur_id", type: "custom" });
			expect(errors[0]?.message).toContain("RC-004");
			expect(errors[0]?.message).toContain("mur_id");
		});

		it("plancher_id (pont thermique) référençant un id inexistant", () => {
			const diagnostic = buildGoldenDiagnostic();
			(
				diagnostic["enveloppe"] as { ponts_thermiques: { liaison: { plancher_id: string | null } }[] }
			).ponts_thermiques[0]!.liaison.plancher_id = UNKNOWN_ID;

			const errors = checkInvalid(diagnostic);

			expect(errors).toHaveLength(1);
			expect(errors[0]).toMatchObject({ field: "/enveloppe/ponts_thermiques/0/liaison/plancher_id", type: "custom" });
			expect(errors[0]?.message).toContain("RC-004");
			expect(errors[0]?.message).toContain("plancher_id");
		});

		it("paroi_id (baie) référençant un id inexistant", () => {
			const diagnostic = buildGoldenDiagnostic();
			(diagnostic["enveloppe"] as { baies: { position: { paroi_id: string | null } }[] }).baies[0]!.position.paroi_id =
				UNKNOWN_ID;

			const errors = checkInvalid(diagnostic);

			expect(errors).toHaveLength(1);
			expect(errors[0]).toMatchObject({ field: "/enveloppe/baies/0/position/paroi_id", type: "custom" });
			expect(errors[0]?.message).toContain("RC-004");
			expect(errors[0]?.message).toContain("paroi_id");
		});

		it("ouverture_id (pont thermique) référençant un id inexistant", () => {
			const diagnostic = buildGoldenDiagnostic();
			(
				diagnostic["enveloppe"] as { ponts_thermiques: { liaison: { ouverture_id: string | null } }[] }
			).ponts_thermiques[1]!.liaison.ouverture_id = UNKNOWN_ID;

			const errors = checkInvalid(diagnostic);

			expect(errors).toHaveLength(1);
			expect(errors[0]).toMatchObject({ field: "/enveloppe/ponts_thermiques/1/liaison/ouverture_id", type: "custom" });
			expect(errors[0]?.message).toContain("RC-004");
			expect(errors[0]?.message).toContain("ouverture_id");
		});

		it("baie_id (double fenêtre) référençant un id inexistant", () => {
			const diagnostic = buildGoldenDiagnostic();
			(diagnostic["enveloppe"] as { baies: { position: { baie_id: string | null } }[] }).baies[0]!.position.baie_id =
				UNKNOWN_ID;

			const errors = checkInvalid(diagnostic);

			expect(errors).toHaveLength(1);
			expect(errors[0]).toMatchObject({ field: "/enveloppe/baies/0/position/baie_id", type: "custom" });
			expect(errors[0]?.message).toContain("RC-004");
			expect(errors[0]?.message).toContain("baie_id");
		});

		it("generateur_id (chauffage) référençant un id inexistant — y compris un id valide côté ecs (pool séparé)", () => {
			const diagnostic = buildGoldenDiagnostic();
			(
				diagnostic["chauffage"] as { installations: { systemes: { generateur_id: string }[] }[] }
			).installations[0]!.systemes[0]!.generateur_id = GENERATEUR_ECS_1_ID;

			const errors = checkInvalid(diagnostic);

			expect(errors).toHaveLength(1);
			expect(errors[0]).toMatchObject({
				field: "/chauffage/installations/0/systemes/0/generateur_id",
				type: "custom",
			});
			expect(errors[0]?.message).toContain("RC-004");
			expect(errors[0]?.message).toContain("generateur_id");
		});

		it("generateur_id (ecs) référençant un id inexistant", () => {
			const diagnostic = buildGoldenDiagnostic();
			(diagnostic["ecs"] as { installations: { systemes: { generateur_id: string }[] }[] }).installations[0]!.systemes[0]!.generateur_id =
				UNKNOWN_ID;

			const errors = checkInvalid(diagnostic);

			expect(errors).toHaveLength(1);
			expect(errors[0]).toMatchObject({ field: "/ecs/installations/0/systemes/0/generateur_id", type: "custom" });
			expect(errors[0]?.message).toContain("RC-004");
			expect(errors[0]?.message).toContain("generateur_id");
		});

		it("emetteurs[] (réseau de chauffage) référençant un id inexistant", () => {
			const diagnostic = buildGoldenDiagnostic();
			(
				diagnostic["chauffage"] as {
					installations: { systemes: { reseau: { emetteurs: string[] } | null }[] }[];
				}
			).installations[0]!.systemes[0]!.reseau!.emetteurs[0] = UNKNOWN_ID;

			const errors = checkInvalid(diagnostic);

			expect(errors).toHaveLength(1);
			expect(errors[0]).toMatchObject({
				field: "/chauffage/installations/0/systemes/0/reseau/emetteurs/0",
				type: "custom",
			});
			expect(errors[0]?.message).toContain("RC-004");
			expect(errors[0]?.message).toContain("emetteurs");
		});

		/**
		 * `generateur_mixte_id` : cas particulier. Dans TOUTES les branches
		 * concrètes de `/chauffage/generateur` et `/ecs/generateur` utilisées
		 * ailleurs dans ces fixtures (dont `generateur-inconnu`, utilisé par la
		 * golden fixture), `position.generateur_mixte_id` est verrouillé par le
		 * schéma à `non_applicable` (`const: null`) — le muter vers un id réel
		 * ferait donc échouer la validation Ajv AVANT même d'atteindre
		 * `checkRules`, empêchant de tester cette règle. Seule la branche
		 * « Pompe à chaleur classique » de `chauffage/generateur-thermodynamique`
		 * laisse ce champ libre (ni la branche du générateur ni celle du
		 * schéma parent ne le contraignent). On utilise donc une variante
		 * locale à deux générateurs de chauffage (un « PAC classique » qui
		 * porte le test, un second générateur — même domaine, chauffage — dont
		 * l'id sert de valeur « domaine erroné ») ; la golden fixture partagée
		 * n'est pas modifiée.
		 */
		it("generateur_mixte_id (chauffage) pointant vers le mauvais domaine (un autre générateur chauffage, pas un générateur ecs)", () => {
			const diagnostic = buildGoldenDiagnostic();
			(diagnostic["chauffage"] as { generateurs: unknown[] }).generateurs = [
				buildGenerateurChauffagePacClassique(GENERATEUR_CHAUFFAGE_1_ID, null),
				buildGenerateurChauffageInconnu(GENERATEUR_CHAUFFAGE_2_ID),
			];
			// Le système de chauffage référence toujours GENERATEUR_CHAUFFAGE_1_ID
			// (id inchangé) : la substitution ci-dessus reste valide en l'état.
			checkValid(diagnostic);

			(
				diagnostic["chauffage"] as {
					generateurs: { position: { generateur_mixte_id: string | null } }[];
				}
			).generateurs[0]!.position.generateur_mixte_id = GENERATEUR_CHAUFFAGE_2_ID;

			const errors = checkInvalid(diagnostic);

			expect(errors).toHaveLength(1);
			expect(errors[0]).toMatchObject({
				field: "/chauffage/generateurs/0/position/generateur_mixte_id",
				type: "custom",
			});
			expect(errors[0]?.message).toContain("RC-004");
			expect(errors[0]?.message).toContain("generateur_mixte_id");
		});
	});
});

