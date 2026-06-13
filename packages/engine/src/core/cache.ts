import type { Item } from "./registry.js";

type CacheKey = string;

function buildKey(ns: string, key: string, item?: Item): CacheKey {
	return item ? `${ns}:${key}:${item.id}` : `${ns}:${key}`;
}
export class Cache {
	private store = new Map<CacheKey, unknown>();

	has(ns: string, key: string, item?: Item): boolean {
		return this.store.has(buildKey(ns, key, item));
	}

	get<T>(ns: string, key: string, item?: Item): T {
		const cacheKey = buildKey(ns, key, item);
		if (!this.store.has(cacheKey)) {
			throw new Error(`[Cache] Clé non résolue : "${cacheKey}"`);
		}
		return this.store.get(cacheKey) as T;
	}

	set<T>(ns: string, key: string, item: Item | undefined, value: T): T {
		this.store.set(buildKey(ns, key, item), value);
		return value;
	}

	keys(): CacheKey[] {
		return [...this.store.keys()];
	}

	invalidate(uuid: string): void {
		for (const key of this.store.keys()) {
			if (key.endsWith(`:${uuid}`)) this.store.delete(key);
		}
	}

	all(): Map<string, unknown> {
		return this.store;
	}
}
