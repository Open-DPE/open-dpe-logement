import type { CustomError } from "./types.js";

/**
 * Types structurels minimaux utilisés par les règles de cohérence.
 *
 * `validator` ne dépend pas de `@open-dpe-logement/models` (cf.
 * `claude/analyse-tests-packages-models.md` §1) : ces types ne couvrent que
 * les chemins effectivement lus par `checkRules`, pas le diagnostic complet.
 * Ajv a déjà validé la structure avant que `checkRules` ne soit appelée
 * (cf. `validate()` dans `index.ts`) ; ces types ne font qu'aider la
 * navigation côté TypeScript, ils ne sont pas la source de vérité.
 */

type Id = string;

/** `common#/$defs/annee_construction|annee_renovation|annee_installation` : entier ou `null` (non applicable / inconnu). */
type Annee = number | null;

type Isolation = {
	annee_installation: Annee;
};

/** Base commune aux murs, planchers bas et planchers hauts (cf. `enveloppe/paroi#/$defs/position`). */
type Paroi = {
	id: Id;
	annee_construction: Annee;
	annee_renovation: Annee;
	isolation: Isolation;
};

type Baie = {
	id: Id;
	position: {
		paroi_id: Id | null;
		baie_id: Id | null;
	};
};

type Porte = {
	id: Id;
	position: {
		paroi_id: Id | null;
	};
};

type PontThermique = {
	liaison: {
		mur_id: Id;
		plancher_id: Id | null;
		ouverture_id: Id | null;
	};
};

type LocalNonChauffe = {
	id: Id;
};

type Generateur = {
	id: Id;
	position: {
		generateur_mixte_id: Id | null;
	};
};

type Systeme = {
	generateur_id: Id;
	reseau: {
		emetteurs: Id[];
	} | null;
};

type Installation = {
	systemes: Systeme[];
};

type Emetteur = {
	id: Id;
};

export type Diagnostic = {
	date_etablissement: string;
	batiment: {
		annee_construction: Annee;
		annee_renovation: Annee;
	};
	enveloppe: {
		murs: Paroi[];
		planchers_bas: Paroi[];
		planchers_hauts: Paroi[];
		baies: Baie[];
		portes: Porte[];
		ponts_thermiques: PontThermique[];
		locaux_non_chauffes: LocalNonChauffe[];
	};
	chauffage: {
		emetteurs: Emetteur[];
		generateurs: Generateur[];
		installations: Installation[];
	};
	ecs: {
		generateurs: Generateur[];
		installations: Installation[];
	};
};

function customError(field: string, message: string): CustomError {
	return { field, message, type: "custom" };
}

function idsOf(items: { id: Id }[]): Set<Id> {
	return new Set(items.map((item) => item.id));
}

/**
 * Parcourt récursivement `node` et retourne toutes les occurrences de la clé
 * `key`, avec leur chemin façon `instancePath` Ajv (ex. `/enveloppe/murs/0/annee_construction`).
 *
 * Utilisé uniquement pour la famille "chronologie" (RC-002), dont la portée
 * est par nature `$.diagnostic..champ` (n'importe où dans le document) :
 * une énumération manuelle des emplacements serait aussi longue à écrire
 * qu'à maintenir, et se déciderait en silence à chaque nouvel emplacement
 * ajouté au schéma. Pour RC-003/RC-004, dont les règles portent sur une
 * relation structurelle précise (parent ↔ enfant, référence ↔ collection
 * cible), l'accès direct ci-dessous reste préférable — voir
 * `claude/design-regles-validator.md` §2.
 */
