import { describe, it, expect } from "vitest";
import type { diagnostic } from "@open-dpe-logement/models";
import { createContext } from "../../src/core/context.js";
import { calcule_nj } from "../../src/rules/climat/formulas.js";

// Stub minimal suffisant pour les tests qui n'accèdent pas au diagnostic
const emptyDiagnostic = {} as diagnostic.Diagnostic;

describe("createContext", () => {
	describe("initialisation", () => {
		it("expose le diagnostic passé en argument", () => {
			const diag = { batiment: {} } as diagnostic.Diagnostic;
			const ctx = createContext(diag);
			expect(ctx.diagnostic).toBe(diag);
		});

		it("utilise le scénario conventionnel par défaut", () => {
			const ctx = createContext(emptyDiagnostic);
			expect(ctx.scenario).toBe("conventionnel");
		});

		it("utilise le scénario passé en argument", () => {
			const ctx = createContext(emptyDiagnostic, "depensier");
			expect(ctx.scenario).toBe("depensier");
		});
	});

	describe("register", () => {
		it("appelle le thunk et retourne son résultat", () => {
			const ctx = createContext(emptyDiagnostic);
			const value = calcule_nj();
			const result = ctx.register("climat", "nj", () => value);
			expect(result).toBe(value);
		});

		it("n'appelle le thunk qu'une seule fois pour la même clé", () => {
			const ctx = createContext(emptyDiagnostic);
			let calls = 0;
			const thunk = () => { calls++; return calcule_nj(); };
			ctx.register("climat", "nj", thunk);
			ctx.register("climat", "nj", thunk);
			expect(calls).toBe(1);
		});

		it("distingue deux items différents sous la même clé ns:key", () => {
			const ctx = createContext(emptyDiagnostic);
			let calls = 0;
			const thunk = () => { calls++; return calcule_nj(); };
			ctx.register("climat", "nj", { id: "item-1" }, thunk);
			ctx.register("climat", "nj", { id: "item-1" }, thunk); // cache hit
			ctx.register("climat", "nj", { id: "item-2" }, thunk); // nouvelle entrée
			expect(calls).toBe(2);
		});

		it("lève une erreur de cycle lorsqu'un thunk appelle register sur la même clé", () => {
			const ctx = createContext(emptyDiagnostic);
			expect(() => {
				ctx.register("climat", "nj", () =>
					ctx.register("climat", "nj", () => calcule_nj()),
				);
			}).toThrow("[Context] Cycle détecté");
		});

		it("ne fausse pas la détection de cycle après une résolution normale", () => {
			const ctx = createContext(emptyDiagnostic);
			ctx.register("climat", "nj", () => calcule_nj()); // résolution normale
			// Un second appel doit lire le cache, sans déclencher de cycle
			expect(() =>
				ctx.register("climat", "nj", () => calcule_nj()),
			).not.toThrow();
		});
	});

	describe("once", () => {
		it("appelle fn et retourne son résultat", () => {
			const ctx = createContext(emptyDiagnostic);
			const result = ctx.once("climat", "nj", () => 42);
			expect(result).toBe(42);
		});

		it("n'appelle fn qu'une seule fois pour la même clé", () => {
			const ctx = createContext(emptyDiagnostic);
			let calls = 0;
			const fn = () => { calls++; return 42; };
			ctx.once("climat", "nj", fn);
			ctx.once("climat", "nj", fn);
			expect(calls).toBe(1);
		});

		it("distingue deux items différents sous la même clé", () => {
			const ctx = createContext(emptyDiagnostic);
			let calls = 0;
			const fn = () => { calls++; return 42; };
			ctx.once("climat", "nj", { id: "a" }, fn);
			ctx.once("climat", "nj", { id: "a" }, fn); // cache hit
			ctx.once("climat", "nj", { id: "b" }, fn); // nouvelle entrée
			expect(calls).toBe(2);
		});
	});

	describe("once et register partagent le même cache", () => {
		it("register retourne la valeur mise en cache par once sans appeler son thunk", () => {
			const ctx = createContext(emptyDiagnostic);
			const value = calcule_nj();
			let registerCalled = 0;
			ctx.once("climat", "nj", () => value);
			ctx.register("climat", "nj", () => { registerCalled++; return calcule_nj(); });
			expect(registerCalled).toBe(0);
		});
	});

	describe("resolve", () => {
		it("délègue à la règle du registre et retourne son résultat", () => {
			const ctx = createContext(emptyDiagnostic);
			const result = ctx.resolve("climat", "nj");
			// nj retourne 31 jours en janvier
			expect(result["01"]).toBe(31);
		});

		it("retourne la même référence en cache lors d'un second appel", () => {
			const ctx = createContext(emptyDiagnostic);
			const r1 = ctx.resolve("climat", "nj");
			const r2 = ctx.resolve("climat", "nj");
			// La règle nj utilise ctx.register en interne → cache partagé
			expect(r1).toBe(r2);
		});

		it("chaque contexte dispose d'un cache indépendant", () => {
			const ctx1 = createContext(emptyDiagnostic);
			const ctx2 = createContext(emptyDiagnostic);
			const r1 = ctx1.resolve("climat", "nj");
			const r2 = ctx2.resolve("climat", "nj");
			expect(r1).not.toBe(r2);  // références distinctes
			expect(r1).toEqual(r2);   // valeurs identiques
		});

		it("la règle reçoit le bon contexte (cache accessible après resolve)", () => {
			const ctx = createContext(emptyDiagnostic);
			ctx.resolve("climat", "nj"); // nj appelle ctx.register en interne
			let thunkCalled = false;
			// Le cache de ctx contient déjà "climat:nj" — le thunk ne doit pas s'exécuter
			ctx.register("climat", "nj", () => { thunkCalled = true; return calcule_nj(); });
			expect(thunkCalled).toBe(false);
		});
	});
});
