import { describe, expect, it } from "vitest";
import {
	Ventilation,
	VentilationData,
	VentilationWithData,
	findInstallation,
} from "../../src/ventilation/index.js";
import { EntityNotFoundError } from "../../src/errors.js";
import {
	isInstallation,
	isVentilationNaturelle,
	isVentilationMecanique,
	isVentilationVMCDoubleFlux,
	isVentilationPuitClimatique,
	isVentilationMecaniqueAutres,
	isTypeVentilationNaturelle,
	isTypeVentilationMecanique,
	isTypeVentilationHybride,
	Installation,
	InstallationNaturelle,
	InstallationMecanique,
	InstallationVMCDoubleFlux,
	InstallationPuitClimatique,
	InstallationMecaniqueAutres,
	InstallationData,
	InstallationWithData,
} from "../../src/ventilation/installation/index.js";

// ===========================================================================
// Fixtures — une par branche de l'union `Installation`
// ===========================================================================

const INSTALLATION_NATURELLE: InstallationNaturelle = {
	id: "550e8400-e29b-41d4-a716-446655440301",
	description: "Ventilation naturelle par conduits",
	surface: 70,
	type: "ventilation_naturelle_conduit",
	annee_installation: null,
	installation_collective: null,
	presence_echangeur_thermique: null,
};

const INSTALLATION_VMC_DOUBLE_FLUX: InstallationVMCDoubleFlux = {
	id: "550e8400-e29b-41d4-a716-446655440302",
	description: "VMC double flux",
	surface: 90,
	type: "vmc_double_flux",
	annee_installation: 2018,
	installation_collective: false,
	presence_echangeur_thermique: true,
};

const INSTALLATION_PUIT_CLIMATIQUE: InstallationPuitClimatique = {
	id: "550e8400-e29b-41d4-a716-446655440303",
	description: "Puits climatique",
	surface: 40,
	type: "puit_climatique",
	annee_installation: 2019,
	installation_collective: true,
	presence_echangeur_thermique: null,
};

const INSTALLATION_MECANIQUE_AUTRES: InstallationMecaniqueAutres = {
	id: "550e8400-e29b-41d4-a716-446655440304",
	description: "VMC simple flux hygroréglable A",
	surface: 85,
	type: "vmc_simple_flux_hygroreglable_a",
	annee_installation: 2017,
	installation_collective: null,
	presence_echangeur_thermique: null,
};

const INSTALLATION_HYBRIDE: InstallationMecaniqueAutres = {
	id: "550e8400-e29b-41d4-a716-446655440305",
	description: "Ventilation hybride avec entrées d'air hygroréglables",
	surface: 88,
	type: "ventilation_hybride_entrees_air_hygroreglables",
	annee_installation: 2021,
	installation_collective: false,
	presence_echangeur_thermique: null,
};

const VENTILATION: Ventilation = {
	installations: [INSTALLATION_NATURELLE, INSTALLATION_VMC_DOUBLE_FLUX],
};

const VENTILATION_DATA: VentilationData = {
	qvarep_conv: 0,
	qvasouf_conv: 12.5,
	smea_conv: 3.2,
};

const INSTALLATION_DATA: InstallationData = {
	rdim: 0,
	pvent_moy: 15,
	hvent: 8760,
	qvarep_conv: 0,
	qvasouf_conv: 5,
	smea_conv: 1.2,
	consommations: {
		auxiliaire: {
			electricite: { cef: 10, cep: 23, eges: 0.5 },
		},
	},
};

// ===========================================================================
// Installation — chaque branche de l'union valide (safeParse)
// ===========================================================================

describe("Installation — chaque branche de l'union valide (safeParse)", () => {
	it.each([
		["InstallationNaturelle", InstallationNaturelle, INSTALLATION_NATURELLE],
		[
			"InstallationVMCDoubleFlux",
			InstallationVMCDoubleFlux,
			INSTALLATION_VMC_DOUBLE_FLUX,
		],
		[
			"InstallationPuitClimatique",
			InstallationPuitClimatique,
			INSTALLATION_PUIT_CLIMATIQUE,
		],
		[
			"InstallationMecaniqueAutres",
			InstallationMecaniqueAutres,
			INSTALLATION_MECANIQUE_AUTRES,
		],
		[
			"InstallationMecaniqueAutres (hybride)",
			InstallationMecaniqueAutres,
			INSTALLATION_HYBRIDE,
		],
	] as const)("%s", (_label, schema, fixture) => {
		expect(schema.safeParse(fixture).success).toBe(true);
		expect(Installation.safeParse(fixture).success).toBe(true);
	});
});

