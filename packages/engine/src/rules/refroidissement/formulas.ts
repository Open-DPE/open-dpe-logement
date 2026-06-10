import * as models from "@open-dpe-logement/models";
import * as batiment from "#rules/batiment/formulas.js";
import * as climat from "#rules/climat/formulas.js";
import * as ecs from "#rules/ecs/formulas.js";
import * as enveloppe from "#rules/enveloppe/formulas.js";
import * as generateur from "#rules/refroidissement/generateur/formulas.js";
import { createParMois } from "#utils/helpers.js";

/**
 * @formule refroidissement.cef
 * @formule refroidissement.cep
 * @formule refroidissement.eges
 * @return Consommations par usage et par énergie
 */
export function calcule_consommations(props: {
	consommations: ReturnType<typeof generateur.calcule_consommations>[];
}): models.common.Consommations {
	return models.common.mergeConsommations(...props.consommations);
}

/**
 * @formule refroidissement.cfr
 * @return Consommations des générateurs de refroidissement en kWh/an
 */
export function calcule_cfr(props: {
	cfr: ReturnType<typeof generateur.calcule_cfr>[];
}): number {
	return props.cfr.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule refroidissement.cfr_elec
 * @return Consommation d'électricité de refroidissement en kWh/an
 */
export function calcule_cfr_elec(props: {
	cfr_elec: ReturnType<typeof generateur.calcule_cfr_elec>[];
}): number {
	return props.cfr_elec.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule refroidissement.caux
 * @return Consommations des auxiliaires de refroidissement en kWh/an
 */
export function calcule_caux(props: {
	caux: ReturnType<typeof generateur.calcule_caux>[];
}): number {
	return props.caux.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule refroidissement.bfr
 * @returns Besoins de refroidissement en kWh/mois
 */
export function calcule_bfr(props: {
	gv: ReturnType<typeof enveloppe.calcule_gv>;
	tint: ReturnType<typeof calcule_tint>;
	as: ReturnType<typeof calcule_as>;
	ai: ReturnType<typeof calcule_ai>;
	fut: ReturnType<typeof calcule_fut>;
	rbth: ReturnType<typeof calcule_rbth>;
	textmoy: ReturnType<typeof calcule_textmoy>;
	nref: ReturnType<typeof calcule_nref>;
}): models.common.ParMois<number> {
	const { gv, tint } = props;
	return createParMois((mois: models.common.Mois) => {
		const rbth = props.rbth[mois];
		const as = props.as[mois];
		const ai = props.ai[mois];
		const fut = props.fut[mois];
		const textmoy = props.textmoy[mois];
		const nref = props.nref[mois];

		if (1 / 2 > rbth) return 0;
		if (textmoy === null) return 0;
		return (as + ai) / 1000 - fut * (gv / 1000) * (textmoy - tint) * nref;
	});
}

/**
 * @formule refroidissement.fut
 * @returns Facteur d'utilisation des apports pour le mois
 */
export function calcule_fut(props: {
	rbth: ReturnType<typeof calcule_rbth>;
	t: ReturnType<typeof calcule_t>;
}): models.common.ParMois<number> {
	const { t } = props;
	const a = 1 + t / 15;
	return createParMois((mois: models.common.Mois) => {
		const rbth = props.rbth[mois];
		if (rbth > 0 && rbth != 1) return (1 - rbth ** -a) / (1 - rbth ** (-a - 1));
		else if (rbth == 1) return a / (a + 1);
		else return 0;
	});
}

/**
 * @formule refroidissement.rbth
 * @returns Ratio de bilan thermique pour le mois
 */
export function calcule_rbth(props: {
	gv: ReturnType<typeof enveloppe.calcule_gv>;
	as: ReturnType<typeof calcule_as>;
	ai: ReturnType<typeof calcule_ai>;
	cin: ReturnType<typeof calcule_cin>;
	tint: ReturnType<typeof calcule_tint>;
	textmoy: ReturnType<typeof calcule_textmoy>;
	nref: ReturnType<typeof calcule_nref>;
}): models.common.ParMois<number> {
	const { gv, tint } = props;

	return createParMois((mois: models.common.Mois) => {
		const textmoy = props.textmoy[mois];
		const nref = props.nref[mois];
		const as = props.as[mois];
		const ai = props.ai[mois];

		if (textmoy === null) return 0;
		let rbth = gv * (textmoy - tint) * nref;
		rbth = rbth > 0 ? (as + ai) / rbth : 0;
		return rbth >= 0 ? rbth : 0;
	});
}

/**
 * @formule refroidissement.as
 * @returns Apports solaires en Wh/mois
 */
export function calcule_as(props: {
	sse: ReturnType<typeof enveloppe.calcule_sse>;
	e: ReturnType<typeof calcule_e>;
}): models.common.ParMois<number> {
	return createParMois((mois: models.common.Mois) => {
		const sse = props.sse[mois];
		const e = props.e[mois];
		return sse * e * 1000;
	});
}

/**
 * @formule refroidissement.ai
 * @returns Apports internes en Wh/mois
 */
export function calcule_ai(props: {
	sh: ReturnType<typeof batiment.calcule_sh>;
	nadeq: ReturnType<typeof ecs.calcule_nadeq>;
	nref: ReturnType<typeof calcule_nref>;
}): models.common.ParMois<number> {
	const { sh, nadeq } = props;
	return createParMois((mois: models.common.Mois) => {
		const nref = props.nref[mois];
		return ((3.18 + 0.34) * sh + 90 * (132 / 168) * nadeq) * nref;
	});
}

/**
 * @formule refroidissement.e
 * @returns Ensoleillement reçu en période de refroidissement en kWh/m²/mois
 */
export function calcule_e(props: {
	scenario: models.common.Scenario;
	sollicitations: ReturnType<typeof climat.calcule_sollicitations>;
}): models.common.ParMois<number> {
	const { scenario, sollicitations } = props;
	return createParMois((mois: models.common.Mois) => {
		switch (scenario) {
			case models.common.ScenarioEnum.conventionnel:
				return sollicitations[mois].efr28;
			case models.common.ScenarioEnum.depensier:
				return sollicitations[mois].efr26;
		}
	});
}

/**
 * @formule refroidissement.textmoy
 * @returns Température extérieure moyenne en °C
 */
export function calcule_textmoy(props: {
	sollicitations: ReturnType<typeof climat.calcule_sollicitations>;
	scenario: models.common.Scenario;
}): models.common.ParMois<number | null> {
	const { sollicitations, scenario } = props;
	return createParMois((mois: models.common.Mois) => {
		switch (scenario) {
			case models.common.ScenarioEnum.conventionnel:
				return sollicitations[mois].textmoy28;
			case models.common.ScenarioEnum.depensier:
				return sollicitations[mois].textmoy26;
		}
	});
}

/**
 * @formule refroidissement.nref
 * @returns Nombre d'heures de refroidissement en h/mois
 */
export function calcule_nref(props: {
	sollicitations: ReturnType<typeof climat.calcule_sollicitations>;
	scenario: models.common.Scenario;
}): models.common.ParMois<number> {
	const { sollicitations, scenario } = props;
	return createParMois((mois: models.common.Mois) => {
		switch (scenario) {
			case models.common.ScenarioEnum.conventionnel:
				return sollicitations[mois].nref28;
			case models.common.ScenarioEnum.depensier:
				return sollicitations[mois].nref26;
		}
	});
}

/**
 * @formule refroidissement.tint
 * @returns Température de consigne en froid en °C
 */
export function calcule_tint(props: {
	scenario: models.common.Scenario;
}): number {
	const { scenario } = props;
	switch (scenario) {
		case models.common.ScenarioEnum.conventionnel:
			return 28;
		case models.common.ScenarioEnum.depensier:
			return 26;
	}
}

/**
 * @formule refroidissement.t
 * @returns Constante de temps de la zone pour le refroidissement en h
 */
export function calcule_t(props: {
	gv: ReturnType<typeof enveloppe.calcule_gv>;
	cin: ReturnType<typeof calcule_cin>;
}): number {
	const { gv, cin } = props;
	return gv > 0 ? cin / (3600 * gv) : 0;
}

/**
 * @formule refroidissement.cin
 * @returns Capacité thermique intérieure efficace de la zone J/K
 */
export function calcule_cin(props: {
	sh: ReturnType<typeof batiment.calcule_sh>;
	inertie: ReturnType<typeof enveloppe.calcule_inertie>;
}): number {
	const { sh, inertie } = props;

	switch (inertie) {
		case models.enveloppe.common.InertieEnum.legere:
			return 110000 * sh;
		case models.enveloppe.common.InertieEnum.moyenne:
			return 165000 * sh;
		case models.enveloppe.common.InertieEnum.lourde:
			return 260000 * sh;
		case models.enveloppe.common.InertieEnum.tres_lourde:
			return 260000 * sh;
	}
}
