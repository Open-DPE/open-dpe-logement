import { v4 as uuidv4 } from "uuid";
import { MappingError } from "./errors.js";
import type { Input } from "./types.js";

type IdGenerator = () => string;

const defaultIdGenerator: IdGenerator = () => uuidv4();

let idGenerator: IdGenerator = defaultIdGenerator;

/**
 * Génère un identifiant pour les entités reconstituées par le mapper sans
 * référence ADEME propre (masques, niveaux, appartements visités, parois de
 * local non chauffé reconstitué...).
 *
 * Pour toute entité qui possède une référence ADEME propre, utiliser
 * `resolveId` plutôt que cette fonction directement — voir sa documentation.
 *
 * Utilise `uuid v4` par défaut. En test, `setIdGenerator` rend la génération
 * déterministe — indispensable pour tout test par snapshot, sans quoi chaque
 * exécution produit un diff sur les champs `id` générés.
 */
export function createId(): string {
	return idGenerator();
}

/** Remplace le générateur d'identifiants utilisé par `createId` (tests uniquement). */
export function setIdGenerator(generator: IdGenerator): void {
	idGenerator = generator;
}

/** Restaure le générateur d'identifiants par défaut (uuid v4). */
export function resetIdGenerator(): void {
	idGenerator = defaultIdGenerator;
}

let idRegistry = new Map<string, string>();

/**
 * Résout une référence ADEME (mur, générateur, plancher, local non
 * chauffé...) vers un identifiant stable pour tout l'appel courant à
 * `mapFromDPE`/`mapFromAudit`.
 *
 * Le schéma public (`common.json $defs.id`) exige `format: "uuid"` pour tout
 * `id` d'entité — or les références ADEME brutes n'en sont pas (espacement,
 * formats hétérogènes selon le domaine, aucune garantie d'unicité entre
 * collections). `resolveId` fait le pont : première résolution d'une
 * référence → nouvel id via `createId()`, résolutions suivantes de la même
 * référence → le même id. Utilisé aussi bien pour qu'une entité se donne son
 * propre `id` (`resolveId(item.donnee_entree.reference)`) que pour qu'une
 * clé étrangère résolve vers ce même `id` après avoir trouvé la référence
 * correspondante via `findReference` (`resolveId(matchedReference)`).
 *
 * Les références sont déjà normalisées (minuscules, espacement) par
 * `ademe-parser` avant d'arriver ici — pas de re-normalisation nécessaire.
 */
export function resolveId(reference: string): string {
	const existing = idRegistry.get(reference);
	if (existing) return existing;
	const id = createId();
	idRegistry.set(reference, id);
	return id;
}

/**
 * Repart d'un registre vide. Appelée automatiquement en tête de
 * `mapFromDPE`/`mapFromAudit` — ne pas appeler manuellement en dehors des
 * tests : un oubli entre deux documents mappés à la suite (ex. le script de
 * couverture, qui mappe tout le corpus dans le même process Node) ferait
 * fuiter les id d'un document vers le suivant.
 */
export function resetIdRegistry(): void {
	idRegistry = new Map();
}

/**
 * Utilitaire local — équivalent à ce que `@open-dpe-logement/models`
 * exposait avant la migration zod (`common.NonEmptyArray`/`toNonEmptyArray`,
 * retiré du package car hors périmètre de la couche contrat).
 */
export type NonEmptyArray<T> = [T, ...T[]];

export function toNonEmptyArray<T>(arr: T[]): NonEmptyArray<T> {
	if (arr.length === 0) throw new Error("Array is empty");
	return arr as NonEmptyArray<T>;
}

export function mapAnneeEtablissement(props: Input): number {
	switch (props.type) {
		case "dpe":
			return new Date(props.administratif.date_etablissement_dpe).getFullYear();
		case "audit":
			return new Date(
				props.administratif.date_etablissement_audit,
			).getFullYear();
	}
}

export function mapNonEmptyArray<T>(
	values: T[],
	key: string,
	props: object,
): NonEmptyArray<T> {
	try {
		return toNonEmptyArray(values);
	} catch (error) {
		throw new MappingError(key, props);
	}
}

/**
 * Recherche `needle` dans `haystack` avec priorité stricte :
 * 1) égalité exacte sur l'ensemble de la collection,
 * 2) à défaut, clé composite (l'un contient l'autre) sur l'ensemble de la collection.
 *
 * Un match exact plus loin dans la collection ne peut jamais être éclipsé par
 * un match partiel trouvé plus tôt dans l'itération.
 *
 * Les références sont déjà normalisées en amont par `ademe-parser`
 * (minuscules, espaces internes réduits à un seul — voir
 * `toReferenceValue`) : cette fonction n'a pas à re-normaliser.
 */
export function findReference(
	needle: string,
	haystack: readonly string[],
): string | null {
	if (haystack.includes(needle)) return needle;

	return (
		haystack.find(
			(reference) => reference.includes(needle) || needle.includes(reference),
		) ?? null
	);
}