describe("InstallationMecanique — chaque branche mécanique valide aussi l'union InstallationMecanique", () => {
	it.each([
		[
			"InstallationVMCDoubleFlux",
			InstallationVMCDoubleFlux,
			INSTALLATION_VMC_DOUBLE_FLUX,
		],
		[
			"InstallationPuitClimatique",
			InstallationPuitClimatique,
			INSTALLATION_PUIT_CLIMATIQUE,
		],
		[
			"InstallationMecaniqueAutres",
			InstallationMecaniqueAutres,
			INSTALLATION_MECANIQUE_AUTRES,
		],
	] as const)("%s", (_label, schema, fixture) => {
		expect(schema.safeParse(fixture).success).toBe(true);
		expect(InstallationMecanique.safeParse(fixture).success).toBe(true);
	});

	it("une InstallationNaturelle est rejetée par l'union InstallationMecanique", () => {
		expect(
			InstallationMecanique.safeParse(INSTALLATION_NATURELLE).success,
		).toBe(false);
	});
});

// ===========================================================================
// Guards
// ===========================================================================

describe("Guards de type (TypeVentilationEnum)", () => {
	it("isTypeVentilationNaturelle reconnaît les 4 types naturels", () => {
		expect(isTypeVentilationNaturelle("ventilation_ouverture_fenetres")).toBe(
			true,
		);
		expect(
			isTypeVentilationNaturelle("ventilation_entrees_air_hautes_basses"),
		).toBe(true);
		expect(
			isTypeVentilationNaturelle(
				"ventilation_naturelle_conduit_entrees_air_hygroreglables",
			),
		).toBe(true);
		expect(isTypeVentilationNaturelle("ventilation_naturelle_conduit")).toBe(
			true,
		);
		expect(isTypeVentilationNaturelle("vmc_double_flux")).toBe(false);
	});

	it("isTypeVentilationMecanique est l'exacte négation de isTypeVentilationNaturelle", () => {
		expect(isTypeVentilationMecanique("vmc_double_flux")).toBe(true);
		expect(isTypeVentilationMecanique("puit_climatique")).toBe(true);
		expect(isTypeVentilationMecanique("ventilation_naturelle_conduit")).toBe(
			false,
		);
	});

	it("isTypeVentilationHybride ne reconnaît que les 2 types hybrides", () => {
		expect(isTypeVentilationHybride("ventilation_hybride")).toBe(true);
		expect(
			isTypeVentilationHybride(
				"ventilation_hybride_entrees_air_hygroreglables",
			),
		).toBe(true);
		expect(isTypeVentilationHybride("vmc_double_flux")).toBe(false);
		expect(isTypeVentilationHybride("ventilation_naturelle_conduit")).toBe(
			false,
		);
	});
});