function collectByKey(node: unknown, key: string, path = ""): { path: string; value: unknown }[] {
	if (node === null || typeof node !== "object") {
		return [];
	}
	if (Array.isArray(node)) {
		return node.flatMap((item, index) => collectByKey(item, key, `${path}/${index}`));
	}
	const hits: { path: string; value: unknown }[] = [];
	for (const [prop, value] of Object.entries(node as Record<string, unknown>)) {
		const childPath = `${path}/${prop}`;
		if (prop === key) {
			hits.push({ path: childPath, value });
		} else {
			hits.push(...collectByKey(value, key, childPath));
		}
	}
	return hits;
}

/**
 * RC-002 : cohérence des années d'installation / construction / rénovation.
 *
 * Toute occurrence de `annee_installation`, `annee_construction` ou
 * `annee_renovation` dans le diagnostic doit être :
 * - supérieure ou égale à `batiment.annee_construction` ;
 * - inférieure ou égale à l'année de `date_etablissement`.
 *
 * Une valeur `null` (inconnue ou non applicable, indiscernables une fois la
 * donnée sérialisée — cf. `common.json#/$defs/non_applicable`) est ignorée :
 * pénaliser une valeur légitimement inconnue irait à l'encontre de la
 * doctrine (`schemas/README.md`, § Valeurs inconnues).
 */
function checkAnneesCoherence(diagnostic: Diagnostic): CustomError[] {
	const errors: CustomError[] = [];
	const anneeMin = diagnostic.batiment.annee_construction;
	const anneeMax = Number(diagnostic.date_etablissement.slice(0, 4));

	if (anneeMin === null || Number.isNaN(anneeMax)) {
		// batiment.annee_construction ou date_etablissement absent/invalide :
		// une erreur de schéma json-schema a déjà dû être remontée par Ajv
		// (tous deux sont `required`) — rien à vérifier de plus ici.
		return errors;
	}

	for (const champ of ["annee_construction", "annee_renovation"] as const) {
		for (const { path, value } of collectByKey(diagnostic, champ)) {
			if (value === null || typeof value !== "number") {
				continue;
			}
			if (value < anneeMin) {
				errors.push(
					customError(
						path,
						`RC-002 : ${champ} (${value}) doit être supérieure ou égale à l'année de construction du bâtiment (${anneeMin})`,
					),
				);
			}
			if (value > anneeMax) {
				errors.push(
					customError(
						path,
						`RC-002 : ${champ} (${value}) doit être inférieure ou égale à l'année d'établissement du diagnostic (${anneeMax})`,
					),
				);
			}
		}
	}
	return errors;
}

/**
 * RC-003 : cohérence des années d'isolation.
 *
 * `isolation.annee_installation` d'un mur, plancher bas ou plancher haut doit
 * être supérieure ou égale à `annee_construction` **et** `annee_renovation`
 * du même mur/plancher (son parent direct) — pas de `batiment`, à la
 * différence de RC-002.
 */
function checkAnneesIsolation(items: Paroi[], collectionPath: string): CustomError[] {
	const errors: CustomError[] = [];
	items.forEach((item, index) => {
		const annee = item.isolation.annee_installation;
		if (annee === null) {
			return;
		}
		const path = `${collectionPath}/${index}/isolation/annee_installation`;
		if (item.annee_construction !== null && annee < item.annee_construction) {
			errors.push(
				customError(
					path,
					`RC-003 : l'année d'installation de l'isolation (${annee}) doit être supérieure ou égale à l'année de construction (${item.annee_construction})`,
				),
			);
		}
		if (item.annee_renovation !== null && annee < item.annee_renovation) {
			errors.push(
				customError(
					path,
					`RC-003 : l'année d'installation de l'isolation (${annee}) doit être supérieure ou égale à l'année de rénovation (${item.annee_renovation})`,
				),
			);
		}
	});
	return errors;
}

function checkReference(sourcePath: string, sourceId: Id | null, targetIds: Set<Id>, label: string): CustomError | null {
	if (sourceId === null) {
		return null;
	}
	if (!targetIds.has(sourceId)) {
		return customError(sourcePath, `RC-004 : ${label} référence un identifiant inexistant (${sourceId})`);
	}
	return null;
}

