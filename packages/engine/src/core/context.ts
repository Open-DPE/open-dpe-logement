import { common, diagnostic } from "@open-dpe-logement/models";
import type { Results } from "./results.js";

export type Thunk<T> = () => T;

export interface Context {
	readonly diagnostic: diagnostic.Diagnostic;
	readonly scenario: common.Scenario;

	once<T>(key: string, value: string, thunk: Thunk<T>): T;
	once<T>(key: string, value: string, item: { id: string }, thunk: Thunk<T>): T;

	register<K extends keyof Results, V extends keyof Results[K]>(
		key: K,
		value: V,
		thunk: Thunk<Results[K][V]>,
	): void;

	register<
		K extends keyof Results,
		Item extends Results[K] extends Record<string, infer I> ? I : never,
		V extends keyof Item,
		T extends { id: string },
	>(
		key: K,
		value: V,
		item: T,
		thunk: Thunk<Item[V]>,
	): void;

	resolve<K extends keyof Results, V extends keyof Results[K]>(
		key: K,
		value: V,
	): Results[K][V];

	resolve<
		K extends keyof Results,
		Item extends Results[K] extends Record<string, infer I> ? I : never,
		V extends keyof Item,
	>(
		key: K,
		value: V,
		item: { id: string },
	): Item[V];

	resolve<
		K extends keyof Results,
		Item extends Results[K] extends Record<string, infer I> ? I : never,
		V extends keyof Item,
	>(
		key: K,
		value: V,
		items: Array<{ id: string }>,
	): Array<Item[V]>;

	getResults(): Results;
}
