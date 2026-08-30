import * as models from "@open-dpe-logement/models";

type Systeme = {
	type_systeme: models.chauffage.TypeChauffageEnum;
	type_generateur: models.chauffage.generateur.TypeGenerateurEnum;
	energie_generateur: models.chauffage.generateur.EnergieChauffageEnum;
	bienergie_generateur: models.chauffage.generateur.BienergieEnum | null;
	generateur_multi_batiment: boolean;
};

const TYPES_CHAUFFAGE = models.chauffage.TYPES_CHAUFFAGE;
const TYPES_GENERATEUR = models.chauffage.generateur.TYPES_GENERATEUR;

export function filter_chaudieres_bois<T extends Systeme>(systemes: T[]): T[] {
	return systemes.filter((s) => is_chaudiere_bois(s));
}

export function filter_chaudieres<T extends Systeme>(systemes: T[]): T[] {
	return systemes.filter((s) => is_chaudiere(s));
}

export function filter_pacs<T extends Systeme>(systemes: T[]): T[] {
	return systemes.filter((s) => is_pac(s));
}

export function filter_bases<T extends Systeme>(systemes: T[]): T[] {
	return systemes.filter(
		(s) =>
			!is_releve({ systemes, systeme: s }) &&
			!is_appoint({ systemes, systeme: s }),
	);
}

export function filter_releves<T extends Systeme>(systemes: T[]): T[] {
	return systemes.filter((s, k) =>
		is_releve({
			systemes: systemes.filter((_, i) => i !== k),
			systeme: s,
		}),
	);
}

export function filter_appoints<T extends Systeme>(systemes: T[]): T[] {
	return systemes.filter((s, k) =>
		is_appoint({
			systemes: systemes.filter((_, i) => i !== k),
			systeme: s,
		}),
	);
}

export function has_systeme_central(systemes: Systeme[]): boolean {
	return systemes.some((s) => is_systeme_central(s));
}

export function has_chaudiere_bois(systemes: Systeme[]): boolean {
	return systemes.some((s) => is_chaudiere_bois(s));
}

export function has_chaudiere(systemes: Systeme[]): boolean {
	return systemes.some((s) => is_chaudiere(s));
}

export function has_pac(systemes: Systeme[]): boolean {
	return systemes.some((s) => is_pac(s));
}

export function has_releve(systemes: Systeme[]): boolean {
	return filter_releves(systemes).length > 0;
}

export function has_releve_chaudieres_bois(systemes: Systeme[]): boolean {
	return systemes.some((s, k) =>
		is_releve_chaudieres_bois({
			systemes: systemes.filter((_, i) => i !== k),
			systeme: s,
		}),
	);
}

export function has_releve_pac(systemes: Systeme[]): boolean {
	return systemes.some((s, k) =>
		is_releve_pac({
			systemes: systemes.filter((_, i) => i !== k),
			systeme: s,
		}),
	);
}

export function has_appoint(systemes: Systeme[]): boolean {
	return systemes.some((s, k) =>
		is_appoint({
			systemes: systemes.filter((_, i) => i !== k),
			systeme: s,
		}),
	);
}

export function is_systeme_central(systeme: Systeme): boolean {
	return systeme.type_systeme === TYPES_CHAUFFAGE.central;
}

export function is_systeme_divise(systeme: Systeme): boolean {
	return systeme.type_systeme === TYPES_CHAUFFAGE.divise;
}

export function is_chaudiere_bois(systeme: Systeme): boolean {
	return (
		is_systeme_central(systeme) &&
		systeme.type_generateur === TYPES_GENERATEUR.chaudiere &&
		models.common.isBois(systeme.energie_generateur)
	);
}

export function is_chaudiere(systeme: Systeme): boolean {
	return (
		is_systeme_central(systeme) &&
		systeme.type_generateur === TYPES_GENERATEUR.chaudiere &&
		false === models.common.isBois(systeme.energie_generateur)
	);
}

export function is_pac(systeme: Systeme): boolean {
	return (
		(is_systeme_central(systeme) &&
			systeme.type_generateur === TYPES_GENERATEUR.pac_air_air) ||
		systeme.type_generateur === TYPES_GENERATEUR.pac_air_eau ||
		systeme.type_generateur === TYPES_GENERATEUR.pac_eau_eau ||
		systeme.type_generateur === TYPES_GENERATEUR.pac_eau_glycolee_eau ||
		systeme.type_generateur === TYPES_GENERATEUR.pac_geothermique
	);
}

export function is_releve(props: {
	systemes: Systeme[];
	systeme: Systeme;
}): boolean {
	return is_releve_chaudieres_bois(props) || is_releve_pac(props);
}

/**
 * Le système est en relève d'une chaudière à bois si :
 * - Le système est une PAC ou une chaudière
 * - Il existe au moins une chaudière à bois dans les systèmes
 * - Tous les systèmes sont des PAC, des chaudières ou des chaudières à bois
 */
export function is_releve_chaudieres_bois(props: {
	systemes: Systeme[];
	systeme: Systeme;
}): boolean {
	if (!is_systeme_central(props.systeme)) return false;
	if (!is_pac(props.systeme) && !is_chaudiere(props.systeme)) return false;

	const { systemes } = props;
	const chaudieres_bois = systemes.filter((s) => is_chaudiere_bois(s));
	const chaudieres = systemes.filter((s) => is_chaudiere(s));
	const pacs = systemes.filter((s) => is_pac(s));

	if (chaudieres_bois.length === 0) return false;

	const scope = [...chaudieres_bois, ...chaudieres, ...pacs];
	return scope.length === systemes.length;
}

/**
 * Le système est en relève d'une PAC si :
 * - Le système est une chaudière
 * - Il existe au moins une PAC dans les systèmes
 * - Tous les systèmes sont des PAC et des chaudières
 */
export function is_releve_pac(props: {
	systemes: Systeme[];
	systeme: Systeme;
}): boolean {
	if (!is_systeme_central(props.systeme)) return false;
	if (!is_chaudiere(props.systeme)) return false;

	const { systemes, systeme } = props;
	const chaudieres = systemes.filter((s) => is_chaudiere(s));
	const pacs = systemes.filter((s) => is_pac(s));
	const scope = [...chaudieres, ...pacs];

	if (scope.length === 0) return false;
	if (scope.length < systemes.length) return false;
	if (is_chaudiere(systeme)) return pacs.length > 0;

	return false;
}

export function is_appoint(props: {
	systemes: Systeme[];
	systeme: Systeme;
}): boolean {
	return (
		props.systemes.some((s) => is_systeme_central(s)) &&
		false === is_systeme_central(props.systeme)
	);
}
