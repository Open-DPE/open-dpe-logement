import { common, diagnostic } from "@open-dpe-logement/models";
import { REGISTRY } from "#/rules/registry.js";
import { Cache } from "./cache.js";
import type { RegistryFn, RegistryReturn } from "./registry.js";

export type Thunk<T> = () => T;
export type Item = { id: string };

export interface Context {
	readonly diagnostic: diagnostic.Diagnostic;
	readonly scenario: common.Scenario;

	register<
		N extends keyof typeof REGISTRY,
		K extends keyof (typeof REGISTRY)[N],
	>(
		ns: N,
		key: K,
		thunk: Thunk<RegistryReturn<typeof REGISTRY, N, K>>,
	): RegistryReturn<typeof REGISTRY, N, K>;

	register<
		N extends keyof typeof REGISTRY,
		K extends keyof (typeof REGISTRY)[N],
	>(
		ns: N,
		key: K,
		item: Item,
		thunk: Thunk<RegistryReturn<typeof REGISTRY, N, K>>,
	): RegistryReturn<typeof REGISTRY, N, K>;

	resolve<
		N extends keyof typeof REGISTRY,
		K extends keyof (typeof REGISTRY)[N],
	>(
		ns: N,
		key: K,
	): RegistryReturn<typeof REGISTRY, N, K>;

	resolve<
		N extends keyof typeof REGISTRY,
		K extends keyof (typeof REGISTRY)[N],
	>(
		ns: N,
		key: K,
		item: Item,
	): RegistryReturn<typeof REGISTRY, N, K>;
}

type R = typeof REGISTRY;

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

		register<N extends keyof R, K extends keyof R[N]>(
			ns: N,
			key: K,
			itemOrThunk: Item | Thunk<RegistryReturn<R, N, K>>,
			thunk?: Thunk<RegistryReturn<R, N, K>>,
		): RegistryReturn<R, N, K> {
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

		resolve<N extends keyof R, K extends keyof R[N]>(
			ns: N,
			key: K,
			item?: Item,
		): RegistryReturn<R, N, K> {
			if (!cache.has(String(ns), String(key), item)) {
				const rule = REGISTRY[ns][key] as RegistryFn<R, N, K>;
				item ? rule(ctx, item) : rule(ctx);
			}
			return cache.get(String(ns), String(key), item);
		},
	};

	return ctx;
}