describe("Guards d'installation — discriminent les branches entre elles", () => {
	it("isVentilationNaturelle / isVentilationMecanique se partitionnent exactement", () => {
		expect(isVentilationNaturelle(INSTALLATION_NATURELLE)).toBe(true);
		expect(isVentilationMecanique(INSTALLATION_NATURELLE)).toBe(false);

		expect(isVentilationMecanique(INSTALLATION_VMC_DOUBLE_FLUX)).toBe(true);
		expect(isVentilationNaturelle(INSTALLATION_VMC_DOUBLE_FLUX)).toBe(false);

		expect(isVentilationMecanique(INSTALLATION_PUIT_CLIMATIQUE)).toBe(true);
		expect(isVentilationMecanique(INSTALLATION_MECANIQUE_AUTRES)).toBe(true);
	});

	it("isVentilationVMCDoubleFlux / isVentilationPuitClimatique / isVentilationMecaniqueAutres se distinguent par le type", () => {
		expect(isVentilationVMCDoubleFlux(INSTALLATION_VMC_DOUBLE_FLUX)).toBe(
			true,
		);
		expect(isVentilationVMCDoubleFlux(INSTALLATION_PUIT_CLIMATIQUE)).toBe(
			false,
		);
		expect(isVentilationVMCDoubleFlux(INSTALLATION_MECANIQUE_AUTRES)).toBe(
			false,
		);

		expect(isVentilationPuitClimatique(INSTALLATION_PUIT_CLIMATIQUE)).toBe(
			true,
		);
		expect(isVentilationPuitClimatique(INSTALLATION_VMC_DOUBLE_FLUX)).toBe(
			false,
		);

		expect(
			isVentilationMecaniqueAutres(INSTALLATION_MECANIQUE_AUTRES),
		).toBe(true);
		expect(isVentilationMecaniqueAutres(INSTALLATION_VMC_DOUBLE_FLUX)).toBe(
			false,
		);
		expect(isVentilationMecaniqueAutres(INSTALLATION_PUIT_CLIMATIQUE)).toBe(
			false,
		);
		expect(isVentilationMecaniqueAutres(INSTALLATION_HYBRIDE)).toBe(true);
	});

	it("isInstallation est vrai pour toutes les branches (naturelle ou mécanique)", () => {
		expect(isInstallation(INSTALLATION_NATURELLE)).toBe(true);
		expect(isInstallation(INSTALLATION_VMC_DOUBLE_FLUX)).toBe(true);
		expect(isInstallation(INSTALLATION_PUIT_CLIMATIQUE)).toBe(true);
		expect(isInstallation(INSTALLATION_MECANIQUE_AUTRES)).toBe(true);
	});
});

// ===========================================================================
// Contraintes de type par branche (extract / exclude sur TypeVentilationEnum)
// ===========================================================================

describe("Régression — chaque branche restreint `type` à son propre sous-ensemble", () => {
	it.each([
		[
			"InstallationNaturelle rejette un type mécanique (vmc_double_flux)",
			InstallationNaturelle,
			INSTALLATION_NATURELLE,
			"vmc_double_flux",
		],
		[
			"InstallationVMCDoubleFlux rejette puit_climatique",
			InstallationVMCDoubleFlux,
			INSTALLATION_VMC_DOUBLE_FLUX,
			"puit_climatique",
		],
		[
			"InstallationPuitClimatique rejette vmc_double_flux",
			InstallationPuitClimatique,
			INSTALLATION_PUIT_CLIMATIQUE,
			"vmc_double_flux",
		],
		[
			"InstallationMecaniqueAutres rejette vmc_double_flux (exclu explicitement)",
			InstallationMecaniqueAutres,
			INSTALLATION_MECANIQUE_AUTRES,
			"vmc_double_flux",
		],
		[
			"InstallationMecaniqueAutres rejette puit_climatique (exclu explicitement)",
			InstallationMecaniqueAutres,
			INSTALLATION_MECANIQUE_AUTRES,
			"puit_climatique",
		],
		[
			"InstallationMecaniqueAutres rejette un type naturel",
			InstallationMecaniqueAutres,
			INSTALLATION_MECANIQUE_AUTRES,
			"ventilation_naturelle_conduit",
		],
	] as const)("%s", (_label, schema, fixture, badType) => {
		const invalide = { ...fixture, type: badType };
		expect(schema.safeParse(invalide).success).toBe(false);
	});
});

// ===========================================================================
// Régression — champs forcés à non_applicable (le plus important)
// ===========================================================================

describe("Régression — InstallationNaturelle force annee_installation / installation_collective / presence_echangeur_thermique à non_applicable", () => {
	it("accepte la version valide (pas de faux positif)", () => {
		expect(
			InstallationNaturelle.safeParse(INSTALLATION_NATURELLE).success,
		).toBe(true);
	});

	it("rejette annee_installation renseignée", () => {
		const invalide = { ...INSTALLATION_NATURELLE, annee_installation: 2010 };
		expect(InstallationNaturelle.safeParse(invalide).success).toBe(false);
	});

	it("rejette installation_collective renseigné", () => {
		const invalide = {
			...INSTALLATION_NATURELLE,
			installation_collective: false,
		};
		expect(InstallationNaturelle.safeParse(invalide).success).toBe(false);
	});

	it("rejette presence_echangeur_thermique renseigné", () => {
		const invalide = {
			...INSTALLATION_NATURELLE,
			presence_echangeur_thermique: true,
		};
		expect(InstallationNaturelle.safeParse(invalide).success).toBe(false);
	});
});

