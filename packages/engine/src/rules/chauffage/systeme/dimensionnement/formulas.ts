import * as models from "@open-dpe-logement/models";
import type * as generateur from "../../generateur/formulas.js";
import * as utils from "./utils.js";

export const ROLES = {
	base: "base",
	releve: "releve",
	appoint: "appoint",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export type Configuration = {
	[ROLES.base]: number;
	[ROLES.releve]: number;
	[ROLES.appoint]: number;
};

export type ConfigurationSystemeProps = {
	type_systeme: models.chauffage.TypeChauffage;
	type_generateur: ReturnType<typeof generateur.set_type_generateur>;
	energie_generateur: ReturnType<typeof generateur.set_energie_generateur>;
	bienergie_generateur: models.chauffage.generateur.Bienergie | null;
	generateur_multi_batiment: boolean;
	generateur_collectif: boolean;
	pn_saisi: number | null;
	role?: ReturnType<typeof calcule_role>;
};

/**
 * @formule chauffage.systeme.rdim
 * @returns Ratio de dimensionnement du système de chauffage
 */
export function calcule_rdim(props: {
	systeme: Required<ConfigurationSystemeProps>;
	systemes: Required<ConfigurationSystemeProps>[];
}): number {
	const systeme = props.systeme;
	const systemes = props.systemes.filter(
		(s) => s.generateur_collectif === systeme.generateur_collectif,
	);

	const configuration = calcule_configuration({
		systemes: [...systemes, systeme],
	});
	const systemes_role = systemes.filter((s) => s.role === systeme.role);
	const rdim = configuration[systeme.role];

	// Les puissances nominales sont connues pour tous les systèmes
	if (
		systemes_role.every((s) => s.pn_saisi !== null) &&
		systeme.pn_saisi !== null
	) {
		const somme_pn =
			systemes_role.reduce((acc, s) => acc + (s.pn_saisi ?? 0), 0) +
			systeme.pn_saisi;
		return rdim * (systeme.pn_saisi / somme_pn);
	}
	const n = systemes_role.length + 1;
	return rdim * (1 / n);
}

/**
 * @formule chauffage.systeme.role
 * @returns Rôle du système de chauffage (base, relève ou appoint)
 */
export function calcule_role(props: {
	systemes: ConfigurationSystemeProps[];
	systeme: ConfigurationSystemeProps;
}): Role {
	const systeme = props.systeme;
	const systemes = props.systemes.filter(
		(s) => s.generateur_collectif === systeme.generateur_collectif,
	);
	const { base, releve, appoint } = calcule_configuration({
		systemes: [...systemes, systeme],
	});

	if (base === 1 || (releve === 0 && appoint === 0)) return ROLES.base;
	if (appoint > 0 && utils.is_appoint({ systemes, systeme }))
		return ROLES.appoint;
	if (releve > 0 && utils.is_releve({ systemes, systeme })) return ROLES.releve;
	// Système en base
	return ROLES.base;
}

/**
 * @formule chauffage.systeme.role
 * @param props.systemes : Systèmes de chauffage individuels OU collectifs associés à l'installation
 * @returns Configuration de l'installation de chauffage
 */
export function calcule_configuration(props: {
	systemes: ConfigurationSystemeProps[];
}): Configuration {
	const { systemes } = props;

	if (systemes.length <= 1) return { base: 1, releve: 0, appoint: 0 };

	const appoint = utils.has_appoint(systemes) ? 0.25 : 0;
	const releve = utils.has_releve_chaudieres_bois(systemes)
		? 0.25 * (1 - appoint)
		: utils.has_releve_pac(systemes)
			? 0.2 * (1 - appoint)
			: 0;

	const base = 1 - appoint - releve;
	return { base, releve, appoint };
}
