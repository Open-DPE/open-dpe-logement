import { common, diagnostic } from "@open-dpe-logement/models";
import { REGISTRY } from "./registry.js";
import type { Namespace, Key, Item, RuleReturn, RuleArgs } from "./registry.js";
import { Cache } from "./cache.js";

export type Thunk<T> = () => T;

export interface Context {
	readonly diagnostic: diagnostic.Diagnostic;
	readonly scenario: common.Scenario;

	register<N extends Namespace, K extends Key<N>>(
		ns: N,
		key: K,
		thunk: Thunk<RuleReturn<N, K>>,
	): RuleReturn<N, K>;

	register<N extends Namespace, K extends Key<N>>(
		ns: N,
		key: K,
		item: Item,
		thunk: Thunk<RuleReturn<N, K>>,
	): RuleReturn<N, K>;

	resolve<N extends Namespace, K extends Key<N>>(
		ns: N,
		key: K,
	): RuleReturn<N, K>;

	resolve<N extends Namespace, K extends Key<N>>(
		ns: N,
		key: K,
		...args: RuleArgs<N, K>
	): RuleReturn<N, K>;

	once<T>(ns: Namespace, key: string, fn: Thunk<T>): T;
	once<T>(ns: Namespace, key: string, item: Item, fn: Thunk<T>): T;
}

export function createContext(
	diagnostic: diagnostic.Diagnostic,
	scenario: common.Scenario = common.ScenarioEnum.conventionnel,
): Context {
	const cache = new Cache();
	const pending = new Set<string>();

	function buildKey(ns: string, key: string, item?: Item): string {
		return item ? `${ns}:${key}:${item.id}` : `${ns}:${key}`;
	}

	const ctx: Context = {
		diagnostic,
		scenario,

		register<N extends Namespace, K extends Key<N>>(
			ns: N,
			key: K,
			itemOrThunk: Item | Thunk<RuleReturn<N, K>>,
			thunk?: Thunk<RuleReturn<N, K>>,
		): RuleReturn<N, K> {
			const item = typeof itemOrThunk === "function" ? undefined : itemOrThunk;
			const fn = typeof itemOrThunk === "function" ? itemOrThunk : thunk!;
			const cacheKey = buildKey(String(ns), String(key), item);

			// Déjà calculé
			if (cache.has(String(ns), String(key), item)) {
				return cache.get(String(ns), String(key), item);
			}

			// Cycle détecté
			if (pending.has(cacheKey)) {
				throw new Error(
					`[Context] Cycle détecté : "${cacheKey}"\n` +
						`Pile : ${[...pending].join(" → ")}`,
				);
			}

			// Calcul
			pending.add(cacheKey);
			const result = fn();
			pending.delete(cacheKey);
			cache.set(String(ns), String(key), item, result);

			return result;
		},

		resolve<N extends Namespace, K extends Key<N>>(
			ns: N,
			key: K,
			...args: RuleArgs<N, K>
		): RuleReturn<N, K> {
			const rule = REGISTRY[ns][key] as (
				ctx: Context,
				...rest: unknown[]
			) => unknown;

			return rule(this, ...args) as RuleReturn<N, K>;
		},

		once<T>(
			ns: Namespace,
			key: string,
			itemOrFn: Item | Thunk<T>,
			fn?: Thunk<T>,
		): T {
			const item = typeof itemOrFn === "function" ? undefined : itemOrFn;
			const fnToCall = typeof itemOrFn === "function" ? itemOrFn : fn!;

			if (cache.has(ns, key, item)) {
				return cache.get(ns, key, item);
			}
			const result = fnToCall();
			cache.set(ns, key, item, result);
			return result;
		},
	};

	return ctx;
}