/**
 * RC-004 : cohérence des références internes.
 *
 * Chaque relation est vérifiée par accès direct à sa collection cible plutôt
 * que par recherche générique sur le nom du champ id (mapping précis retenu
 * après revue — cf. `claude/design-regles-validator.md`) : un id du bon
 * format référençant la mauvaise collection (ex. `mur_id` pointant vers un
 * émetteur) n'est détecté qu'ainsi, une simple présence dans un pool global
 * d'ids ne le verrait pas.
 *
 * `emetteurs` (README) est un tableau d'ids (`chauffage.installations[].systemes[].reseau.emetteurs[]`),
 * pas un champ `xxx_id` unique comme les autres relations de cette règle ;
 * chaque élément du tableau est vérifié individuellement contre
 * `chauffage.emetteurs[].id`.
 *
 * `installation_id`, cité dans une version antérieure du README, a été retiré
 * de la liste des relations (aucun champ ni relation de ce nom n'existe dans
 * les schémas) — pas de traitement correspondant ici.
 */
function checkReferences(diagnostic: Diagnostic): CustomError[] {
	const { enveloppe, chauffage, ecs } = diagnostic;

	const idsMurs = idsOf(enveloppe.murs);
	const idsPlanchersBas = idsOf(enveloppe.planchers_bas);
	const idsPlanchersHauts = idsOf(enveloppe.planchers_hauts);
	const idsPlanchers = new Set([...idsPlanchersBas, ...idsPlanchersHauts]);
	const idsParois = new Set([...idsMurs, ...idsPlanchers]);
	const idsBaies = idsOf(enveloppe.baies);
	const idsPortes = idsOf(enveloppe.portes);
	const idsOuvertures = new Set([...idsBaies, ...idsPortes]);
	const idsLocauxNonChauffes = idsOf(enveloppe.locaux_non_chauffes);
	const idsEmetteurs = idsOf(chauffage.emetteurs);
	const idsGenerateursChauffage = idsOf(chauffage.generateurs);
	const idsGenerateursEcs = idsOf(ecs.generateurs);

	const errors: CustomError[] = [];
	const push = (error: CustomError | null) => {
		if (error) {
			errors.push(error);
		}
	};

	// local_non_chauffe_id : murs, planchers bas, planchers hauts → enveloppe.locaux_non_chauffes[].id
	(
		[
			["murs", enveloppe.murs],
			["planchers_bas", enveloppe.planchers_bas],
			["planchers_hauts", enveloppe.planchers_hauts],
		] as const
	).forEach(([nom, items]) => {
		items.forEach((item, index) => {
			const position = (item as unknown as { position?: { local_non_chauffe_id?: Id | null } }).position;
			const localNonChauffeId = position?.local_non_chauffe_id ?? null;
			push(
				checkReference(
					`/enveloppe/${nom}/${index}/position/local_non_chauffe_id`,
					localNonChauffeId,
					idsLocauxNonChauffes,
					"local_non_chauffe_id",
				),
			);
		});
	});

	// mur_id, plancher_id, ouverture_id : ponts_thermiques[].liaison
	enveloppe.ponts_thermiques.forEach((pontThermique, index) => {
		const base = `/enveloppe/ponts_thermiques/${index}/liaison`;
		push(checkReference(`${base}/mur_id`, pontThermique.liaison.mur_id, idsMurs, "mur_id"));
		push(checkReference(`${base}/plancher_id`, pontThermique.liaison.plancher_id, idsPlanchers, "plancher_id"));
		push(checkReference(`${base}/ouverture_id`, pontThermique.liaison.ouverture_id, idsOuvertures, "ouverture_id"));
	});

	// paroi_id : baies + portes → murs ∪ planchers_bas ∪ planchers_hauts
	enveloppe.baies.forEach((baie, index) => {
		push(checkReference(`/enveloppe/baies/${index}/position/paroi_id`, baie.position.paroi_id, idsParois, "paroi_id"));
	});
	enveloppe.portes.forEach((porte, index) => {
		push(checkReference(`/enveloppe/portes/${index}/position/paroi_id`, porte.position.paroi_id, idsParois, "paroi_id"));
	});

	// baie_id : baies (double fenêtre) → baies
	enveloppe.baies.forEach((baie, index) => {
		push(checkReference(`/enveloppe/baies/${index}/position/baie_id`, baie.position.baie_id, idsBaies, "baie_id"));
	});

	// generateur_id : chauffage et ecs, chacun scopé à son propre domaine
	chauffage.installations.forEach((installation, installationIndex) => {
		installation.systemes.forEach((systeme, systemeIndex) => {
			push(
				checkReference(
					`/chauffage/installations/${installationIndex}/systemes/${systemeIndex}/generateur_id`,
					systeme.generateur_id,
					idsGenerateursChauffage,
					"generateur_id",
				),
			);
			// emetteurs (README) : tableau d'ids → chauffage.emetteurs[].id, un check par élément
			if (systeme.reseau !== null) {
				systeme.reseau.emetteurs.forEach((emetteurId, emetteurIndex) => {
					push(
						checkReference(
							`/chauffage/installations/${installationIndex}/systemes/${systemeIndex}/reseau/emetteurs/${emetteurIndex}`,
							emetteurId,
							idsEmetteurs,
							"emetteurs",
						),
					);
				});
			}
		});
	});
	ecs.installations.forEach((installation, installationIndex) => {
		installation.systemes.forEach((systeme, systemeIndex) => {
			push(
				checkReference(
					`/ecs/installations/${installationIndex}/systemes/${systemeIndex}/generateur_id`,
					systeme.generateur_id,
					idsGenerateursEcs,
					"generateur_id",
				),
			);
		});
	});

	// generateur_mixte_id : croisé chauffage ↔ ecs (cf. claude/analyse-mapping-errors-ademe-mapper.md §2.B —
	// le générateur mixte d'un générateur de chauffage est un générateur ECS, et réciproquement)
	chauffage.generateurs.forEach((generateur, index) => {
		push(
			checkReference(
				`/chauffage/generateurs/${index}/position/generateur_mixte_id`,
				generateur.position.generateur_mixte_id,
				idsGenerateursEcs,
				"generateur_mixte_id",
			),
		);
	});
	ecs.generateurs.forEach((generateur, index) => {
		push(
			checkReference(
				`/ecs/generateurs/${index}/position/generateur_mixte_id`,
				generateur.position.generateur_mixte_id,
				idsGenerateursChauffage,
				"generateur_mixte_id",
			),
		);
	});

	return errors;
}

/**
 * Exécute les règles de cohérence complémentaires (`README.md` § Règles de
 * cohérence), non exprimables en JSON Schema. N'est appelée que pour la clé
 * `/diagnostic`, et seulement après un succès de validation Ajv (cf.
 * `validate()` dans `index.ts`) : les règles supposent une structure déjà
 * conforme au schéma public.
 *
 * RC-001 (adresse / Base Adresse Nationale) est hors périmètre : elle
 * nécessite un appel réseau, alors que le reste du package est synchrone —
 * voir `claude/design-regles-validator.md` §5.2.
 */
export function checkRules(diagnostic: Diagnostic): CustomError[] {
	return [
		...checkAnneesCoherence(diagnostic),
		...checkAnneesIsolation(diagnostic.enveloppe.murs, "/enveloppe/murs"),
		...checkAnneesIsolation(diagnostic.enveloppe.planchers_bas, "/enveloppe/planchers_bas"),
		...checkAnneesIsolation(diagnostic.enveloppe.planchers_hauts, "/enveloppe/planchers_hauts"),
		...checkReferences(diagnostic),
	];
}
