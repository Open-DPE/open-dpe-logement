import { describe, expect, it } from "vitest";
import { LocalNonChauffe } from "../../src/enveloppe/local-non-chauffe/index.js";

/**
 * L'ancienne implémentation distinguait deux types (`EspaceTamponSolarise`,
 * exigeant des baies, et `AutreLocalNonChauffe`, exigeant des parois) via des
 * discriminateurs `isEspaceTamponSolarise`/`isAutreLocalNonChauffe`. Le schéma
 * actuel (`local-non-chauffe.yaml`) n'exprime plus cette dépendance à `type` :
 * son `anyOf` exige seulement au moins une paroi OU une baie, quel que soit le
 * type — cf. le point de vigilance dans `src/enveloppe/local-non-chauffe/types.ts`.
 * Ces tests valident donc la contrainte réellement portée par le schéma
 * aujourd'hui (via `.safeParse`), et non plus l'ancienne règle par type.
 */

const ESPACE_TAMPON = {
	id: "550e8400-e29b-41d4-a716-446655440000",
	description: "Véranda",
	type: "espace_tampon_solarise" as const,
	parois: [],
	baies: [
		{
			id: "550e8400-e29b-41d4-a716-446655440001",
			description: "Fenêtre véranda",
			type_vitrage: "double_vitrage" as const,
			materiau_menuiserie: "pvc" as const,
			presence_rupteur_pont_thermique: null,
			position: {
				mitoyennete: "exterieur" as const,
				surface: 2,
				orientation: "sud" as const,
				inclinaison: 90,
			},
		},
	],
};

const GARAGE = {
	id: "550e8400-e29b-41d4-a716-446655440000",
	description: "Garage attenant",
	type: "garage" as const,
	parois: [
		{
			id: "550e8400-e29b-41d4-a716-446655440001",
			description: "Paroi extérieure",
			isolation: null,
			position: { mitoyennete: "exterieur" as const, surface: 10 },
		},
	],
	baies: [],
};

const VIDE = {
	id: "550e8400-e29b-41d4-a716-446655440002",
	description: "Local sans parois ni baies",
	type: "garage" as const,
	parois: [],
	baies: [],
};

describe("LocalNonChauffe — contrainte anyOf (au moins une paroi ou une baie)", () => {
	it("accepte un local avec seulement des baies, quel que soit son type", () => {
		expect(LocalNonChauffe.safeParse(ESPACE_TAMPON).success).toBe(true);
	});

	it("accepte un local avec seulement des parois, quel que soit son type", () => {
		expect(LocalNonChauffe.safeParse(GARAGE).success).toBe(true);
	});

	it("rejette un local sans parois ni baies", () => {
		expect(LocalNonChauffe.safeParse(VIDE).success).toBe(false);
	});
});