describe("Régression — InstallationMecaniqueAutres force presence_echangeur_thermique à non_applicable", () => {
	it("accepte la version valide (pas de faux positif)", () => {
		expect(
			InstallationMecaniqueAutres.safeParse(INSTALLATION_MECANIQUE_AUTRES)
				.success,
		).toBe(true);
	});

	it("rejette presence_echangeur_thermique renseigné", () => {
		const invalide = {
			...INSTALLATION_MECANIQUE_AUTRES,
			presence_echangeur_thermique: true,
		};
		expect(InstallationMecaniqueAutres.safeParse(invalide).success).toBe(
			false,
		);
	});
});

describe("Point de vigilance schéma — presence_echangeur_thermique reste un booléen réel (non forcé) sur VMCDoubleFlux et PuitClimatique", () => {
	// Contrairement à InstallationMecaniqueAutres, ces deux branches n'étendent
	// pas `presence_echangeur_thermique` en non_applicable : elles héritent tel
	// quel le champ optionnel de InstallationBase (`z.boolean().nullable()`).
	// C'est cohérent avec le métier (une VMC double flux ou un puits climatique
	// peuvent effectivement comporter un échangeur thermique), donc ce n'est
	// pas traité comme un bug — ce test documente et verrouille ce choix.
	it("InstallationVMCDoubleFlux accepte presence_echangeur_thermique: true et null", () => {
		expect(
			InstallationVMCDoubleFlux.safeParse(INSTALLATION_VMC_DOUBLE_FLUX)
				.success,
		).toBe(true);
		expect(
			InstallationVMCDoubleFlux.safeParse({
				...INSTALLATION_VMC_DOUBLE_FLUX,
				presence_echangeur_thermique: null,
			}).success,
		).toBe(true);
	});

	it("InstallationPuitClimatique accepte presence_echangeur_thermique: true et null", () => {
		expect(
			InstallationPuitClimatique.safeParse({
				...INSTALLATION_PUIT_CLIMATIQUE,
				presence_echangeur_thermique: true,
			}).success,
		).toBe(true);
		expect(
			InstallationPuitClimatique.safeParse(INSTALLATION_PUIT_CLIMATIQUE)
				.success,
		).toBe(true);
	});
});

describe("Régression — InstallationVMCDoubleFlux / InstallationPuitClimatique exigent installation_collective réel (non nullable)", () => {
	it("InstallationVMCDoubleFlux rejette installation_collective: null", () => {
		const invalide = {
			...INSTALLATION_VMC_DOUBLE_FLUX,
			installation_collective: null,
		};
		expect(InstallationVMCDoubleFlux.safeParse(invalide).success).toBe(
			false,
		);
	});

	it("InstallationVMCDoubleFlux accepte true et false", () => {
		expect(
			InstallationVMCDoubleFlux.safeParse({
				...INSTALLATION_VMC_DOUBLE_FLUX,
				installation_collective: true,
			}).success,
		).toBe(true);
		expect(
			InstallationVMCDoubleFlux.safeParse({
				...INSTALLATION_VMC_DOUBLE_FLUX,
				installation_collective: false,
			}).success,
		).toBe(true);
	});

	it("InstallationPuitClimatique rejette installation_collective: null", () => {
		const invalide = {
			...INSTALLATION_PUIT_CLIMATIQUE,
			installation_collective: null,
		};
		expect(InstallationPuitClimatique.safeParse(invalide).success).toBe(
			false,
		);
	});

	it("InstallationMecaniqueAutres, elle, accepte installation_collective: null (hérité, pas de restriction à ce niveau)", () => {
		expect(
			InstallationMecaniqueAutres.safeParse({
				...INSTALLATION_MECANIQUE_AUTRES,
				installation_collective: null,
			}).success,
		).toBe(true);
	});
});

// ===========================================================================
// Cardinalité — Ventilation.installations exige au moins 1 installation
// ===========================================================================

describe("Régression — Ventilation.installations (min 1)", () => {
	it("rejette un tableau vide", () => {
		expect(Ventilation.safeParse({ installations: [] }).success).toBe(false);
	});

	it("accepte un tableau d'une seule installation", () => {
		expect(
			Ventilation.safeParse({ installations: [INSTALLATION_NATURELLE] })
				.success,
		).toBe(true);
	});

	it("accepte la fixture complète (plusieurs installations)", () => {
		expect(Ventilation.safeParse(VENTILATION).success).toBe(true);
	});
});

