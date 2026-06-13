import { describe, it, expect } from "vitest";
import { Cache } from "../../src/core/cache.js";

describe("Cache", () => {
	describe("has", () => {
		it("retourne false si la clé est absente", () => {
			const cache = new Cache();
			expect(cache.has("ns", "key")).toBe(false);
		});

		it("retourne true après un set sans item", () => {
			const cache = new Cache();
			cache.set("ns", "key", undefined, 42);
			expect(cache.has("ns", "key")).toBe(true);
		});

		it("retourne true après un set avec item", () => {
			const cache = new Cache();
			cache.set("ns", "key", { id: "abc" }, 42);
			expect(cache.has("ns", "key", { id: "abc" })).toBe(true);
		});

		it("ne confond pas la clé avec item et la clé sans item", () => {
			const cache = new Cache();
			cache.set("ns", "key", { id: "abc" }, 42);
			expect(cache.has("ns", "key")).toBe(false);
		});
	});

	describe("get", () => {
		it("lève une erreur si la clé est absente", () => {
			const cache = new Cache();
			expect(() => cache.get("ns", "key")).toThrow(
				'[Cache] Clé non résolue : "ns:key"',
			);
		});

		it("lève une erreur avec la clé composite dans le message", () => {
			const cache = new Cache();
			expect(() => cache.get("ns", "key", { id: "abc" })).toThrow(
				'[Cache] Clé non résolue : "ns:key:abc"',
			);
		});

		it("retourne la valeur stockée sans item", () => {
			const cache = new Cache();
			cache.set("ns", "key", undefined, 99);
			expect(cache.get("ns", "key")).toBe(99);
		});

		it("retourne la valeur stockée avec item", () => {
			const cache = new Cache();
			cache.set("ns", "key", { id: "x" }, "hello");
			expect(cache.get("ns", "key", { id: "x" })).toBe("hello");
		});
	});

	describe("set", () => {
		it("retourne la valeur stockée", () => {
			const cache = new Cache();
			const result = cache.set("ns", "key", undefined, 42);
			expect(result).toBe(42);
		});

		it("écrase une valeur existante", () => {
			const cache = new Cache();
			cache.set("ns", "key", undefined, 1);
			cache.set("ns", "key", undefined, 2);
			expect(cache.get("ns", "key")).toBe(2);
		});

		it("stocke des items distincts sous des clés distinctes", () => {
			const cache = new Cache();
			cache.set("ns", "key", { id: "a" }, 1);
			cache.set("ns", "key", { id: "b" }, 2);
			expect(cache.get("ns", "key", { id: "a" })).toBe(1);
			expect(cache.get("ns", "key", { id: "b" })).toBe(2);
		});
	});

	describe("keys", () => {
		it("retourne un tableau vide si le cache est vide", () => {
			const cache = new Cache();
			expect(cache.keys()).toEqual([]);
		});

		it("retourne toutes les clés dans l'ordre d'insertion", () => {
			const cache = new Cache();
			cache.set("a", "x", undefined, 1);
			cache.set("b", "y", { id: "z" }, 2);
			expect(cache.keys()).toEqual(["a:x", "b:y:z"]);
		});
	});

	describe("invalidate", () => {
		it("supprime les entrées dont la clé se termine par l'uuid", () => {
			const cache = new Cache();
			cache.set("a", "b", { id: "uuid42" }, 1);
			cache.set("c", "d", { id: "uuid42" }, 2);
			cache.invalidate("uuid42");
			expect(cache.has("a", "b", { id: "uuid42" })).toBe(false);
			expect(cache.has("c", "d", { id: "uuid42" })).toBe(false);
		});

		it("ne supprime pas les entrées sans cet uuid", () => {
			const cache = new Cache();
			cache.set("a", "b", { id: "uuid42" }, 1);
			cache.set("c", "d", undefined, 2);
			cache.invalidate("uuid42");
			expect(cache.has("c", "d")).toBe(true);
		});

		it("ne supprime pas une clé qui contient l'uuid en milieu de segment", () => {
			const cache = new Cache();
			// clé produite : "a:uuid42:other" — uuid en position médiane, pas en suffixe
			cache.set("a", "uuid42", { id: "other" }, 1);
			cache.invalidate("uuid42");
			expect(cache.has("a", "uuid42", { id: "other" })).toBe(true);
		});

		it("n'échoue pas si aucune entrée ne correspond", () => {
			const cache = new Cache();
			cache.set("a", "b", undefined, 1);
			expect(() => cache.invalidate("inexistant")).not.toThrow();
		});
	});
});
