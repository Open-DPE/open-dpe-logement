import type { common, diagnostic } from "@open-dpe-logement/models";
import type { Context, Thunk } from "./context.js";
import type { Results } from "./results.js";

// Séparateur des segments de clé. Doit être absent de tous les IDs de modules
// (format "[a-z:]+") et de tous les IDs d'items du diagnostic.
const SEP = "\x00";

interface Entry {
	thunk: Thunk<unknown>;
	computed: boolean;
	result?: unknown;
}

/**
 * Implémentation du Context avec lazy evaluation et mémoïsation.
 *
 * Trois stores séparés pour éviter toute collision entre les registrations
 * formelles (register/resolve) et les mémoïsations ad-hoc (once) :
 *
 * - nsStore   : règles namespace-level → Results[moduleId][ruleName]
 * - itemStore : règles item-level      → Results[moduleId][itemId][ruleName]
 * - onceStore : mémoïsation ad-hoc, non incluse dans getResults()
 *
 * Format des clés :
 * - namespace : `${moduleId}\x00${ruleName}`
 * - item      : `${moduleId}\x00${itemId}\x00${ruleName}`
 */
export class Cache implements Context {
	readonly diagnostic: diagnostic.Diagnostic;
	readonly scenario: common.Scenario;

	private readonly nsStore = new Map<string, Entry>();
	private readonly itemStore = new Map<string, Entry>();
	private readonly onceStore = new Map<string, Entry>();

	constructor(diag: diagnostic.Diagnostic, scenario: common.Scenario) {
		this.diagnostic = diag;
		this.scenario = scenario;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	register(key: any, value: any, itemOrThunk: any, maybeThunk?: any): void {
		if (typeof itemOrThunk === "function") {
			// namespace-level
			const k = `${String(key)}${SEP}${String(value)}`;
			this.nsStore.set(k, {
				thunk: itemOrThunk as Thunk<unknown>,
				computed: false,
			});
		} else {
			// item-level
			const item = itemOrThunk as { id: string };
			const k = `${String(key)}${SEP}${item.id}${SEP}${String(value)}`;
			this.itemStore.set(k, {
				thunk: maybeThunk as Thunk<unknown>,
				computed: false,
			});
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	resolve(key: any, value: any, itemOrItems?: any): any {
		if (itemOrItems === undefined) {
			return this.compute(this.nsStore, `${String(key)}${SEP}${String(value)}`);
		}
		if (Array.isArray(itemOrItems)) {
			return (itemOrItems as Array<{ id: string }>).map((item) =>
				this.compute(
					this.itemStore,
					`${String(key)}${SEP}${item.id}${SEP}${String(value)}`,
				),
			);
		}
		const item = itemOrItems as { id: string };
		return this.compute(
			this.itemStore,
			`${String(key)}${SEP}${item.id}${SEP}${String(value)}`,
		);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	once(key: any, value: any, itemOrThunk: any, maybeThunk?: any): any {
		let k: string;
		let thunk: Thunk<unknown>;

		if (typeof itemOrThunk === "function") {
			k = `${String(key)}${SEP}${String(value)}`;
			thunk = itemOrThunk as Thunk<unknown>;
		} else {
			const item = itemOrThunk as { id: string };
			k = `${String(key)}${SEP}${item.id}${SEP}${String(value)}`;
			thunk = maybeThunk as Thunk<unknown>;
		}

		if (!this.onceStore.has(k)) {
			this.onceStore.set(k, { thunk, computed: false });
		}
		return this.compute(this.onceStore, k);
	}

	private compute(store: Map<string, Entry>, k: string): unknown {
		const entry = store.get(k);
		if (!entry) {
			throw new Error(
				`Cache : règle non enregistrée "${k.replaceAll(SEP, " | ")}"`,
			);
		}
		if (!entry.computed) {
			entry.result = entry.thunk();
			entry.computed = true;
		}
		return entry.result;
	}

	/**
	 * Force le calcul de toutes les règles enregistrées et retourne
	 * l'objet Results structuré.
	 */
	getResults(): Results {
		const out: Record<string, unknown> = {};

		// Règles namespace-level
		for (const [k] of this.nsStore) {
			const sep = k.indexOf(SEP);
			const moduleId = k.slice(0, sep);
			const ruleName = k.slice(sep + 1);
			if (!out[moduleId]) out[moduleId] = {};
			(out[moduleId] as Record<string, unknown>)[ruleName] = this.compute(
				this.nsStore,
				k,
			);
		}

		// Règles item-level
		for (const [k] of this.itemStore) {
			const first = k.indexOf(SEP);
			const second = k.indexOf(SEP, first + 1);
			const moduleId = k.slice(0, first);
			const itemId = k.slice(first + 1, second);
			const ruleName = k.slice(second + 1);
			if (!out[moduleId]) out[moduleId] = {};
			const mod = out[moduleId] as Record<string, Record<string, unknown>>;
			if (!mod[itemId]) mod[itemId] = {};
			mod[itemId][ruleName] = this.compute(this.itemStore, k);
		}

		return out as Results;
	}
}