// ===========================================================================
// Bornes numériques — VentilationData / InstallationData (min 0)
// ===========================================================================

describe("Régression — VentilationData, tous les champs sont bornés à min(0)", () => {
	it.each([
		"qvarep_conv",
		"qvasouf_conv",
		"smea_conv",
	] as const)("%s accepte 0 et rejette une valeur négative", (champ) => {
		expect(
			VentilationData.safeParse({ ...VENTILATION_DATA, [champ]: 0 }).success,
		).toBe(true);
		expect(
			VentilationData.safeParse({ ...VENTILATION_DATA, [champ]: -0.01 })
				.success,
		).toBe(false);
	});
});

describe("Régression — InstallationData, tous les champs numériques sont bornés à min(0)", () => {
	it.each([
		"rdim",
		"pvent_moy",
		"hvent",
		"qvarep_conv",
		"qvasouf_conv",
		"smea_conv",
	] as const)("%s accepte 0 et rejette une valeur négative", (champ) => {
		expect(
			InstallationData.safeParse({ ...INSTALLATION_DATA, [champ]: 0 })
				.success,
		).toBe(true);
		expect(
			InstallationData.safeParse({ ...INSTALLATION_DATA, [champ]: -0.01 })
				.success,
		).toBe(false);
	});
});

// ===========================================================================
// InstallationWithData / VentilationWithData — intersection avec `data`
// ===========================================================================

describe("InstallationWithData — intersection Installation & { data: InstallationData }", () => {
	it("valide une InstallationVMCDoubleFlux enrichie de `data`", () => {
		const fixture: InstallationWithData = {
			...INSTALLATION_VMC_DOUBLE_FLUX,
			data: INSTALLATION_DATA,
		};
		const result = InstallationWithData.safeParse(fixture);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.data).toEqual(INSTALLATION_DATA);
			expect(result.data.type).toBe("vmc_double_flux");
		}
	});

	it("rejette une installation sans `data`", () => {
		expect(
			InstallationWithData.safeParse(INSTALLATION_VMC_DOUBLE_FLUX).success,
		).toBe(false);
	});

	it("rejette une InstallationNaturelle enrichie de `data` mais avec un champ non_applicable violé", () => {
		const invalide = {
			...INSTALLATION_NATURELLE,
			installation_collective: true,
			data: INSTALLATION_DATA,
		};
		expect(InstallationWithData.safeParse(invalide).success).toBe(false);
	});
});

describe("VentilationWithData — intersection Ventilation & { data: VentilationData, installations: InstallationWithData[] }", () => {
	it("valide une Ventilation dont toutes les installations portent `data`", () => {
		const fixture: VentilationWithData = {
			installations: [
				{ ...INSTALLATION_VMC_DOUBLE_FLUX, data: INSTALLATION_DATA },
			],
			data: VENTILATION_DATA,
		};
		expect(VentilationWithData.safeParse(fixture).success).toBe(true);
	});

	it("rejette si une installation du tableau n'a pas de `data`", () => {
		const invalide = {
			installations: [INSTALLATION_VMC_DOUBLE_FLUX],
			data: VENTILATION_DATA,
		};
		expect(VentilationWithData.safeParse(invalide).success).toBe(false);
	});

	it("rejette un tableau d'installations vide, même avec `data`", () => {
		const invalide = { installations: [], data: VENTILATION_DATA };
		expect(VentilationWithData.safeParse(invalide).success).toBe(false);
	});
});

// ===========================================================================
// Helpers — findInstallation
// ===========================================================================

describe("findInstallation", () => {
	it("retrouve l'installation par id", () => {
		expect(findInstallation(INSTALLATION_VMC_DOUBLE_FLUX.id, VENTILATION)).toBe(
			INSTALLATION_VMC_DOUBLE_FLUX,
		);
	});

	it("lève EntityNotFoundError si l'id est absent", () => {
		expect(() => findInstallation("inconnu", VENTILATION)).toThrow(
			EntityNotFoundError,
		);
		expect(() => findInstallation("inconnu", VENTILATION)).toThrow(
			"Installation with id inconnu not found",
		);
	});
});
