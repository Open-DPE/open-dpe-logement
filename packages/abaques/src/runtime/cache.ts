import { loadAsset } from "#runtime/loader.js";

const store = new Map<string, unknown>();
const keys = new Set<string>();
let pending: Promise<void> | undefined;

export function registerTable(key: string): void {
	keys.add(key);
}

export function init(): Promise<void> {
	if (!pending) {
		pending = Promise.all(
			[...keys].map(async (key) => {
				store.set(key, await loadAsset(key));
			}),
		).then(() => undefined);
	}
	return pending;
}

export function getTable<T>(key: string): T {
	if (!store.has(key)) {
		throw new Error(
			`[abaques] Table "${key}" non chargée. Avez-vous appelé init() avant utilisation ?`,
		);
	}
	return store.get(key) as T;
}
